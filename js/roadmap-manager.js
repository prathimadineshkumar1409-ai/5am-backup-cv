// CodeVerse Roadmap Manager - Zig-Zag Candy Crush Style

class RoadmapManager {
  constructor() {
    this.currentCourse = null;
    this.userProgress = {};
    this.levels = [];
    this.container = null;
  }

  async initialize(courseId) {
    this.currentCourse = courseId;
    await this.loadCourseData();
    await this.loadUserProgress();
    this.renderRoadmap();
    this.setupEventListeners();
  }

  async loadCourseData() {
    try {
      // Try the unified courses file first, then fall back to DSA-specific file
      let data = null;
      try {
        const response = await fetch('data/courses-config.json');
        if (response.ok) {
          data = await response.json();
        } else {
          console.warn('data/courses-config.json not found (HTTP ' + response.status + '), will try dsa-courses-config.json');
        }
      } catch (e) {
        console.warn('Failed to fetch data/courses-config.json, will try dsa-courses-config.json', e);
      }

      if (!data) {
        try {
          const response2 = await fetch('data/dsa-courses-config.json');
          if (response2.ok) {
            data = await response2.json();
            console.info('Loaded fallback data/dsa-courses-config.json');
          } else {
            throw new Error('dsa-courses-config.json not found (HTTP ' + response2.status + ')');
          }
        } catch (e) {
          console.error('Error loading course data from both paths:', e);
          throw e; // let outer catch handle defaults
        }
      }

      // Defensive: ensure structure exists before reading
      if (data && data.courses && data.courses[this.currentCourse] && Array.isArray(data.courses[this.currentCourse].levels)) {
        this.levels = data.courses[this.currentCourse].levels;
      } else if (data && data.courses && Array.isArray(data.courses)) {
        // older format possibility: top-level array
        this.levels = data.courses;
      } else {
        throw new Error('Invalid course data structure');
      }
    } catch (error) {
      console.error('Error loading course data:', error);
      // Fallback to default levels if config not found
      this.levels = this.generateDefaultLevels();
    }
  }

