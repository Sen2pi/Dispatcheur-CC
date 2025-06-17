class PresentationController {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = 22;
        this.slides = document.querySelectorAll('.slide');
        this.slideCounter = document.getElementById('slideCounter');
        this.progressFill = document.getElementById('progressFill');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.isNavigating = false; // Prevent rapid navigation
        
        this.init();
    }

    init() {
        this.updateSlideDisplay();
        this.bindEvents();
        this.updateNavigationButtons();
        
        // Ensure only first slide is active initially
        this.slides.forEach((slide, index) => {
            if (index === 0) {
                slide.classList.add('active');
                slide.style.pointerEvents = 'auto';
            } else {
                slide.classList.remove('active');
                slide.style.pointerEvents = 'none';
            }
        });
        
        // Initialize progress bar
        this.updateProgressBar();
    }

    bindEvents() {
        // Navigation buttons with throttling
        this.prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.throttledPreviousSlide();
        });
        
        this.nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.throttledNextSlide();
        });

        // Keyboard navigation with throttling
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));

        // Agenda navigation (clicking on agenda items)
        this.bindAgendaNavigation();

        // Prevent context menu and other browser shortcuts
        document.addEventListener('contextmenu', (e) => e.preventDefault());
        
        // Prevent F5 refresh and other shortcuts that might interfere
        document.addEventListener('keydown', (e) => {
            if (e.key === 'F5' || (e.ctrlKey && e.key === 'r')) {
                e.preventDefault();
            }
        });
    }

    throttledNextSlide() {
        if (this.isNavigating) return;
        this.nextSlide();
    }

    throttledPreviousSlide() {
        if (this.isNavigating) return;
        this.previousSlide();
    }

    bindAgendaNavigation() {
        // Wait for DOM to be ready
        setTimeout(() => {
            const agendaItems = document.querySelectorAll('.agenda-item');
            agendaItems.forEach((item, index) => {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (this.isNavigating) return;
                    
                    // Map agenda items to specific slides
                    const slideMap = {
                        0: 3,  // Contextualização
                        1: 6,  // Arquitetura e Tecnologias
                        2: 12, // Sistema VoIP
                        3: 14, // Testes e Resultados
                        4: 21, // Demonstração
                        5: 20  // Conclusões
                    };
                    
                    if (slideMap[index] !== undefined) {
                        this.goToSlide(slideMap[index]);
                    }
                });
                
                // Add hover effect
                item.style.cursor = 'pointer';
            });
        }, 100);
    }

    handleKeyPress(e) {
        // Prevent rapid key presses
        if (this.isNavigating) return;

        // Prevent default for navigation keys
        const navigationKeys = ['ArrowRight', 'ArrowLeft', ' ', 'PageDown', 'PageUp', 'Home', 'End', 'Escape'];
        if (navigationKeys.includes(e.key)) {
            e.preventDefault();
        }

        switch(e.key) {
            case 'ArrowRight':
            case ' ':
            case 'PageDown':
                this.nextSlide();
                break;
            case 'ArrowLeft':
            case 'PageUp':
                this.previousSlide();
                break;
            case 'Home':
                this.goToSlide(1);
                break;
            case 'End':
                this.goToSlide(this.totalSlides);
                break;
            case 'Escape':
                this.toggleFullscreen();
                break;
        }

        // Number keys for direct slide navigation (1-9)
        if (e.key >= '1' && e.key <= '9') {
            const slideNum = parseInt(e.key);
            if (slideNum <= this.totalSlides) {
                e.preventDefault();
                this.goToSlide(slideNum);
            }
        }
    }

    nextSlide() {
        if (this.currentSlide < this.totalSlides && !this.isNavigating) {
            this.goToSlide(this.currentSlide + 1);
        }
    }

    previousSlide() {
        if (this.currentSlide > 1 && !this.isNavigating) {
            this.goToSlide(this.currentSlide - 1);
        }
    }

    goToSlide(slideNumber) {
        // Validate slide number and prevent rapid navigation
        if (slideNumber < 1 || slideNumber > this.totalSlides || slideNumber === this.currentSlide || this.isNavigating) {
            return;
        }

        // Set navigation lock
        this.isNavigating = true;

        // Hide current slide immediately
        this.hideCurrentSlide();
        
        // Update current slide number
        const previousSlide = this.currentSlide;
        this.currentSlide = slideNumber;
        
        // Show new slide
        this.showSlide(slideNumber);
        
        // Update UI elements
        this.updateSlideDisplay();
        this.updateNavigationButtons();
        this.updateProgressBar();
        
        // Trigger slide change event
        this.onSlideChange(slideNumber, previousSlide);

        // Release navigation lock after animation completes
        setTimeout(() => {
            this.isNavigating = false;
        }, 400);
    }

    showSlide(slideNumber) {
        const targetSlide = document.querySelector(`[data-slide="${slideNumber}"]`);
        if (!targetSlide) return;

        // Ensure all slides are hidden first
        this.slides.forEach(slide => {
            slide.classList.remove('active');
            slide.style.pointerEvents = 'none';
            slide.style.opacity = '0';
            slide.style.transform = 'translateX(50px)';
        });
        
        // Show target slide
        targetSlide.classList.add('active');
        targetSlide.style.pointerEvents = 'auto';
        
        // Animate entrance
        this.animateSlideEntrance(targetSlide);
    }

    hideCurrentSlide() {
        const currentSlideElement = document.querySelector(`[data-slide="${this.currentSlide}"]`);
        if (currentSlideElement) {
            currentSlideElement.classList.remove('active');
            currentSlideElement.style.pointerEvents = 'none';
            currentSlideElement.style.opacity = '0';
            currentSlideElement.style.transform = 'translateX(-50px)';
        }
    }

    animateSlideEntrance(slide) {
        // Reset initial state
        slide.style.opacity = '0';
        slide.style.transform = 'translateX(50px)';
        slide.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
        
        // Trigger reflow
        slide.offsetHeight;
        
        // Animate in
        requestAnimationFrame(() => {
            slide.style.opacity = '1';
            slide.style.transform = 'translateX(0)';
        });
        
        // Animate slide content after slide is visible
        setTimeout(() => {
            this.animateSlideContent(slide);
        }, 200);
    }

    animateSlideContent(slide) {
        const animatableElements = slide.querySelectorAll(`
            .context-item, .stat-card, .objective-item, .arch-layer,
            .tech-category, .api-feature, .dashboard-item, .ext-feature,
            .voip-function, .us-stat, .perf-metric, .result-card,
            .challenge-item, .achievement, .future-item, .conclusion-item,
            .voip-image-item, .screenshot-item, .agenda-item
        `);

        animatableElements.forEach((element, index) => {
            // Set initial state
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'none';
            
            setTimeout(() => {
                element.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 80 + 100);
        });
    }

    updateSlideDisplay() {
        this.slideCounter.textContent = `${this.currentSlide} / ${this.totalSlides}`;
    }

    updateNavigationButtons() {
        const isFirstSlide = this.currentSlide === 1;
        const isLastSlide = this.currentSlide === this.totalSlides;
        
        this.prevBtn.disabled = isFirstSlide;
        this.nextBtn.disabled = isLastSlide;
        
        // Update button styles for visual feedback
        this.prevBtn.style.opacity = isFirstSlide ? '0.5' : '1';
        this.nextBtn.style.opacity = isLastSlide ? '0.5' : '1';
        
        // Update button cursors
        this.prevBtn.style.cursor = isFirstSlide ? 'not-allowed' : 'pointer';
        this.nextBtn.style.cursor = isLastSlide ? 'not-allowed' : 'pointer';
    }

    updateProgressBar() {
        const progress = (this.currentSlide / this.totalSlides) * 100;
        this.progressFill.style.width = `${progress}%`;
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log(`Error attempting to enable fullscreen: ${err.message}`);
                ToastNotifications.show('Não foi possível ativar o ecrã completo', 'warning');
            });
        } else {
            document.exitFullscreen();
        }
    }

    onSlideChange(slideNumber, previousSlide) {
        // Log slide change for debugging
        console.log(`Navigated from slide ${previousSlide} to slide ${slideNumber}`);
        
        // Add specific behaviors for certain slides
        switch(slideNumber) {
            case 1:
                // Title slide
                break;
            case 12:
            case 13:
                // VoIP slides - highlight importance
                console.log('VoIP slide - key content!');
                break;
            case 21:
                // Demo slide
                console.log('Demo slide - prepare for demonstration');
                break;
            case 22:
                // Final slide
                console.log('Final slide - Q&A time');
                break;
        }
    }

    // Method to get slide title for accessibility
    getSlideTitle(slideNumber) {
        const slide = document.querySelector(`[data-slide="${slideNumber}"]`);
        if (slide) {
            const heading = slide.querySelector('h1, h2');
            return heading ? heading.textContent : `Slide ${slideNumber}`;
        }
        return `Slide ${slideNumber}`;
    }

    // Method to get estimated time for current slide
    getSlideEstimatedTime(slideNumber) {
        const timings = {
            1: 30,   // Title
            2: 30,   // Agenda
            3: 60,   // Contextualização
            4: 60,   // Motivação
            5: 60,   // Objetivos
            6: 90,   // Arquitetura
            7: 60,   // Stack
            8: 60,   // Justificação
            9: 60,   // Backend
            10: 60,  // Frontend
            11: 60,  // Extensão
            12: 120, // VoIP Destaque
            13: 90,  // VoIP Funcionalidades
            14: 90,  // User Stories
            15: 90,  // Performance
            16: 60,  // Resultados
            17: 60,  // Dificuldades
            18: 60,  // Conquistas
            19: 60,  // Futuro
            20: 60,  // Conclusões
            21: 180, // Demonstração
            22: 60   // Perguntas
        };

        return timings[slideNumber] || 60;
    }

    // Reset presentation to first slide
    resetPresentation() {
        this.goToSlide(1);
        ToastNotifications.show('Apresentação reiniciada', 'info');
    }
}

