# Semana 05 — Objetos, Dados e Assincronismo

## Descrição do projeto

Este projeto foi desenvolvido para praticar manipulação de objetos e arrays, consumo de APIs externas e atualização dinâmica do DOM utilizando JavaScript.

## Tecnologias utilizadas

* HTML5
* CSS3
* JavaScript
* Fetch API
* API ViaCEP
* API PokéAPI

## Parte 1 — Manipulação e validação de dados

O array `pedidos` contém objetos com cliente, valor e status.

* **filter:** seleciona os pedidos válidos e, posteriormente, apenas os pedidos com status "pago".
* **reduce:** calcula o total faturado com base nos pedidos pagos.
* **map:** gera textos formatados com o nome do cliente e o valor do pedido.
* **toFixed(2):** apresenta os valores monetários com duas casas decimais.

## Parte 2 — Buscador de CEP

O buscador consome a API ViaCEP para consultar informações de um CEP.

A aplicação valida o formato do CEP, utiliza `fetch` com `async/await`, trata erros e apresenta rua, bairro, cidade e UF.

O histórico de consultas bem-sucedidas é armazenado em um array de objetos e exibido na página.

## Parte 3 — Mini Pokédex

A Mini Pokédex consulta a API PokéAPI utilizando o nome do Pokémon.

A interface apresenta o nome, a imagem disponível e os tipos do Pokémon. Também trata campos vazios, erros de conexão, timeout e respostas HTTP 404.

## Os quatro estados da interface

* **Carregando:** informa que a consulta está em andamento e desabilita o botão.
* **Erro:** apresenta uma mensagem quando ocorre uma falha na requisição.
* **Vazio ou não encontrado:** informa quando o dado não foi encontrado ou a entrada não foi preenchida corretamente.
* **Sucesso:** apresenta os dados recebidos da API.

## Por que Promise.all pode ser mais rápido que vários await seguidos?

O `await` sequencial faz com que a execução aguarde a conclusão de uma Promise antes de iniciar a próxima operação que depende daquela sequência. Quando várias requisições independentes são feitas dessa maneira, o tempo de espera de cada uma é acumulado.

Já o `Promise.all` permite iniciar várias operações assíncronas independentes antes de aguardar seus resultados. Assim, as requisições podem acontecer em paralelo, aproveitando melhor o tempo de rede.

Por exemplo:

```javascript
// Execução sequencial
const resposta1 = await fetch(url1);
const resposta2 = await fetch(url2);

// Execução concorrente
const [respostaA, respostaB] = await Promise.all([
    fetch(url1),
    fetch(url2)
]);
```

No segundo exemplo, as duas requisições são iniciadas antes da espera conjunta. Isso pode reduzir o tempo total quando as operações são independentes.

É importante observar que `Promise.all` rejeita quando uma das Promises rejeita. Além disso, o `fetch` não rejeita automaticamente em respostas HTTP como 404 ou 500; é necessário verificar `response.ok`.

