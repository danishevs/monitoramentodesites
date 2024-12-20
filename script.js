const siteUrlInput = document.getElementById('siteUrl');
const monitorBtn = document.getElementById('monitorBtn');
const statusDiv = document.getElementById('status');
const lastCheckDiv = document.getElementById('lastCheck');
const updatesList = document.getElementById('updatesList');
let monitoringInterval = null;
let lastContent = '';

// Função para registrar o service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('Service Worker registrado com sucesso:', reg.scope))
            .catch(err => console.log('Falha ao registrar Service Worker:', err));
    });
}

monitorBtn.addEventListener('click', () => {
    if (monitoringInterval) {
        clearInterval(monitoringInterval);
        monitoringInterval = null;
        monitorBtn.textContent = 'Iniciar Monitoramento';
        statusDiv.textContent = 'Status: Inativo';
    } else {
        const url = siteUrlInput.value;
        if (url) {
            monitorBtn.textContent = 'Parar Monitoramento';
            statusDiv.textContent = 'Status: Ativo';
            checkSite(url);
            monitoringInterval = setInterval(() => checkSite(url), 300000); // 5 minutos
        } else {
            alert('Por favor, insira uma URL.');
        }
    }
});

async function checkSite(url) {
    lastCheckDiv.textContent = `Última Verificação: ${new Date().toLocaleString()}`;
    try {
        const response = await fetch(url, { mode: 'no-cors' }); // no-cors para evitar problemas de CORS
        // const text = await response.text(); // remover linha que ocasiona erro
        // if (lastContent && lastContent !== text) {
        //     notifyUser('Site Atualizado!');
        //     addUpdateToHistory(url);
        // }
        // lastContent = text;
    } catch (error) {
        console.error('Erro ao verificar o site:', error);
        statusDiv.textContent = 'Status: Erro na verificação';
    }
}

function notifyUser(message) {
    if (Notification.permission === 'granted') {
        new Notification(message);
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                new Notification(message);
            }
        });
    }
    // Fallback: Notificação local
    alert(message);
}

function addUpdateToHistory(url) {
    const li = document.createElement('li');
    li.textContent = `${new Date().toLocaleString()} - ${url}`;
    updatesList.appendChild(li);
}

// Solicitar permissão para notificações no carregamento
if ('Notification' in window) {
    Notification.requestPermission();
}