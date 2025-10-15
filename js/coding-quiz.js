/**
 * Coding Challenge and Quiz System
 * Interactive coding editor with AI chatbot and gamified quizzes
 */

// Coding challenges database
const codingChallenges = {
    'process-scheduling': {
        title: 'Implement Round Robin Scheduler',
        description: 'Create a function that simulates Round Robin scheduling with a time quantum of 2.',
        starterCode: `function roundRobinScheduler(processes, timeQuantum) {
    // processes = [{id: 'P1', burstTime: 5}, ...]
    // Return: execution order array
    
    // Your code here
    
}

// Test your code
const processes = [
    {id: 'P1', burstTime: 5},
    {id: 'P2', burstTime: 3},
    {id: 'P3', burstTime: 8}
];
console.log(roundRobinScheduler(processes, 2));`,
        solution: `function roundRobinScheduler(processes, timeQuantum) {
    const queue = [...processes];
    const executionOrder = [];
    
    while (queue.length > 0) {
        const process = queue.shift();
        const executeTime = Math.min(timeQuantum, process.burstTime);
        
        executionOrder.push({
            id: process.id,
            time: executeTime
        });
        
        process.burstTime -= executeTime;
        
        if (process.burstTime > 0) {
            queue.push(process);
        }
    }
    
    return executionOrder;
}`,
        hints: [
            'Use a queue data structure to manage processes',
            'Execute each process for time quantum or remaining burst time',
            'If process not complete, add it back to queue',
            'Track execution order in an array'
        ]
    },
    'memory-management': {
        title: 'Implement First Fit Allocation',
        description: 'Create a memory allocation function using First Fit strategy.',
        starterCode: `function firstFitAllocation(memoryBlocks, processSize) {
    // memoryBlocks = [100, 500, 200, 300, 600]
    // processSize = 212
    // Return: index of allocated block or -1
    
    // Your code here
    
}

// Test
const blocks = [100, 500, 200, 300, 600];
console.log(firstFitAllocation(blocks, 212));`,
        solution: `function firstFitAllocation(memoryBlocks, processSize) {
    for (let i = 0; i < memoryBlocks.length; i++) {
        if (memoryBlocks[i] >= processSize) {
            return i;
        }
    }
    return -1;
}`,
        hints: [
            'Iterate through memory blocks sequentially',
            'Check if block size >= process size',
            'Return first matching block index',
            'Return -1 if no suitable block found'
        ]
    },
    'deadlock': {
        title: 'Detect Circular Wait',
        description: 'Implement a function to detect circular wait in resource allocation.',
        starterCode: `function detectCircularWait(allocation) {
    // allocation = {P1: 'R1', P2: 'R2', P3: 'R1'}
    // requests = {P1: 'R2', P2: 'R1', P3: 'R2'}
    // Return: true if circular wait exists
    
    // Your code here
    
}`,
        solution: `function detectCircularWait(allocation, requests) {
    const graph = new Map();
    
    // Build graph
    for (const [process, resource] of Object.entries(requests)) {
        const holder = Object.keys(allocation).find(p => allocation[p] === resource);
        if (holder) {
            if (!graph.has(process)) graph.set(process, []);
            graph.get(process).push(holder);
        }
    }
    
    // DFS cycle detection
    const visited = new Set();
    const recStack = new Set();
    
    function hasCycle(node) {
        visited.add(node);
        recStack.add(node);
        
        const neighbors = graph.get(node) || [];
        for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                if (hasCycle(neighbor)) return true;
            } else if (recStack.has(neighbor)) {
                return true;
            }
        }
        
        recStack.delete(node);
        return false;
    }
    
    for (const node of graph.keys()) {
        if (!visited.has(node)) {
            if (hasCycle(node)) return true;
        }
    }
    
    return false;
}`,
        hints: [
            'Build a directed graph of process dependencies',
            'Use DFS to detect cycles',
            'Track visited nodes and recursion stack',
            'Cycle in graph indicates circular wait'
        ]
    }
};

