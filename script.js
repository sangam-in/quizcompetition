// Quiz Competition Manager - Main JavaScript File

// Global state object
const state = {
    teams: [],
    rounds: {
        preliminary: {
            name: "Preliminary Round",
            questions: {
                passable: [],
                av: [],
                buzzer: [],
                randomizer: []
            },
            currentQuestion: 0,
            activeType: 'passable'
        },
        semifinal: {
            name: "Semi-Final Round",
            questions: {
                passable: [],
                av: [],
                buzzer: [],
                randomizer: []
            },
            currentQuestion: 0,
            activeType: 'passable'
        },
        final: {
            name: "Final Round",
            questions: {
                passable: [],
                av: [],
                buzzer: [],
                randomizer: [],
                rapidfire: [],
                surprise: []
            },
            currentQuestion: 0,
            activeType: 'passable'
        }
    },
    currentRound: 'preliminary',
    settings: {
        defaultTimer: 60,
        rapidFireTimer: 5,
        correctPoints: 10,
        passPoints: 5,
        penaltyPoints: 5
    },
    timers: {
        question: null,
        rapidFire: null
    },
    rapidFire: {
        active: false,
        timeLeft: 300,
        correct: 0,
        incorrect: 0,
        currentTeam: null
    },
    dashboardCollapsed: false
};

// DOM Elements
const elements = {
    // Dashboard
    dashboard: document.getElementById('dashboard'),
    toggleDashboard: document.getElementById('toggleDashboard'),
    scoreboard: document.getElementById('scoreboard'),
    currentRound: document.getElementById('currentRound'),
    currentQuestion: document.getElementById('currentQuestion'),
    mainContent: document.getElementById('main-content'),
    
    // Pages
    pages: document.querySelectorAll('.page'),
    
    // Navigation
    navButtons: document.querySelectorAll('.nav-btn'),
    menuCards: document.querySelectorAll('.menu-card'),
    backButtons: document.querySelectorAll('.back-btn'),
    
    // Team Management
    teamName: document.getElementById('teamName'),
    addTeam: document.getElementById('addTeam'),
    teamsList: document.getElementById('teamsList'),
    
    // Rounds
    roundCards: document.querySelectorAll('.round-card'),
    
    // Questions
    roundSelect: document.getElementById('roundSelect'),
    typeSelect: document.getElementById('typeSelect'),
    addQuestion: document.getElementById('addQuestion'),
    questionsList: document.getElementById('questionsList'),
    
    // Scoreboard
    resetScores: document.getElementById('resetScores'),
    fullScoreboard: document.getElementById('fullScoreboard'),
    
    // Settings
    defaultTimer: document.getElementById('defaultTimer'),
    rapidFireTimer: document.getElementById('rapidFireTimer'),
    correctPoints: document.getElementById('correctPoints'),
    passPoints: document.getElementById('passPoints'),
    penaltyPoints: document.getElementById('penaltyPoints'),
    saveSettings: document.getElementById('saveSettings'),
    
    // Data Management
    exportData: document.getElementById('exportData'),
    importFile: document.getElementById('importFile'),
    importData: document.getElementById('importData'),
    resetCompetition: document.getElementById('resetCompetition'),
    
    // Round Interface
    roundTitle: document.getElementById('roundTitle'),
    questionType: document.getElementById('questionType'),
    questionNumber: document.getElementById('questionNumber'),
    questionText: document.getElementById('questionText'),
    questionOptions: document.getElementById('questionOptions'),
    questionAnswer: document.getElementById('questionAnswer'),
    prevQuestion: document.getElementById('prevQuestion'),
    nextQuestion: document.getElementById('nextQuestion'),
    prevType: document.getElementById('prevType'),
    nextType: document.getElementById('nextType'),
    revealAnswer: document.getElementById('revealAnswer'),
    passQuestion: document.getElementById('passQuestion'),
    timerValue: document.getElementById('timerValue'),
    startTimer: document.getElementById('startTimer'),
    stopTimer: document.getElementById('stopTimer'),
    resetTimer: document.getElementById('resetTimer'),
    customTimer: document.getElementById('customTimer'),
    setTimer: document.getElementById('setTimer'),
    roundTeams: document.getElementById('roundTeams'),
    awardPoints: document.getElementById('awardPoints'),
    deductPoints: document.getElementById('deductPoints'),
    
    // Modals
    questionModal: document.getElementById('questionModal'),
    rapidFireModal: document.getElementById('rapidFireModal'),
    closeModal: document.querySelector('.close'),
    cancelQuestion: document.getElementById('cancelQuestion'),
    saveQuestion: document.getElementById('saveQuestion'),
    questionTextInput: document.getElementById('questionTextInput'),
    questionOptionsInput: document.getElementById('questionOptionsInput'),
    questionAnswerInput: document.getElementById('questionAnswerInput'),
    questionPoints: document.getElementById('questionPoints'),
    startRapidFire: document.getElementById('startRapidFire'),
    stopRapidFire: document.getElementById('stopRapidFire'),
    correctRapidFire: document.getElementById('correctRapidFire'),
    incorrectRapidFire: document.getElementById('incorrectRapidFire'),
    rapidFireTimerValue: document.getElementById('rapidFireTimerValue'),
    rapidFireCorrect: document.getElementById('rapidFireCorrect'),
    rapidFireIncorrect: document.getElementById('rapidFireIncorrect'),
    modalTitle: document.getElementById('modalTitle')
};

