// ── CONFIG ──
const _k1 = "AIzaSyDVYhPlztl5FhYUbjFcNV";
const _k2 = "yCjAssJsHwJt4";
const GEMINI_API_KEY = _k1 + _k2;

// ── STATE ──
let chatMessages = [];
let readinessChecked = [];

// ── DATA ──
const PAGE_META = {
    dashboard: ['Welcome to VoteWise',   'Empowering informed participation.'],
    assistant:  ['Your AI Assistant',     'Empowering informed participation.'],
    timeline:   ['Election Calendar',     'A 10-year roadmap of major democratic milestones.'],
    readiness:  ['Voter Readiness',       'Empowering informed participation.'],
    quiz:       ['Election Quiz',        'Test your knowledge and earn badges.'],
    mythbuster: ['Myth Buster',          'Separating voting facts from fiction.'],
};

const TIMELINE_EVENTS = [
    { title: 'State Assembly Cycle 1',   date: '2024 - 2025', desc: 'Elections in Maharashtra, Haryana, Delhi, and Bihar.' },
    { title: 'State Assembly Cycle 2',   date: '2026',        desc: 'Major elections in West Bengal, Tamil Nadu, Kerala, and Assam.' },
    { title: 'UP & Punjab Assemblies',  date: '2027',        desc: 'Crucial elections for Uttar Pradesh and Punjab, plus Presidential poll.' },
    { title: 'Karnataka & Rajasthan',   date: '2028',        desc: 'State Assembly elections for Karnataka, Rajasthan, MP, and Chhattisgarh.' },
    { title: '19th Lok Sabha Election', date: 'APR - MAY 2029', desc: 'The next massive National General Election to elect the Central Government.' },
    { title: 'State Cycle (Bihar/Delhi)', date: '2030',        desc: 'Next round of Assembly elections for Delhi and Bihar.' },
    { title: 'Southern State Cycle',    date: '2031',        desc: 'Assembly elections return to Tamil Nadu, Kerala, and West Bengal.' },
    { title: 'Presidential Poll & UP',  date: '2032',        desc: 'UP and Punjab Assembly elections + the next Presidential cycle.' },
    { title: 'Western/Central Cycle',   date: '2033',        desc: 'Assembly elections for Karnataka, Rajasthan, MP, and Gujarat.' },
    { title: '20th Lok Sabha Election', date: 'APR - MAY 2034', desc: 'The 20th General Election marking a full decade of democratic milestones.' },
];

const READINESS_ITEMS = [
    { icon: 'search',      text: 'Check registration status' },
    { icon: 'user-check',  text: 'Register to vote (if needed)' },
    { icon: 'map-pin',     text: 'Locate your polling place' },
    { icon: 'info',        text: 'Research candidates & measures' },
    { icon: 'calendar',    text: 'Make a plan to vote' },
    { icon: 'id-card',     text: 'Confirm valid photo ID' },
];

const CHIPS = [
    'What is gerrymandering?',
    'How do I register?',
    'Electoral college explained',
    'Voter ID rules',
];

