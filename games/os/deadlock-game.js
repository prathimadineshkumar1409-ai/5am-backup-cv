/**
 * Deadlock Detection Game - Operating Systems
 * Learn about deadlock conditions and prevention strategies
 */

class DeadlockGame extends BaseGameScene {
    constructor() {
        super('DeadlockGame');
        this.processes = [];
        this.resources = [];
        this.allocations = [];
        this.requests = [];
        this.isDeadlocked = false;
    }

    create() {
        super.create();
        
        // Title
        this.add.text(400, 30, '🔒 Deadlock Detection & Prevention', {
            fontSize: '32px',
            fill: '#ef4444',
            fontFamily: 'Inter, sans-serif'
        }).setOrigin(0.5);

        // Instructions
        this.add.text(400, 80, 
            'Allocate resources to processes. Avoid deadlock situations!', {
            fontSize: '16px',
            fill: '#a3b0ff',
            fontFamily: 'Inter, sans-serif'
        }).setOrigin(0.5);

        // Create deadlock conditions info
        this.createDeadlockInfo();

        // Create resource-allocation graph
        this.createRAG();

        // Generate scenario
        this.generateScenario();

        // Create control panel
        this.createControlPanel();
    }

    createDeadlockInfo() {
        this.add.text(100, 120, 'Deadlock Conditions:', {
            fontSize: '18px',
            fill: '#fcc419',
            fontFamily: 'Inter, sans-serif'
        });

        const conditions = [
            '1. Mutual Exclusion',
            '2. Hold and Wait',
            '3. No Preemption',
            '4. Circular Wait'
        ];

        conditions.forEach((condition, index) => {
            this.add.text(100, 150 + index * 25, condition, {
                fontSize: '14px',
                fill: '#a3b0ff',
                fontFamily: 'Inter, sans-serif'
            });
        });
    }

    createRAG() {
        this.add.text(400, 280, 'Resource Allocation Graph', {
            fontSize: '20px',
            fill: '#fff',
            fontFamily: 'Inter, sans-serif'
        }).setOrigin(0.5);

        this.ragContainer = this.add.container(400, 350);
    }

    generateScenario() {
        // Create processes
        const processCount = 4;
        const processColors = [0xff6b6b, 0x4ecdc4, 0xffe66d, 0xa8e6cf];
        
        for (let i = 0; i < processCount; i++) {
            const angle = (i / processCount) * Math.PI * 2 - Math.PI / 2;
            const radius = 150;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            const process = {
                id: `P${i + 1}`,
                x: x,
                y: y,
                color: processColors[i],
                holding: [],
                requesting: null,
                graphics: null
            };

            // Draw process circle
            const circle = this.add.circle(x, y, 30, process.color, 0.8);
            circle.setStrokeStyle(3, 0xffffff);

            const text = this.add.text(x, y, process.id, {
                fontSize: '18px',
                fill: '#fff',
                fontFamily: 'Inter, sans-serif'
            }).setOrigin(0.5);

            process.graphics = { circle, text };
            this.processes.push(process);
            this.ragContainer.add([circle, text]);
        }

        // Create resources
        const resourceCount = 3;
        const resourceColors = [0x3b82f6, 0x10b981, 0x8b5cf6];
        
        for (let i = 0; i < resourceCount; i++) {
            const angle = (i / resourceCount) * Math.PI * 2 - Math.PI / 2 + Math.PI / 3;
            const radius = 80;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            const resource = {
                id: `R${i + 1}`,
                x: x,
                y: y,
                color: resourceColors[i],
                instances: 1,
                allocated: null,
                graphics: null
            };

            // Draw resource square
            const rect = this.add.rectangle(x, y, 40, 40, resource.color, 0.8);
            rect.setStrokeStyle(3, 0xffffff);

            const text = this.add.text(x, y, resource.id, {
                fontSize: '16px',
                fill: '#fff',
                fontFamily: 'Inter, sans-serif'
            }).setOrigin(0.5);

            resource.graphics = { rect, text };
            this.resources.push(resource);
            this.ragContainer.add([rect, text]);
        }

        // Create initial allocations
        this.createInitialState();
    }

