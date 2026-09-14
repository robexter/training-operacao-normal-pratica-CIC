'use strict';

(() => {
  let installEvent = null;
  let swRegistration = null;

  const isStandalone = () =>
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;

  function getButton() {
    return document.getElementById('installBtn');
  }

  function refresh() {
    const b = getButton();
    if (!b) return;

    const installed = isStandalone();
    const wantedText = installed ? 'App instalado' : 'Instalar App';

    // Só altera o DOM quando houver mudança real.
    // Isso evita o loop que travava a página no celular.
    if (b.textContent !== wantedText) b.textContent = wantedText;
    if (b.disabled !== installed) b.disabled = installed;
    if (b.classList.contains('hidden')) b.classList.remove('hidden');
  }

  function fallback() {
    const ua = navigator.userAgent || '';

    if (/iPad|iPhone|iPod/.test(ua)) {
      alert('No iPhone/iPad: toque em Compartilhar e escolha Adicionar à Tela de Início.');
      return;
    }

    if (/Android/i.test(ua)) {
      alert('Se a janela de instalação não aparecer, abra esta página diretamente no Chrome e use ⋮ → Instalar app ou Adicionar à tela inicial.');
      return;
    }

    alert('Use o menu do navegador e escolha Instalar app ou Adicionar à tela inicial.');
  }

  async function install() {
    if (isStandalone()) {
      refresh();
      return;
    }

    if (installEvent) {
      const ev = installEvent;
      installEvent = null;
      try {
        await ev.prompt();
        await ev.userChoice;
        refresh();
        return;
      } catch (err) {
        console.error('Falha no prompt de instalação:', err);
      }
    }

    fallback();
  }

  async function update() {
    try {
      if ('serviceWorker' in navigator) {
        const reg = await navigator.serviceWorker.getRegistration('./');
        if (reg) await reg.update();
      }
    } catch (err) {
      console.error('Falha ao atualizar SW:', err);
    }
    location.reload();
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

  window.PWAInstall = { install, update, refresh };

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        swRegistration = await navigator.serviceWorker.register('./sw.js', { scope: './' });
        await swRegistration.update();
      } catch (err) {
        console.error('Service Worker:', err);
      }
      refresh();
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    refresh();
    // O app.js cria o cabeçalho durante o carregamento.
    // Esta segunda chamada única cobre aparelhos mais lentos sem observar/mutar o DOM em loop.
    setTimeout(refresh, 600);
  });
})();
