// Quiz data and configuration
const questions = [
    {
        question: "What is your current professional experience level?",
        options: [
            { text: "Mid-level Manager (5-10 years)", score: { strategy: 2, visibility: 3, mindset: 1 } },
            { text: "Senior Leadership / Director (10-15 years)", score: { strategy: 4, negotiation: 2, visibility: 2 } },
            { text: "Aspiring CXO / Business Owner", score: { strategy: 5, negotiation: 4, mindset: 3 } },
            { text: "Entry/Early Career Professional", score: { mindset: 5, visibility: 4 } }
        ]
    },
    {
        question: "What is the biggest barrier you face right now?",
        options: [
            { text: "I'm working hard but not getting noticed (Visibility)", score: { visibility: 10 } },
            { text: "I feel stuck at my current salary level (Negotiation)", score: { negotiation: 10 } },
            { text: "I struggle with office politics and strategic navigation", score: { strategy: 10 } },
            { text: "I doubt my own abilities despite my success (Mindset)", score: { mindset: 10 } }
        ]
    },
    {
        question: "How would you describe your leadership style?",
        options: [
            { text: "Empathetic and Collaborating", score: { mindset: 3, visibility: 2 } },
            { text: "Direct and Result-Oriented", score: { strategy: 4, negotiation: 3 } },
            { text: "Reserved and Executing", score: { visibility: 5, strategy: 2 } },
            { text: "Strategic and Visionary", score: { strategy: 5, negotiation: 4 } }
        ]
    },
    {
        question: "What is your primary goal for the next 12 months?",
        options: [
            { text: "Achieve a significant promotion or salary hike", score: { negotiation: 5, strategy: 4 } },
            { text: "Build a powerful personal brand in my industry", score: { visibility: 8 } },
            { text: "Overcome fear and lead with unapologetic confidence", score: { mindset: 8 } },
            { text: "Master high-level business warfare and competitor strategy", score: { strategy: 8 } }
        ]
    }
];

const pillars = {
    visibility: {
        name: "Impactful Visibility",
        description: "You have the skills, but the right people don't know it yet. You need to master the art of 'Shameless Pitching' and strategic positioning to ensure your contributions are recognized at the highest levels.",
        program: "Leadership Essentials Program",
        detail: "Focuses on visibility, positioning, and developing a year-long community leverage."
    },
    negotiation: {
        name: "Strategic Negotiation",
        description: "You are undervalued. Mastering the Art of War in negotiation will help you claim the compensation and resources you deserve without feeling guilty or aggressive.",
        program: "100 Board Members Program",
        detail: "Fast-track your growth to senior levels with advanced negotiation tactics."
    },
    strategy: {
        name: "Business Warfare Strategy",
        description: "To reach the C-Suite, you must stop 'managing' and start 'leading' strategically. You need to understand the market and internal dynamics like a chess player.",
        program: "Master of Business Warfare",
        detail: "Our elite year-long program for senior professionals aiming for CXO roles."
    },
    mindset: {
        name: "Unapologetic Mindset",
        description: "Your biggest competitor is your own self-doubt. Developing an 'Iron Lady' mindset will allow you to navigate biases and politics with unwavering confidence.",
        program: "Leadership Essentials Program",
        detail: "Designed to shift your mindset from 'fitting in' to 'standing out'."
    }
};

let currentQuestion = 0;
let userAnswers = [];
let userScores = { visibility: 0, negotiation: 0, strategy: 0, mindset: 0 };

// DOM Elements - Quiz
const startBtn = document.getElementById('start-btn');
const hero = document.getElementById('hero');
const quizContainer = document.getElementById('quiz-container');
const questionBox = document.getElementById('question-box');
const nextBtn = document.getElementById('next-btn');
const backBtn = document.getElementById('back-btn');
const resultsContainer = document.getElementById('results-container');
const aiAnalyzing = document.getElementById('ai-analyzing');
const resultsContent = document.getElementById('results-content');
const progressBar = document.getElementById('progress');
const restartBtn = document.getElementById('restart-btn');

// DOM Elements - Chatbot
const chatToggle = document.getElementById('chat-toggle');
const chatWindow = document.getElementById('chat-window');
const minimizeChat = document.getElementById('minimize-chat');
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const sendMessage = document.getElementById('send-message');

