# Motor de Pesquisas - Frontend

Sistema de formulários de pesquisa com suporte a múltiplos idiomas e reutilização de perguntas.

## Funcionalidades

- ✨ Criação de formulários dinâmicos
- 📑 Múltiplas seções por formulário
- ❓ Diversos tipos de perguntas
- 🔄 Reaproveitamento de perguntas
- 🌎 Suporte a múltiplos idiomas (PT-BR, EN, ES)
- 📱 Interface responsiva

## 📸 Screenshots

### Lista de Formulários
![Lista de Formulários](https://github.com/dwater2/reactjs-vite/blob/main/src/assets/formulario.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)

Visualize todos os formulários cadastrados com informações como:
- Título
- Descrição
- Status (Ativo/Inativo)
- Quantidade de seções e perguntas
- Data da última atualização

### Criação/Edição de Formulário
![Edição de Formulário](https://github.com/dwater2/reactjs-vite/blob/main/src/assets/formulario.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)

Interface intuitiva para criação e edição de formulários:
- Informações básicas do formulário
- Gerenciamento de seções
- Adição/edição de perguntas
- Reaproveitamento de perguntas existentes

## 💡 Tipos de Perguntas Suportados

- Texto Curto
- Parágrafo
- Número
- Data
- Hora
- Seleção (Dropdown)
- Múltipla Escolha
- Escolha Única

## 🛠️ Tecnologias Utilizadas

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)
- [i18next](https://www.i18next.com/)
- [Lucide Icons](https://lucide.dev/)

## 🚀 Como Executar

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

## Desenvolvimento

Para iniciar o servidor de desenvolvimento:

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:5173`.

## Build

Para gerar a versão de produção:

```bash
npm run build
```

## Estrutura do Projeto

```
src/
├── components/        # Componentes React
│   ├── forms/         # Componentes do formulário
│   ├── home/          # Componentes da página inicial
│   ├── layout/        # Componentes de layout
│   └── ui/            # Componentes de UI reutilizáveis
├── i18n/              # Configurações e traduções
├── services/          # Serviços e API
└── types/             # Tipos TypeScript
```

## 🔄 Fluxo de Dados

1. **Formulário**
   - Contém múltiplas seções
   - Possui título, descrição e status

2. **Seção**
   - Pertence a um formulário
   - Contém múltiplas perguntas
   - Possui título e descrição

3. **Pergunta**
   - Pertence a uma seção
   - Pode ter múltiplas opções de resposta
   - Tipos variados de entrada

4. **Resposta**
   - Vinculada a um formulário
   - Contém respostas para cada pergunta
   - Pode ter múltiplas opções selecionadas

## 👥 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abrir um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
