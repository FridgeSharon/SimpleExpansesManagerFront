window.onload = function () {
  // Set up all the required elements ---
  const monthTabs = document.getElementById('monthTabs');
  const yearSelector = document.getElementById('year');
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const years = [2020, 2021, 2022, 2023, 2024, 2025];

  const editButtonHtml = '<button class="editButton">Edit</button>'
  const saveButtonHtml = '<button class="saveButton">Save</button>'
  const checkBoxHtml = '<input type="checkbox">'

  months.forEach((month, index) => {
    const listItem = document.createElement('li');
    listItem.className = "nav-item";

    const anchor = document.createElement('a');
    anchor.href = "#";
    anchor.textContent = month;

    if (index === 0) {
      anchor.className = "active";
    }

    listItem.appendChild(anchor);
    monthTabs.appendChild(listItem);
  });

  years.forEach((year) => {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year;
    yearSelector.appendChild(option);
  });

  // Add listeners ---
  document
    .getElementById("expenseForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      addExpense();
      clearForm();
      updateSummary();
    });

  document.querySelectorAll("#monthTabs li a").forEach(function (tab) {
    tab.addEventListener("click", function (event) {
      event.preventDefault();
      document
        .querySelector("#monthTabs li a.active")
        .classList.remove("active");
      this.classList.add("active");
    });
  });

  // Declare functions ---
  function addExpense() {
    const description = document.getElementById("description").value;
    const amount = document.getElementById("amount").value;
    const refund = document.getElementById("refund").checked; // Assuming refund is a checkbox
    const table = document.getElementById("expenseTable");

    let row = table.insertRow(-1);
    let descriptionCell = row.insertCell(0);
    let amountCell = row.insertCell(1);
    let refundCell = row.insertCell(2);
    let editCell = row.insertCell(3);

    descriptionCell.innerHTML = description;
    amountCell.innerHTML = amount;
    refundCell.innerHTML = getRefundCheckboxHtml(refund, true);
    editCell.innerHTML = editButtonHtml;

    editCell
      .querySelector(".editButton")
      .addEventListener("click", function () {
        editRow(row);
      });
  }

  function editRow(row) {
    let cells = row.cells;
    for (let i = 0; i < cells.length - 2; i++) { // Exclude the last two cells (refund checkbox and edit button)
      let cell = cells[i];
      let input = document.createElement("input");
      input.value = cell.innerHTML;
      cell.innerHTML = "";
      cell.appendChild(input);
    }
    let checkboxCell = cells[cells.length - 2]; // Refund checkbox cell
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = checkboxCell.querySelector("input").checked;
    checkboxCell.innerHTML = "";
    checkboxCell.appendChild(checkbox);
    cells[cells.length - 1].innerHTML = saveButtonHtml;
    cells[cells.length - 1]
      .querySelector(".saveButton")
      .addEventListener("click", function () {
        saveRow(row);
      });
  }

  function saveRow(row) {
    let cells = row.cells;
    for (let i = 0; i < cells.length - 1; i++) {
      let cell = cells[i];
      cell.innerHTML = cell.querySelector("input").value;
    }
    let checkbox = cells[cells.length - 1].querySelector("input");
    cells[cells.length - 1].innerHTML =
      getRefundCheckboxHtml(checkbox.checked, true); // Display as a disabled checkbox (no longer editable)
    cells[cells.length - 1].innerHTML +=
      '<button class="editButton">Edit</button>';
    cells[cells.length - 1]
      .querySelector(".editButton")
      .addEventListener("click", function () {
        editRow(row);
      });
  }

  function clearForm() {
    document.getElementById("description").value = "";
    document.getElementById("amount").value = "";
    document.getElementById("refund").checked = false; // Clear the refund checkbox
  }

  function updateSummary() {
    let table = document.getElementById("expenseTable");
    let total = 0;

    // Start at 2 to skip the headers and description rows
    for (let i = 2; i < table.rows.length; i++) {
      let amountCell = table.rows[i].cells[1];
      let refundCheckbox = table.rows[i].cells[2].querySelector("input");

      let amount = Number(amountCell.innerText);
      let isRefund = refundCheckbox.checked;

      total += isRefund ? -amount : amount;
    }

    document.getElementById("summary").innerText = "Total: " + total;
  }

  function getRefundCheckboxHtml(checked, disabled) {
    let checkedStatus = "";
    let refundText = "";
    if (checked) {
      checkedStatus = "checked";
      refundText = "Refund";
    }
    const disabledStatus = disabled ? "disabled" : "";

    return `<input type="checkbox" ${checkedStatus} ${disabledStatus}> ${refundText}`;
  }

  // year selector functionality:
  // document.getElementById('year').value


}