    createInitialState() {
        // P1 holds R1, requests R2
        this.allocateResource(this.resources[0], this.processes[0]);
        this.processes[0].requesting = this.resources[1];

        // P2 holds R2, requests R3
        this.allocateResource(this.resources[1], this.processes[1]);
        this.processes[1].requesting = this.resources[2];

        // P3 holds R3, requests R1
        this.allocateResource(this.resources[2], this.processes[2]);
        this.processes[2].requesting = this.resources[0];

        // P4 is free
        this.processes[3].requesting = null;

        this.drawAllEdges();
    }

    allocateResource(resource, process) {
        resource.allocated = process;
        process.holding.push(resource);
    }

    drawAllEdges() {
        // Clear existing edges
        this.ragContainer.list.forEach(item => {
            if (item.type === 'Line') {
                item.destroy();
            }
        });

        // Draw allocation edges (Resource -> Process)
        this.resources.forEach(resource => {
            if (resource.allocated) {
                const line = this.add.line(
                    0, 0,
                    resource.x, resource.y,
                    resource.allocated.x, resource.allocated.y,
                    0x10b981, 0.8
                );
                line.setLineWidth(3);
                this.ragContainer.add(line);
                this.ragContainer.sendToBack(line);
            }
        });

        // Draw request edges (Process -> Resource)
        this.processes.forEach(process => {
            if (process.requesting) {
                const line = this.add.line(
                    0, 0,
                    process.x, process.y,
                    process.requesting.x, process.requesting.y,
                    0xef4444, 0.8
                );
                line.setLineWidth(3);
                line.setOrigin(0);
                
                // Add arrow
                const angle = Math.atan2(
                    process.requesting.y - process.y,
                    process.requesting.x - process.x
                );
                
                this.ragContainer.add(line);
                this.ragContainer.sendToBack(line);
            }
        });
    }

    createControlPanel() {
        // Deadlock status
        this.deadlockStatus = this.add.text(400, 520, 'Status: Analyzing...', {
            fontSize: '20px',
            fill: '#fcc419',
            fontFamily: 'Inter, sans-serif'
        }).setOrigin(0.5);

        // Check deadlock button
        const checkBtn = this.add.text(300, 560, '🔍 Check Deadlock', {
            fontSize: '18px',
            fill: '#fff',
            backgroundColor: '#3b82f6',
            padding: { x: 20, y: 10 },
            fontFamily: 'Inter, sans-serif'
        }).setOrigin(0.5).setInteractive();

        checkBtn.on('pointerover', () => {
            checkBtn.setStyle({ backgroundColor: '#2563eb' });
        });

        checkBtn.on('pointerout', () => {
            checkBtn.setStyle({ backgroundColor: '#3b82f6' });
        });

        checkBtn.on('pointerdown', () => {
            this.checkDeadlock();
        });

        // Resolve button
        const resolveBtn = this.add.text(500, 560, '✅ Resolve', {
            fontSize: '18px',
            fill: '#fff',
            backgroundColor: '#10b981',
            padding: { x: 20, y: 10 },
            fontFamily: 'Inter, sans-serif'
        }).setOrigin(0.5).setInteractive();

        resolveBtn.on('pointerdown', () => {
            this.resolveDeadlock();
        });
    }

    checkDeadlock() {
        // Detect circular wait using cycle detection
        const hasCycle = this.detectCycle();
        
        this.isDeadlocked = hasCycle;
        this.updateMoves();

        if (hasCycle) {
            this.deadlockStatus.setText('⚠️ DEADLOCK DETECTED!');
            this.deadlockStatus.setColor('#ef4444');
            
            // Highlight deadlock cycle
            this.highlightDeadlockCycle();
        } else {
            this.deadlockStatus.setText('✅ No Deadlock - System is Safe');
            this.deadlockStatus.setColor('#10b981');
            
            this.time.delayedCall(1500, () => {
                this.showResults(true);
            });
        }
    }

