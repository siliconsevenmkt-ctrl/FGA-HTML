// Configurações globais
const CONFIG = {
    testimonials: {
        autoPlay: false,
        interval: 10000,
        totalItems: 6
    },
    transformations: {
        autoPlay: false,
        interval: 10000,
        totalItems: 7
    },
    about: {
        autoPlay: true,
        interval: 8000,
        totalItems: 3
    },
    pixKey: 'doe@gritoanimal.fun'
};

// Estado da aplicação
let currentTestimonial = 0;
let currentTransformation = 0;
let currentAbout = 0;
let testimonialInterval = null;
let transformationInterval = null;
let aboutInterval = null;

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    initializeProgressiveImageLoading();
    initializeCarousel();
    initializeTransformationCarousel();
    initializeAboutCarousel();
    initializeDonationGoal();
    initializeAnimations();
    initializePIXCopy();
    initializeFixedButton();
    initializeWhatsAppCarousel();
    console.log('Site do Refúgio da Tia Rê carregado com sucesso!');
});

// ===== CARREGAMENTO PROGRESSIVO DE IMAGENS =====

function initializeProgressiveImageLoading() {
    // Lista de imagens em ordem de prioridade (de cima para baixo)
    const imagePriority = [
        // Prioridade 1: Logo e banners principais (carregam imediatamente)
        'imagens/logosemfundo.png',
        'imagens/bannernovo.webp',
        'imagens/logo.webp',
        
        // Prioridade 2: Imagens do carrossel Quem Somos
        'imagens/cachorro.webp',
        'imagens/obra.webp',
        'imagens/cachorros.webp',
        
        // Prioridade 3: Imagens do carrossel de transformações (carregam logo após)
        'imagens/antesdepois/antes1.webp',
        'imagens/antesdepois/depois1.webp',
        'imagens/antesdepois/antes2.webp',
        'imagens/antesdepois/depois2.webp',
        'imagens/antesdepois/antes3.webp',
        'imagens/antesdepois/depois3.webp',
        'imagens/antesdepois/antes4.webp',
        'imagens/antesdepois/depois4.webp',
        'imagens/antesdepois/antes5.webp',
        'imagens/antesdepois/depois5.webp',
        'imagens/antesdepois/antes6.webp',
        'imagens/antesdepois/depois6.webp',
        'imagens/antesdepois/antes7.webp',
        'imagens/antesdepois/depois7.jpg',
        
        // Prioridade 4: Imagens de adotantes
        'imagens/adotantes/1.webp',
        'imagens/adotantes/2.webp',
        'imagens/adotantes/3.webp',
        'imagens/adotantes/4.webp',
        'imagens/adotantes/5.webp',
        'imagens/adotantes/6.webp',
        
        // Prioridade 5: Outras imagens (carregam por último)
        'imagens/pixxx.png',
    ];
    
    // Função para carregar uma imagem
    function loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(src);
            img.onerror = () => reject(src);
            img.src = src;
        });
    }
    
    // Função para carregar imagens em lotes com delay
    async function loadImagesInBatches() {
        const batchSize = 3; // Carrega 3 imagens por vez
        const delayBetweenBatches = 100; // 100ms entre lotes
        
        for (let i = 0; i < imagePriority.length; i += batchSize) {
            const batch = imagePriority.slice(i, i + batchSize);
            
            // Carrega o lote atual
            const promises = batch.map(src => loadImage(src).catch(err => {
                console.warn(`Falha ao carregar imagem: ${src}`, err);
                return null;
            }));
            
            await Promise.all(promises);
            
            // Aguarda um pouco antes do próximo lote (exceto para o primeiro lote)
            if (i + batchSize < imagePriority.length) {
                await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
            }
        }
        
        console.log('✅ Todas as imagens foram carregadas progressivamente!');
    }
    
    // Carrega as imagens críticas imediatamente
    const criticalImages = [
        'imagens/logosemfundo.png',
        'imagens/bannernovo.webp',
        'imagens/logo.webp'
    ];
    
    // Carrega imagens críticas primeiro
    Promise.all(criticalImages.map(src => loadImage(src).catch(err => {
        console.warn(`Falha ao carregar imagem crítica: ${src}`, err);
        return null;
    }))).then(() => {
        console.log('✅ Imagens críticas carregadas!');
        // Inicia o carregamento progressivo das demais imagens
        loadImagesInBatches();
    });
    
    // Função para pré-carregar imagens dos carrosséis
    function preloadCarouselImages() {
        const carouselImages = [
            // Imagens de transformações (antes e depois)
            'imagens/antesdepois/antes1.webp', 'imagens/antesdepois/depois1.webp',
            'imagens/antesdepois/antes2.webp', 'imagens/antesdepois/depois2.webp',
            'imagens/antesdepois/antes3.webp', 'imagens/antesdepois/depois3.webp',
            'imagens/antesdepois/antes4.webp', 'imagens/antesdepois/depois4.webp',
            'imagens/antesdepois/antes5.webp', 'imagens/antesdepois/depois5.webp',
            'imagens/antesdepois/antes6.webp', 'imagens/antesdepois/depois6.webp',
            'imagens/antesdepois/antes7.webp', 'imagens/antesdepois/depois7.jpg',
            // Imagens de adotantes
            'imagens/adotantes/1.webp', 'imagens/adotantes/2.webp',
            'imagens/adotantes/3.webp', 'imagens/adotantes/4.webp',
            'imagens/adotantes/5.webp', 'imagens/adotantes/6.webp'
        ];
        
        carouselImages.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }
    
    // Pré-carrega imagens dos carrosséis em background
    setTimeout(preloadCarouselImages, 500);
}

// ===== CAROUSEL DE DEPOIMENTOS =====

function initializeCarousel() {
    createCarouselIndicators();
    
    // Garante que o primeiro depoimento seja mostrado
    showTestimonial(0);
    
    if (CONFIG.testimonials.autoPlay) {
        startAutoPlay();
    }
    
    // Event listeners para controles
    document.addEventListener('keydown', handleKeyboardNavigation);
    
    // Pausa autoplay quando mouse está sobre o carousel
    const carousel = document.getElementById('testimonialsCarousel');
    if (carousel) {
        if (CONFIG.testimonials.autoPlay) {
            carousel.addEventListener('mouseenter', stopAutoPlay);
            carousel.addEventListener('mouseleave', startAutoPlay);
        }
        
        // Adiciona suporte para touch/swipe
        initializeTestimonialTouch(carousel);
    }
}

// ===== CAROUSEL DE TRANSFORMAÇÕES =====