// Chatbot state
let conversationHistory = [];
let userContext = {
    hasCompletedDiagnostic: false,
    recommendedPillar: null,
    recommendedProgram: null
};

// Knowledge Base for AI Chatbot
const knowledgeBase = {
    programs: {
        keywords: ['program', 'course', 'training', 'offer', 'what do you', 'classes', 'study', 'tracks'],
        responses: [
            "We offer three flagship programs:\n\n**1. Leadership Essentials** (4 weeks)\nPerfect for building confidence and visibility\n\n**2. 100 Board Members** (6 months)\nFor mid-level professionals seeking breakthroughs\n\n**3. Master of Business Warfare** (1 year)\nElite program for C-suite aspirants\n\nWhich one interests you?"
        ],
        followUp: ['📚 Tell me about Leadership Essentials', '📚 Tell me about 100 Board Members', '📚 Tell me about Master of Business Warfare']
    },
    leadership_essentials: {
        keywords: ['leadership essentials', 'essentials program'],
        responses: [
            "**Leadership Essentials Program** (4 weeks)\n\nDesigned for women who:\n• Feel invisible despite their hard work\n• Struggle with self-doubt and imposter syndrome\n• Want to build a powerful personal brand\n\n**Fees:**\n• Registration: ₹2,999 \n• Total Program Fee: ₹35,000\n• Balance ₹32,001 payable after admission\n\n**Investment:** Contact us for pricing\n\nWould you like to enroll?"
        ],
        followUp: ['✅ How do I enroll?', '📚 Tell me about other programs', '💰 What\'s the pricing?']
    },
    board_members: {
        keywords: ['100 board', 'board members'],
        responses: [
            "**100 Board Members Program** (6 months)\n\nFast-track program for:\n• Mid to senior-level professionals\n• Those ready for strategic negotiation mastery\n• Women aiming for board positions\n\n**What you'll gain:**\n• Advanced negotiation tactics\n• Executive presence\n• Strategic networking\n\n**Investment:** Premium tier program\n\nInterested in learning more?"
        ],
        followUp: ['✅ How do I enroll?', '🔍 What\'s included?', '💰 Tell me about pricing']
    },
    business_warfare: {
        keywords: ['business warfare', 'master of business', 'warfare program'],
        responses: [
            "**Master of Business Warfare** (1 year)\n\nOur most elite program for:\n• Senior leaders aiming for C-suite\n• Entrepreneurs scaling businesses\n• Those ready to master strategic thinking\n\n**What you'll master:**\n• Market and competitive analysis\n• Strategic decision-making\n• C-suite leadership skills\n\n**Investment:** Elite tier program\n\nReady to apply?"
        ],
        followUp: ['✅ How do I apply?', '📋 What are the requirements?', '💰 Tell me about pricing']
    },
    diagnostic: {
        keywords: ['diagnostic', 'assessment', 'quiz', 'test', 'career test', 'gap', 'result'],
        responses: [
            "Our **Career Breakthrough Diagnostic** is a 4-question AI-powered assessment that identifies your primary leadership gap.\n\n**It analyzes:**\n• Your experience level\n• Current barriers\n• Leadership style\n• Career goals\n\n**Result:** Personalized program recommendation\n\nWould you like to take it?"
        ],
        followUp: ['📊 Yes, start the diagnostic', '📚 Tell me more about the programs first']
    },
    pillars: {
        keywords: ['pillar', 'four pillars', 'leadership pillars'],
        responses: [
            "The **4 Iron Lady Leadership Pillars** are:\n\n**1. Impactful Visibility**\nGet noticed by decision-makers\n\n**2. Strategic Negotiation**\nClaim your worth confidently\n\n**3. Business Warfare Strategy**\nThink like a C-suite leader\n\n**4. Unapologetic Mindset**\nOvercome self-doubt and bias\n\nWhich pillar resonates with you?"
        ],
        followUp: ['💡 Tell me about Visibility', '💡 Tell me about Negotiation', '💡 Tell me about Strategy', '💡 Tell me about Mindset']
    },
    pricing: {
        keywords: ['price', 'cost', 'fee', 'payment', 'afford', 'expensive', 'rates', 'tuition', 'how much', 'money', 'investment'],
        responses: [
            "**Leadership Essentials Program Pricing:**\n\n• **Registration Fee:** ₹2,999\n• **Total Program Fee:** ₹35,000\n• **Balance:** ₹32,001 (payable after admission)\n\nProgram pricing varies for other tracks. We also offer:\n• Flexible payment plans\n• Corporate sponsorships\n• Pay It Forward scholarships\n\nWould you like to speak with our enrollment team?"
        ],
        followUp: ['📞 Yes, connect me with enrollment', '🎓 Tell me about scholarships', '💳 What payment options are available?']
    },
    enrollment: {
        keywords: ['enroll', 'sign up', 'join', 'register', 'apply'],
        responses: [
            "Great! Here's how to enroll:\n\n**Step 1:** Take the diagnostic (if you haven't)\n**Step 2:** Visit iamironlady.com/enroll\n**Step 3:** Schedule a discovery call\n**Step 4:** Choose your payment plan\n\n**Ready to start?**"
        ],
        followUp: ['📊 Take the diagnostic', '🌐 Visit enrollment page', '📞 Schedule a call']
    },
    methodology: {
        keywords: ['methodology', 'approach', 'how it works', 'method', 'learn', 'teach', 'style', 'curriculum'],
        responses: [
            "The **Iron Lady Methodology** is built on:\n\n**1. Shameless Pitching**\nOwn your achievements unapologetically\n\n**2. Art of War Principles**\nStrategic thinking for career advancement\n\n**3. Community Leverage**\nYear-long support network\n\n**4. Practical Application**\nReal-world scenarios, not just theory\n\nWant to see it in action?"
        ],
        followUp: ['📚 Tell me about programs', '📊 Take the diagnostic', '✅ How do I enroll?']
    },
    greetings: {
        keywords: ['hi', 'hello', 'hey', 'good morning', 'good evening', 'greetings', 'hiya'],
        responses: [
            "Hello! 👋 Ready to unlock your leadership potential? How can I assist you today?"
        ],
        followUp: ['📚 View Programs', '📊 About Diagnostic', '💰 Pricing Info']
    },
    gratitude: {
        keywords: ['thanks', 'thank you', 'thx', 'appreciate', 'cool', 'great'],
        responses: [
            "You're very welcome! Let me know if you have any other questions about your career journey."
        ],
        followUp: ['📚 View Programs', '💡 Leadership Pillars']
    },
    farewell: {
        keywords: ['bye', 'goodbye', 'see you', 'later', 'cya'],
        responses: [
            "Goodbye! Keep leading with confidence. 💪"
        ],
        followUp: null
    },
    founder: {
        keywords: ['started', 'founder', 'ceo', 'who created', 'rajesh bhat', 'owner'],
        responses: [
            "Iron Lady was founded by **Rajesh Bhat** with a mission to create 1 million women leaders."
        ],
        followUp: ['📚 View Programs']
    },
    location: {
        keywords: ['located', 'location', 'address', 'where are you', 'office', 'bengaluru'],
        responses: [
            "We are located at:\n\n**Iron Lady / Nandi Info Tech**\n2nd Floor, KIADB Plot #8\nSadaramangala Rd, Mahadevapura\nBengaluru, Karnataka - 560048"
        ],
        followUp: ['📚 View Programs']
    }
};

