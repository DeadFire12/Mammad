const nameScreen = document.getElementById('nameScreen');
const nameInput = document.getElementById('nameInput');
const nameBtn = document.getElementById('nameBtn');
const storyScreen = document.getElementById('storyScreen');
const storyName = document.getElementById('storyName');
const storyText = document.getElementById('storyText');
const startBtn = document.getElementById('startBtn');
const gameContainer = document.getElementById('gameContainer');
const btn = document.getElementById('myBtn');
const btnText = btn.querySelector('.btn-text');
const counter = document.getElementById('counter');
const hint = document.getElementById('hint');
const rankBadge = document.getElementById('rankBadge');
const congrats = document.getElementById('congrats');
const achievement = document.getElementById('achievement');
const achTitle = document.getElementById('achTitle');
const achDesc = document.getElementById('achDesc');
const modal = document.getElementById('modal');
const modalRank = document.getElementById('modalRank');
const modalTaunt = document.getElementById('modalTaunt');
const modalButtons = document.getElementById('modalButtons');
const secretModal = document.getElementById('secretModal');
const secretRank = document.getElementById('secretRank');
const secretTaunt = document.getElementById('secretTaunt');
const secretButtons = document.getElementById('secretButtons');
const gameOver = document.getElementById('gameOver');
const finalScore = document.getElementById('finalScore');
const finalTaunt = document.getElementById('finalTaunt');
const restartBtn = document.getElementById('restartBtn');
const regretMsg = document.getElementById('regretMsg');
const secretBtn = document.getElementById('secretBtn');

let playerName = 'غریبه';
let count = 0;
let audioCtx = null;
let lastRankMin = 0;
let gameActive = false;
let currentPersuasionStep = 0;
let currentRankData = null;
let secretStep = 0;

/* ===================== موقعیت تصادفی دکمه نامرئی ===================== */
function placeSecretButton() {
  const padding = 40;
  const x = padding + Math.random() * (window.innerWidth - padding * 2 - 20);
  const y = padding + Math.random() * (window.innerHeight - padding * 2 - 20);
  secretBtn.style.left = x + 'px';
  secretBtn.style.top = y + 'px';
}

