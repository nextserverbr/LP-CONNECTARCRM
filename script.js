// Mobile Menu Toggle
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav__link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Header scroll effect
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
    } else {
        header.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
    }
    
    lastScroll = currentScroll;
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
const animateElements = document.querySelectorAll('.feature__card, .step, .testimonial__card');
animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Form submission handler with security
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    // Função para exibir erros de validação
    const showFieldError = (fieldName, errorMessage) => {
        const field = contactForm.querySelector(`[name="${fieldName}"]`);
        if (field) {
            // Remove erro anterior
            const existingError = field.parentElement.querySelector('.field-error');
            if (existingError) {
                existingError.remove();
            }
            
            // Adiciona novo erro
            const errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            errorDiv.style.color = '#ef4444';
            errorDiv.style.fontSize = '0.875rem';
            errorDiv.style.marginTop = '0.25rem';
            errorDiv.textContent = errorMessage;
            field.parentElement.appendChild(errorDiv);
            
            // Adiciona classe de erro ao campo
            field.style.borderColor = '#ef4444';
        }
    };

    // Função para limpar erros
    const clearErrors = () => {
        const errorMessages = contactForm.querySelectorAll('.field-error');
        errorMessages.forEach(error => error.remove());
        
        const fields = contactForm.querySelectorAll('input, textarea');
        fields.forEach(field => {
            field.style.borderColor = '';
        });
    };

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearErrors();
        
        // Rate limiting - proteção contra força bruta
        const emailInput = contactForm.querySelector('[name="email"]');
        const userKey = emailInput ? emailInput.value || 'anonymous' : 'anonymous';
        
        if (window.SecurityUtils && window.SecurityConfig) {
            const rateLimitConfig = window.SecurityConfig.rateLimit;
            if (rateLimitConfig.enabled) {
                const allowed = window.SecurityUtils.checkRateLimit(
                    userKey,
                    rateLimitConfig.maxAttempts,
                    rateLimitConfig.windowMs
                );
                
                if (!allowed) {
                    alert('Muitas tentativas detectadas. Por favor, aguarde alguns minutos antes de tentar novamente.');
                    return;
                }
            }

            // Validação e sanitização de dados
            const formData = new FormData(contactForm);
            const validationRules = window.SecurityConfig.formValidation;
            const validation = window.SecurityUtils.validateForm(formData, validationRules);
            
            if (!validation.valid) {
                // Exibir erros de validação
                Object.keys(validation.errors).forEach(field => {
                    showFieldError(field, validation.errors[field]);
                });
                return;
            }

            // Dados sanitizados e validados
            const safeData = validation.data;

            // Detecção de XSS adicional
            Object.values(safeData).forEach(value => {
                if (typeof value === 'string' && window.SecurityUtils.detectXSS(value)) {
                    alert('Entrada suspeita detectada. Por favor, revise seus dados.');
                    return;
                }
            });

            // Aqui você enviaria os dados para o servidor
            // Exemplo com fetch:
            try {
                // Simulação de envio (descomente e ajuste para seu endpoint)
                /*
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(safeData)
                });

                if (response.ok) {
                    const result = await response.json();
                    alert('Obrigado pelo seu interesse! Nossa equipe entrará em contato em breve.');
                    contactForm.reset();
                } else {
                    throw new Error('Erro ao enviar formulário');
                }
                */
                
                // Por enquanto, apenas mostra mensagem de sucesso
                console.log('Dados validados e sanitizados:', safeData);
                alert('Obrigado pelo seu interesse! Nossa equipe entrará em contato em breve.');
                contactForm.reset();
                
            } catch (error) {
                console.error('Erro ao enviar formulário:', error);
                alert('Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente mais tarde.');
            }
        } else {
            // Fallback caso os scripts de segurança não estejam carregados
            console.warn('Scripts de segurança não carregados. Validação básica aplicada.');
            
            // Validação básica
            const name = contactForm.querySelector('[name="name"]').value.trim();
            const email = contactForm.querySelector('[name="email"]').value.trim();
            const phone = contactForm.querySelector('[name="phone"]').value.trim();
            
            if (!name || name.length < 2) {
                showFieldError('name', 'Nome deve ter pelo menos 2 caracteres');
                return;
            }
            
            if (!email || !email.includes('@')) {
                showFieldError('email', 'Email inválido');
                return;
            }
            
            if (!phone) {
                showFieldError('phone', 'Telefone é obrigatório');
                return;
            }
            
            alert('Obrigado pelo seu interesse! Nossa equipe entrará em contato em breve.');
            contactForm.reset();
        }
    });

    // Validação em tempo real (opcional)
    const fields = contactForm.querySelectorAll('input, textarea');
    fields.forEach(field => {
        field.addEventListener('blur', () => {
            if (window.SecurityUtils && window.SecurityConfig) {
                const fieldName = field.name;
                const fieldValue = field.value;
                const rules = window.SecurityConfig.formValidation[fieldName];
                
                if (rules && fieldValue) {
                    const formData = new FormData();
                    formData.set(fieldName, fieldValue);
                    
                    const validation = window.SecurityUtils.validateForm(formData, {
                        [fieldName]: rules
                    });
                    
                    if (!validation.valid && validation.errors[fieldName]) {
                        showFieldError(fieldName, validation.errors[fieldName]);
                    } else {
                        const existingError = field.parentElement.querySelector('.field-error');
                        if (existingError) {
                            existingError.remove();
                            field.style.borderColor = '';
                        }
                    }
                }
            }
        });
        
        // Limpar erro ao digitar
        field.addEventListener('input', () => {
            const existingError = field.parentElement.querySelector('.field-error');
            if (existingError) {
                existingError.remove();
                field.style.borderColor = '';
            }
        });
    });
}

// Counter animation for stats
const animateCounter = (element, target, duration = 2000) => {
    let start = 0;
    const increment = target / (duration / 16);
    
    const updateCounter = () => {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start) + (element.textContent.includes('K') ? 'K+' : element.textContent.includes('%') ? '%' : '');
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + (element.textContent.includes('K') ? 'K+' : element.textContent.includes('%') ? '%' : '');
        }
    };
    
    updateCounter();
};

// Observe stats section for counter animation
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const stats = entry.target.querySelectorAll('.stat h3');
            stats.forEach(stat => {
                const text = stat.textContent;
                const number = parseInt(text.replace(/\D/g, ''));
                if (number && !stat.classList.contains('animated')) {
                    stat.classList.add('animated');
                    animateCounter(stat, number);
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero__stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

// Parallax effect for hero dashboard
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroDashboard = document.querySelector('.hero__dashboard');
    if (heroDashboard && scrolled < window.innerHeight) {
        heroDashboard.style.transform = `perspective(1000px) rotateY(-5deg) rotateX(5deg) translateY(${scrolled * 0.3}px)`;
    }
});

// Add active state to navigation links based on scroll position
const sections = document.querySelectorAll('section[id]');
const navLinksArray = Array.from(document.querySelectorAll('.nav__link'));

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinksArray.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});
