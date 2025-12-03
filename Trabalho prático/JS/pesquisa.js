
// Dados dos alojamentos
const hoteis = [
    {
        id: 'Portocal',
        nome: 'Portocal',
        cidade: 'Porto',
        localizacao: 'Porto, Portugal',
        tipo: 'Hotel',
        estrelas: '★★★★☆',
        avaliacao: '4.5/5',
        numAvaliacoes: 245,
        descricao: 'Hotel com vista privilegiada para o oceano Atlântico, combinando conforto moderno e hospitalidade tradicional portuguesa.',
        preco: 75,
        imagem: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600',
      
    },
    {
        id: 'pousada-centro',
        nome: 'Pousada do Centro',
        cidade: 'Lisboa',
        localizacao: 'Lisboa, Portugal',
        tipo: 'Pousada',
        estrelas: '★★★☆☆',
        avaliacao: '4.3/5',
        numAvaliacoes: 195,
        descricao: 'No coração da cidade, perfeito para turismo. Wi-Fi gratuito e localização privilegiada para explorar Lisboa.',
        preco: 75,
        imagem: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600',
     
    },
    {
        id: 'algarve-sol',
        nome: 'Resort Algarve Sol',
        cidade: 'Algarve',
        localizacao: 'Algarve, Portugal',
        tipo: 'Resort',
        estrelas: '★★★★★',
        avaliacao: '4.7/5',
        numAvaliacoes: 310,
        descricao: 'Resort de luxo à beira-mar com três piscinas, spa, restaurante gourmet e acesso direto à praia.',
        preco: 75,
        imagem: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600',

    },
    {
        id: 'hotel-geres',
        nome: 'Hotel Gerês',
        cidade: 'Gerês',
        localizacao: 'Gerês, Portugal',
        tipo: 'Hotel',
        estrelas: '★★★★★',
        avaliacao: '4.7/5',
        numAvaliacoes: 110,
        descricao: 'Hotel de luxo na serra do Gerês com piscina interior, spa, restaurante gourmet e salão de jogos.',
        preco: 75,
        imagem: 'https://images.unsplash.com/photo-1606402179428-a57976d71fa4?w=600' ,

    }
];

// Função para filtrar hotéis
function filtrarHoteis(criterios) {
    var resultado = [];
    
    for (var i = 0; i < hoteis.length; i++) {
        var hotel = hoteis[i];
        var mostrar = true;
        
        // Verificar destino
        if (criterios.destino && criterios.destino.trim() !== '') {
            var destino = criterios.destino.toLowerCase();
            var nome = hotel.nome.toLowerCase();
            var cidade = hotel.cidade.toLowerCase();
            if (nome.indexOf(destino) === -1 && cidade.indexOf(destino) === -1) {
                mostrar = false;
            }
        }
        
        // Verificar tipo
        if (mostrar && criterios.tipo && criterios.tipo !== 'Todos') {
            if (hotel.tipo !== criterios.tipo) mostrar = false;
        }
        
        // Verificar preço
        if (mostrar && criterios.precoMax && criterios.precoMax !== '') {
            if (hotel.preco > parseFloat(criterios.precoMax)) mostrar = false;
        }
        
        // Verificar Wi-Fi
        if (mostrar && criterios.wifi) {
            var temWifi = false;
            for (var j = 0; j < hotel.comodidades.length; j++) {
                if (hotel.comodidades[j] === 'wifi') {
                    temWifi = true;
                    break;
                }
            }
            if (!temWifi) mostrar = false;
        }
        
        // Verificar Piscina
        if (mostrar && criterios.piscina) {
            var temPiscina = false;
            for (var j = 0; j < hotel.comodidades.length; j++) {
                if (hotel.comodidades[j] === 'piscina') {
                    temPiscina = true;
                    break;
                }
            }
            if (!temPiscina) mostrar = false;
        }
        
        if (mostrar) resultado.push(hotel);
    }
    
    return resultado;
}

