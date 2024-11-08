document.addEventListener("DOMContentLoaded", () => {
    loadPopularCryptos();
});

async function loadPopularCryptos() {
    const popularCryptos = ["BTC", "ETH", "ADA", "BNB", "XRP"];
    const container = document.getElementById("crypto-list");
    container.innerHTML = ""; // Limpiar contenido previo

    for (const symbol of popularCryptos) {
        try {
            const data = await fetchCryptoData(symbol);
            if (data) {
                displayCrypto(container, data, symbol);
            } else {
                showErrorMessage(container, `Error fetching data for ${symbol}`);
            }
        } catch (error) {
            showErrorMessage(container, `Failed to load ${symbol}: ${error.message}`);
        }
    }
}

async function fetchCryptoData(symbol) {
    try {
        const response = await fetch(`api/cryptoAPI.php?symbol=${symbol}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        return data.error ? null : data;
    } catch (error) {
        console.error("Error fetching crypto data:", error);
        return null;
    }
}

function displayCrypto(container, data, symbol) {
    const cryptoDiv = document.createElement("div");
    cryptoDiv.classList.add("crypto-item");

    const infoDiv = document.createElement("div");
    infoDiv.classList.add("crypto-info");
    infoDiv.innerHTML = `<strong>${data.name}</strong><span>Symbol: ${symbol}</span>`;

    const priceDiv = document.createElement("div");
    priceDiv.classList.add("crypto-price");
    priceDiv.textContent = `$${data.price}`;

    const chartCanvas = document.createElement("canvas");
    chartCanvas.id = `chart-${symbol}`;

    cryptoDiv.appendChild(infoDiv);
    cryptoDiv.appendChild(priceDiv);
    cryptoDiv.appendChild(chartCanvas);
    container.appendChild(cryptoDiv);

    renderChart(chartCanvas, symbol);
}

function showErrorMessage(container, message) {
    const errorMessage = document.createElement("p");
    errorMessage.textContent = message;
    errorMessage.classList.add("error-message");
    container.appendChild(errorMessage);
}

async function renderChart(canvas, symbol) {
    const data = {
        labels: ["1D", "1W", "1M", "3M", "1Y"],
        datasets: [{
            label: `${symbol} Price`,
            data: Array.from({ length: 5 }, () => Math.random() * 1000),
            borderColor: "#4CAF50",
            backgroundColor: "rgba(76, 175, 80, 0.2)"
        }]
    };

    new Chart(canvas, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

async function searchCrypto() {
    const query = document.getElementById("crypto-search").value.toUpperCase();

    if (!query || !/^[A-Z]{3,5}$/.test(query)) { // Validar si el símbolo es válido
        alert("Please enter a valid cryptocurrency symbol (e.g., BTC, ETH)");
        return;
    }

    try {
        const data = await fetchCryptoData(query);
        const container = document.getElementById("crypto-list");
        container.innerHTML = ""; // Limpiar lista

        if (data) {
            displayCrypto(container, data, query);
        } else {
            showErrorMessage(container, "Cryptocurrency not found!");
        }
    } catch (error) {
        alert("Error searching cryptocurrency: " + error.message);
    }
}
