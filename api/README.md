# Motor de Pesquisas - API

API RESTful para o sistema de formulários de pesquisa.

## Funcionalidades

- Autenticação JWT
- CRUD de formulários
- Gerenciamento de respostas
- Banco de perguntas reutilizáveis
- Documentação Swagger

## Tecnologias

- Node.js
- NestJS
- TypeORM
- PostgreSQL
- Docker
- JWT
- Swagger

## Pré-requisitos

- Docker
- Docker Compose
- Node.js 20 ou superior
- npm 10 ou superior

## Instalação

1. Clone o repositório
2. Copie o arquivo `.env.example` para `.env` e configure as variáveis de ambiente
3. Inicie os containers:
```bash
docker-compose up -d
```

A API estará disponível em `http://localhost:3000`.

## Documentação

Acesse a documentação Swagger em `http://localhost:3000/api`.

## Endpoints

### Autenticação
- `POST /auth/login` - Login
- `POST /users` - Criar usuário
- `GET /users/me` - Perfil do usuário
- `PATCH /users/me` - Atualizar perfil
- `DELETE /users/me` - Excluir conta

### Formulários
- `POST /formularios` - Criar formulário (requer autenticação)
- `GET /formularios` - Listar formulários
- `GET /formularios/:id` - Obter formulário por ID
- `DELETE /formularios/:id` - Excluir formulário (requer autenticação)
- `GET /formularios/perguntas/busca` - Buscar perguntas existentes
- `POST /formularios/respostas` - Salvar resposta
- `GET /formularios/:id/respostas` - Listar respostas

## Estrutura do Banco de Dados

```
├── users
├── formularios
├── secoes
├── perguntas
├── opcoes_resposta
├── respostas_formulario
├── respostas_pergunta
└── respostas_opcao
```

## Desenvolvimento

Para desenvolvimento local sem Docker:

1. Instale as dependências:
```bash
npm install
```

2. Inicie o servidor:
```bash
npm run start:dev
```

## Licença

MIT