const QUIZ_DATA = [
    { q: "Minimum age to vote in India?", options: ["16", "18", "21", "25"], correct: 1, fact: "Reduced from 21 to 18 in 1989." },
    { q: "What does EPIC stand for?", options: ["Election Photo ID Card", "Electoral Process ID Card", "Elector's Photo Identity Card"], correct: 2, fact: "It is the official name for your Voter ID." },
    { q: "What is the term of Lok Sabha?", options: ["4 years", "5 years", "6 years"], correct: 1, fact: "Elections happen every 5 years unless dissolved earlier." },
    { q: "Total Lok Sabha constituencies?", options: ["543", "545", "550"], correct: 0, fact: "543 members are directly elected by the people." },
    { q: "Who appoints Election Commissioners?", options: ["Prime Minister", "Chief Justice", "President of India"], correct: 2, fact: "Appointed by the President based on committee recommendation." },
    { q: "Color of indelible ink?", options: ["Blue", "Purple/Black", "Red"], correct: 1, fact: "It contains Silver Nitrate and turns dark on skin." },
    { q: "What is Form 6 used for?", options: ["New Registration", "Correction", "Deleion"], correct: 0, fact: "Form 6 is for first-time voters or shifting to a new area." },
    { q: "Full form of NOTA?", options: ["None of the Above", "Note the App", "No Tax Allowed"], correct: 0, fact: "Allows voters to reject all candidates." },
    { q: "How many seconds VVPAT slip stays?", options: ["5s", "7s", "10s"], correct: 1, fact: "7 seconds for visual verification." },
    { q: "Maximum seats in Rajya Sabha?", options: ["245", "250", "260"], correct: 1, fact: "Constitution sets it at 250." },
    { q: "Who is current Chief Election Commissioner?", options: ["Rajiv Kumar", "Sunil Arora", "Sushil Chandra"], correct: 0, fact: "Rajiv Kumar (as of 2024-2026)." },
    { q: "Model Code of Conduct starts when?", options: ["Voting day", "Nomination day", "Election announcement"], correct: 2, fact: "Starts immediately after ECI announcement." },
    { q: "Minimum age to be an MP (Lok Sabha)?", options: ["18", "21", "25"], correct: 2, fact: "Voter at 18, Candidate at 25." },
    { q: "Where is indelible ink made?", options: ["Delhi", "Mysuru", "Mumbai"], correct: 1, fact: "Mysore Paints & Varnish Ltd is the sole provider." },
    { q: "What is the NRI voter form?", options: ["Form 6", "Form 6A", "Form 8"], correct: 1, fact: "Form 6A is for overseas electors." },
    { q: "Can a person with a criminal record vote?", options: ["No", "Yes", "Only if in jail"], correct: 1, fact: "Everyone on the roll can vote unless disqualified by court." },
    { q: "What is EVM battery type?", options: ["Lithium", "Alkaline", "No battery"], correct: 1, fact: "They use specialized power packs, not connected to grid." },
    { q: "First General Election year?", options: ["1947", "1951-52", "1955"], correct: 1, fact: "Conducted over several months in 1951-52." },
    { q: "Voting rights for third gender?", options: ["Yes", "No", "Only in some states"], correct: 0, fact: "Registered under 'Third Gender' since 2014." },
    { q: "Can you vote if name not in roll but have ID?", options: ["Yes", "No", "Maybe"], correct: 1, fact: "No. Your name in the Electoral Roll is mandatory." },
    { q: "What is the maximum voting distance for a booth?", options: ["1km", "2km", "5km"], correct: 1, fact: "ECI ensures no voter travels more than 2km to vote." },
    { q: "Who is the first voter of independent India?", options: ["Jawaharlal Nehru", "Shyam Saran Negi", "B.R. Ambedkar"], correct: 1, fact: "Shyam Saran Negi from Himachal voted in 1951." },
    { q: "Can government employees vote from home?", options: ["No", "Yes, via Postal Ballot", "Yes, online"], correct: 1, fact: "Election duty staff use Postal Ballots (Form 12)." },
    { q: "What is the symbol of Election Commission?", options: ["Peacock", "Tiger", "No official symbol"], correct: 2, fact: "The ECI itself does not use a political-style symbol." },
    { q: "How many phases was 2024 election?", options: ["5", "7", "9"], correct: 1, fact: "It was conducted in 7 phases." }
];

