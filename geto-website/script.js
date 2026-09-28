document.addEventListener("DOMContentLoaded", () => {

    const $ = id =>
        document.getElementById(id);


    /* =========================
       PROFILE
    ========================= */

    $("profileImage").src =
        CONFIG.profile.image;

    $("profileName").textContent =
        CONFIG.profile.name;

    $("profileUsername").textContent =
        CONFIG.profile.username;

    $("profileBio").textContent =
        CONFIG.profile.bio;

    $("profileStatus").textContent =
        CONFIG.profile.status;

    $("footerName").textContent =
        CONFIG.profile.name;


    /* =========================
       SOCIAL
    ========================= */

    $("instagramLink").href =
        CONFIG.profile.instagram;

    $("telegramLink").href =
        CONFIG.profile.telegram;

    $("communityLink").href =
        CONFIG.links.community;


    /* =========================
       IMPORTANT LINKS
    ========================= */

    $("communityCard").href =
        CONFIG.links.community;

    $("sudoGroupCard").href =
        CONFIG.links.sudoGroup;

    $("chatGroupCard").href =
        CONFIG.links.chattingGroup;

    $("fontBotCard").href =
        CONFIG.links.fontBot;

    $("managementBotCard").href =
        CONFIG.links.managementBot;


    /* =========================
       YEAR
    ========================= */

    $("year").textContent =
        new Date().getFullYear();


    /* =========================
       BOT STATS
    ========================= */

    const total =
        CONFIG.bots.length;

    const active =
        CONFIG.bots.filter(
            bot =>
                bot.status.toLowerCase() === "active"
        ).length;

    const inactive =
        total - active;


    $("totalBots").textContent =
        total;

    $("activeBots").textContent =
        active;

    $("inactiveBots").textContent =
        inactive;


    /* =========================
       BOT LIST
    ========================= */

    const botList =
        $("botList");


    CONFIG.bots.forEach(
        (bot, index) => {

            const active =
                bot.status.toLowerCase() ===
                "active";


            const card =
                document.createElement("div");


            card.className =
                "bot-card";


            card.innerHTML = `

                <div class="bot-number">
                    ${String(index + 1).padStart(2, "0")}
                </div>

                <div class="bot-info">

                    <a
                        href="${escapeAttribute(bot.url)}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        ${escapeHTML(bot.name)}
                    </a>

                    <div
                        class="bot-status ${
                            active
                                ? "active"
                                : "inactive"
                        }"
                    >
                        ${
                            active
                                ? "ACTIVE"
                                : "INACTIVE"
                        }
                    </div>

                </div>
            `;


            botList.appendChild(card);

        }
    );


    /* =========================
       MUSIC
    ========================= */

    setupMusic();


    /* =========================
       SUDO
    ========================= */

    setupSudoForm();

});


/* =========================
   SAFE HTML
========================= */

function escapeHTML(value) {

    return String(value)

        .replaceAll("&", "&amp;")

        .replaceAll("<", "&lt;")

        .replaceAll(">", "&gt;")

        .replaceAll('"', "&quot;")

        .replaceAll("'", "&#039;");
}


function escapeAttribute(value) {

    return escapeHTML(value);

}


/* =========================
   MUSIC
========================= */

function setupMusic() {

    const audio =
        document.getElementById(
            "themeSong"
        );

    const button =
        document.getElementById(
            "musicButton"
        );

    const icon =
        document.getElementById(
            "musicIcon"
        );

    const text =
        document.getElementById(
            "musicText"
        );


    if (!audio || !button)
        return;


    audio.src =
        CONFIG.themeSong;

    audio.loop =
        true;

    audio.volume =
        0.35;


    function updateUI(
        playing
    ) {

        if (playing) {

            button.classList.add(
                "playing"
            );

            icon.textContent =
                "♫";

            text.textContent =
                "Playing";

        } else {

            button.classList.remove(
                "playing"
            );

            icon.textContent =
                "▶";

            text.textContent =
                "Music";
        }

    }


    async function playMusic() {

        try {

            await audio.play();

            updateUI(true);

        } catch {

            /*
             * Browser autoplay blocked.
             */
            updateUI(false);

        }

    }


    button.addEventListener(
        "click",
        async () => {

            if (audio.paused) {

                await playMusic();

            } else {

                audio.pause();

                updateUI(false);

            }

        }
    );


    /*
     * Retry after first interaction.
     */

    const unlock =
        () => {

            if (audio.paused) {

                playMusic();

            }

        };


    window.addEventListener(
        "click",
        unlock,
        { once: true }
    );

    window.addEventListener(
        "touchstart",
        unlock,
        {
            once: true,
            passive: true
        }
    );

    window.addEventListener(
        "keydown",
        unlock,
        { once: true }
    );


    /*
     * Initial autoplay attempt.
     */

    playMusic();


    /*
     * Resume when page becomes visible.
     */

    document.addEventListener(
        "visibilitychange",
        () => {

            if (
                document.visibilityState ===
                "visible"
            ) {

                if (audio.paused) {

                    playMusic();

                }

            }

        }
    );


    audio.addEventListener(
        "play",
        () => updateUI(true)
    );

    audio.addEventListener(
        "pause",
        () => updateUI(false)
    );

}


/* =========================
   SUDO FORM
========================= */

function setupSudoForm() {

    const form =
        document.getElementById(
            "sudoForm"
        );

    if (!form)
        return;


    const button =
        document.getElementById(
            "sudoSubmit"
        );

    const message =
        document.getElementById(
            "formMessage"
        );


    form.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            message.className =
                "form-message";

            message.textContent =
                "";


            const data =
                new FormData(form);


            const name =
                String(
                    data.get("name") || ""
                ).trim();


            const username =
                String(
                    data.get("username") || ""
                ).trim();


            const reason =
                String(
                    data.get("reason") || ""
                ).trim();


            const website =
                String(
                    data.get("website") || ""
                ).trim();


            /*
             * Honeypot
             */

            if (website) {

                form.reset();

                message.className =
                    "form-message success";

                message.textContent =
                    "Request sent.";

                return;

            }


            if (
                !name ||
                !username ||
                !reason
            ) {

                message.className =
                    "form-message error";

                message.textContent =
                    "Please fill all fields.";

                return;

            }


            button.disabled =
                true;


            button.querySelector(
                "span:first-child"
            ).textContent =
                "Sending...";


            try {

                const response =
                    await fetch(
                        CONFIG.sudoApi,
                        {

                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({
                                    name,
                                    username,
                                    reason,
                                    website
                                })

                        }
                    );


                const result =
                    await response.json()
                        .catch(
                            () => ({})
                        );


                if (!response.ok) {

                    throw new Error(
                        result.message ||
                        "Request failed."
                    );

                }


                message.className =
                    "form-message success";

                message.textContent =
                    "✅ Sudo request sent successfully!";


                form.reset();


            } catch (error) {

                console.error(
                    error
                );


                message.className =
                    "form-message error";

                message.textContent =
                    "❌ Could not send request. Try again later.";

            }


            button.disabled =
                false;


            button.querySelector(
                "span:first-child"
            ).textContent =
                "Send Sudo Request";

        }
    );

}
