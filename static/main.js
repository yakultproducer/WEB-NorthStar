// Function to clear table rows except the header
function clearTableRows() {
    var table = document.getElementById('my-table');
    // Remove all rows except the header (keeping the first row)
    for (var i = table.rows.length - 1; i > 0; i--) {
        table.deleteRow(i);
    }
}

// Function to add a data row to the table
function addDataRow(table, data1, data2) {
    var row = table.insertRow(-1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    cell1.innerHTML = data1;
    cell2.innerHTML = data2;
}

// Function to update the table based on the selected category
function showCategory(category) {
    // Get the table
    var table = document.getElementById("my-table");

    // Clear existing rows except the header
    clearTableRows();

    // Add data rows based on the selected category
    if (category === 'Management') {
        addDataRow(table, "conf_swch", "A switch table for owner to turn on/off logging or verify");
        addDataRow(table, "verify-me", "self verify for new member");
    } else if (category === 'Misc') {
        addDataRow(table, "ping", "return bot latency");
        addDataRow(table, "poll-create", "create a poll for members to vote on");
        addDataRow(table, "league info", "show the league player's info");
    } else if (category === 'Games') {
        addDataRow(table, "cnt", "A 5x5 board connect three");
        addDataRow(table, "ttt", "A 3x3 board tic tac toe");
    }
}

function redirectToDashboard() {
    // Use window.location.href to navigate to the dashboard.html page
    window.location.href = 'login';
}




// Attach the initializePage function to the 'load' event of the window
window.onload = showCategory('Management')

document.querySelector('a[href="#features"]').addEventListener('click', function (event) {
    event.preventDefault();  // Prevent default anchor behavior

    var targetElement = document.getElementById('features');
    var targetPosition = targetElement.offsetTop - 150;

    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
});

document.querySelector('a[href="#home"]').addEventListener('click', function (event) {
    event.preventDefault();  // Prevent default anchor behavior

    var targetElement = document.getElementById('home');
    var targetPosition = targetElement.offsetTop - 150;

    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
});