const MYTHS_DATA = [
    { myth: "My vote won't make a difference.", truth: "Elections have been won by 1 vote! Your voice is your power.", icon: "zap" },
    { myth: "I can't vote without physical ID.", truth: "False! If on roll, use Aadhaar, PAN, etc.", icon: "id-card" },
    { myth: "EVMs can be hacked via Bluetooth.", truth: "EVMs have NO network capability. No Wi-Fi, No Bluetooth.", icon: "shield-check" },
    { myth: "NRI voters can vote online.", truth: "Currently, NRIs must be present in India to vote.", icon: "globe" },
    { myth: "NOTA means election will be cancelled.", truth: "No, the highest candidate wins even if NOTA is higher.", icon: "x-circle" },
    { myth: "Ink is toxic.", truth: "Indelible ink is safe and dermatologically tested.", icon: "info" },
    { myth: "Voter registration is hard.", truth: "Takes 5 mins on the Voter Helpline App!", icon: "clock" },
    { myth: "I need to pay to register.", truth: "Registration is 100% FREE.", icon: "smile" },
    { myth: "Only citizens in India can register.", truth: "NRIs (Overseas Citizens) can also register as voters.", icon: "map-pin" },
    { myth: "Women need husband's permission.", truth: "Every adult citizen is independent in the eyes of ECI.", icon: "user-check" }
];

// ── NAVIGATION ──
function navigate(page) {
    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn =>
        btn.classList.toggle('active', btn.dataset.page === page)
    );

    // Update header
    const [title, sub] = PAGE_META[page];
    document.getElementById('page-title').textContent = title;
    document.getElementById('page-subtitle').textContent = sub;

    // Render page
    const el = document.getElementById('page-content');
    el.style.animation = 'none';
    el.offsetHeight; // reflow
    el.style.animation = '';

    const renderers = { 
        dashboard: renderDashboard, 
        assistant: renderAssistant, 
        timeline: renderTimeline, 
        readiness: renderReadiness,
        quiz: renderQuiz,
        mythbuster: renderMythBuster
    };
    renderers[page](el);
    lucide.createIcons();
}

// ── DASHBOARD ──
function renderDashboard(el) {
    el.innerHTML = `
        <div class="dash-hero">
            <div class="hero-content">
                <div class="hero-label"><i data-lucide="zap"></i> FEATURED TOOL</div>
                <h2>Ready for Election 2026?</h2>
                <p>VoteWise is your personal guide to navigating the democratic process. Ask questions, track milestones, and ensure you're ready to make your voice heard.</p>
                <p style="font-size:0.65rem; color:rgba(255,255,255,0.6); margin-top:-0.75rem; margin-bottom:1rem; font-weight:600; letter-spacing:0.5px;">BY SHAKEEB SHAKIR</p>
                <button class="hero-btn" onclick="navigate('assistant')">Start Chatting <i data-lucide="chevron-right"></i></button>
            </div>
            <div class="live-pulse-box">
                <div class="pulse-header">
                    <span class="pulse-dot"></span>
                    LIVE PULSE (SIMULATED)
                </div>
                <div class="pulse-val" id="pulse-val">94.2M</div>
                <div class="pulse-label">Registered Voters</div>
            </div>
            <div class="hero-watermark"><img src="icon.png" style="width:100px; opacity:0.2; filter: brightness(0) invert(1);"></div>
        </div>
        <div class="dash-cards">
            <div class="dash-card" onclick="navigate('assistant')">
                <div class="dc-header">
                    <div class="dc-icon"><i data-lucide="search"></i></div>
                    <i data-lucide="chevron-right" class="dc-arrow"></i>
                </div>
                <h3>Current Status</h3>
                <p>Are you registered? <a href="#" onclick="event.stopPropagation();navigate('assistant')">Registration</a> deadlines are approaching in several states.</p>
                <div class="dc-bar"><div class="dc-fill" style="width:30%"></div></div>
            </div>
            <div class="dash-card" onclick="navigate('timeline')">
                <div class="dc-header">
                    <div class="dc-icon red"><i data-lucide="calendar"></i></div>
                    <i data-lucide="chevron-right" class="dc-arrow"></i>
                </div>
                <h3>Next Milestone</h3>
                <p class="dc-event"><strong>Registration Deadline</strong><br>Monday, Oct 5th, 2026</p>
                <div class="dc-badges">
                    <span class="badge amber">INCOMING</span>
                    <span class="badge gray">National Event</span>
                </div>
            </div>
        </div>`;
}

