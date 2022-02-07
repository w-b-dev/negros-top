# NEGROS.TOP

Listar cantores negros de jazz.

TODO next: 
- expandir para qualquer subgrupo negro, para trazer visibilidade.

## Infra
Vamos conectar em um NoSQL db (AstraDB), usando um Single Page App (React) com chamadas REST via camada API.
### React
- publicar no Netlify
### AWS
Depois de cada atualizacao nos metodos e resources, eh importante fazer o deploy e esperar um minuto ou dois para as mudancas terem efeito.

- API Gateway
  - **d** ("desenvolvimento") : `https://jglk5758vj.execute-api.us-east-1.amazonaws.com/d`
  - Testar os endpoints com https://hoppscotch.io/
    - ~~GET /artistas~~ `OK`
    - ~~POST /artistas~~ `OK`
    - ANY /artistas `OK`
- Lambda
  - Copiar o codigo do lambda para o editor
  - Consumir o `event` e atualizar o codigo para retornar ele
  - Colar no lambda, fazer deploy e testar
  - Mudar template do teste para API GATEWAY
  - Finalmente adicionar logica para filtrar o metodo e retornar resposta distinta