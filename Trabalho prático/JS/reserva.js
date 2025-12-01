// Hotéis disponíveis
const hoteis = {
    "Portocal": {
        nome: "Portocal",
        localizacao: "Porto, Portugal",
        estrelas: "★★★★☆",
        imagem: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
        quartos: [
            { nome: "Single", preco: 75 },
            { nome: "Double", preco: 120 },
            { nome: "Twin", preco: 110 }
        ]
    },
    "pousada-centro": {
        nome: "Pousada do Centro",
        localizacao: "Lisboa, Portugal",
        estrelas: "★★★☆☆",
        imagem: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800",
        quartos: [
           { nome: "Single", preco: 75 },
            { nome: "Double", preco: 120 },
            { nome: "Twin", preco: 110 }
        ]
    },
    "algarve-sol": {
        nome: "Resort Algarve Sol",
        localizacao: "Algarve, Portugal",
        estrelas: "★★★★★",
        imagem: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
        quartos: [
          { nome: "Single", preco: 75 },
            { nome: "Double", preco: 120 },
            { nome: "Twin", preco: 110 }
        ]
    },
    "hotel-geres": {
        nome: "Hotel Gerês",
        localizacao: " Gerês, Portugal",
        estrelas: "★★★★★",
        imagem: "https://images.unsplash.com/photo-1606402179428-a57976d71fa4?w=800",
        quartos: [
            { nome: "Single", preco: 75 },
            { nome: "Double", preco: 120 },
            { nome: "Twin", preco: 110 }
        ]
    }
};


// Mostrar alerta
function mostrarAlerta(mensagem) {
    alert(mensagem);
}

// Calcular noites
function calcularNoites() {
    const checkin = document.getElementById('checkin').value;
    const checkout = document.getElementById('checkout').value;

    if (!checkin || !checkout) return 0;

    const data1 = new Date(checkin);
    const data2 = new Date(checkout);
    const noites = Math.ceil((data2 - data1) / (1000 * 60 * 60 * 24));

    return noites;
}

// Atualizar preços
function atualizarPrecos() {
    const quarto = document.getElementById('tipoQuarto').value;

    if (!quarto) {
        document.getElementById('precoNoite').textContent = '€0';
        document.getElementById('numeroNoites').textContent = '0';
        document.getElementById('subtotal').textContent = '€0';
        document.getElementById('taxaServico').textContent = '€0';
        document.getElementById('total').textContent = '€0';
        return;
    }

    const preco = parseFloat(quarto.split('€')[1]);
    const noites = calcularNoites();
    const subtotal = preco * noites;
    const taxaServico = subtotal * 0.1; // 10% de taxa de serviço
    const total = subtotal + taxaServico;

    document.getElementById('precoNoite').textContent = '€' + preco;
    document.getElementById('numeroNoites').textContent = noites;
    document.getElementById('subtotal').textContent = '€' + subtotal.toFixed(2);
    document.getElementById('taxaServico').textContent = '€' + taxaServico.toFixed(2);
    document.getElementById('total').textContent = '€' + total.toFixed(2);
}

// Carregar hotel
function carregarHotel() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id') || 'vista-mar';
    const hotel = hoteis[id];

    if (!hotel) {
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('alojamentoNome').textContent = hotel.nome;
    document.getElementById('alojamentoLocalizacao').textContent = hotel.localizacao;
    document.getElementById('alojamentoRating').innerHTML = hotel.estrelas;
    document.getElementById('alojamentoImagem').src = hotel.imagem;

    // Atualizar breadcrumb
    const breadcrumbDetalhe = document.getElementById('breadcrumbDetalhe');
    if (breadcrumbDetalhe) {
        breadcrumbDetalhe.textContent = hotel.nome;
        breadcrumbDetalhe.href = 'detalhe.html?id=' + id;
    }

    // Adicionar quartos
    const select = document.getElementById('tipoQuarto');
    select.innerHTML = '<option value="">Selecione um quarto</option>';

    hotel.quartos.forEach(q => {
        const option = document.createElement('option');
        option.value = q.nome + ' - €' + q.preco;
        option.textContent = q.nome + ' - €' + q.preco + '/noite';
        select.appendChild(option);
    });

    // Pré-preencher dados se houver reservaData
    const reservaDataStr = localStorage.getItem('reservaData');
    if (reservaDataStr) {
        const reservaData = JSON.parse(reservaDataStr);

        if (reservaData.checkin) {
            document.getElementById('checkin').value = reservaData.checkin;
        }
        if (reservaData.checkout) {
            document.getElementById('checkout').value = reservaData.checkout;
        }
        if (reservaData.hospedes) {
            document.getElementById('hospedes').value = reservaData.hospedes;
        }
        if (reservaData.tipoQuarto) {
            document.getElementById('tipoQuarto').value = reservaData.tipoQuarto;
        }

        // Limpar dados temporários
        localStorage.removeItem('reservaData');

        // Atualizar preços
        atualizarPrecos();
    }

    // Pré-preencher dados do user se estiver logado
    const currentUserStr = localStorage.getItem('currentUser');
    if (currentUserStr) {
        const currentUser = JSON.parse(currentUserStr);
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === currentUser.email);

        if (user) {
            document.getElementById('nomeHospede').value = user.nomeCompleto || (user.nome + ' ' + user.apelido);
            document.getElementById('emailHospede').value = user.email;
            document.getElementById('telefoneHospede').value = user.telefone || '';
        }
    }
}

