// ===== LOAD PROFILE =====
document.getElementById('profileImg').src = CONFIG.profileImage;
document.getElementById('statusText').textContent = CONFIG.status.toUpperCase();
document.getElementById('footerName').textContent = CONFIG.name;
document.getElementById('aboutBio').textContent = CONFIG.bio;

// ===== ABOUT LINKS =====
document.getElementById('aboutTg').href = CONFIG.telegram;
document.getElementById('aboutTg').textContent = CONFIG.telegramUsername;
document.getElementById('aboutIg').href = CONFIG.instagram;
document.getElementById('aboutIg').textContent = CONFIG.instagramHandle;
document.getElementById('aboutCommunity').href = CONFIG.community;

// ===== CONTACT CARDS =====
document.getElementById('cTg').href = CONFIG.telegram;
document.getElementById('cTgVal').textContent = CONFIG.telegramUsername;
document.getElementById('cGroup').href = CONFIG.sudoGroup;
document.getElementById('cSupport').href = CONFIG.community;
document.getElementById('cIg').href = CONFIG.instagram;

// ===== BOTS LIST =====
let active = 0, deactive = 0;
const botsList = document.getElementById('botsList');

CONFIG.bots.forEach((bot, i) => {
    if (bot.status === 'active') active++;
    else deactive++;

    const div = document.createElement('a');
    div.href = bot.link;
    div.target = '_blank';
    div.className = `bot-item ${bot.status}`;

    const flagLabel = bot.flagship ? 'FLAGSHIP POWERHOUSE • ' : '';
    const descLine = bot.desc ? `<span style="color:#888;font-size:0.75rem">${bot.desc}</span>` : '';

    div.innerHTML = `
        <div class="bot-info">
            <span class="bot-name">${flagLabel}${bot.name}</span>
            <span class="bot-user">${bot.username}</span>
            ${descLine}
        </div>
        <span class="bot-status ${bot.status}">${bot.status.toUpperCase()}</span>
    `;
    botsList.appendChild(div);
});

document.getElementById('totalBots').textContent = CONFIG.bots.length;
document.getElementById('activeCount').textContent = active;

// ===== TERMINAL =====
const termBody = document.getElementById('termBody');
const termInput = document.getElementById('termInput');

function addLine(text, cls = 'term-out') {
    const p = document.createElement('p');
    p.className = cls;
    p.innerHTML = text;
    termBody.appendChild(p);
    termBody.scrollTop = termBody.scrollHeight;
}

termInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const cmd = termInput.value.trim().toLowerCase();
        if (!cmd) return;

        addLine(`<span style="color:#00ff9d">root@geto:~#</span> ${cmd}`, 'term-info');
        termInput.value = '';

        switch (cmd) {
            case 'help':
                addLine('Available commands:');
                addLine('&nbsp;&nbsp;<span class="cyan">bots</span> - List all bots');
                addLine('&nbsp;&nbsp;<span class="cyan">sudo</span> - Sudo group link');
                addLine('&nbsp;&nbsp;<span class="cyan">support</span> - Community link');
                addLine('&nbsp;&nbsp;<span class="cyan">insta</span> - Instagram handle');
                addLine('&nbsp;&nbsp;<span class="cyan">tg</span> - Telegram username');
                addLine('&nbsp;&nbsp;<span class="cyan">stats</span> - Bot statistics');
                addLine('&nbsp;&nbsp;<span class="cyan">clear</span> - Clear terminal');
                break;
            case 'bots':
                addLine(`Total bots: ${CONFIG.bots.length} | Active: ${active}`);
                CONFIG.bots.forEach((b, i) => {
                    addLine(`&nbsp;&nbsp;[${i + 1}] <span class="cyan">${b.username}</span> - ${b.status.toUpperCase()}`);
                });
                break;
            case 'sudo':
                addLine(`Sudo Group → <a href="${CONFIG.sudoGroup}" target="_blank" style="color:#00e5ff">${CONFIG.sudoGroup}</a>`);
                break;
            case 'support':
            case 'community':
                addLine(`Community → <a href="${CONFIG.community}" target="_blank" style="color:#00e5ff">${CONFIG.community}</a>`);
                break;
            case 'insta':
            case 'instagram':
                addLine(`Instagram → <a href="${CONFIG.instagram}" target="_blank" style="color:#00e5ff">${CONFIG.instagramHandle}</a>`);
                break;
            case 'tg':
            case 'telegram':
                addLine(`Telegram → <a href="${CONFIG.telegram}" target="_blank" style="color:#00e5ff">${CONFIG.telegramUsername}</a>`);
                break;
            case 'stats':
                addLine(`Total: ${CONFIG.bots.length} | Active: ${active} | Deactive: ${deactive}`);
                addLine(`Engine: TELETHON | Uptime: 99.9%`);
                break;
            case 'clear':
                termBody.innerHTML = '';
                addLine('Terminal cleared.');
                break;
            case 'whoami':
                addLine(`You are talking to ${CONFIG.name} — Telegram Bot Fleet Master`);
                break;
            default:
                addLine(`Command not found: ${cmd}. Type <span class="cyan">help</span>`, 'term-err');
        }
    }
});

// ===== THEME SONG =====
const audio = document.getElementById('themeSong');
const musicBtn = document.getElementById('musicToggle');
audio.src = CONFIG.themeSong;

musicBtn.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        musicBtn.classList.add('playing');
        musicBtn.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        audio.pause();
        musicBtn.classList.remove('playing');
        musicBtn.innerHTML = '<i class="fas fa-music"></i>';
    }
});

if (CONFIG.autoPlaySong) {
    document.body.addEventListener('click', () => {
        if (audio.paused && !musicBtn.classList.contains('playing')) {
            audio.play().then(() => {
                musicBtn.classList.add('playing');
                musicBtn.innerHTML = '<i class="fas fa-pause"></i>';
            }).catch(() => {});
        }
    }, { once: true });
}

// ===== MATRIX RAIN EFFECT =====
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const chars = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎ0123456789ABCDEF';
const fontSize = 14;
let columns = Math.floor(canvas.width / fontSize);
let drops = Array(columns).fill(1);

window.addEventListener('resize', () => {
    columns = Math.floor(canvas.width / fontSize);
    drops = Array(columns).fill(1);
});

function drawMatrix() {
    ctx.fillStyle = 'rgba(5, 0, 10, 0.08)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#00ff9d';
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}
setInterval(drawMatrix, 50);
