# Guia de Segurança - Base de Cybersegurança

Este documento descreve as práticas de segurança implementadas neste projeto e como utilizá-las.

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Arquivos de Segurança](#arquivos-de-segurança)
3. [Proteções Implementadas](#proteções-implementadas)
4. [Como Usar](#como-usar)
5. [Boas Práticas](#boas-práticas)
6. [Checklist de Segurança](#checklist-de-segurança)

## 🔒 Visão Geral

Esta base de segurança fornece proteção contra vulnerabilidades comuns em aplicações web:

- **XSS (Cross-Site Scripting)**: Sanitização de entrada e validação
- **SQL Injection**: Sanitização de dados antes de queries
- **CSRF (Cross-Site Request Forgery)**: Tokens de proteção
- **Rate Limiting**: Proteção contra força bruta
- **Validação de Entrada**: Validação robusta de formulários
- **Headers de Segurança**: Configuração de headers HTTP seguros

## 📁 Arquivos de Segurança

### `security.js`
Biblioteca principal com utilitários de segurança:
- Sanitização de entrada
- Validação de dados
- Proteção CSRF
- Rate limiting
- Detecção de XSS

### `security-config.js`
Configurações centralizadas de segurança:
- Regras de validação
- Configurações de rate limiting
- Headers de segurança
- Políticas CSP

### `.htaccess` (Apache)
Configurações de segurança no servidor Apache

## 🛡️ Proteções Implementadas

### 1. Sanitização de Entrada

Todas as entradas do usuário são sanitizadas para prevenir XSS:

```javascript
const userInput = SecurityUtils.sanitizeInput(formData.get('message'));
```

### 2. Validação de Formulários

Validação completa com regras customizáveis:

```javascript
const rules = SecurityConfig.formValidation;
const result = SecurityUtils.validateForm(formData, rules);

if (!result.valid) {
    // Exibir erros
    console.log(result.errors);
} else {
    // Usar dados sanitizados
    console.log(result.data);
}
```

### 3. Proteção CSRF

Geração e validação de tokens CSRF:

```javascript
// Gerar token
const token = SecurityUtils.generateCSRFToken();
sessionStorage.setItem('csrf_token', token);

// Validar token
const isValid = SecurityUtils.validateCSRFToken(
    submittedToken,
    sessionStorage.getItem('csrf_token')
);
```

### 4. Rate Limiting

Proteção contra ataques de força bruta:

```javascript
const allowed = SecurityUtils.checkRateLimit(
    userEmail,
    SecurityConfig.rateLimit.maxAttempts,
    SecurityConfig.rateLimit.windowMs
);

if (!allowed) {
    // Bloquear tentativa
}
```

### 5. Validação de Email e Telefone

Validação específica para dados brasileiros:

```javascript
if (SecurityUtils.validateEmail(email)) {
    // Email válido
}

if (SecurityUtils.validatePhone(phone)) {
    // Telefone válido (formato brasileiro)
}
```

## 💻 Como Usar

### 1. Incluir os Arquivos

Adicione os scripts no HTML antes do seu código:

```html
<script src="security-config.js"></script>
<script src="security.js"></script>
<script src="script.js"></script>
```

### 2. Proteger Formulários

Exemplo completo de formulário protegido:

```javascript
const form = document.getElementById('contact-form');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Rate limiting
    const userKey = form.email.value || 'anonymous';
    if (!SecurityUtils.checkRateLimit(userKey)) {
        alert('Muitas tentativas. Tente novamente mais tarde.');
        return;
    }

    // Validar formulário
    const formData = new FormData(form);
    const rules = SecurityConfig.formValidation;
    const validation = SecurityUtils.validateForm(formData, rules);

    if (!validation.valid) {
        // Exibir erros
        Object.keys(validation.errors).forEach(field => {
            const errorMsg = validation.errors[field];
            // Exibir erro no campo correspondente
        });
        return;
    }

    // Dados sanitizados e validados
    const safeData = validation.data;

    // Enviar para servidor
    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(safeData)
        });

        if (response.ok) {
            alert('Mensagem enviada com sucesso!');
            form.reset();
        }
    } catch (error) {
        console.error('Erro ao enviar:', error);
    }
});
```

### 3. Sanitizar Dados Antes de Exibir

Sempre sanitize dados antes de inserir no DOM:

```javascript
const userComment = userInput.value;
const safeComment = SecurityUtils.sanitizeInput(userComment);
document.getElementById('comment').innerHTML = safeComment;
```

### 4. Validar URLs Antes de Usar

```javascript
const userUrl = form.url.value;
if (SecurityUtils.validateURL(userUrl, true)) {
    // URL segura, usar
    window.location.href = userUrl;
} else {
    alert('URL inválida ou insegura');
}
```

## ✅ Boas Práticas

### 1. **Nunca Confie em Dados do Cliente**
Sempre valide e sanitize dados do lado do servidor também.

### 2. **Use HTTPS**
Sempre use HTTPS em produção para proteger dados em trânsito.

### 3. **Valide no Cliente E no Servidor**
Validação no cliente melhora UX, mas validação no servidor é obrigatória.

### 4. **Mantenha Dependências Atualizadas**
Atualize regularmente bibliotecas e frameworks.

### 5. **Implemente Logging**
Registre tentativas suspeitas e falhas de autenticação.

### 6. **Use Headers de Segurança**
Configure headers HTTP de segurança no servidor.

### 7. **Content Security Policy (CSP)**
Implemente CSP para prevenir XSS.

### 8. **Não Armazene Dados Sensíveis no Cliente**
Nunca armazene senhas, tokens de acesso ou dados sensíveis no localStorage/sessionStorage sem criptografia.

## 📝 Checklist de Segurança

Use este checklist ao implementar novas funcionalidades:

### Entrada de Dados
- [ ] Todas as entradas são sanitizadas
- [ ] Validação de tipo e formato
- [ ] Limites de tamanho implementados
- [ ] Caracteres perigosos removidos

### Formulários
- [ ] Validação no cliente
- [ ] Validação no servidor (obrigatório)
- [ ] Proteção CSRF implementada
- [ ] Rate limiting ativo
- [ ] Mensagens de erro não expõem informações sensíveis

### Autenticação
- [ ] Senhas nunca armazenadas em texto plano
- [ ] Tokens seguros e com expiração
- [ ] Proteção contra força bruta
- [ ] Sessões seguras

### Comunicação
- [ ] HTTPS em produção
- [ ] Headers de segurança configurados
- [ ] CSP implementado
- [ ] CORS configurado corretamente

### Armazenamento
- [ ] Dados sensíveis criptografados
- [ ] Cookies com flags seguros (HttpOnly, Secure, SameSite)
- [ ] LocalStorage usado apenas para dados não sensíveis

### Logging e Monitoramento
- [ ] Tentativas suspeitas registradas
- [ ] Falhas de autenticação logadas
- [ ] Monitoramento de atividades anômalas

## 🔐 Headers de Segurança Recomendados

Configure estes headers no seu servidor:

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

## 🚨 Em Caso de Incidente

1. **Isole o sistema afetado**
2. **Preserve evidências** (logs, dados)
3. **Notifique usuários afetados** (se necessário)
4. **Corrija a vulnerabilidade**
5. **Teste a correção**
6. **Monitore por atividades suspeitas**

## 📚 Recursos Adicionais

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [Web.dev Security](https://web.dev/secure/)

## 🔄 Atualizações

Esta base de segurança deve ser revisada e atualizada regularmente conforme novas vulnerabilidades são descobertas.

---

**Importante**: Esta base fornece proteções básicas. Para aplicações críticas, considere:
- Auditorias de segurança profissionais
- Testes de penetração
- Implementação de WAF (Web Application Firewall)
- Monitoramento contínuo de segurança
