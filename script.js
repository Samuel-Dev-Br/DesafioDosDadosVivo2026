// Dados retirados da tabela do enunciado
const dadosLogistica = [
    { id: 301, transportadora: "RotaMax", regiao: "Sudeste", prazo: 3, realizado: 7 },
    { id: 302, transportadora: "RotaMax", regiao: "Norte", prazo: 5, realizado: 5 },
    { id: 303, transportadora: "FlashLog", regiao: "Nordeste", prazo: 4, realizado: 9 },
    { id: 304, transportadora: "FlashLog", regiao: "Norte", prazo: 6, realizado: 5 },
    { id: 305, transportadora: "ViaCargo", regiao: "Centro-Oeste", prazo: 2, realizado: 6 },
    { id: 306, transportadora: "FlashLog", regiao: "Sul", prazo: 5, realizado: 12 },
    { id: 307, transportadora: "RotaMax", regiao: "Sul", prazo: 6, realizado: 9 },
    { id: 308, transportadora: "ViaCargo", regiao: "Sudeste", prazo: 3, realizado: 4 },
    { id: 309, transportadora: "ViaCargo", regiao: "Sul", prazo: 4, realizado: 4 },
    { id: 310, transportadora: "ViaCargo", regiao: "Nordeste", prazo: 4, realizado: 8 }
];

window.onload = function() {
    processarDashboard();
};

function processarDashboard() {
    let totalEntregas = dadosLogistica.length;
    let totalAtrasos = 0;
    let maiorAtraso = 0;
    
    let regioes = { "Sul": {a:0, p:0}, "Sudeste": {a:0, p:0}, "Nordeste": {a:0, p:0}, "Centro-Oeste": {a:0, p:0}, "Norte": {a:0, p:0} };
    let transportadoras = { "FlashLog": {somaDias: 0, qtdAtrasos: 0}, "RotaMax": {somaDias: 0, qtdAtrasos: 0}, "ViaCargo": {somaDias: 0, qtdAtrasos: 0} };
    let listaPrioridade = [];

    dadosLogistica.forEach(item => {
        let desvio = item.realizado - item.prazo;
        let estaAtrasado = desvio > 0;

        if (estaAtrasado) {
            totalAtrasos++;
            if (desvio > maiorAtraso) maiorAtraso = desvio;
            
            regioes[item.regiao].a++;
            transportadoras[item.transportadora].somaDias += desvio;
            transportadoras[item.transportadora].qtdAtrasos++;

            let alerta = "ATENÇÃO";
            let classeAlerta = "atencao";
            if (desvio >= 6) { alerta = "CRÍTICO MÁXIMO"; classeAlerta = "critico"; }
            else if (desvio >= 4) { alerta = "ALTA PRIORIDADE"; classeAlerta = "alto"; }

            listaPrioridade.push({ ...item, desvio, alerta, classeAlerta });
        } else {
            regioes[item.regiao].p++;
        }
    });

    document.getElementById("indicador-total").innerText = totalEntregas;
    document.getElementById("indicador-atrasos").innerText = totalAtrasos;
    document.getElementById("indicador-taxa").innerText = ((totalAtrasos / totalEntregas) * 100).toFixed(1) + "%";
    document.getElementById("indicador-gargalo").innerText = `+${maiorAtraso} dias`;


    listaPrioridade.sort((x, y) => y.desvio - x.desvio);

    const tabelaCorpo = document.getElementById("tabela-corpo");
    tabelaCorpo.innerHTML = listaPrioridade.map(item => `
        <tr>
            <td>${item.id}</td>
            <td>${item.transportadora}</td>
            <td>${item.regiao}</td>
            <td>${item.prazo} dias</td>
            <td>${item.realizado} dias</td>
            <td class="desvio-alerta">+${item.desvio} dias</td>
            <td><span class="badge ${item.classeAlerta}">${item.alerta}</span></td>
        </tr>
    `).join('');

    const graficoRegioes = document.getElementById("grafico-regioes");
    graficoRegioes.innerHTML = Object.keys(regioes).map(reg => {
        let altAtraso = (regioes[reg].a / 3) * 100;
        let altPrazo = (regioes[reg].p / 3) * 100;
        return `
            <div class="barra-coluna">
                <div class="barra-grupo">
                    <div class="barra" style="height: ${altAtraso}%; background: var(--vermelho);" title="${regioes[reg].a} atrasos"></div>
                    <div class="barra" style="height: ${altPrazo}%; background: var(--verde);" title="${regioes[reg].p} no prazo"></div>
                </div>
                <span class="legenda-v">${reg}</span>
            </div>
        `;
    }).join('');


    const graficoTransp = document.getElementById("grafico-transportadoras");
    graficoTransp.innerHTML = Object.keys(transportadoras).map(t => {
        let dados = transportadoras[t];
        let media = dados.qtdAtrasos > 0 ? (dados.somaDias / dados.qtdAtrasos) : 0;
        let larguraBarra = (media / 7) * 100;
        
        let corBarra = "var(--amarelo)";
        if (media >= 5) corBarra = "var(--vermelho)";
        else if (media >= 3.5) corBarra = "var(--laranja)";

        return `
            <div class="linha-barra-h">
                <div class="label-barra-h">
                    <span>${t}</span>
                    <span style="color: var(--texto-secundario)">${media.toFixed(1)} dias</span>
                </div>
                <div class="bg-barra-h">
                    <div class="barra-h" style="width: ${larguraBarra}%; background: ${corBarra};"></div>
                </div>
            </div>
        `;
    }).join('');
}