/* ===================== رنک‌ها ===================== */
function getRanks() {
  return [
    {
      min: 0, name: 'تازه‌کار', color: '#8b0000', bg: 'linear-gradient(135deg, #5a0000, #8b0000)',
      achievement: { title: `${playerName} وارد جهنم شد`, desc: `${playerName} اولین کلیک رو زد. مغرش هنوز یه کم کار می‌کرد.` },
      questions: [
        { text: `${playerName}، هنوز می‌تونی گاییده‌نشو ول کنی و برگردی.`, quit: 'ول می‌کنم', cont: 'نه، گاییده شم' },
        { text: `می‌دونی چی می‌شه اگه ادامه بدی ${playerName}؟ هیچی. فقط یه احمق پوچ.`, quit: 'نمی‌خوام احمق باشم', cont: 'احمق بودن باحاله' },
        { text: `خانواده‌ت منتظرتن ${playerName}. تو اینجا چیکار می‌کنی کسکش؟`, quit: 'دارم می‌رم پیششون', cont: 'بذار منتظر بمونن' },
        { text: `آخرین باره می‌پرسم ${playerName}... ادامه می‌دی؟`, quit: 'نه', cont: 'آره کیرم' }
      ]
    },
    {
      min: 10, name: 'مبتدی', color: '#cc0000', bg: 'linear-gradient(135deg, #8b0000, #cc0000)',
      achievement: { title: `انگشت ${playerName} دیگه مال خودش نیست`, desc: `۱۰ کلیک. ${playerName} حالا یه برده‌ی کوچیک و گاییده‌ست.` },
      questions: [
        { text: `${playerName}، ۱۰ تا کلیک کردی و هنوز فکر می‌کنی کنترل داری؟ احمق.`, quit: 'کنترل دارم', cont: 'کنترل مال دکمه‌ست' },
        { text: `اگه الان مامانت ببینه چیکار می‌کنی ${playerName}، چی می‌گه؟`, quit: 'شرمنده می‌شم', cont: 'می‌گم دارم تمرین می‌کنم' },
        { text: `مغزت هنوز کار می‌کنه ${playerName} یا فقط انگشت کیریت؟`, quit: 'مغزم برگشت', cont: 'انگشتم رئیسه' },
        { text: `جدی می‌گی ادامه می‌دی ${playerName}؟`, quit: 'نه دیگه', cont: 'آره' },
        { text: `${playerName}... تو داری مسخره می‌شی کسکش.`, quit: 'می‌دونم، تموم', cont: 'بذار مسخره بشم' }
      ]
    },
    {
      min: 50, name: 'کارآموز', color: '#ff2222', bg: 'linear-gradient(135deg, #a00000, #ff2222)',
      achievement: { title: `${playerName} کارمند رسمی بخش پوچی شد`, desc: `۵۰ کلیک. حالا ${playerName} می‌تونه تو رزومه‌ش بنویسه: متخصص گاییده شدن.` },
      questions: [
        { text: `۵۰ تا شد ${playerName}. هنوز حس موفقیت می‌کنی؟ احمق.`, quit: 'نه، شکست خوردم', cont: 'آره قهرمانم' },
        { text: `مگس‌های پشت مانیتورت هم ازت خسته شدن ${playerName}.`, quit: 'منم خسته‌م', cont: 'من از مگس قوی‌ترم' },
        { text: `هیچ کار بهتری تو زندگی نداری ${playerName}؟`, quit: 'چرا دارم', cont: 'فعلاً نه' },
        { text: `این دکمه داره کیرتو می‌سوزونه ${playerName}. نمی‌فهمی؟`, quit: 'فهمیدم', cont: 'بذار بسوزه' },
        { text: `آخرین شانس ${playerName}...`, quit: 'ولش می‌کنم', cont: 'هرگز' }
      ]
    },
    {
      min: 100, name: 'ماهر', color: '#ff3333', bg: 'linear-gradient(135deg, #b00000, #ff3333)',
      achievement: { title: `استاد ${playerName} در هنر هیچی`, desc: `۱۰۰ کلیک! ${playerName} حالا ماهر شده تو کاری که هیچ‌کس بابتش پول نمی‌ده.` },
      questions: [
        { text: `۱۰۰ تا ${playerName}... این دیگه مهارت نیست، بیماریه کسکش.`, quit: 'حق داری', cont: 'بیماری شیرینیه' },
        { text: `اگه کسی الان ببینه چیکار می‌کنی ${playerName} خجالت نمی‌کشی؟`, quit: 'چرا خیلی', cont: 'بذار ببینن' },
        { text: `جدی فکر می‌کنی این کار ارزش داره ${playerName}؟`, quit: 'نه', cont: 'آره داره' },
        { text: `یه بار دیگه فکر کن ${playerName}...`, quit: 'فکر کردم، نه', cont: 'فکر کردم، آره' },
        { text: `${playerName} تو واقعاً یه نونه‌ای.`, quit: 'می‌دونم', cont: 'افتخار می‌کنم' }
      ]
    },
    {
      min: 500, name: 'حرفه‌ای', color: '#ff4444', bg: 'linear-gradient(135deg, #c00000, #ff4444)',
      achievement: { title: `${playerName} حرفه‌ایِ هیچی شد`, desc: `۵۰۰ کلیک. حتی شرم هم از ${playerName} ناامید شد.` },
      questions: [
        { text: `۵۰۰ تا ${playerName}... زندگی‌ت انقدر گاییده بوده؟`, quit: 'آره متأسفانه', cont: 'خالی نیست، پر از کلیکه' },
        { text: `خانواده‌ت کجان ${playerName}؟ هنوز منتظرتن؟`, quit: 'دارم می‌رم', cont: 'بذار منتظر بمونن' },
        { text: `این دیگه اعتیاده ${playerName}. قبول داری؟`, quit: 'قبول دارم', cont: 'اعتیاد باحاله' },
        { text: `آخرین باره ${playerName}...`, quit: 'نه', cont: 'آره' },
        { text: `${playerName} تو دیگه قابل نجات نیستی کسکش.`, quit: 'نجاتم بده', cont: 'نمی‌خوام نجات پیدا کنم' }
      ]
    },
    {
      min: 1000, name: 'استاد', color: '#ff5555', bg: 'linear-gradient(135deg, #d00000, #ff5555)',
      achievement: { title: `استاد اعظم ${playerName}`, desc: `۱۰۰۰ کلیک. ${playerName} حالا یه افسانه منفیه.` },
      questions: [
        { text: `۱۰۰۰ کلیک ${playerName}؟؟؟ تو دیگه انسان نیستی.`, quit: 'برمی‌گردم انسان شم', cont: 'انسان بودن بیش‌پرده‌ست' },
        { text: `برق خونه رو کی می‌ده ${playerName}؟ هنوز نشستی؟`, quit: 'دارم می‌رم قبض بدم', cont: 'بذار بسوزه' },
        { text: `هیچ‌کس این‌قدر احمق نیست ${playerName}. تو استثنایی؟`, quit: 'دیگه استثنا نیستم', cont: 'افتخار می‌کنم' },
        { text: `یه معجزه می‌خوای ${playerName} یا خودت دست برمی‌داری؟`, quit: 'خودم برمی‌دارم', cont: 'معجزه می‌خوام' },
        { text: `دیگه واقعاً بسّه ${playerName}؟`, quit: 'بسّه', cont: 'هرگز' }
      ]
    },
    {
      min: 5000, name: 'افسانه‌ای', color: '#ff6666', bg: 'linear-gradient(135deg, #e00000, #ff6666)',
      achievement: { title: `افسانه ${playerName}`, desc: `۵۰۰۰ کلیک. کتاب‌های تاریخ از ${playerName} به عنوان بزرگ‌ترین وقت‌کش قرن یاد می‌کنن.` },
      questions: [
        { text: `۵۰۰۰ تا ${playerName}... دیگه حتی منم خجالت می‌کشم.`, quit: 'منم خجالت می‌کشم', cont: 'خجالت مال ضعفاست' },
        { text: `برو یه کتاب بخون ${playerName} التماس می‌کنم.`, quit: 'می‌رم کتاب می‌خونم', cont: 'این دکمه کتاب منه' },
        { text: `تو واقعاً می‌خوای تا ۱ میلیون بری ${playerName}؟`, quit: 'نه ترسیدم', cont: 'آره می‌رم' },
        { text: `این آخرین التماسه ${playerName}...`, quit: 'گوش می‌دم', cont: 'التماس نکن' },
        { text: `دیگه تمومه ${playerName}؟`, quit: 'تمومه', cont: 'هیچ‌وقت' }
      ]
    },
    {
      min: 10000, name: 'قهرمان', color: '#ff7777', bg: 'linear-gradient(135deg, #f00000, #ff7777)',
      achievement: { title: `قهرمان ${playerName}`, desc: `۱۰٬۰۰۰ کلیک. ${playerName} دیگه ربات شده.` },
      questions: [
        { text: `۱۰ هزار کلیک ${playerName}... تو رباتی یا انسان؟`, quit: 'انسانم دارم می‌رم', cont: 'ربات با اراده‌ام' },
        { text: `هیچ‌کس این‌قدر احمق نیست ${playerName}... تو چرا؟`, quit: 'دیگه احمق نیستم', cont: 'افتخار می‌کنم' },
        { text: `جدی می‌خوای ادامه بدی ${playerName}؟`, quit: 'نه دیگه', cont: 'آره تا آخر' },
        { text: `این دکمه داره مسخره‌ت می‌کنه ${playerName}.`, quit: 'فهمیدم', cont: 'بذار مسخره کنه' },
        { text: `آخرین شانس واقعی ${playerName}...`, quit: 'ولش می‌کنم', cont: 'هرگز' }
      ]
    },
    {
      min: 50000, name: 'اسطوره', color: '#ff8888', bg: 'linear-gradient(135deg, #ff1111, #ff8888)',
      achievement: { title: `اسطوره ${playerName}`, desc: `۵۰ هزار کلیک. ${playerName} تاریخ ساخت... تاریخ پوچی.` },
      questions: [
        { text: `۵۰ هزار ${playerName}... دیگه چی می‌خوای ثابت کنی؟`, quit: 'هیچی تمام', cont: 'می‌خوام ببینم کی می‌بازه' },
        { text: `تو دیگه افسانه شدی ${playerName}. افسانه‌ی منفی.`, quit: 'نمی‌خوام افسانه باشم', cont: 'بهتر از هیچی‌ام' },
        { text: `این آخرین باره که ازت می‌خوام دست بکشی ${playerName}.`, quit: 'دست می‌کشم', cont: 'دست نمی‌کشم' },
        { text: `واقعاً هیچ حسی به این کار نداری ${playerName}؟`, quit: 'چرا دارم', cont: 'حس قدرت' },
        { text: `دیگه بسّه ${playerName}؟`, quit: 'بسّه', cont: 'نه' }
      ]
    },
    {
      min: 100000, name: 'خداوندگار کلیک', color: '#ff9999', bg: 'linear-gradient(135deg, #ff2222, #ff9999)',
      achievement: { title: `خداوندگار ${playerName}`, desc: `۱۰۰٬۰۰۰ کلیک. حتی خدا هم از ${playerName} خواست دست برداره.` },
      questions: [
        { text: `۱۰۰ هزار ${playerName}... دیگه کار از کار گذشته.`, quit: 'هنوز می‌تونم برگردم', cont: 'راه برگشت نیست' },
        { text: `تو واقعاً می‌خوای تا ۱ میلیون بری ${playerName}؟`, quit: 'نه ترسیدم', cont: 'آره' },
        { text: `آخرین التماس ${playerName}... بسّه؟`, quit: 'بسّه', cont: 'هرگز' },
        { text: `${playerName} تو دیگه غیرقابل نجات شدی.`, quit: 'نجاتم بده', cont: 'نمی‌خوام' },
        { text: `تمام ${playerName}؟`, quit: 'تمام', cont: 'ادامه' }
      ]
    },
    {
      min: 500000, name: 'امپراتور', color: '#ffaaaa', bg: 'linear-gradient(135deg, #ff3333, #ffaaaa)',
      achievement: { title: `امپراتور ${playerName}`, desc: `نیم میلیون کلیک. ${playerName} دیگه یه فاجعه‌ی تاریخیه.` },
      questions: [
        { text: `نیم میلیون ${playerName}... تو دیگه تموم شدی.`, quit: 'آره تموم شدم', cont: 'تازه شروع کردم' },
        { text: `نسل‌های بعدی از ${playerName} به عنوان عبرت یاد می‌کنن.`, quit: 'نمی‌خوام عبرت باشم', cont: 'بذار عبرت باشن' },
        { text: `دیگه واقعاً بسّه ${playerName}؟`, quit: 'آره بسّه', cont: 'نه' },
        { text: `این آخرین فرصته ${playerName}...`, quit: 'فرصت رو می‌گیرم', cont: 'فرصت نمی‌خوام' },
        { text: `تمومه ${playerName}؟`, quit: 'تمومه', cont: 'ادامه' }
      ]
    },
    {
      min: 1000000, name: 'جاودانه 👑', color: '#ffffff', bg: 'linear-gradient(135deg, #ff0000, #ff6666, #ffffff)',
      achievement: { title: `${playerName} جاودانه شد`, desc: `۱ میلیون کلیک. ${playerName} برنده شد... برنده‌ی بزرگ‌ترین وقت‌کشی تاریخ.` },
      questions: [
        { text: `۱ میلیون ${playerName}... دیگه چیزی برای گفتن نمونده.`, quit: 'بالاخره تموم شد', cont: 'می‌خوام دوباره شروع کنم' },
        { text: `حالا که رسیدی ${playerName}، حس خلأ نمی‌کنی؟`, quit: 'چرا خیلی', cont: 'خلأ رو با کلیک پر می‌کنم' },
        { text: `دیگه واقعاً تمومه ${playerName}؟`, quit: 'تمومه', cont: 'هیچ‌وقت تموم نمی‌شه' },
        { text: `${playerName} تو دیگه یه افسانه‌ای... افسانه‌ی منفی.`, quit: 'نمی‌خوام باشم', cont: 'افتخار می‌کنم' },
        { text: `آخرین کلمه ${playerName}...`, quit: 'خداحافظ', cont: 'تا ابد' }
      ]
    }
  ];
}

