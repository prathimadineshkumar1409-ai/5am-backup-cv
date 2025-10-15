// CodeVerse Onboarding System - 5 Question Personalized Learning Profile

class OnboardingManager {
    constructor() {
        this.currentQuestion = 0;
        this.answers = {};
        this.questions = [
            {
                id: 'skill_gap',
                title: 'Course Skill Gap',
                question: 'I understand the theory of CS concepts, but struggle most with...',
                options: [
                    {
                        value: 'coding',
                        text: 'A. Translating the idea into code.',
                        focus: 'Coding Terminal',
                        icon: '💻'
                    },
                    {
                        value: 'explaining',
                        text: 'B. Explaining the idea clearly to others.',
                        focus: 'Quizzes/Review',
                        icon: '📝'
                    },
                    {
                        value: 'designing',
                        text: 'C. Designing the solution before coding.',
                        focus: 'Game Simulation',
                        icon: '🎮'
                    },
                    {
                        value: 'all',
                        text: 'D. I struggle equally with all parts.',
                        focus: 'Balanced approach',
                        icon: '⚖️'
                    }
                ]
            },
            {
                id: 'learning_pace',
                title: 'Learning Pace and Review',
                question: 'When learning a new, tough concept, my ideal pace is...',
                options: [
                    {
                        value: 'fast',
                        text: 'A. Fast! Give me the full theory and code.',
                        focus: 'Minimize video/explanation',
                        icon: '⚡'
                    },
                    {
                        value: 'steady',
                        text: 'B. Steady. Mix short video, quiz, then code.',
                        focus: 'Default blended pace',
                        icon: '🎯'
                    },
                    {
                        value: 'slow',
                        text: 'C. Slow. I need analogies and deep conceptual breaks.',
                        focus: 'Maximize Tutor dialogue',
                        icon: '🐢'
                    },
                    {
                        value: 'trial',
                        text: 'D. I learn best by Trial and Error.',
                        focus: 'Game First',
                        icon: '🎲'
                    }
                ]
            },
            {
                id: 'motivation',
                title: 'Motivation and Career Goal',
                question: 'My primary goal for using CodeVerse is to...',
                options: [
                    {
                        value: 'exams',
                        text: 'A. Pass university exams/get high grades.',
                        focus: 'Academic focus',
                        icon: '📚'
                    },
                    {
                        value: 'interviews',
                        text: 'B. Ace technical interviews/ATS checks.',
                        focus: 'Unlock Add-Ons first',
                        icon: '💼'
                    },
                    {
                        value: 'projects',
                        text: 'C. Complete my portfolio/side projects.',
                        focus: 'Project-based learning',
                        icon: '🚀'
                    },
                    {
                        value: 'language',
                        text: 'D. Learn a new language (e.g., Python/Java).',
                        focus: 'Language-specific path',
                        icon: '🔤'
                    }
                ]
            },
            {
                id: 'learning_medium',
                title: 'Preferred Learning Medium',
                question: 'When reviewing a topic, I retain information best by...',
                options: [
                    {
                        value: 'reading',
                        text: 'A. Reading detailed documentation/scripts.',
                        focus: 'Text emphasis',
                        icon: '📖'
                    },
                    {
                        value: 'watching',
                        text: 'B. Watching short animated explanations.',
                        focus: 'Video emphasis',
                        icon: '🎥'
                    },
                    {
                        value: 'listening',
                        text: 'C. Listening to the concept being explained.',
                        focus: 'TTS/Voice emphasis',
                        icon: '🎧'
                    },
                    {
                        value: 'doing',
                        text: 'D. Doing a quick interactive quiz/test.',
                        focus: 'Quiz emphasis',
                        icon: '✍️'
                    }
                ]
            },
            {
                id: 'coding_comfort',
                title: 'Existing Programming Comfort',
                question: 'How would you rate your comfort level with general coding?',
                options: [
                    {
                        value: 'beginner',
                        text: 'A. I\'m a total beginner (No prior coding).',
                        focus: 'Start with HTML/CSS/JS/Python Basics',
                        icon: '🌱'
                    },
                    {
                        value: 'basics',
                        text: 'B. I know the basics (Loops, If/Else).',
                        focus: 'Start with OOP/DSA/CN',
                        icon: '🌿'
                    },
                    {
                        value: 'proficient',
                        text: 'C. I\'m proficient (Comfortable with classes/APIs).',
                        focus: 'Start with DSA/AIML/Cloud',
                        icon: '🌳'
                    },
                    {
                        value: 'theory',
                        text: 'D. I only focus on theory (Non-coding subjects only).',
                        focus: 'Prioritize OS, CN, COA theory',
                        icon: '📐'
                    }
                ]
            }
        ];
    }

    initialize() {
        this.renderQuestion();
        this.setupEventListeners();
    }