function initializeTransformationCarousel() {
    createTransformationIndicators();
    if (CONFIG.transformations.autoPlay) {
        startTransformationAutoPlay();
    }
    
    // Pausa autoplay quando mouse está sobre o carousel
    const transformationCarousel = document.getElementById('transformationCarousel');
    if (transformationCarousel) {
        transformationCarousel.addEventListener('mouseenter', stopTransformationAutoPlay);
        transformationCarousel.addEventListener('mouseleave', startTransformationAutoPlay);
        
        // Adiciona suporte para touch/swipe
        initializeTransformationTouch(transformationCarousel);
    }
}

function createTransformationIndicators() {
    const indicatorsContainer = document.getElementById('transformationIndicators');
    if (!indicatorsContainer) return;
    
    indicatorsContainer.innerHTML = '';
    
    for (let i = 0; i < CONFIG.transformations.totalItems; i++) {
        const indicator = document.createElement('div');
        indicator.className = `transformation-indicator ${i === 0 ? 'active' : ''}`;
        indicator.addEventListener('click', () => goToTransformation(i));
        indicator.setAttribute('aria-label', `Ir para história ${i + 1}`);
        indicator.setAttribute('role', 'button');
        indicator.setAttribute('tabindex', '0');
        
        // Suporte para navegação por teclado nos indicadores
        indicator.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                goToTransformation(i);
            }
        });
        
        indicatorsContainer.appendChild(indicator);
    }
}

function showTransformation(index) {
    const transformations = document.querySelectorAll('.transformation-item');
    const indicators = document.querySelectorAll('.transformation-indicator');
    
    // Remove classe active de todos
    transformations.forEach(item => item.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));
    
    // Adiciona classe active ao atual
    if (transformations[index]) {
        transformations[index].classList.add('active');
    }
    if (indicators[index]) {
        indicators[index].classList.add('active');
    }
    
    currentTransformation = index;
}

function nextTransformation() {
    const next = (currentTransformation + 1) % CONFIG.transformations.totalItems;
    goToTransformation(next);
}

function prevTransformation() {
    const prev = currentTransformation === 0 ? CONFIG.transformations.totalItems - 1 : currentTransformation - 1;
    goToTransformation(prev);
}

function goToTransformation(index) {
    if (index >= 0 && index < CONFIG.transformations.totalItems) {
        showTransformation(index);
    }
}

function startTransformationAutoPlay() {
    if (transformationInterval) {
        clearInterval(transformationInterval);
    }
    
    transformationInterval = setInterval(() => {
        nextTransformation();
    }, CONFIG.transformations.interval);
}

function stopTransformationAutoPlay() {
    if (transformationInterval) {
        clearInterval(transformationInterval);
        transformationInterval = null;
    }
}

// ===== CAROUSEL QUEM SOMOS =====

function initializeAboutCarousel() {
    createAboutIndicators();
    initializeAboutTouch();
    if (CONFIG.about.autoPlay) {
        startAboutAutoPlay();
    }
}

function createAboutIndicators() {
    const indicatorsContainer = document.querySelector('.about-indicators');
    if (!indicatorsContainer) return;
    
    indicatorsContainer.innerHTML = '';
    for (let i = 0; i < CONFIG.about.totalItems; i++) {
        const indicator = document.createElement('span');
        indicator.className = 'about-indicator';
        if (i === 0) indicator.classList.add('active');
        indicator.onclick = () => goToAbout(i);
        indicatorsContainer.appendChild(indicator);
    }
}

function showAbout(index) {
    const slides = document.querySelectorAll('.about-slide');
    const indicators = document.querySelectorAll('.about-indicator');
    
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
    });
    
    indicators.forEach((indicator, i) => {
        indicator.classList.toggle('active', i === index);
    });
    
    currentAbout = index;
}

function nextAbout() {
    const next = (currentAbout + 1) % CONFIG.about.totalItems;
    goToAbout(next);
}

function prevAbout() {
    const prev = currentAbout === 0 ? CONFIG.about.totalItems - 1 : currentAbout - 1;
    goToAbout(prev);
}

function goToAbout(index) {
    if (index >= 0 && index < CONFIG.about.totalItems) {
        showAbout(index);
        if (CONFIG.about.autoPlay) {
            stopAboutAutoPlay();
            startAboutAutoPlay();
        }
    }
}

function startAboutAutoPlay() {
    if (aboutInterval) clearInterval(aboutInterval);
    aboutInterval = setInterval(() => {
        nextAbout();
    }, CONFIG.about.interval);
}

function stopAboutAutoPlay() {
    if (aboutInterval) {
        clearInterval(aboutInterval);
        aboutInterval = null;
    }
}

function initializeAboutTouch() {
    const carousel = document.getElementById('aboutCarousel');
    if (!carousel) return;
    
    let startX = 0;
    let startY = 0;
    let endX = 0;
    let isDragging = false;
    
    // Touch events
    carousel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isDragging = true;
        stopAboutAutoPlay();
    }, { passive: true });
    
    carousel.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        
        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        const diffX = Math.abs(currentX - startX);
        const diffY = Math.abs(currentY - startY);
        
        // Se o movimento vertical for maior que o horizontal, permite scroll da página
        if (diffY > diffX) {
            isDragging = false;
            return;
        }
        
        e.preventDefault();
    }, { passive: false });
    
    carousel.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        endX = e.changedTouches[0].clientX;
        handleAboutSwipe();
        isDragging = false;
        if (CONFIG.about.autoPlay) {
            startAboutAutoPlay();
        }
    }, { passive: true });
    
    // Mouse events para desktop
    carousel.addEventListener('mousedown', (e) => {
        startX = e.clientX;
        isDragging = true;
        stopAboutAutoPlay();
        e.preventDefault();
    });
    
    carousel.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
    });
    
    carousel.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        endX = e.clientX;
        handleAboutSwipe();
        isDragging = false;
        if (CONFIG.about.autoPlay) {
            startAboutAutoPlay();
        }
    });
    
    carousel.addEventListener('mouseleave', () => {
        isDragging = false;
    });
    
    function handleAboutSwipe() {
        const diffX = startX - endX;
        const threshold = 50;
        
        if (Math.abs(diffX) > threshold) {
            if (diffX > 0) {
                nextAbout();
            } else {
                prevAbout();
            }
        }
    }
}

// ===== META DE DOAÇÃO COM VALORES FIXOS =====

function initializeDonationGoal() {
    // ===== CONFIGURAÇÃO MANUAL - ALTERE AQUI OS VALORES =====
    const goalConfig = {
        targetAmount: 50000,        // Meta total (R$ 50.000)
        currentAmount: 4670,        // Valor atual arrecadado 

    };
    
    // Atualiza a interface com os valores fixos
    updateDonationUI(goalConfig.currentAmount, goalConfig.targetAmount);
}


