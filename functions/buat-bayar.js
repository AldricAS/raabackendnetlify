const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// ⚠️ Saran: pindahin ke ENV nanti
const API_KEY = process.env.API_KEY || "bN5dtLeL65dy1xNkanpBs7TdMrYQopnS";
const PROJECT_SLUG = "raa-store";

app.post('/buat-bayar', async (req, res) => {
    try {
        const { nominal } = req.body;

        // Validasi input
        if (!nominal) {
            return res.status(400).json({
                error: "Nominal wajib diisi"
            });
        }

        console.log("Request masuk:", nominal);

        const response = await axios.post(
            'https://app.pakasir.com/api/transactioncreate/qris',
            {
                project: PROJECT_SLUG,
                order_id: "RAA-" + Date.now(),
                amount: parseInt(nominal),
                api_key: API_KEY
            }
        );

        return res.json(response.data);

    } catch (error) {
        console.error("Error:", error.response?.data || error.message);

        return res.status(500).json({
            error: "Gagal kontak Pakasir",
            detail: error.response?.data || error.message
        });
    }
});

// 🔥 FIX penting: route root biar gak 404
app.get('/', (req, res) => {
    res.send("Backend RAA Store aktif 🚀");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("🚀 Server jalan di port " + PORT);
});
