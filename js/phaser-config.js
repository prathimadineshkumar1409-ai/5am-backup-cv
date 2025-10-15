/**
 * Phaser.js Configuration and Game Manager
 * This file handles all Phaser game initialization and management
 */

class PhaserGameManager {
    constructor() {
        this.currentGame = null;
        this.gameContainer = null;
    }

    /**
     * Initialize a Phaser game for a specific topic
     * @param {string} gameType - The type of game (e.g., 'process-scheduler', 'stack', etc.)
     * @param {object} userData - User data including userId, score, difficulty
     */
    async startGame(gameType, userData) {
        // Clean up existing game
        if (this.currentGame) {
            this.currentGame.destroy(true);
            this.currentGame = null;
        }

        this.gameContainer = document.getElementById('game-container');
        if (!this.gameContainer) {
            console.error('Game container not found!');
            return;
        }

        // Clear container
        this.gameContainer.innerHTML = '<div id="phaser-game"></div>';

        // Phaser configuration
        const config = {
            type: Phaser.AUTO,
            parent: 'phaser-game',
            width: 800,
            height: 600,
            backgroundColor: '#1a1a3a',
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 0 },
                    debug: false
                }
            },
            scene: null // Will be set based on gameType
        };

        // Load the appropriate game scene
        try {
            const GameScene = await this.loadGameScene(gameType);
            config.scene = GameScene;
            
            // Create Phaser game instance
            this.currentGame = new Phaser.Game(config);
            
            // Pass user data to the game
            this.currentGame.registry.set('userData', userData);
            
            console.log(`Game started: ${gameType}`);
        } catch (error) {
            console.error('Failed to load game:', error);
            this.gameContainer.innerHTML = `
                <div class="text-center p-8 text-red-400">
                    <p class="text-xl mb-4">⚠️ Failed to load game</p>
                    <p class="text-sm">${error.message}</p>
                </div>
            `;
        }
    }

    /**
     * Dynamically load game scene based on type
     */
    async loadGameScene(gameType) {
        const gameMap = {
            'process-scheduling': 'ProcessSchedulerGame',
            'memory-management': 'MemoryManagerGame',
            'deadlock': 'DeadlockGame',
            'file-systems': 'FileSystemGame',
            'tcp-ip': 'TCPSimulationGame',
            'dns': 'DNSGame',
            'routing': 'RoutingGame',
            'encryption': 'EncryptionGame',
            'sql-injection': 'SQLInjectionGame',
            'password-security': 'PasswordGame',
            'stack': 'StackGame',
            'queue': 'QueueGame',
            'binary-tree': 'TreeGame',
            'coding-challenges': 'CodingChallengeGame',
            'system-design': 'SystemDesignGame'
        };

        const sceneClass = gameMap[gameType];
        if (!sceneClass) {
            throw new Error(`Unknown game type: ${gameType}`);
        }

        // Return the scene class (will be defined in individual game files)
        if (window[sceneClass]) {
            return window[sceneClass];
        } else {
            throw new Error(`Game scene ${sceneClass} not loaded. Make sure to include the game script.`);
        }
    }

    /**
     * Report score back to main application
     */
    reportScore(score, concept, metrics) {
        if (window.reportScore) {
            window.reportScore(score, concept, metrics);
        }
        
        // Destroy game after reporting
        if (this.currentGame) {
            setTimeout(() => {
                this.currentGame.destroy(true);
                this.currentGame = null;
            }, 1000);
        }
    }

    /**
     * Pause current game
     */
    pauseGame() {
        if (this.currentGame && this.currentGame.scene.scenes[0]) {
            this.currentGame.scene.scenes[0].scene.pause();
        }
    }

    /**
     * Resume current game
     */
    resumeGame() {
        if (this.currentGame && this.currentGame.scene.scenes[0]) {
            this.currentGame.scene.scenes[0].scene.resume();
        }
    }

    /**
     * Destroy current game
     */
    destroyGame() {
        if (this.currentGame) {
            this.currentGame.destroy(true);
            this.currentGame = null;
        }
        if (this.gameContainer) {
            this.gameContainer.innerHTML = '';
        }
    }
}

// Base Game Scene Template
class BaseGameScene extends Phaser.Scene {
    constructor(key) {
        super({ key: key });
        this.score = 0;
        this.moves = 0;
        this.startTime = 0;
        this.userData = null;
    }

