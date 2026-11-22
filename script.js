// --- SCREEN NAVIGATION ---
const screens = document.querySelectorAll(".screen");
const menuCards = document.querySelectorAll(".menu-card");
const backHomeBtn = document.getElementById("backHomeBtn");
const appBrand = document.getElementById("appBrand");

function openScreen(screenId) {
  screens.forEach((s) => s.classList.remove("active"));
  document.getElementById(screenId).classList.add("active");

  if (screenId === "homeScreen") {
    backHomeBtn.classList.add("hidden");
    appBrand.classList.remove("hidden");
  } else {
    backHomeBtn.classList.remove("hidden");
    appBrand.classList.add("hidden");
  }
}

menuCards.forEach((btn) => {
  btn.addEventListener("click", () => openScreen(btn.dataset.target));
});

backHomeBtn.addEventListener("click", () => openScreen("homeScreen"));

// --- AI TEST PAPER GENERATOR ---
const questionBanks = {
  Science: {
    mcqs: [
      { q: "Which gas is released when dilute HCl reacts with Zinc granules? (A) O₂ (B) H₂ (C) CO₂ (D) Cl₂", a: "(B) H₂ (Hydrogen gas)" },
      { q: "The SI unit of electric power is: (A) Volt (B) Ampere (C) Watt (D) Ohm", a: "(C) Watt" },
      { q: "Which hydrocarbon contains a triple covalent bond? (A) Ethane (B) Ethene (C) Ethyne (D) Methane", a: "(C) Ethyne" },
      { q: "The image formed by a convex lens when object is at 2F₁ is: (A) Real & same size (B) Virtual & enlarged (C) Diminished (D) At infinity", a: "(A) Real, inverted and of the same size" }
    ],
    short: [
      { q: "State Fleming's Left-Hand Rule and mention one application.", a: "Stretch thumb, forefinger, and middle finger mutually perpendicular: Forefinger = Magnetic field, Middle = Current, Thumb = Force/Motion. Used in Electric Motors." },
      { q: "Distinguish between Metals and Non-metals based on chemical properties (any 2 points).", a: "Metals form basic oxides and lose electrons easily; Non-metals form acidic oxides and gain electrons." },
      { q: "Why do stars twinkle while planets do not?", a: "Stars are point sources of light far away; atmospheric refraction continuously changes their apparent position. Planets are much closer and act as extended sources." }
    ],
    long: [
      { q: "Explain the electrolytic reduction of Alumina with a neat labelled diagram.", a: "Molten Al₂O₃ mixed with cryolite reduces melting point. At cathode: Al³⁺ + 3e⁻ → Al; At anode: 2O²⁻ → O₂ + 4e⁻." },
      { q: "Explain human male/female reproductive system and state the function of any two organs.", a: "Testes produce sperm & testosterone; Ovaries produce ova & estrogen/progesterone." }
    ]
  },
  Maths: {
    mcqs: [
      { q: "If roots of x² - kx + 9 = 0 are real and equal, find k: (A) ±3 (B) ±6 (C) 9 (D) ±9", a: "(B) ±6 (Since b² - 4ac = 0 ⇒ k² - 36 = 0)" },
      { q: "In an AP, if a = 5 and d = 3, what is t₁₀? (A) 32 (B) 35 (C) 30 (D) 29", a: "(A) 32 (t₁₀ = 5 + 9×3)" },
      { q: "Value of sin²θ + cos²θ is always: (A) 0 (B) -1 (C) 1 (D) 2", a: "(C) 1" }
    ],
    short: [
      { q: "Solve using Cramer's Rule: 3x - 4y = 10; 4x + 3y = 5.", a: "D = 25, Dx = 50, Dy = -25 ⇒ x = 2, y = -1." },
      { q: "Two coins are tossed simultaneously. Find the probability of getting at least one head.", a: "S = {HH, HT, TH, TT}, n(S) = 4. Event A = {HH, HT, TH}, P(A) = 3/4." }
    ],
    long: [
      { q: "Prove Basic Proportionality Theorem (BPT): A line parallel to one side of a triangle divides the other two sides in the same ratio.", a: "Standard SSC Geometry Theorem proof using equal height triangles." }
    ]
  },
  Social: {
    mcqs: [
      { q: "The first English newspaper in India was started by: (A) Balshastri Jambhekar (B) James Augustus Hickey (C) Lokmanya Tilak (D) Dadabhai Naoroji", a: "(B) James Augustus Hickey (Bengal Gazette)" },
      { q: "Which type of tourism is promoted in Maharashtra for biodiversity and wildlife? (A) Agro-tourism (B) Eco-tourism (C) Sports tourism (D) Health tourism", a: "(B) Eco-tourism" }
    ],
    short: [
      { q: "Write a short note on 'Applied History' (Public History).", a: "Applied history deals with the study of the past to solve present social problems and preserve cultural heritage." },
      { q: "Compare the physiography of Brazil and India (any 2 points).", a: "India has the towering Himalayas in the north; Brazil has no high fold mountains and is dominated by the Brazilian Highlands and Amazon Basin." }
    ],
    long: [
      { q: "Explain the role of newspapers in the Indian freedom struggle.", a: "Newspapers like Kesari, Maratha, and Darpan created social awareness, criticized British policies, and united citizens." }
    ]
  }
};
let lastGeneratedText = "";