// ==================== QUIZ FUNCTIONS ====================

if (startBtn) startBtn.addEventListener('click', startQuiz);
if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        currentQuestion++;
        if (currentQuestion < questions.length) {
            showQuestion();
        } else {
            calculateFinalScores();
            showResults();
        }
    });
}

if (backBtn) {
    backBtn.addEventListener('click', () => {
        currentQuestion--;
        showQuestion();
    });
}

if (restartBtn) {
    restartBtn.addEventListener('click', () => {
        currentQuestion = 0;
        userAnswers = [];
        userScores = { visibility: 0, negotiation: 0, strategy: 0, mindset: 0 };
        resultsContainer.classList.add('hidden');
        hero.classList.remove('hidden');
    });
}

function startQuiz() {
    hero.classList.add('hidden');
    quizContainer.classList.remove('hidden');
    showQuestion();
}

function showQuestion() {
    const q = questions[currentQuestion];
    progressBar.style.width = `${((currentQuestion) / questions.length) * 100}%`;

    backBtn.classList.toggle('hidden', currentQuestion === 0);

    const previousAnswer = userAnswers[currentQuestion];
    if (previousAnswer !== undefined) {
        nextBtn.classList.remove('hidden');
    } else {
        nextBtn.classList.add('hidden');
    }

    let html = `
        <div class="question">
            <h3>${q.question}</h3>
            <div class="options">
                ${q.options.map((opt, index) => `
                    <button class="option ${previousAnswer === index ? 'selected' : ''}" onclick="selectOption(${index})">
                        ${opt.text}
                    </button>
                `).join('')}
            </div>
        </div>
    `;
    questionBox.innerHTML = html;
}