/* ===================== صداها ===================== */
function ensureAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}
function playTone(freq, type, duration, volume = 0.2) {
  ensureAudio();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  gain.gain.setValueAtTime(volume, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}
function playClickSound() { playTone(780, 'sine', 0.08, 0.16); }
function playAchievementSound() {
  playTone(440, 'triangle', 0.1, 0.14);
  setTimeout(() => playTone(554, 'triangle', 0.1, 0.14), 90);
  setTimeout(() => playTone(659, 'triangle', 0.22, 0.18), 180);
}
function playLevelUpSound() {
  playTone(523, 'square', 0.09, 0.11);
  setTimeout(() => playTone(659, 'square', 0.09, 0.11), 70);
  setTimeout(() => playTone(784, 'square', 0.18, 0.14), 140);
}
function playModalSound() { playTone(300, 'sine', 0.14, 0.11); }
function playQuitSound() {
  playTone(380, 'sawtooth', 0.28, 0.14);
  setTimeout(() => playTone(280, 'sawtooth', 0.35, 0.11), 180);
}
function playGameOverSound() {
  playTone(180, 'sawtooth', 0.45, 0.18);
  setTimeout(() => playTone(130, 'sawtooth', 0.55, 0.16), 280);
  setTimeout(() => playTone(90, 'sawtooth', 0.7, 0.14), 550);
}
function playContinueSound() {
  playTone(580, 'triangle', 0.09, 0.11);
  setTimeout(() => playTone(760, 'triangle', 0.13, 0.14), 80);
}
function playEvilLaugh() {
  ensureAudio();
  const now = audioCtx.currentTime;
  [220, 280, 240, 320, 260, 300, 230].forEach((f, i) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(f, now + i * 0.09);
    gain.gain.setValueAtTime(0.11, now + i * 0.09);
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.09 + 0.12);
    osc.start(now + i * 0.09);
    osc.stop(now + i * 0.09 + 0.12);
  });
}