// Função para criar o HTML de um hotel
function criarCardHotel(hotel) {
    return '<div class="card mb-4 shadow-sm border-0"><div class="row g-0"><div class="col-md-4">' +
           '<img src="' + hotel.imagem + '" class="img-fluid rounded-start h-100 object-fit-cover" alt="' + hotel.nome + '">' +
           '</div><div class="col-md-8"><div class="card-body">' +
           '<h4 class="card-title mb-2">' + hotel.nome + '</h4>' +
           '<p class="text-muted small mb-2">' + hotel.localizacao + ' • <span class="text-warning">' + hotel.estrelas + '</span> • ' + hotel.avaliacao + ' (' + hotel.numAvaliacoes + ' avaliações)</p>' +
           '<p class="card-text small">' + hotel.descricao + '</p>' +
           '<p class="fw-bold mb-1">€' + hotel.preco + ' <span class="text-muted small">/noite</span></p>' +
           '<a href="detalhe.html?id=' + hotel.id + '" class="btn btn-primary btn-sm mt-2">Ver Detalhes</a>' +
           '</div></div></div></div>';
}

// Função para exibir critérios de pesquisa
function exibirCriterios(criterios) {
    var div = document.getElementById('criteriosPesquisa');
    var texto = '';
    
    if (criterios.destino && criterios.destino.trim() !== '') {
        texto += 'Destino: ' + criterios.destino;
    }
    
    div.innerHTML = texto ? '<strong>Critérios:</strong> ' + texto : '';
}

// Função principal para exibir resultados
function exibirResultados() {
    var container = document.getElementById('resultadosContainer');
    var contador = document.getElementById('resultadoContador');
    
    // Obter dados da pesquisa do localStorage
    var searchDataStr = localStorage.getItem('searchData');
    var criterios = {};
    
    if (searchDataStr) {
        criterios = JSON.parse(searchDataStr);
        
        // Guardar pesquisa no histórico (se autenticado)
        var currentUserStr = localStorage.getItem('currentUser');
        if (currentUserStr) {
            var currentUser = JSON.parse(currentUserStr);
            var usersStr = localStorage.getItem('users') || '[]';
            var users = JSON.parse(usersStr);
            
            // Procurar utilizador
            for (var i = 0; i < users.length; i++) {
                if (users[i].email === currentUser.email) {
                    if (!users[i].perfil) {
                        users[i].perfil = { historicoPesquisas: [] };
                    }
                    if (!users[i].perfil.historicoPesquisas) {
                        users[i].perfil.historicoPesquisas = [];
                    }
                    
                    // Adicionar pesquisa
                    users[i].perfil.historicoPesquisas.push(criterios);
                    
                    // Limitar a 10 pesquisas
                    if (users[i].perfil.historicoPesquisas.length > 10) {
                        users[i].perfil.historicoPesquisas.shift();
                    }
                    
                    localStorage.setItem('users', JSON.stringify(users));
                    break;
                }
            }
        }
    }

    // Exibir critérios
    exibirCriterios(criterios);

    // Filtrar e exibir resultados
    var hoteisFiltrados = filtrarHoteis(criterios);
    var numResultados = hoteisFiltrados.length;
    
    if (numResultados === 0) {
        contador.textContent = 'Nenhum alojamento encontrado.';
        container.innerHTML = '<p class="text-muted">Tente ajustar os filtros.</p>';
    } else {
        contador.textContent = 'Encontrámos ' + numResultados + ' alojamento' + (numResultados > 1 ? 's' : '') + ' disponível' + (numResultados > 1 ? 'is' : '');
        var html = '';
        for (var i = 0; i < hoteisFiltrados.length; i++) {
            html += criarCardHotel(hoteisFiltrados[i]);
        }
        container.innerHTML = html;
    }
}

// Executar quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    atualizarNavbar();
    exibirResultados();
    
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            fazerLogout();
        });
    }
});
