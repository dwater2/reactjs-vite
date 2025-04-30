# Motor de Pesquisas - Frontend

Sistema de formulários de pesquisa com suporte a múltiplos idiomas e reutilização de perguntas.

## Funcionalidades

- Criação e gerenciamento de formulários de pesquisa
- Suporte a diferentes tipos de perguntas:
  - Texto curto
  - Texto longo
  - Número
  - Seleção única
  - Múltipla escolha
  - Data
- Organização em seções
- Reutilização de perguntas existentes
- Suporte a múltiplos idiomas (pt-BR e en-US)
- Interface responsiva e moderna

## Tecnologias

- React 18
- TypeScript
- Vite
- Tailwind CSS
- i18next
- React Router DOM
- React Hook Form
- Lucide React

## Pré-requisitos

- Node.js 20 ou superior
- npm 10 ou superior

## Instalação

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
  ├── components/     # Componentes reutilizáveis
  ├── contexts/      # Contextos React
  ├── i18n/          # Configurações e traduções
  ├── pages/         # Páginas da aplicação
  ├── services/      # Serviços e APIs
  ├── types/         # Tipos TypeScript
  └── utils/         # Utilitários
```

## Licença

MIT