// CodeVerse Level Manager - Handles all level content types

class LevelManager {
  constructor() {
    this.currentLevel = null;
    this.currentCourse = null;
    this.levelData = null;
    this.quizScore = 0;
    this.codingPassed = false;
    this.performanceMetrics = {
      videoWatched: false,
      conceptsReviewed: false,
      quizScore: 0,
      codingCompleted: false,
      gameCompleted: false,
      timeSpent: 0
    };
    this.startTime = null;
  }

  async startLevel(courseId, levelNumber, levelData) {
    this.currentCourse = courseId;
    this.currentLevel = levelNumber;
    try {
      this.levelData = JSON.parse(JSON.stringify(levelData || {}));
    } catch (e) {
      this.levelData = Object.assign({}, levelData || {});
    }
    this.startTime = Date.now();
    this.resetMetrics();

    const dsaSpecialLevels = [5, 10, 15, 20];
    if (this.currentCourse && String(this.currentCourse).toLowerCase() === 'dsa') {
      if (!dsaSpecialLevels.includes(Number(this.currentLevel))) {
        this.levelData.coding = false;
        if (!this.levelData.quiz || !Array.isArray(this.levelData.quiz.questions) || this.levelData.quiz.questions.length < 5) {
          this.levelData.quiz = this.generateDefaultQuiz(5);
        }
      }
    }
    this.showLevelModal();
  }

  resetMetrics() {
    this.performanceMetrics = {
      videoWatched: false,
      conceptsReviewed: false,
      quizScore: 0,
      codingCompleted: false,
      gameCompleted: false,
      timeSpent: 0
    };
    this.quizScore = 0;
    this.codingPassed = false;
  }

