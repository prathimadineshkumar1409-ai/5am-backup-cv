/**
 * GraphQuest: The Network Nexus
 * A 5-level educational game about Graph Algorithms using Phaser.js
 * 
 * Levels:
 * 1. The Broken Network (Graph Basics)
 * 2. Path of Exploration (BFS)
 * 3. The Depth Realm (DFS)
 * 4. The Path of Light (Dijkstra's Algorithm)
 * 5. The Network Core (Minimum Spanning Tree)
 */

// ============================================
// LEVEL 1: THE BROKEN NETWORK (GRAPH BASICS)
// ============================================
class Level1_BrokenNetwork extends Phaser.Scene {
    constructor() {
        super({ key: 'Level1_BrokenNetwork' });
        this.connections = 0;
        this.requiredConnections = 5;
    }

    create() {
        // Background
        this.add.rectangle(400, 300, 800, 600, 0x0f2027);
        
        // Title
        this.add.text(400, 50, 'Level 1: The Broken Network', {
            fontSize: '32px',
            color: '#00d4ff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Story
        const story = `The Digital Network has lost its connections.\nClick pairs of nodes to restore the network.`;
        this.add.text(400, 120, story, {
            fontSize: '16px',
            color: '#ffffff',
            align: 'center',
            lineSpacing: 8
        }).setOrigin(0.5);

        // Create nodes
        this.createNodes();
        
        // Instructions
        this.instructionText = this.add.text(400, 520, 'Click two nodes to connect them (0/5 connections)', {
            fontSize: '14px',
            color: '#ffd700'
        }).setOrigin(0.5);

        this.selectedNode = null;
        this.edges = [];

        this.cameras.main.fadeIn(1000);
    }

    createNodes() {
        this.nodes = [];
        const positions = [
            { x: 400, y: 250, label: 'A' },
            { x: 300, y: 350, label: 'B' },
            { x: 500, y: 350, label: 'C' },
            { x: 250, y: 450, label: 'D' },
            { x: 550, y: 450, label: 'E' }
        ];

        positions.forEach(pos => {
            const circle = this.add.circle(pos.x, pos.y, 30, 0x1e3a8a);
            circle.setStrokeStyle(3, 0x00d4ff);
            circle.setInteractive({ useHandCursor: true });
            circle.label = pos.label;
            circle.connections = [];
            
            const text = this.add.text(pos.x, pos.y, pos.label, {
                fontSize: '20px',
                color: '#ffffff',
                fontStyle: 'bold'
            }).setOrigin(0.5);

            circle.on('pointerdown', () => this.selectNode(circle));
            circle.on('pointerover', () => circle.setScale(1.1));
            circle.on('pointerout', () => circle.setScale(1));

            this.nodes.push(circle);
        });
    }

    selectNode(node) {
        if (!this.selectedNode) {
            this.selectedNode = node;
            node.setFillStyle(0xffd700);
        } else {
            if (this.selectedNode !== node && !this.isConnected(this.selectedNode, node)) {
                this.connectNodes(this.selectedNode, node);
                this.connections++;
                this.instructionText.setText(`Click two nodes to connect them (${this.connections}/${this.requiredConnections} connections)`);
                
                if (this.connections >= this.requiredConnections) {
                    this.time.delayedCall(1000, () => this.showSuccess());
                }
            }
            this.selectedNode.setFillStyle(0x1e3a8a);
            this.selectedNode = null;
        }
    }

    isConnected(node1, node2) {
        return node1.connections.includes(node2);
    }

    connectNodes(node1, node2) {
        const line = this.add.line(0, 0, node1.x, node1.y, node2.x, node2.y, 0x00d4ff);
        line.setOrigin(0, 0);
        line.setLineWidth(3);
        line.setDepth(-1);
        
        node1.connections.push(node2);
        node2.connections.push(node1);
        this.edges.push(line);
    }

    showSuccess() {
        this.add.text(400, 180, '✓ Network Initialized!', {
            fontSize: '28px',
            color: '#00ff00',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.time.delayedCall(1500, () => {
            const btn = this.add.rectangle(400, 560, 200, 50, 0x00d4ff)
                .setInteractive({ useHandCursor: true })
                .on('pointerdown', () => {
                    this.cameras.main.fadeOut(500);
                    this.time.delayedCall(500, () => this.scene.start('Level2_PathOfExploration'));
                });

            this.add.text(400, 560, 'NEXT LEVEL →', {
                fontSize: '20px',
                color: '#000000',
                fontStyle: 'bold'
            }).setOrigin(0.5);
        });
    }
}

// ============================================
// LEVEL 2: PATH OF EXPLORATION (BFS)
// ============================================
class Level2_PathOfExploration extends Phaser.Scene {
    constructor() {
        super({ key: 'Level2_PathOfExploration' });
        this.clickSequence = [];
        this.correctBFS = ['A', 'B', 'C', 'D', 'E'];
    }

    create() {
        // Background
        this.add.rectangle(400, 300, 800, 600, 0x203a43);
        
        // Title
        this.add.text(400, 40, 'Level 2: Path of Exploration (BFS)', {
            fontSize: '28px',
            color: '#00d4ff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Instructions
        this.add.text(400, 90, 'Click nodes in Breadth-First Search order (starting from A)', {
            fontSize: '16px',
            color: '#ffd700'
        }).setOrigin(0.5);

        // Hint
        this.add.text(400, 120, 'Hint: Visit all neighbors of A first (B, C), then their neighbors (D, E)', {
            fontSize: '13px',
            color: '#7dd3fc',
            fontStyle: 'italic'
        }).setOrigin(0.5);

        // Create graph
        this.createBFSGraph();
        
        // Progress tracker
        this.progressText = this.add.text(400, 500, 'Progress: 0/5 nodes clicked', {
            fontSize: '16px',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // Reset button
        const resetBtn = this.add.rectangle(400, 550, 120, 40, 0xff6b6b)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.clickSequence = [];
                this.scene.restart();
            });

        this.add.text(400, 550, 'RESET', {
            fontSize: '16px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.cameras.main.fadeIn(500);
    }

    createBFSGraph() {
        // Graph: A-B-C
        //        | |
        //        D-E
        const positions = {
            'A': { x: 400, y: 200 },
            'B': { x: 300, y: 300 },
            'C': { x: 500, y: 300 },
            'D': { x: 300, y: 400 },
            'E': { x: 500, y: 400 }
        };

        // Draw edges first
        this.drawEdge(400, 200, 300, 300); // A-B
        this.drawEdge(400, 200, 500, 300); // A-C
        this.drawEdge(300, 300, 300, 400); // B-D
        this.drawEdge(500, 300, 500, 400); // C-E

        // Create nodes
        this.nodes = {};
        Object.keys(positions).forEach(label => {
            const pos = positions[label];
            const circle = this.add.circle(pos.x, pos.y, 30, 0x1e3a8a);
            circle.setStrokeStyle(3, 0x00d4ff);
            circle.setInteractive({ useHandCursor: true });
            circle.label = label;
            circle.clicked = false;
            
            const text = this.add.text(pos.x, pos.y, label, {
                fontSize: '20px',
                color: '#ffffff',
                fontStyle: 'bold'
            }).setOrigin(0.5);

            circle.on('pointerdown', () => this.clickNode(circle));
            this.nodes[label] = circle;
        });
    }

    clickNode(node) {
        if (!node.clicked) {
            node.clicked = true;
            node.setFillStyle(0x00ff00);
            this.clickSequence.push(node.label);
            
            // Update progress
            this.progressText.setText(`Progress: ${this.clickSequence.length}/5 nodes clicked`);
            
            // Add number to show order
            this.add.text(node.x - 45, node.y, this.clickSequence.length.toString(), {
                fontSize: '16px',
                color: '#ffd700',
                fontStyle: 'bold',
                backgroundColor: '#000000',
                padding: { x: 4, y: 2 }
            });
            
            if (this.clickSequence.length === 5) {
                this.time.delayedCall(500, () => this.checkBFS());
            }
        }
    }

    checkBFS() {
        const correct = JSON.stringify(this.clickSequence) === JSON.stringify(this.correctBFS);
        
        // Clear progress text
        this.progressText.setVisible(false);
        
        if (correct) {
            const successMsg = this.add.text(400, 470, '✓ BFS Complete! Correct Order!', {
                fontSize: '24px',
                color: '#00ff00',
                fontStyle: 'bold'
            }).setOrigin(0.5);

            this.time.delayedCall(1000, () => this.showNextButton());
        } else {
            const failMsg = this.add.text(400, 450, `✗ Wrong order!\nYour order: ${this.clickSequence.join(' → ')}\nCorrect BFS: ${this.correctBFS.join(' → ')}`, {
                fontSize: '18px',
                color: '#ff0000',
                fontStyle: 'bold',
                align: 'center',
                lineSpacing: 5
            }).setOrigin(0.5);

            this.time.delayedCall(3000, () => {
                this.clickSequence = [];
                this.scene.restart();
            });
        }
    }

    showNextButton() {
        // Create a visible button with better styling
        const btnBg = this.add.rectangle(400, 540, 220, 55, 0x00d4ff)
            .setStrokeStyle(3, 0xffffff)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', function() {
                this.setFillStyle(0x00ffff);
            })
            .on('pointerout', function() {
                this.setFillStyle(0x00d4ff);
            })
            .on('pointerdown', () => {
                console.log('Next button clicked - moving to Level 3');
                this.cameras.main.fadeOut(500);
                this.time.delayedCall(500, () => {
                    this.scene.start('Level3_DepthRealm');
                });
            });

        const btnText = this.add.text(400, 540, 'NEXT LEVEL →', {
            fontSize: '22px',
            color: '#000000',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Make button pulse
        this.tweens.add({
            targets: btnBg,
            scaleX: 1.05,
            scaleY: 1.05,
            duration: 500,
            yoyo: true,
            repeat: -1
        });
    }

    drawEdge(x1, y1, x2, y2) {
        const line = this.add.line(0, 0, x1, y1, x2, y2, 0x00d4ff, 0.5);
        line.setOrigin(0, 0);
        line.setLineWidth(2);
        line.setDepth(-1);
    }
}

// ============================================
// LEVEL 3: THE DEPTH REALM (DFS)
// ============================================
class Level3_DepthRealm extends Phaser.Scene {
    constructor() {
        super({ key: 'Level3_DepthRealm' });
        this.clickSequence = [];
        this.correctDFS = ['A', 'B', 'D', 'C', 'E']; // DFS: Go deep first (A→B→D), backtrack, then C→E
        this.traversalLines = [];
        this.previousNode = null;
    }

    create() {
        // Background
        this.add.rectangle(400, 300, 800, 600, 0x2c5364);
        
        // Title
        this.add.text(400, 40, 'Level 3: The Depth Realm (DFS)', {
            fontSize: '28px',
            color: '#00d4ff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Instructions
        this.add.text(400, 90, 'Click nodes in Depth-First Search order (starting from A)', {
            fontSize: '16px',
            color: '#ffd700'
        }).setOrigin(0.5);

        // Hint
        this.add.text(400, 120, 'Hint: Go as deep as possible before backtracking (A→B→D, then C→E)', {
            fontSize: '13px',
            color: '#7dd3fc',
            fontStyle: 'italic'
        }).setOrigin(0.5);

        // Create same graph as BFS
        this.createDFSGraph();
        
        // Progress tracker
        this.progressText = this.add.text(400, 500, 'Progress: 0/5 nodes clicked', {
            fontSize: '16px',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // Reset button
        const resetBtn = this.add.rectangle(400, 550, 120, 40, 0xff6b6b)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.scene.restart());

        this.add.text(400, 550, 'RESET', {
            fontSize: '16px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.cameras.main.fadeIn(500);
    }

    createDFSGraph() {
        const positions = {
            'A': { x: 400, y: 200 },
            'B': { x: 300, y: 300 },
            'C': { x: 500, y: 300 },
            'D': { x: 300, y: 400 },
            'E': { x: 500, y: 400 }
        };

        // Draw edges (gray background)
        this.drawEdge(400, 200, 300, 300);
        this.drawEdge(400, 200, 500, 300);
        this.drawEdge(300, 300, 300, 400);
        this.drawEdge(500, 300, 500, 400);

        // Create nodes
        this.nodes = {};
        Object.keys(positions).forEach(label => {
            const pos = positions[label];
            const circle = this.add.circle(pos.x, pos.y, 30, 0x1e3a8a);
            circle.setStrokeStyle(3, 0x00d4ff);
            circle.setInteractive({ useHandCursor: true });
            circle.label = label;
            circle.clicked = false;
            circle.x = pos.x;
            circle.y = pos.y;
            
            const text = this.add.text(pos.x, pos.y, label, {
                fontSize: '20px',
                color: '#ffffff',
                fontStyle: 'bold'
            }).setOrigin(0.5);

            circle.on('pointerdown', () => this.clickNode(circle));
            this.nodes[label] = circle;
        });
    }

    clickNode(node) {
        if (!node.clicked) {
            node.clicked = true;
            const depth = this.clickSequence.length;
            const colors = [0xff0000, 0xff6b00, 0xffd700, 0x00ff00, 0x00d4ff];
            node.setFillStyle(colors[depth % colors.length]);
            this.clickSequence.push(node.label);
            
            // Draw line from previous node to current node
            if (this.previousNode) {
                const line = this.add.line(
                    0, 0,
                    this.previousNode.x, this.previousNode.y,
                    node.x, node.y,
                    0xffd700
                );
                line.setOrigin(0, 0);
                line.setLineWidth(4);
                line.setDepth(1);
                this.traversalLines.push(line);
            }
            
            this.previousNode = node;
            
            // Update progress
            this.progressText.setText(`Progress: ${this.clickSequence.length}/5 nodes clicked`);
            
            // Show order number
            this.add.text(node.x - 45, node.y, this.clickSequence.length.toString(), {
                fontSize: '16px',
                color: '#ffd700',
                fontStyle: 'bold',
                backgroundColor: '#000000',
                padding: { x: 4, y: 2 }
            });
            
            if (this.clickSequence.length === 5) {
                this.time.delayedCall(500, () => this.checkDFS());
            }
        }
    }

    checkDFS() {
        const correct = JSON.stringify(this.clickSequence) === JSON.stringify(this.correctDFS);
        
        // Clear progress text
        this.progressText.setVisible(false);
        
        if (correct) {
            this.add.text(400, 470, '✓ DFS Complete! Correct Order!', {
                fontSize: '24px',
                color: '#00ff00',
                fontStyle: 'bold'
            }).setOrigin(0.5);

            this.time.delayedCall(1500, () => this.showNextButton());
        } else {
            this.add.text(400, 450, `✗ Wrong order!\nYour order: ${this.clickSequence.join(' → ')}\nCorrect DFS: ${this.correctDFS.join(' → ')}`, {
                fontSize: '18px',
                color: '#ff0000',
                fontStyle: 'bold',
                align: 'center',
                lineSpacing: 5
            }).setOrigin(0.5);

            this.time.delayedCall(3000, () => {
                this.clickSequence = [];
                this.scene.restart();
            });
        }
    }

    showNextButton() {
        const btn = this.add.rectangle(400, 560, 200, 50, 0x00d4ff)
            .setStrokeStyle(3, 0xffffff)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', function() {
                this.setFillStyle(0x00ffff);
            })
            .on('pointerout', function() {
                this.setFillStyle(0x00d4ff);
            })
            .on('pointerdown', () => {
                this.cameras.main.fadeOut(500);
                this.time.delayedCall(500, () => this.scene.start('Level4_PathOfLight'));
            });

        this.add.text(400, 560, 'NEXT LEVEL →', {
            fontSize: '20px',
            color: '#000000',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Pulse animation
        this.tweens.add({
            targets: btn,
            scaleX: 1.05,
            scaleY: 1.05,
            duration: 500,
            yoyo: true,
            repeat: -1
        });
    }

    drawEdge(x1, y1, x2, y2) {
        const line = this.add.line(0, 0, x1, y1, x2, y2, 0x00d4ff, 0.5);
        line.setOrigin(0, 0);
        line.setLineWidth(2);
        line.setDepth(-1);
    }
}

// ============================================
// LEVEL 4: THE PATH OF LIGHT (DIJKSTRA)
// ============================================
class Level4_PathOfLight extends Phaser.Scene {
    constructor() {
        super({ key: 'Level4_PathOfLight' });
        this.correctCost = 4; // A->B->D (1+3=4)
        this.inputBox = null;
    }

    create() {
        // Background
        this.add.rectangle(400, 300, 800, 600, 0x0f2027);
        
        // Title
        this.add.text(400, 40, 'Level 4: The Path of Light (Dijkstra)', {
            fontSize: '28px',
            color: '#00d4ff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Instructions
        this.add.text(400, 85, 'Find the shortest path cost from A (green) to D (red)', {
            fontSize: '16px',
            color: '#ffd700'
        }).setOrigin(0.5);

        // Hint
        this.add.text(400, 115, 'Study the graph and calculate the minimum cost path', {
            fontSize: '14px',
            color: '#7dd3fc',
            fontStyle: 'italic'
        }).setOrigin(0.5);

        // Create weighted graph (visual only)
        this.createWeightedGraph();
        
        // Input section
        this.add.text(400, 420, 'Enter the shortest path cost:', {
            fontSize: '18px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Create HTML input box
        this.createInputBox();
        
        // Submit button
        const submitBtn = this.add.rectangle(400, 520, 180, 50, 0x00d4ff)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', function() {
                this.setFillStyle(0x00ffff);
            })
            .on('pointerout', function() {
                this.setFillStyle(0x00d4ff);
            })
            .on('pointerdown', () => this.checkAnswer());

        this.add.text(400, 520, 'SUBMIT ANSWER', {
            fontSize: '18px',
            color: '#000000',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Result text (hidden initially)
        this.resultText = this.add.text(400, 570, '', {
            fontSize: '16px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.cameras.main.fadeIn(500);
    }

    createInputBox() {
        // Create HTML input element
        const input = document.createElement('input');
        input.type = 'number';
        input.id = 'dijkstra-input';
        input.placeholder = 'Enter cost';
        input.style.position = 'absolute';
        input.style.left = '50%';
        input.style.top = '460px';
        input.style.transform = 'translateX(-50%)';
        input.style.width = '150px';
        input.style.height = '40px';
        input.style.fontSize = '24px';
        input.style.textAlign = 'center';
        input.style.border = '3px solid #00d4ff';
        input.style.borderRadius = '8px';
        input.style.backgroundColor = '#1e3a8a';
        input.style.color = '#ffffff';
        input.style.fontWeight = 'bold';
        input.min = '0';
        input.max = '99';
        
        document.body.appendChild(input);
        this.inputBox = input;
        
        // Focus on input
        setTimeout(() => input.focus(), 500);
    }

    createWeightedGraph() {
        // Nodes
        const positions = {
            'A': { x: 250, y: 250 },
            'B': { x: 400, y: 250 },
            'C': { x: 250, y: 350 },
            'D': { x: 550, y: 250 }
        };

        // Edges with weights (visual only)
        const edges = [
            { from: 'A', to: 'B', weight: 1 },
            { from: 'A', to: 'C', weight: 4 },
            { from: 'B', to: 'D', weight: 3 },
            { from: 'C', to: 'D', weight: 2 }
        ];

        // Draw edges
        edges.forEach(e => {
            const pos1 = positions[e.from];
            const pos2 = positions[e.to];
            const midX = (pos1.x + pos2.x) / 2;
            const midY = (pos1.y + pos2.y) / 2;

            // Edge line
            const line = this.add.line(0, 0, pos1.x, pos1.y, pos2.x, pos2.y, 0x00d4ff, 0.7);
            line.setOrigin(0, 0);
            line.setLineWidth(3);
            line.setDepth(-1);

            // Weight label
            this.add.text(midX, midY, e.weight.toString(), {
                fontSize: '20px',
                color: '#ffd700',
                fontStyle: 'bold',
                backgroundColor: '#000000',
                padding: { x: 6, y: 3 }
            }).setOrigin(0.5);
        });

        // Create nodes
        Object.keys(positions).forEach(label => {
            const pos = positions[label];
            const color = label === 'A' ? 0x00ff00 : (label === 'D' ? 0xff0000 : 0x1e3a8a);
            const circle = this.add.circle(pos.x, pos.y, 28, color);
            circle.setStrokeStyle(3, 0x00d4ff);
            
            this.add.text(pos.x, pos.y, label, {
                fontSize: '22px',
                color: '#ffffff',
                fontStyle: 'bold'
            }).setOrigin(0.5);
            
            // Add label below node
            const nodeLabel = label === 'A' ? 'START' : (label === 'D' ? 'END' : '');
            if (nodeLabel) {
                this.add.text(pos.x, pos.y + 45, nodeLabel, {
                    fontSize: '12px',
                    color: label === 'A' ? '#00ff00' : '#ff0000',
                    fontStyle: 'bold'
                }).setOrigin(0.5);
            }
        });
    }

    checkAnswer() {
        const userAnswer = parseInt(this.inputBox.value);
        
        if (isNaN(userAnswer)) {
            this.resultText.setText('Please enter a number!');
            this.resultText.setColor('#ff6b6b');
            return;
        }
        
        if (userAnswer === this.correctCost) {
            this.resultText.setText('✓ Correct! Shortest path cost is 4 (A→B→D: 1+3=4)');
            this.resultText.setColor('#00ff00');
            
            // Remove input box
            if (this.inputBox) {
                this.inputBox.remove();
                this.inputBox = null;
            }
            
            this.time.delayedCall(2000, () => this.showNextButton());
        } else {
            this.resultText.setText(`✗ Wrong! Try again. (Hint: Find path A→D with minimum total weight)`);
            this.resultText.setColor('#ff0000');
            this.inputBox.value = '';
            this.inputBox.focus();
        }
    }

    showNextButton() {
        const btn = this.add.rectangle(400, 560, 200, 50, 0x00d4ff)
            .setStrokeStyle(3, 0xffffff)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', function() {
                this.setFillStyle(0x00ffff);
            })
            .on('pointerout', function() {
                this.setFillStyle(0x00d4ff);
            })
            .on('pointerdown', () => {
                this.cameras.main.fadeOut(500);
                this.time.delayedCall(500, () => this.scene.start('Level5_NetworkCore'));
            });

        this.add.text(400, 560, 'FINAL LEVEL →', {
            fontSize: '20px',
            color: '#000000',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Pulse animation
        this.tweens.add({
            targets: btn,
            scaleX: 1.05,
            scaleY: 1.05,
            duration: 500,
            yoyo: true,
            repeat: -1
        });
    }

    shutdown() {
        // Clean up input box when scene ends
        if (this.inputBox) {
            this.inputBox.remove();
            this.inputBox = null;
        }
    }

    drawEdge(x1, y1, x2, y2) {
        const line = this.add.line(0, 0, x1, y1, x2, y2, 0x00d4ff, 0.5);
        line.setOrigin(0, 0);
        line.setLineWidth(2);
        line.setDepth(-1);
    }
}

// ============================================
// LEVEL 5: THE NETWORK CORE (MST)
// ============================================
class Level5_NetworkCore extends Phaser.Scene {
    constructor() {
        super({ key: 'Level5_NetworkCore' });
        this.correctAnswer = 1; // Index of correct answer (6)
        this.selectedOption = null;
    }

    create() {
        // Background
        this.add.rectangle(400, 300, 800, 600, 0x0a1a2e);
        
        // Title with glow
        const title = this.add.text(400, 40, 'Level 5: The Network Core (MST)', {
            fontSize: '32px',
            color: '#00d4ff',
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
        this.add.text(400, 85, 'Find the Minimum Spanning Tree cost (connect all 5 nodes with minimum total weight)', {
            fontSize: '14px',
            color: '#ffd700'
        }).setOrigin(0.5);

        // Hint
        this.add.text(400, 115, 'Hint: MST needs exactly 4 edges to connect 5 nodes (no cycles!)', {
            fontSize: '13px',
            color: '#7dd3fc',
            fontStyle: 'italic'
        }).setOrigin(0.5);

        // Create MST graph (visual only)
        this.createMSTGraph();
        
        // Question
        this.add.text(400, 420, 'What is the minimum total cost?', {
            fontSize: '18px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Create MCQ options
        this.createMCQOptions();

        // Result text (hidden initially)
        this.resultText = this.add.text(400, 570, '', {
            fontSize: '16px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.cameras.main.fadeIn(500);
    }

    createMCQOptions() {
        const options = [
            { text: 'A) 5', value: 0, x: 250, y: 470 },
            { text: 'B) 6', value: 1, x: 400, y: 470 },
            { text: 'C) 7', value: 2, x: 550, y: 470 },
            { text: 'D) 8', value: 3, x: 325, y: 520 }
        ];

        this.optionButtons = [];

        options.forEach(option => {
            // Create button background
            const btn = this.add.rectangle(option.x, option.y, 120, 40, 0x1e3a8a)
                .setStrokeStyle(3, 0x00d4ff)
                .setInteractive({ useHandCursor: true });

            // Create button text
            const text = this.add.text(option.x, option.y, option.text, {
                fontSize: '18px',
                color: '#ffffff',
                fontStyle: 'bold'
            }).setOrigin(0.5);

            // Store references
            btn.optionValue = option.value;
            btn.optionText = text;

            // Add hover effects
            btn.on('pointerover', () => {
                if (this.selectedOption !== btn) {
                    btn.setFillStyle(0x2d5a7b);
                }
            });

            btn.on('pointerout', () => {
                if (this.selectedOption !== btn) {
                    btn.setFillStyle(0x1e3a8a);
                }
            });

            // Add click handler
            btn.on('pointerdown', () => this.selectOption(btn));

            this.optionButtons.push(btn);
        });
    }

    selectOption(btn) {
        // Reset previous selection
        if (this.selectedOption) {
            this.selectedOption.setFillStyle(0x1e3a8a);
        }

        // Set new selection
        this.selectedOption = btn;
        btn.setFillStyle(0xffd700);

        // Check answer immediately
        this.time.delayedCall(300, () => this.checkAnswer());
    }

    checkAnswer() {
        if (this.selectedOption.optionValue === this.correctAnswer) {
            this.selectedOption.setFillStyle(0x00ff00);
            this.resultText.setText('✓ Correct! MST cost is 6 (edges: A-B, B-D, D-E)');
            this.resultText.setColor('#00ff00');
            
            // Disable all buttons
            this.optionButtons.forEach(btn => btn.disableInteractive());
            
            this.time.delayedCall(2000, () => this.showVictory());
        } else {
            this.selectedOption.setFillStyle(0xff0000);
            this.resultText.setText('✗ Wrong! Try again. (Hint: Choose the minimum cost to connect all nodes)');
            this.resultText.setColor('#ff0000');
            
            // Reset after delay
            this.time.delayedCall(1500, () => {
                this.selectedOption.setFillStyle(0x1e3a8a);
                this.selectedOption = null;
                this.resultText.setText('');
            });
        }
    }

    createMSTGraph() {
        // Nodes
        const positions = {
            'A': { x: 300, y: 200 },
            'B': { x: 500, y: 200 },
            'C': { x: 300, y: 350 },
            'D': { x: 500, y: 350 },
            'E': { x: 400, y: 275 }
        };

        // Edges with weights (visual only)
        const edges = [
            { from: 'A', to: 'B', weight: 1 },
            { from: 'A', to: 'C', weight: 4 },
            { from: 'B', to: 'D', weight: 2 },
            { from: 'C', to: 'D', weight: 5 },
            { from: 'D', to: 'E', weight: 3 },
            { from: 'A', to: 'E', weight: 7 }
        ];

        // Draw edges
        edges.forEach(e => {
            const pos1 = positions[e.from];
            const pos2 = positions[e.to];
            const midX = (pos1.x + pos2.x) / 2;
            const midY = (pos1.y + pos2.y) / 2;

            // Edge line
            const line = this.add.line(0, 0, pos1.x, pos1.y, pos2.x, pos2.y, 0x00d4ff, 0.6);
            line.setOrigin(0, 0);
            line.setLineWidth(3);
            line.setDepth(-1);

            // Weight label
            this.add.text(midX, midY, e.weight.toString(), {
                fontSize: '18px',
                color: '#ffd700',
                fontStyle: 'bold',
                backgroundColor: '#000000',
                padding: { x: 5, y: 3 }
            }).setOrigin(0.5);
        });

        // Create nodes
        Object.keys(positions).forEach(label => {
            const pos = positions[label];
            const circle = this.add.circle(pos.x, pos.y, 26, 0x1e3a8a);
            circle.setStrokeStyle(3, 0x00d4ff);
            
            this.add.text(pos.x, pos.y, label, {
                fontSize: '20px',
                color: '#ffffff',
                fontStyle: 'bold'
            }).setOrigin(0.5);
        });
    }

    showVictory() {
        // Dim background
        this.add.rectangle(400, 300, 800, 600, 0x000000, 0.7);

        // Victory message
        const victoryText = this.add.text(400, 180, '🎉 NETWORK RESTORED! 🎉', {
            fontSize: '42px',
            color: '#00d4ff',
            fontStyle: 'bold'
        }).setOrigin(0.5).setAlpha(0);

        this.tweens.add({
            targets: victoryText,
            alpha: 1,
            scale: 1.2,
            duration: 1000,
            ease: 'Bounce'
        });

        // Create glowing network
        this.time.delayedCall(1500, () => {
            this.createGlowingNetwork();
        });

        // Final message
        this.time.delayedCall(3000, () => {
            const finalMsg = this.add.text(400, 420, 'The Digital Nexus is Alive Again!\nAll Graph Concepts Mastered!', {
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

            // Continue button - triggers the level manager's game completion flow
            this.time.delayedCall(2000, () => {
                const continueBtn = this.add.rectangle(400, 490, 240, 50, 0x00ff00)
                    .setStrokeStyle(3, 0xffffff)
                    .setInteractive({ useHandCursor: true })
                    .on('pointerover', function() {
                        this.setFillStyle(0x00ff88);
                    })
                    .on('pointerout', function() {
                        this.setFillStyle(0x00ff00);
                    })
                    .on('pointerdown', () => {
                        // Mark game as completed and trigger the level manager's completion flow
                        if (window.parent && window.parent.levelManager) {
                            window.parent.levelManager.performanceMetrics.gameCompleted = true;
                            window.parent.levelManager.completeGameManually();
                        } else if (window.levelManager) {
                            window.levelManager.performanceMetrics.gameCompleted = true;
                            window.levelManager.completeGameManually();
                        }
                    });

                this.add.text(400, 490, 'GAME COMPLETE →', {
                    fontSize: '18px',
                    color: '#000000',
                    fontStyle: 'bold'
                }).setOrigin(0.5);
                
                // Pulse animation
                this.tweens.add({
                    targets: continueBtn,
                    scaleX: 1.05,
                    scaleY: 1.05,
                    duration: 500,
                    yoyo: true,
                    repeat: -1
                });

                // Play again button (smaller, below)
                const restartBtn = this.add.rectangle(400, 550, 160, 40, 0x00d4ff)
                    .setInteractive({ useHandCursor: true })
                    .on('pointerdown', () => {
                        this.cameras.main.fadeOut(500);
                        this.time.delayedCall(500, () => this.scene.start('Level1_BrokenNetwork'));
                    });

                this.add.text(400, 550, 'PLAY AGAIN', {
                    fontSize: '16px',
                    color: '#000000',
                    fontStyle: 'bold'
                }).setOrigin(0.5);
            });
        });
    }

    createGlowingNetwork() {
        // Create glowing network effect
        const center = this.add.circle(400, 300, 50, 0x00d4ff, 0.8);
        
        // Outer glows
        const glow1 = this.add.circle(400, 300, 70, 0x00d4ff, 0.3);
        const glow2 = this.add.circle(400, 300, 90, 0x00d4ff, 0.1);

        // Rotation animation
        this.tweens.add({
            targets: [center, glow1, glow2],
            angle: 360,
            duration: 3000,
            repeat: -1
        });

        // Pulse animation
        this.tweens.add({
            targets: center,
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
            tint: 0x00d4ff
        });
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
        Level1_BrokenNetwork,
        Level2_PathOfExploration,
        Level3_DepthRealm,
        Level4_PathOfLight,
        Level5_NetworkCore
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
