# blog-api

API para estudo de testes de API.

Passos para executar a API:

1. Execute o comando `npm i` ou `yarn`
2. Execute o comando `yarn start` ou `npm start`

Após executar a API, é possível acessar a documentação por meio da url:

```
http://localhost:3000/docs
```
## Explicando os scripts

"scripts": {
      "start": "npx kill-port 3000 && ts-node src/server.ts", <!-- //Mata a porta e depois inicia o servidor Typescript  -->
      "dev": "npx kill-port 3000 && nodemon --exec ts-node src/server.ts", <!-- // Semelhante ao script "start", reinicia automaticamente o servidor sempre que há mudanças nos arquivos (útil para o desenvolvimento) -->
      "typeorm": "typeorm-ts-node-commonjs", <!-- // Executa o comando typeorm com a configuração ts-node e o sistema de módulos CommonJS. Este script é geralmente usado para interagir com o ORM TypeORM, por exemplo, para executar migrações ou gerar entidades. -->
      "test": "npx cypress run" <!--  //Executa os testes automatizados usando o Cypress, uma ferramenta popular para testes end-to-end (e2e). -->

   }