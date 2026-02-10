// Configurações
const PIX_KEY = 'DOE QUALQUER VALOR...';

// ✅ Função para copiar texto para o clipboard (mantive, caso você queira reutilizar no futuro)
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback para navegadores mais antigos
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (err) {
      document.body.removeChild(textArea);
      return false;
    }
  }
}

// Função para mostrar notificação
function showNotification() {
  const notification = document.getElementById('copyNotification');
  if (!notification) return;

  notification.classList.add('show');

  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}

// ✅ Botão 3 agora redireciona para uma página de terceiros (mantendo o mesmo layout)
const THIRD_PARTY_URL = 'https://livepix.gg/fga';

const copyPixButton = document.getElementById('copyPixButton');
if (copyPixButton) {
  copyPixButton.addEventListener('click', function (e) {
    e.preventDefault();

    // efeito visual rápido no clique
    this.style.transform = 'scale(0.98)';
    setTimeout(() => {
      this.style.transform = '';
    }, 150);

    window.open(THIRD_PARTY_URL, '_blank', 'noopener,noreferrer');
  });
}

// Animação suave ao carregar a página
document.addEventListener('DOMContentLoaded', function () {
  // Garante que a notificação comece oculta
  const notification = document.getElementById('copyNotification');
  if (notification) notification.classList.remove('show');

  // ✅ Botão 2 (texto central) NÃO faz nada — apenas mostra o texto
  const pixKeyTextEl = document.getElementById('pixKeyText');
  if (pixKeyTextEl) {
    pixKeyTextEl.textContent = PIX_KEY;
    pixKeyTextEl.style.cursor = 'default';
    pixKeyTextEl.removeAttribute('title');
  }

  // Verifica se há imagem, se não, usa um placeholder
  const avatar = document.getElementById('avatar');
  if (avatar) {
    avatar.onerror = function () {
      const profileImage = document.querySelector('.profile-image');
      if (!profileImage) return;

      profileImage.innerHTML = '<div class="avatar-placeholder"><i class="fas fa-paw"></i></div>';

      const style = document.createElement('style');
      style.textContent = `
        .avatar-placeholder {
          width: 120px;
          height: 120px;
          border-radius: 20px;
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          box-shadow: 0 8px 20px rgba(139, 111, 71, 0.3);
        }
        .avatar-placeholder i {
          font-size: 3rem;
          color: #8B6F47;
        }
        @media (max-width: 480px) {
          .avatar-placeholder {
            width: 100px;
            height: 100px;
          }
          .avatar-placeholder i {
            font-size: 2.5rem;
          }
        }
      `;
      document.head.appendChild(style);
    };
  }
});

// Scroll suave (caso tenha seções adicionais no futuro)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Adiciona efeito de ripple aos botões
document.querySelectorAll('.link-button, .social-icon-button').forEach(button => {
  button.addEventListener('click', function (e) {
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');

    this.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  });
});

// Adiciona CSS para o efeito ripple
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
  .link-button,
  .social-icon-button {
    position: relative;
    overflow: hidden;
  }

  .ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.5);
    transform: scale(0);
    animation: ripple-animation 0.6s ease-out;
    pointer-events: none;
  }

  @keyframes ripple-animation {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;
document.head.appendChild(rippleStyle);

// Log de boas-vindas no console
console.log('%c🐾 Fundação Grito Animal - Links 🐾', 'color: #8B6F47; font-size: 20px; font-weight: bold;');
console.log('%cObrigado por visitar nossa página!', 'color: #D4A574; font-size: 14px;');
console.log('%cAjude os animais doando o valor que vier no seu coração via PIX: ' + PIX_KEY, 'color: #2d3748; font-size: 12px;');
