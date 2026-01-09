# ConnectarCRM - Landing Page

Landing page moderna e responsiva para o ConnectarCRM, um CRM focado em vendas.

## 🚀 Características

- **Design Moderno**: Interface limpa e profissional com gradientes e animações suaves
- **Totalmente Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- **Otimizado para Conversão**: Estrutura focada em conversão de visitantes em clientes
- **Performance**: Código otimizado e carregamento rápido
- **Animações Suaves**: Efeitos de scroll e interações que melhoram a experiência do usuário

## 📁 Estrutura de Arquivos

```
.
├── index.html      # Estrutura HTML da landing page
├── styles.css      # Estilos e design responsivo
├── script.js      # Interatividade e animações
└── README.md      # Este arquivo
```

## 🎨 Seções da Landing Page

1. **Header/Navegação**: Menu fixo com navegação suave
2. **Hero Section**: Apresentação principal com CTA destacado
3. **Recursos**: 6 principais funcionalidades do CRM
4. **Como Funciona**: Processo em 3 passos simples
5. **Depoimentos**: Testemunhos de clientes
6. **CTA Intermediário**: Chamada para ação antes do formulário
7. **Contato**: Formulário de contato e informações
8. **Footer**: Links e informações da empresa

## 🛠️ Como Usar

1. Abra o arquivo `index.html` em um navegador moderno
2. Ou hospede os arquivos em um servidor web

### Hospedagem Local (Opcional)

Para testar localmente com um servidor:

```bash
# Com Python 3
python -m http.server 8000

# Com Node.js (npx)
npx serve

# Com PHP
php -S localhost:8000
```

Depois acesse `http://localhost:8000` no navegador.

## 🎯 Personalização

### Cores

As cores principais podem ser alteradas no arquivo `styles.css` através das variáveis CSS:

```css
:root {
    --primary-color: #6366f1;
    --primary-dark: #4f46e5;
    --secondary-color: #8b5cf6;
    /* ... */
}
```

### Conteúdo

- Edite o texto diretamente no arquivo `index.html`
- Substitua os depoimentos, estatísticas e informações de contato
- Adicione ou remova seções conforme necessário

### Formulário de Contato

O formulário atualmente mostra um alerta ao ser enviado. Para integrar com um backend:

1. Modifique a função de submit no arquivo `script.js`
2. Adicione a URL do seu endpoint de API
3. Implemente o tratamento de resposta do servidor

## 📱 Responsividade

A landing page é totalmente responsiva e se adapta a:
- **Desktop**: Layout completo com duas colunas
- **Tablet**: Layout adaptado com grid responsivo
- **Mobile**: Menu hambúrguer e layout em coluna única

## 🌐 Compatibilidade

- Chrome (últimas versões)
- Firefox (últimas versões)
- Safari (últimas versões)
- Edge (últimas versões)

## 📝 Próximos Passos

1. Integrar formulário com backend/API
2. Adicionar Google Analytics ou similar
3. Implementar testes A/B para CTAs
4. Adicionar mais seções conforme necessário (preços, FAQ, etc.)
5. Otimizar imagens (quando adicionar imagens reais)
6. Adicionar meta tags para SEO

## 📄 Licença

Este projeto foi criado para o ConnectarCRM.

---

Desenvolvido com ❤️ para impulsionar vendas
