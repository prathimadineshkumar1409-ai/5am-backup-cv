// CodeVerse Celebration System - Star showers and level completion animations

class CelebrationManager {
  constructor() {
    this.activeCelebrations = [];
  }

  showLevelComplete(levelNumber, stars, xp) {
    // Create celebration overlay
    const overlay = this.createCelebrationOverlay();

    // Show star shower
    this.showStarShower();

    // Show level complete popup
    setTimeout(() => {
      this.showLevelCompletePopup(levelNumber, stars, xp);
    }, 500);

    // Auto remove after animation
    setTimeout(() => {
      this.cleanup();
    }, 5000);
  }

  createCelebrationOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'celebration-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      z-index: 9998;
      pointer-events: none;
    `;

    document.body.appendChild(overlay);
    this.activeCelebrations.push(overlay);
    return overlay;
  }

  showStarShower() {
    const starContainer = document.createElement('div');
    starContainer.className = 'star-shower';
    starContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
    `;

    // Create multiple stars
    for (let i = 0; i < 30; i++) {
      const star = this.createStar();
      starContainer.appendChild(star);
    }

    document.body.appendChild(starContainer);
    this.activeCelebrations.push(starContainer);
  }

  createStar() {
    const star = document.createElement('div');
    star.className = 'celebration-star';
    star.textContent = '⭐';

    // Random position and animation
    const startX = Math.random() * window.innerWidth;
    const startY = -50;
    const endX = startX + (Math.random() - 0.5) * 200;
    const endY = window.innerHeight + 50;

    star.style.cssText = `
      position: absolute;
      left: ${startX}px;
      top: ${startY}px;
      font-size: ${20 + Math.random() * 20}px;
      animation: starFall ${2 + Math.random() * 2}s ease-out forwards;
      transform: rotate(${Math.random() * 360}deg);
    `;

    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes starFall {
        0% {
          transform: translateY(0) rotate(0deg) scale(1);
          opacity: 1;
        }
        50% {
          transform: translateY(${endY/2}px) rotate(180deg) scale(1.2);
          opacity: 1;
        }
        100% {
          transform: translateY(${endY}px) rotate(360deg) scale(0);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);

    return star;
  }

  showLevelCompletePopup(levelNumber, stars, xp) {
    const popup = document.createElement('div');
    popup.className = 'level-complete-popup';
    popup.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 20px;
      padding: 40px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
      z-index: 10000;
      text-align: center;
      min-width: 300px;
      animation: popupBounce 0.6s ease-out;
    `;

    // Create star rating display
    const starDisplay = this.createStarDisplay(stars);

    popup.innerHTML = `
      <div class="popup-header">
        <h2 class="popup-title">🎉 Level ${levelNumber} Complete!</h2>
      </div>

      <div class="popup-stars">
        ${starDisplay}
      </div>

      <div class="popup-rewards">
        <div class="xp-reward">
          <span class="xp-icon">⚡</span>
          <span class="xp-amount">+${xp} XP</span>
        </div>
      </div>

      <div class="popup-message">
        <p>Amazing work! Keep up the great progress!</p>
      </div>

      <button class="popup-continue-btn" onclick="celebrationManager.continueToNext()">
        Continue Journey →
      </button>
    `;

    document.body.appendChild(popup);
    this.activeCelebrations.push(popup);

    // Add CSS animations
    this.addPopupAnimations();
  }

  createStarDisplay(stars) {
    let html = '<div class="star-rating">';
    for (let i = 1; i <= 3; i++) {
      const isFilled = i <= stars;
      html += `<span class="rating-star ${isFilled ? 'filled' : 'empty'}" style="animation-delay: ${i * 0.2}s">`;
      html += isFilled ? '⭐' : '☆';
      html += '</span>';
    }
    html += '</div>';
    return html;
  }

  addPopupAnimations() {
    const css = `
      @keyframes popupBounce {
        0% {
          transform: translate(-50%, -50%) scale(0.3);
          opacity: 0;
        }
        50% {
          transform: translate(-50%, -50%) scale(1.05);
          opacity: 1;
        }
        70% {
          transform: translate(-50%, -50%) scale(0.9);
        }
        100% {
          transform: translate(-50%, -50%) scale(1);
          opacity: 1;
        }
      }

      .star-rating {
        display: flex;
        justify-content: center;
        gap: 10px;
        margin: 20px 0;
      }

      .rating-star {
        font-size: 2.5rem;
        animation: starPop 0.8s ease-out forwards;
        opacity: 0;
        transform: scale(0);
      }

      .rating-star.filled {
        color: #FFD700;
        filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.8));
      }

      .rating-star.empty {
        color: #666;
      }

      @keyframes starPop {
        0% {
          opacity: 0;
          transform: scale(0) rotate(-180deg);
        }
        50% {
          opacity: 1;
          transform: scale(1.3) rotate(-90deg);
        }
        100% {
          opacity: 1;
          transform: scale(1) rotate(0deg);
        }
      }

      .xp-reward {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        margin: 20px 0;
        padding: 15px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 15px;
        animation: xpGlow 1s ease-out 1s forwards;
      }

      .xp-icon {
        font-size: 1.5rem;
      }

      .xp-amount {
        font-size: 1.3rem;
        font-weight: bold;
        color: #90CAF9;
      }

      @keyframes xpGlow {
        0% {
          box-shadow: 0 0 0 rgba(144, 202, 249, 0.4);
        }
        100% {
          box-shadow: 0 0 30px rgba(144, 202, 249, 0.6);
        }
      }

      .popup-continue-btn {
        background: linear-gradient(135deg, #4CAF50, #66BB6A);
        color: white;
        border: none;
        padding: 15px 30px;
        border-radius: 25px;
        font-size: 18px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s ease;
        margin-top: 30px;
        box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
      }

      .popup-continue-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(76, 175, 80, 0.5);
      }

      .popup-title {
        color: #FFD700;
        margin-bottom: 10px;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        font-size: 2rem;
      }

      .popup-message {
        margin: 20px 0;
        color: #E8EAF6;
        font-size: 1.1rem;
      }
    `;

    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }

  continueToNext() {
    this.cleanup();
    // The roadmap manager will handle updating the UI
  }

  cleanup() {
    this.activeCelebrations.forEach(element => {
      if (element.parentElement) {
        element.remove();
      }
    });
    this.activeCelebrations = [];
  }

  // Achievement celebrations
  showAchievementUnlock(achievement) {
    const popup = document.createElement('div');
    popup.className = 'achievement-popup';
    popup.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #FF9800, #FFB74D);
      color: white;
      padding: 20px;
      border-radius: 15px;
      box-shadow: 0 8px 25px rgba(255, 152, 0, 0.4);
      z-index: 10000;
      max-width: 300px;
      animation: slideInRight 0.5s ease-out;
    `;

    popup.innerHTML = `
      <div class="achievement-header">
        <span class="achievement-icon">🏆</span>
        <h3>Achievement Unlocked!</h3>
      </div>
      <div class="achievement-content">
        <h4>${achievement.title}</h4>
        <p>${achievement.description}</p>
      </div>
    `;

    document.body.appendChild(popup);

    // Auto remove after 4 seconds
    setTimeout(() => {
      if (popup.parentElement) {
        popup.remove();
      }
    }, 4000);

    // Add slide animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideInRight {
        0% {
          transform: translateX(100%);
          opacity: 0;
        }
        100% {
          transform: translateX(0);
          opacity: 1;
        }
      }

      .achievement-header {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 10px;
      }

      .achievement-icon {
        font-size: 2rem;
      }

      .achievement-content h4 {
        margin: 0 0 5px 0;
        font-size: 1.2rem;
      }

      .achievement-content p {
        margin: 0;
        opacity: 0.9;
        font-size: 0.9rem;
      }
    `;
    document.head.appendChild(style);
  }

  // Milestone celebrations (every 5 levels)
  showMilestoneComplete(levelNumber, courseName) {
    const overlay = this.createCelebrationOverlay();

    // Extra spectacular star shower
    setTimeout(() => {
      this.showExtraStarShower();
    }, 200);

    // Special milestone popup
    setTimeout(() => {
      this.showMilestonePopup(levelNumber, courseName);
    }, 1000);
  }

  showExtraStarShower() {
    const starContainer = document.createElement('div');
    starContainer.className = 'extra-star-shower';
    starContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
    `;

    // Create more stars for milestone
    for (let i = 0; i < 50; i++) {
      const star = this.createStar();
      // Make them bigger and more colorful
      star.style.fontSize = `${30 + Math.random() * 30}px`;
      star.textContent = ['⭐', '✨', '🌟', '💫'][Math.floor(Math.random() * 4)];
      starContainer.appendChild(star);
    }

    document.body.appendChild(starContainer);

    setTimeout(() => {
      if (starContainer.parentElement) {
        starContainer.remove();
      }
    }, 4000);
  }

  showMilestonePopup(levelNumber, courseName) {
    const popup = document.createElement('div');
    popup.className = 'milestone-popup';
    popup.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: linear-gradient(135deg, #9C27B0, #BA68C8);
      border-radius: 25px;
      padding: 50px;
      box-shadow: 0 25px 80px rgba(156, 39, 176, 0.6);
      z-index: 10000;
      text-align: center;
      min-width: 400px;
      animation: milestonePopup 0.8s ease-out;
    `;

    popup.innerHTML = `
      <div class="milestone-icon">🎊</div>
      <h2 class="milestone-title">Milestone Reached!</h2>
      <div class="milestone-content">
        <p>You've completed Level ${levelNumber} in ${courseName}!</p>
        <p class="milestone-reward">🎮 Game Level Unlocked!</p>
      </div>
      <button class="milestone-continue-btn" onclick="celebrationManager.continueToNext()">
        Continue Adventure →
      </button>
    `;

    document.body.appendChild(popup);

    // Add milestone CSS
    const style = document.createElement('style');
    style.textContent = `
      @keyframes milestonePopup {
        0% {
          transform: translate(-50%, -50%) scale(0) rotate(-10deg);
          opacity: 0;
        }
        50% {
          transform: translate(-50%, -50%) scale(1.1) rotate(5deg);
          opacity: 1;
        }
        100% {
          transform: translate(-50%, -50%) scale(1) rotate(0deg);
          opacity: 1;
        }
      }

      .milestone-icon {
        font-size: 4rem;
        margin-bottom: 20px;
        animation: bounce 1s infinite;
      }

      .milestone-title {
        color: white;
        font-size: 2.5rem;
        margin-bottom: 20px;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
      }

      .milestone-content p {
        color: #E8EAF6;
        font-size: 1.2rem;
        margin: 10px 0;
      }

      .milestone-reward {
        color: #FFD700;
        font-weight: bold;
        font-size: 1.3rem;
        margin-top: 15px;
      }

      .milestone-continue-btn {
        background: linear-gradient(135deg, #4CAF50, #66BB6A);
        color: white;
        border: none;
        padding: 18px 35px;
        border-radius: 30px;
        font-size: 20px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s ease;
        margin-top: 30px;
        box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
      }

      .milestone-continue-btn:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 30px rgba(76, 175, 80, 0.6);
      }
    `;
    document.head.appendChild(style);
  }
}

// Global instance
window.celebrationManager = new CelebrationManager();