// Timer functionality for presentation timing
class PresentationTimer {
    constructor() {
        this.startTime = null;
        this.elapsedTime = 0;
        this.isRunning = false;
        this.timerInterval = null;
        this.targetDuration = 30 * 60 * 1000; // 30 minutes in milliseconds
        
        this.createTimerDisplay();
    }

    createTimerDisplay() {
        const timerContainer = document.createElement('div');
        timerContainer.className = 'timer-display';
        timerContainer.innerHTML = `
            <div class="timer-content">
                <span class="timer-label">Tempo:</span>
                <span class="timer-value" id="timerValue">00:00</span>
                <button class="timer-btn" id="timerToggle" title="Iniciar/Pausar cronómetro">
                    <span class="material-icons">play_arrow</span>
                </button>
                <button class="timer-btn" id="timerReset" title="Reiniciar cronómetro">
                    <span class="material-icons">refresh</span>
                </button>
            </div>
        `;

        // Add styles for timer
        const timerStyles = `
            .timer-display {
                position: fixed;
                top: 20px;
                left: 20px;
                background: var(--color-surface);
                padding: 8px 16px;
                border-radius: 20px;
                box-shadow: var(--shadow-lg);
                border: 1px solid var(--color-card-border);
                z-index: 1000;
                font-size: 14px;
                backdrop-filter: blur(10px);
            }
            
            .timer-content {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .timer-label {
                color: var(--color-text-secondary);
                font-weight: 500;
            }
            
            .timer-value {
                color: var(--color-primary);
                font-weight: bold;
                font-family: var(--font-family-mono);
                min-width: 50px;
                text-align: center;
            }
            
            .timer-btn {
                background: none;
                border: none;
                cursor: pointer;
                padding: 4px;
                border-radius: 4px;
                transition: background var(--duration-fast);
                display: flex;
                align-items: center;
                justify-content: center;
                color: var(--color-text-secondary);
            }
            
            .timer-btn:hover {
                background: var(--color-secondary);
                color: var(--color-primary);
            }
            
            .timer-warning {
                color: var(--color-warning) !important;
            }
            
            .timer-danger {
                color: var(--color-error) !important;
            }
        `;

        if (!document.querySelector('#timer-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'timer-styles';
            styleSheet.textContent = timerStyles;
            document.head.appendChild(styleSheet);
        }

        document.body.appendChild(timerContainer);

        // Bind timer events
        document.getElementById('timerToggle').addEventListener('click', () => this.toggle());
        document.getElementById('timerReset').addEventListener('click', () => this.reset());
    }

    start() {
        if (!this.isRunning) {
            this.startTime = Date.now() - this.elapsedTime;
            this.isRunning = true;
            this.timerInterval = setInterval(() => this.updateDisplay(), 1000);
            
            const toggleBtn = document.getElementById('timerToggle');
            toggleBtn.innerHTML = '<span class="material-icons">pause</span>';
            toggleBtn.title = 'Pausar cronómetro';
        }
    }

    pause() {
        if (this.isRunning) {
            this.isRunning = false;
            clearInterval(this.timerInterval);
            
            const toggleBtn = document.getElementById('timerToggle');
            toggleBtn.innerHTML = '<span class="material-icons">play_arrow</span>';
            toggleBtn.title = 'Iniciar cronómetro';
        }
    }

    toggle() {
        if (this.isRunning) {
            this.pause();
        } else {
            this.start();
        }
    }

    reset() {
        this.pause();
        this.elapsedTime = 0;
        this.updateDisplay();
    }

    updateDisplay() {
        if (this.isRunning) {
            this.elapsedTime = Date.now() - this.startTime;
        }

        const minutes = Math.floor(this.elapsedTime / 60000);
        const seconds = Math.floor((this.elapsedTime % 60000) / 1000);
        
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        const timerValue = document.getElementById('timerValue');
        if (timerValue) {
            timerValue.textContent = timeString;

            // Change color based on time (30 minutes = 1800000 ms)
            timerValue.classList.remove('timer-warning', 'timer-danger');
            
            if (this.elapsedTime > this.targetDuration) { // Over 30 minutes
                timerValue.classList.add('timer-danger');
            } else if (this.elapsedTime > this.targetDuration * 0.83) { // Over 25 minutes (83% of 30)
                timerValue.classList.add('timer-warning');
            }
        }
    }
}

// Keyboard shortcuts helper
class KeyboardShortcuts {
    constructor() {
        this.createHelpButton();
    }

