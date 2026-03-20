const axios = require('axios');

const API_KEY = "bN5dtLeL65dy1xNkanpBs7TdMrYQopnS";
const PROJECT_SLUG = "raa-store";

exports.handler = async (event) => {

  // CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST"
      }
    };
  }

  try {
    // 🔥 Ini pengganti req.body
    const { nominal } = JSON.parse(event.body || "{}");

    if (!nominal) {
      return {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: "Nominal wajib diisi" })
      };
    }

    console.log(`Memproses nominal: ${nominal}`);

    // 🔥 INI SAMA PERSIS KAYAK KODE LU
    const response = await axios.post(
      'https://app.pakasir.com/api/transactioncreate/qris',
      {
        project: PROJECT_SLUG,
        order_id: "RAA-" + Date.now(),
        amount: parseInt(nominal),
        api_key: API_KEY
      }
    );

    // 🔥 pengganti res.json()
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(response.data)
    };

  } catch (error) {
    console.error("Error:", error.response?.data || error.message);

    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        error: error.response?.data || error.message
      })
    };
  }
};