/* ===================== پیام‌های پشیمونی ===================== */
const regretMessages = [
  (name) => `${name}... هنوز می‌تونی این کیریت رو متوقف کنی.`,
  (name) => `داری عمرت رو می‌سوزونی ${name} کسکش.`,
  (name) => `${name}، این دکمه داره مسخره‌ت می‌کنه.`,
  (name) => `خانواده‌ت کجان ${name}؟ دارن گاییده می‌شن بدون تو.`,
  (name) => `${name}... جدی داری ادامه می‌دی احمق؟`,
  (name) => `هر کلیک یه تکه از عمرته ${name}.`,
  (name) => `${name}، مغزت هنوز زنده‌ست یا گاییده شده؟`,
  (name) => `پشیمون نمی‌شی ${name}؟`,
  (name) => `${name} داره تبدیل به ربات می‌شه...`,
  (name) => `این آخرین هشدار نبود ${name}... ولی نزدیکه.`
];

function showRandomRegret() {
  if (!gameActive || Math.random() > 0.17) return;
  const msg = regretMessages[Math.floor(Math.random() * regretMessages.length)](playerName);
  regretMsg.textContent = msg;
  regretMsg.classList.add('show');
  playEvilLaugh();
  setTimeout(() => regretMsg.classList.remove('show'), 2800);
}