// Função removida - não é mais necessária com valores fixos

function updateDonationUI(currentAmount, targetAmount) {
    // Calcula a porcentagem automaticamente
    const percentage = Math.min(Math.floor((currentAmount / targetAmount) * 100), 100);
    
    // Formata valores
    const formattedAmount = formatCurrency(currentAmount);
    const formattedTarget = formatCurrency(targetAmount);
    
    // Atualiza elementos
    const amountElement = document.getElementById('amountRaised');
    const percentageElement = document.getElementById('progressPercentage');
    
    if (amountElement) {
        amountElement.textContent = formattedAmount;
    }
    
    if (percentageElement) {
        percentageElement.textContent = percentage + '%';
    }
    
    // Atualiza o círculo de progresso
    updateProgressCircle(percentage);
    
    console.log(`💰 Meta de doação atualizada: R$ ${formattedAmount} (${percentage}% da meta de R$ ${formattedTarget})`);
}

function updateProgressCircle(percentage) {
    const circle = document.querySelector('.progress-ring-circle');
    if (circle) {
        const radius = 40; // Novo raio do círculo menor
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (percentage / 100) * circumference;
        circle.style.strokeDashoffset = offset;
    }
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

function formatNumber(number) {
    return new Intl.NumberFormat('pt-BR').format(number);
}

// ===== SISTEMA SIMPLIFICADO - SEM LOCALSTORAGE =====
// As funções de persistência foram removidas para evitar problemas de cache


function showDonationMessage(amount) {
    const messagesContainer = document.getElementById('donationMessages');
    if (!messagesContainer) return;
    
    const message = document.createElement('div');
    message.className = 'donation-message';
    message.innerHTML = `🎉 Doação recebida: ${formatCurrency(amount)}`;
    
    messagesContainer.appendChild(message);
    
    // Mostra a mensagem
    setTimeout(() => {
        message.classList.add('show');
    }, 100);
    
    // Remove a mensagem após 4 segundos
    setTimeout(() => {
        message.classList.add('hide');
        setTimeout(() => {
            if (message.parentNode) {
                message.parentNode.removeChild(message);
            }
        }, 500);
    }, 4000);
}

// ===== TOUCH SUPPORT PARA DEPOIMENTOS =====

function initializeTestimonialTouch(carousel) {
    let startX = 0;
    let startY = 0;
    let endX = 0;
    let isDragging = false;
    
    // Touch events
    carousel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isDragging = true;
        if (CONFIG.testimonials.autoPlay) {
            stopAutoPlay();
        }
    });
    
    carousel.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        
        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        const diffX = Math.abs(currentX - startX);
        const diffY = Math.abs(currentY - startY);
        
        // Se o movimento vertical for maior que o horizontal, permite scroll da página
        if (diffY > diffX) {
            isDragging = false;
            return;
        }
    });
    
    carousel.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        
        endX = e.changedTouches[0].clientX;
        const diffX = startX - endX;
        const threshold = 50; // Sensibilidade do swipe
        
        if (Math.abs(diffX) > threshold) {
            if (diffX > 0) {
                // Swipe para esquerda - próximo
                nextTestimonial();
            } else {
                // Swipe para direita - anterior
                prevTestimonial();
            }
        }
        
        isDragging = false;
        // Só reinicia o autoplay se estiver habilitado
        if (CONFIG.testimonials.autoPlay) {
            startAutoPlay();
        }
    });
    
    // Mouse events para desktop
    carousel.addEventListener('mousedown', (e) => {
        startX = e.clientX;
        isDragging = true;
        if (CONFIG.testimonials.autoPlay) {
            stopAutoPlay();
        }
    });
    
    carousel.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        
        endX = e.clientX;
        const diffX = startX - endX;
        const threshold = 50;
        
        if (Math.abs(diffX) > threshold) {
            if (diffX > 0) {
                nextTestimonial();
            } else {
                prevTestimonial();
            }
        }
        
        isDragging = false;
        // Só reinicia o autoplay se estiver habilitado
        if (CONFIG.testimonials.autoPlay) {
            startAutoPlay();
        }
    });
    
    // Previne seleção de texto durante o drag
    carousel.addEventListener('selectstart', (e) => {
        if (isDragging) {
            e.preventDefault();
        }
    });
}

// ===== TOUCH SUPPORT PARA TRANSFORMAÇÕES =====

