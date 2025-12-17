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
        txHtml = '<span class="text-muted">No Data</span>';
      else {
        block.transactions.forEach((tx) => {
          txHtml += `<div class="border-bottom p-1"><strong>${tx.recipient}</strong> - ${tx.amount}<br><small class="text-muted">${tx.sender}</small></div>`;
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
                    <div class="data-scroll border rounded"><strong>Data:</strong>${txHtml}</div>
                </div>
            </div>`;
      container.innerHTML += html;
    });
}

function displayPending(pending) {
  const list = document.getElementById("pending-list");
  list.innerHTML = "";
  if (pending.length === 0) {
    list.innerHTML = '<li class="list-group-item text-muted">Kosong...</li>';
    return;
  }
  pending.forEach((tx) => {
    list.innerHTML += `<li class="list-group-item"><b>${tx.recipient}</b> - ${tx.amount}</li>`;
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
      alert("Data dikirim ke seluruh network!");
      document.getElementById("amount").value = "";
      document.getElementById("recipient").value = "";
      fetchBlockchain();
    });
  });

function mineBlock() {
  axios.get(`${apiUrl}/mine`).then(function (response) {
    alert("Block Berhasil di-Mining!");
    fetchBlockchain();
  });
}
