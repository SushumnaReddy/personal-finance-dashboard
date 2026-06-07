let expenses = [];

let budget = 10000;

let pieChart;

let barChart;

const amountInput =
document.getElementById("amount");

const categoryInput =
document.getElementById("category");

const dateInput =
document.getElementById("date");

const addButton =
document.getElementById("add-btn");

const expenseList =
document.getElementById("expense-list");

const spentAmount =
document.getElementById("spent-amount");

const remainingBudget =
document.getElementById("remaining-budget");

const budgetInput =
document.getElementById("budget-input");

const budgetButton =
document.getElementById("budget-btn");

const budgetAmount =
document.getElementById("budget-amount");

const filterCategory =
document.getElementById(
    "filter-category"
);

const searchExpense =
document.getElementById(
    "search-expense"
);

const exportButton =
document.getElementById("export-btn");

addButton.addEventListener(
    "click",
    addExpense
);

budgetButton.addEventListener(
    "click",
    setBudget
);

filterCategory.addEventListener(
    "change",
    displayExpenses
);

searchExpense.addEventListener(
    "input",
    displayExpenses
);

exportButton.addEventListener(
    "click",
    exportCSV
);

function addExpense(){

    const amount = amountInput.value;
    const category = categoryInput.value;
    const date = dateInput.value;

    if(amount === "" || date === ""){

        alert("Please fill all fields");
        return;

    }

    const expense = {

        amount: amount,
        category: category,
        date: date

    };

    expenses.push(expense);

    saveExpenses();

    updateSpentAmount();
    updateRemainingBudget();
    displayExpenses();
    updateCharts();

    amountInput.value = "";
    categoryInput.value = "Food";
    dateInput.value = "";

}

function displayExpenses(){
    
    console.log(filterCategory.value);
    expenseList.innerHTML = "";

    let filteredExpenses = expenses;
const searchText =
searchExpense.value.toLowerCase();

filteredExpenses =
filteredExpenses.filter(function(expense){

    return expense.category
        .toLowerCase()
        .includes(searchText);

});
    if(filterCategory.value !== "All"){

        filteredExpenses =
        expenses.filter(function(expense){

            return expense.category ===
            filterCategory.value;

        });

    }
if(filteredExpenses.length === 0){

    expenseList.innerHTML =
    "<p>No expenses found.</p>";

    return;
}
    filteredExpenses.forEach(function(expense,index){

        const expenseItem =
        document.createElement("div");

        expenseItem.classList.add("expense-item");

        expenseItem.innerHTML = `
            <span>${expense.category}</span>

            <span>₹${expense.amount}</span>

            <button
                class="delete-btn"
                onclick="deleteExpense(${index})">
                Delete
            </button>
        `;

        expenseList.appendChild(expenseItem);

    });

}

function updateSpentAmount(){

    let total = 0;

    expenses.forEach(function(expense){

        total += Number(
            expense.amount
        );

    });

    spentAmount.textContent =
    `₹${total}`;

}

function updateRemainingBudget(){

    let totalSpent = 0;

    expenses.forEach(function(expense){

        totalSpent += Number(
            expense.amount
        );

    });

    const remaining =
    budget - totalSpent;

    remainingBudget.textContent =
    `₹${remaining}`;

}

function deleteExpense(index){

    expenses.splice(index,1);

    saveExpenses();

    displayExpenses();
    updateSpentAmount();
    updateRemainingBudget();
    updateCharts();

}

function saveExpenses(){

    localStorage.setItem(
        "expenses",
        JSON.stringify(expenses)
    );

}

function loadExpenses(){

    const savedExpenses =
    localStorage.getItem("expenses");

    if(savedExpenses){

        expenses =
        JSON.parse(savedExpenses);

        displayExpenses();
        updateSpentAmount();
        updateRemainingBudget();
        updateCharts();

    }

}

function setBudget(){

    if(budgetInput.value === ""){

        alert("Enter a budget");
        return;

    }

    budget =
    Number(budgetInput.value);

    budgetAmount.textContent =
    `₹${budget}`;

    localStorage.setItem(
        "budget",
        budget
    );

    updateRemainingBudget();

    budgetInput.value = "";

}

function loadBudget(){

    const savedBudget =
    localStorage.getItem("budget");

    if(savedBudget){

        budget =
        Number(savedBudget);

        budgetAmount.textContent =
        `₹${budget}`;

    }

}

function updateCharts(){

    const categoryTotals = {};

    expenses.forEach(function(expense){

        const category =
        expense.category;

        const amount =
        Number(expense.amount);

        if(categoryTotals[category]){

            categoryTotals[category] += amount;

        }
        else{

            categoryTotals[category] = amount;

        }

    });

    const labels =
    Object.keys(categoryTotals);

    const values =
    Object.values(categoryTotals);

    const pieCtx =
    document.getElementById("pieChart");

    if(pieChart){

        pieChart.destroy();

    }

    pieChart = new Chart(pieCtx, {

        type:"pie",

        data:{
            labels:labels,

            datasets:[{
                data:values
            }]
        }

    });

    const barCtx =
    document.getElementById("barChart");

    if(barChart){

        barChart.destroy();

    }

    barChart = new Chart(barCtx, {

        type:"bar",

        data:{

            labels:labels,

            datasets:[{

                label:"Expenses",

                data:values

            }]

        }

    });

}
loadBudget();
loadExpenses();
function exportCSV(){

    let csv =
    "Category,Amount,Date\n";

    expenses.forEach(function(expense){

        csv +=
        `${expense.category},${expense.amount},${expense.date}\n`;

    });

    const blob =
    new Blob([csv],{
        type:"text/csv"
    });

    const link =
    document.createElement("a");

    link.href =
    URL.createObjectURL(blob);

    link.download =
    "expenses.csv";

    link.click();

}