function initializeTransformationTouch(carousel) {
    let startX = 0;
    let startY = 0;
    let endX = 0;
    let isDragging = false;
    
    // Touch events
    carousel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isDragging = true;
        stopTransformationAutoPlay();
    });
    
    carousel.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        
        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        const diffX = Math.abs(currentX - startX);
        const diffY = Math.abs(currentY - startY);
        
        // Se o movimento vertical for maior que o horizontal, permite scroll da página
        if (diffY > diffX) {
            isDragging = false;
            return;
        }
    });
    
    carousel.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        
        endX = e.changedTouches[0].clientX;
        const diffX = startX - endX;
        const threshold = 50; // Sensibilidade do swipe
        
        if (Math.abs(diffX) > threshold) {
            if (diffX > 0) {
                // Swipe para esquerda - próximo
                nextTransformation();
            } else {
                // Swipe para direita - anterior
                prevTransformation();
            }
        }
        
        isDragging = false;
        startTransformationAutoPlay();
    });
    
    // Mouse events para desktop
    carousel.addEventListener('mousedown', (e) => {
        startX = e.clientX;
        isDragging = true;
        stopTransformationAutoPlay();
        
        // Captura a posição atual
        const activeItem = carousel.querySelector('.transformation-item.active');
        if (activeItem) {
            const transform = window.getComputedStyle(activeItem).transform;
            const matrix = new DOMMatrix(transform);
            currentTranslateX = matrix.m41;
            prevTranslateX = currentTranslateX;
        }
    });
    
    carousel.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        
        const currentX = e.clientX;
        const diffX = currentX - startX;
        const moveX = prevTranslateX + diffX;
        
        // Aplica a animação durante o arraste
        const activeItem = carousel.querySelector('.transformation-item.active');
        const nextItem = carousel.querySelector('.transformation-item.next') || 
                        carousel.querySelector('.transformation-item:nth-child(' + ((currentTransformation + 1) % CONFIG.transformations.totalItems + 1) + ')');
        const prevItem = carousel.querySelector('.transformation-item.prev') || 
                        carousel.querySelector('.transformation-item:nth-child(' + (currentTransformation === 0 ? CONFIG.transformations.totalItems : currentTransformation) + ')');
        
        if (activeItem) {
            activeItem.style.transform = `translateX(${moveX}px)`;
            activeItem.style.transition = 'none';
        }
        
        // Mostra o próximo item durante o arraste
        if (diffX < 0 && nextItem) { // Arrastando para esquerda
            nextItem.style.display = 'block';
            nextItem.style.transform = `translateX(${moveX + carousel.offsetWidth}px)`;
            nextItem.style.transition = 'none';
            nextItem.style.opacity = '0.7';
        } else if (diffX > 0 && prevItem) { // Arrastando para direita
            prevItem.style.display = 'block';
            prevItem.style.transform = `translateX(${moveX - carousel.offsetWidth}px)`;
            prevItem.style.transition = 'none';
            prevItem.style.opacity = '0.7';
        }
    });
    
    carousel.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        
        endX = e.clientX;
        const diffX = startX - endX;
        const threshold = 50;
        
        // Reseta as animações
        const activeItem = carousel.querySelector('.transformation-item.active');
        const nextItem = carousel.querySelector('.transformation-item.next') || 
                        carousel.querySelector('.transformation-item:nth-child(' + ((currentTransformation + 1) % CONFIG.transformations.totalItems + 1) + ')');
        const prevItem = carousel.querySelector('.transformation-item.prev') || 
                        carousel.querySelector('.transformation-item:nth-child(' + (currentTransformation === 0 ? CONFIG.transformations.totalItems : currentTransformation) + ')');
        
        if (activeItem) {
            activeItem.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            activeItem.style.transform = '';
        }
        
        if (nextItem) {
            nextItem.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            nextItem.style.transform = '';
            nextItem.style.opacity = '';
        }
        
        if (prevItem) {
            prevItem.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            prevItem.style.transform = '';
            prevItem.style.opacity = '';
        }
        
        if (Math.abs(diffX) > threshold) {
            if (diffX > 0) {
                nextTransformation();
            } else {
                prevTransformation();
            }
        }
        
        isDragging = false;
        startTransformationAutoPlay();
    });
    
    // Previne seleção de texto durante o drag
    carousel.addEventListener('selectstart', (e) => {
        if (isDragging) {
            e.preventDefault();
        }
    });
}

function createCarouselIndicators() {
    const indicatorsContainer = document.getElementById('testimonialIndicators');
    if (!indicatorsContainer) return;
    
    indicatorsContainer.innerHTML = '';
    
    for (let i = 0; i < CONFIG.testimonials.totalItems; i++) {
        const indicator = document.createElement('div');
        indicator.className = `testimonial-indicator ${i === 0 ? 'active' : ''}`;
        indicator.addEventListener('click', () => goToTestimonial(i));
        indicator.setAttribute('aria-label', `Ir para depoimento ${i + 1}`);
        indicator.setAttribute('role', 'button');
        indicator.setAttribute('tabindex', '0');
        
        // Suporte para navegação por teclado nos indicadores
        indicator.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                goToTestimonial(i);
            }
        });
        
        indicatorsContainer.appendChild(indicator);
    }
}

function showTestimonial(index) {
    const testimonials = document.querySelectorAll('.testimonial-item');
    const indicators = document.querySelectorAll('.testimonial-indicator');
    
    // Remove classe active de todos (mesmo princípio do transformation)
    testimonials.forEach(item => item.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));
    
    // Adiciona classe active ao atual
    if (testimonials[index]) {
        testimonials[index].classList.add('active');
    }
    if (indicators[index]) {
        indicators[index].classList.add('active');
    }
    
    currentTestimonial = index;
}

function nextTestimonial() {
    const next = (currentTestimonial + 1) % CONFIG.testimonials.totalItems;
    goToTestimonial(next);
}

function prevTestimonial() {
    const prev = currentTestimonial === 0 ? CONFIG.testimonials.totalItems - 1 : currentTestimonial - 1;
    goToTestimonial(prev);
}

function goToTestimonial(index) {
    if (index >= 0 && index < CONFIG.testimonials.totalItems) {
        showTestimonial(index);
        if (CONFIG.testimonials.autoPlay) {
            restartAutoPlay();
        }
    }
}

function startAutoPlay() {
    if (CONFIG.testimonials.autoPlay) {
        stopAutoPlay(); // Limpa interval anterior
        testimonialInterval = setInterval(nextTestimonial, CONFIG.testimonials.interval);
    }
}

function stopAutoPlay() {
    if (testimonialInterval) {
        clearInterval(testimonialInterval);
        testimonialInterval = null;
    }
}

function restartAutoPlay() {
    stopAutoPlay();
    startAutoPlay();
}

function handleKeyboardNavigation(e) {
    const carousel = document.getElementById('testimonialsCarousel');
    if (!carousel) return;
    
    // Verifica se o foco está no carousel ou seus controles
    const isCarouselFocused = carousel.contains(document.activeElement) || 
                             document.activeElement.classList.contains('testimonial-btn') ||
                             document.activeElement.classList.contains('testimonial-indicator');
    
    if (isCarouselFocused) {
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                prevTestimonial();
                break;
            case 'ArrowRight':
                e.preventDefault();
                nextTestimonial();
                break;
            case 'Home':
                e.preventDefault();
                goToTestimonial(0);
                break;
            case 'End':
                e.preventDefault();
                goToTestimonial(CONFIG.testimonials.totalItems - 1);
                break;
        }
    }
}

// ===== FUNCIONALIDADE PIX =====

function initializePIXCopy() {
    const copyBtn = document.querySelector('.copy-btn');
    if (copyBtn) {
        copyBtn.addEventListener('click', copyPixKey);
    }
}

async function copyPixKey() {
    const button = document.querySelector('.copy-btn');
    const pixKey = CONFIG.pixKey;
    
    try {
        // Tenta usar a API moderna de clipboard
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(pixKey);
            showCopySuccess(button);
        } else {
            // Fallback para navegadores mais antigos
            const textArea = document.createElement('textarea');
            textArea.value = pixKey;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);
            
            if (successful) {
                showCopySuccess(button);
            } else {
                throw new Error('Falha ao copiar');
            }
        }
    } catch (error) {
        console.error('Erro ao copiar chave PIX:', error);
        showCopyError(button);
    }
}