    renderQuestion() {
        const question = this.questions[this.currentQuestion];
        const container = document.getElementById('onboarding-container');
        
        container.innerHTML = `
            <div class="max-w-4xl mx-auto">
                <!-- Progress Bar -->
                <div class="mb-8">
                    <div class="flex justify-between mb-2">
                        <span class="text-sm text-gray-400">Question ${this.currentQuestion + 1} of ${this.questions.length}</span>
                        <span class="text-sm text-purple-400">${Math.round(((this.currentQuestion) / this.questions.length) * 100)}% Complete</span>
                    </div>
                    <div class="w-full bg-gray-700 rounded-full h-2">
                        <div class="bg-gradient-animated h-2 rounded-full transition-all duration-500" 
                             style="width: ${((this.currentQuestion) / this.questions.length) * 100}%"></div>
                    </div>
                </div>

                <!-- Question Card -->
                <div class="card p-8 mb-6 scale-up">
                    <h2 class="text-3xl font-bold text-white mb-2">${question.title}</h2>
                    <p class="text-xl text-gray-300 mb-8">${question.question}</p>
                    
                    <!-- Options -->
                    <div class="space-y-4">
                        ${question.options.map((option, index) => `
                            <div class="option-card p-6 rounded-lg cursor-pointer transition-all duration-300 
                                        bg-gray-800 hover:bg-purple-900/40 border-2 border-transparent hover:border-purple-500
                                        stagger-item" 
                                 data-value="${option.value}"
                                 style="animation-delay: ${index * 0.1}s">
                                <div class="flex items-center">
                                    <span class="text-4xl mr-4">${option.icon}</span>
                                    <div class="flex-1">
                                        <p class="text-lg font-semibold text-white mb-1">${option.text}</p>
                                        <p class="text-sm text-gray-400">Focus: ${option.focus}</p>
                                    </div>
                                    <div class="option-check hidden">
                                        <svg class="w-8 h-8 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Navigation Buttons -->
                <div class="flex justify-between">
                    <button id="back-btn" 
                            class="px-6 py-3 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-all
                                   ${this.currentQuestion === 0 ? 'invisible' : ''}"
                            ${this.currentQuestion === 0 ? 'disabled' : ''}>
                        ← Back
                    </button>
                    <button id="next-btn" 
                            class="px-8 py-3 rounded-lg btn-primary font-semibold disabled:opacity-50 disabled:cursor-not-allowed
                                   ripple-button"
                            disabled>
                        ${this.currentQuestion === this.questions.length - 1 ? 'Complete Profile →' : 'Next →'}
                    </button>
                </div>
            </div>
        `;

        this.attachOptionListeners();
    }

    attachOptionListeners() {
        const options = document.querySelectorAll('.option-card');
        const nextBtn = document.getElementById('next-btn');
        const backBtn = document.getElementById('back-btn');

        options.forEach(option => {
            option.addEventListener('click', () => {
                // Remove selection from all options
                options.forEach(opt => {
                    opt.classList.remove('border-purple-500', 'bg-purple-900/40');
                    opt.querySelector('.option-check').classList.add('hidden');
                });

                // Add selection to clicked option
                option.classList.add('border-purple-500', 'bg-purple-900/40');
                option.querySelector('.option-check').classList.remove('hidden');

                // Store answer
                const questionId = this.questions[this.currentQuestion].id;
                this.answers[questionId] = option.dataset.value;

                // Enable next button
                nextBtn.disabled = false;
            });
        });

        nextBtn.addEventListener('click', () => this.nextQuestion());
        if (backBtn) {
            backBtn.addEventListener('click', () => this.previousQuestion());
        }
    }

    setupEventListeners() {
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !document.getElementById('next-btn').disabled) {
                this.nextQuestion();
            }
        });
    }

    nextQuestion() {
        if (this.currentQuestion < this.questions.length - 1) {
            this.currentQuestion++;
            this.renderQuestion();
        } else {
            this.completeOnboarding();
        }
    }

    previousQuestion() {
        if (this.currentQuestion > 0) {
            this.currentQuestion--;
            this.renderQuestion();
        }
    }

    async completeOnboarding() {
        // Show loading state
        const container = document.getElementById('onboarding-container');
        container.innerHTML = `
            <div class="flex flex-col items-center justify-center min-h-[400px]">
                <div class="spinner mb-4"></div>
                <p class="text-xl text-purple-400">Analyzing your learning profile...</p>
                <p class="text-sm text-gray-400 mt-2">Creating personalized recommendations</p>
            </div>
        `;

        // Generate recommendations based on answers
        const recommendations = this.generateRecommendations();

        // Save to user profile
        window.currentUserData.learningProfile = {
            answers: this.answers,
            recommendations: recommendations,
            completedAt: Date.now()
        };

        await window.saveUserData();

        // Show results
        setTimeout(() => {
            this.showRecommendations(recommendations);
        }, 2000);
    }

    generateRecommendations() {
        const recommendations = {
            recommendedCourses: [],
            learningStyle: '',
            focusAreas: [],
            startingLevel: ''
        };

        // Determine recommended courses based on coding comfort
        switch (this.answers.coding_comfort) {
            case 'beginner':
                recommendations.recommendedCourses = ['html-css-js', 'python-basics', 'java-basics'];
                recommendations.startingLevel = 'beginner';
                break;
            case 'basics':
                recommendations.recommendedCourses = ['oops', 'dsa', 'cn', 'dbms'];
                recommendations.startingLevel = 'intermediate';
                break;
            case 'proficient':
                recommendations.recommendedCourses = ['dsa', 'daa', 'aiml', 'cloud'];
                recommendations.startingLevel = 'advanced';
                break;
            case 'theory':
                recommendations.recommendedCourses = ['os', 'cn', 'coa', 'dbms'];
                recommendations.startingLevel = 'theory-focused';
                break;
        }

        // Determine learning style
        const styleMap = {
            fast: 'Fast-paced learner',
            steady: 'Balanced learner',
            slow: 'Deep conceptual learner',
            trial: 'Hands-on learner'
        };
        recommendations.learningStyle = styleMap[this.answers.learning_pace] || 'Balanced learner';

        // Determine focus areas
        const focusMap = {
            coding: 'Coding Practice',
            explaining: 'Conceptual Understanding',
            designing: 'Problem Solving',
            all: 'Comprehensive Learning'
        };
        recommendations.focusAreas.push(focusMap[this.answers.skill_gap]);

        // Add motivation-based focus
        const motivationMap = {
            exams: 'Academic Excellence',
            interviews: 'Interview Preparation',
            projects: 'Project Development',
            language: 'Language Mastery'
        };
        recommendations.focusAreas.push(motivationMap[this.answers.motivation]);

        // Add learning medium preference
        const mediumMap = {
            reading: 'Text-based Learning',
            watching: 'Video-based Learning',
            listening: 'Audio-based Learning',
            doing: 'Interactive Learning'
        };
        recommendations.focusAreas.push(mediumMap[this.answers.learning_medium]);

        return recommendations;
    }

    showRecommendations(recommendations) {
        const container = document.getElementById('onboarding-container');
        
        const courseNames = {
            'html-css-js': 'HTML, CSS & JavaScript',
            'python-basics': 'Python Basics',
            'java-basics': 'Java Basics',
            'oops': 'Object-Oriented Programming',
            'dsa': 'Data Structures & Algorithms',
            'daa': 'Design & Analysis of Algorithms',
            'cn': 'Computer Networks',
            'dbms': 'Database Management Systems',
            'os': 'Operating Systems',
            'coa': 'Computer Organization & Architecture',
            'aiml': 'AI & Machine Learning',
            'cloud': 'Cloud Computing'
        };

        container.innerHTML = `
            <div class="max-w-4xl mx-auto">
                <div class="text-center mb-8 zoom-in">
                    <div class="text-6xl mb-4">🎉</div>
                    <h2 class="text-4xl font-bold text-white mb-2">Profile Complete!</h2>
                    <p class="text-xl text-gray-300">Here's your personalized learning path</p>
                </div>

                <!-- Learning Style -->
                <div class="card p-6 mb-6 slide-in-left">
                    <h3 class="text-2xl font-bold text-purple-400 mb-4">📊 Your Learning Style</h3>
                    <p class="text-xl text-white">${recommendations.learningStyle}</p>
                    <p class="text-sm text-gray-400 mt-2">Starting Level: ${recommendations.startingLevel}</p>
                </div>

                <!-- Recommended Courses -->
                <div class="card p-6 mb-6 slide-in-right">
                    <h3 class="text-2xl font-bold text-green-400 mb-4">🎯 Recommended Courses</h3>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        ${recommendations.recommendedCourses.map((course, index) => `
                            <div class="bg-gray-800 p-4 rounded-lg text-center stagger-item" style="animation-delay: ${index * 0.1}s">
                                <p class="text-lg font-semibold text-white">${courseNames[course]}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Focus Areas -->
                <div class="card p-6 mb-8 fade-in">
                    <h3 class="text-2xl font-bold text-yellow-400 mb-4">🎓 Your Focus Areas</h3>
                    <div class="space-y-2">
                        ${recommendations.focusAreas.map((area, index) => `
                            <div class="flex items-center stagger-item" style="animation-delay: ${index * 0.1}s">
                                <svg class="w-6 h-6 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                                </svg>
                                <span class="text-white">${area}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Start Button -->
                <div class="text-center">
                    <button onclick="window.setView('dashboard')" 
                            class="btn-primary px-12 py-4 rounded-lg text-xl font-bold ripple-button pulse-animation">
                        Start Learning! 🚀
                    </button>
                </div>
            </div>
        `;
    }
}

// Initialize onboarding manager
window.onboardingManager = new OnboardingManager();
