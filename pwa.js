'use strict';

(() => {
  let installEvent = null;
  let swRegistration = null;

  const isStandalone = () =>
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;

  const getButton = () => document.getElementById('installBtn');

  function refresh() {
    const b = getButton();
    if (!b) return;

    if (isStandalone()) {
      b.textContent = 'App instalado';
      b.disabled = true;
      b.classList.remove('hidden');
      return;
    }

    b.disabled = false;
    b.classList.remove('hidden');
    b.textContent = installEvent ? 'Instalar App' : 'Instalar App';
  }

  function showFallback() {
    const ua = navigator.userAgent || '';
    const isIOS = /iPad|iPhone|iPod/.test(ua);
    const isAndroid = /Android/i.test(ua);

    if (isIOS) {
      alert('No iPhone/iPad, a instalação não é aberta por este botão. Use Compartilhar → Adicionar à Tela de Início.');
      return;
    }

    if (isAndroid) {
      alert('O navegador ainda não liberou o prompt automático. No Chrome, toque em ⋮ → Instalar app. Se aparecer “Adicionar à tela inicial”, use essa opção. Abra esta página diretamente no Chrome, não dentro do navegador interno do WhatsApp/ChatGPT/Facebook.');
      return;
    }

    alert('O navegador ainda não liberou o prompt automático. Use o menu do navegador e escolha Instalar app / Adicionar à tela inicial.');
  }

  async function waitForInstallEvent(ms = 2500) {
    const started = Date.now();
    while (!installEvent && Date.now() - started < ms) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return installEvent;
  }

  async function install() {
    if (isStandalone()) {
      refresh();
      return;
    }

    // Garante que o Service Worker esteja ativo antes de desistir do prompt.
    try {
      if ('serviceWorker' in navigator) {
        if (!swRegistration) {
          swRegistration = await navigator.serviceWorker.register('./sw.js', {scope: './'});
        }
        await navigator.serviceWorker.ready;
      }
    } catch (e) {
      console.error('Falha ao preparar Service Worker:', e);
    }

    if (!installEvent) await waitForInstallEvent();

    if (!installEvent) {
      showFallback();
      return;
    }

    const ev = installEvent;
    installEvent = null;

    try {
      const result = await ev.prompt();
      const choice = result || await ev.userChoice;
      if (choice && choice.outcome === 'accepted') {
        refresh();
      } else {
        refresh();
      }
    } catch (e) {
      console.error('Falha ao abrir prompt de instalação:', e);
      showFallback();
    }
  }

  async function update() {
    try {
      if ('serviceWorker' in navigator) {
        swRegistration = swRegistration || await navigator.serviceWorker.getRegistration('./');
        if (swRegistration) await swRegistration.update();
      }
      // Força nova consulta dos arquivos sem alterar progresso/localStorage.
      const url = new URL(location.href);
      url.searchParams.set('_pwa', Date.now().toString());
      location.replace(url.toString());
    } catch (e) {
      location.reload();
    }
  }

  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    installEvent = event;
    refresh();
  });

  window.addEventListener('appinstalled', () => {
    installEvent = null;
    refresh();
  });

  // Mantém o botão sincronizado mesmo quando o app.js recria o topo da página.
  new MutationObserver(refresh).observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  window.PWAInstall = {install, update, refresh};

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js', {scope: './'})
      .then(reg => {
        swRegistration = reg;
        return reg.update();
      })
      .catch(err => console.error('Service Worker:', err));
  }

  document.addEventListener('DOMContentLoaded', refresh);
})();
