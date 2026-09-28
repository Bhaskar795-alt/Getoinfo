document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     BOT MATRIX
  ========================= */

  const botGrid = document.getElementById("botGrid");

  const totalBots = document.getElementById("totalBots");
  const activeBots = document.getElementById("activeBots");

  const bots = CONFIG.bots || [];

  const active = bots.filter(
    bot => bot.status === "active"
  ).length;

  totalBots.textContent = bots.length;
  activeBots.textContent = active;

  botGrid.innerHTML = "";

  bots.forEach((bot, index) => {

    const card = document.createElement("div");

    card.className = "bot-card";

    card.innerHTML = `
      <div class="bot-number">
        UNIT ${String(index + 1).padStart(2, "0")}
      </div>

      <h3>${escapeHTML(bot.name)}</h3>

      <div class="bot-status">
        ${bot.status === "active" ? "ACTIVE / ONLINE" : "INACTIVE"}
      </div>

      <a
        class="bot-open"
        href="${bot.url}"
        target="_blank"
        rel="noopener"
      >
        OPEN BOT ↗
      </a>
    `;

    botGrid.appendChild(card);

  });


  /* =========================
     YEAR
  ========================= */

  document.getElementById("year").textContent =
    new Date().getFullYear();


  /* =========================
     MUSIC AUTOPLAY
  ========================= */

  const audio = document.getElementById("themeSong");

  audio.src = CONFIG.themeSong;
  audio.loop = true;
  audio.volume = 0.35;

  let musicStarted = false;

  async function startMusic() {

    if (musicStarted) return;

    try {

      await audio.play();

      musicStarted = true;

    } catch (error) {

      /*
        Browser autoplay policy may block
        audible autoplay.

        We retry on first user interaction.
      */

    }

  }

  startMusic();

  [
    "click",
    "touchstart",
    "keydown",
    "pointerdown"
  ].forEach(eventName => {

    window.addEventListener(
      eventName,
      startMusic,
      {
        once: true,
        passive: true
      }
    );

  });


  /* =========================
     CLI
  ========================= */

  const terminalInput =
    document.getElementById("terminalInput");

  const terminalOutput =
    document.getElementById("terminalOutput");

  const runCommand =
    document.getElementById("runCommand");

  const clearTerminal =
    document.getElementById("clearTerminal");


  function printCommand(command) {

    const line = document.createElement("div");

    line.className = "cmd";

    line.textContent =
      `root@geto:~$ ${command}`;

    terminalOutput.appendChild(line);

  }


  function printAnswer(answer) {

    const line = document.createElement("div");

    line.className = "answer";

    line.innerHTML = answer;

    terminalOutput.appendChild(line);

  }


  function runCLI() {

    const command =
      terminalInput.value.trim().toLowerCase();

    if (!command) return;

    printCommand(command);

    terminalInput.value = "";


    if (command === "help") {

      printAnswer(`
        Available commands:<br>
        • bots — show bot fleet<br>
        • sudo — sudo group<br>
        • telegram — open Telegram<br>
        • instagram — open Instagram<br>
        • community — main community<br>
        • status — system status<br>
        • clear — clear terminal
      `);

    }

    else if (command === "bots") {

      const list = bots
        .map(
          (bot, i) =>
            `${i + 1}. ${escapeHTML(bot.name)} — ${bot.status.toUpperCase()}`
        )
        .join("<br>");

      printAnswer(list);

    }

    else if (command === "sudo") {

      printAnswer(
        `SUDO GROUP → <a href="${CONFIG.sudoGroup}" target="_blank">OPEN GROUP ↗</a>`
      );

    }

    else if (command === "telegram") {

      printAnswer(
        `TELEGRAM → <a href="${CONFIG.telegram}" target="_blank">OPEN PROFILE ↗</a>`
      );

    }

    else if (command === "instagram") {

      printAnswer(
        `INSTAGRAM → <a href="${CONFIG.instagram}" target="_blank">OPEN PROFILE ↗</a>`
      );

    }

    else if (command === "community") {

      printAnswer(
        `COMMUNITY → <a href="${CONFIG.mainCommunity}" target="_blank">JOIN ↗</a>`
      );

    }

    else if (command === "status") {

      printAnswer(
        "GETO CORE: <span style='color:#00ff9d'>ONLINE</span><br>" +
        `BOT UNITS: ${bots.length}<br>` +
        `ACTIVE: ${active}`
      );

    }

    else if (command === "clear") {

      terminalOutput.innerHTML = "";

    }

    else {

      printAnswer(
        `Command not found: <b>${escapeHTML(command)}</b><br>` +
        `Type <b>help</b> to see available commands.`
      );

    }

    terminalOutput.scrollTop =
      terminalOutput.scrollHeight;

  }


  runCommand.addEventListener(
    "click",
    runCLI
  );


  terminalInput.addEventListener(
    "keydown",
    event => {

      if (event.key === "Enter") {
        runCLI();
      }

    }
  );


  clearTerminal.addEventListener(
    "click",
    () => {

      terminalOutput.innerHTML = "";

    }
  );


  /* =========================
     COPY BUTTON
  ========================= */

  document.querySelectorAll(".copy-btn")
    .forEach(button => {

      button.addEventListener("click", async () => {

        const text =
          button.dataset.copy;

        try {

          await navigator.clipboard.writeText(text);

          const oldText =
            button.textContent;

          button.textContent = "COPIED ✓";

          setTimeout(() => {
            button.textContent = oldText;
          }, 1500);

        } catch {

          button.textContent = "COPY FAILED";

        }

      });

    });


  /* =========================
     SUDO REQUEST
  ========================= */

  const sudoForm =
    document.getElementById("sudoForm");

  const sudoMessage =
    document.getElementById("sudoMessage");


  sudoForm.addEventListener(
    "submit",
    async event => {

      event.preventDefault();

      const name =
        document.getElementById("sudoName")
          .value
          .trim();

      const username =
        document.getElementById("sudoUsername")
          .value
          .trim();

      const reason =
        document.getElementById("sudoReason")
          .value
          .trim();

      const website =
        document.getElementById("website")
          .value
          .trim();


      sudoMessage.textContent =
        "TRANSMITTING REQUEST...";


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

              body: JSON.stringify({
                name,
                username,
                reason,
                website
              })
            }
          );


        const data =
          await response.json();


        if (!response.ok) {
          throw new Error(
            data.error ||
            "Request failed"
          );
        }


        sudoMessage.textContent =
          "✓ REQUEST SENT SUCCESSFULLY.";

        sudoForm.reset();


      } catch (error) {

        sudoMessage.textContent =
          "✕ " +
          (error.message ||
            "Unable to send request.");

      }

    }
  );


  /* =========================
     ESCAPE HTML
  ========================= */

  function escapeHTML(value) {

    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  }

});