    init(data) {
        this.userData = this.registry.get('userData');
        this.startTime = Date.now();
    }

    create() {
        // Add background
        this.cameras.main.setBackgroundColor('#1a1a3a');
        
        // Add UI elements
        this.createUI();
    }

    createUI() {
        // Score text
        this.scoreText = this.add.text(16, 16, 'Score: 0', {
            fontSize: '24px',
            fill: '#fff',
            fontFamily: 'Inter, sans-serif'
        });

        // Moves text
        this.movesText = this.add.text(16, 50, 'Moves: 0', {
            fontSize: '20px',
            fill: '#a3b0ff',
            fontFamily: 'Inter, sans-serif'
        });

        // Timer text
        this.timerText = this.add.text(16, 80, 'Time: 0s', {
            fontSize: '20px',
            fill: '#fcc419',
            fontFamily: 'Inter, sans-serif'
        });

        // Update timer every second
        this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });
    }

    updateTimer() {
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        this.timerText.setText(`Time: ${elapsed}s`);
    }

    updateScore(points) {
        this.score += points;
        this.scoreText.setText(`Score: ${this.score}`);
    }

    updateMoves() {
        this.moves++;
        this.movesText.setText(`Moves: ${this.moves}`);
    }

    calculateFinalScore(optimalMoves, optimalTime) {
        const timeElapsed = (Date.now() - this.startTime) / 1000;
        
        // Score calculation formula
        let finalScore = 100;
        
        // Deduct points for extra moves
        if (this.moves > optimalMoves) {
            const extraMoves = this.moves - optimalMoves;
            finalScore -= (extraMoves * 5);
        }
        
        // Deduct points for extra time
        if (timeElapsed > optimalTime) {
            const extraTime = timeElapsed - optimalTime;
            finalScore -= (extraTime * 2);
        }
        
        // Ensure score is between 0 and 100
        finalScore = Math.max(0, Math.min(100, finalScore));
        
        return Math.round(finalScore);
    }

    showVictoryScreen(finalScore, concept) {
        // Create semi-transparent overlay
        const overlay = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.8);
        
        // Victory text
        const victoryText = this.add.text(400, 200, '🎉 CHALLENGE COMPLETE!', {
            fontSize: '48px',
            fill: '#fcc419',
            fontFamily: 'Inter, sans-serif'
        }).setOrigin(0.5);

        // Score text
        const scoreText = this.add.text(400, 280, `Final Score: ${finalScore}/100`, {
            fontSize: '36px',
            fill: '#a3b0ff',
            fontFamily: 'Inter, sans-serif'
        }).setOrigin(0.5);

        // Stats
        const statsText = this.add.text(400, 340, 
            `Moves: ${this.moves} | Time: ${Math.floor((Date.now() - this.startTime) / 1000)}s`, {
            fontSize: '24px',
            fill: '#fff',
            fontFamily: 'Inter, sans-serif'
        }).setOrigin(0.5);

        // Continue button
        const continueBtn = this.add.text(400, 420, 'Continue', {
            fontSize: '28px',
            fill: '#fff',
            backgroundColor: '#7b3fe8',
            padding: { x: 30, y: 15 },
            fontFamily: 'Inter, sans-serif'
        }).setOrigin(0.5).setInteractive();

        continueBtn.on('pointerover', () => {
            continueBtn.setStyle({ backgroundColor: '#6333c9' });
        });

        continueBtn.on('pointerout', () => {
            continueBtn.setStyle({ backgroundColor: '#7b3fe8' });
        });

        continueBtn.on('pointerdown', () => {
            // Report score to main app
            if (window.gameManager) {
                window.gameManager.reportScore(finalScore, concept, {
                    moves: this.moves,
                    time: Math.floor((Date.now() - this.startTime) / 1000)
                });
            }
        });
    }

    showErrorMessage(message) {
        const errorText = this.add.text(400, 550, message, {
            fontSize: '20px',
            fill: '#ef4444',
            backgroundColor: '#1a1a3a',
            padding: { x: 20, y: 10 },
            fontFamily: 'Inter, sans-serif'
        }).setOrigin(0.5);

        // Fade out after 2 seconds
        this.tweens.add({
            targets: errorText,
            alpha: 0,
            duration: 2000,
            delay: 1000,
            onComplete: () => errorText.destroy()
        });
    }
}

// Initialize global game manager
window.gameManager = new PhaserGameManager();
