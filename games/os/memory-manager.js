/**
 * Memory Management Game - Operating Systems
 * Learn memory allocation strategies: First Fit, Best Fit, Worst Fit
 */

class MemoryManagerGame extends BaseGameScene {
    constructor() {
        super('MemoryManagerGame');
        this.memoryBlocks = [];
        this.processes = [];
        this.allocatedProcesses = [];
        this.strategy = 'FirstFit'; // FirstFit, BestFit, WorstFit
        this.totalMemory = 512; // MB
        this.draggedProcess = null;
    }

    create() {
        super.create();
        
        // Title
        this.add.text(400, 30, '💾 Memory Allocation Manager', {
            fontSize: '32px',
            fill: '#8b5cf6',
            fontFamily: 'Inter, sans-serif'
        }).setOrigin(0.5);

        // Instructions
        this.add.text(400, 80, 
            'Allocate processes to memory blocks efficiently. Minimize fragmentation!', {
            fontSize: '16px',
            fill: '#a3b0ff',
            fontFamily: 'Inter, sans-serif'
        }).setOrigin(0.5);

        // Create strategy selector
        this.createStrategySelector();

        // Create memory visualization
        this.createMemoryVisualization();

        // Create process queue
        this.createProcessQueue();

        // Generate memory blocks and processes
        this.generateMemoryBlocks();
        this.generateProcesses();

        // Create control buttons
        this.createControlButtons();
    }

    createStrategySelector() {
        const strategies = [
            { name: 'FirstFit', label: 'First Fit', x: 200 },
            { name: 'BestFit', label: 'Best Fit', x: 400 },
            { name: 'WorstFit', label: 'Worst Fit', x: 600 }
        ];

        this.add.text(400, 120, 'Allocation Strategy:', {
            fontSize: '18px',
            fill: '#fff',
            fontFamily: 'Inter, sans-serif'
        }).setOrigin(0.5);

        strategies.forEach(strat => {
            const btn = this.add.text(strat.x, 160, strat.label, {
                fontSize: '16px',
                fill: '#fff',
                backgroundColor: this.strategy === strat.name ? '#8b5cf6' : '#2c2c54',
                padding: { x: 15, y: 10 },
                fontFamily: 'Inter, sans-serif'
            }).setOrigin(0.5).setInteractive();

            btn.on('pointerover', () => {
                if (this.strategy !== strat.name) {
                    btn.setStyle({ backgroundColor: '#3a3a6a' });
                }
            });

            btn.on('pointerout', () => {
                if (this.strategy !== strat.name) {
                    btn.setStyle({ backgroundColor: '#2c2c54' });
                }
            });

            btn.on('pointerdown', () => {
                this.strategy = strat.name;
                this.scene.restart();
            });
        });
    }

    createMemoryVisualization() {
        this.add.text(100, 220, 'Memory Blocks (Total: 512 MB):', {
            fontSize: '18px',
            fill: '#fcc419',
            fontFamily: 'Inter, sans-serif'
        });

        this.memoryContainer = this.add.container(100, 260);
    }

    createProcessQueue() {
        this.add.text(550, 220, 'Process Queue:', {
            fontSize: '18px',
            fill: '#10b981',
            fontFamily: 'Inter, sans-serif'
        });

        this.processQueueContainer = this.add.container(550, 260);
    }

    generateMemoryBlocks() {
        // Create memory blocks with varying sizes
        const blockSizes = [100, 50, 200, 75, 87]; // MB
        let yOffset = 0;

        blockSizes.forEach((size, index) => {
            const block = {
                id: index,
                size: size,
                free: true,
                process: null,
                y: yOffset,
                graphics: null
            };

            // Create visual representation
            const height = (size / this.totalMemory) * 300;
            const rect = this.add.rectangle(0, yOffset, 350, height, 0x3a3a6a, 0.8);
            rect.setStrokeStyle(2, 0x8b5cf6);
            rect.setOrigin(0, 0);

            const text = this.add.text(175, yOffset + height / 2, 
                `Block ${index + 1}\n${size} MB\nFREE`, {
                fontSize: '14px',
                fill: '#fff',
                align: 'center',
                fontFamily: 'Inter, sans-serif'
            }).setOrigin(0.5);

            block.graphics = { rect, text };
            this.memoryBlocks.push(block);
            this.memoryContainer.add([rect, text]);

            yOffset += height + 5;
        });
    }