function pickRandom(arr, count) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

const printBtn = document.getElementById("printPaperBtn");
const copyPaperBtn = document.createElement("button");
copyPaperBtn.id = "copyPaperBtn";
copyPaperBtn.className = "secondary-btn";
copyPaperBtn.textContent = "📋 Copy Whole";
if (printBtn && printBtn.parentElement) {
  printBtn.parentElement.style.display = "flex";
  printBtn.parentElement.style.gap = "6px";
  printBtn.parentElement.insertBefore(copyPaperBtn, printBtn);
}

copyPaperBtn.addEventListener("click", async () => {
  if (!lastGeneratedText) return;
  try {
    await navigator.clipboard.writeText(lastGeneratedText);
    const oldText = copyPaperBtn.textContent;
    copyPaperBtn.textContent = "✅ Copied!";
    setTimeout(() => (copyPaperBtn.textContent = oldText), 2000);
  } catch (err) {
    alert("Could not copy automatically. Please select and copy the text.");
  }
});

document.getElementById("generatePaperBtn").addEventListener("click", () => {
  const subject = document.getElementById("paperSubject").value;
  const topic = document.getElementById("paperTopic").value.trim() || "Full Syllabus Mix";
  const difficulty = document.getElementById("paperDifficulty").value;

  const bank = questionBanks[subject];
  const mcqs = pickRandom(bank.mcqs, 2);
  const shorts = pickRandom(bank.short, 2);
  const longs = pickRandom(bank.long, 1);

  document.getElementById("paperTitle").textContent = `${subject} — ${topic}`;
  document.getElementById("paperMeta").textContent = `Difficulty: ${difficulty} | Total Marks: 15 | Time: 30 Mins`;

  const paperBody = document.getElementById("paperContent");
  paperBody.innerHTML = `
    <div class="paper-section">
      <h5>Q.1 Choose the correct alternative (2 Marks)</h5>
      <ol>${mcqs.map((item) => `<li>${item.q}</li>`).join("")}</ol>
    </div>
    <div class="paper-section">
      <h5>Q.2 Answer the following in brief (6 Marks)</h5>
      <ol>${shorts.map((item) => `<li>${item.q}</li>`).join("")}</ol>
    </div>
    <div class="paper-section">
      <h5>Q.3 Solve / Explain in detail (7 Marks)</h5>
      <ol>${longs.map((item) => `<li>${item.q}</li>`).join("")}</ol>
    </div>
  `;

  const answerBox = document.getElementById("answerKeyBox");
  answerBox.classList.add("hidden");
  document.getElementById("toggleAnswersBtn").textContent = "👁 Show Answer Key";
  answerBox.innerHTML = `
    <strong>✅ Answer Key:</strong><br/><br/>
    <strong>Q.1:</strong> ${mcqs.map((m, i) => `(${i + 1}) ${m.a}`).join(" | ")}<br/><br/>
    <strong>Q.2:</strong> ${shorts.map((s, i) => `(${i + 1}) ${s.a}`).join("<br/>")}<br/><br/>
    <strong>Q.3:</strong> ${longs.map((l, i) => `(${i + 1}) ${l.a}`).join("<br/>")}
  `;

  lastGeneratedText = [
    `STUDYPRO 10X — PRACTICE TEST PAPER`,
    `Subject: ${subject} | Topic: ${topic}`,
    `Difficulty: ${difficulty} | Marks: 15 | Time: 30 Mins`,
    `----------------------------------------`,
    `Q.1 Choose the correct alternative (2 Marks)`,
    ...mcqs.map((m, i) => `${i + 1}. ${m.q}`),
    ``,
    `Q.2 Answer the following in brief (6 Marks)`,
    ...shorts.map((s, i) => `${i + 1}. ${s.q}`),
    ``,
    `Q.3 Solve / Explain in detail (7 Marks)`,
    ...longs.map((l, i) => `${i + 1}. ${l.q}`),
    ``,
    `----------------------------------------`,
    `ANSWER KEY:`,
    `Q.1: ${mcqs.map((m, i) => `(${i + 1}) ${m.a}`).join(" | ")}`,
    `Q.2: ${shorts.map((s, i) => `(${i + 1}) ${s.a}`).join(" | ")}`,
    `Q.3: ${longs.map((l, i) => `(${i + 1}) ${l.a}`).join(" | ")}`
  ].join("\n");

  document.getElementById("paperOutputCard").classList.remove("hidden");
});

