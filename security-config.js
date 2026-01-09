/**
 * Configurações de Segurança
 * Centraliza todas as configurações de segurança do projeto
 */

const SecurityConfig = {
    // Configurações de validação de formulário
    formValidation: {
        name: {
            required: true,
            minLength: 2,
            maxLength: 100,
            label: 'Nome'
        },
        email: {
            required: true,
            type: 'email',
            maxLength: 254,
            label: 'Email'
        },
        phone: {
            required: true,
            type: 'phone',
            label: 'Telefone'
        },
        company: {
            required: false,
            maxLength: 200,
            label: 'Empresa'
        },
        message: {
            required: false,
            maxLength: 2000,
            label: 'Mensagem'
        }
    },

    // Configurações de rate limiting
    rateLimit: {
        enabled: true,
        maxAttempts: 5,
        windowMs: 15 * 60 * 1000, // 15 minutos
        lockoutDuration: 30 * 60 * 1000 // 30 minutos de bloqueio
    },

    // Configurações de Content Security Policy
    csp: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        upgradeInsecureRequests: true
    },

    // Headers de segurança recomendados
    securityHeaders: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
    },

    // Configurações de sanitização
    sanitization: {
        allowBasicFormatting: false,
        maxInputLength: 10000,
        stripControlChars: true
    },

    // Configurações de CSRF
    csrf: {
        enabled: true,
        tokenLength: 32,
        tokenName: 'csrf_token'
    },

    // URLs permitidas para redirecionamento
    allowedRedirects: [
        '/',
        '/index.html',
        '/success.html',
        '/error.html'
    ],

    // Padrões de bloqueio (para detecção de ataques)
    blockPatterns: [
        /union.*select/i,
        /drop.*table/i,
        /insert.*into/i,
        /delete.*from/i,
        /exec.*\(/i,
        /script.*alert/i,
        /<iframe/i,
        /javascript:/i
    ],

    // Configurações de logging de segurança
    logging: {
        enabled: true,
        logSuspiciousActivity: true,
        logFailedAttempts: true
    }
};

// Exporta para uso
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SecurityConfig;
} else {
    window.SecurityConfig = SecurityConfig;
}
