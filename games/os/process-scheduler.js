/**
 * Process Scheduler Game - Operating Systems
 * Learn CPU scheduling algorithms: FCFS, SJF, Round Robin
 */

class ProcessSchedulerGame extends BaseGameScene {
    constructor() {
        super('ProcessSchedulerGame');
        this.processes = [];
        this.readyQueue = [];
        this.currentProcess = null;
        this.cpuTimeline = [];
        this.algorithm = 'FCFS'; // FCFS, SJF, RR
        this.timeQuantum = 2; // For Round Robin
        this.currentTime = 0;
        this.completedProcesses = [];
    }

    create() {
        super.create();
        
        // Title
        this.add.text(400, 30, '⚙️ CPU Process Scheduler', {
            fontSize: '32px',
            fill: '#3b82f6',
            fontFamily: 'Inter, sans-serif'
        }).setOrigin(0.5);

        // Instructions
        const instructions = this.add.text(400, 80, 
            'Schedule processes using different algorithms. Minimize waiting time!', {
            fontSize: '16px',
            fill: '#a3b0ff',
            fontFamily: 'Inter, sans-serif'
        }).setOrigin(0.5);

        // Create algorithm selector
        this.createAlgorithmSelector();

        // Create process area
        this.createProcessArea();

        // Create CPU visualization
        this.createCPUVisualization();

        // Create timeline
        this.createTimeline();

        // Generate random processes
        this.generateProcesses();

        // Start button
        this.createStartButton();
    }

    createAlgorithmSelector() {
        const algorithms = [
            { name: 'FCFS', label: 'First Come First Serve', x: 150 },
            { name: 'SJF', label: 'Shortest Job First', x: 400 },
            { name: 'RR', label: 'Round Robin', x: 650 }
        ];

        this.add.text(400, 120, 'Select Scheduling Algorithm:', {
            fontSize: '18px',
            fill: '#fff',
            fontFamily: 'Inter, sans-serif'
        }).setOrigin(0.5);

        algorithms.forEach(algo => {
            const btn = this.add.text(algo.x, 160, algo.label, {
                fontSize: '16px',
                fill: '#fff',
                backgroundColor: this.algorithm === algo.name ? '#7b3fe8' : '#2c2c54',
                padding: { x: 15, y: 10 },
                fontFamily: 'Inter, sans-serif'
            }).setOrigin(0.5).setInteractive();

            btn.on('pointerover', () => {
                if (this.algorithm !== algo.name) {
                    btn.setStyle({ backgroundColor: '#3a3a6a' });
                }
            });

            btn.on('pointerout', () => {
                if (this.algorithm !== algo.name) {
                    btn.setStyle({ backgroundColor: '#2c2c54' });
                }
            });

            btn.on('pointerdown', () => {
                this.algorithm = algo.name;
                this.scene.restart();
            });
        });
    }

    createProcessArea() {
        // Process queue header
        this.add.text(100, 220, 'Process Queue:', {
            fontSize: '20px',
            fill: '#fcc419',
            fontFamily: 'Inter, sans-serif'
        });

        // Process container
        this.processContainer = this.add.container(100, 260);
    }

    createCPUVisualization() {
        // CPU box
        const cpuBox = this.add.rectangle(600, 320, 180, 120, 0x3b82f6, 0.3);
        cpuBox.setStrokeStyle(3, 0x3b82f6);

        this.add.text(600, 280, '🖥️ CPU', {
            fontSize: '24px',
            fill: '#3b82f6',
            fontFamily: 'Inter, sans-serif'
        }).setOrigin(0.5);

        // Current process display
        this.cpuProcessText = this.add.text(600, 320, 'IDLE', {
            fontSize: '20px',
            fill: '#fff',
            fontFamily: 'Inter, sans-serif'
        }).setOrigin(0.5);
    }

    createTimeline() {
        this.add.text(100, 420, 'Execution Timeline:', {
            fontSize: '18px',
            fill: '#a3b0ff',
            fontFamily: 'Inter, sans-serif'
        });

        this.timelineContainer = this.add.container(100, 450);
    }

    generateProcesses() {
        const processCount = 5;
        const colors = [0xff6b6b, 0x4ecdc4, 0xffe66d, 0xa8e6cf, 0xff8b94];

        for (let i = 0; i < processCount; i++) {
            const process = {
                id: `P${i + 1}`,
                arrivalTime: i * 2,
                burstTime: Phaser.Math.Between(2, 6),
                remainingTime: 0,
                color: colors[i],
                waitingTime: 0,
                turnaroundTime: 0,
                completionTime: 0
            };
            process.remainingTime = process.burstTime;
            this.processes.push(process);
        }

        this.displayProcesses();
    }

    displayProcesses() {
        this.processContainer.removeAll(true);

        this.processes.forEach((process, index) => {
            const y = index * 40;
            
            // Process box
            const box = this.add.rectangle(0, y, 400, 35, process.color, 0.3);
            box.setStrokeStyle(2, process.color);

            // Process info
            const text = this.add.text(10, y, 
                `${process.id} | Arrival: ${process.arrivalTime}s | Burst: ${process.burstTime}s`, {
                fontSize: '14px',
                fill: '#fff',
                fontFamily: 'Inter, sans-serif'
            }).setOrigin(0, 0.5);

            this.processContainer.add([box, text]);
        });
    }