  generateDefaultLevels() {
    const levels = [];
    for (let i = 1; i <= 20; i++) {
      levels.push({
        id: i,
        title: `Level ${i}`,
        description: `Master the concepts in level ${i}`,
        icon: i % 5 === 0 ? '🎮' : i === 20 ? '🏆' : '📚',
        xp: i % 5 === 0 ? 200 : 100,
        videoUrl: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`,
        concepts: [
          {
            title: `Concept ${i}`,
            content: `Learn about the key concepts in level ${i}. This is an important foundation for your learning journey.`,
            example: `// Example code for level ${i}\nfunction example() {\n  return "Level ${i} concept";\n}`
          }
        ],
        quiz: i % 5 === 0 || i % 10 === 0 || i % 15 === 0 ? {
          questions: [
            {
              question: `What is the main concept of Level ${i}?`,
              options: ['Option A', 'Option B', 'Option C', 'Option D'],
              correct: 0
            }
          ]
        } : null,
        coding: i % 5 === 0 ? {
          title: `Coding Challenge ${i}`,
          description: `Write code to demonstrate the concept learned in level ${i}.`,
          starterCode: `// Write your solution here\n\n`
        } : null,
        game: i % 5 === 0 ? `game-level-${i}` : null
      });
    }
    return levels;
  }

  async loadUserProgress() {
    if (!window.currentUserId) return;

    try {
      const dbRef = window.firebaseRef(window.database, `users/${window.currentUserId}/courses/${this.currentCourse}`);
      const snapshot = await window.firebaseGet(dbRef);
      if (snapshot.exists()) {
        this.userProgress = snapshot.val();
      } else {
        // Initialize progress for new course
        this.userProgress = {
          currentLevel: 1,
          completedLevels: {},
          totalXP: 0,
          stars: 0
        };
      }
    } catch (error) {
      console.error('Error loading user progress:', error);
      this.userProgress = {
        currentLevel: 1,
        completedLevels: {},
        totalXP: 0,
        stars: 0
      };
    }
  }

  renderRoadmap() {
    const courseData = this.getCourseData();
    const progress = this.calculateProgress();

    const html = `
      <div class="roadmap-container">
        <button class="back-button" onclick="window.setView('dashboard')">
          ← Back to Dashboard
        </button>

        <div class="roadmap-header">
          <h1 class="course-title">${courseData.icon} ${courseData.name}</h1>
          <div class="course-progress">
            Level ${this.userProgress.currentLevel || 1} of ${this.levels.length} • ${progress}% Complete
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${progress}%"></div>
          </div>
        </div>

        <div class="roadmap-path">
          <div class="roadmap-line"></div>
          ${this.levels.map((level, index) => this.renderLevelNode(level, index + 1)).join('')}
        </div>
      </div>
    `;

    // Switch to roadmap screen and set content
    window.setView('roadmap');
    document.getElementById('roadmap-container').innerHTML = html;
    this.container = document.querySelector('.roadmap-container');
  }

  renderLevelNode(level, levelNumber) {
    const status = this.getLevelStatus(levelNumber);
    const stars = this.getLevelStars(levelNumber);
    const isMilestone = levelNumber % 5 === 0;
    const isBoss = levelNumber === this.levels.length;

    let classes = ['level-node', status];
    if (isMilestone) classes.push('milestone');
    if (isBoss) classes.push('boss');

    const tooltipContent = `
      <div class="tooltip-title">${level.title}</div>
      <div class="tooltip-description">${level.description || 'Complete this level to unlock the next challenge!'}</div>
      <div class="tooltip-rewards">
        <span>⭐ ${level.xp} XP</span>
        ${level.videoUrl ? '<span>📺 Video</span>' : ''}
        ${level.quiz ? '<span>📝 Quiz</span>' : ''}
        ${level.game ? '<span>🎮 Game</span>' : ''}
        ${level.coding ? '<span>💻 Coding</span>' : ''}
      </div>
    `;

    return `
      <div class="path-segment">
        <div class="${classes.join(' ')}" data-level="${levelNumber}" onclick="window.roadmapManager && window.roadmapManager.handleLevelClick(${levelNumber})">
          <div class="level-icon">${this.getLevelIcon(level, levelNumber)}</div>
          <div class="level-number">${levelNumber}</div>
          ${stars ? `<div class="level-stars">${stars}</div>` : ''}
          <div class="level-tooltip">${tooltipContent}</div>
        </div>
      </div>
    `;
  }

  getLevelStatus(levelNumber) {
    if (this.userProgress.completedLevels && this.userProgress.completedLevels[levelNumber]) {
      return 'completed';
    } else if (levelNumber === this.userProgress.currentLevel) {
      return 'current';
    } else if (levelNumber < this.userProgress.currentLevel) {
      return 'available';
    } else {
      return 'locked';
    }
  }

  getLevelStars(levelNumber) {
    if (!this.userProgress.completedLevels || !this.userProgress.completedLevels[levelNumber]) {
      return '';
    }

    const stars = this.userProgress.completedLevels[levelNumber].stars || 0;
    let starHtml = '';
    for (let i = 1; i <= 3; i++) {
      starHtml += `<span class="star ${i <= stars ? '' : 'empty'}">⭐</span>`;
    }
    return starHtml;
  }

  getLevelIcon(level, levelNumber) {
    if (levelNumber === this.levels.length) return '🏆'; // Boss level
    if (levelNumber % 5 === 0) return '🎮'; // Game level
    if (level.quiz) return '📝'; // Quiz level
    if (level.coding) return '💻'; // Coding level
    if (level.videoUrl) return '📺'; // Video level
    return '📖'; // Concept level
  }

  calculateProgress() {
    if (!this.userProgress.completedLevels) return 0;
    const completed = Object.keys(this.userProgress.completedLevels).length;
    return Math.round((completed / this.levels.length) * 100);
  }

  getCourseData() {
    const courseMap = {
      'dsa': { name: 'Data Structures & Algorithms', icon: '🧮', color: '#8B5CF6' },
      'os': { name: 'Operating Systems', icon: '💻', color: '#3B82F6' },
      'cn': { name: 'Computer Networks', icon: '🌐', color: '#10B981' },
      'dbms': { name: 'Database Management Systems', icon: '🗄️', color: '#F59E0B' },
      'oops': { name: 'Object-Oriented Programming', icon: '🎯', color: '#EF4444' },
      'web-dev': { name: 'HTML, CSS & JavaScript', icon: '🌐', color: '#EC4899' },
      'python': { name: 'Python Basics', icon: '🐍', color: '#3B82F6' }
    };
    return courseMap[this.currentCourse] || { name: 'Unknown Course', icon: '❓', color: '#666' };
  }

  setupEventListeners() {
    // Level click events are handled via onclick attributes
  }

  async handleLevelClick(levelNumber) {
    const status = this.getLevelStatus(levelNumber);

    if (status === 'locked') {
      this.showNotification('🔒 Complete previous levels first!', 'warning');
      return;
    }

    // Get level data
    const level = this.levels[levelNumber - 1];
    
    // Start the level using level manager
    if (window.levelManager) {
      await window.levelManager.startLevel(this.currentCourse, levelNumber, level);
    }
  }

  async completeLevel(levelNumber, stars) {
    // Update progress
    if (!this.userProgress.completedLevels) {
      this.userProgress.completedLevels = {};
    }

    this.userProgress.completedLevels[levelNumber] = {
      stars: stars,
      completedAt: Date.now(),
      xp: this.levels[levelNumber - 1].xp
    };

    this.userProgress.totalXP = (this.userProgress.totalXP || 0) + this.levels[levelNumber - 1].xp;
    this.userProgress.currentLevel = Math.max(this.userProgress.currentLevel || 1, levelNumber + 1);

    // Save to Firebase
    await this.saveProgress();

    // Show celebration
    this.showCelebration(levelNumber, stars);

    // Update UI
    this.renderRoadmap();

    // Show external courses unlock at level 12
    if (levelNumber === 12) {
      this.showExternalCoursesUnlock();
    }

    // Check if course completed (level 20)
    if (levelNumber === 20) {
      this.showCourseCompletion();
    }
  }

  async saveProgress() {
    if (!window.currentUserId) return;

    try {
      await window.firebaseSet(
        window.firebaseRef(window.database, `users/${window.currentUserId}/courses/${this.currentCourse}`), 
        this.userProgress
      );
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  }

  showCelebration(levelNumber, stars) {
    // Create celebration container
    const celebration = document.createElement('div');
    celebration.className = 'celebration-stars';

    // Add stars
    for (let i = 0; i < 30; i++) {
      const star = document.createElement('div');
      star.className = 'celebration-star';
      star.textContent = '⭐';
      star.style.left = Math.random() * 100 + '%';
      star.style.top = Math.random() * 100 + '%';
      star.style.animationDelay = Math.random() * 2 + 's';
      celebration.appendChild(star);
    }

    document.body.appendChild(celebration);

    // Show level complete popup
    const level = this.levels[levelNumber - 1];
    const popup = document.createElement('div');
    popup.className = 'level-popup';
    popup.innerHTML = `
      <div class="popup-title">Level ${levelNumber} Complete! 🎉</div>
      <div class="popup-stars">
        ${'⭐'.repeat(stars)}${'☆'.repeat(3-stars)}
      </div>
      <div class="popup-xp">+${level.xp} XP</div>
      <p style="color: white; margin: 15px 0;">Total XP: ${this.userProgress.totalXP}</p>
      <button class="popup-button" onclick="this.parentElement.remove(); document.querySelector('.celebration-stars').remove();">
        Continue
      </button>
    `;

    document.body.appendChild(popup);

    // Auto remove celebration after animation
    setTimeout(() => {
      if (celebration.parentElement) {
        celebration.remove();
      }
    }, 4000);
  }

  showExternalCoursesUnlock() {
    setTimeout(() => {
      const popup = document.createElement('div');
      popup.className = 'level-popup';
      popup.innerHTML = `
        <div class="popup-title">🎓 New Feature Unlocked!</div>
        <h3 style="color: #FFD700; margin: 20px 0;">External Courses Available</h3>
        <p style="color: white; font-size: 1.2rem; margin: 15px 0; line-height: 1.6;">
          Great progress! You've completed 12 levels.<br>
          You can now access external courses from:<br>
          📚 Udemy • 🎓 Coursera • 🏆 Professional Certifications
        </p>
        <p style="color: #90CAF9; margin: 20px 0;">
          Continue learning to unlock more features!
        </p>
        <button class="popup-button" onclick="this.parentElement.remove();">
          Awesome! Continue Learning
        </button>
      `;
      document.body.appendChild(popup);
    }, 1500);
  }

  showCourseCompletion() {
    setTimeout(() => {
      const popup = document.createElement('div');
      popup.className = 'level-popup';
      popup.innerHTML = `
        <div class="popup-title">🏆 Course Completed! 🏆</div>
        <h3 style="color: #FFD700; margin: 20px 0;">Congratulations!</h3>
        <p style="color: white; font-size: 1.2rem; margin: 15px 0;">
          You've mastered all 20 levels of ${this.getCourseData().name}!
        </p>
        <div class="popup-xp">Total XP Earned: ${this.userProgress.totalXP}</div>
        <p style="color: #90CAF9; margin: 20px 0;">
          🎓 External courses and certifications are now unlocked!
        </p>
        <button class="popup-button" onclick="this.parentElement.remove(); window.setView('dashboard');">
          Back to Dashboard
        </button>
      `;
      document.body.appendChild(popup);
    }, 1000);
  }

  getLevelData(levelNumber) {
    // Return the level data for the specified level number
    if (levelNumber > 0 && levelNumber <= this.levels.length) {
      return this.levels[levelNumber - 1];
    }
    return null;
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'error' ? '#f44336' : type === 'warning' ? '#ff9800' : '#4caf50'};
      color: white;
      padding: 15px 20px;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 10000;
      font-weight: bold;
      animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 3000);
  }
}

// Global instance
window.roadmapManager = new RoadmapManager();