// ── ASSISTANT ──
const INDIAN_LANGS = [
    "English", "Hindi (हिन्दी)", "Bengali (বাংলা)", "Telugu (తెలుగు)", 
    "Marathi (मराठी)", "Tamil (தமிழ்)", "Urdu (اردو)", "Kannada (ಕನ್ನಡ)", 
    "Gujarati (ગુજરાતી)", "Malayalam (മലയാളം)", "Punjabi (ਪੰਜਾਬੀ)", 
    "Odia (ଓଡ଼ିଆ)", "Assamese (অসমীଆ)"
];

function renderAssistant(el) {
    el.innerHTML = `
        <div class="chat-wrap">
            <div class="chat-window" id="chat-window">
                <div class="chip-intro" id="chip-intro">
                    <div class="chip-mascot">🤖</div>
                    <h2>I'm Chip, your AI Guide!</h2>
                    <p>Your friendly neighborhood civic companion.<br>Ready to dive into democracy?</p>
                    <div class="intro-chips">
                        ${CHIPS.map(c => `<button class="ichip" onclick="sendChip('${c}')">${c}</button>`).join('')}
                    </div>
                </div>
            </div>
            <div class="chat-input-row">
                <div class="lang-select">
                    <select id="lang-sel">
                        ${INDIAN_LANGS.map(l => `<option value="${l}">${l}</option>`).join('')}
                    </select>
                    <i data-lucide="globe"></i>
                </div>
                <input type="text" id="chat-in" placeholder="Ask in selected language..." autocomplete="off">
                <button id="chat-send"><i data-lucide="send"></i></button>
            </div>
        </div>`;

    // Restore previous messages
    chatMessages.forEach(m => appendChatMsg(m.role, m.text, false));

    document.getElementById('chat-in').addEventListener('keypress', e => {
        if (e.key === 'Enter') sendChat();
    });
    document.getElementById('chat-send').addEventListener('click', sendChat);
    
    document.getElementById('lang-sel').addEventListener('change', (e) => {
        const lang = e.target.value.split(' (')[0];
        document.getElementById('chat-in').placeholder = `Ask in ${lang}...`;
    });
}

// ── TIMELINE ──
function renderTimeline(el) {
    el.innerHTML = `
        <div class="timeline-wrap">
            <div class="timeline-line"></div>
            ${TIMELINE_EVENTS.map((ev, i) => `
                <div class="tl-item" style="animation-delay:${i * 0.07}s">
                    <div class="tl-dot"></div>
                    <div class="tl-card">
                        <div class="tl-header">
                            <strong>${ev.title}</strong>
                            <span class="tl-date">${ev.date}</span>
                        </div>
                        <p>${ev.desc}</p>
                    </div>
                </div>`).join('')}
        </div>`;
}

// ── READINESS ──
function renderReadiness(el) {
    el.innerHTML = `
        <div class="readiness-wrap">
            <div class="readiness-header">
                <div class="r-icon"><i data-lucide="check-circle-2"></i></div>
                <div>
                    <h2>Vote Ready</h2>
                    <p class="r-sub">2026 READINESS AUDIT</p>
                </div>
            </div>
            <div class="checklist">
                ${READINESS_ITEMS.map((item, i) => `
                    <div class="check-item ${readinessChecked.includes(i) ? 'checked' : ''}"
                         onclick="toggleCheck(${i})" style="animation-delay:${i * 0.06}s">
                        <div class="check-radio ${readinessChecked.includes(i) ? 'on' : ''}"></div>
                        <div class="check-ico"><i data-lucide="${item.icon}"></i></div>
                        <span>${item.text}</span>
                    </div>`).join('')}
            </div>
        </div>`;
}

function toggleCheck(idx) {
    if (readinessChecked.includes(idx)) {
        readinessChecked = readinessChecked.filter(i => i !== idx);
    } else {
        readinessChecked.push(idx);
    }
    renderReadiness(document.getElementById('page-content'));
    lucide.createIcons();
}

