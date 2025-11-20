
        // Função para mostrar mensagem
        function showAlert(message, type = 'danger') {
            const alertDiv = document.getElementById('alertMessage');
            alertDiv.className = `alert alert-${type}`;
            alertDiv.textContent = message;
            alertDiv.classList.remove('d-none');
            
            // Scroll para o topo do formulário
            alertDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
            // Remover após 5 segundos
            setTimeout(() => {
                alertDiv.classList.add('d-none');
            }, 5000);
        }

        // Validação em tempo real da confirmação de palavra-passe
        document.getElementById('confirmPassword').addEventListener('input', function() {
            const password = document.getElementById('password').value;
            const confirmPassword = this.value;
            
            if (confirmPassword && password !== confirmPassword) {
                this.setCustomValidity('As palavras-passe não coincidem');
            } else {
                this.setCustomValidity('');
            }
        });

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

        // Processar formulário de registo
        document.getElementById('registoForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nome = document.getElementById('nome').value;
            const apelido = document.getElementById('apelido').value;
            const email = document.getElementById('email').value;
            const telefone = document.getElementById('telefone').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // Validações
            if (password.length < 6) {
                showAlert('A palavra-passe deve ter pelo menos 6 caracteres.');
                return;
            }
            
            if (password !== confirmPassword) {
                showAlert('As palavras-passe não coincidem.');
                return;
            }
            
            // Obter utilizadores do localStorage
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            
            // Verificar se o email já existe
            if (users.some(u => u.email === email)) {
                showAlert('Este email já está registado. Tente fazer login ou use outro email.');
                return;
            }
            
            // Criar novo utilizador com perfil
            const newUser = {
                nome: nome,
                apelido: apelido,
                nomeCompleto: `${nome} ${apelido}`,
                email: email,
                telefone: telefone,
                password: password,
                perfil: {
                    preferencias: {
                        tipoAlojamento: null, // Será atualizado com base no histórico
                        cidadePreferida: null,
                        precoMaximo: null
                    },
                    historicoPesquisas: [],
                    historicoReservas: []
                }
            };
            
            // Adicionar à lista de utilizadores
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            
            // Guardar utilizador atual
            localStorage.setItem('currentUser', JSON.stringify({
                email: newUser.email,
                nome: newUser.nomeCompleto
            }));
            
            showAlert('Conta criada com sucesso! A redirecionar...', 'success');
            
            // Redirecionar após 1 segundo
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        });