// Initialize the application
function init() {
    loadState();
    setupEventListeners();
    renderDashboard();
    renderTeams();
    renderScoreboard();
    updateSettingsDisplay();
    
    // Initialize dashboard state
    updateDashboardState();
    
    // Populate round and type selects to ensure all options are available
    populateRoundSelect();
    populateTypeSelect(state.currentRound);

    // Show homepage by default
    showPage('home');
}

// Load state from localStorage
function loadState() {
    const savedState = localStorage.getItem('quizCompetitionState');
    if (savedState) {
        const parsed = JSON.parse(savedState);
        Object.assign(state, parsed);
    }
    
    // Initialize teams if empty
    if (state.teams.length === 0) {
        state.teams = [
            { id: 1, name: 'Team A', score: 0 },
            { id: 2, name: 'Team B', score: 0 },
            { id: 3, name: 'Team C', score: 0 }
        ];
    }
    
    // Initialize questions if empty
    initializeSampleQuestions();
}

// Save state to localStorage
function saveState() {
    localStorage.setItem('quizCompetitionState', JSON.stringify(state));
}

// Initialize sample questions for demonstration
function initializeSampleQuestions() {
    const sampleQuestions = {
        passable: [
            {
                id: 1,
                text: "What is the capital of France?",
                options: ["London", "Berlin", "Paris", "Madrid"],
                answer: "Paris",
                points: 10
            },
            {
                id: 2,
                text: "Which planet is known as the Red Planet?",
                options: ["Venus", "Mars", "Jupiter", "Saturn"],
                answer: "Mars",
                points: 10
            }
        ],
        av: [
            {
                id: 1,
                text: "Identify this famous landmark from the image.",
                options: ["Eiffel Tower", "Statue of Liberty", "Big Ben", "Colosseum"],
                answer: "Eiffel Tower",
                points: 15
            }
        ],
        buzzer: [
            {
                id: 1,
                text: "What is the chemical symbol for gold?",
                options: ["Go", "Gd", "Au", "Ag"],
                answer: "Au",
                points: 10
            }
        ],
        randomizer: [
            {
                id: 1,
                text: "Who wrote 'Romeo and Juliet'?",
                options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
                answer: "William Shakespeare",
                points: 10
            }
        ],
        rapidfire: [
            {
                id: 1,
                text: "Quick! Name the largest ocean on Earth.",
                answer: "Pacific Ocean",
                points: 5
            }
        ],
        surprise: [
            {
                id: 1,
                text: "Guess the brand from this logo description: Golden arches",
                answer: "McDonald's",
                points: 15
            }
        ]
    };
    
    // Only add sample questions if no questions exist
    for (const round in state.rounds) {
        for (const type in state.rounds[round].questions) {
            if (state.rounds[round].questions[type].length === 0 && sampleQuestions[type]) {
                state.rounds[round].questions[type] = [...sampleQuestions[type]];
            }
        }
    }
    
    saveState();
}