function showCopySuccess(button) {
    const originalText = '<span class="copy-icon"></span> Copiar Chave PIX';
    const originalClass = 'copy-btn';
    
    button.innerHTML = '<span class="copy-icon">✓</span> Copiado!';
    button.classList.add('copy-success');
    
    // Feedback tátil se disponível
    if (navigator.vibrate) {
        navigator.vibrate(100);
    }
    
    // Mostra alert informativo
    setTimeout(() => {
        alert('✅ Chave PIX copiada com sucesso!\nCole no seu Banco de preferência para realizar a doação ❤️');
    }, 500);
    
    // Volta ao estado original após 3 segundos
    setTimeout(() => {
        button.innerHTML = originalText;
        button.className = originalClass;
        // Remove qualquer estilo inline para voltar ao CSS original
        button.style.background = '';
    }, 3000);
}

function showCopyError(button) {
    const originalText = button.innerHTML;
    
    button.innerHTML = '<span class="copy-icon">❌</span> Erro ao copiar';
    button.style.background = '#f44336';
    
    setTimeout(() => {
        button.innerHTML = originalText;
        button.style.background = '';
    }, 2000);
    
    // Mostra a chave PIX para cópia manual
    alert(`Não foi possível copiar automaticamente. Chave PIX: ${CONFIG.pixKey}`);
}

// ===== SCROLL SUAVE =====





// ===== ANIMAÇÕES E EFEITOS VISUAIS =====

function initializeAnimations() {
    // Intersection Observer para animações on scroll
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(handleIntersection, observerOptions);
        
        // Observa elementos que devem ser animados
        const animatedElements = document.querySelectorAll(
            '.stat-item, .testimonial-item, .value-item, .footer-section'
        );
        
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            observer.observe(el);
        });
    }
    
    // Efeito parallax sutil no banner (se suportado)
    initializeParallax();
}

function handleIntersection(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const element = entry.target;
            
            // Anima o elemento
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
            
            // Para de observar o elemento após animação
            setTimeout(() => {
                entry.target.style.transition = '';
            }, 600);
        }
    });
}

function initializeParallax() {
    // Desabilitado para evitar problemas de rolagem
    return;
    
    const banner = document.querySelector('.banner-image');
    if (!banner) return;
    
    // Verifica se o usuário não prefere movimento reduzido
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    
    // Aplica efeito parallax sutil
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallax = scrolled * 0.3;
        banner.style.transform = `translateY(${parallax}px)`;
    });
}

// ===== UTILITÁRIOS =====

// Debounce function para otimizar eventos de scroll/resize
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Função para detectar dispositivos móveis
function isMobile() {
    return window.innerWidth <= 768;
}

// Função para logging de eventos (útil para analytics)
function trackEvent(eventName, properties = {}) {
    console.log(`Event: ${eventName}`, properties);
    
            // Aqui você pode integrar com Google Analytics, Facebook Pixel, TikTok Pixel, etc.
        // Exemplo: gtag('event', eventName, properties);
}

// ===== EVENT LISTENERS ADICIONAIS =====

// Otimização para redimensionamento de tela
window.addEventListener('resize', debounce(() => {
    // Reajusta elementos se necessário
    if (CONFIG.testimonials.autoPlay) {
        if (isMobile()) {
            stopAutoPlay();
        } else {
            startAutoPlay();
        }
    }
}, 250));

// Detecta quando a aba fica inativa/ativa
document.addEventListener('visibilitychange', () => {
    if (CONFIG.testimonials.autoPlay) {
        if (document.hidden) {
            stopAutoPlay();
        } else {
            startAutoPlay();
        }
    }
});

// ===== ACESSIBILIDADE =====

// Melhora a navegação por teclado
document.addEventListener('keydown', (e) => {
    // Esc fecha modais ou para autoplay
    if (e.key === 'Escape' && CONFIG.testimonials.autoPlay) {
        stopAutoPlay();
    }
    
    // Tab trap para elementos focáveis
    handleTabTrap(e);
});

function handleTabTrap(e) {
    if (e.key !== 'Tab') return;
    
    const focusableElements = document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (e.shiftKey) {
        if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
        }
    } else {
        if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
        }
    }
}

// ===== PERFORMANCE =====

// Função para otimizar carregamento de imagens (sem lazy loading)
function optimizeImageLoading() {
    // Adiciona classe 'loaded' quando a imagem termina de carregar
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', function() {
                this.classList.add('loaded');
            });
        }
    });
}

// Otimiza carregamento de imagens
optimizeImageLoading();

// ===== FUNÇÕES EXPOSTAS GLOBALMENTE =====

// Exporta funções que podem ser chamadas pelo HTML
window.nextTestimonial = nextTestimonial;
window.prevTestimonial = prevTestimonial;
window.nextTransformation = nextTransformation;
window.prevTransformation = prevTransformation;
window.nextAbout = nextAbout;
window.prevAbout = prevAbout;
window.goToAbout = goToAbout;
window.copyPixKey = copyPixKey;

// Função removida - agora scrollToDonation abre o modal de doação

// ===== ERROR HANDLING =====

// Captura erros JavaScript
window.addEventListener('error', (e) => {
    console.error('Erro JavaScript:', e.error);
    // Em produção, você enviaria isso para um serviço de logging
});

// Captura erros de Promise rejeitadas
window.addEventListener('unhandledrejection', (e) => {
    console.error('Promise rejeitada:', e.reason);
    e.preventDefault();
});

// ===== INICIALIZAÇÃO FINAL =====

// Marca que o script foi carregado
window.RefugioTiaReLoaded = true;

// Log de inicialização
console.log('🐕 Refúgio da Tia Rê - Sistema carregado com sucesso! 🐱');
console.log('Versão: 1.0.0');
console.log('Desenvolvido com ❤️ para salvar vidas');

// Service Worker registration (se disponível)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Registra service worker para cache offline (implementar se necessário)
        // navigator.serviceWorker.register('/sw.js');
    });
}

// ===== MODAL DE DOAÇÃO =====

let selectedDonationAmount = null;
let donationType = 'unica'; // 'unica' ou 'mensal'

function openDonationModal() {
    const modal = document.getElementById('donationModal');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        modal.style.display = 'flex';
        // Reset para aba única e etapa 1
        switchDonationTab('unica');
        goToStep1();
    }
}