    generateProcesses() {
        const processSizes = [80, 120, 45, 60, 90]; // MB
        const colors = [0xff6b6b, 0x4ecdc4, 0xffe66d, 0xa8e6cf, 0xff8b94];

        processSizes.forEach((size, index) => {
            const process = {
                id: `P${index + 1}`,
                size: size,
                allocated: false,
                blockId: null,
                color: colors[index],
                graphics: null
            };

            // Create draggable process box
            const y = index * 60;
            const rect = this.add.rectangle(0, y, 200, 50, process.color, 0.8);
            rect.setStrokeStyle(2, process.color);
            rect.setInteractive({ draggable: true });

            const text = this.add.text(0, y, `${process.id}\n${size} MB`, {
                fontSize: '14px',
                fill: '#fff',
                align: 'center',
                fontFamily: 'Inter, sans-serif'
            }).setOrigin(0.5);

            process.graphics = { rect, text };
            this.processes.push(process);
            this.processQueueContainer.add([rect, text]);

            // Drag events
            rect.on('drag', (pointer, dragX, dragY) => {
                rect.x = dragX;
                rect.y = dragY;
                text.x = dragX;
                text.y = dragY;
            });

            rect.on('dragend', (pointer) => {
                this.handleProcessDrop(process, pointer);
            });
        });
    }

    handleProcessDrop(process, pointer) {
        // Check if dropped on a memory block
        const memoryX = this.memoryContainer.x + 100;
        const memoryY = this.memoryContainer.y + 260;

        let allocated = false;

        for (const block of this.memoryBlocks) {
            const blockWorldY = memoryY + block.y;
            const blockHeight = (block.size / this.totalMemory) * 300;

            if (pointer.x >= memoryX && pointer.x <= memoryX + 350 &&
                pointer.y >= blockWorldY && pointer.y <= blockWorldY + blockHeight) {
                
                // Try to allocate
                if (this.allocateProcess(process, block)) {
                    allocated = true;
                    this.updateMoves();
                    break;
                }
            }
        }

        if (!allocated) {
            // Return to original position
            process.graphics.rect.x = 0;
            process.graphics.rect.y = this.processes.indexOf(process) * 60;
            process.graphics.text.x = 0;
            process.graphics.text.y = this.processes.indexOf(process) * 60;
        }
    }

    allocateProcess(process, block) {
        if (!block.free || block.size < process.size) {
            this.showErrorMessage(`Cannot allocate ${process.id} to Block ${block.id + 1}. Insufficient space!`);
            return false;
        }

        // Allocate process to block
        block.free = false;
        block.process = process;
        process.allocated = true;
        process.blockId = block.id;

        // Update visuals
        block.graphics.rect.setFillStyle(process.color, 0.6);
        block.graphics.text.setText(`Block ${block.id + 1}\n${block.size} MB\n${process.id} (${process.size} MB)`);

        // Move process to block
        const blockWorldY = block.y;
        process.graphics.rect.x = 0;
        process.graphics.rect.y = blockWorldY + 25;
        process.graphics.text.x = 0;
        process.graphics.text.y = blockWorldY + 25;

        // Remove from queue, add to memory container
        this.processQueueContainer.remove([process.graphics.rect, process.graphics.text]);
        this.memoryContainer.add([process.graphics.rect, process.graphics.text]);

        this.allocatedProcesses.push(process);

        // Check if all processes allocated
        if (this.allocatedProcesses.length === this.processes.length) {
            this.time.delayedCall(1000, () => {
                this.showResults();
            });
        }

        return true;
    }