    detectCycle() {
        // Build adjacency list for the RAG
        const graph = new Map();
        
        // Add process -> resource edges (requests)
        this.processes.forEach(process => {
            if (process.requesting) {
                if (!graph.has(process.id)) {
                    graph.set(process.id, []);
                }
                graph.get(process.id).push(process.requesting.id);
            }
        });

        // Add resource -> process edges (allocations)
        this.resources.forEach(resource => {
            if (resource.allocated) {
                if (!graph.has(resource.id)) {
                    graph.set(resource.id, []);
                }
                graph.get(resource.id).push(resource.allocated.id);
            }
        });

        // DFS cycle detection
        const visited = new Set();
        const recStack = new Set();

        const dfs = (node) => {
            visited.add(node);
            recStack.add(node);

            const neighbors = graph.get(node) || [];
            for (const neighbor of neighbors) {
                if (!visited.has(neighbor)) {
                    if (dfs(neighbor)) return true;
                } else if (recStack.has(neighbor)) {
                    return true; // Cycle detected
                }
            }

            recStack.delete(node);
            return false;
        };

        for (const node of graph.keys()) {
            if (!visited.has(node)) {
                if (dfs(node)) return true;
            }
        }

        return false;
    }

    highlightDeadlockCycle() {
        // Animate the deadlocked processes
        this.processes.forEach(process => {
            if (process.requesting && process.holding.length > 0) {
                this.tweens.add({
                    targets: process.graphics.circle,
                    alpha: 0.3,
                    duration: 500,
                    yoyo: true,
                    repeat: -1
                });
            }
        });
    }

    resolveDeadlock() {
        if (!this.isDeadlocked) {
            this.showErrorMessage('No deadlock to resolve!');
            return;
        }

        // Simple resolution: Release P3's resource (break the cycle)
        const p3 = this.processes[2];
        if (p3.holding.length > 0) {
            const resource = p3.holding[0];
            resource.allocated = null;
            p3.holding = [];
            p3.requesting = null;

            this.drawAllEdges();
            this.deadlockStatus.setText('✅ Deadlock Resolved!');
            this.deadlockStatus.setColor('#10b981');

            this.updateMoves();

            this.time.delayedCall(1500, () => {
                this.showResults(false);
            });
        }
    }

    showResults(preventedDeadlock) {
        const finalScore = preventedDeadlock ? 100 : 70;

        const overlay = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.9);
        
        this.add.text(400, 150, '📊 Deadlock Management Results', {
            fontSize: '36px',
            fill: '#ef4444',
            fontFamily: 'Inter, sans-serif'
        }).setOrigin(0.5);

        const resultText = preventedDeadlock 
            ? '✅ Successfully prevented deadlock!'
            : '⚠️ Deadlock occurred but was resolved';

        this.add.text(400, 250, 
            `${resultText}\n\n` +
            `Moves: ${this.moves}\n` +
            `Strategy: ${preventedDeadlock ? 'Prevention' : 'Detection & Recovery'}\n\n` +
            `Score: ${finalScore}/100`, {
            fontSize: '20px',
            fill: '#fff',
            align: 'center',
            fontFamily: 'Inter, sans-serif'
        }).setOrigin(0.5);

        const continueBtn = this.add.text(400, 450, 'Continue', {
            fontSize: '24px',
            fill: '#fff',
            backgroundColor: '#7b3fe8',
            padding: { x: 30, y: 15 },
            fontFamily: 'Inter, sans-serif'
        }).setOrigin(0.5).setInteractive();

        continueBtn.on('pointerdown', () => {
            if (window.gameManager) {
                window.gameManager.reportScore(finalScore, 'Deadlock Detection', {
                    prevented: preventedDeadlock,
                    moves: this.moves
                });
            }
        });
    }
}

// Register the game scene
window.DeadlockGame = DeadlockGame;
