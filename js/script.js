// Configurações
const PIX_KEY = 'doe@gritoanimal.fun';

// Função para copiar texto para o clipboard
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

// Event listener para o botão de copiar PIX
const copyPixButton = document.getElementById('copyPixButton');
if (copyPixButton) {
    copyPixButton.addEventListener('click', async function(e) {
        e.preventDefault();
        
        const success = await copyToClipboard(PIX_KEY);
        
        if (success) {
            // Mostra notificação visual
            showNotification();
            
            // Mostra alerta
            alert('✅ Chave PIX copiada com sucesso!\nCole no seu Banco de preferência para realizar a doação ❤️\n\n' + PIX_KEY + '\n\nSr. Kelvin de Jesus, Administrador Financeiro da Fundação.');
            
            // Efeito visual no botão
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        } else {
            alert('❌ Erro ao copiar a chave PIX.\n\nChave PIX: ' + PIX_KEY + '\n\nPor favor, copie manualmente.');
        }
    });
}

// Animação suave ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    // Garante que a notificação comece oculta
    const notification = document.getElementById('copyNotification');
    if (notification) notification.classList.remove('show');

    // ✅ ALTERAÇÃO: Força o texto visível do PIX (camada 1) e permite clicar para copiar
    const pixKeyTextEl = document.getElementById('pixKeyText');
    if (pixKeyTextEl) {
        // garante que o texto exibido seja sempre o PIX_KEY
        pixKeyTextEl.textContent = PIX_KEY;

        // (opcional) clicar no texto também copia
        pixKeyTextEl.style.cursor = 'pointer';
        pixKeyTextEl.title = 'Clique para copiar a chave PIX';
        pixKeyTextEl.addEventListener('click', async () => {
            const success = await copyToClipboard(PIX_KEY);
            if (success) {
                showNotification();
                // se quiser manter o alert ao clicar no texto, descomente:
                // alert('✅ Chave PIX copiada!\n\n' + PIX_KEY);
            } else {
                alert('❌ Erro ao copiar a chave PIX.\n\nChave PIX: ' + PIX_KEY + '\n\nPor favor, copie manualmente.');
            }
        });
    }
    
    // Verifica se há imagem, se não, usa um placeholder
    const avatar = document.getElementById('avatar');
    if (avatar) {
        avatar.onerror = function() {
            // Se a imagem não carregar, usa um ícone do Font Awesome
            const profileImage = document.querySelector('.profile-image');
            if (!profileImage) return;

            profileImage.innerHTML = '<div class="avatar-placeholder"><i class="fas fa-paw"></i></div>';
            
            // Adiciona estilo ao placeholder
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
    button.addEventListener('click', function(e) {
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
