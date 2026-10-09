// ==========================================
// PARTE 1 — MANIPULAÇÃO E VALIDAÇÃO DE DADOS
// ==========================================

const pedidos = [
    { cliente: "Bia", valor: 120, status: "pago" },
    { cliente: "Carlos", valor: 80, status: "pendente" },
    { cliente: "Ana", valor: 250, status: "pago" },
    { cliente: "", valor: 100, status: "pago" },
    { cliente: "Pedro", valor: -30, status: "pago" },
    { cliente: "Lucas", valor: "inválido", status: "pago" }
];

// Validar os pedidos:
// cliente não vazio e valor numérico maior que zero.
const pedidosValidos = pedidos.filter(function(pedido) {
    return (
        typeof pedido.cliente === "string" &&
        pedido.cliente.trim() !== "" &&
        typeof pedido.valor === "number" &&
        Number.isFinite(pedido.valor) &&
        pedido.valor > 0
    );
});

console.log("Pedidos válidos:", pedidosValidos);

// Selecionar apenas os pedidos pagos.
const pedidosPagos = pedidosValidos.filter(function(pedido) {
    return pedido.status === "pago";
});

console.log("Pedidos pagos:", pedidosPagos);

// Calcular o total faturado.
const totalFaturado = pedidosPagos.reduce(function(total, pedido) {
    return total + pedido.valor;
}, 0);

console.log("Total faturado: R$", totalFaturado.toFixed(2));

// Gerar textos no formato "Bia — R$ 120.00".
const textosPedidos = pedidosPagos.map(function(pedido) {
    return `${pedido.cliente.trim()} — R$ ${pedido.valor.toFixed(2)}`;
});

console.log("Resumo dos pedidos:", textosPedidos);


// ==========================================
// PARTE 2 — BUSCADOR DE CEP
// ==========================================

const formularioCep = document.querySelector("#formulario-cep");
const campoCep = document.querySelector("#cep");
const botaoCep = document.querySelector("#botao-cep");
const statusCep = document.querySelector("#status-cep");
const resultadoCep = document.querySelector("#resultado-cep");
const historicoCep = document.querySelector("#historico-cep");

// Histórico mantido em memória durante a execução da página.
const historico = [];

function mostrarStatusCep(mensagem, tipo = "") {
    statusCep.textContent = mensagem;
    statusCep.className = "status";

    if (tipo) {
        statusCep.classList.add(tipo);
    }
}

function mostrarErroCep(mensagem) {
    mostrarStatusCep(mensagem, "erro");
}

function mostrarResultadoCep(dados) {
    // Limpar o resultado anterior.
    resultadoCep.replaceChildren();

    const campos = [
        ["Rua", dados.logradouro],
        ["Bairro", dados.bairro],
        ["Cidade", dados.localidade],
        ["UF", dados.uf]
    ];

    campos.forEach(function(campo) {
        const dt = document.createElement("dt");
        const dd = document.createElement("dd");

        dt.textContent = campo[0];
        dd.textContent = campo[1] || "Não informado";

        resultadoCep.append(dt, dd);
    });
}

function atualizarHistoricoCep(cep, dados) {
    // Guardar os dados da pesquisa no array de objetos.
    historico.unshift({
        cep: cep,
        cidade: dados.localidade || "Não informada",
        uf: dados.uf || "--"
    });

    // Manter no máximo 10 registros.
    if (historico.length > 10) {
        historico.pop();
    }

    // Atualizar a lista do histórico sem usar innerHTML.
    historicoCep.replaceChildren();

    historico.forEach(function(item) {
        const li = document.createElement("li");

        li.textContent =
            `${item.cep} — ${item.cidade}/${item.uf}`;

        historicoCep.append(li);
    });

    console.log("Histórico de CEPs:", historico);
}

