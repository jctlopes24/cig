
        // Dados dos hotéis
        var hoteis = {
            "vista-mar": {
                nome: "Hotel Vista Mar",
                tipo: "Hotel",
                localizacao: "Porto, Portugal",
                estrelas: "★★★★☆",
                rating: "4.5/5 (245 avaliações)",
                descricao: `O Hotel Vista Mar oferece uma experiência única com vista privilegiada para o oceano Atlântico.
                        Localizado no coração do Porto, a poucos minutos das principais atrações turísticas, o hotel
                        combina conforto moderno com hospitalidade tradicional portuguesa.
      `,
                comodidades: [
                    "Wi-Fi gratuito", "Piscina exterior", "Estacionamento gratuito",
                    "Ar-condicionado", "Pequeno-almoço incluído", "Spa e centro de bem-estar",
                    "Ginásio", "Restaurante"
                ],
                imagens: [
                    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
                    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400",
                    "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=400",
                    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400"
                ]
            },
            "pousada-centro": {
                nome: "Pousada do Centro",
                tipo: "Pousada",
                localizacao: "Lisboa, Portugal",
                estrelas: "★★★☆☆",
                rating: "4.3/5 (195 avaliações)",
                descricao: `
        A Pousada do Centro está localizada no coração de Lisboa, oferecendo uma experiência única no centro histórico da cidade.
        Perfeita para turistas que querem explorar as principais atrações a pé, como o Castelo de São Jorge, a Baixa Pombalina e o Bairro Alto.
        O alojamento combina charme tradicional com comodidades modernas, incluindo Wi-Fi gratuito em todas as áreas.
      `,
                comodidades: [
                    "Wi-Fi gratuito", "Ar-condicionado", "Estacionamento próximo",
                    "Pequeno-almoço disponível", "Recepção 24h", "Localização central"
                ],
                imagens: [
                    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800",
                    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400",
                    "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=400",
                    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400"
                ]
            },
            "algarve-sol": {
                nome: "Resort Algarve Sol",
                tipo: "Resort",
                localizacao: "Algarve, Portugal",
                estrelas: "★★★★★",
                rating: "4.7/5 (310 avaliações)",
                descricao: `
    O Resort Algarve Sol é um verdadeiro paraíso à beira-mar, localizado no coração do Algarve, uma das regiões mais ensolaradas de Portugal.
    Rodeado por praias de areia dourada e jardins tropicais, o resort combina luxo, conforto e tranquilidade num só espaço.
  `,
                comodidades: [
                    "Wi-Fi gratuito",
                    "Piscinas exteriores e interiores",
                    "Spa com circuito termal e massagens",
                    "Restaurante gourmet e bar à beira da piscina",
                    "Centro de fitness",
                    "Estacionamento gratuito",
                    "Serviço de quartos 24h",
                    "Atividades para crianças",
                    "Acesso direto à praia",
                    "Pequeno-almoço incluído"
                ],
                imagens: [
                    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
                    "https://images.unsplash.com/photo-1604014237800-1c9102c219da?w=400",
                    "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400",
                    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400"
                ]
            },


        };

        // Lê o parâmetro "id" da URL
        var params = new URLSearchParams(window.location.search);
        var id = params.get("id");
        var hotel = hoteis[id];

        // Se o hotel existir, atualiza o conteúdo
        if (hotel) {
            document.title = hotel.nome + ' - Detalhes';
            document.querySelector("h1.h2").textContent = hotel.nome;
            document.querySelector(".badge.bg-primary").textContent = hotel.tipo || "Hotel";
            document.querySelector(".ms-2").textContent = hotel.localizacao;
            document.querySelector(".rating span.text-warning").textContent = hotel.estrelas;
            document.querySelector(".rating + .small.text-muted").textContent = hotel.rating;

            // Atualizar galeria
            var imgs = document.querySelectorAll(".gallery-photo, .main-photo");
            for (var i = 0; i < imgs.length; i++) {
                if (hotel.imagens[i]) {
                    imgs[i].src = hotel.imagens[i];
                }
            }

            // Atualizar descrição
            var descricaoSection = document.querySelector("section:nth-of-type(1) p");
            descricaoSection.innerHTML = hotel.descricao;

            // Atualizar comodidades
            var comodidadesContainer = document.querySelector("section:nth-of-type(2) .row");
            var htmlComodidades = '';
            for (var i = 0; i < hotel.comodidades.length; i++) {
                htmlComodidades += '<div class="col-md-6"><div class="amenity-item"><i class="bi bi-check-circle-fill text-success me-2"></i>' + hotel.comodidades[i] + '</div></div>';
            }
            comodidadesContainer.innerHTML = htmlComodidades;
        } else {
            document.querySelector(".container.my-4").innerHTML = `
      <div class="text-center my-5">
        <h2>Hotel não encontrado </h2>
        <a href="index.html" class="btn btn-primary mt-3">Voltar</a>
      </div>
    `;
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

        // Função para redirecionar para página de reserva
        function redirecionarParaReserva(dadosReserva) {
            // Salvar dados no localStorage
            localStorage.setItem('reservaData', JSON.stringify(dadosReserva));
            // Redirecionar para página de reserva
            window.location.href = 'reserva.html?id=' + id;
        }

        // Função para calcular número de noites
        function calcularNoites(checkin, checkout) {
            if (!checkin || !checkout) return 0;
            const dataCheckin = new Date(checkin);
            const dataCheckout = new Date(checkout);
            const diffTime = Math.abs(dataCheckout - dataCheckin);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays;
        }

        // Executar quando a página carregar
        document.addEventListener('DOMContentLoaded', function() {
            atualizarNavbar();
            
            const logoutBtn = document.getElementById('logoutBtn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    fazerLogout();
                });
            }

            // Event listeners para botões de reserva dos quartos
            const botoesReservar = document.querySelectorAll('.btn-reservar');
            botoesReservar.forEach(function(botao) {
                botao.addEventListener('click', function(e) {
                    e.preventDefault();
                    const quartoNome = this.getAttribute('data-quarto');
                    const quartoPreco = this.getAttribute('data-preco');
                    
                    if (!id) {
                        alert('Erro: ID do hotel não encontrado.');
                        return;
                    }
                    
                    redirecionarParaReserva({
                        hotelId: id,
                        tipoQuarto: quartoNome + ' - €' + quartoPreco,
                        preco: quartoPreco
                    });
                });
            });

            // Event listeners para formulário da sidebar
            const sidebarForm = document.getElementById('sidebarReservaForm');
            if (sidebarForm) {
                // Definir data mínima
                const hoje = new Date().toISOString().split('T')[0];
                const sidebarCheckin = document.getElementById('sidebarCheckin');
                const sidebarCheckout = document.getElementById('sidebarCheckout');
                
                if (sidebarCheckin) {
                    sidebarCheckin.min = hoje;
                    sidebarCheckin.addEventListener('change', function() {
                        if (this.value) {
                            const dataCheckin = new Date(this.value);
                            dataCheckin.setDate(dataCheckin.getDate() + 1);
                            if (sidebarCheckout) {
                                sidebarCheckout.min = dataCheckin.toISOString().split('T')[0];
                            }
                        }
                        atualizarResumoSidebar();
                    });
                }
                
                if (sidebarCheckout) {
                    sidebarCheckout.min = hoje;
                    sidebarCheckout.addEventListener('change', atualizarResumoSidebar);
                }
                
                const sidebarTipoQuarto = document.getElementById('sidebarTipoQuarto');
                if (sidebarTipoQuarto) {
                    sidebarTipoQuarto.addEventListener('change', atualizarResumoSidebar);
                }
                
                const sidebarHospedes = document.getElementById('sidebarHospedes');
                if (sidebarHospedes) {
                    sidebarHospedes.addEventListener('change', atualizarResumoSidebar);
                }

                // Submeter formulário
                sidebarForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    
                    const checkin = sidebarCheckin?.value;
                    const checkout = sidebarCheckout?.value;
                    const hospedes = sidebarHospedes?.value;
                    const tipoQuarto = sidebarTipoQuarto?.value;
                    
                    if (!checkin || !checkout) {
                        alert('Por favor, selecione as datas de check-in e check-out.');
                        return;
                    }
                    
                    if (!hospedes) {
                        alert('Por favor, selecione o número de hóspedes.');
                        return;
                    }
                    
                    if (!tipoQuarto) {
                        alert('Por favor, selecione um tipo de quarto.');
                        return;
                    }
                    
                    redirecionarParaReserva({
                        hotelId: id,
                        checkin: checkin,
                        checkout: checkout,
                        hospedes: hospedes,
                        tipoQuarto: tipoQuarto
                    });
                });
            }
        });
    