// Quiz questions database
const quizQuestions = {
    'process-scheduling': [
        {
            question: 'Which scheduling algorithm can cause the "convoy effect"?',
            options: ['Round Robin', 'FCFS', 'SJF', 'Priority'],
            correct: 1,
            explanation: 'FCFS can cause convoy effect where short processes wait for long processes to complete.'
        },
        {
            question: 'What is the main advantage of Round Robin scheduling?',
            options: ['Minimum waiting time', 'Fair CPU allocation', 'Best throughput', 'No context switching'],
            correct: 1,
            explanation: 'Round Robin provides fair CPU time to all processes through time quantum.'
        },
        {
            question: 'SJF scheduling minimizes which metric?',
            options: ['Turnaround time', 'Average waiting time', 'Response time', 'CPU utilization'],
            correct: 1,
            explanation: 'SJF minimizes average waiting time by executing shortest jobs first.'
        },
        {
            question: 'Which algorithm is preemptive?',
            options: ['FCFS', 'SJF', 'Round Robin', 'None'],
            correct: 2,
            explanation: 'Round Robin is preemptive as it interrupts processes after time quantum expires.'
        },
        {
            question: 'What happens if time quantum is too large in RR?',
            options: ['Better performance', 'Becomes like FCFS', 'More context switches', 'Deadlock'],
            correct: 1,
            explanation: 'Large time quantum makes RR behave like FCFS as processes complete in one quantum.'
        }
    ],
    'memory-management': [
        {
            question: 'Which allocation strategy is fastest?',
            options: ['Best Fit', 'Worst Fit', 'First Fit', 'All same'],
            correct: 2,
            explanation: 'First Fit is fastest as it stops searching after finding first suitable block.'
        },
        {
            question: 'What is internal fragmentation?',
            options: ['Scattered free memory', 'Wasted space in allocated block', 'Memory leak', 'Buffer overflow'],
            correct: 1,
            explanation: 'Internal fragmentation is unused space within an allocated memory block.'
        },
        {
            question: 'Best Fit allocation creates:',
            options: ['Large holes', 'Small unusable holes', 'No fragmentation', 'Memory leaks'],
            correct: 1,
            explanation: 'Best Fit leaves small holes that are often too small to be useful.'
        },
        {
            question: 'Which technique solves external fragmentation?',
            options: ['Paging', 'Segmentation', 'Compaction', 'All of these'],
            correct: 3,
            explanation: 'Paging, segmentation, and compaction all help reduce external fragmentation.'
        },
        {
            question: 'Worst Fit allocates:',
            options: ['Smallest block', 'First available', 'Largest block', 'Random block'],
            correct: 2,
            explanation: 'Worst Fit allocates the largest available block to the process.'
        }
    ],
    'deadlock': [
        {
            question: 'How many conditions are necessary for deadlock?',
            options: ['2', '3', '4', '5'],
            correct: 2,
            explanation: 'Four conditions must hold simultaneously: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait.'
        },
        {
            question: 'What does RAG stand for?',
            options: ['Resource Allocation Graph', 'Random Access Gate', 'Rapid Algorithm Generator', 'None'],
            correct: 0,
            explanation: 'RAG is Resource Allocation Graph used to detect deadlocks visually.'
        },
        {
            question: 'Cycle in RAG always means deadlock?',
            options: ['Yes', 'No', 'Sometimes', 'Never'],
            correct: 1,
            explanation: 'Cycle indicates potential deadlock, but not always actual deadlock (depends on resource instances).'
        },
        {
            question: 'Which is NOT a deadlock prevention method?',
            options: ['Resource ordering', 'Preemption', 'Detection algorithm', 'Hold all resources'],
            correct: 2,
            explanation: 'Detection algorithm detects deadlock after it occurs, not prevents it.'
        },
        {
            question: 'Banker\'s algorithm is used for:',
            options: ['Detection', 'Prevention', 'Avoidance', 'Recovery'],
            correct: 2,
            explanation: 'Banker\'s algorithm is a deadlock avoidance algorithm that checks safe states.'
        }
    ]
};

