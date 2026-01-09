/**
 * Biblioteca de Segurança - Base para Projetos Web
 * Fornece utilitários para sanitização, validação e proteção contra vulnerabilidades comuns
 */

class SecurityUtils {
    /**
     * Sanitiza entrada de texto removendo tags HTML e caracteres perigosos
     * @param {string} input - Texto a ser sanitizado
     * @param {boolean} allowBasicFormatting - Permite formatação básica (negrito, itálico)
     * @returns {string} - Texto sanitizado
     */
    static sanitizeInput(input, allowBasicFormatting = false) {
        if (typeof input !== 'string') {
            return '';
        }

        // Remove tags HTML perigosas
        let sanitized = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        sanitized = sanitized.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
        sanitized = sanitized.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '');
        sanitized = sanitized.replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '');
        sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, ''); // Remove event handlers

        if (!allowBasicFormatting) {
            // Remove todas as tags HTML
            sanitized = sanitized.replace(/<[^>]+>/g, '');
        }

        // Escapa caracteres especiais
        sanitized = sanitized
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;');

        // Remove caracteres de controle
        sanitized = sanitized.replace(/[\x00-\x1F\x7F]/g, '');

        return sanitized.trim();
    }

    /**
     * Valida formato de email
     * @param {string} email - Email a ser validado
     * @returns {boolean} - true se válido
     */
    static validateEmail(email) {
        if (!email || typeof email !== 'string') {
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const maxLength = 254; // RFC 5321

        if (email.length > maxLength) {
            return false;
        }

        // Previne email injection
        const dangerousChars = /[<>\"'%;()&+]/.test(email);
        if (dangerousChars) {
            return false;
        }

        return emailRegex.test(email);
    }

    /**
     * Valida formato de telefone (Brasil)
     * @param {string} phone - Telefone a ser validado
     * @returns {boolean} - true se válido
     */
    static validatePhone(phone) {
        if (!phone || typeof phone !== 'string') {
            return false;
        }

        // Remove caracteres não numéricos
        const cleaned = phone.replace(/\D/g, '');

        // Valida formato brasileiro (10 ou 11 dígitos)
        return /^[1-9]{2}9?[0-9]{8}$/.test(cleaned);
    }

    /**
     * Valida URL
     * @param {string} url - URL a ser validada
     * @param {boolean} requireHttps - Exige HTTPS
     * @returns {boolean} - true se válida
     */
    static validateURL(url, requireHttps = true) {
        if (!url || typeof url !== 'string') {
            return false;
        }

        try {
            const urlObj = new URL(url);
            
            if (requireHttps && urlObj.protocol !== 'https:') {
                return false;
            }

            // Previne javascript: e data: URLs
            if (['javascript:', 'data:', 'vbscript:'].includes(urlObj.protocol)) {
                return false;
            }

            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Valida entrada de texto (tamanho, caracteres permitidos)
     * @param {string} text - Texto a ser validado
     * @param {number} maxLength - Tamanho máximo
     * @param {number} minLength - Tamanho mínimo
     * @returns {object} - { valid: boolean, error: string }
     */
    static validateText(text, maxLength = 1000, minLength = 0) {
        if (typeof text !== 'string') {
            return { valid: false, error: 'Tipo de dado inválido' };
        }

        if (text.length < minLength) {
            return { valid: false, error: `Mínimo de ${minLength} caracteres` };
        }

        if (text.length > maxLength) {
            return { valid: false, error: `Máximo de ${maxLength} caracteres` };
        }

        // Verifica caracteres de controle perigosos
        if (/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/.test(text)) {
            return { valid: false, error: 'Caracteres inválidos detectados' };
        }

        return { valid: true, error: null };
    }

    /**
     * Protege contra SQL Injection (sanitiza para uso em queries)
     * @param {string} input - Entrada a ser sanitizada
     * @returns {string} - Entrada sanitizada
     */
    static sanitizeSQL(input) {
        if (typeof input !== 'string') {
            return '';
        }

        // Remove caracteres perigosos para SQL
        return input
            .replace(/['";\\]/g, '')
            .replace(/--/g, '')
            .replace(/\/\*/g, '')
            .replace(/\*\//g, '')
            .replace(/xp_/gi, '')
            .replace(/sp_/gi, '')
            .trim();
    }

    /**
     * Gera token CSRF simples
     * @returns {string} - Token CSRF
     */
    static generateCSRFToken() {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    /**
     * Valida token CSRF
     * @param {string} token - Token a ser validado
     * @param {string} storedToken - Token armazenado
     * @returns {boolean} - true se válido
     */
    static validateCSRFToken(token, storedToken) {
        if (!token || !storedToken) {
            return false;
        }

        // Comparação segura contra timing attacks
        if (token.length !== storedToken.length) {
            return false;
        }

        let result = 0;
        for (let i = 0; i < token.length; i++) {
            result |= token.charCodeAt(i) ^ storedToken.charCodeAt(i);
        }

        return result === 0;
    }

    /**
     * Protege contra ataques de força bruta (rate limiting simples)
     * @param {string} key - Chave única (ex: IP, email)
     * @param {number} maxAttempts - Máximo de tentativas
     * @param {number} windowMs - Janela de tempo em ms
     * @returns {boolean} - true se permitido
     */
    static checkRateLimit(key, maxAttempts = 5, windowMs = 15 * 60 * 1000) {
        const storageKey = `rate_limit_${key}`;
        const now = Date.now();
        const stored = localStorage.getItem(storageKey);

        if (!stored) {
            localStorage.setItem(storageKey, JSON.stringify({
                attempts: 1,
                resetTime: now + windowMs
            }));
            return true;
        }

        const data = JSON.parse(stored);

        if (now > data.resetTime) {
            localStorage.setItem(storageKey, JSON.stringify({
                attempts: 1,
                resetTime: now + windowMs
            }));
            return true;
        }

        if (data.attempts >= maxAttempts) {
            return false;
        }

        data.attempts++;
        localStorage.setItem(storageKey, JSON.stringify(data));
        return true;
    }

    /**
     * Valida e sanitiza dados de formulário
     * @param {FormData} formData - Dados do formulário
     * @param {object} rules - Regras de validação
     * @returns {object} - { valid: boolean, data: object, errors: object }
     */
    static validateForm(formData, rules) {
        const data = {};
        const errors = {};
        let isValid = true;

        for (const [field, rule] of Object.entries(rules)) {
            const value = formData.get(field) || '';

            // Sanitização
            let sanitized = this.sanitizeInput(value);

            // Validação específica
            if (rule.required && !sanitized.trim()) {
                errors[field] = `${rule.label || field} é obrigatório`;
                isValid = false;
                continue;
            }

            if (rule.type === 'email' && sanitized) {
                if (!this.validateEmail(sanitized)) {
                    errors[field] = 'Email inválido';
                    isValid = false;
                    continue;
                }
            }

            if (rule.type === 'phone' && sanitized) {
                if (!this.validatePhone(sanitized)) {
                    errors[field] = 'Telefone inválido';
                    isValid = false;
                    continue;
                }
            }

            if (rule.minLength && sanitized.length < rule.minLength) {
                errors[field] = `Mínimo de ${rule.minLength} caracteres`;
                isValid = false;
                continue;
            }

            if (rule.maxLength && sanitized.length > rule.maxLength) {
                errors[field] = `Máximo de ${rule.maxLength} caracteres`;
                isValid = false;
                continue;
            }

            if (rule.pattern && sanitized) {
                const regex = new RegExp(rule.pattern);
                if (!regex.test(sanitized)) {
                    errors[field] = rule.patternError || 'Formato inválido';
                    isValid = false;
                    continue;
                }
            }

            data[field] = sanitized;
        }

        return { valid: isValid, data, errors };
    }

    /**
     * Detecta tentativas de XSS em entrada
     * @param {string} input - Entrada a ser verificada
     * @returns {boolean} - true se suspeito de XSS
     */
    static detectXSS(input) {
        if (typeof input !== 'string') {
            return false;
        }

        const xssPatterns = [
            /<script/i,
            /javascript:/i,
            /on\w+\s*=/i,
            /<iframe/i,
            /<object/i,
            /<embed/i,
            /expression\s*\(/i,
            /vbscript:/i,
            /data:text\/html/i
        ];

        return xssPatterns.some(pattern => pattern.test(input));
    }

    /**
     * Hash simples de string (não criptográfico, apenas para comparação)
     * @param {string} str - String a ser hasheada
     * @returns {string} - Hash
     */
    static simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash).toString(36);
    }
}

// Exporta para uso em módulos ES6 ou como global
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SecurityUtils;
} else {
    window.SecurityUtils = SecurityUtils;
}
