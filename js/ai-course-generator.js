/**
 * AI-Powered Course Generator using Gemini API
 * Generates videos, concepts, quizzes, coding challenges, and game simulations
 */

const GEMINI_API_KEY = 'AIzaSyBe8CbokZF-iST6PYzAUEQKG-EKqmEOFMM';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

class AICourseGenerator {
    constructor() {
        this.apiKey = GEMINI_API_KEY;
        this.apiUrl = GEMINI_API_URL;
    }

    /**
     * Generate complete course content for a topic
     */
    async generateCourseLevel(subject, levelNumber, topicName, difficulty = 'intermediate') {
        console.log(`🤖 Generating AI content for ${subject} - Level ${levelNumber}: ${topicName}`);
        
        try {
            const prompt = this.buildCoursePrompt(subject, levelNumber, topicName, difficulty);
            const response = await this.callGeminiAPI(prompt);
            const content = this.parseGeminiResponse(response);
            
            return {
                id: levelNumber,
                title: topicName,
                description: content.description,
                icon: content.icon,
                xp: levelNumber % 5 === 0 ? 200 : 100,
                videoUrl: content.videoUrl,
                concepts: content.concepts,
                quiz: levelNumber % 5 === 0 ? null : content.quiz,
                game: levelNumber % 5 === 0 ? content.game : null,
                gameManual: levelNumber % 5 === 0 ? content.gameManual : null,
                coding: levelNumber % 5 === 0 ? content.coding : null
            };
        } catch (error) {
            console.error(`Error generating level ${levelNumber}:`, error);
            return this.getFallbackContent(subject, levelNumber, topicName);
        }
    }

    /**
     * Build comprehensive prompt for Gemini API
     */
    buildCoursePrompt(subject, levelNumber, topicName, difficulty) {
        const isMilestone = levelNumber % 5 === 0;
        
        return `You are an expert educational content creator for "${subject}" courses. Generate comprehensive learning content for:

**Level ${levelNumber}: ${topicName}** (Difficulty: ${difficulty})

Generate a JSON response with the following structure:

{
    "description": "Brief 1-sentence description of this topic",
    "icon": "Single emoji that represents this topic",
    "videoUrl": "Search YouTube and provide the BEST educational video URL for '${subject} ${topicName} tutorial'. Must be a real, working YouTube URL in format: https://www.youtube.com/watch?v=VIDEO_ID",
    "concepts": [
        {
            "title": "Main concept name",
            "content": "Detailed explanation (2-3 sentences) with technical accuracy",
            "example": "Code example or pseudocode demonstrating the concept"
        }
    ],
    ${!isMilestone ? `"quiz": {
        "questions": [
            {
                "question": "Technical question about the concept",
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "correct": 0
            }
        ]
    },` : ''}
    ${isMilestone ? `"game": "${subject.toLowerCase()}-${topicName.toLowerCase().replace(/\s+/g, '-')}-game",
    "gameManual": "🎮 Game: Brief description of interactive simulation/challenge",
    "coding": {
        "title": "Coding challenge title",
        "description": "What the student needs to implement",
        "starterCode": "// Starter code template with comments\\nfunction solution() {\\n  // Your code here\\n}"
    },` : ''}
}

Requirements:
1. **Video URL**: Must be a real, popular YouTube tutorial (check channels like freeCodeCamp, Traversy Media, Programming with Mosh, CS Dojo)
2. **Concepts**: Provide 1-2 key concepts with clear explanations and code examples
3. **Quiz**: ${!isMilestone ? 'Generate 5 challenging multiple-choice questions' : 'Not needed for milestone levels'}
4. **Game**: ${isMilestone ? 'Describe an interactive Phaser.js game simulation' : 'Not needed for regular levels'}
5. **Coding**: ${isMilestone ? 'Create a practical coding challenge with starter code' : 'Not needed for regular levels'}

Return ONLY valid JSON, no markdown formatting or extra text.`;
    }