// Load coding challenge
window.loadCodingChallenge = function(conceptId) {
    const challenge = codingChallenges[conceptId];
    const container = document.getElementById('coding-challenge-container');
    
    if (!challenge) {
        container.innerHTML = '<p class="text-gray-400">Coding challenge coming soon!</p>';
        return;
    }
    
    container.innerHTML = `
        <div class="space-y-4">
            <div>
                <h4 class="text-xl font-bold text-green-400 mb-2">${challenge.title}</h4>
                <p class="text-gray-300 text-sm mb-4">${challenge.description}</p>
            </div>
            
            <div>
                <div class="flex justify-between items-center mb-2">
                    <label class="text-sm font-semibold text-purple-300">Your Code:</label>
                    <div class="space-x-2">
                        <button onclick="runCode()" class="btn-primary px-4 py-1 rounded text-sm">▶️ Run</button>
                        <button onclick="showHint()" class="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-1 rounded text-sm">💡 Hint</button>
                        <button onclick="showSolution()" class="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded text-sm">👁️ Solution</button>
                    </div>
                </div>
                <textarea id="code-editor" class="w-full h-64 input-field p-3 rounded-lg font-mono text-sm" style="font-family: 'Courier New', monospace;">${challenge.starterCode}</textarea>
            </div>
            
            <div id="code-output" class="bg-gray-900 p-4 rounded-lg min-h-20">
                <p class="text-gray-500 text-sm">Output will appear here...</p>
            </div>
            
            <div id="hint-box" class="hidden bg-yellow-900/30 border border-yellow-600 p-4 rounded-lg">
                <p class="text-yellow-300 font-semibold mb-2">💡 Hints:</p>
                <ul class="text-yellow-200 text-sm space-y-1 list-disc list-inside">
                    ${challenge.hints.map(hint => `<li>${hint}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;
    
    // Store current challenge
    window.currentChallenge = challenge;
};

// Run code
window.runCode = function() {
    const code = document.getElementById('code-editor').value;
    const output = document.getElementById('code-output');
    
    output.innerHTML = '<p class="text-yellow-400">⚙️ Running code...</p>';
    
    try {
        // Capture console.log
        const logs = [];
        const originalLog = console.log;
        console.log = (...args) => {
            logs.push(args.map(arg => JSON.stringify(arg, null, 2)).join(' '));
        };
        
        // Execute code
        eval(code);
        
        // Restore console.log
        console.log = originalLog;
        
        if (logs.length > 0) {
            output.innerHTML = `
                <p class="text-green-400 font-semibold mb-2">✅ Success!</p>
                <pre class="text-gray-300 text-sm">${logs.join('\n')}</pre>
            `;
        } else {
            output.innerHTML = '<p class="text-green-400">✅ Code executed successfully (no output)</p>';
        }
        
    } catch (error) {
        output.innerHTML = `
            <p class="text-red-400 font-semibold mb-2">❌ Error:</p>
            <pre class="text-red-300 text-sm">${error.message}</pre>
        `;
    }
};

// Show hint
window.showHint = function() {
    const hintBox = document.getElementById('hint-box');
    hintBox.classList.toggle('hidden');
};

// Show solution
window.showSolution = function() {
    if (confirm('Are you sure you want to see the solution? Try solving it yourself first!')) {
        const editor = document.getElementById('code-editor');
        editor.value = window.currentChallenge.solution;
    }
};