function closeDonationModal() {
    const modal = document.getElementById('donationModal');
    if (modal) {
        modal.classList.remove('show');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        // Reset selection
        selectedDonationAmount = null;
        document.querySelectorAll('.donation-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        const customAmountInput = document.getElementById('customAmount');
        if (customAmountInput) customAmountInput.value = '';
        // Reset form
        resetDonationForm();
    }
    
    // Hide loading and show modal content
    hideDonationLoading();
}

function goToStep1() {
    const step1 = document.getElementById('donationStep1');
    const step2Unica = document.getElementById('donationStep2Unica');
    const step2Mensal = document.getElementById('donationStep2Mensal');
    const tabs = document.getElementById('donationTabs');
    const typeIndicator = document.getElementById('donationTypeIndicator');
    
    // Mostra etapa 1 e tabs, esconde etapas 2
    if (step1) step1.style.display = 'block';
    if (step2Unica) step2Unica.style.display = 'none';
    if (step2Mensal) step2Mensal.style.display = 'none';
    if (tabs) tabs.style.display = 'flex';
    if (typeIndicator) typeIndicator.style.display = 'none';
    
    hideDonationLoading();
}

function goToStep2() {
    // Valida se tem valor selecionado
    const customAmountInput = document.getElementById('customAmount');
    const customAmount = customAmountInput ? parseFloat(customAmountInput.value) : 0;
    
    let amount = selectedDonationAmount;
    
    // Se tem valor customizado, usa ele
    if (customAmount && customAmount > 0) {
        amount = customAmount;
    }
    
    if (!amount || amount <= 0) {
        alert('Por favor, selecione um valor ou digite um valor personalizado.');
        return;
    }
    
    // Valida valor mínimo de R$ 10,00
    if (amount < 10) {
        alert('O valor mínimo para doação é de R$ 10,00.');
        return;
    }

    // Valida valor maximo de R$ 15,00
    if (amount > 7000) {
        alert('O valor maximo para doação é de R$ 7.000.');
        return;
    }
    
    // Atualiza o valor selecionado
    selectedDonationAmount = amount;
    
    // Esconde tabs e mostra indicador de tipo na etapa 2
    const tabs = document.getElementById('donationTabs');
    const typeIndicator = document.getElementById('donationTypeIndicator');
    const typeText = document.getElementById('selectedDonationTypeText');
    
    if (tabs) tabs.style.display = 'none';
    if (typeIndicator) typeIndicator.style.display = 'block';
    if (typeText) {
        typeText.textContent = donationType === 'mensal' ? 'Doação Mensal' : 'Doação Única';
    }
    
    // Esconde etapa 1
    const step1 = document.getElementById('donationStep1');
    if (step1) step1.style.display = 'none';
    
    // Mostra a etapa 2 correta baseada no tipo de doação
    if (donationType === 'mensal') {
        const step2Mensal = document.getElementById('donationStep2Mensal');
        if (step2Mensal) {
            step2Mensal.style.display = 'block';
            // Atualiza o valor na etapa mensal
            const amountDisplayMensal = document.getElementById('selectedAmountDisplayMensal');
            if (amountDisplayMensal) {
                amountDisplayMensal.textContent = formatCurrency(amount);
            }
        }
        // Esconde etapa única
        const step2Unica = document.getElementById('donationStep2Unica');
        if (step2Unica) step2Unica.style.display = 'none';
    } else {
        const step2Unica = document.getElementById('donationStep2Unica');
        if (step2Unica) {
            step2Unica.style.display = 'block';
            // Atualiza o valor na etapa única
            const amountDisplay = document.getElementById('selectedAmountDisplay');
            if (amountDisplay) {
                amountDisplay.textContent = formatCurrency(amount);
            }
        }
        // Esconde etapa mensal
        const step2Mensal = document.getElementById('donationStep2Mensal');
        if (step2Mensal) step2Mensal.style.display = 'none';
    }
    
    // Atualiza o valor com a taxa administrativa se necessário
    updateAmountDisplay();
}

// Função para lidar com a taxa administrativa
function handleAdministrativeFee() {
    updateAmountDisplay();
}

// Função para atualizar o display do valor (incluindo taxa administrativa se marcada)
function updateAmountDisplay() {
    if (donationType !== 'unica') return; // Só funciona para doação única
    
    const feeCheckbox = document.getElementById('addAdministrativeFee');
    const amountDisplay = document.getElementById('selectedAmountDisplay');
    
    if (!amountDisplay || !selectedDonationAmount) return;
    
    let totalAmount = selectedDonationAmount;
    
    // Adiciona taxa administrativa se o checkbox estiver marcado
    if (feeCheckbox && feeCheckbox.checked) {
        totalAmount += 4.99;
    }
    
    // Atualiza o display
    amountDisplay.textContent = formatCurrency(totalAmount);
}

function goBackToStep1() {
    goToStep1();
}

function selectDonationAmount(amount) {
    selectedDonationAmount = amount;
    
    // Remove selection from all buttons
    document.querySelectorAll('.donation-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Add selection to clicked button
    event.target.classList.add('selected');
    
    // Clear custom amount
    const customAmountInput = document.getElementById('customAmount');
    if (customAmountInput) customAmountInput.value = '';
}

function handleCustomAmount() {
    const customAmountInput = document.getElementById('customAmount');
    if (customAmountInput && customAmountInput.value) {
        // Remove selection from buttons when typing custom amount
        document.querySelectorAll('.donation-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        selectedDonationAmount = null;
    }
}

function handleAnonymousDonation() {
    const checkbox = document.getElementById('donateAnonymously');
    const nameInput = document.getElementById('donorName');
    
    if (checkbox && checkbox.checked) {
        if (nameInput) {
            nameInput.value = 'Anonimo';
            nameInput.disabled = true;
        }
    } else {
        if (nameInput) {
            nameInput.value = '';
            nameInput.disabled = false;
        }
    }
}

function resetDonationForm() {
    // Reseta formulário de doação única
    const nameInput = document.getElementById('donorName');
    const phoneInput = document.getElementById('donorPhone');
    const messageInput = document.getElementById('donorMessage');
    const anonymousCheckbox = document.getElementById('donateAnonymously');
    
    if (nameInput) {
        nameInput.value = '';
        nameInput.disabled = false;
    }
    if (phoneInput) phoneInput.value = '';
    if (messageInput) {
        messageInput.value = '';
        updateCharCount();
    }
    if (anonymousCheckbox) anonymousCheckbox.checked = false;
    
    // Reseta formulário de doação mensal
    const nameInputMensal = document.getElementById('donorNameMensal');
    const phoneInputMensal = document.getElementById('donorPhoneMensal');
    const emailInputMensal = document.getElementById('donorEmailMensal');
    const documentInputMensal = document.getElementById('donorDocumentMensal');
    
    if (nameInputMensal) nameInputMensal.value = '';
    if (phoneInputMensal) phoneInputMensal.value = '';
    if (emailInputMensal) emailInputMensal.value = '';
    if (documentInputMensal) documentInputMensal.value = '';
}

// Atualiza contador de caracteres da mensagem
function updateCharCount() {
    const messageInput = document.getElementById('donorMessage');
    const charCount = document.getElementById('charCount');
    if (messageInput && charCount) {
        charCount.textContent = messageInput.value.length;
    }
}

// Adiciona listener para contador de caracteres
document.addEventListener('DOMContentLoaded', function() {
    const messageInput = document.getElementById('donorMessage');
    if (messageInput) {
        messageInput.addEventListener('input', updateCharCount);
    }
    
    // Máscara para telefone (doação única)
    const phoneInput = document.getElementById('donorPhone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 11) {
                value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
            } else {
                value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
            }
            e.target.value = value;
        });
    }
    
    // Máscara para telefone (doação mensal)
    const phoneInputMensal = document.getElementById('donorPhoneMensal');
    if (phoneInputMensal) {
        phoneInputMensal.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 11) {
                value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
            } else {
                value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
            }
            e.target.value = value;
        });
    }
    
    // Máscara para CPF (doação mensal)
    const documentInput = document.getElementById('donorDocumentMensal');
    if (documentInput) {
        documentInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 11) {
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            }
            e.target.value = value;
        });
    }
});

