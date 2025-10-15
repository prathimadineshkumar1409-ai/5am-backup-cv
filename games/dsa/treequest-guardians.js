/**
 * TreeQuest: Guardians of the Forest
 * A 5-level educational game about Tree Data Structures using Phaser.js
 * 
 * Levels:
 * 1. The Forest Awakens (Tree Basics)
 * 2. The Path of Traversal (Tree Traversals)
 * 3. The Binary Grove (Binary Search Trees)
 * 4. The Balanced Domain (AVL Trees)
 * 5. The Digital Canopy (Final Revision)
 */

// ============================================
// LEVEL 1: THE FOREST AWAKENS (TREE BASICS)
// ============================================
class Level1_ForestAwakens extends Phaser.Scene {
    constructor() {
        super({ key: 'Level1_ForestAwakens' });
        this.nodesExplored = 0;
    }

    create() {
        // Background
        this.add.rectangle(400, 300, 800, 600, 0x1a4d2e);
        
        // Title
        this.add.text(400, 50, 'Level 1: The Forest Awakens', {
            fontSize: '32px',
            fontFamily: 'Arial',
            color: '#7cfc00',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Story dialogue
        const storyText = `Welcome, Data Explorer!\n\nThe Digital Forest has lost its structure.\nTrees are the foundation of hierarchical data.\n\nClick on each node to learn about tree components.`;
        
        this.add.text(400, 140, storyText, {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#ffffff',
            align: 'center',
            lineSpacing: 8
        }).setOrigin(0.5);

        // Draw a simple tree structure
        this.createTreeDiagram();
        
        // Instructions
        this.add.text(400, 520, 'Click on each node to explore (3/3 required)', {
            fontSize: '14px',
            color: '#ffd700',
            fontStyle: 'italic'
        }).setOrigin(0.5);

        this.cameras.main.fadeIn(1000);
    }

    createTreeDiagram() {
        // Root node
        const rootNode = this.createNode(400, 250, 'ROOT', 0x228b22, 'The top node of the tree');
        
        // Left child
        const leftChild = this.createNode(300, 350, 'LEFT', 0x32cd32, 'Child node on the left');
        
        // Right child
        const rightChild = this.createNode(500, 350, 'RIGHT', 0x32cd32, 'Child node on the right');
        
        // Left leaf
        const leftLeaf = this.createNode(250, 450, 'LEAF', 0x90ee90, 'Node with no children');
        
        // Right leaf
        const rightLeaf = this.createNode(350, 450, 'LEAF', 0x90ee90, 'Node with no children');
        
        // Draw connections
        this.drawLine(400, 270, 300, 330);
        this.drawLine(400, 270, 500, 330);
        this.drawLine(300, 370, 250, 430);
        this.drawLine(300, 370, 350, 430);
    }

    createNode(x, y, label, color, description) {
        const circle = this.add.circle(x, y, 30, color);
        circle.setStrokeStyle(3, 0x7cfc00);
        circle.setInteractive({ useHandCursor: true });
        
        const text = this.add.text(x, y, label, {
            fontSize: '12px',
            color: '#000000',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        circle.on('pointerdown', () => {
            if (!circle.explored) {
                circle.explored = true;
                circle.setFillStyle(0xffd700);
                this.nodesExplored++;
                
                // Show description
                this.showDescription(description);
                
                // Check if all nodes explored
                if (this.nodesExplored >= 3) {
                    this.time.delayedCall(2000, () => this.showContinueButton());
                }
            }
        });

        circle.on('pointerover', () => {
            if (!circle.explored) {
                circle.setScale(1.1);
            }
        });

        circle.on('pointerout', () => {
            circle.setScale(1);
        });

        return circle;
    }

    drawLine(x1, y1, x2, y2) {
        const line = this.add.line(0, 0, x1, y1, x2, y2, 0x7cfc00, 0.5);
        line.setOrigin(0, 0);
        line.setLineWidth(2);
    }

    showDescription(text) {
        // Remove previous description if exists
        if (this.descriptionText) {
            this.descriptionText.destroy();
        }
        
        this.descriptionText = this.add.text(400, 550, text, {
            fontSize: '14px',
            color: '#7cfc00',
            fontStyle: 'italic'
        }).setOrigin(0.5);
    }

    showContinueButton() {
        const button = this.add.rectangle(400, 560, 200, 50, 0x7cfc00)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => button.setFillStyle(0x90ee90))
            .on('pointerout', () => button.setFillStyle(0x7cfc00))
            .on('pointerdown', () => {
                this.cameras.main.fadeOut(500);
                this.time.delayedCall(500, () => this.scene.start('Level2_PathOfTraversal'));
            });

        this.add.text(400, 560, 'CONTINUE →', {
            fontSize: '20px',
            color: '#000000',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.tweens.add({
            targets: button,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 600,
            yoyo: true,
            repeat: -1
        });
    }
}

// ============================================
// LEVEL 2: THE PATH OF TRAVERSAL
// ============================================
class Level2_PathOfTraversal extends Phaser.Scene {
    constructor() {
        super({ key: 'Level2_PathOfTraversal' });
        this.currentMode = 'inorder';
        this.clickSequence = [];
        this.correctSequences = {
            'inorder': [4, 2, 5, 1, 3],
            'preorder': [1, 2, 4, 5, 3],
            'postorder': [4, 5, 2, 3, 1]
        };
        this.completedModes = [];
    }

    create() {
        // Background
        this.add.rectangle(400, 300, 800, 600, 0x2d5016);
        
        // Title
        this.add.text(400, 40, 'Level 2: The Path of Traversal', {
            fontSize: '28px',
            color: '#7cfc00',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Instructions
        this.instructionText = this.add.text(400, 90, 'Click nodes in INORDER sequence (Left-Root-Right)', {
            fontSize: '16px',
            color: '#ffd700'
        }).setOrigin(0.5);

        // Create tree
        this.createTraversalTree();
        
        // Mode buttons
        this.createModeButtons();
        
        // Reset button
        this.createResetButton();

        this.cameras.main.fadeIn(500);
    }

    createTraversalTree() {
        // Tree structure:
        //       1
        //      / \
        //     2   3
        //    / \
        //   4   5
        
        this.nodes = [];
        
        // Root
        this.nodes[1] = this.createTraversalNode(400, 200, '1');
        
        // Level 2
        this.nodes[2] = this.createTraversalNode(300, 300, '2');
        this.nodes[3] = this.createTraversalNode(500, 300, '3');
        
        // Level 3
        this.nodes[4] = this.createTraversalNode(250, 400, '4');
        this.nodes[5] = this.createTraversalNode(350, 400, '5');
        
        // Draw connections
        this.drawLine(400, 220, 300, 280);
        this.drawLine(400, 220, 500, 280);
        this.drawLine(300, 320, 250, 380);
        this.drawLine(300, 320, 350, 380);
    }

    createTraversalNode(x, y, value) {
        const circle = this.add.circle(x, y, 25, 0x228b22);
        circle.setStrokeStyle(3, 0x7cfc00);
        circle.setInteractive({ useHandCursor: true });
        circle.value = parseInt(value);
        circle.clicked = false;
        
        const text = this.add.text(x, y, value, {
            fontSize: '20px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        circle.on('pointerdown', () => {
            if (!circle.clicked) {
                circle.clicked = true;
                circle.setFillStyle(0xffd700);
                this.clickSequence.push(circle.value);
                
                // Check if sequence is complete
                if (this.clickSequence.length === 5) {
                    this.checkSequence();
                }
            }
        });

        return circle;
    }

    createModeButtons() {
        const modes = [
            { key: 'inorder', label: 'Inorder', x: 200 },
            { key: 'preorder', label: 'Preorder', x: 400 },
            { key: 'postorder', label: 'Postorder', x: 600 }
        ];

        modes.forEach(mode => {
            const button = this.add.rectangle(mode.x, 500, 150, 40, 0x32cd32)
                .setInteractive({ useHandCursor: true })
                .on('pointerdown', () => this.switchMode(mode.key));

            this.add.text(mode.x, 500, mode.label, {
                fontSize: '16px',
                color: '#000000',
                fontStyle: 'bold'
            }).setOrigin(0.5);

            if (mode.key === this.currentMode) {
                button.setFillStyle(0x7cfc00);
            }
        });
    }

    createResetButton() {
        const button = this.add.rectangle(400, 550, 120, 35, 0xff6b6b)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.resetSequence());

        this.add.text(400, 550, 'RESET', {
            fontSize: '14px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
    }

    switchMode(mode) {
        if (!this.completedModes.includes(mode)) {
            this.currentMode = mode;
            this.resetSequence();
            
            const modeTexts = {
                'inorder': 'Click nodes in INORDER sequence (Left-Root-Right)',
                'preorder': 'Click nodes in PREORDER sequence (Root-Left-Right)',
                'postorder': 'Click nodes in POSTORDER sequence (Left-Right-Root)'
            };
            
            this.instructionText.setText(modeTexts[mode]);
            this.scene.restart();
        }
    }

    resetSequence() {
        this.clickSequence = [];
        this.nodes.forEach(node => {
            if (node) {
                node.clicked = false;
                node.setFillStyle(0x228b22);
            }
        });
    }

    checkSequence() {
        const correct = JSON.stringify(this.clickSequence) === 
                       JSON.stringify(this.correctSequences[this.currentMode]);

        if (correct) {
            this.completedModes.push(this.currentMode);
            
            this.add.text(400, 470, '✓ Correct!', {
                fontSize: '24px',
                color: '#00ff00',
                fontStyle: 'bold'
            }).setOrigin(0.5);

            if (this.completedModes.length === 3) {
                this.time.delayedCall(1500, () => this.showNextLevelButton());
            } else {
                this.time.delayedCall(1500, () => {
                    const nextMode = ['inorder', 'preorder', 'postorder']
                        .find(m => !this.completedModes.includes(m));
                    this.switchMode(nextMode);
                });
            }
        } else {
            this.add.text(400, 470, '✗ Try Again', {
                fontSize: '20px',
                color: '#ff0000',
                fontStyle: 'bold'
            }).setOrigin(0.5);

            this.time.delayedCall(1000, () => this.resetSequence());
        }
    }

    showNextLevelButton() {
        const button = this.add.rectangle(400, 560, 200, 50, 0x7cfc00)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.cameras.main.fadeOut(500);
                this.time.delayedCall(500, () => this.scene.start('Level3_BinaryGrove'));
            });

        this.add.text(400, 560, 'NEXT LEVEL →', {
            fontSize: '20px',
            color: '#000000',
            fontStyle: 'bold'
        }).setOrigin(0.5);
    }

    drawLine(x1, y1, x2, y2) {
        const line = this.add.line(0, 0, x1, y1, x2, y2, 0x7cfc00, 0.5);
        line.setOrigin(0, 0);
        line.setLineWidth(2);
    }
}

// ============================================
// LEVEL 3: THE BINARY GROVE (BST)
// ============================================
class Level3_BinaryGrove extends Phaser.Scene {
    constructor() {
        super({ key: 'Level3_BinaryGrove' });
        this.numbers = [50, 30, 70, 20, 40, 60, 80];
        this.placedNumbers = {};
    }

    create() {
        // Background
        this.add.rectangle(400, 300, 800, 600, 0x1f3a1f);
        
        // Title
        this.add.text(400, 40, 'Level 3: The Binary Grove', {
            fontSize: '28px',
            color: '#7cfc00',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Instructions
        this.add.text(400, 85, 'Drag numbers to build a Binary Search Tree (Left < Root < Right)', {
            fontSize: '14px',
            color: '#ffd700'
        }).setOrigin(0.5);

        // Create BST slots
        this.createBSTSlots();
        
        // Create draggable numbers
        this.createDraggableNumbers();
        
        // Check button
        this.createCheckButton();

        this.cameras.main.fadeIn(500);
    }

    createBSTSlots() {
        this.slots = {};
        
        // Root
        this.slots['root'] = this.createSlot(400, 180, 'root', null);
        
        // Level 2
        this.slots['left'] = this.createSlot(300, 280, 'left', 'root');
        this.slots['right'] = this.createSlot(500, 280, 'right', 'root');
        
        // Level 3
        this.slots['left-left'] = this.createSlot(250, 380, 'left-left', 'left');
        this.slots['left-right'] = this.createSlot(350, 380, 'left-right', 'left');
        this.slots['right-left'] = this.createSlot(450, 380, 'right-left', 'right');
        this.slots['right-right'] = this.createSlot(550, 380, 'right-right', 'right');
        
        // Draw tree structure
        this.drawLine(400, 200, 300, 260);
        this.drawLine(400, 200, 500, 260);
        this.drawLine(300, 300, 250, 360);
        this.drawLine(300, 300, 350, 360);
        this.drawLine(500, 300, 450, 360);
        this.drawLine(500, 300, 550, 360);
    }

    createSlot(x, y, id, parent) {
        const circle = this.add.circle(x, y, 30, 0x2d5016);
        circle.setStrokeStyle(2, 0x7cfc00);
        circle.slotId = id;
        circle.parent = parent;
        circle.value = null;
        
        return circle;
    }

    createDraggableNumbers() {
        const startX = 150;
        const startY = 500;
        const spacing = 80;

        this.numbers.forEach((num, index) => {
            const x = startX + (index * spacing);
            const circle = this.add.circle(x, startY, 25, 0xffd700);
            circle.setStrokeStyle(2, 0x7cfc00);
            circle.setInteractive({ draggable: true, useHandCursor: true });
            circle.value = num;
            
            const text = this.add.text(x, startY, num.toString(), {
                fontSize: '18px',
                color: '#000000',
                fontStyle: 'bold'
            }).setOrigin(0.5);
            
            circle.textObj = text;

            this.input.setDraggable(circle);

            circle.on('drag', (pointer, dragX, dragY) => {
                circle.x = dragX;
                circle.y = dragY;
                text.x = dragX;
                text.y = dragY;
            });

            circle.on('dragend', () => {
                this.checkDrop(circle);
            });
        });
    }

    checkDrop(circle) {
        let placed = false;
        
        Object.values(this.slots).forEach(slot => {
            const distance = Phaser.Math.Distance.Between(circle.x, circle.y, slot.x, slot.y);
            
            if (distance < 40 && slot.value === null) {
                // Snap to slot
                circle.x = slot.x;
                circle.y = slot.y;
                circle.textObj.x = slot.x;
                circle.textObj.y = slot.y;
                slot.value = circle.value;
                circle.disableInteractive();
                this.placedNumbers[slot.slotId] = circle.value;
                placed = true;
            }
        });

        if (!placed) {
            // Return to original position
            circle.x = circle.input.dragStartX;
            circle.y = circle.input.dragStartY;
            circle.textObj.x = circle.input.dragStartX;
            circle.textObj.y = circle.input.dragStartY;
        }
    }

    createCheckButton() {
        const button = this.add.rectangle(400, 550, 150, 45, 0x7cfc00)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.checkBST());

        this.add.text(400, 550, 'CHECK BST', {
            fontSize: '18px',
            color: '#000000',
            fontStyle: 'bold'
        }).setOrigin(0.5);
    }

    checkBST() {
        if (Object.keys(this.placedNumbers).length !== 7) {
            this.showMessage('Place all numbers first!', 0xff0000);
            return;
        }

        // Validate BST property
        const isValid = this.validateBST();

        if (isValid) {
            this.showMessage('✓ BST Restored!', 0x00ff00);
            this.time.delayedCall(2000, () => this.showNextLevelButton());
        } else {
            this.showMessage('✗ Not a valid BST. Try again!', 0xff0000);
        }
    }

    validateBST() {
        const root = this.placedNumbers['root'];
        const left = this.placedNumbers['left'];
        const right = this.placedNumbers['right'];
        const ll = this.placedNumbers['left-left'];
        const lr = this.placedNumbers['left-right'];
        const rl = this.placedNumbers['right-left'];
        const rr = this.placedNumbers['right-right'];

        // Check BST property
        if (left >= root || right <= root) return false;
        if (ll >= left || lr <= left || lr >= root) return false;
        if (rl <= root || rl >= right || rr <= right) return false;

        return true;
    }

    showMessage(text, color) {
        if (this.messageText) {
            this.messageText.destroy();
        }
        
        this.messageText = this.add.text(400, 120, text, {
            fontSize: '20px',
            color: Phaser.Display.Color.IntegerToColor(color).rgba,
            fontStyle: 'bold'
        }).setOrigin(0.5);
    }

    showNextLevelButton() {
        const button = this.add.rectangle(400, 560, 200, 50, 0x7cfc00)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.cameras.main.fadeOut(500);
                this.time.delayedCall(500, () => this.scene.start('Level4_BalancedDomain'));
            });

        this.add.text(400, 560, 'NEXT LEVEL →', {
            fontSize: '20px',
            color: '#000000',
            fontStyle: 'bold'
        }).setOrigin(0.5);
    }

    drawLine(x1, y1, x2, y2) {
        const line = this.add.line(0, 0, x1, y1, x2, y2, 0x7cfc00, 0.5);
        line.setOrigin(0, 0);
        line.setLineWidth(2);
    }
}

// ============================================
// LEVEL 4: THE BALANCED DOMAIN (AVL)
// ============================================
class Level4_BalancedDomain extends Phaser.Scene {
    constructor() {
        super({ key: 'Level4_BalancedDomain' });
        this.rotationsDone = 0;
    }

    create() {
        // Background
        this.add.rectangle(400, 300, 800, 600, 0x1a4d2e);
        
        // Title
        this.add.text(400, 40, 'Level 4: The Balanced Domain', {
            fontSize: '28px',
            color: '#7cfc00',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Instructions
        this.add.text(400, 85, 'Perform rotations to balance the tree (Balance Factor: -1, 0, or 1)', {
            fontSize: '14px',
            color: '#ffd700'
        }).setOrigin(0.5);

        // Create unbalanced tree
        this.createUnbalancedTree();
        
        // Rotation buttons
        this.createRotationButtons();

        this.cameras.main.fadeIn(500);
    }

    createUnbalancedTree() {
        // Unbalanced tree: 30 -> 20 -> 10 (left-heavy)
        this.nodes = {};
        
        this.nodes[30] = this.createAVLNode(400, 200, '30', 2);
        this.nodes[20] = this.createAVLNode(300, 300, '20', 1);
        this.nodes[10] = this.createAVLNode(200, 400, '10', 0);
        
        this.drawLine(400, 220, 300, 280);
        this.drawLine(300, 320, 200, 380);
    }

    createAVLNode(x, y, value, height) {
        const balanceFactor = height > 1 ? height - 1 : 0;
        const color = balanceFactor > 1 ? 0xff6b6b : 0x228b22;
        
        const circle = this.add.circle(x, y, 30, color);
        circle.setStrokeStyle(3, 0x7cfc00);
        circle.value = parseInt(value);
        circle.height = height;
        circle.x_pos = x;
        circle.y_pos = y;
        
        const text = this.add.text(x, y, value, {
            fontSize: '20px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Height indicator
        this.add.text(x + 40, y, `h:${height}`, {
            fontSize: '12px',
            color: '#ffd700'
        });

        return { circle, text };
    }

    createRotationButtons() {
        const leftBtn = this.add.rectangle(300, 500, 150, 45, 0x32cd32)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.performRotation('left'));

        this.add.text(300, 500, 'Left Rotation', {
            fontSize: '16px',
            color: '#000000',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const rightBtn = this.add.rectangle(500, 500, 150, 45, 0x32cd32)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.performRotation('right'));

        this.add.text(500, 500, 'Right Rotation', {
            fontSize: '16px',
            color: '#000000',
            fontStyle: 'bold'
        }).setOrigin(0.5);
    }

    performRotation(direction) {
        if (direction === 'right' && this.rotationsDone === 0) {
            // Correct rotation for this unbalanced tree
            this.rotationsDone++;
            this.showMessage('✓ Tree Balanced!', 0x00ff00);
            
            // Animate to balanced state
            this.time.delayedCall(1500, () => {
                this.scene.restart();
                this.createBalancedTree();
                this.time.delayedCall(1000, () => this.showNextLevelButton());
            });
        } else {
            this.showMessage('✗ Wrong rotation. Try again!', 0xff0000);
        }
    }

    createBalancedTree() {
        this.children.removeAll();
        
        // Background
        this.add.rectangle(400, 300, 800, 600, 0x1a4d2e);
        
        // Title
        this.add.text(400, 40, 'Level 4: The Balanced Domain', {
            fontSize: '28px',
            color: '#7cfc00',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Balanced tree: 20 as root, 10 and 30 as children
        this.createAVLNode(400, 250, '20', 1);
        this.createAVLNode(300, 350, '10', 0);
        this.createAVLNode(500, 350, '30', 0);
        
        this.drawLine(400, 270, 300, 330);
        this.drawLine(400, 270, 500, 330);
        
        this.add.text(400, 450, '✓ Data Core Activated!', {
            fontSize: '24px',
            color: '#00ff00',
            fontStyle: 'bold'
        }).setOrigin(0.5);
    }

    showMessage(text, color) {
        if (this.messageText) {
            this.messageText.destroy();
        }
        
        this.messageText = this.add.text(400, 120, text, {
            fontSize: '20px',
            color: Phaser.Display.Color.IntegerToColor(color).rgba,
            fontStyle: 'bold'
        }).setOrigin(0.5);
    }

    showNextLevelButton() {
        const button = this.add.rectangle(400, 520, 200, 50, 0x7cfc00)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.cameras.main.fadeOut(500);
                this.time.delayedCall(500, () => this.scene.start('Level5_DigitalCanopy'));
            });

        this.add.text(400, 520, 'FINAL LEVEL →', {
            fontSize: '20px',
            color: '#000000',
            fontStyle: 'bold'
        }).setOrigin(0.5);
    }

    drawLine(x1, y1, x2, y2) {
        const line = this.add.line(0, 0, x1, y1, x2, y2, 0x7cfc00, 0.5);
        line.setOrigin(0, 0);
        line.setLineWidth(2);
    }
}

// ============================================
// LEVEL 5: THE DIGITAL CANOPY (FINAL REVISION)
// ============================================
class Level5_DigitalCanopy extends Phaser.Scene {
    constructor() {
        super({ key: 'Level5_DigitalCanopy' });
        this.tasksCompleted = {
            root: false,
            traversal: false,
            bst: false,
            rotation: false
        };
    }

    create() {
        // Background
        this.add.rectangle(400, 300, 800, 600, 0x0a1f0a);
        
        // Title with glow
        const title = this.add.text(400, 40, 'Level 5: The Digital Canopy', {
            fontSize: '32px',
            color: '#7cfc00',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.tweens.add({
            targets: title,
            alpha: 0.7,
            duration: 1000,
            yoyo: true,
            repeat: -1
        });

        // Instructions
        this.add.text(400, 85, 'Complete all tasks to restore the Forest of Data!', {
            fontSize: '16px',
            color: '#ffd700'
        }).setOrigin(0.5);

        // Create tasks
        this.createTask1(); // Identify root
        this.createTask2(); // Choose traversal
        this.createTask3(); // BST position
        this.createTask4(); // Rotation

        // Progress
        this.progressText = this.add.text(400, 560, 'Progress: 0/4 Tasks Complete', {
            fontSize: '18px',
            color: '#ffd700',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.cameras.main.fadeIn(500);
    }

    createTask1() {
        // Task: Identify root node
        const box = this.add.rectangle(150, 180, 180, 120, 0x1e3a1e, 0.8);
        box.setStrokeStyle(2, 0x7cfc00);

        this.add.text(150, 130, 'Task 1: Find Root', {
            fontSize: '16px',
            color: '#7cfc00',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Simple tree
        const nodes = [
            { x: 150, y: 160, val: 'A', isRoot: true },
            { x: 120, y: 200, val: 'B', isRoot: false },
            { x: 180, y: 200, val: 'C', isRoot: false }
        ];

        nodes.forEach(n => {
            const circle = this.add.circle(n.x, n.y, 15, 0x228b22)
                .setInteractive({ useHandCursor: true });
            
            this.add.text(n.x, n.y, n.val, {
                fontSize: '14px',
                color: '#fff',
                fontStyle: 'bold'
            }).setOrigin(0.5);

            circle.on('pointerdown', () => {
                if (n.isRoot) {
                    circle.setFillStyle(0xffd700);
                    this.completeTask('root');
                }
            });
        });
    }

    createTask2() {
        // Task: Choose correct traversal
        const box = this.add.rectangle(400, 180, 180, 120, 0x1e3a1e, 0.8);
        box.setStrokeStyle(2, 0x7cfc00);

        this.add.text(400, 130, 'Task 2: Traversal', {
            fontSize: '16px',
            color: '#7cfc00',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(400, 155, 'Inorder gives:', {
            fontSize: '12px',
            color: '#fff'
        }).setOrigin(0.5);

        const options = ['Sorted', 'Random', 'Reverse'];
        options.forEach((opt, i) => {
            const btn = this.add.rectangle(400, 180 + i * 30, 140, 25, 0x32cd32)
                .setInteractive({ useHandCursor: true });
            
            this.add.text(400, 180 + i * 30, opt, {
                fontSize: '12px',
                color: '#000',
                fontStyle: 'bold'
            }).setOrigin(0.5);

            btn.on('pointerdown', () => {
                if (i === 0) {
                    btn.setFillStyle(0xffd700);
                    this.completeTask('traversal');
                }
            });
        });
    }

    createTask3() {
        // Task: Place number in BST
        const box = this.add.rectangle(650, 180, 180, 120, 0x1e3a1e, 0.8);
        box.setStrokeStyle(2, 0x7cfc00);

        this.add.text(650, 130, 'Task 3: BST Insert', {
            fontSize: '16px',
            color: '#7cfc00',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(650, 155, 'Where does 25 go?', {
            fontSize: '12px',
            color: '#fff'
        }).setOrigin(0.5);

        // Tree: 30 with 20 on left
        this.add.circle(650, 180, 12, 0x228b22);
        this.add.text(650, 180, '30', { fontSize: '10px', color: '#fff' }).setOrigin(0.5);
        
        this.add.circle(620, 210, 12, 0x228b22);
        this.add.text(620, 210, '20', { fontSize: '10px', color: '#fff' }).setOrigin(0.5);

        const rightSlot = this.add.circle(680, 210, 12, 0x2d5016)
            .setStrokeStyle(2, 0x7cfc00)
            .setInteractive({ useHandCursor: true });

        rightSlot.on('pointerdown', () => {
            this.add.text(680, 210, '25', { fontSize: '10px', color: '#000', fontStyle: 'bold' }).setOrigin(0.5);
            rightSlot.setFillStyle(0xffd700);
            this.completeTask('bst');
        });
    }

    createTask4() {
        // Task: Perform rotation
        const box = this.add.rectangle(400, 380, 300, 140, 0x1e3a1e, 0.8);
        box.setStrokeStyle(2, 0x7cfc00);

        this.add.text(400, 320, 'Task 4: Balance Tree', {
            fontSize: '16px',
            color: '#7cfc00',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(400, 345, 'Tree is left-heavy. Which rotation?', {
            fontSize: '12px',
            color: '#fff'
        }).setOrigin(0.5);

        const rotations = ['Left', 'Right', 'LR', 'RL'];
        rotations.forEach((rot, i) => {
            const btn = this.add.rectangle(300 + i * 60, 390, 50, 30, 0x32cd32)
                .setInteractive({ useHandCursor: true });
            
            this.add.text(300 + i * 60, 390, rot, {
                fontSize: '11px',
                color: '#000',
                fontStyle: 'bold'
            }).setOrigin(0.5);

            btn.on('pointerdown', () => {
                if (i === 1) { // Right rotation
                    btn.setFillStyle(0xffd700);
                    this.completeTask('rotation');
                }
            });
        });
    }

    completeTask(taskName) {
        if (!this.tasksCompleted[taskName]) {
            this.tasksCompleted[taskName] = true;
            
            const completed = Object.values(this.tasksCompleted).filter(v => v).length;
            this.progressText.setText(`Progress: ${completed}/4 Tasks Complete`);

            if (completed === 4) {
                this.time.delayedCall(1000, () => this.showVictory());
            }
        }
    }

    showVictory() {
        // Dim background
        this.add.rectangle(400, 300, 800, 600, 0x000000, 0.7);

        // Victory message
        const victoryText = this.add.text(400, 200, '🎉 FOREST RESTORED! 🎉', {
            fontSize: '42px',
            color: '#7cfc00',
            fontStyle: 'bold'
        }).setOrigin(0.5).setAlpha(0);

        this.tweens.add({
            targets: victoryText,
            alpha: 1,
            scale: 1.2,
            duration: 1000,
            ease: 'Bounce'
        });

        // Create glowing tree
        this.time.delayedCall(1500, () => {
            this.createGlowingTree();
        });

        // Final message
        this.time.delayedCall(3000, () => {
            const finalMsg = this.add.text(400, 450, 'The Forest of Data is Restored!\nAll Tree Concepts Mastered!', {
                fontSize: '20px',
                color: '#ffffff',
                align: 'center',
                fontStyle: 'bold'
            }).setOrigin(0.5).setAlpha(0);

            this.tweens.add({
                targets: finalMsg,
                alpha: 1,
                duration: 1000
            });

            // Play again button
            this.time.delayedCall(2000, () => {
                const restartBtn = this.add.rectangle(400, 530, 200, 50, 0x7cfc00)
                    .setInteractive({ useHandCursor: true })
                    .on('pointerdown', () => {
                        this.cameras.main.fadeOut(500);
                        this.time.delayedCall(500, () => this.scene.start('Level1_ForestAwakens'));
                    });

                this.add.text(400, 530, 'PLAY AGAIN', {
                    fontSize: '20px',
                    color: '#000000',
                    fontStyle: 'bold'
                }).setOrigin(0.5);
            });
        });
    }

    createGlowingTree() {
        // Create glowing tree effect
        const tree = this.add.circle(400, 300, 50, 0x7cfc00, 0.8);
        
        // Outer glows
        const glow1 = this.add.circle(400, 300, 70, 0x7cfc00, 0.3);
        const glow2 = this.add.circle(400, 300, 90, 0x7cfc00, 0.1);

        // Rotation animation
        this.tweens.add({
            targets: [tree, glow1, glow2],
            angle: 360,
            duration: 3000,
            repeat: -1
        });

        // Pulse animation
        this.tweens.add({
            targets: tree,
            scale: 1.2,
            alpha: 1,
            duration: 1000,
            yoyo: true,
            repeat: -1
        });

        // Particles
        if (!this.textures.exists('particle')) {
            const graphics = this.add.graphics();
            graphics.fillStyle(0xffffff, 1);
            graphics.fillCircle(4, 4, 4);
            graphics.generateTexture('particle', 8, 8);
            graphics.destroy();
        }

        const particles = this.add.particles(400, 300, 'particle', {
            speed: { min: 50, max: 100 },
            scale: { start: 0.5, end: 0 },
            blendMode: 'ADD',
            lifespan: 1000,
            frequency: 50,
            tint: 0x7cfc00
        });
    }

    drawLine(x1, y1, x2, y2) {
        const line = this.add.line(0, 0, x1, y1, x2, y2, 0x7cfc00, 0.5);
        line.setOrigin(0, 0);
        line.setLineWidth(2);
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
        Level1_ForestAwakens,
        Level2_PathOfTraversal,
        Level3_BinaryGrove,
        Level4_BalancedDomain,
        Level5_DigitalCanopy
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
