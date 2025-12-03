
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
            
            // Obter users do localStorage
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            
            // Verificar se o email já existe
            if (users.some(u => u.email === email)) {
                showAlert('Este email já está registado. Tente fazer login ou use outro email.');
                return;
            }
            
            // Criar novo user com perfil
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
            
            // Adicionar à lista de users
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            
            // Guardar user atual
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
