const addTransactionButton = document.getElementById("addTransactionButton");
const emptyAddButton = document.getElementById("emptyAddButton");
const closeModal = document.getElementById("closeModal");
const cancelButton = document.getElementById("cancelButton");

const modal = document.getElementById("transactionModal");
const form = document.getElementById("transactionForm");

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

let transactions = [];


function openModal() {
    modal.style.display = "flex";
    descriptionInput.focus();
}


function closeTransactionModal() {
    modal.style.display = "none";
    form.reset();
}


addTransactionButton.addEventListener("click", openModal);

emptyAddButton.addEventListener("click", openModal);

closeModal.addEventListener("click", closeTransactionModal);

cancelButton.addEventListener("click", closeTransactionModal);


form.addEventListener("submit", function (event) {
    event.preventDefault();

    const description = descriptionInput.value.trim();
    const amount = Number(amountInput.value);
    const type = typeInput.value;
    const category = categoryInput.value;

    if (!description || !amount || amount <= 0) {
        return;
    }

    const transaction = {
        id: Date.now(),
        description: description,
        amount: amount,
        type: type,
        category: category
    };

    transactions.push(transaction);

    renderTransactions();
    updateValues();

    closeTransactionModal();
});


function renderTransactions() {

    transactionList.innerHTML = "";

    let filteredTransactions = transactions;

    if (currentFilter === "income") {
        filteredTransactions = transactions.filter(function (transaction) {
            return transaction.type === "income";
        });
    }

    if (currentFilter === "expense") {
        filteredTransactions = transactions.filter(function (transaction) {
            return transaction.type === "expense";
        });
    }

    if (filteredTransactions.length === 0) {
        emptyState.style.display = "block";
        return;
    }

    emptyState.style.display = "none";

    filteredTransactions.forEach(function (transaction) {

        const item = document.createElement("div");

        item.classList.add("transaction-item");

        const signal = transaction.type === "income" ? "+" : "-";

        const categoryName = getCategoryName(transaction.category);

        item.innerHTML = `
            <div>
                <strong>${transaction.description}</strong>
                <span>${categoryName}</span>
            </div>

            <div class="transaction-actions">

                <strong>
                    ${signal} ${formatMoney(transaction.amount)}
                </strong>

                <button class="delete-button" title="Excluir transação">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 6h18"></path>
                        <path d="M8 6V4h8v2"></path>
                        <path d="M19 6l-1 15H6L5 6"></path>
                        <path d="M10 11v6"></path>
                        <path d="M14 11v6"></path>
                    </svg>
                </button>

            </div>
        `;

        const deleteButton = item.querySelector(".delete-button");

        deleteButton.addEventListener("click", function () {

            transactions = transactions.filter(function (item) {
                return item.id !== transaction.id;
            });

            renderTransactions();
            updateValues();

        });

        transactionList.appendChild(item);
    });
}


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


function updateValues() {

    let totalIncome = 0;
    let totalExpenses = 0;

    transactions.forEach(function (transaction) {

        if (transaction.type === "income") {
            totalIncome += transaction.amount;
        } else {
            totalExpenses += transaction.amount;
        }

    });

    const totalBalance = totalIncome - totalExpenses;

    income.textContent = formatMoney(totalIncome);
    expenses.textContent = formatMoney(totalExpenses);
    balance.textContent = formatMoney(totalBalance);
}


function formatMoney(value) {

    return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

}


// FILTRO: TODAS
allButton.addEventListener("click", function () {

    currentFilter = "all";

    allButton.classList.add("active");
    incomeButton.classList.remove("active");
    expenseButton.classList.remove("active");

    renderTransactions();
});


// FILTRO: RECEITAS
incomeButton.addEventListener("click", function () {

    currentFilter = "income";

    incomeButton.classList.add("active");
    allButton.classList.remove("active");
    expenseButton.classList.remove("active");

    renderTransactions();
});


// FILTRO: DESPESAS
expenseButton.addEventListener("click", function () {

    currentFilter = "expense";

    expenseButton.classList.add("active");
    allButton.classList.remove("active");
    incomeButton.classList.remove("active");

    renderTransactions();
});


allButton.classList.add("active");