    createHelpButton() {
        const helpButton = document.createElement('button');
        helpButton.className = 'help-button';
        helpButton.innerHTML = '<span class="material-icons">help_outline</span>';
        helpButton.title = 'Atalhos de teclado';

        const helpStyles = `
            .help-button {
                position: fixed;
                bottom: 20px;
                left: 20px;
                width: 48px;
                height: 48px;
                border-radius: 50%;
                background: var(--color-primary);
                color: var(--color-btn-primary-text);
                border: none;
                cursor: pointer;
                font-size: 18px;
                font-weight: bold;
                box-shadow: var(--shadow-md);
                transition: all var(--duration-fast);
                z-index: 1000;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .help-button:hover {
                background: var(--color-primary-hover);
                transform: scale(1.1);
            }
            
            .help-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1002;
                backdrop-filter: blur(5px);
            }
            
            .help-content {
                background: var(--color-surface);
                padding: 32px;
                border-radius: 12px;
                max-width: 400px;
                width: 90%;
                box-shadow: var(--shadow-lg);
                border: 1px solid var(--color-card-border);
            }
            
            .help-content h3 {
                color: var(--color-primary);
                margin-bottom: 20px;
                text-align: center;
            }
            
            .shortcut-list {
                list-style: none;
                padding: 0;
                margin: 0;
            }
            
            .shortcut-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 0;
                border-bottom: 1px solid var(--color-border);
            }
            
            .shortcut-item:last-child {
                border-bottom: none;
            }
            
            .shortcut-key {
                background: var(--color-secondary);
                padding: 4px 8px;
                border-radius: 4px;
                font-family: var(--font-family-mono);
                font-size: 12px;
                font-weight: bold;
                color: var(--color-text);
            }
            
            .shortcut-desc {
                color: var(--color-text);
                font-size: 14px;
            }
        `;

        if (!document.querySelector('#help-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'help-styles';
            styleSheet.textContent = helpStyles;
            document.head.appendChild(styleSheet);
        }

        helpButton.addEventListener('click', () => {
            this.showHelpModal();
        });

        document.body.appendChild(helpButton);
    }

    showHelpModal() {
        const modal = document.createElement('div');
        modal.className = 'help-modal';
        modal.innerHTML = `
            <div class="help-content">
                <h3>Atalhos de Teclado</h3>
                <ul class="shortcut-list">
                    <li class="shortcut-item">
                        <span class="shortcut-desc">Próximo slide</span>
                        <span class="shortcut-key">→ / Espaço</span>
                    </li>
                    <li class="shortcut-item">
                        <span class="shortcut-desc">Slide anterior</span>
                        <span class="shortcut-key">←</span>
                    </li>
                    <li class="shortcut-item">
                        <span class="shortcut-desc">Primeiro slide</span>
                        <span class="shortcut-key">Home</span>
                    </li>
                    <li class="shortcut-item">
                        <span class="shortcut-desc">Último slide</span>
                        <span class="shortcut-key">End</span>
                    </li>
                    <li class="shortcut-item">
                        <span class="shortcut-desc">Slide direto</span>
                        <span class="shortcut-key">1-9</span>
                    </li>
                    <li class="shortcut-item">
                        <span class="shortcut-desc">Ecrã completo</span>
                        <span class="shortcut-key">Esc</span>
                    </li>
                </ul>
            </div>
        `;

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });

