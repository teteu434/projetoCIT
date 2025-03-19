# 📌 Sistema de Catalogação de Escavações

## 📖 Descrição

Este projeto consiste em uma API e uma interface de linha de comando (CLI) para catalogação de escavações arqueológicas.
A API permite o gerenciamento de pontos de escavação e pesquisadores, enquanto a main oferece um menu interativo para interação via terminal.

---

## 🚀 Tecnologias Utilizadas

- **Node.js** - Ambiente de execução JavaScript
- **Express.js** - Framework para criação da API
- **PostgreSQL** - Banco de dados relacional
- **dotenv** - Gerenciamento de variáveis de ambiente
- **cors** - Permitir requisições de diferentes origens
- **body-parser** - Processamento de JSON nas requisições
- **readline-sync** - Entrada de dados no terminal

---

## 📂 Estrutura do Projeto

```
/projeto
  ├── /src
  │   ├── /api                       # Aplicação Express (API)
  │   │   ├── app.js                 # Configuração da aplicação
  │   │   ├── routes.js              # Definição das rotas da API
  │   ├── /cliConfig                 # Pasta com as configurações do CLI
  │   │   ├── projetoCitConfig.js    # Funções de interação com o usuário
  │   ├── /controller                # Controladores das requisições
  │   ├── /db                        # Configuração do banco de dados
  │   │   ├── projetoCitDatabase.js  # Conexão com PostgreSQL
  │   ├── /repository                # Repositório de acesso aos dados
  ├── .env                           # Variáveis de ambiente
  ├── .gitignore                     # Arquivos ignorados no Git
  ├── main.js                        # Arquivo principal para interação via CLI
  ├── package.json                   # Dependências do projeto
  ├── package-lock.json              # Controle de versões do npm
  ├── server.js                      # Inicialização do servidor Express
```

---

## ⚙️ Configuração e Instalação

1️⃣ **Clone o repositório:**

```sh
git clone https://github.com/seu-usuario/projetoCIT.git
```

2️⃣ **Acesse a pasta do projeto:**

```sh
cd projetoCIT
```

3️⃣ **Instale as dependências:**

```sh
npm install
```

4️⃣ **Configure as variáveis de ambiente no `.env`**

Solicite a mim e passarei a vocês os dados do banco de dados.

5️⃣ **Inicie a API:**

```sh
npm run server
```

6️⃣ **Execute a interface CLI:**

```sh
npm run main
```

---

## 📌 Endpoints da API

### 📍 Pontos de Escavação

- `GET /pontos` → Retorna todos os pontos cadastrados
- `GET /pontos/:id` → Retorna um ponto pelo ID
- `POST /pontos` → Cadastra um novo ponto
- `PUT /pontos/:id` → Atualiza um ponto existente
- `DELETE /pontos/:id` → Remove um ponto

### 👨‍🔬 Pesquisadores

- `GET /pesquisadores` → Retorna todos os pesquisadores
- `GET /pesquisadores/:nome` → Busca pesquisador pelo nome
- `POST /pesquisadores` → Cadastra um novo pesquisador
- `PUT /pesquisadores/:nome` → Atualiza um pesquisador
- `DELETE /pesquisadores/:nome` → Remove um pesquisador

---

## 🎮 Como Usar a Interface CLI

A interface da linha de comando permite que o usuário interaja com o sistema via terminal.

### 📌 Passos:

1. **Execute o programa CLI:**
   npm run main

2. **Escolha uma opção no menu:**
   - Gerenciar pontos de escavação
   - Gerenciar pesquisadores
   - Sair

3. **Siga as instruções na tela para cadastrar, listar, buscar, atualizar ou excluir registros.**

---

Se precisar de mais informações, entre em contato! 🚀