// Função para gerar contribuição (chama gerarpix com todos os dados)
function generateContribution() {
    let nome, telefone, email, cpf, mensagem;
    
    // Validação baseada no tipo de doação
    if (donationType === 'mensal') {
        // DOAÇÃO MENSAL: Campos obrigatórios
        const nameInput = document.getElementById('donorNameMensal');
        const phoneInput = document.getElementById('donorPhoneMensal');
        const emailInput = document.getElementById('donorEmailMensal');
        const documentInput = document.getElementById('donorDocumentMensal');
        
        nome = nameInput ? nameInput.value.trim() : '';
        telefone = phoneInput ? phoneInput.value.replace(/\D/g, '') : '';
        email = emailInput ? emailInput.value.trim() : '';
        cpf = documentInput ? documentInput.value.replace(/\D/g, '') : '';
        mensagem = ''; // Não tem mensagem na doação mensal
        
        // Validações
        if (!nome || nome === '') {
            alert('Por favor, preencha seu nome completo.');
            return;
        }
        
        if (!telefone || telefone.length < 11) {
            alert('Por favor, preencha um telefone válido.');
            return;
        }
        
        // Email não é mais obrigatório
        // if (!email || email === '' || !email.includes('@')) {
        //     alert('Por favor, preencha um email válido.');
        //     return;
        // }
        
        if (!cpf || cpf.length !== 11) {
            alert('Por favor, preencha um CPF válido.');
            return;
        }
    } else {
        // DOAÇÃO ÚNICA: Campos atuais
        const nameInput = document.getElementById('donorName');
        const phoneInput = document.getElementById('donorPhone');
        const messageInput = document.getElementById('donorMessage');
        
        nome = nameInput ? nameInput.value.trim() : '';
        telefone = phoneInput ? phoneInput.value.replace(/\D/g, '') : '';
        mensagem = messageInput ? messageInput.value.trim() : '';
        email = '';
        cpf = '';
        
        if (!nome || nome === '') {
            alert('Por favor, preencha seu nome ou marque a opção "Doar anonimamente".');
            return;
        }
        
        // Telefone é opcional - se não preencher, usa 000000000
        if (!telefone || telefone.length < 11) {
            telefone = '000000000';
        }
    }
    
    // Valida valor
    if (!selectedDonationAmount || selectedDonationAmount <= 0) {
        alert('Por favor, selecione um valor válido.');
        return;
    }
    
    // Calcula valor final (incluindo taxa administrativa se marcada para doação única)
    let finalAmount = selectedDonationAmount;
    if (donationType === 'unica') {
        const feeCheckbox = document.getElementById('addAdministrativeFee');
        if (feeCheckbox && feeCheckbox.checked) {
            finalAmount += 4.99;
        }
    }
    
    // Fecha o modal primeiro - esconde as etapas
    const step1 = document.getElementById('donationStep1');
    const step2Unica = document.getElementById('donationStep2Unica');
    const step2Mensal = document.getElementById('donationStep2Mensal');
    
    // Esconde as etapas
    if (step1) step1.style.display = 'none';
    if (step2Unica) step2Unica.style.display = 'none';
    if (step2Mensal) step2Mensal.style.display = 'none';
    
    // Pequeno delay para garantir que as etapas foram escondidas
    setTimeout(() => {
        // Mostra o loading
        showDonationLoading();
    }, 50);
    
    // Get current UTM parameters
    const urlParams = new URLSearchParams(window.location.search);
    const utmParams = {};
    
    ['utm_source', 'utm_campaign', 'utm_medium', 'utm_content', 'utm_term'].forEach(param => {
        const value = urlParams.get(param);
        if (value) {
            utmParams[param] = value;
        }
    });
    
    // Build PIX URL com todos os parâmetros
    // Escolhe o endpoint baseado no tipo de doação (única ou mensal)
    const endpoint = donationType === 'mensal' ? 'gerarpixrecorrente/index.php' : 'gerarpix/index.php';
    let pixUrl = `${endpoint}?amount=${finalAmount}&nome=${encodeURIComponent(nome)}&telefone=${encodeURIComponent(telefone)}`;
    
    // Adiciona email e cpf apenas para doação mensal
    if (donationType === 'mensal') {
        pixUrl += `&email=${encodeURIComponent(email)}&cpf=${encodeURIComponent(cpf)}`;
    }
    
    // Adiciona mensagem apenas para doação única (se houver)
    if (donationType === 'unica' && mensagem) {
        pixUrl += `&mensagem=${encodeURIComponent(mensagem)}`;
    }
    
    // Add UTM parameters
    Object.keys(utmParams).forEach(key => {
        pixUrl += `&${key}=${encodeURIComponent(utmParams[key])}`;
    });
    
    // Small delay to show loading, then redirect
    setTimeout(() => {
        window.location.href = pixUrl;
    }, 500);
}

// Update scrollToDonation function to open modal instead
function scrollToDonation() {
    openDonationModal();
}

// Função auxiliar para obter parâmetros da URL
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name) || '';
}

// Função para formatar moeda (já existe, mas garantindo que está disponível)
if (typeof formatCurrency === 'undefined') {
    function formatCurrency(amount) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    }
}

// Função para mostrar loading no modal
function showDonationLoading() {
    const loading = document.getElementById('donationLoading');
    const step1 = document.getElementById('donationStep1');
    const step2 = document.getElementById('donationStep2');
    
    if (loading) {
        loading.style.display = 'flex';
        // Garante que as etapas estão escondidas
        if (step1) step1.style.display = 'none';
        if (step2) step2.style.display = 'none';
    }
}