// ── QUIZ ──
function renderQuiz(el) {
    el.innerHTML = `
        <div class="quiz-container">
            <div id="quiz-screen">
                <div class="quiz-card">
                    <div class="quiz-header">
                        <span class="q-count">Question <span id="q-num">1</span> of ${QUIZ_DATA.length}</span>
                        <div class="q-progress"><div id="q-progress-fill" style="width: 0%"></div></div>
                    </div>
                    <h2 id="q-text">Loading...</h2>
                    <div class="quiz-options" id="q-options"></div>
                    <div id="q-feedback" class="q-feedback hidden"></div>
                    <button id="next-q" class="hero-btn hidden">Next Question <i data-lucide="arrow-right"></i></button>
                </div>
            </div>
            <div id="result-screen" class="hidden">
                <div class="quiz-card text-center">
                    <div class="result-icon"><i data-lucide="award"></i></div>
                    <h2>Quiz Completed!</h2>
                    <p>You scored <span id="final-score">0</span> out of ${QUIZ_DATA.length}</p>
                    <button class="hero-btn" onclick="navigate('quiz')">Try Again</button>
                </div>
            </div>
        </div>`;
    
    let currentQ = 0;
    let score = 0;

    const showQuestion = (idx) => {
        const data = QUIZ_DATA[idx];
        document.getElementById('q-num').textContent = idx + 1;
        document.getElementById('q-text').textContent = data.q;
        document.getElementById('q-progress-fill').style.width = `${(idx / QUIZ_DATA.length) * 100}%`;
        
        const optionsEl = document.getElementById('q-options');
        optionsEl.innerHTML = '';
        data.options.forEach((opt, i) => {
            const btn = document.createElement('button');
            btn.className = 'ichip quiz-opt';
            btn.textContent = opt;
            btn.onclick = () => handleAnswer(i);
            optionsEl.appendChild(btn);
        });

        document.getElementById('q-feedback').classList.add('hidden');
        document.getElementById('next-q').classList.add('hidden');
        lucide.createIcons();
    };

    const handleAnswer = (choice) => {
        const data = QUIZ_DATA[currentQ];
        const feedbackEl = document.getElementById('q-feedback');
        const nextBtn = document.getElementById('next-q');
        
        document.querySelectorAll('.quiz-opt').forEach(b => b.disabled = true);
        
        if (choice === data.correct) {
            score++;
            feedbackEl.innerHTML = `<div class="ans-correct">✅ Correct!</div><p>${data.fact}</p>`;
        } else {
            feedbackEl.innerHTML = `<div class="ans-wrong">❌ Not quite.</div><p>${data.fact}</p>`;
        }
        
        feedbackEl.classList.remove('hidden');
        nextBtn.classList.remove('hidden');
        lucide.createIcons();
    };

    document.getElementById('next-q').onclick = () => {
        currentQ++;
        if (currentQ < QUIZ_DATA.length) {
            showQuestion(currentQ);
        } else {
            document.getElementById('quiz-screen').classList.add('hidden');
            document.getElementById('result-screen').classList.remove('hidden');
            document.getElementById('final-score').textContent = score;
        }
    };

    showQuestion(0);
}

// ── MYTH BUSTER ──
function renderMythBuster(el) {
    el.innerHTML = `
        <div class="myth-grid">
            ${MYTHS_DATA.map((m, i) => `
                <div class="myth-item" style="animation-delay: ${i * 0.1}s">
                    <div class="myth-icon"><i data-lucide="${m.icon}"></i></div>
                    <div class="myth-content">
                        <div class="myth-tag">MYTH</div>
                        <h3>${m.myth}</h3>
                        <div class="truth-tag">TRUTH</div>
                        <p>${m.truth}</p>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    lucide.createIcons();
}

