function addItem() {
  let item = document.getElementById("item").value;
  let stock = document.getElementById("stock").value;
  let expiry = document.getElementById("expiry").value;

  let today = new Date();
  let expDate = new Date(expiry);

  let diff = expDate - today;
  let daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));

  let status = "";

  if (daysLeft <= 0) {
    status = "Expired";
  } else if (daysLeft <= 7) {
    status = "Critical";
  } else if (daysLeft <= 30) {
    status = "Expiring Soon";
  } else {
    status = "Good";
  }

  let row = `
    <tr>
      <td>${item}</td>
      <td>${stock}</td>
      <td>${expiry}</td>
      <td>${daysLeft}</td>
      <td>${status}</td>
    </tr>
  `;

  document.getElementById("tableBody").innerHTML += row;
}