document.getElementById("toggleAnswersBtn").addEventListener("click", () => {
  const box = document.getElementById("answerKeyBox");
  const btn = document.getElementById("toggleAnswersBtn");
  box.classList.toggle("hidden");
  btn.textContent = box.classList.contains("hidden") ? "👁 Show Answer Key" : "🙈 Hide Answer Key";
});

document.getElementById("printPaperBtn").addEventListener("click", () => {
  window.print();
});
// --- POMODORO TIMER ---
let totalSeconds = 25 * 60;
let timerInterval = null;
let sessions = parseInt(localStorage.getItem("studySessions") || "0");

const timerDisplay = document.getElementById("timerDisplay");
const startTimerBtn = document.getElementById("startTimerBtn");
const resetTimerBtn = document.getElementById("resetTimerBtn");
const sessionCount = document.getElementById("sessionCount");
const presetChips = document.querySelectorAll(".preset-row .chip");

sessionCount.textContent = sessions;

function updateTimerUI() {
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const s = (totalSeconds % 60).toString().padStart(2, "0");
  timerDisplay.textContent = `${m}:${s}`;
}

startTimerBtn.addEventListener("click", () => {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
    startTimerBtn.textContent = "▶ Start";
  } else {
    startTimerBtn.textContent = "⏸ Pause";
    timerInterval = setInterval(() => {
      if (totalSeconds > 0) {
        totalSeconds--;
        updateTimerUI();
      } else {
        clearInterval(timerInterval);
        timerInterval = null;
        startTimerBtn.textContent = "▶ Start";
        sessions++;
        localStorage.setItem("studySessions", sessions);
        sessionCount.textContent = sessions;
        alert("Great job! Session complete.");
      }
    }, 1000);
  }
});

resetTimerBtn.addEventListener("click", () => {
  clearInterval(timerInterval);
  timerInterval = null;
  startTimerBtn.textContent = "▶ Start";
  const activeMins = document.querySelector(".preset-row .chip.active").dataset.mins;
  totalSeconds = parseInt(activeMins) * 60;
  updateTimerUI();
});

presetChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    presetChips.forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");
    clearInterval(timerInterval);
    timerInterval = null;
    startTimerBtn.textContent = "▶ Start";
    totalSeconds = parseInt(chip.dataset.mins) * 60;
    document.getElementById("timerMode").textContent =
      chip.dataset.mins === "5" ? "Break Time" : "Study Session";
    updateTimerUI();
  });
});

// --- FLASHCARDS ---
const defaultCards = [
  { subject: "Science - Chemistry", q: "General formula of Alkanes?", a: "CₙH₂ₙ₊₂ (Single covalent bonds)" },
  { subject: "Science - Physics", q: "Formula for Refractive Index (n)?", a: "n = sin(i) / sin(r)  OR  c / v" },
  { subject: "Maths - Algebra", q: "Quadratic Formula for ax² + bx + c = 0?", a: "x = [-b ± √(b² - 4ac)] / 2a" },
  { subject: "Maths - Geometry", q: "Distance Formula between (x₁, y₁) and (x₂, y₂)?", a: "√[(x₂ - x₁)² + (y₂ - y₁)²]" },
  { subject: "Science - Chemistry", q: "What is Aqua Regia?", a: "Fresh mixture of Conc. HCl and Conc. HNO₃ in 3:1 ratio" }
];