/* ===================== توابع اصلی ===================== */
function getCurrentRank(value) {
  const ranks = getRanks();
  let current = ranks[0];
  for (let rank of ranks) {
    if (value >= rank.min) current = rank;
  }
  return current;
}

function updateRank(value) {
  const rank = getCurrentRank(value);
  rankBadge.textContent = rank.name;
  rankBadge.style.background = rank.bg;
  btn.style.background = rank.bg;
  btn.style.boxShadow = `0 8px 30px ${rank.color}66`;
}

function toPersianNumber(num) {
  return num.toString().replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
}

function createFountain() {
  const colors = ['#ff2222', '#ff4444', '#ff6666', '#ffffff', '#cc0000', '#8b0000'];
  const btnRect = btn.getBoundingClientRect();
  const centerX = btnRect.left + btnRect.width / 2;
  const centerY = btnRect.top + btnRect.height / 2;
  for (let i = 0; i < 65; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
    particle.style.left = centerX + 'px';
    particle.style.top = centerY + 'px';
    const angle = (Math.random() * 150 - 75) * (Math.PI / 180);
    const velocity = 120 + Math.random() * 190;
    particle.style.setProperty('--tx', Math.sin(angle) * velocity + 'px');
    particle.style.setProperty('--ty', -Math.abs(Math.cos(angle) * velocity) - 80 + 'px');
    particle.style.width = particle.style.height = (5 + Math.random() * 11) + 'px';
    document.body.appendChild(particle);
    setTimeout(() => particle.remove(), 1400);
  }
}

