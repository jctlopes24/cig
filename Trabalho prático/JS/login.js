
// Função para mostrar mensagem
function showAlert(message, type = 'danger') {
    const alertDiv = document.getElementById('alertMessage');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    alertDiv.classList.remove('d-none');
    
    // Remover após 5 segundos
    setTimeout(() => {
        alertDiv.classList.add('d-none');
    }, 5000);
}

// Função para atualizar navbar baseado no estado de autenticação
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
    } else {
        navLogin.style.display = 'block';
        navRegisto.style.display = 'block';
        navUser.style.display = 'none';
    }
}

// Função de logout
function fazerLogout() {
    localStorage.removeItem('currentUser');
    atualizarNavbar();
    window.location.href = 'index.html';
}

// Atualizar navbar ao carregar
document.addEventListener('DOMContentLoaded', function() {
    atualizarNavbar();
    
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            fazerLogout();
        });
    }
});

// Processar formulário de login
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Obter utilizadores do localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Procurar utilizador
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Garantir que o utilizador tem perfil
        if (!user.perfil) {
            user.perfil = {
                preferencias: {
                    tipoAlojamento: null,
                    cidadePreferida: null,
                    precoMaximo: null
                },
                historicoPesquisas: [],
                historicoReservas: []
            };
            // Atualizar no localStorage
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const userIndex = users.findIndex(u => u.email === user.email);
            if (userIndex !== -1) {
                users[userIndex] = user;
                localStorage.setItem('users', JSON.stringify(users));
            }
        }
        
        // Login bem-sucedido
        localStorage.setItem('currentUser', JSON.stringify({
            email: user.email,
            nome: user.nomeCompleto || user.nome
        }));
        
        showAlert('Login realizado com sucesso! A redirecionar...', 'success');
        
        // Redirecionar após 1 segundo
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    } else {
        showAlert('Email ou palavra-passe incorretos. Tente novamente.');
    }
});
