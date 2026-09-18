const addTransactionButton = document.getElementById("addTransactionButton");
const emptyAddButton = document.getElementById("emptyAddButton");
const closeModal = document.getElementById("closeModal");
const cancelButton = document.getElementById("cancelButton");

const modal = document.getElementById("transactionModal");
const form = document.getElementById("transactionForm");

const modalTitle = document.getElementById("modalTitle");
const submitButton = document.getElementById("submitButton");

const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const categoryInput = document.getElementById("category");

const transactionList = document.getElementById("transactionList");
const emptyState = document.getElementById("emptyState");

const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expenses = document.getElementById("expenses");

const allButton = document.getElementById("allButton");
const incomeButton = document.getElementById("incomeButton");
const expenseButton = document.getElementById("expenseButton");

let currentFilter = "all";
let editingTransactionId = null;
let transactions = [];


/* =========================
   CARREGAR TRANSAÇÕES
========================= */

function loadTransactions() {

    const savedTransactions =
        localStorage.getItem("coinxpTransactions");

    if (!savedTransactions) {
        transactions = [];
        return;
    }

    try {

        transactions = JSON.parse(savedTransactions);

        if (!Array.isArray(transactions)) {
            transactions = [];
        }

    } catch (error) {

        console.log("Erro ao carregar transações:", error);

        transactions = [];

    }
}


/* =========================
   SALVAR TRANSAÇÕES
========================= */

function saveTransactions() {

    localStorage.setItem(
        "coinxpTransactions",
        JSON.stringify(transactions)
    );

}


/* =========================
   ABRIR MODAL
========================= */

function openModal() {

    modal.style.display = "flex";

    modalTitle.textContent = "Nova transação";

    submitButton.textContent = "Adicionar";

    form.reset();

    editingTransactionId = null;

    descriptionInput.focus();

}


/* =========================
   FECHAR MODAL
========================= */

function closeTransactionModal() {

    modal.style.display = "none";

    form.reset();

    editingTransactionId = null;

    modalTitle.textContent = "Nova transação";

    submitButton.textContent = "Adicionar";

}


/* =========================
   EVENTOS DO MODAL
========================= */

addTransactionButton.addEventListener(
    "click",
    openModal
);

emptyAddButton.addEventListener(
    "click",
    openModal
);

closeModal.addEventListener(
    "click",
    closeTransactionModal
);

cancelButton.addEventListener(
    "click",
    closeTransactionModal
);


/* =========================
   ADICIONAR / EDITAR
========================= */

form.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();

        const description =
            descriptionInput.value.trim();

        const amount =
            Number(amountInput.value);

        const type =
            typeInput.value;

        const category =
            categoryInput.value;


        if (
            description === "" ||
            isNaN(amount) ||
            amount <= 0
        ) {
            return;
        }


        /* EDITAR */

        if (editingTransactionId !== null) {

            transactions =
                transactions.map(
                    function (transaction) {

                        if (
                            transaction.id ===
                            editingTransactionId
                        ) {

                            return {
                                ...transaction,
                                description: description,
                                amount: amount,
                                type: type,
                                category: category
                            };

                        }

                        return transaction;

                    }
                );

        }


        /* ADICIONAR */

        else {

            const newTransaction = {

                id: Date.now(),

                description: description,

                amount: amount,

                type: type,

                category: category

            };

            transactions.push(newTransaction);

        }


        saveTransactions();

        renderTransactions();

        updateValues();

        closeTransactionModal();

    }
);


/* =========================
   MOSTRAR TRANSAÇÕES
========================= */