// Set up all event listeners
function setupEventListeners() {
    // Dashboard toggle
    elements.toggleDashboard.addEventListener('click', toggleDashboard);
    
    // Navigation
    elements.navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = e.target.getAttribute('data-target');
            showPage(target);
        });
    });
    
    elements.menuCards.forEach(card => {
        card.addEventListener('click', (e) => {
            const target = e.currentTarget.getAttribute('data-target');
            showPage(target);
        });
    });
    
    elements.backButtons.forEach(btn => {
        btn.addEventListener('click', () => showPage('home'));
    });
    
    // Team Management
    elements.addTeam.addEventListener('click', addNewTeam);
    
    // Rounds
    elements.roundCards.forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                const round = e.currentTarget.getAttribute('data-round');
                startRound(round);
            }
        });
    });
    
    // Questions
    elements.addQuestion.addEventListener('click', () => showQuestionModal(false));
    // When round selection changes, update available types and re-render
    elements.roundSelect.addEventListener('change', (e) => {
        const selectedRound = e.target.value;
        // Optionally keep state.currentRound in sync with selector here
        // but do not force UI navigation; just update types shown
        populateTypeSelect(selectedRound);
        renderQuestions();
    });
    elements.typeSelect.addEventListener('change', renderQuestions);
    
    // Scoreboard
    elements.resetScores.addEventListener('click', resetScores);
    
    // Settings
    elements.saveSettings.addEventListener('click', saveSettings);
    
    // Data Management
    elements.exportData.addEventListener('click', exportData);
    elements.importData.addEventListener('click', importData);
    elements.resetCompetition.addEventListener('click', resetCompetition);
    
    // Round Interface
    elements.prevQuestion.addEventListener('click', previousQuestion);
    elements.nextQuestion.addEventListener('click', nextQuestion);
    elements.prevType.addEventListener('click', previousQuestionType);
    elements.nextType.addEventListener('click', nextQuestionType);
    elements.revealAnswer.addEventListener('click', revealAnswer);
    elements.passQuestion.addEventListener('click', passQuestion);
    elements.startTimer.addEventListener('click', startQuestionTimer);
    elements.stopTimer.addEventListener('click', stopQuestionTimer);
    elements.resetTimer.addEventListener('click', resetQuestionTimer);
    elements.setTimer.addEventListener('click', setCustomTimer);
    elements.awardPoints.addEventListener('click', awardPointsToTeam);
    elements.deductPoints.addEventListener('click', deductPointsFromTeam);
    
    // Modals
    elements.closeModal.addEventListener('click', hideQuestionModal);
    elements.cancelQuestion.addEventListener('click', hideQuestionModal);
    elements.saveQuestion.addEventListener('click', saveNewQuestion);
    
    // Rapid Fire
    elements.startRapidFire.addEventListener('click', startRapidFire);
    elements.stopRapidFire.addEventListener('click', stopRapidFire);
    elements.correctRapidFire.addEventListener('click', markRapidFireCorrect);
    elements.incorrectRapidFire.addEventListener('click', markRapidFireIncorrect);
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === elements.questionModal) {
            hideQuestionModal();
        }
        if (e.target === elements.rapidFireModal) {
            hideRapidFireModal();
        }
    });
}

// Page Navigation
function showPage(pageId) {
    elements.pages.forEach(page => {
        page.classList.remove('active');
    });
    
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        
        // Update dashboard info
        if (pageId === 'round-interface') {
            elements.currentRound.textContent = state.rounds[state.currentRound].name;
        }
        
        // Render specific content for pages
        if (pageId === 'teams') {
            renderTeams();
        } else if (pageId === 'questions') {
            renderQuestions();
        } else if (pageId === 'scoreboard-page') {
            renderFullScoreboard();
        }
    }
}

// Dashboard Functions
function toggleDashboard() {
    state.dashboardCollapsed = !state.dashboardCollapsed;
    updateDashboardState();
    saveState();
}

function updateDashboardState() {
    if (state.dashboardCollapsed) {
        elements.dashboard.classList.add('collapsed');
        elements.toggleDashboard.textContent = '+';
        elements.mainContent.style.marginLeft = '60px';
    } else {
        elements.dashboard.classList.remove('collapsed');
        elements.toggleDashboard.textContent = '-';
        elements.mainContent.style.marginLeft = '300px';
    }
}

function renderDashboard() {
    const sortedTeams = [...state.teams].sort((a, b) => b.score - a.score);
    
    elements.scoreboard.innerHTML = sortedTeams.map(team => `
        <div class="team-score">
            <span class="team-name">${team.name}</span>
            <span class="team-points">${team.score}</span>
        </div>
    `).join('');
    
    // Update current round and question
    const round = state.rounds[state.currentRound];
    elements.currentRound.textContent = round.name;
    elements.currentQuestion.textContent = round.currentQuestion + 1;
}

