
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
        });
    