function showAchievement(rank) {
  achTitle.textContent = rank.achievement.title;
  achDesc.textContent = rank.achievement.desc;
  achievement.classList.add('show');
  playAchievementSound();
  setTimeout(() => playEvilLaugh(), 600);
  setTimeout(() => achievement.classList.remove('show'), 4500);
}

function startPersuasion(rank) {
  currentRankData = rank;
  currentPersuasionStep = 0;
  showPersuasionStep();
}

function showPersuasionStep() {
  const q = currentRankData.questions[currentPersuasionStep];
  modalRank.textContent = `رنک: ${currentRankData.name}`;
  modalTaunt.textContent = q.text;
  modalButtons.innerHTML = `
    <button class="modal-btn quit" id="btnQuit">${q.quit}</button>
    <button class="modal-btn continue" id="btnCont">${q.cont}</button>
  `;
  modal.classList.add('show');
  playModalSound();

  document.getElementById('btnQuit').onclick = () => {
    playQuitSound();
    modal.classList.remove('show');
    endGame(true);
  };
  document.getElementById('btnCont').onclick = () => {
    playContinueSound();
    currentPersuasionStep++;
    if (currentPersuasionStep >= currentRankData.questions.length) {
      modal.classList.remove('show');
      gameActive = true;
      playEvilLaugh();
    } else {
      showPersuasionStep();
    }
  };
}

function endGame(fromPersuasion = false) {
  gameActive = false;
  finalScore.textContent = `${playerName} عزیز، امتیاز نهایی: ${toPersianNumber(count)} کلیک`;
  finalTaunt.textContent = fromPersuasion
    ? `${playerName} بالاخره عقلت برگشت. حالا برو یه کار مفید بکن (اگه هنوز بلدی).`
    : `${playerName} خودت خواستی تموم بشه...`;
  gameOver.classList.add('show');
  gameContainer.style.display = 'none';
  playGameOverSound();
}