// Função para esconder loading no modal
function hideDonationLoading() {
    const loading = document.getElementById('donationLoading');
    
    if (loading) {
        loading.style.display = 'none';
    }
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('donationModal');
    if (event.target === modal) {
        closeDonationModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeDonationModal();
    }
});

// Função para alternar entre abas (Doação Única e Doação Mensal)
function switchDonationTab(type) {
    donationType = type;
    
    // Atualiza visual das abas
    const tabUnica = document.getElementById('tabUnica');
    const tabMensal = document.getElementById('tabMensal');
    
    if (tabUnica && tabMensal) {
        if (type === 'unica') {
            tabUnica.classList.add('active');
            tabMensal.classList.remove('active');
        } else {
            tabMensal.classList.add('active');
            tabUnica.classList.remove('active');
        }
    }
}

// Exporta funções para uso global
window.openDonationModal = openDonationModal;
window.closeDonationModal = closeDonationModal;
window.selectDonationAmount = selectDonationAmount;
window.handleCustomAmount = handleCustomAmount;
window.goToStep2 = goToStep2;
window.goBackToStep1 = goBackToStep1;
window.handleAnonymousDonation = handleAnonymousDonation;
window.generateContribution = generateContribution;
window.scrollToDonation = scrollToDonation;
window.switchDonationTab = switchDonationTab;
window.handleAdministrativeFee = handleAdministrativeFee;

// ===== MODAL DE DETALHES DAS DESPESAS =====

function openExpensesModal() {
    const modal = document.getElementById('expensesModal');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        modal.style.display = 'flex';
    }
}

function closeExpensesModal() {
    const modal = document.getElementById('expensesModal');
    if (modal) {
        modal.classList.remove('show');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Exporta funções para uso global
window.openExpensesModal = openExpensesModal;
window.closeExpensesModal = closeExpensesModal;

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('expensesModal');
    if (event.target === modal) {
        closeExpensesModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const expensesModal = document.getElementById('expensesModal');
        if (expensesModal && expensesModal.classList.contains('show')) {
            closeExpensesModal();
        }
    }
});

// ===== CONTROLE DO BOTÃO FIXO =====
function initializeFixedButton() {
    const fixedBtn = document.querySelector('.fixed-donation-btn');
    const donationGoalSection = document.querySelector('.donation-goal-section');
    
    if (!fixedBtn || !donationGoalSection) return;
    
    function checkScroll() {
        const donationGoalSectionTop = donationGoalSection.offsetTop;
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        
        // Mostra o botão fixo quando a seção "Meta de Doação" entra na viewport
        // Quando o topo da seção está visível ou já passou
        if (scrollPosition + windowHeight > donationGoalSectionTop + 100) {
            fixedBtn.classList.add('show');
        } else {
            fixedBtn.classList.remove('show');
        }
    }
    
    // Verifica no scroll
    window.addEventListener('scroll', checkScroll);
    
    // Verifica na carga inicial
    checkScroll();
}

// ===== CARROSSEL WHATSAPP =====
function initializeWhatsAppCarousel() {
    const track = document.querySelector('.whatsapp-groups-track');
    const wrapper = document.querySelector('.whatsapp-groups-wrapper');
    const prevBtn = document.querySelector('.whatsapp-carousel-btn.prev');
    const nextBtn = document.querySelector('.whatsapp-carousel-btn.next');
    const dots = document.querySelectorAll('.whatsapp-carousel-dots .dot');
    
    if (!track || !prevBtn || !nextBtn || !wrapper) return;
    
    let currentIndex = 0;
    const totalItems = document.querySelectorAll('.group-item').length;
    
    function updateCarousel() {
        const itemWidth = wrapper.offsetWidth;
        const translateX = -currentIndex * itemWidth;
        track.style.transform = `translateX(${translateX}px)`;
        
        // Atualiza os dots
        dots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
        
        // Carrossel circular - nunca desabilita os botões
        prevBtn.disabled = false;
        nextBtn.disabled = false;
    }
    
    function goToSlide(index) {
        // Carrossel circular
        if (index < 0) {
            currentIndex = totalItems - 1;
        } else if (index >= totalItems) {
            currentIndex = 0;
        } else {
            currentIndex = index;
        }
        updateCarousel();
    }
    
    function nextSlide() {
        // Carrossel circular - quando chega no último, volta para o primeiro
        goToSlide(currentIndex + 1);
    }
    
    function prevSlide() {
        // Carrossel circular - quando está no primeiro, vai para o último
        goToSlide(currentIndex - 1);
    }
    
    // Event listeners para botões
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    // Dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });
    
    // ===== SWIPE/TOUCH SUPPORT =====
    let startX = 0;
    let startY = 0;
    let endX = 0;
    let isDragging = false;
    
    // Touch events
    wrapper.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isDragging = true;
    }, { passive: true });
    
    wrapper.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        
        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        const diffX = Math.abs(currentX - startX);
        const diffY = Math.abs(currentY - startY);
        
        // Se o movimento vertical for maior que o horizontal, permite scroll da página
        if (diffY > diffX) {
            isDragging = false;
            return;
        }
    }, { passive: true });
    
    wrapper.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        
        endX = e.changedTouches[0].clientX;
        const diffX = startX - endX;
        const threshold = 50; // Sensibilidade do swipe
        
        if (Math.abs(diffX) > threshold) {
            if (diffX > 0) {
                // Swipe para esquerda - próximo
                nextSlide();
            } else {
                // Swipe para direita - anterior
                prevSlide();
            }
        }
        
        isDragging = false;
    }, { passive: true });
    
    // Mouse events para desktop
    wrapper.addEventListener('mousedown', (e) => {
        startX = e.clientX;
        startY = e.clientY;
        isDragging = true;
        e.preventDefault();
    });
    
    wrapper.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
    });
    
    wrapper.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        
        endX = e.clientX;
        const diffX = startX - endX;
        const threshold = 50;
        
        if (Math.abs(diffX) > threshold) {
            if (diffX > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
        
        isDragging = false;
    });
    
    wrapper.addEventListener('mouseleave', () => {
        isDragging = false;
    });
    
    // Previne seleção de texto durante o drag
    wrapper.addEventListener('selectstart', (e) => {
        if (isDragging) {
            e.preventDefault();
        }
    });
    
    // Inicializa
    updateCarousel();
    
    // Ajusta no resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            updateCarousel();
        }, 250);
    });
}