// Context-aware coding chatbot
window.handleCodingChatbot = async function() {
    const input = document.getElementById('coding-chat-input');
    const messages = document.getElementById('coding-chat-messages');
    const query = input.value.trim();
    
    if (!query) return;
    
    // Add user message
    messages.innerHTML += `<div class="mb-2"><span class="text-blue-400 font-semibold">You:</span> <span class="text-gray-300">${query}</span></div>`;
    input.value = '';
    messages.scrollTop = messages.scrollHeight;
    
    // Add loading message
    const loadingMsg = document.createElement('div');
    loadingMsg.className = 'mb-2';
    loadingMsg.innerHTML = '<span class="text-green-400 font-semibold">AI Tutor:</span> <span class="text-yellow-400">Thinking...</span>';
    messages.appendChild(loadingMsg);
    messages.scrollTop = messages.scrollHeight;
    
    try {
        const currentCode = document.getElementById('code-editor').value;
        const conceptName = window.currentSubtopic ? window.currentSubtopic.name : 'Programming';
        
        const prompt = `You are a helpful coding tutor for ${conceptName}. The student is working on this code:

\`\`\`javascript
${currentCode}
\`\`\`

Student's question: ${query}

Provide a helpful, concise answer (2-3 sentences). If they're stuck, give a hint, not the full solution. If there's an error, point it out and suggest a fix.`;

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=AIzaSyBe8CbokZF-iST6PYzAUEQKG-EKqmEOFMM`;
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });
        
        const result = await response.json();
        const answer = result.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I couldn\'t process that. Try rephrasing your question.';
        
        loadingMsg.innerHTML = `<span class="text-green-400 font-semibold">AI Tutor:</span> <span class="text-gray-300">${answer}</span>`;
        
    } catch (error) {
        loadingMsg.innerHTML = '<span class="text-red-400">Error connecting to tutor. Please try again.</span>';
    }
    
    messages.scrollTop = messages.scrollHeight;
};

// Load quiz
window.loadQuiz = function(conceptId) {
    const questions = quizQuestions[conceptId];
    const container = document.getElementById('quiz-container');
    
    if (!questions) {
        container.innerHTML = '<p class="text-gray-400">Quiz coming soon!</p>';
        return;
    }
    
    let html = '<div class="space-y-6">';
    
    questions.forEach((q, index) => {
        html += `
            <div class="card p-4 bg-gray-800/50">
                <p class="text-white font-semibold mb-3">${index + 1}. ${q.question}</p>
                <div class="space-y-2">
                    ${q.options.map((option, optIndex) => `
                        <label class="flex items-center space-x-3 cursor-pointer hover:bg-gray-700/30 p-2 rounded">
                            <input type="radio" name="q${index}" value="${optIndex}" class="form-radio text-purple-500">
                            <span class="text-gray-300">${option}</span>
                        </label>
                    `).join('')}
                </div>
                <div id="explanation-${index}" class="hidden mt-3 p-3 rounded-lg"></div>
            </div>
        `;
    });
    
    html += `
        <div class="flex justify-center space-x-4">
            <button onclick="submitQuiz()" class="btn-primary px-8 py-3 rounded-lg text-lg font-semibold">
                🎯 Submit Quiz
            </button>
        </div>
        <div id="quiz-result" class="hidden mt-6 card p-6 text-center"></div>
    </div>`;
    
    container.innerHTML = html;
    window.currentQuiz = questions;
};

// Submit quiz
window.submitQuiz = function() {
    const questions = window.currentQuiz;
    let score = 0;
    let answered = 0;
    
    questions.forEach((q, index) => {
        const selected = document.querySelector(`input[name="q${index}"]:checked`);
        const explanationDiv = document.getElementById(`explanation-${index}`);
        
        if (selected) {
            answered++;
            const answer = parseInt(selected.value);
            
            if (answer === q.correct) {
                score++;
                explanationDiv.className = 'mt-3 p-3 rounded-lg bg-green-900/30 border border-green-600';
                explanationDiv.innerHTML = `<p class="text-green-300">✅ Correct! ${q.explanation}</p>`;
            } else {
                explanationDiv.className = 'mt-3 p-3 rounded-lg bg-red-900/30 border border-red-600';
                explanationDiv.innerHTML = `<p class="text-red-300">❌ Incorrect. ${q.explanation}</p>`;
            }
            explanationDiv.classList.remove('hidden');
        }
    });
    
    if (answered < questions.length) {
        alert('Please answer all questions before submitting!');
        return;
    }
    
    const percentage = Math.round((score / questions.length) * 100);
    const resultDiv = document.getElementById('quiz-result');
    
    let emoji = '🎉';
    let message = 'Excellent!';
    let color = 'text-green-400';
    
    if (percentage < 60) {
        emoji = '📚';
        message = 'Keep studying!';
        color = 'text-yellow-400';
    } else if (percentage < 80) {
        emoji = '👍';
        message = 'Good job!';
        color = 'text-blue-400';
    }
    
    resultDiv.innerHTML = `
        <div class="text-6xl mb-4">${emoji}</div>
        <h3 class="text-3xl font-bold ${color} mb-2">${message}</h3>
        <p class="text-2xl text-white mb-4">Score: ${score}/${questions.length} (${percentage}%)</p>
        <p class="text-gray-300">Review the explanations above to learn from your mistakes.</p>
    `;
    resultDiv.classList.remove('hidden');
    
    // Update user score
    if (window.currentUserData && window.currentSubtopic) {
        window.reportScore(percentage, window.currentSubtopic.name, {
            quizScore: percentage,
            questionsCorrect: score,
            totalQuestions: questions.length
        });
    }
};
