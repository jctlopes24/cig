
// Função para determinar status da reserva
function getStatusReserva(checkin, checkout) {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const dataCheckin = new Date(checkin);
    const dataCheckout = new Date(checkout);
    dataCheckin.setHours(0, 0, 0, 0);
    dataCheckout.setHours(0, 0, 0, 0);

    if (hoje < dataCheckin) {
        return { texto: 'Futura', classe: 'bg-info', icone: 'calendar-event' };
    } else if (hoje >= dataCheckin && hoje <= dataCheckout) {
        return { texto: 'Ativa', classe: 'bg-success', icone: 'door-open' };
    } else {
        return { texto: 'Concluída', classe: 'bg-secondary', icone: 'check-circle' };
    }
}

// Função para formatar data
function formatarData(data) {
    const d = new Date(data);
    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const ano = d.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

// Função para calcular noites
function calcularNoites(checkin, checkout) {
    const data1 = new Date(checkin);
    const data2 = new Date(checkout);
    const noites = Math.ceil((data2 - data1) / (1000 * 60 * 60 * 24));
    return noites;
}

// Função para criar card de reserva
function criarCardReserva(reserva) {
    const status = getStatusReserva(reserva.checkin, reserva.checkout);
    const noites = calcularNoites(reserva.checkin, reserva.checkout);
    
    return `
        <div class="col-md-6 mb-4">
            <div class="card reservation-card h-100">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <h5 class="card-title mb-0">${reserva.hotelNome}</h5>
                        <span class="badge ${status.classe} status-badge">
                            <i class="bi bi-${status.icone} me-1"></i>${status.texto}
                        </span>
                    </div>
                    
                    <p class="text-muted small mb-3">
                        <i class="bi bi-door-closed me-2"></i>${reserva.quarto}
                    </p>
                    
                    <div class="row g-2 mb-3">
                        <div class="col-6">
                            <small class="text-muted d-block">Check-in</small>
                            <strong>${formatarData(reserva.checkin)}</strong>
                        </div>
                        <div class="col-6">
                            <small class="text-muted d-block">Check-out</small>
                            <strong>${formatarData(reserva.checkout)}</strong>
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <small class="text-muted">Duração</small><br>
                        <strong>${noites} noite${noites > 1 ? 's' : ''}</strong>
                    </div>
                    
                    <div class="mb-3">
                        <small class="text-muted">Total pago</small><br>
                        <strong class="text-primary h5">${reserva.total}</strong>
                    </div>
                    
                    <div class="d-grid gap-2">
                        </button>
                        ${status.texto === 'Futura' ? `
                        <button class="btn btn-outline-danger btn-sm" onclick="cancelarReserva(${reserva.id})">
                            <i class="bi bi-x-circle me-2"></i>Cancelar Reserva
                        </button>
                        ` : ''}
                    </div>
                </div>
                <div class="card-footer bg-white border-top-0">
                    <small class="text-muted">
                        <i class="bi bi-calendar-plus me-1"></i>
                        Reservado em ${formatarData(reserva.dataReserva)}
                    </small>
                </div>
            </div>
        </div>
    `;
}

// Função para carregar reservas
function carregarReservas() {
    const currentUserStr = localStorage.getItem('currentUser');
    if (!currentUserStr) {
        document.getElementById('alertNaoAutenticado').classList.remove('d-none');
        document.getElementById('filtrosSection').style.display = 'none';
        document.getElementById('emptyState').classList.add('d-none');
        return;
    }

    const currentUser = JSON.parse(currentUserStr);
    const reservas = JSON.parse(localStorage.getItem('reservas') || '[]');
    
    // Filtrar reservas do usuário atual
    const minhasReservas = reservas.filter(r => r.email === currentUser.email);
    
    if (minhasReservas.length === 0) {
        document.getElementById('emptyState').classList.remove('d-none');
        document.getElementById('filtrosSection').style.display = 'none';
        return;
    }

    document.getElementById('filtrosSection').style.display = 'block';
    aplicarFiltros(minhasReservas);
}

// Função para aplicar filtros
function aplicarFiltros(reservas = null) {
    if (!reservas) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const todasReservas = JSON.parse(localStorage.getItem('reservas') || '[]');
        reservas = todasReservas.filter(r => r.email === currentUser.email);
    }

    const filtroStatus = document.getElementById('filtroStatus').value;
    const ordenacao = document.getElementById('ordenacao').value;
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    // Aplicar filtro de status
    let reservasFiltradas = reservas.filter(r => {
        if (filtroStatus === 'todas') return true;
        
        const checkin = new Date(r.checkin);
        const checkout = new Date(r.checkout);
        checkin.setHours(0, 0, 0, 0);
        checkout.setHours(0, 0, 0, 0);

        if (filtroStatus === 'futuras') return hoje < checkin;
        if (filtroStatus === 'ativas') return hoje >= checkin && hoje <= checkout;
        if (filtroStatus === 'passadas') return hoje > checkout;
        return true;
    });

    // Aplicar ordenação
    reservasFiltradas.sort((a, b) => {
        if (ordenacao === 'recente') {
            return new Date(b.dataReserva) - new Date(a.dataReserva);
        } else if (ordenacao === 'antiga') {
            return new Date(a.dataReserva) - new Date(b.dataReserva);
        } else if (ordenacao === 'checkin') {
            return new Date(a.checkin) - new Date(b.checkin);
        }
        return 0;
    });

    // Exibir reservas
    const container = document.getElementById('reservasContainer');
    if (reservasFiltradas.length === 0) {
        container.innerHTML = '<div class="col-12"><div class="alert alert-info">Nenhuma reserva encontrada com os filtros aplicados.</div></div>';
    } else {
        container.innerHTML = reservasFiltradas.map(r => criarCardReserva(r)).join('');
    }
}

// Função para ver detalhes
function verDetalhes(reservaId) {
    const reservas = JSON.parse(localStorage.getItem('reservas') || '[]');
    const reserva = reservas.find(r => r.id === reservaId);
    
    if (!reserva) return;

    const status = getStatusReserva(reserva.checkin, reserva.checkout);
    const noites = calcularNoites(reserva.checkin, reserva.checkout);

    document.getElementById('detalhesModalBody').innerHTML = html;
    new bootstrap.Modal(document.getElementById('detalhesModal')).show();
}

// Função para cancelar reserva
function cancelarReserva(reservaId) {
    if (!confirm('Tem certeza que deseja cancelar esta reserva?')) return;

    let reservas = JSON.parse(localStorage.getItem('reservas') || '[]');
    reservas = reservas.filter(r => r.id !== reservaId);
    localStorage.setItem('reservas', JSON.stringify(reservas));

    alert('Reserva cancelada com sucesso!');
    carregarReservas();
}

// Executar quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    const isAutenticado = atualizarNavbar();
    
    if (!isAutenticado) {
        document.getElementById('alertNaoAutenticado').classList.remove('d-none');
        return;
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            fazerLogout();
        });
    }

    document.getElementById('btnAplicarFiltros').addEventListener('click', () => aplicarFiltros());

    carregarReservas();
});