    createStartButton() {
        const startBtn = this.add.text(400, 520, '▶️ Start Scheduling', {
            fontSize: '24px',
            fill: '#fff',
            backgroundColor: '#10b981',
            padding: { x: 30, y: 15 },
            fontFamily: 'Inter, sans-serif'
        }).setOrigin(0.5).setInteractive();

        startBtn.on('pointerover', () => {
            startBtn.setStyle({ backgroundColor: '#059669' });
        });

        startBtn.on('pointerout', () => {
            startBtn.setStyle({ backgroundColor: '#10b981' });
        });

        startBtn.on('pointerdown', () => {
            startBtn.destroy();
            this.startScheduling();
        });
    }

    startScheduling() {
        this.currentTime = 0;
        this.completedProcesses = [];
        
        // Sort processes based on algorithm
        switch (this.algorithm) {
            case 'FCFS':
                this.scheduleFCFS();
                break;
            case 'SJF':
                this.scheduleSJF();
                break;
            case 'RR':
                this.scheduleRR();
                break;
        }
    }

    scheduleFCFS() {
        // First Come First Serve - processes execute in arrival order
        const sortedProcesses = [...this.processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
        
        sortedProcesses.forEach((process, index) => {
            if (this.currentTime < process.arrivalTime) {
                this.currentTime = process.arrivalTime;
            }

            process.waitingTime = this.currentTime - process.arrivalTime;
            this.currentTime += process.burstTime;
            process.completionTime = this.currentTime;
            process.turnaroundTime = process.completionTime - process.arrivalTime;

            this.animateProcessExecution(process, index);
        });

        this.time.delayedCall(sortedProcesses.length * 1000 + 1000, () => {
            this.showResults();
        });
    }

    scheduleSJF() {
        // Shortest Job First - non-preemptive
        const processes = [...this.processes];
        const completed = [];

        while (completed.length < processes.length) {
            // Get available processes
            const available = processes.filter(p => 
                p.arrivalTime <= this.currentTime && !completed.includes(p)
            );

            if (available.length === 0) {
                this.currentTime++;
                continue;
            }

            // Select shortest job
            const shortest = available.reduce((min, p) => 
                p.burstTime < min.burstTime ? p : min
            );

            shortest.waitingTime = this.currentTime - shortest.arrivalTime;
            this.currentTime += shortest.burstTime;
            shortest.completionTime = this.currentTime;
            shortest.turnaroundTime = shortest.completionTime - shortest.arrivalTime;

            completed.push(shortest);
            this.animateProcessExecution(shortest, completed.length - 1);
        }

        this.time.delayedCall(completed.length * 1000 + 1000, () => {
            this.showResults();
        });
    }

    scheduleRR() {
        // Round Robin with time quantum
        const queue = [...this.processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
        const completed = [];
        let index = 0;

        while (completed.length < this.processes.length) {
            const process = queue[index % queue.length];

            if (process.remainingTime > 0 && process.arrivalTime <= this.currentTime) {
                const executeTime = Math.min(this.timeQuantum, process.remainingTime);
                
                this.currentTime += executeTime;
                process.remainingTime -= executeTime;

                if (process.remainingTime === 0) {
                    process.completionTime = this.currentTime;
                    process.turnaroundTime = process.completionTime - process.arrivalTime;
                    process.waitingTime = process.turnaroundTime - process.burstTime;
                    completed.push(process);
                }

                this.animateProcessExecution(process, index, executeTime);
            }

            index++;
            if (index > queue.length * 10) break; // Safety break
        }

        this.time.delayedCall(index * 500 + 1000, () => {
            this.showResults();
        });
    }

    animateProcessExecution(process, index) {
        this.time.delayedCall(index * 1000, () => {
            this.cpuProcessText.setText(`Executing: ${process.id}`);
            this.cpuProcessText.setColor('#fcc419');

            // Add to timeline
            const timelineBlock = this.add.rectangle(
                this.timelineContainer.list.length * 60,
                0,
                50,
                30,
                process.color
            );
            const timelineText = this.add.text(
                this.timelineContainer.list.length * 60,
                0,
                process.id,
                { fontSize: '14px', fill: '#fff', fontFamily: 'Inter, sans-serif' }
            ).setOrigin(0.5);

            this.timelineContainer.add([timelineBlock, timelineText]);
            this.updateMoves();
        });
    }

    showResults() {
        const avgWaitingTime = this.processes.reduce((sum, p) => sum + p.waitingTime, 0) / this.processes.length;
        const avgTurnaroundTime = this.processes.reduce((sum, p) => sum + p.turnaroundTime, 0) / this.processes.length;

        // Calculate score based on efficiency
        const optimalWaitingTime = 5; // Ideal average waiting time
        const efficiency = Math.max(0, 100 - (avgWaitingTime - optimalWaitingTime) * 10);
        const finalScore = Math.round(Math.min(100, efficiency));

        // Show results overlay
        const overlay = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.9);
        
        const resultsText = this.add.text(400, 150, '📊 Scheduling Results', {
            fontSize: '36px',
            fill: '#3b82f6',
            fontFamily: 'Inter, sans-serif'
        }).setOrigin(0.5);

        const statsText = this.add.text(400, 250, 
            `Algorithm: ${this.algorithm}\n\n` +
            `Average Waiting Time: ${avgWaitingTime.toFixed(2)}s\n` +
            `Average Turnaround Time: ${avgTurnaroundTime.toFixed(2)}s\n\n` +
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
                window.gameManager.reportScore(finalScore, 'Process Scheduling', {
                    algorithm: this.algorithm,
                    avgWaitingTime: avgWaitingTime.toFixed(2),
                    avgTurnaroundTime: avgTurnaroundTime.toFixed(2)
                });
            }
        });
    }
}

// Register the game scene
window.ProcessSchedulerGame = ProcessSchedulerGame;