        // Close on Escape key
        const closeOnEscape = (e) => {
            if (e.key === 'Escape') {
                document.body.removeChild(modal);
                document.removeEventListener('keydown', closeOnEscape);
            }
        };
        document.addEventListener('keydown', closeOnEscape);

        document.body.appendChild(modal);
    }
}

// Toast notification system
class ToastNotifications {
    static show(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;
        toast.innerHTML = `
            <span class="toast-icon material-icons">${this.getIcon(type)}</span>
            <span class="toast-message">${message}</span>
        `;
        
        if (!document.querySelector('#toast-styles')) {
            const toastStyles = `
                .toast {
                    position: fixed;
                    bottom: 80px;
                    left: 50%;
                    transform: translateX(-50%) translateY(100px);
                    background: var(--color-surface);
                    color: var(--color-text);
                    padding: 12px 24px;
                    border-radius: 8px;
                    box-shadow: var(--shadow-lg);
                    border: 1px solid var(--color-card-border);
                    z-index: 1001;
                    opacity: 0;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    max-width: 400px;
                }
                
                .toast--success {
                    border-left: 4px solid var(--color-success);
                }
                
                .toast--error {
                    border-left: 4px solid var(--color-error);
                }
                
                .toast--warning {
                    border-left: 4px solid var(--color-warning);
                }
                
                .toast--info {
                    border-left: 4px solid var(--color-info);
                }
                
                .toast-icon {
                    font-size: 18px;
                    color: var(--color-primary);
                }
                
                .toast--success .toast-icon {
                    color: var(--color-success);
                }
                
                .toast--error .toast-icon {
                    color: var(--color-error);
                }
                
                .toast--warning .toast-icon {
                    color: var(--color-warning);
                }
                
                .toast-message {
                    font-size: 14px;
                    font-weight: 500;
                }
            `;

            const styleSheet = document.createElement('style');
            styleSheet.id = 'toast-styles';
            styleSheet.textContent = toastStyles;
            document.head.appendChild(styleSheet);
        }

        document.body.appendChild(toast);

        // Show toast
        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(-50%) translateY(0)';
        });

        // Remove toast after duration
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(100px)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, duration);
    }

    static getIcon(type) {
        const icons = {
            success: 'check_circle',
            error: 'error',
            warning: 'warning',
            info: 'info'
        };
        return icons[type] || 'info';
    }
}

