/**
 * Exemplos de Uso da Base de Segurança
 * Este arquivo demonstra como usar as funções de segurança em diferentes cenários
 */

// ============================================
// EXEMPLO 1: Validação de Formulário Completo
// ============================================

function exemploValidacaoFormulario() {
    const form = document.getElementById('meu-formulario');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const rules = SecurityConfig.formValidation;
        const validation = SecurityUtils.validateForm(formData, rules);
        
        if (!validation.valid) {
            // Exibir erros
            Object.keys(validation.errors).forEach(field => {
                console.error(`${field}: ${validation.errors[field]}`);
            });
            return;
        }
        
        // Usar dados sanitizados
        console.log('Dados válidos:', validation.data);
    });
}

// ============================================
// EXEMPLO 2: Sanitização de Entrada do Usuário
// ============================================

function exemploSanitizacao() {
    const userInput = document.getElementById('comentario').value;
    
    // Sanitiza entrada antes de exibir
    const safeInput = SecurityUtils.sanitizeInput(userInput);
    
    // Agora pode ser inserido no DOM com segurança
    document.getElementById('comentario-exibido').innerHTML = safeInput;
}

// ============================================
// EXEMPLO 3: Validação de Email
// ============================================

function exemploValidacaoEmail() {
    const email = document.getElementById('email').value;
    
    if (SecurityUtils.validateEmail(email)) {
        console.log('Email válido');
        // Prosseguir com o email
    } else {
        console.error('Email inválido');
        // Exibir erro
    }
}

// ============================================
// EXEMPLO 4: Proteção CSRF
// ============================================

function exemploCSRF() {
    // Gerar token ao carregar a página
    const csrfToken = SecurityUtils.generateCSRFToken();
    sessionStorage.setItem('csrf_token', csrfToken);
    
    // Incluir token no formulário (campo hidden)
    const form = document.getElementById('formulario-seguro');
    const tokenInput = document.createElement('input');
    tokenInput.type = 'hidden';
    tokenInput.name = 'csrf_token';
    tokenInput.value = csrfToken;
    form.appendChild(tokenInput);
    
    // Validar token ao enviar
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const submittedToken = form.querySelector('[name="csrf_token"]').value;
        const storedToken = sessionStorage.getItem('csrf_token');
        
        if (!SecurityUtils.validateCSRFToken(submittedToken, storedToken)) {
            alert('Token inválido. Por favor, recarregue a página.');
            return;
        }
        
        // Token válido, prosseguir
        console.log('Formulário seguro enviado');
    });
}

// ============================================
// EXEMPLO 5: Rate Limiting
// ============================================

function exemploRateLimiting() {
    const email = document.getElementById('email-login').value;
    
    // Verificar rate limit antes de processar login
    const allowed = SecurityUtils.checkRateLimit(
        email,
        SecurityConfig.rateLimit.maxAttempts,
        SecurityConfig.rateLimit.windowMs
    );
    
    if (!allowed) {
        alert('Muitas tentativas. Aguarde alguns minutos.');
        return;
    }
    
    // Prosseguir com login
    console.log('Tentativa de login permitida');
}

// ============================================
// EXEMPLO 6: Validação de URL
// ============================================

function exemploValidacaoURL() {
    const userUrl = document.getElementById('url-input').value;
    
    // Validar URL (exige HTTPS)
    if (SecurityUtils.validateURL(userUrl, true)) {
        // URL segura
        window.location.href = userUrl;
    } else {
        alert('URL inválida ou insegura. Use HTTPS.');
    }
}

// ============================================
// EXEMPLO 7: Detecção de XSS
// ============================================

function exemploDetecaoXSS() {
    const userInput = document.getElementById('entrada-usuario').value;
    
    if (SecurityUtils.detectXSS(userInput)) {
        alert('Entrada suspeita detectada. Por favor, revise seus dados.');
        return;
    }
    
    // Entrada segura, prosseguir
    console.log('Entrada validada');
}

// ============================================
// EXEMPLO 8: Validação de Telefone Brasileiro
// ============================================