let cards = JSON.parse(localStorage.getItem("studyCards")) || defaultCards;
let currentIdx = 0;

const flashcard = document.getElementById("flashcard");
const cardSubject = document.getElementById("cardSubject");
const cardQuestion = document.getElementById("cardQuestion");
const cardAnswer = document.getElementById("cardAnswer");
const cardCounter = document.getElementById("cardCounter");

function renderCard() {
  flashcard.classList.remove("flipped");
  const c = cards[currentIdx];
  cardSubject.textContent = c.subject;
  cardQuestion.textContent = c.q;
  cardAnswer.textContent = c.a;
  cardCounter.textContent = `${currentIdx + 1} / ${cards.length}`;
}

flashcard.addEventListener("click", () => flashcard.classList.toggle("flipped"));
document.getElementById("nextCardBtn").addEventListener("click", () => {
  currentIdx = (currentIdx + 1) % cards.length;
  renderCard();
});
document.getElementById("prevCardBtn").addEventListener("click", () => {
  currentIdx = (currentIdx - 1 + cards.length) % cards.length;
  renderCard();
});

document.getElementById("addCardBtn").addEventListener("click", () => {
  const subject = document.getElementById("newSubject").value.trim() || "General";
  const q = document.getElementById("newQuestion").value.trim();
  const a = document.getElementById("newAnswer").value.trim();
  if (!q || !a) return alert("Please enter both a question and an answer.");

  cards.push({ subject, q, a });
  localStorage.setItem("studyCards", JSON.stringify(cards));
  currentIdx = cards.length - 1;
  renderCard();
  document.getElementById("newSubject").value = "";
  document.getElementById("newQuestion").value = "";
  document.getElementById("newAnswer").value = "";
});

renderCard();

// --- SSC BEST-OF-5 CALCULATOR ---
document.getElementById("calcPercentBtn").addEventListener("click", () => {
  const inputs = document.querySelectorAll(".mark-input");
  const marks = Array.from(inputs)
    .map((inp) => parseFloat(inp.value))
    .filter((n) => !isNaN(n) && n >= 0 && n <= 100);

  if (marks.length < 5) return alert("Please enter marks for at least 5 subjects.");

  marks.sort((a, b) => b - a);
  const top5 = marks.slice(0, 5);
  const sum = top5.reduce((acc, val) => acc + val, 0);
  const percentage = (sum / 500) * 100;

  const resBox = document.getElementById("percentResult");
  resBox.classList.remove("hidden");
  resBox.innerHTML = `Best-of-5 Total: ${sum} / 500 <br/> Predicted Percentage: <span style="color:#4f8cff; font-size:1.3rem;">${percentage.toFixed(2)}%</span>`;
});

// --- STUDY TASKS ---
let todos = JSON.parse(localStorage.getItem("studyTodos")) || [];
const todoList = document.getElementById("todoList");

function renderTodos() {
  todoList.innerHTML = "";
  todos.forEach((item, index) => {
    const li = document.createElement("li");
    if (item.done) li.classList.add("done");
    li.innerHTML = `
      <span onclick="toggleTodo(${index})">${item.text}</span>
      <button onclick="deleteTodo(${index})" style="background:none;border:none;color:#ff5c77;cursor:pointer;">✕</button>
    `;
    todoList.appendChild(li);
  });
}

window.toggleTodo = (i) => {
  todos[i].done = !todos[i].done;
  localStorage.setItem("studyTodos", JSON.stringify(todos));
  renderTodos();
};

window.deleteTodo = (i) => {
  todos.splice(i, 1);
  localStorage.setItem("studyTodos", JSON.stringify(todos));
  renderTodos();
};

document.getElementById("addTodoBtn").addEventListener("click", () => {
  const inp = document.getElementById("todoInput");
  if (!inp.value.trim()) return;
  todos.push({ text: inp.value.trim(), done: false });
  localStorage.setItem("studyTodos", JSON.stringify(todos));
  inp.value = "";
  renderTodos();
});

renderTodos();

// --- SHARE BUTTON ---
document.getElementById("shareAppBtn").addEventListener("click", () => {
  const msg = encodeURIComponent(
    "Hey! Check out StudyPro 10X — an AI Test Paper Maker, focus timer, and SSC Best-of-5 calculator app I built!"
  );
  window.open(`https://wa.me{msg}`, "_blank");
});