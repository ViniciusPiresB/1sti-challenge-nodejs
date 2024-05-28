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

    1. Tenha o docker instalado e rodando.
    2. Execute o seguinte comando no terminal para criar o banco MySQL
        docker run --name mysqlcontainer -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=backend-challenge -e MYSQL_USER=user -e MYSQL_PASSWORD=password -p 3306:3306 -d mysql:latest
    3. Execute um push no banco de dados, execute o seguinte comando na pasta raiz do projeto:
        npx prisma db push
    4. Configure as variáveis de ambiente no arquivo `.env` baseado no arquivo `.env.example`
        4.1 Crie um arquivo chamado `.env` na raiz do seu projeto, se ele ainda não existir.
        4.2 Abra o arquivo `.env` com um editor de texto e adicione as seguintes linhas:
            DATABASE_URL="mysql://user:password@localhost:3306/backend-challenge"
            JWT_SECRET="sua_senha_secreta_para_gerar_tokens"

    5. Inicie a aplicação: `npm start`
    6. Acesse a aplicação em `http://localhost:3000`

## Primeiro acesso

Assim que a aplicação estiver em execução, acesse o endpoint http://localhost:3000/user/first-user/get para obter o primeiro usuário do sistema com privilégios máximos.
A partir deste usuário, será possivel gerar tokens na rota de login para realizar todas as operações presentes na aplicação.

## Documentação Swagger

Para visualizar a documentação Swagger, acesse `http://localhost:3000/doc`

## Versão do Node.js e npm

Este projeto foi desenvolvido e testado com o Node.js versão 20.10.0 e npm versão 10.2.3
