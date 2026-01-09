const apiUrl = window.location.origin;

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById(
    "node-title"
  ).innerText = `Node Running on: ${apiUrl}`;
  fetchBlockchain();
});

function fetchBlockchain() {
  axios
    .get(`${apiUrl}/blockchain`)
    .then(function (response) {
      displayChain(response.data.chain);
      displayPending(response.data.pendingTransactions);
    })
    .catch(console.error);
}

function displayChain(chain) {
  const container = document.getElementById("chain-container");
  container.innerHTML = "";

  chain
    .slice()
    .reverse()
    .forEach((block) => {
      const date = new Date(block.timestamp).toLocaleString();
      const isGenesis = block.index === 1 ? "genesis" : "";

      let txHtml = "";
      if (block.transactions.length === 0)
        txHtml = '<span class="text-muted">System Block / No Data</span>';
      else {
        block.transactions.forEach((tx) => {
          // UPDATE TEKS: Format Supply Chain
          txHtml += `<div class="border-bottom p-2">
                    <span class="badge bg-success">Terkirim</span>
                    <strong>${tx.recipient}</strong> menerima stok:<br>
                    <i class="text-dark">"${tx.amount}"</i><br>
                    <small class="text-muted">Dari: ${tx.sender}</small>
                </div>`;
        });
      }

      const html = `
            <div class="card shadow-sm block-card ${isGenesis}">
                <div class="card-body">
                    <div class="d-flex justify-content-between">
                        <h5 class="card-title">Block #${block.index}</h5>
                        <span class="badge bg-secondary">${date}</span>
                    </div>
                    <p class="mb-1"><strong>Hash:</strong> <span class="text-truncate d-inline-block" style="max-width:300px; vertical-align:bottom;">${block.hash}</span></p>
                    <div class="data-scroll border rounded"><strong>Data Logistik:</strong>${txHtml}</div>
                </div>
            </div>`;
      container.innerHTML += html;
    });
}

function displayPending(pending) {
  const list = document.getElementById("pending-list");
  list.innerHTML = "";

  if (pending.length === 0) {
    list.innerHTML =
      '<li class="list-group-item text-muted">Belum ada pengiriman...</li>';
    return;
  }

  pending.forEach((tx) => {
    // UPDATE TEKS: Format Pending
    list.innerHTML += `<li class="list-group-item">
            <b>${tx.recipient}</b> <br> 
            <small>${tx.amount}</small>
        </li>`;
  });
}

document
  .getElementById("transactionForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    const payload = {
      amount: document.getElementById("amount").value,
      sender: document.getElementById("sender").value,
      recipient: document.getElementById("recipient").value,
    };

    axios.post(`${apiUrl}/transaction/broadcast`, payload).then(function () {
      alert("Data Pengiriman berhasil di-broadcast ke seluruh jaringan!");
      document.getElementById("amount").value = "";
      document.getElementById("recipient").value = "";
      fetchBlockchain();
    });
  });

function mineBlock() {
  axios.get(`${apiUrl}/mine`).then(function (response) {
    alert(
      "Validasi Berhasil! Block baru telah ditambahkan ke PharmaTrust Ledger."
    );
    fetchBlockchain();
  });
}