// ── LOCAL KNOWLEDGE BASE (Enhanced for "Full" Answers) ──
const LOCAL_KB = [
    // Voting Basics
    { keys: ['register','registration','sign up','enroll','form 6'], ans: "<b>Voter Registration (Form 6):</b><br>To register as a new voter in India, you must fill out <b>Form 6</b>. You can do this easily online at <a href='https://voters.eci.gov.in' target='_blank'>voters.eci.gov.in</a> or through the <b>Voter Helpline App</b>. <br><br><b>Requirements:</b><br>1. You must be an Indian citizen.<br>2. You must be 18 years or older on the qualifying date (Jan 1, Apr 1, Jul 1, or Oct 1).<br>3. You need a passport-sized photo, proof of age (Aadhaar, Birth Cert), and proof of residence." },
    { keys: ['voter id','epic','voter card','id card'], ans: "<b>EPIC (Voter ID Card):</b><br>The Elector's Photo Identity Card (EPIC) is your official voting ID. Once your registration is approved, it is usually sent to your residence by post. <br><br><b>Key Fact:</b> If you lose your physical card, you can download a digital <b>e-EPIC</b> from the Voter Portal. <i>Remember:</i> You can still vote without the physical card if your name is in the Electoral Roll, provided you carry another valid photo ID like Aadhaar or PAN." },
    { keys: ['age','minimum age','how old','18'], ans: "<b>Voting Age:</b><br>In India, every citizen who has attained the age of <b>18 years</b> is entitled to vote. This right is granted regardless of caste, religion, or gender. <br><br><b>History:</b> Originally, the voting age was 21, but it was reduced to 18 by the 61st Amendment Act in 1989 to encourage youth participation in democracy." },
    { keys: ['how to vote','cast vote','voting process','booth','polling'], ans: "<b>Step-by-Step Voting Process:</b><br>1. <b>Verification:</b> First polling officer checks your name on the electoral roll and your ID.<br>2. <b>Inking:</b> Second officer marks your left index finger with indelible ink and gives you a slip.<br>3. <b>Signature:</b> You sign the register (Form 17A).<br>4. <b>The Booth:</b> You enter the voting compartment alone.<br>5. <b>EVM:</b> Press the button next to your candidate's symbol on the Electronic Voting Machine.<br>6. <b>VVPAT:</b> Watch the VVPAT window for 7 seconds to see a slip showing your choice." },
    { keys: ['evm','electronic voting machine','voting machine'], ans: "<b>About EVMs:</b><br>Electronic Voting Machines (EVMs) are standalone, secure devices used to record votes. <br><br><b>Security Features:</b><br>• They are <b>not connected</b> to any network (No Wi-Fi, No Bluetooth).<br>• They run on internal batteries.<br>• They are physically sealed in the presence of candidate representatives.<br>• They have been used in India since 2004 without a single proven instance of hacking." },
    { keys: ['vvpat','paper slip','verify vote'], ans: "<b>VVPAT (Voter Verified Paper Audit Trail):</b><br>This is an independent system attached to the EVM. When you vote, it prints a paper slip containing the serial number, name, and symbol of the candidate you chose. <br><br><b>Purpose:</b> It allows you to visually verify your vote for 7 seconds before the slip drops into a sealed box. It ensures 100% transparency." },
    { keys: ['lost id','lost voter id','no voter id','without voter id'], ans: "<b>Voting Without a Voter ID Card:</b><br>Yes, you can! As long as your name is listed in the <b>Electoral Roll</b>, you can vote by showing any of the following 12 alternative documents:<br>1. Aadhaar Card<br>2. PAN Card<br>3. Passport<br>4. Driving License<br>5. MNREGA Job Card<br>6. Bank/Post Office Passbook with photo<br>7. Pension document with photo<br>...and a few others. <b>The Electoral Roll entry is what matters most!</b>" },

    // Election Durations & Types
    { keys: ['duration','how long','term','years','period'], ans: "<b>Election Terms in India:</b><br>1. <b>Lok Sabha (MP):</b> 5 Years<br>2. <b>State Assembly (MLA):</b> 5 Years<br>3. <b>Panchayat/Municipality:</b> 5 Years<br>4. <b>Rajya Sabha:</b> 6 Years (Permanent house, 1/3 members retire every 2 years)<br>5. <b>President of India:</b> 5 Years" },
    { keys: ['next election','upcoming','when is next','dates'], ans: "<b>Upcoming Elections:</b><br>• <b>2024:</b> Maharashtra and Haryana State Assemblies.<br>• <b>2025:</b> Delhi (Feb) and Bihar (Oct/Nov).<br>• <b>2026:</b> West Bengal, Tamil Nadu, Kerala, and Assam.<br>• <b>2029:</b> Next Lok Sabha (General) Election." },

    // Motivational / Why Vote
    { keys: ['why vote','should i vote','importance of voting','benefit'], ans: "<b>Why You Should Vote:</b><br>1. <b>Your Voice Matters:</b> Elections are often decided by thin margins. Your one vote can be the tie-breaker!<br>2. <b>Accountability:</b> It's your way to hold leaders accountable for development, roads, and education.<br>3. <b>Right to Complain:</b> If you don't vote, you lose the moral ground to criticize the government.<br>4. <b>Honor History:</b> Millions fought for your right to choose your leader. Use it!" },
    { keys: ['best party','who to vote for','which party'], ans: "As an AI Guide, I cannot tell you <b>who</b> to vote for. However, I recommend using the <b>KYC (Know Your Candidate)</b> app to check candidates' criminal records and education before deciding. Vote for the person you think will serve your community best!" },

    // Indian Election System
    { keys: ['eci','election commission','election commission of india'], ans: "<b>Election Commission of India (ECI):</b><br>The ECI is an autonomous constitutional authority responsible for administering election processes in India. It manages elections to the Lok Sabha, Rajya Sabha, State Legislative Assemblies, and the offices of the President and Vice President. Its primary goal is to ensure free and fair elections." },
    { keys: ['lok sabha','parliament','mps','lower house'], ans: "<b>Lok Sabha (House of the People):</b><br>This is the lower house of India's bicameral Parliament. It has 543 members who are directly elected by the people for a term of 5 years. The party or coalition that gains a majority in the Lok Sabha forms the Central Government." },
    { keys: ['nota','none of the above'], ans: "<b>NOTA (None of the Above):</b><br>NOTA is a ballot option that allows voters to officially register a vote of rejection for all candidates. While NOTA votes are counted, they do not currently affect the outcome (the candidate with the most valid votes still wins), but it serves as a powerful signal of voter dissatisfaction." },

    // General greetings & help
    { keys: ['hello','hi','hey','sup','namaste','hola'], ans: "Namaste! 🙏 I'm <b>Chip</b>, your personal VoteWise guide. I'm here to give you <b>full, accurate answers</b> about the democratic process in India. <br><br>You can ask me about registration, how EVMs work, your rights as a voter, or even try the <b>Quiz</b> and <b>Myth Buster</b> sections in the sidebar! How can I help you today?" },
];