window.selectOption = (index) => {
    const options = document.querySelectorAll('.option');
    options.forEach(opt => opt.classList.remove('selected'));
    options[index].classList.add('selected');

    userAnswers[currentQuestion] = index;
    nextBtn.classList.remove('hidden');
};

function calculateFinalScores() {
    userScores = { visibility: 0, negotiation: 0, strategy: 0, mindset: 0 };

    userAnswers.forEach((answerIndex, questionIndex) => {
        const scores = questions[questionIndex].options[answerIndex].score;
        for (const pillar in scores) {
            userScores[pillar] += scores[pillar];
        }
    });
}

function showResults() {
    quizContainer.classList.add('hidden');
    resultsContainer.classList.remove('hidden');
    aiAnalyzing.classList.remove('hidden');
    resultsContent.classList.add('hidden');

    progressBar.style.width = "100%";

    let topPillarKey = 'visibility';
    let maxScore = -1;

    for (const pillar in userScores) {
        if (userScores[pillar] > maxScore) {
            maxScore = userScores[pillar];
            topPillarKey = pillar;
        }
    }

    const result = pillars[topPillarKey];

    setTimeout(() => {
        aiAnalyzing.classList.add('hidden');
        resultsContent.classList.remove('hidden');

        document.getElementById('top-pillar').textContent = result.name;
        document.getElementById('pillar-description').textContent = result.description;
        document.getElementById('program-name').textContent = result.program;
        document.getElementById('program-detail').textContent = result.detail;

        updateChatbotContext(topPillarKey, result);
    }, 2000);
}

function updateChatbotContext(pillar, result) {
    userContext.hasCompletedDiagnostic = true;
    userContext.recommendedPillar = pillar;
    userContext.recommendedProgram = result.program;
}

// ==================== CHATBOT FUNCTIONS ====================

console.log("Initializing Chatbot...");
if (chatToggle) {
    chatToggle.addEventListener('click', () => {
        console.log("Chat toggle clicked");
        if (chatWindow) chatWindow.classList.toggle('hidden');
    });
} else {
    console.error("Chat toggle button not found!");
}

if (minimizeChat) {
    minimizeChat.addEventListener('click', () => {
        if (chatWindow) chatWindow.classList.add('hidden');
    });
}

if (sendMessage) sendMessage.addEventListener('click', sendChatMessage);
if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendChatMessage();
    });
}

function sendChatMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    conversationHistory.push({ role: 'user', content: message });
    addMessage(message, 'user');
    chatInput.value = '';

    showTyping();

    setTimeout(() => {
        removeTyping();
        const response = getAIResponse(message);
        conversationHistory.push({ role: 'assistant', content: response.text });
        addMessage(response.text, 'bot', response.followUps);

        if (response.action === 'start_quiz') {
            startQuiz();
            if (chatWindow) chatWindow.classList.add('hidden');
        }
    }, 1000 + Math.random() * 1000);
}

