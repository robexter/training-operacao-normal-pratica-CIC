'use strict';

(() => {
  let installEvent = null;

  const isStandalone = () =>
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;

  function button() { return document.getElementById('installBtn'); }

  function refresh() {
    const b = button();
    if (!b) return;
    const installed = isStandalone();
    b.textContent = installed ? 'App instalado' : 'Instalar App';
    b.disabled = installed;
    b.classList.remove('hidden');
  }

  function fallback() {
    const ua = navigator.userAgent || '';
    if (/Android/i.test(ua)) {
      alert('Abra esta página diretamente no Chrome. Depois use ⋮ → Instalar app ou Adicionar à tela inicial.');
    } else if (/iPad|iPhone|iPod/.test(ua)) {
      alert('Use Compartilhar → Adicionar à Tela de Início.');
    } else {
      alert('Use o menu do navegador → Instalar app / Adicionar à tela inicial.');
    }
  }

  async function ensureSW() {
    if (!('serviceWorker' in navigator)) return null;
    try {
      const reg = await navigator.serviceWorker.register('./sw.js', {scope:'./'});
      await navigator.serviceWorker.ready;
      return reg;
    } catch (err) {
      console.error('Service Worker:', err);
      return null;
    }
  }

  async function install() {
    if (isStandalone()) return refresh();

    // Registra o SW somente quando o usuário solicita instalar.
    await ensureSW();

    if (installEvent) {
      const ev = installEvent;
      installEvent = null;
      try {
        await ev.prompt();
        await ev.userChoice;
        refresh();
        return;
      } catch (err) {
        console.error(err);
      }
    }
    fallback();
  }

  async function update() {
    try {
      const reg = 'serviceWorker' in navigator
        ? await navigator.serviceWorker.getRegistration('./')
        : null;
      if (reg) await reg.update();
    } catch (e) {}
    location.reload();
  }

  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    installEvent = e;
    refresh();
  });
  window.addEventListener('appinstalled', () => {
    installEvent = null;
    refresh();
  });

  window.PWAInstall={install,update,refresh};

  document.addEventListener('DOMContentLoaded',()=>{
    refresh();
    setTimeout(refresh,600);
  });
})();
