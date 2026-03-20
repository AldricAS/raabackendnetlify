const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const API_KEY = "bN5dtLeL65dy1xNkanpBs7TdMrYQopnS";
const PROJECT_SLUG = "raa-store";

app.post('/buat-bayar', async (req, res) => {
    try {
        const { nominal } = req.body;

        const response = await axios.post(
            'https://app.pakasir.com/api/transactioncreate/qris',
            {
                project: PROJECT_SLUG,
                order_id: "RAA-" + Date.now(),
                amount: parseInt(nominal),
                api_key: API_KEY
            }
        );

        res.json(response.data);

    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).json({ error: "Gagal kontak Pakasir" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server jalan di port " + PORT));