    /**
     * Call Gemini API
     */
    async callGeminiAPI(prompt) {
        const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 2048,
                }
            })
        });

        if (!response.ok) {
            throw new Error(`Gemini API error: ${response.status}`);
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    }

    /**
     * Parse Gemini response and extract JSON
     */
    parseGeminiResponse(response) {
        try {
            // Remove markdown code blocks if present
            let jsonText = response.trim();
            if (jsonText.startsWith('```json')) {
                jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
            } else if (jsonText.startsWith('```')) {
                jsonText = jsonText.replace(/```\n?/g, '');
            }
            
            const parsed = JSON.parse(jsonText);
            return parsed;
        } catch (error) {
            console.error('Error parsing Gemini response:', error);
            console.log('Raw response:', response);
            throw new Error('Failed to parse AI response');
        }
    }

    /**
     * Generate game simulation code
     */
    async generateGameSimulation(subject, topicName, gameDescription) {
        console.log(`🎮 Generating game simulation for ${topicName}`);
        
        const prompt = `Create a Phaser.js game class for "${topicName}" in ${subject}.

Game Description: ${gameDescription}

Generate a complete Phaser.js game class with:
1. Interactive gameplay mechanics
2. Visual elements (sprites, text, buttons)
3. Scoring system
4. User interactions
5. Educational feedback

Return JavaScript code for a Phaser Scene class that extends BaseGameScene.

Example structure:
\`\`\`javascript
class ${topicName.replace(/\s+/g, '')}Game extends BaseGameScene {
    constructor() {
        super('${topicName.replace(/\s+/g, '')}Game');
    }
    
    create() {
        super.create();
        // Game setup
    }
    
    update() {
        // Game loop
    }
}
window.${topicName.replace(/\s+/g, '')}Game = ${topicName.replace(/\s+/g, '')}Game;
\`\`\`

Return ONLY the JavaScript code, no explanations.`;

        try {
            const response = await this.callGeminiAPI(prompt);
            return this.extractCode(response);
        } catch (error) {
            console.error('Error generating game:', error);
            return this.getFallbackGameCode(topicName);
        }
    }

    /**
     * Extract code from response
     */
    extractCode(response) {
        let code = response.trim();
        if (code.startsWith('```javascript')) {
            code = code.replace(/```javascript\n?/g, '').replace(/```\n?/g, '');
        } else if (code.startsWith('```')) {
            code = code.replace(/```\n?/g, '');
        }
        return code;
    }

    /**
     * Fallback content if API fails
     */
    getFallbackContent(subject, levelNumber, topicName) {
        return {
            id: levelNumber,
            title: topicName,
            description: `Learn ${topicName}`,
            icon: "📚",
            xp: levelNumber % 5 === 0 ? 200 : 100,
            videoUrl: "https://www.youtube.com/watch?v=8hly31xKli0",
            concepts: [{
                title: topicName,
                content: `Core concepts of ${topicName}`,
                example: "// Example code"
            }],
            quiz: levelNumber % 5 === 0 ? null : {
                questions: [
                    {
                        question: `What is ${topicName}?`,
                        options: ["Option A", "Option B", "Option C", "Option D"],
                        correct: 0
                    }
                ]
            },
            game: levelNumber % 5 === 0 ? `${subject.toLowerCase()}-game-${levelNumber}` : null,
            gameManual: levelNumber % 5 === 0 ? `🎮 ${topicName} Challenge` : null,
            coding: levelNumber % 5 === 0 ? {
                title: `${topicName} Challenge`,
                description: "Implement the solution",
                starterCode: "// Your code here"
            } : null
        };
    }

    /**
     * Fallback game code
     */
    getFallbackGameCode(topicName) {
        return `class ${topicName.replace(/\s+/g, '')}Game extends BaseGameScene {
    constructor() {
        super('${topicName.replace(/\s+/g, '')}Game');
    }
    
    create() {
        super.create();
        this.add.text(400, 300, '${topicName} Game', {
            fontSize: '32px',
            fill: '#fff'
        }).setOrigin(0.5);
    }
}
window.${topicName.replace(/\s+/g, '')}Game = ${topicName.replace(/\s+/g, '')}Game;`;
    }

    /**
     * Generate complete course with all levels
     */
    async generateCompleteCourse(subject, levels) {
        console.log(`🚀 Starting AI course generation for ${subject}`);
        const generatedLevels = [];
        
        for (let i = 0; i < levels.length; i++) {
            const level = levels[i];
            console.log(`\n📝 Generating Level ${level.id}/${levels.length}: ${level.title}`);
            
            const content = await this.generateCourseLevel(
                subject,
                level.id,
                level.title,
                level.difficulty || 'intermediate'
            );
            
            generatedLevels.push(content);
            
            // Generate game code for milestone levels
            if (level.id % 5 === 0 && content.game) {
                const gameCode = await this.generateGameSimulation(
                    subject,
                    level.title,
                    content.gameManual
                );
                
                // Save game code to file
                console.log(`💾 Game code generated for ${level.title}`);
                content.gameCode = gameCode;
            }
            
            // Add delay to avoid rate limiting
            await this.delay(2000);
        }
        
        console.log(`✅ Course generation complete for ${subject}!`);
        return generatedLevels;
    }

    /**
     * Delay helper
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Export for use in Node.js or browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AICourseGenerator;
} else {
    window.AICourseGenerator = AICourseGenerator;
}
