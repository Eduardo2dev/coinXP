// Selecionando os elementos da tela
const modal = document.getElementById("transactionModal");
const formulario = document.getElementById("transactionForm");
const listaTransacoes = document.getElementById("transactionList");
const estadoVazio = document.getElementById("emptyState");

const saldoEl = document.getElementById("balance");
const receitaEl = document.getElementById("income");
const despesaEl = document.getElementById("expenses");

const inputDescricao = document.getElementById("description");
const inputValor = document.getElementById("amount");
const inputTipo = document.getElementById("type");

// Botões
const btnAbrirModal = document.getElementById("addTransactionButton");
const btnAbrirVazio = document.getElementById("emptyAddButton");
const btnFecharModal = document.getElementById("closeModal");
const btnCancelar = document.getElementById("cancelButton");

let transacoes = [];

// Função para abrir e fechar o modal
const alternarModal = () => {
    const estaAberto = modal.style.display === "flex";
    modal.style.display = estaAberto ? "none" : "flex";
    if (!estaAberto) {
        inputDescricao.focus();
    } else {
        formulario.reset();
    }
};

btnAbrirModal.addEventListener("click", alternarModal);
btnAbrirVazio.addEventListener("click", alternarModal);
btnFecharModal.addEventListener("click", alternarModal);
btnCancelar.addEventListener("click", alternarModal);

// Cadastrando nova transação
formulario.addEventListener("submit", (e) => {
    e.preventDefault();

    const descricao = inputDescricao.value.trim();
    const valor = Number(inputValor.value);
    const tipo = inputTipo.value;

    if (!descricao || !valor || valor <= 0) return;

    transacoes.push({
        id: Date.now(),
        descricao,
        valor,
        tipo
    });

    atualizarInterface();
    alternarModal();
});

// Atualiza a tela inteira
function atualizarInterface() {
    renderizarTransacoes();
    atualizarValores();
}

function renderizarTransacoes() {
    listaTransacoes.innerHTML = "";

    if (transacoes.length === 0) {
        estadoVazio.style.display = "block";
        return;
    }

    estadoVazio.style.display = "none";

    transacoes.forEach(t => {
        const item = document.createElement("div");
        item.classList.add("transaction-item");

        const ehReceita = t.tipo === "income";
        const sinal = ehReceita ? "+" : "-";

        item.innerHTML = `
            <div>
                <strong>${t.descricao}</strong>
                <span>${ehReceita ? "Receita" : "Despesa"}</span>
            </div>
            <strong>${sinal} ${formatarMoeda(t.valor)}</strong>
        `;

        listaTransacoes.appendChild(item);
    });
}

function atualizarValores() {
    let totalReceitas = 0;
    let totalDespesas = 0;

    transacoes.forEach(t => {
        if (t.tipo === "income") {
            totalReceitas += t.valor;
        } else {
            totalDespesas += t.valor;
        }
    });

    const saldoTotal = totalReceitas - totalDespesas;

    receitaEl.textContent = formatarMoeda(totalReceitas);
    despesaEl.textContent = formatarMoeda(totalDespesas);
    saldoEl.textContent = formatarMoeda(saldoTotal);
}

function formatarMoeda(valor) {
    return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}