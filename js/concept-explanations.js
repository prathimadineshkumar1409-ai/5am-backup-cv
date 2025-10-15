/**
 * Concept Explanations and Personalized Advisor
 * Provides detailed explanations and AI-powered learning advice
 */

// Concept explanations database
const conceptExplanations = {
    'process-scheduling': {
        title: 'CPU Process Scheduling',
        sections: [
            {
                heading: '🎯 What is Process Scheduling?',
                content: 'Process scheduling is the activity of the process manager that handles the removal of the running process from the CPU and the selection of another process based on a particular strategy.'
            },
            {
                heading: '📋 Key Algorithms',
                content: `
                    <strong>1. First Come First Serve (FCFS):</strong><br>
                    - Simplest scheduling algorithm<br>
                    - Processes executed in order of arrival<br>
                    - Non-preemptive<br>
                    - Can cause "convoy effect"<br><br>
                    
                    <strong>2. Shortest Job First (SJF):</strong><br>
                    - Selects process with smallest execution time<br>
                    - Minimizes average waiting time<br>
                    - Can cause starvation<br>
                    - Requires knowing execution time in advance<br><br>
                    
                    <strong>3. Round Robin (RR):</strong><br>
                    - Each process gets fixed time quantum<br>
                    - Preemptive algorithm<br>
                    - Fair to all processes<br>
                    - Performance depends on time quantum size
                `
            },
            {
                heading: '⚡ Performance Metrics',
                content: `
                    <strong>Waiting Time:</strong> Time process spends in ready queue<br>
                    <strong>Turnaround Time:</strong> Total time from submission to completion<br>
                    <strong>Response Time:</strong> Time from submission to first response<br>
                    <strong>Throughput:</strong> Number of processes completed per unit time
                `
            },
            {
                heading: '💡 Real-World Applications',
                content: 'Operating systems like Windows, Linux, and macOS use sophisticated scheduling algorithms combining multiple strategies to optimize performance, fairness, and responsiveness.'
            }
        ]
    },
    'memory-management': {
        title: 'Memory Management',
        sections: [
            {
                heading: '🎯 What is Memory Management?',
                content: 'Memory management is the process of controlling and coordinating computer memory, assigning portions called blocks to various running programs to optimize overall system performance.'
            },
            {
                heading: '📋 Allocation Strategies',
                content: `
                    <strong>1. First Fit:</strong><br>
                    - Allocates first available block that fits<br>
                    - Fast allocation<br>
                    - May cause external fragmentation<br><br>
                    
                    <strong>2. Best Fit:</strong><br>
                    - Allocates smallest block that fits<br>
                    - Minimizes wasted space<br>
                    - Slower than First Fit<br>
                    - Creates small unusable holes<br><br>
                    
                    <strong>3. Worst Fit:</strong><br>
                    - Allocates largest available block<br>
                    - Leaves larger remaining blocks<br>
                    - May reduce fragmentation<br>
                    - Generally performs poorly
                `
            },
            {
                heading: '⚡ Fragmentation',
                content: `
                    <strong>Internal Fragmentation:</strong> Wasted space within allocated memory blocks<br>
                    <strong>External Fragmentation:</strong> Free memory scattered in small blocks<br>
                    <strong>Solution:</strong> Compaction, paging, or segmentation
                `
            },
            {
                heading: '💡 Modern Techniques',
                content: 'Modern systems use virtual memory, paging, and segmentation to efficiently manage memory and provide each process with its own address space.'
            }
        ]
    },
    'deadlock': {
        title: 'Deadlock Detection & Prevention',
        sections: [
            {
                heading: '🎯 What is Deadlock?',
                content: 'Deadlock is a situation where a set of processes are blocked because each process is holding a resource and waiting for another resource acquired by some other process.'
            },
            {
                heading: '📋 Four Necessary Conditions',
                content: `
                    <strong>1. Mutual Exclusion:</strong> Resources cannot be shared<br>
                    <strong>2. Hold and Wait:</strong> Process holds resources while waiting for others<br>
                    <strong>3. No Preemption:</strong> Resources cannot be forcibly taken<br>
                    <strong>4. Circular Wait:</strong> Circular chain of processes waiting for resources
                `
            },
            {
                heading: '⚡ Detection Methods',
                content: `
                    <strong>Resource Allocation Graph (RAG):</strong><br>
                    - Visual representation of resource allocation<br>
                    - Cycle detection indicates potential deadlock<br>
                    - Processes shown as circles, resources as squares<br>
                    - Edges show allocation and requests
                `
            },
            {
                heading: '💡 Prevention Strategies',
                content: `
                    <strong>1. Prevent Mutual Exclusion:</strong> Make resources shareable<br>
                    <strong>2. Prevent Hold and Wait:</strong> Require all resources at once<br>
                    <strong>3. Allow Preemption:</strong> Force release of resources<br>
                    <strong>4. Prevent Circular Wait:</strong> Order resource requests
                `
            }
        ]
    }
};

// Load concept explanation
window.loadConceptExplanation = function(conceptId) {
    const explanation = conceptExplanations[conceptId];
    const container = document.getElementById('concept-explanation');
    
    if (!explanation) {
        container.innerHTML = '<p class="text-gray-400">Detailed explanation coming soon for this topic!</p>';
        return;
    }
    
    let html = '';
    explanation.sections.forEach(section => {
        html += `
            <div class="mb-4">
                <h4 class="text-lg font-bold text-purple-300 mb-2">${section.heading}</h4>
                <div class="text-gray-300 text-sm leading-relaxed">${section.content}</div>
            </div>
        `;
    });
    
    container.innerHTML = html;
};

// Personalized AI Advisor feature has been removed
// The Gemini API is now used for course content generation instead

// Auto-load explanation when concept loads
document.addEventListener('DOMContentLoaded', () => {
    // This will be called when a concept is loaded
    const originalLoadConcept = window.loadConcept;
    if (originalLoadConcept) {
        window.loadConcept = async function(topicId, subtopic) {
            await originalLoadConcept(topicId, subtopic);
            // Load explanation after a short delay to ensure DOM is ready
            setTimeout(() => {
                loadConceptExplanation(subtopic.id);
            }, 100);
        };
    }
});