function exemploValidacaoTelefone() {
    const phone = document.getElementById('telefone').value;
    
    if (SecurityUtils.validatePhone(phone)) {
        console.log('Telefone válido');
        // Formatar telefone
        const cleaned = phone.replace(/\D/g, '');
        console.log('Telefone limpo:', cleaned);
    } else {
        console.error('Telefone inválido');
    }
}

// ============================================
// EXEMPLO 9: Sanitização de SQL (para backend)
// ============================================

function exemploSanitizacaoSQL() {
    const userInput = document.getElementById('busca').value;
    
    // Sanitiza para uso em queries SQL
    const safeInput = SecurityUtils.sanitizeSQL(userInput);
    
    // Agora pode ser usado em query (mas sempre use prepared statements no backend!)
    console.log('Input sanitizado para SQL:', safeInput);
}

// ============================================
// EXEMPLO 10: Validação de Texto com Limites
// ============================================

function exemploValidacaoTexto() {
    const texto = document.getElementById('descricao').value;
    
    const validation = SecurityUtils.validateText(texto, 500, 10);
    
    if (!validation.valid) {
        console.error('Erro:', validation.error);
        return;
    }
    
    console.log('Texto válido');
}

// ============================================
// EXEMPLO 11: Formulário Completo com Todas as Proteções
// ============================================

function exemploFormularioCompleto() {
    const form = document.getElementById('formulario-completo');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // 1. Rate Limiting
        const email = form.querySelector('[name="email"]').value;
        if (!SecurityUtils.checkRateLimit(email)) {
            alert('Muitas tentativas. Aguarde alguns minutos.');
            return;
        }
        
        // 2. Validação e Sanitização
        const formData = new FormData(form);
        const validation = SecurityUtils.validateForm(formData, SecurityConfig.formValidation);
        
        if (!validation.valid) {
            // Exibir erros
            Object.keys(validation.errors).forEach(field => {
                console.error(`${field}: ${validation.errors[field]}`);
            });
            return;
        }
        
        // 3. Detecção de XSS
        const hasXSS = Object.values(validation.data).some(value => 
            typeof value === 'string' && SecurityUtils.detectXSS(value)
        );
        
        if (hasXSS) {
            alert('Entrada suspeita detectada.');
            return;
        }
        
        // 4. Dados prontos para envio
        const safeData = validation.data;
        
        // 5. Enviar para servidor
        try {
            const response = await fetch('/api/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(safeData)
            });
            
            if (response.ok) {
                alert('Enviado com sucesso!');
                form.reset();
            } else {
                throw new Error('Erro no servidor');
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao enviar. Tente novamente.');
        }
    });
}

// ============================================
// EXEMPLO 12: Proteção de Dados Sensíveis
// ============================================

function exemploProtecaoDadosSensiveis() {
    // NUNCA armazene dados sensíveis sem criptografia
    // Este é um exemplo do que NÃO fazer:
    // localStorage.setItem('senha', senha); // ❌ ERRADO
    
    // Para dados não sensíveis, pode usar localStorage
    const preferencias = {
        tema: 'escuro',
        idioma: 'pt-BR'
    };
    localStorage.setItem('preferencias', JSON.stringify(preferencias)); // ✅ OK
    
    // Para dados sensíveis, use sessionStorage e limpe após uso
    const tokenTemporario = SecurityUtils.generateCSRFToken();
    sessionStorage.setItem('temp_token', tokenTemporario);
    
    // Limpar após uso
    setTimeout(() => {
        sessionStorage.removeItem('temp_token');
    }, 3600000); // 1 hora
}

// ============================================
// NOTAS IMPORTANTES
// ============================================

/*
 * 1. SEMPRE valide no servidor também. Validação no cliente é apenas para UX.
 * 
 * 2. Use HTTPS em produção para proteger dados em trânsito.
 * 
 * 3. Para senhas, use hash seguro (bcrypt, argon2) no servidor.
 * 
 * 4. Use prepared statements para queries SQL no backend.
 * 
 * 5. Implemente logging de tentativas suspeitas.
 * 
 * 6. Mantenha dependências atualizadas.
 * 
 * 7. Faça auditorias de segurança regularmente.
 */
