export default async function handler(req, res) {

  const allowedOrigin =
    process.env.ALLOWED_ORIGIN || "*";

  res.setHeader(
    "Access-Control-Allow-Origin",
    allowedOrigin
  );

  res.setHeader(
    "Access-Control-Allow-Methods",
    "POST, OPTIONS"
  );

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type"
  );


  if (req.method === "OPTIONS") {

    return res.status(204).end();

  }


  if (req.method !== "POST") {

    return res.status(405).json({
      error: "Method not allowed"
    });

  }


  try {

    const token =
      process.env.TELEGRAM_BOT_TOKEN;

    const chatId =
      process.env.TELEGRAM_CHAT_ID;


    if (!token || !chatId) {

      return res.status(500).json({
        error:
          "Telegram environment variables are missing."
      });

    }


    const {
      name,
      username,
      reason,
      website
    } = req.body || {};


    /* Honeypot */

    if (website) {

      return res.status(400).json({
        error: "Invalid request."
      });

    }


    if (!name || !username || !reason) {

      return res.status(400).json({
        error:
          "Name, username and reason are required."
      });

    }


    if (name.length > 60) {

      return res.status(400).json({
        error: "Name is too long."
      });

    }


    if (username.length > 80) {

      return res.status(400).json({
        error: "Username is too long."
      });

    }


    if (reason.length > 500) {

      return res.status(400).json({
        error: "Reason is too long."
      });

    }


    const cleanName =
      escapeTelegram(name);

    const cleanUsername =
      escapeTelegram(username);

    const cleanReason =
      escapeTelegram(reason);


    const message = `
👑 NEW SUDO REQUEST

━━━━━━━━━━━━━━━━━━

👤 Name:
${cleanName}

📱 Telegram:
${cleanUsername}

📝 Reason:
${cleanReason}

━━━━━━━━━━━━━━━━━━

🌐 Sent from GETO Website
`;


    const telegramResponse =
      await fetch(
        `https://api.telegram.org/bot${token}/sendMessage`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            chat_id: chatId,
            text: message
          })
        }
      );


    const telegramData =
      await telegramResponse.json();


    if (!telegramResponse.ok ||
        !telegramData.ok) {

      console.error(
        "Telegram API error:",
        telegramData
      );

      return res.status(502).json({
        error:
          "Telegram message could not be sent."
      });

    }


    return res.status(200).json({
      success: true,
      message:
        "Sudo request sent successfully."
    });


  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error:
        "Internal server error."
    });

  }

}


function escapeTelegram(value) {

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

}
