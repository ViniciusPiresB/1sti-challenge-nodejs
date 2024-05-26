# Desafio Desenvolvedor Backend Node.JS

Este é um repositório para testar minhas habilidades como desenvolvedor backend, foi pedido um CRUD de usuários com banco de dados.

## Autor

Vinicius Pires Barreto

## Ambiente

Para montar o ambiente, siga estes passos:

    1. Clone o repositório: `git clone https://github.com/ViniciusPiresB/1sti-challenge-nodejs.git`
    3. Navegue até a pasta do repositório
    2. Instale as dependências: `npm install`

Obs: Certifique de utilizar versão do node compatível, se possível utilize as mesmas da sessão "Versão do Node.js e npm".

## Testes

Para rodar os testes, execute o seguinte comando:

```bash
npm test
```

## Aplicação

## Rodando com Docker

Para rodar a aplicação com Docker, siga os passos abaixo:

    1. Tenha o Docker instalado em sua máquina.
    2. No terminal, navegue até a pasta do projeto.
    3. Construa a imagem do Docker: `docker-compose up --build`
    4. Acesse a aplicação em `http://localhost:3000/doc`

## Rodando sem Docker

Para rodar a aplicação sem Docker, siga os passos abaixo:

    1. Configure as variáveis de ambiente no arquivo `.env` baseado no arquivo `.env.example`
        1.1 Crie um arquivo chamado `.env` na raiz do seu projeto, se ele ainda não existir.
        1.2 Abra o arquivo `.env` com um editor de texto e adicione as seguintes linhas:
            DATABASE_URL="mysql://user:password@localhost:3306/db_name"
            JWT_SECRET="sua_senha_secreta_para_gerar_tokens"
        1.3 Substitua `user`, `password`, `localhost:3306` e `db_name` pelos valores correspondentes ao seu banco de dados MySQL.

    2. Inicie a aplicação: `npm start`
    3. Acesse a aplicação em `http://localhost:3000`

## Documentação Swagger

Para visualizar a documentação Swagger, acesse `http://localhost:3000/doc`

## Versão do Node.js e npm

Este projeto foi desenvolvido e testado com o Node.js versão 20.10.0 e npm versão 10.2.3
