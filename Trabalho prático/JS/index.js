// Função para obter utilizador atual
function getCurrentUser() {
    var currentUserStr = localStorage.getItem('currentUser');
    if (!currentUserStr) return null;

    var currentUser = JSON.parse(currentUserStr);
    var users = JSON.parse(localStorage.getItem('users') || '[]');

    for (var i = 0; i < users.length; i++) {
        if (users[i].email === currentUser.email) {
            return users[i];
        }
    }
    return null;
}

// Função para gerar recomendações baseadas no histórico de pesquisas
function gerarRecomendacoes(user) {
    if (!user || !user.perfil || !user.perfil.historicoPesquisas) return [];

    var historico = user.perfil.historicoPesquisas;
    if (historico.length === 0) return [];

    // Converter objeto hoteis para array
    var hoteisArray = [];
    for (var key in hoteis) {
        if (hoteis.hasOwnProperty(key)) {
            hoteisArray.push({
                id: key,
                nome: hoteis[key].nome,
                localizacao: hoteis[key].localizacao,
                tipo: hoteis[key].tipo,
                descricao: hoteis[key].descricao,
                imagem: hoteis[key].imagens[0],
                preco: 96 // Preço promocional
            });
        }
    }

    // Contar quantas vezes cada hotel foi pesquisado
    var contagem = {};

    for (var i = 0; i < historico.length; i++) {
        var pesquisa = historico[i];
        if (!pesquisa.destino) continue;

        var destino = pesquisa.destino.toLowerCase();
        for (var j = 0; j < hoteisArray.length; j++) {
            var hotel = hoteisArray[j];
            var nome = hotel.nome.toLowerCase();
            var localizacao = hotel.localizacao.toLowerCase();

            if (nome.indexOf(destino) !== -1 || localizacao.indexOf(destino) !== -1) {
                if (!contagem[hotel.id]) {
                    contagem[hotel.id] = { hotel: hotel, vezes: 0 };
                }
                contagem[hotel.id].vezes++;
            }
        }
    }

    // Converter para array e ordenar
    var lista = [];
    for (var id in contagem) {
        lista.push(contagem[id]);
    }

    // Ordenar por número de pesquisas
    for (var i = 0; i < lista.length - 1; i++) {
        for (var j = i + 1; j < lista.length; j++) {
            if (lista[i].vezes < lista[j].vezes) {
                var temp = lista[i];
                lista[i] = lista[j];
                lista[j] = temp;
            }
        }
    }

    // Retornar até 3 mais pesquisados
    var resultado = [];
    for (var i = 0; i < Math.min(3, lista.length); i++) {
        resultado.push(lista[i].hotel);
    }
    return resultado;
}

// Função para exibir recomendações
function exibirRecomendacoes() {
    var user = getCurrentUser();
    var secao = document.getElementById('recomendacoesSection');
    var container = document.getElementById('recomendacoesContainer');

    if (!user) {
        secao.style.display = 'none';
        return;
    }

    var recomendacoes = gerarRecomendacoes(user);
    if (recomendacoes.length === 0) {
        secao.style.display = 'none';
        return;
    }

    secao.style.display = 'block';
    var html = '';
    for (var i = 0; i < recomendacoes.length; i++) {
        var h = recomendacoes[i];
        html += '<div class="col-md-4"><div class="card h-100 card-hover">' +
            '<img src="' + h.imagem + '" class="card-img-top" alt="' + h.nome + '">' +
            '<div class="card-body"><div class="d-flex justify-content-between align-items-start mb-2">' +
            '<h5 class="card-title mb-0">' + h.nome + '</h5></div>' +
            '<p class="text-muted small mb-2">' + h.localizacao + '</p>' +
            '<p class="card-text small">' + h.descricao + '</p>' +
            '<div class="d-flex justify-content-between align-items-center mt-3">' +
            '<div><span class="h5 mb-0">€' + h.preco + '</span><small class="text-muted">/noite</small></div>' +
            '<a href="detalhe.html?id=' + h.id + '" class="btn btn-primary">Ver Detalhes</a></div></div></div></div>';
    }
    container.innerHTML = html;
}

// Executar quando a página carregar
document.addEventListener('DOMContentLoaded', function () {
    atualizarNavbar();
    exibirRecomendacoes();

    // Adicionar evento ao botão de logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function (e) {
            e.preventDefault();
            fazerLogout();
        });
    }
});

// Validação de datas
function validarDatas() {
    const checkin = document.getElementById('checkin').value;
    const checkout = document.getElementById('checkout').value;

    if (checkin && checkout) {
        const dataCheckin = new Date(checkin);
        const dataCheckout = new Date(checkout);
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        if (dataCheckin < hoje) {
            alert('A data de check-in não pode ser anterior à atual.');
            return false;
        }

        if (dataCheckout <= dataCheckin) {
            alert('A data de check-out deve ser posterior à data de check-in.');
            return false;
        }
    }

    return true;
}

// Validar check-out quando check-in mudar
document.getElementById('checkin').addEventListener('change', function () {
    const checkin = this.value;
    const checkout = document.getElementById('checkout');

    if (checkin && checkout.value) {
        if (new Date(checkout.value) <= new Date(checkin)) {
            checkout.value = '';
        }
    }

    // Definir data mínima do check-out como check-in + 1 dia
    if (checkin) {
        const minDate = new Date(checkin);
        minDate.setDate(minDate.getDate() + 1);
        checkout.min = minDate.toISOString().split('T')[0];
    }
});

// Definir data mínima do check-in como hoje
document.addEventListener('DOMContentLoaded', function () {
    const hoje = new Date().toISOString().split('T')[0];
    document.getElementById('checkin').min = hoje;
    document.getElementById('checkout').min = hoje;
});

// Capturar dados do formulário e redirecionar para pesquisa.html
document.getElementById('searchForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Validar datas
    if (!validarDatas()) {
        return;
    }

    const formData = {
        destino: document.getElementById('destino').value.trim(),
        checkin: document.getElementById('checkin').value,
        checkout: document.getElementById('checkout').value,
        hospedes: document.getElementById('hospedes').value,
        tipo: document.getElementById('tipo').value,
        precoMax: document.getElementById('precoMax').value,
        wifi: document.getElementById('wifi').checked,
        piscina: document.getElementById('piscina').checked
    };

    // Armazenar dados no localStorage
    localStorage.setItem('searchData', JSON.stringify(formData));

    // Redirecionar para página de pesquisa
    window.location.href = 'pesquisa.html';
});