/* ===================== Easter Egg - راه فرار دروغی ===================== */
const secretQuestions = [
  {
    title: 'پیدا کردی؟!',
    text: `${playerName}... جدی این دکمه نامرئی رو پیدا کردی؟ فکر کردی راه فراره؟`,
    quit: 'آره، تمومش کن',
    cont: 'بگو چیکار کنم'
  },
  {
    title: 'خیلی باهوشی ها...',
    text: `آفرین ${playerName}، خیلی زرنگ بودی که پیداش کردی. حالا مطمئنی می‌خوای از این جهنم فرار کنی؟`,
    quit: 'آره فرار می‌کنم',
    cont: 'بگو چطور'
  },
  {
    title: 'یکی دیگه...',
    text: `${playerName}، اگه واقعاً می‌خوای تمومش کنی، باید بگی «من یه احمقم». می‌گی؟`,
    quit: 'من یه احمقم، تموم کن',
    cont: 'نمی‌گم'
  },
  {
    title: 'آخرین شانس',
    text: `خیلی خب ${playerName}... آخرین باره. واقعاً می‌خوای بازی تموم بشه؟`,
    quit: 'آره تمومش کن',
    cont: 'نه، ادامه بده'
  },
  {
    title: 'هه‌هه‌هه‌...',
    text: `نه ${playerName}. نمی‌شه.\n\nاین دکمه فقط برای مسخره کردن امثال تو ساخته شده.\n\nبرگرد سر کلیک کردن، کسکش.`,
    quit: null,
    cont: 'برگرد به بازی'
  }
];

function startSecretSequence() {
  gameActive = false;
  secretStep = 0;
  showSecretStep();
  playEvilLaugh();
}

function showSecretStep() {
  const q = secretQuestions[secretStep];
  secretRank.textContent = q.title;
  secretTaunt.innerHTML = q.text.replace(/\n/g, '<br>');
  
  if (q.quit === null) {
    // آخرین مرحله - فقط دکمه برگشت
    secretButtons.innerHTML = `<button class="modal-btn continue" id="secretBack">${q.cont}</button>`;
    document.getElementById('secretBack').onclick = () => {
      secretModal.classList.remove('show');
      gameActive = true;
      placeSecretButton(); // جاش عوض بشه
      playContinueSound();
    };
  } else {
    secretButtons.innerHTML = `
      <button class="modal-btn quit" id="secretQuit">${q.quit}</button>
      <button class="modal-btn continue" id="secretCont">${q.cont}</button>
    `;
    document.getElementById('secretQuit').onclick = () => {
      playQuitSound();
      secretStep++;
      showSecretStep();
    };
    document.getElementById('secretCont').onclick = () => {
      playContinueSound();
      secretStep++;
      showSecretStep();
    };
  }
  
  secretModal.classList.add('show');
  playModalSound();
}