// Confirmar reserva
function confirmarReserva() {
    const checkin = document.getElementById('checkin').value;
    const checkout = document.getElementById('checkout').value;
    const hospedes = document.getElementById('hospedes').value;
    const quarto = document.getElementById('tipoQuarto').value;
    const nome = document.getElementById('nomeHospede').value;
    const email = document.getElementById('emailHospede').value;
    const telefone = document.getElementById('telefoneHospede').value;
    const aceitarTermos = document.getElementById('aceitarTermos').checked;

    if (!checkin || !checkout || !hospedes || !quarto || !nome || !email || !telefone) {
        mostrarAlerta('Por favor, preencha todos os campos obrigatórios!');
        return;
    }

    if (!aceitarTermos) {
        mostrarAlerta('Você deve aceitar os termos e condições para continuar.');
        return;
    }

    // Validar datas
    const dataCheckin = new Date(checkin);
    const dataCheckout = new Date(checkout);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    if (dataCheckin < hoje) {
        mostrarAlerta('A data de check-in não pode ser no passado.');
        return;
    }

    if (dataCheckout <= dataCheckin) {
        mostrarAlerta('A data de check-out deve ser posterior à data de check-in.');
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const hotelId = params.get('id') || 'vista-mar';
    const hotel = hoteis[hotelId];

    const reserva = {
        id: Date.now(),
        hotelId: hotelId,
        hotelNome: hotel.nome,
        checkin: checkin,
        checkout: checkout,
        hospedes: hospedes,
        quarto: quarto,
        nome: nome,
        email: email,
        telefone: telefone,
        pedidosEspeciais: document.getElementById('pedidosEspeciais').value,
        total: document.getElementById('total').textContent,
        dataReserva: new Date().toISOString()
    };

    // Guardar reserva
    const reservas = JSON.parse(localStorage.getItem('reservas') || '[]');
    reservas.push(reserva);
    localStorage.setItem('reservas', JSON.stringify(reservas));

    // Atualizar histórico do user se estiver logado
    const currentUserStr = localStorage.getItem('currentUser');
    if (currentUserStr) {
        const currentUser = JSON.parse(currentUserStr);
        const users = JSON.parse(localStorage.getItem('users') || '[]');

        for (let i = 0; i < users.length; i++) {
            if (users[i].email === currentUser.email) {
                if (!users[i].perfil) {
                    users[i].perfil = { historicoReservas: [] };
                }
                if (!users[i].perfil.historicoReservas) {
                    users[i].perfil.historicoReservas = [];
                }

                users[i].perfil.historicoReservas.push(reserva);
                localStorage.setItem('users', JSON.stringify(users));
                break;
            }
        }
    }

    mostrarAlerta('Reserva confirmada com sucesso!');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// Executar quando a página carregar
document.addEventListener('DOMContentLoaded', function () {
    // Atualizar navbar
    atualizarNavbar();

    // Configurar evento de logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function (e) {
            e.preventDefault();
            fazerLogout();
        });
    }

    // Carregar dados do hotel
    carregarHotel();

    // Configurar data mínima
    const hoje = new Date().toISOString().split('T')[0];
    const checkinInput = document.getElementById('checkin');
    const checkoutInput = document.getElementById('checkout');

    checkinInput.min = hoje;
    checkoutInput.min = hoje;

    // Event listeners
    checkinInput.addEventListener('change', function () {
        if (this.value) {
            const dataCheckin = new Date(this.value);
            dataCheckin.setDate(dataCheckin.getDate() + 1);
            checkoutInput.min = dataCheckin.toISOString().split('T')[0];
        }
        atualizarPrecos();
    });

    checkoutInput.addEventListener('change', atualizarPrecos);
    document.getElementById('tipoQuarto').addEventListener('change', atualizarPrecos);
    document.getElementById('btnConfirmarReserva').addEventListener('click', confirmarReserva);
});