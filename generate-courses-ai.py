"""
AI-Powered Course Generator
Uses Gemini API to generate complete course content including:
- YouTube video recommendations
- Concept explanations
- Quiz questions
- Coding challenges
- Game simulations
"""

import json
import requests
import time
from typing import Dict, List, Any

# Gemini API Configuration
GEMINI_API_KEY = "AIzaSyBe8CbokZF-iST6PYzAUEQKG-EKqmEOFMM"
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent"

class AICourseGenerator:
    def __init__(self):
        self.api_key = GEMINI_API_KEY
        self.api_url = GEMINI_API_URL
        
    def call_gemini_api(self, prompt: str) -> str:
        """Call Gemini API with the given prompt"""
        headers = {
            "Content-Type": "application/json"
        }
        
        data = {
            "contents": [{
                "parts": [{
                    "text": prompt
                }]
            }],
            "generationConfig": {
                "temperature": 0.7,
                "topK": 40,
                "topP": 0.95,
                "maxOutputTokens": 2048
            }
        }
        
        try:
            response = requests.post(
                f"{self.api_url}?key={self.api_key}",
                headers=headers,
                json=data,
                timeout=30
            )
            response.raise_for_status()
            result = response.json()
            return result["candidates"][0]["content"]["parts"][0]["text"]
        except Exception as e:
            print(f"❌ API Error: {e}")
            return None
    
    def parse_json_response(self, response: str) -> Dict:
        """Parse JSON from Gemini response"""
        try:
            # Remove markdown code blocks if present
            json_text = response.strip()
            if json_text.startswith("```json"):
                json_text = json_text.replace("```json", "").replace("```", "").strip()
            elif json_text.startswith("```"):
                json_text = json_text.replace("```", "").strip()
            
            return json.loads(json_text)
        except json.JSONDecodeError as e:
            print(f"❌ JSON Parse Error: {e}")
            print(f"Response: {response[:200]}...")
            return None
    
    def generate_level_content(self, subject: str, level_num: int, topic_name: str, difficulty: str = "intermediate") -> Dict:
        """Generate complete content for a single level"""
        is_milestone = level_num % 5 == 0
        
        prompt = f"""You are an expert educational content creator for "{subject}" courses. Generate comprehensive learning content for:

**Level {level_num}: {topic_name}** (Difficulty: {difficulty})

Generate a JSON response with the following structure:

{{
    "description": "Brief 1-sentence description of this topic",
    "icon": "Single emoji that represents this topic",
    "videoUrl": "Search YouTube and provide the BEST educational video URL for '{subject} {topic_name} tutorial'. Must be a real, working YouTube URL in format: https://www.youtube.com/watch?v=VIDEO_ID. Prefer popular channels like freeCodeCamp, Traversy Media, Programming with Mosh, CS Dojo, or Abdul Bari",
    "concepts": [
        {{
            "title": "Main concept name",
            "content": "Detailed explanation (2-3 sentences) with technical accuracy",
            "example": "Code example or pseudocode demonstrating the concept"
        }}
    ],
    {"\"quiz\": {" if not is_milestone else ""}
    {"\"questions\": [" if not is_milestone else ""}
    {"    {" if not is_milestone else ""}
    {"        \"question\": \"Technical question about the concept\"," if not is_milestone else ""}
    {"        \"options\": [\"Option A\", \"Option B\", \"Option C\", \"Option D\"]," if not is_milestone else ""}
    {"        \"correct\": 0" if not is_milestone else ""}
    {"    }" if not is_milestone else ""}
    {"]" if not is_milestone else ""}
    {"}," if not is_milestone else ""}
    {"\"game\": \"" + subject.lower() + "-" + topic_name.lower().replace(" ", "-") + "-game\"," if is_milestone else ""}
    {"\"gameManual\": \"🎮 Game: Brief description of interactive simulation/challenge\"," if is_milestone else ""}
    {"\"coding\": {" if is_milestone else ""}
    {"    \"title\": \"Coding challenge title\"," if is_milestone else ""}
    {"    \"description\": \"What the student needs to implement\"," if is_milestone else ""}
    {"    \"starterCode\": \"// Starter code template with comments\\\\nfunction solution() {{\\\\n  // Your code here\\\\n}}\"" if is_milestone else ""}
    {"}," if is_milestone else ""}
}}

Requirements:
1. **Video URL**: Must be a real, popular YouTube tutorial URL
2. **Concepts**: Provide 1-2 key concepts with clear explanations and code examples
3. **Quiz**: {"Generate 5 challenging multiple-choice questions with correct answer index" if not is_milestone else "Not needed for milestone levels"}
4. **Game**: {"Describe an interactive Phaser.js game simulation" if is_milestone else "Not needed for regular levels"}
5. **Coding**: {"Create a practical coding challenge with starter code" if is_milestone else "Not needed for regular levels"}

Return ONLY valid JSON, no markdown formatting or extra text."""

        print(f"🤖 Generating content for Level {level_num}: {topic_name}...")
        response = self.call_gemini_api(prompt)
        
        if not response:
            return self.get_fallback_content(subject, level_num, topic_name, is_milestone)
        
        content = self.parse_json_response(response)
        if not content:
            return self.get_fallback_content(subject, level_num, topic_name, is_milestone)
        
        # Build level object
        level = {
            "id": level_num,
            "title": topic_name,
            "description": content.get("description", f"Learn {topic_name}"),
            "icon": content.get("icon", "📚"),
            "xp": 200 if is_milestone else 100,
            "videoUrl": content.get("videoUrl", "https://www.youtube.com/watch?v=8hly31xKli0"),
            "concepts": content.get("concepts", [{"title": topic_name, "content": f"Core concepts of {topic_name}", "example": "// Example"}])
        }
        
        if not is_milestone:
            level["quiz"] = content.get("quiz", {"questions": []})
        else:
            level["game"] = content.get("game", f"{subject.lower()}-game-{level_num}")
            level["gameManual"] = content.get("gameManual", f"🎮 {topic_name} Challenge")
            level["coding"] = content.get("coding", {"title": f"{topic_name} Challenge", "description": "Implement the solution", "starterCode": "// Your code here"})
        
        print(f"✅ Level {level_num} generated successfully!")
        return level
    
    def get_fallback_content(self, subject: str, level_num: int, topic_name: str, is_milestone: bool) -> Dict:
        """Fallback content if API fails"""
        level = {
            "id": level_num,
            "title": topic_name,
            "description": f"Learn {topic_name}",
            "icon": "📚",
            "xp": 200 if is_milestone else 100,
            "videoUrl": "https://www.youtube.com/watch?v=8hly31xKli0",
            "concepts": [{
                "title": topic_name,
                "content": f"Core concepts of {topic_name}",
                "example": "// Example code"
            }]
        }
        
        if not is_milestone:
            level["quiz"] = {
                "questions": [{
                    "question": f"What is {topic_name}?",
                    "options": ["Option A", "Option B", "Option C", "Option D"],
                    "correct": 0
                }]
            }
        else:
            level["game"] = f"{subject.lower()}-game-{level_num}"
            level["gameManual"] = f"🎮 {topic_name} Challenge"
            level["coding"] = {
                "title": f"{topic_name} Challenge",
                "description": "Implement the solution",
                "starterCode": "// Your code here"
            }
        
        return level
    
    def generate_course(self, subject: str, course_name: str, icon: str, topics: List[Dict]) -> Dict:
        """Generate complete course with all levels"""
        print(f"\n{'='*60}")
        print(f"🚀 Starting AI Course Generation for {course_name}")
        print(f"{'='*60}\n")
        
        levels = []
        for i, topic in enumerate(topics, 1):
            level = self.generate_level_content(
                subject,
                i,
                topic["title"],
                topic.get("difficulty", "intermediate")
            )
            levels.append(level)
            
            # Add delay to avoid rate limiting
            if i < len(topics):
                print(f"⏳ Waiting 2 seconds before next request...\n")
                time.sleep(2)
        
        print(f"\n✅ Course generation complete for {course_name}!")
        print(f"📊 Generated {len(levels)} levels\n")
        
        return {
            "name": course_name,
            "icon": icon,
            "levels": levels
        }