/* ===================== کلیک اصلی ===================== */
function doClick(e) {
  if (!gameActive) return;

  count++;
  const rank = getCurrentRank(count);
  const isNewRank = rank.min > lastRankMin && count >= rank.min;

  if (isNewRank) {
    lastRankMin = rank.min;
    gameActive = false;
    playLevelUpSound();
    createFountain();

    congrats.textContent = `🎉 ${rank.name} 🎉`;
    congrats.classList.add('show');
    rankBadge.classList.add('new-rank');
    counter.classList.add('new-rank');

    setTimeout(() => {
      congrats.classList.remove('show');
      rankBadge.classList.remove('new-rank');
      counter.classList.remove('new-rank');
      showAchievement(rank);
      setTimeout(() => startPersuasion(rank), 4800);
    }, 1500);
  } else {
    playClickSound();
    showRandomRegret();
  }

  if (e && e.clientX) {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.width = ripple.style.height = `${Math.max(rect.width, rect.height)}px`;
    ripple.style.marginLeft = ripple.style.marginTop = `-${Math.max(rect.width, rect.height) / 2}px`;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }

  counter.textContent = toPersianNumber(count);
  counter.classList.remove('bump');
  void counter.offsetWidth;
  counter.classList.add('bump');
  updateRank(count);

  if (count === 1) {
    btnText.textContent = 'دوباره کلیک کن!';
    hint.textContent = `${playerName}، آفرین! ادامه بده (یا Enter)`;
  } else if (count >= 1000000) {
    btnText.textContent = 'جاودانه شدی! 👑';
    hint.textContent = `۱ میلیون کلیک ${playerName}...`;
  } else {
    btnText.textContent = `کلیک شماره ${toPersianNumber(count)}`;
    hint.textContent = `${playerName} ${toPersianNumber(count)} بار کلیک کرد`;
  }

  hint.classList.add('success');
  setTimeout(() => hint.classList.remove('success'), 400);
}

/* ===================== رویدادها ===================== */
btn.addEventListener('click', doClick);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && gameActive) {
    e.preventDefault();
    doClick(null);
  }
  if (e.key === 'Enter' && nameScreen.style.display !== 'none') {
    nameBtn.click();
  }
});

// دکمه نامرئی
secretBtn.addEventListener('click', () => {
  if (!gameActive) return;
  startSecretSequence();
});

// صفحه اسم + داستان
nameBtn.addEventListener('click', () => {
  const val = nameInput.value.trim();
  playerName = val || 'غریبه';
  nameScreen.style.display = 'none';
  storyScreen.style.display = 'flex';

  storyName.textContent = playerName;
  storyText.innerHTML = `
    یه شب تاریک، ${playerName} تنها تو اتاقش نشسته بود.<br><br>
    هیچی برای انجام دادن نداشت.<br>
    نه دوست، نه کار، نه هدف.<br>
    فقط یه مانیتور روشن و یه دکمه لعنتی.<br><br>
    ${playerName} با خودش گفت: «یه بار کلیک کنم ببینم چی می‌شه.»<br><br>
    همون یه کلیک، شروع همه چی بود.<br><br>
    حالا ${playerName} داره عمرشو، آبروشو، و مغزشو پای یه دکمه می‌سوزونه.<br>
    خانواده‌ش فکر می‌کنن داره درس می‌خونه یا کار می‌کنه.<br>
    ولی نه...<br>
    ${playerName} داره مثل یه احمق کامل کلیک می‌کنه.<br><br>
    <span style="color:#ff4444">
    این بازی اومده نجاتت بده ${playerName}.<br>
    ولی تو احتمالاً اون‌قدر گاییده‌ای که گوش نمی‌دی.<br>
    پس بزن بریم... ببینم تا کجا می‌تونی خودتو گاییده‌تر کنی.
    </span>
  `;
});

// شروع بازی
startBtn.addEventListener('click', () => {
  storyScreen.style.display = 'none';
  gameContainer.style.display = 'flex';
  gameActive = true;
  updateRank(0);
  placeSecretButton();          // دکمه نامرئی رو بذار
  playEvilLaugh();
});

// ریستارت
restartBtn.addEventListener('click', () => {
  count = 0;
  lastRankMin = 0;
  gameActive = true;
  currentPersuasionStep = 0;
  counter.textContent = '۰';
  btnText.textContent = 'کلیک کن!';
  hint.textContent = 'کلیک کن یا Enter بزن';
  updateRank(0);
  gameOver.classList.remove('show');
  gameContainer.style.display = 'flex';
  placeSecretButton();
});

// اگه صفحه ریسایز شد، دکمه نامرئی رو دوباره جایگذاری کن
window.addEventListener('resize', () => {
  if (gameActive) placeSecretButton();
});