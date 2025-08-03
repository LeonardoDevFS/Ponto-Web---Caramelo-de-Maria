// =================================================================
// PARTE 1: CONFIGURAÇÕES E VARIÁVEIS GLOBAIS
// =================================================================
const LOCAL_PERMITIDO = { latitude: -22.8154882, longitude: -46.6928078 };
const TOLERANCIA_METROS = 300;
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw3mJcbJH83lW_EPjtkxiAURCwXYD3JzFMu-bGyYcLOFGvjCX--IyDANifB6NO24C2F/exec';

const seletorFuncionaria = document.getElementById('employee');
const botaoEntrada = document.getElementById('btn-entrada');
const botaoSaida = document.getElementById('btn-saida');
const containerStatus = document.getElementById('status-container');
const mensagemStatus = document.getElementById('status-message');
const reportArea = document.getElementById('report-area');
const summaryReportDiv = document.getElementById('summary-report');
const historyReportDiv = document.getElementById('history-report');
const statusIndicator = document.getElementById('status-indicator');

// =================================================================
// PARTE 2: LÓGICA PRINCIPAL
// =================================================================

window.addEventListener('load', () => {
    verificarStatusOnline();
});

seletorFuncionaria.addEventListener('change', () => {
    verificarStatusOnline();
    reportArea.style.display = 'none';
});

function registrarPonto(acao) {
    const nomeFuncionario = seletorFuncionaria.value;
    desativarBotoes(true);
    atualizarStatus(`Obtendo localização para ${nomeFuncionario}...`, 'info');
    if (!navigator.geolocation) {
        atualizarStatus("Seu navegador não suporta geolocalização.", 'error');
        desativarBotoes(false);
        return;
    }
    navigator.geolocation.getCurrentPosition(
        (posicao) => { validarLocalizacao(posicao, nomeFuncionario, acao); },
        (erro) => { tratarErroGeolocalizacao(erro); },
        { enableHighAccuracy: true }
    );
}

function validarLocalizacao(posicao, nome, acao) {
    const latAtual = posicao.coords.latitude;
    const lonAtual = posicao.coords.longitude;
    const distancia = calcularDistancia(latAtual, lonAtual, LOCAL_PERMITIDO.latitude, LOCAL_PERMITIDO.longitude);
    if (distancia <= TOLERANCIA_METROS) {
        atualizarStatus(`Localização validada! Registrando ${acao}...`, 'success');
        enviarDadosParaPlanilha(nome, acao);
    } else {
        atualizarStatus(`Você está a ${distancia.toFixed(0)} metros do local. Ponto não permitido.`, 'error');
        desativarBotoes(false);
    }
}

function enviarDadosParaPlanilha(nome, acao) {
    const formData = new FormData();
    const agora = new Date();
    const horarioFormatado = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    formData.append('Nome', nome);
    formData.append('Acao', acao);
    formData.append('Horario', horarioFormatado);
    fetch(SCRIPT_URL, { method: 'POST', body: formData })
        .then(response => response.json())
        .then(data => {
            if (data.result === 'success') {
                atualizarStatus(`Ponto de ${acao} para ${nome} registrado com sucesso às ${horarioFormatado}!`, 'success');
                verificarStatusOnline();
                setTimeout(() => {
                    desativarBotoes(false);
                    atualizarStatus('Aguardando ação...', 'neutral');
                }, 3000);
            } else {
                if (data.error === 'DUPLICATE_ACTION') {
                    atualizarStatus(data.message, 'error');
                } else {
                    atualizarStatus(`Erro ao salvar: ${data.error || 'Tente novamente.'}`, 'error');
                }
                desativarBotoes(false);
            }
        })
        .catch(error => {
            console.error('Erro de comunicação:', error);
            atualizarStatus(`Erro de comunicação. Verifique sua conexão e tente novamente.`, 'error');
            desativarBotoes(false);
        });
}

function buscarRelatorio() {
    const nomeFuncionario = seletorFuncionaria.value;
    reportArea.style.display = 'block';
    summaryReportDiv.innerHTML = `<p class="text-info">Buscando relatório para ${nomeFuncionario}...</p>`;
    historyReportDiv.innerHTML = '';
    verificarStatusOnline(true);
}