# Define course topics
DSA_TOPICS = [
    {"title": "Introduction to DSA", "difficulty": "beginner"},
    {"title": "Arrays", "difficulty": "beginner"},
    {"title": "Linked Lists", "difficulty": "beginner"},
    {"title": "Stacks & Queues", "difficulty": "beginner"},
    {"title": "Stack & Queue Challenge", "difficulty": "intermediate"},  # Milestone
    {"title": "Trees", "difficulty": "intermediate"},
    {"title": "Tree Traversals", "difficulty": "intermediate"},
    {"title": "Binary Search Trees", "difficulty": "intermediate"},
    {"title": "AVL Trees", "difficulty": "advanced"},
    {"title": "Tree Challenge", "difficulty": "intermediate"},  # Milestone
    {"title": "Graphs", "difficulty": "intermediate"},
    {"title": "BFS & DFS", "difficulty": "intermediate"},
    {"title": "Dijkstra's Algorithm", "difficulty": "advanced"},
    {"title": "Minimum Spanning Tree", "difficulty": "advanced"},
    {"title": "Graph Challenge", "difficulty": "advanced"},  # Milestone
    {"title": "Hashing", "difficulty": "intermediate"},
    {"title": "Heaps", "difficulty": "intermediate"},
    {"title": "Dynamic Programming", "difficulty": "advanced"},
    {"title": "Greedy Algorithms", "difficulty": "advanced"},
    {"title": "DSA Mastery", "difficulty": "expert"}  # Final Milestone
]