function addMessage(text, sender, quickReplies = null) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';

    const formattedText = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');

    contentDiv.innerHTML = `<p>${formattedText}</p>`;
    messageDiv.appendChild(contentDiv);

    // Add inline quick reply buttons if provided
    if (quickReplies && quickReplies.length > 0) {
        const quickReplyDiv = document.createElement('div');
        quickReplyDiv.className = 'inline-quick-replies';
        quickReplyDiv.innerHTML = quickReplies.map(option => `
            <button class="inline-quick-reply-btn" onclick="handleQuickReply('${option.replace(/'/g, "\\'")}', this)">
                ${option}
            </button>
        `).join('');
        messageDiv.appendChild(quickReplyDiv);
    }

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTyping() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message typing-message';
    typingDiv.innerHTML = `
        <div class="typing-indicator">
            <span></span><span></span><span></span>
        </div>
    `;
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTyping() {
    const typing = document.querySelector('.typing-message');
    if (typing) typing.remove();
}

// Handle inline quick reply button clicks
window.handleQuickReply = (query, buttonElement) => {
    // Disable all buttons in this message
    const parentMessage = buttonElement.closest('.message');
    const allButtons = parentMessage.querySelectorAll('.inline-quick-reply-btn');
    allButtons.forEach(btn => {
        btn.disabled = true;
        btn.classList.remove('selected');
    });

    // Highlight selected button
    buttonElement.classList.add('selected');

    // Show user's selection as a message
    setTimeout(() => {
        addMessage(query, 'user');
        showTyping();

        setTimeout(() => {
            removeTyping();
            const response = getAIResponse(query);
            conversationHistory.push({ role: 'user', content: query });
            conversationHistory.push({ role: 'assistant', content: response.text });
            addMessage(response.text, 'bot', response.followUps);

            if (response.action === 'start_quiz') {
                startQuiz();
                if (chatWindow) chatWindow.classList.add('hidden');
            }
        }, 1000 + Math.random() * 1000);
    }, 300);
};

function getAIResponse(userMessage) {
    // Strip emojis and icons for cleaner matching
    const cleanMessage = userMessage.replace(/[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim();
    const lowerMessage = cleanMessage.toLowerCase();

    // Context-aware responses if user completed diagnostic
    if (userContext.hasCompletedDiagnostic) {
        if (lowerMessage.includes('why') && (lowerMessage.includes('recommend') || lowerMessage.includes('pillar'))) {
            const pillarInfo = pillars[userContext.recommendedPillar];
            return {
                text: `Based on your diagnostic results, **${pillarInfo.name}** is your primary focus area because:\n\n${pillarInfo.description}\n\nThe **${pillarInfo.program}** is specifically designed to address this gap. Would you like to know more about the program?`,
                followUps: ['✅ Tell me about the program', '✅ How do I enroll?', '📅 What are the next steps?']
            };
        }
    }

    // Interactive Triggers
    if (lowerMessage.includes('start the diagnostic') || lowerMessage.includes('take the quiz') || lowerMessage.includes('start quiz')) {
        return {
            text: "Initializing Career Breakthrough Diagnostic...\n\nI'll minimize this chat so you can focus on the questions. Good luck!",
            action: 'start_quiz'
        };
    }

    // Check knowledge base
    for (const category in knowledgeBase) {
        const { keywords, responses, followUp } = knowledgeBase[category];

        const match = keywords.some(keyword => {
            // For common greetings or very short words, use strict word boundaries
            if (keyword.length <= 3) {
                const regex = new RegExp(`(^|\\s|\\W)${keyword}(\\s|\\W|$)`, 'i');
                return regex.test(lowerMessage);
            }
            // For longer keywords, allow them to match as part of a word (e.g. 'price' in 'pricing')
            // but still ensure they aren't hidden inside a completely different word
            return lowerMessage.includes(keyword.toLowerCase());
        });

        if (match) {
            return {
                text: responses[Math.floor(Math.random() * responses.length)],
                followUps: followUp || null
            };
        }
    }

    // Default response
    return {
        text: "That's a great question! For specific information, I recommend:\n\n• Taking the diagnostic above\n• Visiting iamironlady.com\n• Contacting our team directly:\n  📞 +91 73608 23123\n  ✉️ admin@iamironlady.com\n\nWhat else can I help with?",
        followUps: ['📚 View Programs', '📊 About Diagnostic', '💰 Pricing Info']
    };
}
