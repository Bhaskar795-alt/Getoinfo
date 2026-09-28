export default async function handler(
    req,
    res
) {

    /* =========================
       CORS
    ========================= */

    const origin =
        process.env.ALLOWED_ORIGIN || "*";


    res.setHeader(
        "Access-Control-Allow-Origin",
        origin
    );

    res.setHeader(
        "Access-Control-Allow-Methods",
        "POST, OPTIONS"
    );

    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type"
    );


    /* =========================
       OPTIONS
    ========================= */

    if (req.method === "OPTIONS") {

        return res
            .status(204)
            .end();

    }


    /* =========================
       ONLY POST
    ========================= */

    if (req.method !== "POST") {

        return res
            .status(405)
            .json({
                ok: false,
                message:
                    "Method not allowed."
            });

    }


    try {

        const {
            name,
            username,
            reason,
            website
        } = req.body || {};


        /* =========================
           HONEYPOT
        ========================= */

        if (website) {

            return res
                .status(200)
                .json({
                    ok: true
                });

        }


        /* =========================
           ENVIRONMENT
        ========================= */

        const token =
            process.env.TELEGRAM_BOT_TOKEN;

        const chatId =
            process.env.TELEGRAM_CHAT_ID;


        if (!token || !chatId) {

            console.error(
                "Telegram environment variables missing."
            );

            return res
                .status(500)
                .json({
                    ok: false,
                    message:
                        "Server configuration error."
                });

        }


        /* =========================
           VALIDATION
        ========================= */

        if (
            typeof name !== "string" ||
            typeof username !== "string" ||
            typeof reason !== "string"
        ) {

            return res
                .status(400)
                .json({
                    ok: false,
                    message:
                        "Invalid request."
                });

        }


        const cleanName =
            name
                .trim()
                .slice(0, 80);


        const cleanUsername =
            username
                .trim()
                .slice(0, 64);


        const cleanReason =
            reason
                .trim()
                .slice(0, 500);


        if (
            !cleanName ||
            !cleanUsername ||
            !cleanReason
        ) {

            return res
                .status(400)
                .json({
                    ok: false,
                    message:
                        "All fields are required."
                });

        }


        /* =========================
           TELEGRAM MESSAGE
        ========================= */

        const text =
`👑 NEW SUDO REQUEST

━━━━━━━━━━━━━━━━━━

👤 Name:
${cleanName}

📱 Telegram:
${cleanUsername}

📝 Reason:
${cleanReason}

━━━━━━━━━━━━━━━━━━

🌐 Sent from GETO Website`;


        /* =========================
           TELEGRAM API
        ========================= */

        const telegram =
            await fetch(
                `https://api.telegram.org/bot${token}/sendMessage`,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            chat_id: chatId,
                            text
                        })

                }
            );


        const result =
            await telegram.json();


        if (
            !telegram.ok ||
            !result.ok
        ) {

            console.error(
                "Telegram error:",
                result
            );

            return res
                .status(502)
                .json({
                    ok: false,
                    message:
                        "Telegram delivery failed."
                });

        }


        return res
            .status(200)
            .json({
                ok: true,
                message:
                    "Sudo request sent."
            });


    } catch (error) {

        console.error(
            error
        );


        return res
            .status(500)
            .json({
                ok: false,
                message:
                    "Internal server error."
            });

    }

}
