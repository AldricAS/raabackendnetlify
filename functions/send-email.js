const { Resend } = require('resend');

// Inisialisasi Resend dengan API Key kamu
const resend = new Resend('re_CTQN5ZaT_LZvcdtNhGigvSk81EEdLRuSm');

exports.handler = async (event, context) => {
  // Hanya izinkan request POST dari frontend
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { to, type, data } = JSON.parse(event.body);

    let subject = "";
    let htmlBody = "";

    // Template Email Header & Footer (Biar Mirip DANA)
    const header = `
      <div style="font-family: sans-serif; max-width: 500px; margin: auto; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; color: #1e293b;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #2563eb; margin: 0;">AldX Wallet</h1>
          <p style="font-size: 12px; color: #64748b;">E-Wallet Handal & Terpercaya</p>
        </div>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;">
    `;

    const footer = `
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;">
        <p style="font-size: 11px; color: #94a3b8; text-align: center;">
          Ini adalah pesan otomatis. Mohon tidak membalas email ini.<br>
          &copy; 2026 AldX Dev. All rights reserved.
        </p>
      </div>
    `;

    // Logika Pemilihan Konten Berdasarkan 'type'
    switch (type) {
      case 'GANTI_SANDI':
        subject = "🔑 Atur Ulang Kata Sandi Akun AldX";
        htmlBody = `
          ${header}
          <h3 style="color: #334155;">Halo, Aldric!</h3>
          <p>Kamu menerima email ini karena ada permintaan untuk mengatur ulang kata sandi akun e-wallet kamu.</p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${data.link}" style="background-color: #2563eb; color: white; padding: 12px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px;">Atur Ulang Sandi</a>
          </div>
          <p style="font-size: 12px; color: #64748b;">Link ini berlaku selama 1 jam. Jika bukan kamu yang meminta, abaikan email ini.</p>
          ${footer}
        `;
        break;

      case 'TOPUP_SALDO':
        subject = "✅ Top Up Berhasil - Saldo Bertambah!";
        htmlBody = `
          ${header}
          <h3 style="color: #059669; text-align: center;">Top Up Berhasil!</h3>
          <div style="background-color: #f0fdf4; border-radius: 12px; padding: 16px; text-align: center; margin: 20px 0;">
            <p style="margin: 0; color: #166534; font-size: 14px;">Jumlah Top Up</p>
            <h2 style="margin: 4px 0; color: #166534;">Rp ${Number(data.amount).toLocaleString('id-ID')}</h2>
          </div>
          <p>Saldo kamu sekarang adalah: <strong>Rp ${Number(data.newBalance).toLocaleString('id-ID')}</strong></p>
          <p style="font-size: 12px; color: #64748b;">Metode: ${data.method || 'Payment Gateway'}</p>
          ${footer}
        `;
        break;

      case 'BAYAR_QRIS':
        subject = "💸 Pembayaran Berhasil - Bukti Transaksi";
        htmlBody = `
          ${header}
          <h3 style="color: #2563eb; text-align: center;">Pembayaran Berhasil</h3>
          <div style="text-align: center; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #64748b;">Dibayarkan kepada:</p>
            <p style="margin: 4px 0; font-weight: bold; font-size: 18px;">${data.receiverName}</p>
            <h2 style="margin: 12px 0; color: #1e293b;">Rp ${Number(data.amount).toLocaleString('id-ID')}</h2>
          </div>
          <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;">ID Transaksi</td><td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; text-align: right; font-weight: bold;">${data.txId}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b;">Waktu</td><td style="padding: 8px 0; text-align: right; font-weight: bold;">${new Date().toLocaleString('id-ID')}</td></tr>
          </table>
          ${footer}
        `;
        break;

      default:
        return { statusCode: 400, body: "Tipe email tidak dikenal" };
    }

    // Eksekusi Pengiriman Email
    const result = await resend.emails.send({
      from: 'AldX Wallet <onboarding@resend.dev>',
      to: to,
      subject: subject,
      html: htmlBody,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: "Email Terkirim!", result }),
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};
