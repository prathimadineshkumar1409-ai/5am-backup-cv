/**
 * CodeQuest: The Lost Data Realms
 * A 5-level educational DSA game using Phaser.js
 * 
 * Levels:
 * 1. Digital Awakening (Intro)
 * 2. Array Realm (Array ordering)
 * 3. Stack Summit (Stack push/pop)
 * 4. Queue Quarters (Queue FIFO)
 * 5. Core Simulator (Revision + Three.js animation)
 */

// ============================================
// LEVEL 1: DIGITAL AWAKENING (INTRO)
// ============================================
class Level1_DigitalAwakening extends Phaser.Scene {
    constructor() {
        super({ key: 'Level1_DigitalAwakening' });
    }

    create() {
        // Background
        this.add.rectangle(400, 300, 800, 600, 0x1a1a2e);
        
        // Title
        this.add.text(400, 100, 'CodeQuest: The Lost Data Realms', {
            fontSize: '32px',
            fontFamily: 'Arial',
            color: '#00ff88',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Story dialogue box
        const dialogueBox = this.add.rectangle(400, 300, 700, 300, 0x16213e, 0.9);
        dialogueBox.setStrokeStyle(3, 0x00ff88);

        // Story text with animation
        const storyText = `Welcome, Data Explorer!\n\nThe Digital Realm is corrupted.\nData structures are broken.\n\nYou must collect 3 Data Keys by\nfixing DSA concepts to restore the system.\n\nAre you ready to begin?`;
        
        const textObj = this.add.text(400, 300, '', {
            fontSize: '20px',
            fontFamily: 'Arial',
            color: '#ffffff',
            align: 'center',
            lineSpacing: 10
        }).setOrigin(0.5);

        // Typewriter effect
        let charIndex = 0;
        this.time.addEvent({
            delay: 30,
            callback: () => {
                if (charIndex < storyText.length) {
                    textObj.text += storyText[charIndex];
                    charIndex++;
                }
            },
            repeat: storyText.length - 1
        });

        // Start button (appears after text animation)
        this.time.delayedCall(3000, () => {
            const startButton = this.add.rectangle(400, 500, 200, 60, 0x00ff88)
                .setInteractive({ useHandCursor: true })
                .on('pointerover', () => startButton.setFillStyle(0x00cc66))
                .on('pointerout', () => startButton.setFillStyle(0x00ff88))
                .on('pointerdown', () => {
                    this.cameras.main.fadeOut(500);
                    this.time.delayedCall(500, () => this.scene.start('Level2_ArrayRealm'));
                });

            this.add.text(400, 500, 'START QUEST', {
                fontSize: '24px',
                fontFamily: 'Arial',
                color: '#000000',
                fontStyle: 'bold'
            }).setOrigin(0.5);

            // Pulse animation
            this.tweens.add({
                targets: startButton,
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 800,
                yoyo: true,
                repeat: -1
            });
        });

        // Fade in
        this.cameras.main.fadeIn(1000);
    }
}

// ============================================
// LEVEL 2: ARRAY REALM (DRAG & DROP)
// ============================================
class Level2_ArrayRealm extends Phaser.Scene {
    constructor() {
        super({ key: 'Level2_ArrayRealm' });
        this.correctOrder = [10, 20, 30, 40, 50];
        this.slots = [];
        this.elements = [];
    }

    create() {
        // Background
        this.add.rectangle(400, 300, 800, 600, 0x0f3460);
        
        // Title
        this.add.text(400, 50, 'Level 2: Array Realm', {
            fontSize: '36px',
            fontFamily: 'Arial',
            color: '#ffd700',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Instructions
        this.add.text(400, 120, 'Drag the elements into correct ascending order!', {
            fontSize: '20px',
            fontFamily: 'Arial',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Create array slots (target positions)
        for (let i = 0; i < 5; i++) {
            const slot = this.add.rectangle(150 + i * 120, 300, 100, 100, 0x2c3e50);
            slot.setStrokeStyle(3, 0xffd700);
            this.slots.push({ x: slot.x, y: slot.y, filled: false, value: null });
            
            // Index labels
            this.add.text(150 + i * 120, 360, `[${i}]`, {
                fontSize: '18px',
                color: '#ffd700'
            }).setOrigin(0.5);
        }

        // Create draggable elements (shuffled)
        const shuffled = [50, 20, 40, 10, 30];
        shuffled.forEach((value, i) => {
            const element = this.add.rectangle(150 + i * 120, 450, 90, 90, 0x3498db)
                .setInteractive({ draggable: true, useHandCursor: true });
            
            const text = this.add.text(150 + i * 120, 450, value.toString(), {
                fontSize: '28px',
                fontFamily: 'Arial',
                color: '#ffffff',
                fontStyle: 'bold'
            }).setOrigin(0.5);

            element.value = value;
            element.textObj = text;
            this.elements.push(element);

            // Drag events
            element.on('drag', (pointer, dragX, dragY) => {
                element.x = dragX;
                element.y = dragY;
                text.x = dragX;
                text.y = dragY;
            });

            element.on('dragend', () => {
                this.checkPlacement(element);
            });
        });

        this.cameras.main.fadeIn(500);
    }

    checkPlacement(element) {
        let placed = false;
        
        // Check if dropped near a slot
        for (let i = 0; i < this.slots.length; i++) {
            const slot = this.slots[i];
            const distance = Phaser.Math.Distance.Between(element.x, element.y, slot.x, slot.y);
            
            if (distance < 60 && !slot.filled) {
                // Snap to slot
                element.x = slot.x;
                element.y = slot.y;
                element.textObj.x = slot.x;
                element.textObj.y = slot.y;
                slot.filled = true;
                slot.value = element.value;
                element.disableInteractive();
                placed = true;
                break;
            }
        }

        // Check if all slots filled
        if (this.slots.every(slot => slot.filled)) {
            this.time.delayedCall(500, () => this.checkSolution());
        }
    }

    checkSolution() {
        const userOrder = this.slots.map(slot => slot.value);
        const isCorrect = JSON.stringify(userOrder) === JSON.stringify(this.correctOrder);

        if (isCorrect) {
            // Success!
            const successText = this.add.text(400, 200, '✓ CORRECT!\nData Key 1 Unlocked!', {
                fontSize: '32px',
                fontFamily: 'Arial',
                color: '#00ff00',
                fontStyle: 'bold',
                align: 'center'
            }).setOrigin(0.5).setAlpha(0);

            this.tweens.add({
                targets: successText,
                alpha: 1,
                duration: 500
            });

            // Next level button
            this.time.delayedCall(2000, () => {
                const nextBtn = this.add.rectangle(400, 520, 200, 60, 0xffd700)
                    .setInteractive({ useHandCursor: true })
                    .on('pointerdown', () => {
                        this.cameras.main.fadeOut(500);
                        this.time.delayedCall(500, () => this.scene.start('Level3_StackSummit'));
                    });

                this.add.text(400, 520, 'NEXT LEVEL', {
                    fontSize: '24px',
                    color: '#000000',
                    fontStyle: 'bold'
                }).setOrigin(0.5);
            });
        } else {
            // Wrong - reset
            this.add.text(400, 200, '✗ Try Again!', {
                fontSize: '28px',
                color: '#ff0000',
                fontStyle: 'bold'
            }).setOrigin(0.5);

            this.time.delayedCall(1500, () => this.scene.restart());
        }
    }
}

// ============================================
// LEVEL 3: STACK SUMMIT (PUSH/POP)
// ============================================
class Level3_StackSummit extends Phaser.Scene {
    constructor() {
        super({ key: 'Level3_StackSummit' });
        this.stack = [];
        this.targetPushes = 5;
        this.targetPops = 2;
        this.pushCount = 0;
        this.popCount = 0;
    }

    create() {
        // Background
        this.add.rectangle(400, 300, 800, 600, 0x2c1810);
        
        // Title
        this.add.text(400, 50, 'Level 3: Stack Summit', {
            fontSize: '36px',
            fontFamily: 'Arial',
            color: '#ff6b6b',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Instructions
        this.instructionText = this.add.text(400, 120, 'Push 5 crates, then Pop 2 crates!', {
            fontSize: '20px',
            fontFamily: 'Arial',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Stack visualization area
        this.stackBase = this.add.rectangle(400, 500, 150, 20, 0x8b4513);
        this.add.text(400, 520, 'STACK BASE', {
            fontSize: '14px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Push button
        const pushBtn = this.add.rectangle(250, 550, 120, 50, 0x4ecdc4)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => pushBtn.setFillStyle(0x3db3aa))
            .on('pointerout', () => pushBtn.setFillStyle(0x4ecdc4))
            .on('pointerdown', () => this.pushCrate());

        this.add.text(250, 550, 'PUSH', {
            fontSize: '22px',
            color: '#000000',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Pop button
        const popBtn = this.add.rectangle(550, 550, 120, 50, 0xff6b6b)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => popBtn.setFillStyle(0xee5555))
            .on('pointerout', () => popBtn.setFillStyle(0xff6b6b))
            .on('pointerdown', () => this.popCrate());

        this.add.text(550, 550, 'POP', {
            fontSize: '22px',
            color: '#000000',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Counter display
        this.counterText = this.add.text(400, 180, 'Pushes: 0/5 | Pops: 0/2', {
            fontSize: '24px',
            color: '#ffd700'
        }).setOrigin(0.5);

        this.cameras.main.fadeIn(500);
    }

    pushCrate() {
        if (this.pushCount >= this.targetPushes) {
            this.showMessage('Already pushed 5 crates!', 0xff6b6b);
            return;
        }

        this.pushCount++;
        const crateY = 480 - (this.stack.length * 60);
        
        const crate = this.add.rectangle(400, crateY, 140, 50, 0xd4a574);
        crate.setStrokeStyle(3, 0x8b4513);
        
        const crateText = this.add.text(400, crateY, `Crate ${this.pushCount}`, {
            fontSize: '16px',
            color: '#000000',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.stack.push({ crate, crateText });
        this.updateCounter();
        this.checkCompletion();
    }

    popCrate() {
        if (this.stack.length === 0) {
            this.showMessage('Stack is empty!', 0xff6b6b);
            return;
        }

        if (this.pushCount < this.targetPushes) {
            this.showMessage('Push 5 crates first!', 0xff6b6b);
            return;
        }

        this.popCount++;
        const removed = this.stack.pop();
        
        // Animate removal
        this.tweens.add({
            targets: [removed.crate, removed.crateText],
            alpha: 0,
            y: '-=100',
            duration: 500,
            onComplete: () => {
                removed.crate.destroy();
                removed.crateText.destroy();
            }
        });

        this.updateCounter();
        this.checkCompletion();
    }

    updateCounter() {
        this.counterText.setText(`Pushes: ${this.pushCount}/${this.targetPushes} | Pops: ${this.popCount}/${this.targetPops}`);
    }

    showMessage(msg, color) {
        const msgText = this.add.text(400, 250, msg, {
            fontSize: '20px',
            color: Phaser.Display.Color.IntegerToColor(color).rgba,
            fontStyle: 'bold'
        }).setOrigin(0.5).setAlpha(0);

        this.tweens.add({
            targets: msgText,
            alpha: 1,
            duration: 300,
            yoyo: true,
            hold: 1000,
            onComplete: () => msgText.destroy()
        });
    }

    checkCompletion() {
        if (this.pushCount === this.targetPushes && this.popCount === this.targetPops) {
            this.time.delayedCall(500, () => {
                const successText = this.add.text(400, 250, '✓ Data Key 2 Unlocked!', {
                    fontSize: '32px',
                    color: '#00ff00',
                    fontStyle: 'bold'
                }).setOrigin(0.5).setAlpha(0);

                this.tweens.add({
                    targets: successText,
                    alpha: 1,
                    duration: 500
                });

                this.time.delayedCall(2000, () => {
                    const nextBtn = this.add.rectangle(400, 350, 200, 60, 0xff6b6b)
                        .setInteractive({ useHandCursor: true })
                        .on('pointerdown', () => {
                            this.cameras.main.fadeOut(500);
                            this.time.delayedCall(500, () => this.scene.start('Level4_QueueQuarters'));
                        });

                    this.add.text(400, 350, 'NEXT LEVEL', {
                        fontSize: '24px',
                        color: '#ffffff',
                        fontStyle: 'bold'
                    }).setOrigin(0.5);
                });
            });
        }
    }
}

// ============================================
// LEVEL 4: QUEUE QUARTERS (FIFO)
// ============================================
class Level4_QueueQuarters extends Phaser.Scene {
    constructor() {
        super({ key: 'Level4_QueueQuarters' });
        this.queue = [];
        this.requiredActions = 3;
        this.correctActions = 0;
    }

    create() {
        // Background
        this.add.rectangle(400, 300, 800, 600, 0x1a535c);
        
        // Title
        this.add.text(400, 50, 'Level 4: Queue Quarters', {
            fontSize: '36px',
            fontFamily: 'Arial',
            color: '#4ecdc4',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Instructions
        this.add.text(400, 120, 'Enqueue 3 passengers, then Dequeue 3 (FIFO - First In, First Out)', {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Queue visualization
        this.add.text(150, 250, 'FRONT →', {
            fontSize: '20px',
            color: '#ffd700',
            fontStyle: 'bold'
        });

        this.add.text(650, 250, '← REAR', {
            fontSize: '20px',
            color: '#ffd700',
            fontStyle: 'bold'
        });

        // Queue line
        this.add.rectangle(400, 300, 500, 100, 0x2c3e50, 0.5);
        this.add.rectangle(400, 300, 500, 100).setStrokeStyle(3, 0x4ecdc4);

        // Enqueue button
        const enqueueBtn = this.add.rectangle(250, 480, 150, 50, 0x4ecdc4)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => enqueueBtn.setFillStyle(0x3db3aa))
            .on('pointerout', () => enqueueBtn.setFillStyle(0x4ecdc4))
            .on('pointerdown', () => this.enqueue());

        this.add.text(250, 480, 'ENQUEUE', {
            fontSize: '20px',
            color: '#000000',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Dequeue button
        const dequeueBtn = this.add.rectangle(550, 480, 150, 50, 0xff6b6b)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => dequeueBtn.setFillStyle(0xee5555))
            .on('pointerout', () => dequeueBtn.setFillStyle(0xff6b6b))
            .on('pointerdown', () => this.dequeue());

        this.add.text(550, 480, 'DEQUEUE', {
            fontSize: '20px',
            color: '#000000',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Status text
        this.statusText = this.add.text(400, 180, 'Queue: Empty | Actions: 0/6', {
            fontSize: '22px',
            color: '#ffd700'
        }).setOrigin(0.5);

        this.passengerCount = 0;
        this.totalActions = 0;

        this.cameras.main.fadeIn(500);
    }

    enqueue() {
        if (this.queue.length >= 3) {
            this.showMessage('Queue is full! Dequeue first.', 0xff6b6b);
            return;
        }

        this.passengerCount++;
        this.totalActions++;
        
        const passenger = this.add.circle(0, 300, 30, 0xffe66d);
        passenger.setStrokeStyle(3, 0xffd700);
        
        const passengerText = this.add.text(0, 300, `P${this.passengerCount}`, {
            fontSize: '16px',
            color: '#000000',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Animate from right (rear)
        passenger.x = 700;
        passengerText.x = 700;

        const targetX = 600 - (this.queue.length * 100);
        
        this.tweens.add({
            targets: [passenger, passengerText],
            x: targetX,
            duration: 500,
            ease: 'Power2'
        });

        this.queue.push({ passenger, passengerText, id: this.passengerCount });
        this.updateStatus();
    }

    dequeue() {
        if (this.queue.length === 0) {
            this.showMessage('Queue is empty!', 0xff6b6b);
            return;
        }

        this.totalActions++;
        const removed = this.queue.shift();

        // Animate removal from front
        this.tweens.add({
            targets: [removed.passenger, removed.passengerText],
            x: 100,
            alpha: 0,
            duration: 500,
            onComplete: () => {
                removed.passenger.destroy();
                removed.passengerText.destroy();
            }
        });

        // Shift remaining passengers
        this.queue.forEach((item, index) => {
            const targetX = 600 - (index * 100);
            this.tweens.add({
                targets: [item.passenger, item.passengerText],
                x: targetX,
                duration: 300
            });
        });

        this.updateStatus();
        this.checkCompletion();
    }

    updateStatus() {
        const queueSize = this.queue.length;
        this.statusText.setText(`Queue Size: ${queueSize} | Actions: ${this.totalActions}/6`);
    }

    showMessage(msg, color) {
        const msgText = this.add.text(400, 400, msg, {
            fontSize: '18px',
            color: Phaser.Display.Color.IntegerToColor(color).rgba,
            fontStyle: 'bold'
        }).setOrigin(0.5).setAlpha(0);

        this.tweens.add({
            targets: msgText,
            alpha: 1,
            duration: 300,
            yoyo: true,
            hold: 1000,
            onComplete: () => msgText.destroy()
        });
    }

    checkCompletion() {
        // Check if 3 enqueues and 3 dequeues done (total 6 actions)
        if (this.totalActions >= 6 && this.queue.length === 0) {
            this.time.delayedCall(500, () => {
                const successText = this.add.text(400, 400, '✓ Data Key 3 Unlocked!\nCore Simulator Unlocked!', {
                    fontSize: '28px',
                    color: '#00ff00',
                    fontStyle: 'bold',
                    align: 'center'
                }).setOrigin(0.5).setAlpha(0);

                this.tweens.add({
                    targets: successText,
                    alpha: 1,
                    duration: 500
                });

                this.time.delayedCall(2500, () => {
                    const nextBtn = this.add.rectangle(400, 520, 250, 60, 0x4ecdc4)
                        .setInteractive({ useHandCursor: true })
                        .on('pointerdown', () => {
                            this.cameras.main.fadeOut(500);
                            this.time.delayedCall(500, () => this.scene.start('Level5_CoreSimulator'));
                        });

                    this.add.text(400, 520, 'FINAL LEVEL', {
                        fontSize: '24px',
                        color: '#000000',
                        fontStyle: 'bold'
                    }).setOrigin(0.5);
                });
            });
        }
    }
}

// ============================================
// LEVEL 5: CORE SIMULATOR (REVISION)
// ============================================
class Level5_CoreSimulator extends Phaser.Scene {
    constructor() {
        super({ key: 'Level5_CoreSimulator' });
        this.tasksCompleted = {
            array: false,
            stack: false,
            queue: false
        };
    }

    create() {
        // Background
        this.add.rectangle(400, 300, 800, 600, 0x0a0e27);
        
        // Title with glow effect
        const title = this.add.text(400, 50, 'Level 5: Core Simulator', {
            fontSize: '40px',
            fontFamily: 'Arial',
            color: '#00ffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Pulsing glow
        this.tweens.add({
            targets: title,
            alpha: 0.7,
            duration: 1000,
            yoyo: true,
            repeat: -1
        });

        // Instructions
        this.add.text(400, 110, 'Complete all three tasks to restore the Digital Realm!', {
            fontSize: '18px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Task 1: Array
        this.createArrayTask();
        
        // Task 2: Stack
        this.createStackTask();
        
        // Task 3: Queue
        this.createQueueTask();

        // Progress indicator
        this.progressText = this.add.text(400, 550, 'Progress: 0/3 Tasks Complete', {
            fontSize: '20px',
            color: '#ffd700',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.cameras.main.fadeIn(500);
    }

    createArrayTask() {
        // Task box
        const taskBox = this.add.rectangle(150, 220, 200, 150, 0x1e3a5f, 0.8);
        taskBox.setStrokeStyle(2, 0x4ecdc4);

        this.add.text(150, 160, 'Task 1: Array', {
            fontSize: '20px',
            color: '#4ecdc4',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(150, 190, 'Sort: [3, 1, 2]', {
            fontSize: '16px',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(150, 210, 'Click 2 numbers to swap', {
            fontSize: '12px',
            color: '#ffd700',
            fontStyle: 'italic'
        }).setOrigin(0.5);

        // Simple buttons for sorting
        const values = [3, 1, 2];
        const buttons = [];
        
        values.forEach((val, i) => {
            const btn = this.add.rectangle(90 + i * 60, 240, 50, 50, 0x3498db)
                .setInteractive({ useHandCursor: true });
            
            const text = this.add.text(90 + i * 60, 240, val.toString(), {
                fontSize: '24px',
                color: '#ffffff',
                fontStyle: 'bold'
            }).setOrigin(0.5);

            buttons.push({ btn, text, value: val });
        });

        // Check button
        const checkBtn = this.add.rectangle(150, 290, 120, 40, 0x00ff88)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                const currentOrder = buttons.map(b => b.value);
                if (JSON.stringify(currentOrder) === JSON.stringify([1, 2, 3])) {
                    this.completeTask('array');
                    checkBtn.setFillStyle(0x00cc66);
                    this.add.text(150, 330, '✓ Complete', {
                        fontSize: '16px',
                        color: '#00ff00',
                        fontStyle: 'bold'
                    }).setOrigin(0.5);
                }
            });

        this.add.text(150, 290, 'Check', {
            fontSize: '18px',
            color: '#000000',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Swap functionality
        let selected = null;
        buttons.forEach((item, index) => {
            item.btn.on('pointerdown', () => {
                if (!selected) {
                    selected = index;
                    item.btn.setFillStyle(0x2ecc71);
                } else {
                    // Swap
                    const temp = buttons[selected].value;
                    buttons[selected].value = item.value;
                    item.value = temp;
                    
                    buttons[selected].text.setText(buttons[selected].value.toString());
                    item.text.setText(item.value.toString());
                    
                    buttons[selected].btn.setFillStyle(0x3498db);
                    selected = null;
                }
            });
        });
    }

    createStackTask() {
        const taskBox = this.add.rectangle(400, 220, 200, 150, 0x1e3a5f, 0.8);
        taskBox.setStrokeStyle(2, 0xff6b6b);

        this.add.text(400, 160, 'Task 2: Stack', {
            fontSize: '20px',
            color: '#ff6b6b',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(400, 190, 'Push one item', {
            fontSize: '16px',
            color: '#ffffff'
        }).setOrigin(0.5);

        let pushed = false;
        const stackItem = this.add.rectangle(400, 240, 80, 40, 0xd4a574).setVisible(false);
        
        const pushBtn = this.add.rectangle(400, 270, 100, 40, 0xff6b6b)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                if (!pushed) {
                    stackItem.setVisible(true);
                    pushed = true;
                    this.completeTask('stack');
                    this.add.text(400, 310, '✓ Complete', {
                        fontSize: '16px',
                        color: '#00ff00',
                        fontStyle: 'bold'
                    }).setOrigin(0.5);
                }
            });

        this.add.text(400, 270, 'PUSH', {
            fontSize: '18px',
            color: '#000000',
            fontStyle: 'bold'
        }).setOrigin(0.5);
    }

    createQueueTask() {
        const taskBox = this.add.rectangle(650, 220, 200, 150, 0x1e3a5f, 0.8);
        taskBox.setStrokeStyle(2, 0x4ecdc4);

        this.add.text(650, 160, 'Task 3: Queue', {
            fontSize: '20px',
            color: '#4ecdc4',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(650, 190, 'Dequeue one item', {
            fontSize: '16px',
            color: '#ffffff'
        }).setOrigin(0.5);

        const queueItem = this.add.circle(650, 230, 20, 0xffe66d);
        
        const dequeueBtn = this.add.rectangle(650, 270, 120, 40, 0x4ecdc4)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.tweens.add({
                    targets: queueItem,
                    alpha: 0,
                    x: 550,
                    duration: 500,
                    onComplete: () => {
                        this.completeTask('queue');
                        this.add.text(650, 310, '✓ Complete', {
                            fontSize: '16px',
                            color: '#00ff00',
                            fontStyle: 'bold'
                        }).setOrigin(0.5);
                    }
                });
            });

        this.add.text(650, 270, 'DEQUEUE', {
            fontSize: '18px',
            color: '#000000',
            fontStyle: 'bold'
        }).setOrigin(0.5);
    }

    completeTask(taskName) {
        this.tasksCompleted[taskName] = true;
        
        const completed = Object.values(this.tasksCompleted).filter(v => v).length;
        this.progressText.setText(`Progress: ${completed}/3 Tasks Complete`);

        if (completed === 3) {
            this.time.delayedCall(1000, () => this.showVictory());
        }
    }

    showVictory() {
        // Dim background
        const overlay = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.7);

        // Victory message
        const victoryText = this.add.text(400, 200, '🎉 SYSTEM RESTORED! 🎉', {
            fontSize: '48px',
            fontFamily: 'Arial',
            color: '#00ff00',
            fontStyle: 'bold'
        }).setOrigin(0.5).setAlpha(0);

        this.tweens.add({
            targets: victoryText,
            alpha: 1,
            scale: 1.2,
            duration: 1000,
            ease: 'Bounce'
        });

        // Create Three.js-style rotating orb using Phaser graphics
        this.time.delayedCall(1500, () => {
            this.createGlowingOrb();
        });

        // Final message
        this.time.delayedCall(3000, () => {
            const finalMsg = this.add.text(400, 450, 'You rebuilt the Digital Realm!\nAll Data Keys Collected!', {
                fontSize: '24px',
                color: '#ffffff',
                align: 'center',
                fontStyle: 'bold'
            }).setOrigin(0.5).setAlpha(0);

            this.tweens.add({
                targets: finalMsg,
                alpha: 1,
                duration: 1000
            });

            // Restart button
            this.time.delayedCall(2000, () => {
                const restartBtn = this.add.rectangle(400, 530, 200, 50, 0x00ff88)
                    .setInteractive({ useHandCursor: true })
                    .on('pointerdown', () => {
                        this.cameras.main.fadeOut(500);
                        this.time.delayedCall(500, () => this.scene.start('Level1_DigitalAwakening'));
                    });

                this.add.text(400, 530, 'PLAY AGAIN', {
                    fontSize: '22px',
                    color: '#000000',
                    fontStyle: 'bold'
                }).setOrigin(0.5);
            });
        });
    }

    createGlowingOrb() {
        // Create a glowing orb effect using Phaser graphics
        const orb = this.add.circle(400, 300, 50, 0x00ffff, 0.8);
        
        // Outer glow
        const glow1 = this.add.circle(400, 300, 70, 0x00ffff, 0.3);
        const glow2 = this.add.circle(400, 300, 90, 0x00ffff, 0.1);

        // Rotation animation
        this.tweens.add({
            targets: [orb, glow1, glow2],
            angle: 360,
            duration: 3000,
            repeat: -1
        });

        // Pulse animation
        this.tweens.add({
            targets: orb,
            scale: 1.2,
            alpha: 1,
            duration: 1000,
            yoyo: true,
            repeat: -1
        });

        this.tweens.add({
            targets: glow1,
            scale: 1.3,
            alpha: 0.5,
            duration: 1500,
            yoyo: true,
            repeat: -1
        });

        this.tweens.add({
            targets: glow2,
            scale: 1.4,
            alpha: 0.3,
            duration: 2000,
            yoyo: true,
            repeat: -1
        });

        // Add particles
        const particles = this.add.particles(400, 300, 'particle', {
            speed: { min: 50, max: 100 },
            scale: { start: 0.5, end: 0 },
            blendMode: 'ADD',
            lifespan: 1000,
            frequency: 50,
            tint: 0x00ffff
        });

        // Create simple particle texture if not exists
        if (!this.textures.exists('particle')) {
            const graphics = this.add.graphics();
            graphics.fillStyle(0xffffff, 1);
            graphics.fillCircle(4, 4, 4);
            graphics.generateTexture('particle', 8, 8);
            graphics.destroy();
        }
    }
}

// ============================================
// GAME CONFIGURATION
// ============================================
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    backgroundColor: '#000000',
    scene: [
        Level1_DigitalAwakening,
        Level2_ArrayRealm,
        Level3_StackSummit,
        Level4_QueueQuarters,
        Level5_CoreSimulator
    ],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    }
};

// Initialize game
const game = new Phaser.Game(config);

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { game, config };
}