function renderTransactions() {

    transactionList.innerHTML = "";


    let filteredTransactions = transactions;


    if (currentFilter === "income") {

        filteredTransactions =
            transactions.filter(
                function (transaction) {

                    return transaction.type === "income";

                }
            );

    }


    if (currentFilter === "expense") {

        filteredTransactions =
            transactions.filter(
                function (transaction) {

                    return transaction.type === "expense";

                }
            );

    }


    if (filteredTransactions.length === 0) {

        emptyState.style.display = "block";

        return;

    }


    emptyState.style.display = "none";


    filteredTransactions.forEach(
        function (transaction) {

            const item =
                document.createElement("div");

            item.classList.add(
                "transaction-item"
            );


            const information =
                document.createElement("div");


            const description =
                document.createElement("strong");

            description.textContent =
                transaction.description;


            const category =
                document.createElement("span");

            category.textContent =
                getCategoryName(
                    transaction.category
                );


            information.appendChild(description);

            information.appendChild(category);


            const actions =
                document.createElement("div");

            actions.classList.add(
                "transaction-actions"
            );


            const value =
                document.createElement("strong");

            const signal =
                transaction.type === "income"
                    ? "+"
                    : "-";


            value.textContent =
                `${signal} ${formatMoney(transaction.amount)}`;


            /* BOTÃO EDITAR */

            const editButton =
                document.createElement("button");

            editButton.classList.add(
                "edit-button"
            );

            editButton.title =
                "Editar transação";

            editButton.innerHTML = `
                <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <path d="M12 20h9"></path>
                    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"></path>
                </svg>
            `;


            editButton.addEventListener(
                "click",
                function () {

                    editTransaction(transaction);

                }
            );


            /* BOTÃO EXCLUIR */

            const deleteButton =
                document.createElement("button");

            deleteButton.classList.add(
                "delete-button"
            );

            deleteButton.title =
                "Excluir transação";

            deleteButton.innerHTML = `
                <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <path d="M3 6h18"></path>
                    <path d="M8 6V4h8v2"></path>
                    <path d="M19 6l-1 15H6L5 6"></path>
                    <path d="M10 11v6"></path>
                    <path d="M14 11v6"></path>
                </svg>
            `;


            deleteButton.addEventListener(
                "click",
                function () {

                    transactions =
                        transactions.filter(
                            function (item) {

                                return item.id !== transaction.id;

                            }
                        );


                    saveTransactions();

                    renderTransactions();

                    updateValues();

                }
            );


            actions.appendChild(value);

            actions.appendChild(editButton);

            actions.appendChild(deleteButton);


            item.appendChild(information);

            item.appendChild(actions);


            transactionList.appendChild(item);

        }
    );

}


/* =========================
   EDITAR TRANSAÇÃO
========================= */

function editTransaction(transaction) {

    editingTransactionId =
        transaction.id;


    descriptionInput.value =
        transaction.description;

    amountInput.value =
        transaction.amount;

    typeInput.value =
        transaction.type;

    categoryInput.value =
        transaction.category;


    modalTitle.textContent =
        "Editar transação";

    submitButton.textContent =
        "Salvar alterações";


    modal.style.display = "flex";

    descriptionInput.focus();

}


/* =========================
   CATEGORIAS
========================= */

function getCategoryName(category) {

    const categories = {

        food: "Alimentação",

        transport: "Transporte",

        shopping: "Compras",

        leisure: "Lazer",

        home: "Casa",

        work: "Trabalho",

        study: "Estudos",

        other: "Outros"

    };


    return categories[category] || "Outros";

}


/* =========================
   ATUALIZAR VALORES
========================= */

function updateValues() {

    let totalIncome = 0;

    let totalExpenses = 0;


    transactions.forEach(
        function (transaction) {

            const amount =
                Number(transaction.amount) || 0;


            if (transaction.type === "income") {

                totalIncome += amount;

            } else {

                totalExpenses += amount;

            }

        }
    );


    const totalBalance =
        totalIncome - totalExpenses;


    income.textContent =
        formatMoney(totalIncome);

    expenses.textContent =
        formatMoney(totalExpenses);

    balance.textContent =
        formatMoney(totalBalance);

}


/* =========================
   FORMATAR DINHEIRO
========================= */

function formatMoney(value) {

    return Number(value).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}


/* =========================
   FILTRO TODAS
========================= */

allButton.addEventListener(
    "click",
    function () {

        currentFilter = "all";

        allButton.classList.add("active");

        incomeButton.classList.remove("active");

        expenseButton.classList.remove("active");

        renderTransactions();

    }
);


/* =========================
   FILTRO RECEITAS
========================= */

incomeButton.addEventListener(
    "click",
    function () {

        currentFilter = "income";

        incomeButton.classList.add("active");

        allButton.classList.remove("active");

        expenseButton.classList.remove("active");

        renderTransactions();

    }
);


/* =========================
   FILTRO DESPESAS
========================= */

expenseButton.addEventListener(
    "click",
    function () {

        currentFilter = "expense";

        expenseButton.classList.add("active");

        allButton.classList.remove("active");

        incomeButton.classList.remove("active");

        renderTransactions();

    }
);


/* =========================
   INICIAR
========================= */

loadTransactions();

allButton.classList.add("active");

renderTransactions();

updateValues();