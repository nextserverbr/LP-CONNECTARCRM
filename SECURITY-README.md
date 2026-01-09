# 🔒 Base de Cybersegurança - Guia Rápido

Esta base de segurança fornece proteções essenciais para seus projetos web.

## 🚀 Início Rápido

### 1. Inclua os arquivos no seu HTML

```html
<!DOCTYPE html>
<html>
<head>
    <!-- ... -->
    <!-- Security Scripts (antes do seu script.js) -->
    <script src="security-config.js"></script>
    <script src="security.js"></script>
</head>
<body>
    <!-- ... -->
    <script src="script.js"></script>
</body>
</html>
```

### 2. Use no seu formulário

```javascript
const form = document.getElementById('meu-formulario');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Validação automática
    const formData = new FormData(form);
    const validation = SecurityUtils.validateForm(
        formData, 
        SecurityConfig.formValidation
    );
    
    if (!validation.valid) {
        // Exibir erros
        console.log(validation.errors);
        return;
    }
    
    // Dados sanitizados e seguros
    console.log(validation.data);
});
```

## 📚 Funcionalidades Principais

### ✅ Validação de Formulários
Validação completa com regras customizáveis:
- Email
- Telefone (formato brasileiro)
- Texto com limites
- Campos obrigatórios

### 🛡️ Sanitização
Proteção contra XSS:
- Remove tags HTML perigosas
- Escapa caracteres especiais
- Remove scripts e iframes

### 🔐 Proteção CSRF
Geração e validação de tokens:
```javascript
const token = SecurityUtils.generateCSRFToken();
// Validar antes de enviar formulário
```

### ⏱️ Rate Limiting
Proteção contra força bruta:
```javascript
if (!SecurityUtils.checkRateLimit(email)) {
    // Bloquear tentativa
}
```

### 🔍 Detecção de Ataques
Detecta padrões suspeitos:
- XSS
- SQL Injection
- Entradas maliciosas

## 📁 Arquivos

| Arquivo | Descrição |
|---------|-----------|
| `security.js` | Biblioteca principal de segurança |
| `security-config.js` | Configurações de segurança |
| `security-example.js` | Exemplos de uso |
| `.htaccess` | Configurações de segurança Apache |
| `SECURITY.md` | Documentação completa |

## ⚙️ Configuração

Edite `security-config.js` para personalizar:

```javascript
const SecurityConfig = {
    formValidation: {
        // Suas regras de validação
    },
    rateLimit: {
        maxAttempts: 5,
        windowMs: 15 * 60 * 1000
    }
    // ...
};
```

## 🔧 Exemplos de Uso

### Validar Email
```javascript
if (SecurityUtils.validateEmail(email)) {
    // Email válido
}
```

### Sanitizar Entrada
```javascript
const safe = SecurityUtils.sanitizeInput(userInput);
```

### Validar Telefone
```javascript
if (SecurityUtils.validatePhone(phone)) {
    // Telefone válido (formato brasileiro)
}
```

### Rate Limiting
```javascript
const allowed = SecurityUtils.checkRateLimit(
    userEmail,
    5,  // max tentativas
    900000  // 15 minutos
);
```

## ⚠️ Importante

1. **Validação no servidor é obrigatória** - A validação no cliente é apenas para UX
2. **Use HTTPS em produção** - Sempre use HTTPS para proteger dados
3. **Mantenha atualizado** - Revise e atualize regularmente
4. **Logs de segurança** - Implemente logging de tentativas suspeitas

## 📖 Documentação Completa

Veja `SECURITY.md` para documentação detalhada e boas práticas.

## 🆘 Suporte

Para dúvidas ou problemas:
1. Consulte `SECURITY.md`
2. Veja exemplos em `security-example.js`
3. Revise a documentação OWASP

---

**Lembre-se**: Segurança é um processo contínuo, não um produto. Revise e atualize regularmente!