// Team Management Functions
function renderTeams() {
    elements.teamsList.innerHTML = state.teams.map(team => `
        <div class="team-item">
            <span class="team-name">${team.name}</span>
            <div class="team-actions">
                <button class="edit-team" onclick="editTeam(${team.id})">Edit</button>
                <button class="delete-team" onclick="deleteTeam(${team.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

function addNewTeam() {
    const name = elements.teamName.value.trim();
    if (name) {
        const newTeam = {
            id: Date.now(),
            name: name,
            score: 0
        };
        
        state.teams.push(newTeam);
        elements.teamName.value = '';
        saveState();
        renderTeams();
        renderDashboard();
        renderScoreboard();
    }
}

function editTeam(id) {
    const team = state.teams.find(t => t.id === id);
    const newName = prompt('Enter new team name:', team.name);
    if (newName && newName.trim()) {
        team.name = newName.trim();
        saveState();
        renderTeams();
        renderDashboard();
        renderScoreboard();
    }
}

function deleteTeam(id) {
    if (confirm('Are you sure you want to delete this team?')) {
        state.teams = state.teams.filter(t => t.id !== id);
        saveState();
        renderTeams();
        renderDashboard();
        renderScoreboard();
    }
}

// Round Management Functions
function startRound(roundId) {
    state.currentRound = roundId;
    const round = state.rounds[roundId];
    
    // Set up round interface
    elements.roundTitle.textContent = round.name;
    updateQuestionDisplay();
    updateQuestionTypeButtons();
    
    // Render team buttons
    renderRoundTeams();
    
    // Show round interface
    showPage('round-interface');
    
    // Update dashboard
    renderDashboard();
}

function renderRoundTeams() {
    elements.roundTeams.innerHTML = state.teams.map(team => `
        <button class="team-button" data-team="${team.id}">${team.name}</button>
    `).join('');
    
    // Add event listeners to team buttons
    document.querySelectorAll('.team-button').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove active class from all buttons
            document.querySelectorAll('.team-button').forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            e.target.classList.add('active');
        });
    });
}

// Question Type Navigation Functions
function getQuestionTypeOrder(roundId) {
    const typeOrders = {
        preliminary: ['passable', 'av', 'buzzer', 'randomizer'],
        semifinal: ['passable', 'av', 'buzzer', 'randomizer'],
        final: ['passable', 'av', 'buzzer', 'randomizer', 'rapidfire', 'surprise']
    };
    return typeOrders[roundId] || ['passable'];
}

function getCurrentTypeIndex() {
    const round = state.rounds[state.currentRound];
    const typeOrder = getQuestionTypeOrder(state.currentRound);
    return typeOrder.indexOf(round.activeType);
}

function previousQuestionType() {
    const round = state.rounds[state.currentRound];
    const typeOrder = getQuestionTypeOrder(state.currentRound);
    const currentIndex = getCurrentTypeIndex();
    
    if (currentIndex > 0) {
        round.activeType = typeOrder[currentIndex - 1];
        round.currentQuestion = 0;
        updateQuestionDisplay();
        updateQuestionTypeButtons();
        renderDashboard();
    }
}

function nextQuestionType() {
    const round = state.rounds[state.currentRound];
    const typeOrder = getQuestionTypeOrder(state.currentRound);
    const currentIndex = getCurrentTypeIndex();
    
    if (currentIndex < typeOrder.length - 1) {
        round.activeType = typeOrder[currentIndex + 1];
        round.currentQuestion = 0;
        updateQuestionDisplay();
        updateQuestionTypeButtons();
        renderDashboard();
    }
}

function updateQuestionTypeButtons() {
    const round = state.rounds[state.currentRound];
    const typeOrder = getQuestionTypeOrder(state.currentRound);
    const currentIndex = getCurrentTypeIndex();
    
    elements.prevType.disabled = currentIndex === 0;
    elements.nextType.disabled = currentIndex === typeOrder.length - 1;
}

// Populate the round select with the rounds defined in state
function populateRoundSelect() {
    if (!elements.roundSelect) return;
    const options = Object.keys(state.rounds).map(key => {
        const display = state.rounds[key].name || key;
        return `<option value="${key}">${display}</option>`;
    }).join('');
    elements.roundSelect.innerHTML = options;
    // Set current selection
    elements.roundSelect.value = state.currentRound;
}

// Populate the type select based on the selected round
function populateTypeSelect(roundId) {
    if (!elements.typeSelect) return;
    const typeOrder = getQuestionTypeOrder(roundId);
    const typeNames = {
        passable: 'Passable Questions',
        av: 'A/V Round',
        buzzer: 'Buzzer Round',
        randomizer: 'Randomizer Round',
        rapidfire: 'Rapid Fire',
        surprise: 'Surprise Round'
    };

    const options = typeOrder.map(type => `
        <option value="${type}">${typeNames[type] || type}</option>
    `).join('');

    elements.typeSelect.innerHTML = options;

    // Try to set to the round's activeType if available
    const activeType = state.rounds[roundId] && state.rounds[roundId].activeType;
    if (activeType && typeOrder.indexOf(activeType) !== -1) {
        elements.typeSelect.value = activeType;
    } else {
        elements.typeSelect.selectedIndex = 0;
    }
}

function updateQuestionDisplay() {
    const round = state.rounds[state.currentRound];
    const questionType = round.activeType;
    const questions = round.questions[questionType];
    const currentQuestion = questions[round.currentQuestion];
    
    // Update question type display
    const typeNames = {
        passable: 'Passable Questions',
        av: 'A/V Round',
        buzzer: 'Buzzer Round',
        randomizer: 'Randomizer Round',
        rapidfire: 'Rapid Fire',
        surprise: 'Surprise Round'
    };
    
    elements.questionType.textContent = typeNames[questionType] || questionType;
    
    if (currentQuestion) {
        elements.questionNumber.textContent = `Question ${round.currentQuestion + 1} of ${questions.length}`;
        elements.questionText.textContent = currentQuestion.text;
        
        // Display options if available
        if (currentQuestion.options && currentQuestion.options.length > 0) {
            elements.questionOptions.innerHTML = currentQuestion.options.map(option => `
                <div class="option-button">${option}</div>
            `).join('');
            
            // Add event listeners to option buttons
            document.querySelectorAll('.option-button').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    // Remove selected class from all options
                    document.querySelectorAll('.option-button').forEach(b => b.classList.remove('selected'));
                    // Add selected class to clicked option
                    e.target.classList.add('selected');
                });
            });
        } else {
            elements.questionOptions.innerHTML = '';
        }
        
        // Set answer (hidden initially)
        elements.questionAnswer.textContent = `Answer: ${currentQuestion.answer}`;
        elements.questionAnswer.classList.remove('revealed');
        
        // Update navigation buttons
        elements.prevQuestion.disabled = round.currentQuestion === 0;
        elements.nextQuestion.disabled = round.currentQuestion === questions.length - 1;
        
        // Update pass button visibility
        elements.passQuestion.style.display = 
            (questionType === 'passable' || questionType === 'av') ? 'inline-block' : 'none';
    } else {
        elements.questionText.textContent = 'No questions available for this round.';
        elements.questionOptions.innerHTML = '';
        elements.questionAnswer.classList.remove('revealed');
        elements.prevQuestion.disabled = true;
        elements.nextQuestion.disabled = true;
    }
}

function previousQuestion() {
    const round = state.rounds[state.currentRound];
    if (round.currentQuestion > 0) {
        round.currentQuestion--;
        updateQuestionDisplay();
        renderDashboard();
    }
}

function nextQuestion() {
    const round = state.rounds[state.currentRound];
    const questions = round.questions[round.activeType];
    
    if (round.currentQuestion < questions.length - 1) {
        round.currentQuestion++;
        updateQuestionDisplay();
        renderDashboard();
    }
}

function revealAnswer() {
    elements.questionAnswer.classList.add('revealed');
}

function passQuestion() {
    const activeTeamButton = document.querySelector('.team-button.active');
    if (activeTeamButton) {
        const teamId = parseInt(activeTeamButton.getAttribute('data-team'));
        const team = state.teams.find(t => t.id === teamId);
        
        if (team) {
            team.score += state.settings.passPoints;
            activeTeamButton.classList.add('correct');
            setTimeout(() => {
                activeTeamButton.classList.remove('correct', 'active');
            }, 2000);
            
            saveState();
            renderDashboard();
            renderScoreboard();
        }
    } else {
        alert('Please select a team first.');
    }
}

// Timer Functions
function startQuestionTimer() {
    stopQuestionTimer();
    
    let timeLeft = parseInt(elements.timerValue.textContent);
    elements.timerValue.style.color = '#f59e0b';
    
    state.timers.question = setInterval(() => {
        timeLeft--;
        elements.timerValue.textContent = timeLeft;
        
        if (timeLeft <= 10) {
            elements.timerValue.style.color = '#ef4444';
            elements.timerValue.style.animation = 'pulse 1s infinite';
        }
        
        if (timeLeft <= 0) {
            stopQuestionTimer();
            elements.timerValue.textContent = "Time's Up!";
            elements.timerValue.style.animation = 'flash 0.5s 3';
        }
    }, 1000);
}

function stopQuestionTimer() {
    if (state.timers.question) {
        clearInterval(state.timers.question);
        state.timers.question = null;
        elements.timerValue.style.animation = '';
    }
}

function resetQuestionTimer() {
    stopQuestionTimer();
    elements.timerValue.textContent = state.settings.defaultTimer;
    elements.timerValue.style.color = '#f59e0b';
    elements.customTimer.value = state.settings.defaultTimer;
}

function setCustomTimer() {
    const customTime = parseInt(elements.customTimer.value);
    if (customTime >= 10 && customTime <= 300) {
        elements.timerValue.textContent = customTime;
        resetQuestionTimer();
    } else {
        alert('Please enter a time between 10 and 300 seconds.');
    }
}

// Scoring Functions
function awardPointsToTeam() {
    const activeTeamButton = document.querySelector('.team-button.active');
    if (activeTeamButton) {
        const teamId = parseInt(activeTeamButton.getAttribute('data-team'));
        const team = state.teams.find(t => t.id === teamId);
        
        if (team) {
            const round = state.rounds[state.currentRound];
            const currentQuestion = round.questions[round.activeType][round.currentQuestion];
            const points = currentQuestion ? currentQuestion.points : state.settings.correctPoints;
            
            team.score += points;
            activeTeamButton.classList.add('correct');
            setTimeout(() => {
                activeTeamButton.classList.remove('correct', 'active');
            }, 2000);
            
            saveState();
            renderDashboard();
            renderScoreboard();
        }
    } else {
        alert('Please select a team first.');
    }
}

function deductPointsFromTeam() {
    const activeTeamButton = document.querySelector('.team-button.active');
    if (activeTeamButton) {
        const teamId = parseInt(activeTeamButton.getAttribute('data-team'));
        const team = state.teams.find(t => t.id === teamId);
        
        if (team) {
            team.score = Math.max(0, team.score - state.settings.penaltyPoints);
            activeTeamButton.classList.add('incorrect');
            setTimeout(() => {
                activeTeamButton.classList.remove('incorrect', 'active');
            }, 2000);
            
            saveState();
            renderDashboard();
            renderScoreboard();
        }
    } else {
        alert('Please select a team first.');
    }
}

// Question Management Functions
function showQuestionModal(editMode = false, questionData = null) {
    elements.questionModal.classList.add('active');
    
    if (editMode && questionData) {
        // Editing existing question
        elements.questionModal.setAttribute('data-edit-mode', 'true');
        elements.questionModal.setAttribute('data-question-id', questionData.id);
        elements.questionModal.setAttribute('data-round', questionData.round);
        elements.questionModal.setAttribute('data-type', questionData.type);
        
        elements.questionTextInput.value = questionData.text;
        elements.questionOptionsInput.value = questionData.options ? questionData.options.join('\n') : '';
        elements.questionAnswerInput.value = questionData.answer;
        elements.questionPoints.value = questionData.points;
        
        // Update modal title
        elements.modalTitle.textContent = 'Edit Question';
    } else {
        // Adding new question
        elements.questionModal.removeAttribute('data-edit-mode');
        elements.questionModal.removeAttribute('data-question-id');
        elements.questionModal.removeAttribute('data-round');
        elements.questionModal.removeAttribute('data-type');
        
        // Clear form
        elements.questionTextInput.value = '';
        elements.questionOptionsInput.value = '';
        elements.questionAnswerInput.value = '';
        elements.questionPoints.value = '10';
        
        // Reset modal title
        elements.modalTitle.textContent = 'Add Question';
    }
}

function hideQuestionModal() {
    elements.questionModal.classList.remove('active');
}

function saveNewQuestion() {
    const isEditMode = elements.questionModal.getAttribute('data-edit-mode') === 'true';
    
    let round, type;
    
    if (isEditMode) {
        // Use stored round and type for editing
        round = elements.questionModal.getAttribute('data-round');
        type = elements.questionModal.getAttribute('data-type');
    } else {
        // Use dropdown values for new questions
        round = elements.roundSelect.value;
        type = elements.typeSelect.value;
    }
    
    const text = elements.questionTextInput.value.trim();
    const answer = elements.questionAnswerInput.value.trim();
    const points = parseInt(elements.questionPoints.value);
    const optionsText = elements.questionOptionsInput.value.trim();
    
    if (!text || !answer) {
        alert('Please fill in both question text and answer.');
        return;
    }
    
    if (isEditMode) {
        // Update existing question
        const questionId = parseInt(elements.questionModal.getAttribute('data-question-id'));
        const questionIndex = state.rounds[round].questions[type].findIndex(q => q.id === questionId);
        
        if (questionIndex !== -1) {
            state.rounds[round].questions[type][questionIndex] = {
                id: questionId,
                text: text,
                answer: answer,
                points: points
            };
            
            if (optionsText) {
                state.rounds[round].questions[type][questionIndex].options = 
                    optionsText.split('\n').map(opt => opt.trim()).filter(opt => opt);
            } else {
                delete state.rounds[round].questions[type][questionIndex].options;
            }
        }
    } else {
        // Add new question
        const newQuestion = {
            id: Date.now(),
            text: text,
            answer: answer,
            points: points
        };
        
        if (optionsText) {
            newQuestion.options = optionsText.split('\n').map(opt => opt.trim()).filter(opt => opt);
        }
        
        state.rounds[round].questions[type].push(newQuestion);
    }
    
    saveState();
    hideQuestionModal();
    renderQuestions();
}

function editQuestion(round, type, id) {
    const question = state.rounds[round].questions[type].find(q => q.id === id);
    if (question) {
        // Add round and type info to question data for editing
        const questionData = {
            ...question,
            round: round,
            type: type
        };
        showQuestionModal(true, questionData);
    }
}

function deleteQuestion(round, type, id) {
    if (confirm('Are you sure you want to delete this question?')) {
        state.rounds[round].questions[type] = state.rounds[round].questions[type].filter(q => q.id !== id);
        saveState();
        renderQuestions();
    }
}

function renderQuestions() {
    const round = elements.roundSelect.value;
    const type = elements.typeSelect.value;
    const questions = state.rounds[round].questions[type];
    
    elements.questionsList.innerHTML = questions.map(question => `
        <div class="question-item">
            <div class="question-header">
                <h4>Question</h4>
                <span class="question-points">${question.points} pts</span>
            </div>
            <div class="question-text">${question.text}</div>
            ${question.options && question.options.length > 0 ? `
                <div class="question-options">
                    <strong>Options:</strong>
                    ${question.options.map(opt => `<div class="option">${opt}</div>`).join('')}
                </div>
            ` : ''}
            <div class="question-answer">Answer: ${question.answer}</div>
            <div class="question-actions">
                <button class="btn-secondary" onclick="editQuestion('${round}', '${type}', ${question.id})">Edit</button>
                <button class="btn-danger" onclick="deleteQuestion('${round}', '${type}', ${question.id})">Delete</button>
            </div>
        </div>
    `).join('');
    
    // Show message if no questions
    if (questions.length === 0) {
        elements.questionsList.innerHTML = `
            <div class="no-questions">
                <p>No questions added yet. Click "Add Question" to get started.</p>
            </div>
        `;
    }
}

// Scoreboard Functions
function renderScoreboard() {
    // This function updates the dashboard scoreboard
    renderDashboard();
}

function renderFullScoreboard() {
    const sortedTeams = [...state.teams].sort((a, b) => b.score - a.score);
    
    elements.fullScoreboard.innerHTML = sortedTeams.map((team, index) => {
        const rank = index + 1;
        const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank;
        
        return `
            <div class="scoreboard-team ${rank <= 3 ? 'top-three' : ''}">
                <div class="team-rank">${medal}</div>
                <div class="team-info">
                    <div class="team-name-large">${team.name}</div>
                </div>
                <div class="team-score-large">${team.score}</div>
            </div>
        `;
    }).join('');
}

function resetScores() {
    if (confirm('Are you sure you want to reset all scores to zero?')) {
        state.teams.forEach(team => team.score = 0);
        saveState();
        renderDashboard();
        renderFullScoreboard();
    }
}

// Settings Functions
function updateSettingsDisplay() {
    elements.defaultTimer.value = state.settings.defaultTimer;
    elements.rapidFireTimer.value = state.settings.rapidFireTimer;
    elements.correctPoints.value = state.settings.correctPoints;
    elements.passPoints.value = state.settings.passPoints;
    elements.penaltyPoints.value = state.settings.penaltyPoints;
    
    // Also update timer display
    elements.timerValue.textContent = state.settings.defaultTimer;
    elements.customTimer.value = state.settings.defaultTimer;
}

function saveSettings() {
    state.settings.defaultTimer = parseInt(elements.defaultTimer.value);
    state.settings.rapidFireTimer = parseInt(elements.rapidFireTimer.value);
    state.settings.correctPoints = parseInt(elements.correctPoints.value);
    state.settings.passPoints = parseInt(elements.passPoints.value);
    state.settings.penaltyPoints = parseInt(elements.penaltyPoints.value);
    
    saveState();
    updateSettingsDisplay();
    alert('Settings saved successfully!');
}

// Data Management Functions
function exportData() {
    const dataStr = JSON.stringify(state, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `quiz-competition-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function importData() {
    const file = elements.importFile.files[0];
    if (!file) {
        alert('Please select a file to import.');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedState = JSON.parse(e.target.result);
            Object.assign(state, importedState);
            saveState();
            init(); // Reinitialize with new data
            alert('Data imported successfully!');
        } catch (error) {
            alert('Error importing data: ' + error.message);
        }
    };
    reader.readAsText(file);
}

function resetCompetition() {
    if (confirm('Are you sure you want to reset the entire competition? This will delete all teams, scores, and questions.')) {
        localStorage.removeItem('quizCompetitionState');
        // Reload the page to reset everything
        location.reload();
    }
}

// Rapid Fire Functions
function startRapidFire() {
    const activeTeamButton = document.querySelector('.team-button.active');
    if (!activeTeamButton) {
        alert('Please select a team for the rapid fire round.');
        return;
    }
    
    const teamId = parseInt(activeTeamButton.getAttribute('data-team'));
    state.rapidFire.currentTeam = state.teams.find(t => t.id === teamId);
    state.rapidFire.active = true;
    state.rapidFire.timeLeft = state.settings.rapidFireTimer * 60;
    state.rapidFire.correct = 0;
    state.rapidFire.incorrect = 0;
    
    updateRapidFireDisplay();
    elements.rapidFireModal.classList.add('active');
    
    // Start the timer
    state.timers.rapidFire = setInterval(() => {
        state.rapidFire.timeLeft--;
        updateRapidFireDisplay();
        
        if (state.rapidFire.timeLeft <= 0) {
            stopRapidFire();
            alert(`Time's up! ${state.rapidFire.currentTeam.name} got ${state.rapidFire.correct} correct answers.`);
        }
    }, 1000);
}

function stopRapidFire() {
    if (state.timers.rapidFire) {
        clearInterval(state.timers.rapidFire);
        state.timers.rapidFire = null;
    }
    state.rapidFire.active = false;
}

function hideRapidFireModal() {
    elements.rapidFireModal.classList.remove('active');
    stopRapidFire();
}

function updateRapidFireDisplay() {
    const minutes = Math.floor(state.rapidFire.timeLeft / 60);
    const seconds = state.rapidFire.timeLeft % 60;
    elements.rapidFireTimerValue.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    elements.rapidFireCorrect.textContent = state.rapidFire.correct;
    elements.rapidFireIncorrect.textContent = state.rapidFire.incorrect;
}

function markRapidFireCorrect() {
    if (state.rapidFire.active && state.rapidFire.currentTeam) {
        state.rapidFire.correct++;
        state.rapidFire.currentTeam.score += 5; // Fixed points for rapid fire
        updateRapidFireDisplay();
        saveState();
        renderDashboard();
        renderScoreboard();
    }
}

function markRapidFireIncorrect() {
    if (state.rapidFire.active) {
        state.rapidFire.incorrect++;
        updateRapidFireDisplay();
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);