OS_TOPICS = [
    {"title": "Introduction to OS", "difficulty": "beginner"},
    {"title": "Process Management", "difficulty": "beginner"},
    {"title": "CPU Scheduling", "difficulty": "intermediate"},
    {"title": "Process Synchronization", "difficulty": "intermediate"},
    {"title": "Scheduling Challenge", "difficulty": "intermediate"},  # Milestone
    {"title": "Memory Management", "difficulty": "intermediate"},
    {"title": "Paging", "difficulty": "intermediate"},
    {"title": "Segmentation", "difficulty": "intermediate"},
    {"title": "Virtual Memory", "difficulty": "advanced"},
    {"title": "Memory Challenge", "difficulty": "intermediate"},  # Milestone
    {"title": "Deadlock", "difficulty": "intermediate"},
    {"title": "Deadlock Prevention", "difficulty": "intermediate"},
    {"title": "File Systems", "difficulty": "intermediate"},
    {"title": "Disk Scheduling", "difficulty": "intermediate"},
    {"title": "Deadlock Challenge", "difficulty": "advanced"},  # Milestone
    {"title": "I/O Systems", "difficulty": "intermediate"},
    {"title": "Protection & Security", "difficulty": "advanced"},
    {"title": "Distributed Systems", "difficulty": "advanced"},
    {"title": "Real-Time Systems", "difficulty": "advanced"},
    {"title": "OS Mastery", "difficulty": "expert"}  # Final Milestone
]

def main():
    """Main function to generate courses"""
    generator = AICourseGenerator()
    
    # Generate courses
    print("\n" + "="*60)
    print("🎓 AI-POWERED COURSE GENERATOR")
    print("="*60)
    
    courses_data = {
        "courses": {}
    }
    
    # Generate DSA Course
    print("\n📚 Generating Data Structures & Algorithms Course...")
    dsa_course = generator.generate_course("DSA", "Data Structures & Algorithms", "🧮", DSA_TOPICS)
    courses_data["courses"]["dsa"] = dsa_course
    
    # Generate OS Course
    print("\n💻 Generating Operating Systems Course...")
    os_course = generator.generate_course("OS", "Operating Systems", "💻", OS_TOPICS)
    courses_data["courses"]["os"] = os_course
    
    # Save to file
    output_file = "data/courses-config.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(courses_data, f, indent=2, ensure_ascii=False)
    
    print("\n" + "="*60)
    print(f"✅ Courses saved to {output_file}")
    print("="*60)
    print(f"\n📊 Summary:")
    print(f"   - DSA Levels: {len(dsa_course['levels'])}")
    print(f"   - OS Levels: {len(os_course['levels'])}")
    print(f"   - Total Levels: {len(dsa_course['levels']) + len(os_course['levels'])}")
    print("\n🎉 Course generation complete!\n")

if __name__ == "__main__":
    main()
