<?php
// api/cryptoAPI.php
include '../config/config.php';

header('Content-Type: application/json');

if (isset($_GET['symbol'])) {
    $symbol = strtoupper($_GET['symbol']);

    // URL de CoinAPI para obtener el precio de una criptomoneda específica
    $url = "https://rest.coinapi.io/v1/assets/$symbol";
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        "X-CoinAPI-Key: " . COINAPI_KEY
    ));

    $response = curl_exec($ch);
    curl_close($ch);

    $data = json_decode($response, true);

    if (!empty($data[0]['price_usd'])) {
        // Formatea el precio a cinco decimales antes de enviarlo al frontend
        $price = number_format($data[0]['price_usd'], 5, '.', '');
        echo json_encode([
            'name' => $data[0]['name'],
            'price' => $price
        ]);
    } else {
        echo json_encode(['error' => 'Cryptocurrency not found']);
    }
} else {
    echo json_encode(['error' => 'No symbol provided']);
}
?>