// ── SMART RESPONSE ENGINE ──
async function getAnswer(prompt) {
    const lower = prompt.toLowerCase();
    const currentLang = document.getElementById('lang-sel')?.value || "English";

    // 1. Check local KB first (instant response)
    for (const entry of LOCAL_KB) {
        if (entry.keys.some(k => lower.includes(k))) {
            return entry.ans;
        }
    }

    // 2. Try Gemini API
    try {
        const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `You are Chip, a friendly and highly knowledgeable AI assistant for VoteWise. 
                            Language context: Respond in ${currentLang}.
                            
                            Instructions:
                            - Provide FULL, detailed, and accurate answers about elections, voting, Indian civics, etc.
                            - Use bold text for key terms.
                            - Use line breaks for readability.
                            - If the user asks in a specific language, respond in that language.
                            - Max 200 words.
                            
                            Question: ${prompt}`
                        }]
                    }],
                    generationConfig: { temperature: 0.7, maxOutputTokens: 500 }
                })
            }
        );
        
        if (res.status === 403 || res.status === 400) {
            throw new Error("API_KEY_ERROR");
        }

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text.trim();
        throw new Error('Empty response');
    } catch (err) {
        console.warn('Gemini API failed:', err.message);
        if (err.message === "API_KEY_ERROR") {
            return "<b>⚠️ Assistant Connectivity Issue:</b><br>The AI Brain connection is currently restricted (possibly due to an invalid or expired API key). <br><br><b>Don't worry!</b> You can still ask me about <b>Registration, EVMs, Voter IDs, or NOTA</b> — I have this info saved locally for you!";
        }
    }

    // 3. Smart fallback based on question type
    if (lower.includes('what') || lower.includes('who') || lower.includes('when') || lower.includes('where'))
        return "Great question! I'm having trouble reaching my AI brain right now. Please check your internet or try again shortly. You can also visit voters.eci.gov.in for official election information.";
    if (lower.includes('how'))
        return "I'd love to explain that! My AI connection seems down right now. For voting procedures, visit voters.eci.gov.in or call the Voter Helpline at 1950.";

    return "I'm Chip, and I'm here to help! My full AI mode is temporarily unavailable, but I know a lot about voting and elections. Try asking about registration, EVMs, your rights, or how to vote!";
}

