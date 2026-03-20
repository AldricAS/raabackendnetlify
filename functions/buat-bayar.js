const axios = require("axios");

exports.handler = async (event) => {
  // handle CORS preflight
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
    const body = JSON.parse(event.body);
    const { nominal } = body;

    const response = await axios.post(
      "https://app.pakasir.com/api/transactioncreate/qris",
      {
        project: "raa-store",
        order_id: "RAA-" + Date.now(),
        amount: parseInt(nominal),
        api_key: "bN5dtLeL65dy1xNkanpBs7TdMrYQopnS"
      }
    );

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(response.data)
    };

  } catch (error) {
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
