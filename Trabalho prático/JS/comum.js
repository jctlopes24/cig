// ========================================
// FUNÇÕES COMUNS - AlojaMais
// ========================================

// ============ AUTENTICAÇÃO ============

/**
 * Atualiza a navbar baseado no estado de autenticação
 * Mostra/esconde elementos conforme o utilizador está logado
 */
function atualizarNavbar() {
    const currentUserStr = localStorage.getItem('currentUser');
    const navLogin = document.getElementById('navLogin');
    const navRegisto = document.getElementById('navRegisto');
    const navUser = document.getElementById('navUser');
    const userName = document.getElementById('userName');
    
    if (currentUserStr) {
        const currentUser = JSON.parse(currentUserStr);
        navLogin.style.display = 'none';
        navRegisto.style.display = 'none';
        navUser.style.display = 'block';
        userName.textContent = currentUser.nome || 'Utilizador';
        return true; // Retorna true se autenticado
    } else {
        navLogin.style.display = 'block';
        navRegisto.style.display = 'block';
        navUser.style.display = 'none';
        return false; // Retorna false se não autenticado
    }
}

/**
 * Faz logout do utilizador
 * Remove dados da sessão e redireciona para a página inicial
 */
function fazerLogout() {
    localStorage.removeItem('currentUser');
    atualizarNavbar();
    window.location.href = 'index.html';
}

/**
 * Obtém o utilizador atual completo do localStorage
 * @returns {Object|null} Dados completos do utilizador ou null
 */
function getCurrentUser() {
    const currentUserStr = localStorage.getItem('currentUser');
    if (!currentUserStr) return null;

    const currentUser = JSON.parse(currentUserStr);
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    for (let i = 0; i < users.length; i++) {
        if (users[i].email === currentUser.email) {
            return users[i];
        }
    }
    return null;
}

/**
 * Inicializa eventos de autenticação
 * Deve ser chamado no DOMContentLoaded
 */
function inicializarAutenticacao() {
    atualizarNavbar();
    
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            fazerLogout();
        });
    }
}

// ============ DATAS E FORMATAÇÃO ============

/**
 * Formata uma data no formato DD/MM/YYYY
 * @param {string} data - Data no formato YYYY-MM-DD
 * @returns {string} Data formatada
 */
function formatarData(data) {
    const d = new Date(data);
    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const ano = d.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

/**
 * Calcula o número de noites entre duas datas
 * @param {string} checkin - Data de check-in (YYYY-MM-DD)
 * @param {string} checkout - Data de check-out (YYYY-MM-DD)
 * @returns {number} Número de noites
 */
function calcularNoites(checkin, checkout) {
    if (!checkin || !checkout) return 0;
    const dataCheckin = new Date(checkin);
    const dataCheckout = new Date(checkout);
    const diffTime = Math.abs(dataCheckout - dataCheckin);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

/**
 * Define a data mínima para inputs de data
 * @param {string} inputId - ID do input
 * @param {Date} minDate - Data mínima (opcional, padrão: hoje)
 */
function definirDataMinima(inputId, minDate = new Date()) {
    const input = document.getElementById(inputId);
    if (input) {
        input.min = minDate.toISOString().split('T')[0];
    }
}

// ============ VALIDAÇÕES ============

/**
 * Valida se as datas de check-in e check-out são válidas
 * @param {string} checkin - Data de check-in
 * @param {string} checkout - Data de check-out
 * @returns {Object} {valido: boolean, mensagem: string}
 */
function validarDatas(checkin, checkout) {
    if (!checkin || !checkout) {
        return {
            valido: false,
            mensagem: 'Por favor, selecione as datas de check-in e check-out.'
        };
    }

    const dataCheckin = new Date(checkin);
    const dataCheckout = new Date(checkout);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    if (dataCheckin < hoje) {
        return {
            valido: false,
            mensagem: 'A data de check-in não pode ser no passado.'
        };
    }

    if (dataCheckout <= dataCheckin) {
        return {
            valido: false,
            mensagem: 'A data de check-out deve ser posterior à data de check-in.'
        };
    }

    return { valido: true, mensagem: '' };
}

// ============ ALERTAS E NOTIFICAÇÕES ============

/**
 * Mostra um alerta na página
 * @param {string} message - Mensagem a exibir
 * @param {string} type - Tipo do alerta (success, danger, warning, info)
 */
function showAlert(message, type = 'danger') {
    const alertDiv = document.getElementById('alertMessage');
    if (!alertDiv) {
        alert(message);
        return;
    }
    
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    alertDiv.classList.remove('d-none');
    
    // Scroll suave para o alerta
    alertDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Remover após 5 segundos
    setTimeout(() => {
        alertDiv.classList.add('d-none');
    }, 5000);
}

/**
 * Mostra um alerta simples (fallback)
 * @param {string} mensagem - Mensagem a exibir
 */
function mostrarAlerta(mensagem) {
    alert(mensagem);
}

// ============ PERFIL E HISTÓRICO ============

/**
 * Adiciona uma pesquisa ao histórico do utilizador
 * @param {Object} criterios - Critérios da pesquisa
 */
function adicionarPesquisaAoHistorico(criterios) {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    for (let i = 0; i < users.length; i++) {
        if (users[i].email === currentUser.email) {
            // Garantir que o perfil existe
            if (!users[i].perfil) {
                users[i].perfil = { historicoPesquisas: [], historicoReservas: [] };
            }
            if (!users[i].perfil.historicoPesquisas) {
                users[i].perfil.historicoPesquisas = [];
            }
            
            // Adicionar pesquisa
            users[i].perfil.historicoPesquisas.push({
                ...criterios,
                data: new Date().toISOString()
            });
            
            // Limitar a 20 pesquisas
            if (users[i].perfil.historicoPesquisas.length > 20) {
                users[i].perfil.historicoPesquisas.shift();
            }
            
            localStorage.setItem('users', JSON.stringify(users));
            break;
        }
    }
}

/**
 * Adiciona uma reserva ao histórico do utilizador
 * @param {Object} reserva - Dados da reserva
 */
function adicionarReservaAoHistorico(reserva) {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

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

// ============ UTILIDADES ============

/**
 * Obtém parâmetros da URL
 * @param {string} param - Nome do parâmetro
 * @returns {string|null} Valor do parâmetro
 */
function getURLParam(param) {
    const params = new URLSearchParams(window.location.search);
    return params.get(param);
}

/**
 * Redireciona para uma página
 * @param {string} url - URL de destino
 * @param {number} delay - Delay em milissegundos (opcional)
 */
function redirecionar(url, delay = 0) {
    if (delay > 0) {
        setTimeout(() => {
            window.location.href = url;
        }, delay);
    } else {
        window.location.href = url;
    }
}

// ============ INICIALIZAÇÃO AUTOMÁTICA ============

// Executar quando o DOM estiver carregado (se não for sobrescrito)
if (typeof inicializarPaginaEspecifica === 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
        inicializarAutenticacao();
    });
}