
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
        

// Quartos disponíveis por hotel
const QUARTOS_POR_HOTEL = {
    "vista-mar": [
        { nome: "Quarto Single", preco: 75 },
        { nome: "Quarto Double", preco: 120 },
        { nome: "Quarto Twin", preco: 110 }
    ],
    "pousada-centro": [
        { nome: "Standard", preco: 68 },
        { nome: "Superior", preco: 85 }
    ],
    "algarve-sol": [
        { nome: "Standard", preco: 150 },
        { nome: "Vista Mar", preco: 180 }
    ]
};

// Converter objeto HOTEIS para array (útil para iterações)
const HOTEIS_ARRAY = Object.keys(HOTEIS).map(id => ({
    id: id,
    ...HOTEIS[id]
}));