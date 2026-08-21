const toast = document.getElementById('toast');
function showMessage(message){
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(()=>toast.classList.remove('show'), 2800);
}

const menuBtn = document.getElementById('menuBtn');
const nav = document.getElementById('nav');
menuBtn.addEventListener('click',()=>nav.classList.toggle('nav-open'));
document.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('nav-open')));

let ultimoTextoIA = '';

async function demoAI() {
  const input = document.getElementById('aiInput');
  const pergunta = input.value.trim();
  if (!pergunta) return;

  const respostaIA = document.getElementById('respostaIA');
  respostaIA.textContent = 'Consultando a Inteligência Artificial...';

  try {
    const resposta = await fetch('/api/perguntar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pergunta: pergunta })
    });

    const dados = await resposta.json();

    if (dados.resposta) {
      ultimoTextoIA = dados.resposta;
      respostaIA.textContent = ultimoTextoIA;
    } else {
      respostaIA.textContent = 'Erro: ' + (dados.erro || 'Falha ao consultar.');
    }
  } catch (erro) {
    respostaIA.textContent = 'Erro de conexão com o servidor.';
  }

  input.value = '';
}

function falarPergunta() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert('Seu navegador não suporta reconhecimento de voz.');
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'pt-BR';
  recognition.start();

  const botaoMic = document.getElementById('btn-mic');
  botaoMic.style.color = 'red';

  recognition.onresult = (event) => {
    const textoFalado = event.results[0][0].transcript;
    document.getElementById('aiInput').value = textoFalado;
    botaoMic.style.color = '';
  };

  recognition.onerror = () => {
    alert('Não foi possível capturar o áudio.');
    botaoMic.style.color = '';
  };

  recognition.onspeechend = () => {
    botaoMic.style.color = '';
  };
}

function ouvirResposta() {
  if (!ultimoTextoIA) {
    alert('Não há resposta da IA para ler no momento.');
    return;
  }

  if (!('speechSynthesis' in window)) {
    alert('Seu navegador não suporta leitura de áudio.');
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(ultimoTextoIA);
  utterance.lang = 'pt-BR';
  utterance.rate = 1.0;
  window.speechSynthesis.speak(utterance);
}

let radioPlaying=false;
function toggleRadio(){
  radioPlaying=!radioPlaying;
  document.getElementById('radioStatus').textContent = radioPlaying
    ? 'Rádio em modo de demonstração. O player real será conectado na próxima etapa.'
    : 'Programação preparada para receber hinos, mensagens e anúncios autorizados.';
  showMessage(radioPlaying ? 'Rádio iniciada (demonstração).' : 'Rádio pausada.');
}