// Image loading error handling
class ImageErrorHandler {
    static init() {
        // Handle image loading errors gracefully
        document.addEventListener('error', (e) => {
            if (e.target.tagName === 'IMG') {
                console.warn(`Failed to load image: ${e.target.src}`);
                e.target.style.display = 'none';
                
                // Show error placeholder if needed
                const placeholder = document.createElement('div');
                placeholder.className = 'image-placeholder';
                placeholder.innerHTML = `
                    <span class="material-icons">image_not_supported</span>
                    <p>Imagem não disponível</p>
                `;
                placeholder.style.cssText = `
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                    background: var(--color-secondary);
                    border-radius: var(--radius-md);
                    color: var(--color-text-secondary);
                    min-height: 200px;
                `;
                
                if (e.target.parentNode) {
                    e.target.parentNode.insertBefore(placeholder, e.target);
                }
            }
        }, true);
    }
}

// Initialize presentation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize image error handling first
    ImageErrorHandler.init();
    
    // Initialize main presentation controller
    const presentation = new PresentationController();
    
    // Initialize timer
    const timer = new PresentationTimer();
    
    // Initialize keyboard shortcuts help
    const shortcuts = new KeyboardShortcuts();
    
    // Show welcome notification
    setTimeout(() => {
        ToastNotifications.show('Apresentação carregada! Use as setas para navegar.', 'success');
    }, 1000);

    // Auto-start timer after 3 seconds
    setTimeout(() => {
        timer.start();
        ToastNotifications.show('Cronómetro iniciado automaticamente', 'info');
    }, 3000);

    // Add presentation to global scope for debugging
    window.presentation = presentation;
    window.timer = timer;
    window.ToastNotifications = ToastNotifications;
    
    // Handle visibility change (pause timer when tab is not visible)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && timer.isRunning) {
            timer.pause();
            ToastNotifications.show('Cronómetro pausado (separador inativo)', 'warning');
        }
    });

    // Handle fullscreen changes
    document.addEventListener('fullscreenchange', () => {
        if (document.fullscreenElement) {
            ToastNotifications.show('Modo de ecrã completo ativado', 'info');
        }
    });

    // Add reset shortcut (Ctrl+Home)
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Home') {
            e.preventDefault();
            presentation.resetPresentation();
            timer.reset();
        }
    });

    console.log('DispatcheurCC - Apresentação de Projeto Final carregada com sucesso!');
    console.log('Controlos disponíveis:');
    console.log('- Setas do teclado para navegação');
    console.log('- Botões de navegação no canto superior direito');
    console.log('- Números 1-9 para slides diretos');
    console.log('- Ctrl+Home para reiniciar');
    console.log('- Botão ? para ver todos os atalhos');
});