function verificarStatusOnline(showFullReport = false) {
    const nomeFuncionario = seletorFuncionaria.value;
    const urlBusca = `${SCRIPT_URL}?employee=${nomeFuncionario}`;
    
    statusIndicator.classList.remove('bg-green-500', 'bg-gray-400');
    statusIndicator.classList.add('bg-yellow-400');
    statusIndicator.setAttribute('title', 'Verificando status...');

    fetch(urlBusca)
        .then(response => response.json())
        .then(res => {
            if (res.result === 'success') {
                const lastAction = res.data.lastAction;
                
                statusIndicator.classList.remove('bg-yellow-400');
                if (lastAction === 'Entrada') {
                    statusIndicator.classList.add('bg-green-500');
                    statusIndicator.setAttribute('title', 'Trabalhando');
                } else {
                    statusIndicator.classList.add('bg-gray-400');
                    statusIndicator.setAttribute('title', 'Fora de serviço');
                }

                if (showFullReport) {
                    const summaryData = res.data.summary;
                    const historyData = res.data.history;
                    summaryReportDiv.innerHTML = `
                        <h3 class="font-bold text-lg mb-2">Relatório para ${summaryData.nome}</h3>
                        <p><strong>Total de Horas Trabalhadas:</strong> ${summaryData.totalHoras}</p>
                        <p><strong>Valor a Receber:</strong> ${summaryData.valorPagar}</p>
                    `;
                    if (historyData && historyData.length > 0) {
                        let historyHTML = '<h4 class="font-bold text-md mt-4">Últimos Registros:</h4><ul class="list-disc list-inside text-sm space-y-1">';
                        historyData.forEach(record => {
                            const dataFormatada = new Date(record.timestamp).toLocaleDateString('pt-BR');
                            historyHTML += `<li>${record.acao} em ${dataFormatada} às ${record.horario}</li>`;
                        });
                        historyHTML += '</ul>';
                        historyReportDiv.innerHTML = historyHTML;
                    } else {
                        historyReportDiv.innerHTML = '<p class="text-sm text-gray-500 mt-2">Nenhum registro de ponto encontrado.</p>';
                    }
                }
            } else {
                throw new Error(res.error);
            }
        })
        .catch(error => {
            console.error('Erro na busca de status:', error);
            statusIndicator.classList.remove('bg-yellow-400');
            statusIndicator.classList.add('bg-red-500');
            statusIndicator.setAttribute('title', 'Erro ao verificar status');
            if (showFullReport) {
                summaryReportDiv.innerHTML = `<p class="text-error">Não foi possível carregar o relatório.</p>`;
            }
        });
}

// =================================================================
// PARTE 4: FUNÇÕES AUXILIARES
// =================================================================
function atualizarStatus(mensagem, tipo) {
    mensagemStatus.textContent = mensagem;
    containerStatus.className = 'mt-8 p-4 rounded-lg min-h-[5rem] flex items-center justify-center';
    switch (tipo) {
        case 'info': containerStatus.classList.add('bg-info', 'text-white'); break;
        case 'success': containerStatus.classList.add('bg-success', 'text-white'); break;
        case 'error': containerStatus.classList.add('bg-error', 'text-white'); break;
        default: containerStatus.classList.add('bg-gray-100'); mensagemStatus.classList.add('text-gray-500'); break;
    }
}
function tratarErroGeolocalizacao(erro) {
    let mensagem;
    switch (erro.code) {
        case erro.PERMISSION_DENIED: mensagem = "Você negou a permissão de localização."; break;
        case erro.POSITION_UNAVAILABLE: mensagem = "Informação de localização indisponível."; break;
        case erro.TIMEOUT: mensagem = "A requisição de localização demorou demais."; break;
        default: mensagem = "Ocorreu um erro desconhecido."; break;
    }
    atualizarStatus(mensagem, 'error');
    desativarBotoes(false);
}
function desativarBotoes(desativar) {
    botaoEntrada.disabled = desativar;
    botaoSaida.disabled = desativar;
    botaoEntrada.classList.toggle('opacity-50', desativar);
    botaoSaida.classList.toggle('opacity-50', desativar);
}
function calcularDistancia(lat1, lon1, lat2, lon2) {
    const R = 6371e3;
    const phi1 = lat1 * Math.PI / 180;
    const phi2 = lat2 * Math.PI / 180;
    const deltaPhi = (lat2 - lat1) * Math.PI / 180;
    const deltaLambda = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) + Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