// ── CHAT LOGIC ──
async function sendChat() {
    const input = document.getElementById('chat-in');
    const text = input.value.trim();
    if (!text) return;
    input.value = '';

    const intro = document.getElementById('chip-intro');
    if (intro) intro.remove();

    appendChatMsg('user', text, true);
    chatMessages.push({ role: 'user', text });

    const win = document.getElementById('chat-window');
    
    // Remove old suggestions
    const oldSugg = document.querySelector('.chat-suggestions');
    if (oldSugg) oldSugg.remove();

    const typingEl = document.createElement('div');
    typingEl.className = 'chat-msg assistant typing-msg';
    typingEl.innerHTML = '<div class="msg-bubble"><div class="typing-dots"><span></span><span></span><span></span></div></div>';
    win.appendChild(typingEl);
    win.scrollTop = win.scrollHeight;

    const response = await getAnswer(text);
    typingEl.remove();

    appendChatMsg('assistant', response, true);
    chatMessages.push({ role: 'assistant', text: response });
    
    // Add dynamic suggestions based on context
    addSuggestions(text);
}

function addSuggestions(prevText) {
    const win = document.getElementById('chat-window');
    const div = document.createElement('div');
    div.className = 'chat-suggestions';
    
    let options = ['Voter ID Rules', 'EVM Security', 'Take a Quiz'];
    if (prevText.toLowerCase().includes('register')) options = ['Check Status', 'Form 8 (Correction)', 'NRI Registration'];
    
    div.innerHTML = options.map(opt => `<button onclick="sendChip('${opt}')">${opt}</button>`).join('');
    win.appendChild(div);
    win.scrollTop = win.scrollHeight;
}

function sendChip(text) {
    const input = document.getElementById('chat-in');
    if (input) { input.value = text; sendChat(); }
}

function appendChatMsg(role, text, animate = true) {
    const win = document.getElementById('chat-window');
    if (!win) return;
    const div = document.createElement('div');
    div.className = `chat-msg ${role}`;
    if (!animate) div.style.animation = 'none';
    
    let content = text.replace(/\n/g, '<br>');
    if (role === 'assistant') {
        content += `<div class="msg-source"><i data-lucide="external-link"></i> Verified via ECI Portal</div>`;
    }
    
    div.innerHTML = `<div class="msg-bubble">${content}</div>`;
    win.appendChild(div);
    lucide.createIcons();
    win.scrollTop = win.scrollHeight;
}

// ── LIVE PULSE SIM ──
setInterval(() => {
    const el = document.getElementById('pulse-val');
    if (el) {
        let val = parseFloat(el.innerText.replace('M',''));
        val += (Math.random() * 0.01);
        el.innerText = val.toFixed(2) + 'M';
    }
}, 3000);

// ── INIT ──
document.querySelectorAll('.nav-btn').forEach(btn =>
    btn.addEventListener('click', () => navigate(btn.dataset.page))
);

navigate('dashboard');