    createControlButtons() {
        // Auto-allocate button
        const autoBtn = this.add.text(400, 520, '🤖 Auto-Allocate', {
            fontSize: '20px',
            fill: '#fff',
            backgroundColor: '#10b981',
            padding: { x: 20, y: 10 },
            fontFamily: 'Inter, sans-serif'
        }).setOrigin(0.5).setInteractive();

        autoBtn.on('pointerover', () => {
            autoBtn.setStyle({ backgroundColor: '#059669' });
        });

        autoBtn.on('pointerout', () => {
            autoBtn.setStyle({ backgroundColor: '#10b981' });
        });

        autoBtn.on('pointerdown', () => {
            this.autoAllocate();
        });

        // Reset button
        const resetBtn = this.add.text(600, 520, '🔄 Reset', {
            fontSize: '20px',
            fill: '#fff',
            backgroundColor: '#ef4444',
            padding: { x: 20, y: 10 },
            fontFamily: 'Inter, sans-serif'
        }).setOrigin(0.5).setInteractive();

        resetBtn.on('pointerdown', () => {
            this.scene.restart();
        });
    }

    autoAllocate() {
        const unallocated = this.processes.filter(p => !p.allocated);

        unallocated.forEach(process => {
            let targetBlock = null;

            switch (this.strategy) {
                case 'FirstFit':
                    targetBlock = this.memoryBlocks.find(b => b.free && b.size >= process.size);
                    break;
                
                case 'BestFit':
                    const suitable = this.memoryBlocks.filter(b => b.free && b.size >= process.size);
                    if (suitable.length > 0) {
                        targetBlock = suitable.reduce((best, b) => 
                            b.size < best.size ? b : best
                        );
                    }
                    break;
                
                case 'WorstFit':
                    const available = this.memoryBlocks.filter(b => b.free && b.size >= process.size);
                    if (available.length > 0) {
                        targetBlock = available.reduce((worst, b) => 
                            b.size > worst.size ? b : worst
                        );
                    }
                    break;
            }

            if (targetBlock) {
                this.allocateProcess(process, targetBlock);
            }
        });
    }

    showResults() {
        // Calculate fragmentation
        const totalFreeSpace = this.memoryBlocks
            .filter(b => b.free)
            .reduce((sum, b) => sum + b.size, 0);
        
        const internalFragmentation = this.memoryBlocks
            .filter(b => !b.free)
            .reduce((sum, b) => sum + (b.size - b.process.size), 0);

        const fragmentationPercent = ((internalFragmentation / this.totalMemory) * 100).toFixed(2);
        
        // Calculate score (lower fragmentation = higher score)
        const finalScore = Math.round(Math.max(0, 100 - fragmentationPercent * 2));

        // Show results
        const overlay = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.9);
        
        this.add.text(400, 150, '📊 Memory Allocation Results', {
            fontSize: '36px',
            fill: '#8b5cf6',
            fontFamily: 'Inter, sans-serif'
        }).setOrigin(0.5);

        this.add.text(400, 250, 
            `Strategy: ${this.strategy}\n\n` +
            `Processes Allocated: ${this.allocatedProcesses.length}/${this.processes.length}\n` +
            `Internal Fragmentation: ${internalFragmentation} MB (${fragmentationPercent}%)\n` +
            `Free Space: ${totalFreeSpace} MB\n\n` +
            `Efficiency Score: ${finalScore}/100`, {
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
                window.gameManager.reportScore(finalScore, 'Memory Management', {
                    strategy: this.strategy,
                    fragmentation: fragmentationPercent,
                    allocated: this.allocatedProcesses.length
                });
            }
        });
    }
}

// Register the game scene
window.MemoryManagerGame = MemoryManagerGame;