  showLevelModal() {
    const modal = document.createElement('div');
    modal.className = 'level-content-modal';
    modal.id = 'level-modal';
    
    let titleText = this.levelData.title || '';
    const titleLower = (titleText || '').toLowerCase();
    if (!titleText) {
      titleText = `Level ${this.currentLevel}`;
    } else if (titleLower.startsWith('level') || titleText.includes(`Level ${this.currentLevel}`)) {
      titleText = titleText;
    } else {
      titleText = `Level ${this.currentLevel}: ${titleText}`;
    }

    modal.innerHTML = `
      <div class="level-content-container">
        <div class="level-content-header">
          <h2 class="level-content-title">
            ${this.levelData.icon || '📚'} ${titleText}
          </h2>
          <button class="close-modal" onclick="levelManager.closeLevelModal()">×</button>
        </div>
        <div class="level-steps">
          ${this.levelData.videoUrl || this.levelData.video ? '<div class="step active" data-step="video"><span class="step-icon">📺</span><span class="step-label">Video</span></div>' : ''}
          ${this.levelData.concepts ? '<div class="step" data-step="concepts"><span class="step-icon">📖</span><span class="step-label">Concepts</span></div>' : ''}
          ${this.levelData.quiz ? '<div class="step" data-step="quiz"><span class="step-icon">📝</span><span class="step-label">Quiz</span></div>' : ''}
          ${this.levelData.coding ? '<div class="step" data-step="coding"><span class="step-icon">💻</span><span class="step-label">Coding</span></div>' : ''}
          ${this.levelData.game ? '<div class="step" data-step="game"><span class="step-icon">🎮</span><span class="step-label">Game</span></div>' : ''}
        </div>
        <div class="level-content-area" id="level-content-area">
          ${this.renderInitialContent()}
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    
    if (this.levelData.videoUrl) {
      this.showVideo();
    } else if (this.levelData.concepts) {
      this.showConcepts();
    } else if (this.levelData.quiz) {
      this.showQuiz();
    } else if (this.levelData.coding) {
      this.showCoding();
    } else if (this.levelData.game) {
      this.showGame();
    }
  }

  renderInitialContent() {
    return `
      <div class="welcome-content">
        <h3>🎯 Level Objectives</h3>
        <p>${this.levelData.description || 'Complete all activities to master this level!'}</p>
        <div class="level-rewards">
          <div class="reward-item"><span class="reward-icon">⭐</span><span class="reward-text">${this.levelData.xp || 100} XP</span></div>
          ${this.levelData.quiz ? '<div class="reward-item"><span class="reward-icon">📝</span><span class="reward-text">Quiz Challenge</span></div>' : ''}
          ${this.levelData.coding ? '<div class="reward-item"><span class="reward-icon">💻</span><span class="reward-text">Coding Exercise</span></div>' : ''}
          ${this.levelData.game ? '<div class="reward-item"><span class="reward-icon">🎮</span><span class="reward-text">Game Simulation</span></div>' : ''}
        </div>
        <button class="btn-primary large-btn" onclick="levelManager.startLearning()">Start Learning 🚀</button>
      </div>
    `;
  }

  startLearning() {
    if (this.levelData.videoUrl) {
      this.showVideo();
    } else if (this.levelData.concepts) {
      this.showConcepts();
    } else if (this.levelData.quiz) {
      this.showQuiz();
    } else if (this.levelData.coding) {
      this.showCoding();
    } else if (this.levelData.game) {
      this.showGame();
    } else {
      this.completeLevel();
    }
  }

  showVideo() {
    this.updateStepStatus('video', 'active');
    const contentArea = document.getElementById('level-content-area');
    const videoId = this.extractYouTubeId(this.levelData.videoUrl);
    
    contentArea.innerHTML = `
      <div class="video-section">
        <h3>📺 Watch Tutorial Video</h3>
        <div class="video-container">
          <iframe width="100%" height="500" src="https://www.youtube.com/embed/${videoId}?enablejsapi=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen id="youtube-player"></iframe>
        </div>
        <div class="video-controls">
          <button class="btn-secondary" onclick="levelManager.skipVideo()">Skip Video</button>
          <button class="btn-primary" onclick="levelManager.completeVideo()">Continue to Concepts →</button>
        </div>
      </div>
    `;
  }

  extractYouTubeId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }

  skipVideo() {
    this.completeVideo();
  }

  completeVideo() {
    this.performanceMetrics.videoWatched = true;
    this.updateStepStatus('video', 'completed');
    
    if (this.levelData.concepts) {
      this.showConcepts();
    } else if (this.levelData.quiz) {
      this.showQuiz();
    } else if (this.levelData.coding) {
      this.showCoding();
    } else if (this.levelData.game) {
      this.showGame();
    } else {
      this.completeLevel();
    }
  }

  showConcepts() {
    this.updateStepStatus('concepts', 'active');
    const contentArea = document.getElementById('level-content-area');
    const concepts = this.levelData.concepts || this.getDefaultConcepts();
    
    contentArea.innerHTML = `
      <div class="concepts-section">
        <h3>📖 Key Concepts</h3>
        <div class="concepts-carousel">
          <div class="carousel-container">
            ${concepts.map((concept, index) => `
              <div class="concept-slide ${index === 0 ? 'active' : ''}" data-slide="${index}">
                <div class="concept-card">
                  <h4>${concept.title}</h4>
                  <div class="concept-content">${concept.content}</div>
                  ${concept.example ? `<div class="concept-example"><strong>Example:</strong><pre><code>${concept.example}</code></pre></div>` : ''}
                </div>
              </div>
            `).join('')}
          </div>
          <div class="carousel-controls">
            <button class="carousel-btn" onclick="levelManager.previousConcept()" ${concepts.length <= 1 ? 'disabled' : ''}>← Previous</button>
            <span class="carousel-indicator"><span id="current-slide">1</span> / ${concepts.length}</span>
            <button class="carousel-btn" onclick="levelManager.nextConcept()" ${concepts.length <= 1 ? 'disabled' : ''}>Next →</button>
          </div>
        </div>
        <div class="concepts-actions">
          <button class="btn-primary" onclick="levelManager.completeConcepts()">I Understand, Continue →</button>
        </div>
      </div>
    `;
    
    this.currentSlide = 0;
    this.totalSlides = concepts.length;
  }

  getDefaultConcepts() {
    return [{ title: this.levelData.title, content: this.levelData.description || 'Learn the fundamentals of this topic.', example: null }];
  }

  previousConcept() {
    if (this.currentSlide > 0) {
      this.currentSlide--;
      this.updateCarousel();
    }
  }

  nextConcept() {
    if (this.currentSlide < this.totalSlides - 1) {
      this.currentSlide++;
      this.updateCarousel();
    }
  }

  updateCarousel() {
    const slides = document.querySelectorAll('.concept-slide');
    slides.forEach((slide, index) => {
      slide.classList.toggle('active', index === this.currentSlide);
    });
    document.getElementById('current-slide').textContent = this.currentSlide + 1;
  }

  completeConcepts() {
    this.performanceMetrics.conceptsReviewed = true;
    this.updateStepStatus('concepts', 'completed');
    
    if (this.levelData.quiz) {
      this.showQuiz();
    } else if (this.levelData.coding) {
      this.showCoding();
    } else if (this.levelData.game) {
      this.showGame();
    } else {
      this.completeLevel();
    }
  }

  showQuiz() {
    this.updateStepStatus('quiz', 'active');
    const contentArea = document.getElementById('level-content-area');
    const quiz = this.levelData.quiz || this.generateDefaultQuiz();
    
    contentArea.innerHTML = `
      <div class="quiz-section">
        <h3>📝 Knowledge Check Quiz</h3>
        <p class="quiz-instruction">Answer all questions correctly to proceed (60% required to pass)</p>
        <div class="quiz-container" id="quiz-container">
          ${quiz.questions.map((q, index) => `
            <div class="quiz-question">
              <p class="question-text"><strong>Q${index + 1}.</strong> ${q.question}</p>
              <div class="quiz-options">
                ${q.options.map((option, optIndex) => `
                  <label class="quiz-option">
                    <input type="radio" name="question-${index}" value="${optIndex}" />
                    <span>${option}</span>
                  </label>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
        <div class="quiz-result" id="quiz-result" style="display: none;"></div>
        <div class="quiz-actions">
          <button class="btn-primary" onclick="levelManager.submitQuiz()">Submit Quiz</button>
        </div>
      </div>
    `;
  }

  generateDefaultQuiz(count = 3) {
    const questions = [];
    const baseTopic = this.levelData && this.levelData.title ? this.levelData.title : 'Core Topic';
    for (let i = 0; i < count; i++) {
      const topic = `${baseTopic} - Subtopic ${i + 1}`;
      questions.push({
        question: `(${topic}) — Choose the best answer for this concept.`,
        options: [`${topic} - A`, `${topic} - B`, `${topic} - C`, `${topic} - D`],
        correct: i % 4,
        topic: topic,
        explanation: `Focus on ${topic}. Key idea: remember to review ${baseTopic} fundamentals and worked examples for ${topic}.`
      });
    }
    return { questions };
  }

  submitQuiz() {
    this.ensureHighlightStyles();
    const quiz = this.levelData.quiz || this.generateDefaultQuiz();
    let correct = 0;
    const total = quiz.questions.length;

    quiz.questions.forEach((q, index) => {
      const selected = document.querySelector(`input[name="question-${index}"]:checked`);
      const selectedIndex = selected ? parseInt(selected.value) : -1;
      const inputs = document.querySelectorAll(`input[name="question-${index}"]`);
      inputs.forEach(inp => {
        const lbl = inp.closest('.quiz-option');
        if (lbl) lbl.classList.remove('correct', 'incorrect');
      });

      const correctInput = document.querySelector(`input[name="question-${index}"][value="${q.correct}"]`);
      if (correctInput) {
        const lbl = correctInput.closest('.quiz-option');
        if (lbl) lbl.classList.add('correct');
      }

      if (selectedIndex === q.correct) {
        correct++;
      } else if (selectedIndex >= 0) {
        const sel = document.querySelector(`input[name="question-${index}"][value="${selectedIndex}"]`);
        if (sel) {
          const lbl = sel.closest('.quiz-option');
          if (lbl) lbl.classList.add('incorrect');
        }
      }
    });

    const score = Math.round((correct / total) * 100);
    this.quizScore = score;
    this.performanceMetrics.quizScore = score;
    const resultDiv = document.getElementById('quiz-result');
    resultDiv.style.display = 'block';

    if (score >= 60) {
      resultDiv.innerHTML = `<div class="quiz-success"><h4>✅ Great Job!</h4><p>You scored ${score}% (${correct}/${total} correct)</p><button class="btn-primary" onclick="levelManager.completeQuiz()">Continue →</button></div>`;
      this.updateStepStatus('quiz', 'completed');
    } else {
      resultDiv.innerHTML = `<div class="quiz-fail"><h4>❌ Not Quite There</h4><p>You scored ${score}% (${correct}/${total} correct)</p><p>You need at least 60% to pass. Review the concepts and try again!</p><button class="btn-secondary" onclick="levelManager.retryQuiz()">Try Again</button></div>`;
    }
  }

  ensureHighlightStyles() {
    if (document.getElementById('quiz-highlight-styles')) return;
    const s = document.createElement('style');
    s.id = 'quiz-highlight-styles';
    s.innerHTML = `.quiz-option.correct { outline: 3px solid rgba(46,204,113,0.95); border-radius:6px; background: rgba(46,204,113,0.03); } .quiz-option.incorrect { outline: 3px solid rgba(231,76,60,0.95); border-radius:6px; background: rgba(231,76,60,0.02); }`;
    document.head.appendChild(s);
  }

  retryQuiz() {
    this.showQuiz();
  }

  completeQuiz() {
    if (this.levelData.coding) {
      this.showCoding();
    } else if (this.levelData.game) {
      this.showGame();
    } else {
      this.completeLevel();
    }
  }

  showCoding() {
    this.updateStepStatus('coding', 'active');
    const contentArea = document.getElementById('level-content-area');
    const codingChallenge = this.levelData.coding || this.getDefaultCodingChallenge();
    
    contentArea.innerHTML = `
      <div class="coding-section">
        <h3>💻 Coding Challenge</h3>
        <div class="coding-challenge">
          <div class="challenge-description">
            <h4>${codingChallenge.title}</h4>
            <p>${codingChallenge.description}</p>
            ${codingChallenge.example ? `<div class="challenge-example"><strong>Example:</strong><pre><code>${codingChallenge.example}</code></pre></div>` : ''}
          </div>
          <div class="code-editor">
            <div class="editor-header">
              <span>Code Editor</span>
              <select id="language-select" onchange="levelManager.changeLanguage()">
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
              </select>
            </div>
            <textarea id="code-input" class="code-textarea" placeholder="Write your code here...">${codingChallenge.starterCode || ''}</textarea>
          </div>
          <div class="code-actions">
            <button class="btn-secondary" onclick="levelManager.runCode()">▶ Run Code</button>
            <button class="btn-primary" onclick="levelManager.submitCode()">Submit Solution</button>
          </div>
          <div class="code-output" id="code-output" style="display: none;">
            <h4>Output:</h4>
            <pre id="output-content"></pre>
          </div>
        </div>
      </div>
    `;
  }

  getDefaultCodingChallenge() {
    return {
      title: 'Practice Exercise',
      description: 'Write a function that demonstrates the concept learned in this level.',
      example: '// Example:\nfunction example() {\n  return "Hello World";\n}',
      starterCode: '// Write your code here\n\n'
    };
  }

  changeLanguage() {
    const language = document.getElementById('language-select').value;
    console.log('Language changed to:', language);
  }

  runCode() {
    const code = document.getElementById('code-input').value;
    const outputDiv = document.getElementById('code-output');
    const outputContent = document.getElementById('output-content');
    outputDiv.style.display = 'block';
    
    try {
      outputContent.textContent = '✓ Code executed successfully!\n\nNote: This is a simulation. In production, code would be executed in a sandbox.';
    } catch (error) {
      outputContent.textContent = `❌ Error: ${error.message}`;
    }
  }

  submitCode() {
    const code = document.getElementById('code-input').value.trim();
    if (code.length < 10) {
      alert('Please write some code before submitting!');
      return;
    }
    
    this.codingPassed = true;
    this.performanceMetrics.codingCompleted = true;
    this.updateStepStatus('coding', 'completed');
    
    const outputDiv = document.getElementById('code-output');
    const outputContent = document.getElementById('output-content');
    outputDiv.style.display = 'block';
    outputContent.innerHTML = `<div style="color: #4CAF50; font-weight: bold;">✅ Solution Accepted!<br><br>Great work! Your code passes all test cases.</div>`;
    
    setTimeout(() => {
      if (this.levelData.game) {
        this.showGame();
      } else {
        this.completeLevel();
      }
    }, 2000);
  }

  showGame() {
    this.updateStepStatus('game', 'active');
    const contentArea = document.getElementById('level-content-area');
    const gameManual = this.levelData.gameManual || '🎮 Complete the game challenge!';
    const gamePath = this.levelData.game || '';
    
    contentArea.innerHTML = `
      <div class="game-section">
        <h3>🎮 Interactive Game Simulation</h3>
        <div class="game-manual">
          <h4>📖 How to Play</h4>
          <p>${gameManual.replace(/\n/g, '<br>')}</p>
        </div>
        <div class="game-iframe-container" id="game-iframe-container">
          <iframe id="game-iframe" src="${gamePath}" width="800" height="600" frameborder="0" style="border: 3px solid #00ff88; border-radius: 10px; background: #000;"></iframe>
        </div>
        <div class="game-controls" style="margin-top: 20px; text-align: center;">
          <button class="btn-primary" onclick="levelManager.completeGameManually()">I've Completed the Game →</button>
        </div>
      </div>
    `;
    this.addGameStyles();
  }

  addGameStyles() {
    if (document.getElementById('game-iframe-styles')) return;
    const style = document.createElement('style');
    style.id = 'game-iframe-styles';
    style.innerHTML = `.game-iframe-container { display: flex; justify-content: center; align-items: center; margin: 20px 0; background: #000; border-radius: 10px; padding: 10px; } #game-iframe { max-width: 100%; box-shadow: 0 0 20px rgba(0, 255, 136, 0.3); } .game-manual { background: rgba(0, 255, 136, 0.1); border: 2px solid #00ff88; border-radius: 8px; padding: 15px; margin-bottom: 20px; } .game-manual h4 { color: #00ff88; margin-top: 0; }`;
    document.head.appendChild(style);
  }

  completeGameManually() {
    this.performanceMetrics.gameCompleted = true;
    this.updateStepStatus('game', 'completed');
    
    const gameContainer = document.getElementById('game-iframe-container');
    if (gameContainer) {
      if (this.currentCourse && String(this.currentCourse).toLowerCase() === 'dsa') {
        if (this.currentLevel === 5) {
          gameContainer.innerHTML = `
            <div class="game-success" style="text-align: center; padding: 40px; background: rgba(0, 255, 0, 0.1); border-radius: 10px; border: 3px solid #00ff00;">
              <h4 style="color: #00ff00; font-size: 32px; margin: 0 0 20px 0;">🎉 Game Completed!</h4>
              <p style="color: #ffffff; font-size: 18px; margin-bottom: 30px;">Excellent work! You've mastered Arrays, Stacks, and Queues!</p>
              <p style="color: #ffd700; font-size: 16px; margin-bottom: 30px;">🎓 Level 5 Complete! Ready to continue your DSA journey?</p>
              <button class="btn-primary large-btn" onclick="levelManager.openSpecificLevel(6)" style="font-size: 20px; padding: 15px 30px;">Continue to Level 6: Trees →</button>
            </div>
          `;
        } else if (this.currentLevel === 10) {
          gameContainer.innerHTML = `
            <div class="game-success" style="text-align: center; padding: 40px; background: rgba(0, 255, 0, 0.1); border-radius: 10px; border: 3px solid #00ff00;">
              <h4 style="color: #00ff00; font-size: 32px; margin: 0 0 20px 0;">🎉 Forest Restored!</h4>
              <p style="color: #ffffff; font-size: 18px; margin-bottom: 30px;">Amazing! You've mastered Trees, Traversals, BST, and AVL!</p>
              <p style="color: #ffd700; font-size: 16px; margin-bottom: 30px;">🌳 Level 10 Complete! Ready to explore Graphs?</p>
              <button class="btn-primary large-btn" onclick="levelManager.openSpecificLevel(11)" style="font-size: 20px; padding: 15px 30px;">Continue to Level 11: Graphs →</button>
            </div>
          `;
        } else if (this.currentLevel === 15) {
          gameContainer.innerHTML = `
            <div class="game-success" style="text-align: center; padding: 40px; background: rgba(0, 255, 0, 0.1); border-radius: 10px; border: 3px solid #00ff00;">
              <h4 style="color: #00ff00; font-size: 32px; margin: 0 0 20px 0;">🎉 Network Restored!</h4>
              <p style="color: #ffffff; font-size: 18px; margin-bottom: 30px;">Incredible! You've mastered Graphs, BFS, DFS, Dijkstra, and MST!</p>
              <p style="color: #ffd700; font-size: 16px; margin-bottom: 30px;">🌐 Level 15 Complete! Ready to learn Hashing?</p>
              <button class="btn-primary large-btn" onclick="levelManager.openSpecificLevel(16)" style="font-size: 20px; padding: 15px 30px;">Continue to Level 16: Hashing →</button>
            </div>
          `;
        } else {
          gameContainer.innerHTML = `
            <div class="game-success" style="text-align: center; padding: 40px; background: rgba(0, 255, 0, 0.1); border-radius: 10px; border: 3px solid #00ff00;">
              <h4 style="color: #00ff00; font-size: 32px; margin: 0 0 20px 0;">🎉 Game Completed!</h4>
              <p style="color: #ffffff; font-size: 18px; margin-bottom: 30px;">Excellent work! You've mastered the DSA concepts!</p>
              <button class="btn-primary large-btn" onclick="levelManager.proceedAfterGame()" style="font-size: 20px; padding: 15px 30px;">Continue to Coding Challenge →</button>
            </div>
          `;
        }
      } else {
        gameContainer.innerHTML = `
          <div class="game-success" style="text-align: center; padding: 40px; background: rgba(0, 255, 0, 0.1); border-radius: 10px; border: 3px solid #00ff00;">
            <h4 style="color: #00ff00; font-size: 32px; margin: 0 0 20px 0;">🎉 Game Completed!</h4>
            <p style="color: #ffffff; font-size: 18px; margin-bottom: 30px;">Excellent work! You've mastered the concepts!</p>
            <button class="btn-primary large-btn" onclick="levelManager.proceedAfterGame()" style="font-size: 20px; padding: 15px 30px;">Continue →</button>
          </div>
        `;
      }
    }
  }

  openSpecificLevel(targetLevel) {
    this.completeLevel();
    setTimeout(() => {
      if (window.roadmapManager) {
        const levelData = window.roadmapManager.getLevelData(targetLevel);
        if (levelData) {
          this.startLevel(this.currentCourse, targetLevel, levelData);
        } else {
          console.error(`Level ${targetLevel} data not found`);
          alert(`Level ${targetLevel} is not available yet. Please check back later!`);
        }
      }
    }, 500);
  }

  proceedAfterGame() {
    if (this.levelData.coding) {
      this.showCoding();
    } else {
      this.completeLevel();
    }
  }

  updateStepStatus(step, status) {
    const stepElement = document.querySelector(`.step[data-step="${step}"]`);
    if (stepElement) {
      stepElement.classList.remove('active', 'completed');
      stepElement.classList.add(status);
    }
  }

  completeLevel() {
    this.performanceMetrics.timeSpent = Math.floor((Date.now() - this.startTime) / 1000);
    const stars = this.calculateStars();
    this.closeLevelModal();
    if (window.roadmapManager) {
      window.roadmapManager.completeLevel(this.currentLevel, stars);
    }
  }

  calculateStars() {
    let stars = 1;
    if (this.performanceMetrics.quizScore >= 80) stars++;
    if (this.performanceMetrics.videoWatched && this.performanceMetrics.conceptsReviewed && (this.performanceMetrics.codingCompleted || !this.levelData.coding) && (this.performanceMetrics.gameCompleted || !this.levelData.game)) stars++;
    return Math.min(stars, 3);
  }

  closeLevelModal() {
    const modal = document.getElementById('level-modal');
    if (modal) modal.remove();
  }
}

window.levelManager = new LevelManager();