async function buscarCep(cep) {
    mostrarStatusCep("Buscando...");
    resultadoCep.replaceChildren();
    botaoCep.disabled = true;

    try {
        const resposta = await fetch(
            `https://viacep.com.br/ws/${cep}/json/`,
            {
                signal: AbortSignal.timeout(5000)
            }
        );

        if (!resposta.ok) {
            throw new Error("HTTP_ERROR");
        }

        const dados = await resposta.json();

        if (dados.erro) {
            mostrarErroCep("CEP não encontrado.");
            return;
        }

        mostrarResultadoCep(dados);
        atualizarHistoricoCep(cep, dados);

        mostrarStatusCep("CEP encontrado com sucesso!", "sucesso");

    } catch (erro) {
        console.error("Erro na busca de CEP:", erro);

        if (
            erro.name === "TimeoutError" ||
            erro.name === "AbortError"
        ) {
            mostrarErroCep(
                "A busca demorou demais. Tente novamente."
            );
        } else {
            mostrarErroCep(
                "Falha na conexão. Verifique sua internet e tente novamente."
            );
        }

    } finally {
        botaoCep.disabled = false;
    }
}

formularioCep.addEventListener("submit", function(evento) {
    evento.preventDefault();

    const cep = campoCep.value.trim();

    if (!/^\d{8}$/.test(cep)) {
        resultadoCep.replaceChildren();
        mostrarErroCep(
            "CEP inválido. Digite exatamente 8 números."
        );
        return;
    }

    buscarCep(cep);
});


// ==========================================
// PARTE 3 — MINI POKEDEX
// ==========================================

const formularioPokemon = document.querySelector("#formulario-pokemon");
const campoPokemon = document.querySelector("#pokemon");
const botaoPokemon = document.querySelector("#botao-pokemon");
const statusPokemon = document.querySelector("#status-pokemon");
const resultadoPokemon = document.querySelector("#resultado-pokemon");

function mostrarStatusPokemon(mensagem, tipo = "") {
    statusPokemon.textContent = mensagem;
    statusPokemon.className = "status";

    if (tipo) {
        statusPokemon.classList.add(tipo);
    }
}

function mostrarPokemon(dados) {
    resultadoPokemon.replaceChildren();

    const nome = document.createElement("h3");
    nome.textContent =
        dados.name.charAt(0).toUpperCase() + dados.name.slice(1);

    resultadoPokemon.append(nome);

    if (dados.sprites.front_default) {
        const imagem = document.createElement("img");

        imagem.src = dados.sprites.front_default;
        imagem.alt = `Imagem de ${dados.name}`;

        resultadoPokemon.append(imagem);
    } else {
        const semImagem = document.createElement("p");
        semImagem.textContent = "Imagem não disponível.";
        resultadoPokemon.append(semImagem);
    }

    const tituloTipos = document.createElement("h4");
    tituloTipos.textContent = "Tipos:";

    const listaTipos = document.createElement("ul");

    dados.types.forEach(function(item) {
        const li = document.createElement("li");
        li.textContent = item.type.name;
        listaTipos.append(li);
    });

    resultadoPokemon.append(tituloTipos, listaTipos);
}

async function buscarPokemon(nomePokemon) {
    mostrarStatusPokemon("Buscando Pokémon...");
    resultadoPokemon.replaceChildren();
    botaoPokemon.disabled = true;

    try {
        const resposta = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(nomePokemon)}`,
            {
                signal: AbortSignal.timeout(5000)
            }
        );

        if (resposta.status === 404) {
            throw new Error("POKEMON_NOT_FOUND");
        }

        if (!resposta.ok) {
            throw new Error("HTTP_ERROR");
        }

        const dados = await resposta.json();

        mostrarPokemon(dados);
        mostrarStatusPokemon("Pokémon encontrado!", "sucesso");

    } catch (erro) {
        console.error("Erro na busca do Pokémon:", erro);

        resultadoPokemon.replaceChildren();

        if (erro.message === "POKEMON_NOT_FOUND") {
            mostrarStatusPokemon("Pokémon não encontrado.", "erro");
        } else if (
            erro.name === "TimeoutError" ||
            erro.name === "AbortError"
        ) {
            mostrarStatusPokemon(
                "A busca demorou demais. Tente novamente.",
                "erro"
            );
        } else {
            mostrarStatusPokemon(
                "Falha na conexão. Verifique sua internet e tente novamente.",
                "erro"
            );
        }

    } finally {
        botaoPokemon.disabled = false;
    }
}

formularioPokemon.addEventListener("submit", function(evento) {
    evento.preventDefault();

    const nomePokemon = campoPokemon.value.trim().toLowerCase();

    if (nomePokemon === "") {
        resultadoPokemon.replaceChildren();
        mostrarStatusPokemon(
            "Digite o nome de um Pokémon.",
            "erro"
        );
        return;
    }

    buscarPokemon(nomePokemon);
});
