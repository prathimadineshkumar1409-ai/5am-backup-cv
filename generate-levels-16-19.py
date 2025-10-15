"""
Generate comprehensive content for DSA Levels 16-19 using Gemini API
Topics: Hashing, Heaps, Dynamic Programming, Greedy Algorithms
"""

import json
import requests
import time
from typing import Dict, List

# Gemini API Configuration
GEMINI_API_KEY = "AIzaSyBe8CbokZF-iST6PYzAUEQKG-EKqmEOFMM"
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent"

class LevelContentGenerator:
    def __init__(self):
        self.api_key = GEMINI_API_KEY
        self.api_url = GEMINI_API_URL
        
    def call_gemini_api(self, prompt: str) -> str:
        """Call Gemini API with the given prompt"""
        headers = {"Content-Type": "application/json"}
        
        data = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {
                "temperature": 0.7,
                "topK": 40,
                "topP": 0.95,
                "maxOutputTokens": 3000
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
            json_text = response.strip()
            if json_text.startswith("```json"):
                json_text = json_text.replace("```json", "").replace("```", "").strip()
            elif json_text.startswith("```"):
                json_text = json_text.replace("```", "").strip()
            
            return json.loads(json_text)
        except json.JSONDecodeError as e:
            print(f"❌ JSON Parse Error: {e}")
            print(f"Response preview: {response[:300]}...")
            return None

    def generate_level_content(self, level_num: int, topic_name: str, difficulty: str) -> Dict:
        """Generate comprehensive content for a level"""
        
        prompt = f"""You are an expert educational content creator for Data Structures & Algorithms. Generate comprehensive, high-quality learning content for:

**Level {level_num}: {topic_name}** (Difficulty: {difficulty})

Generate a JSON response with this EXACT structure:

{{
    "description": "Clear 1-2 sentence description explaining what students will learn",
    "icon": "Single relevant emoji",
    "concepts": [
        {{
            "title": "First key concept name",
            "content": "Detailed explanation (3-4 sentences) with technical accuracy. Explain WHY this concept matters and HOW it works.",
            "example": "Practical code example in JavaScript with comments showing the concept in action"
        }},
        {{
            "title": "Second key concept name",
            "content": "Detailed explanation (3-4 sentences) covering implementation details and use cases.",
            "example": "Another practical JavaScript code example with clear comments"
        }}
    ],
    "quiz": {{
        "questions": [
            {{
                "question": "Challenging technical question testing deep understanding",
                "options": ["Detailed option A", "Detailed option B", "Detailed option C", "Detailed option D"],
                "correct": 0
            }},
            {{
                "question": "Second question covering different aspect",
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "correct": 1
            }},
            {{
                "question": "Third question about practical application",
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "correct": 2
            }},
            {{
                "question": "Fourth question about complexity or performance",
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "correct": 1
            }},
            {{
                "question": "Fifth question testing advanced understanding",
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "correct": 3
            }}
        ]
    }},
    "coding": {{
        "title": "Practical coding challenge title",
        "description": "Clear problem statement with examples and constraints. Make it realistic and practical.",
        "starterCode": "// Detailed starter code template with helpful comments\\nfunction solution(param) {{\\n  // TODO: Implement your solution here\\n  // Hint: Consider using {topic_name} concepts\\n  \\n  return result;\\n}}"
    }}
}}

CRITICAL REQUIREMENTS:
1. **Concepts**: Provide 2 comprehensive concepts with real-world context
2. **Quiz**: Generate exactly 5 unique, challenging questions with varied correct answers (not all 0)
3. **Coding**: Create a practical, interview-style coding challenge
4. **Code Examples**: Use JavaScript with clear, working code examples
5. **Technical Accuracy**: Ensure all information is correct and up-to-date

Return ONLY valid JSON without any markdown formatting, explanations, or extra text."""

        print(f"\n🤖 Generating content for Level {level_num}: {topic_name}...")
        response = self.call_gemini_api(prompt)
        
        if not response:
            print(f"⚠️  Using fallback content for Level {level_num}")
            return self.get_fallback_content(level_num, topic_name)
        
        content = self.parse_json_response(response)
        if not content:
            print(f"⚠️  Using fallback content for Level {level_num}")
            return self.get_fallback_content(level_num, topic_name)
        
        # Validate and ensure quiz has 5 questions
        quiz = content.get("quiz", {})
        questions = quiz.get("questions", [])
        if len(questions) < 5:
            print(f"⚠️  Quiz has only {len(questions)} questions, padding to 5")
            while len(questions) < 5:
                questions.append({
                    "question": f"What is an important aspect of {topic_name}?",
                    "options": [
                        f"Understanding {topic_name} basics",
                        f"Applying {topic_name} in practice",
                        f"Optimizing {topic_name} performance",
                        "All of the above"
                    ],
                    "correct": 3
                })
        
        level = {
            "id": level_num,
            "title": topic_name,
            "description": content.get("description", f"Learn {topic_name}"),
            "icon": content.get("icon", "📚"),
            "xp": 100,
            "videoUrl": content.get("videoUrl", ""),
            "concepts": content.get("concepts", []),
            "quiz": {"questions": questions[:5]},
            "coding": content.get("coding", {})
        }
        
        print(f"✅ Level {level_num} generated successfully!")
        print(f"   - Concepts: {len(level['concepts'])}")
        print(f"   - Quiz Questions: {len(level['quiz']['questions'])}")
        print(f"   - Coding Challenge: {level['coding'].get('title', 'N/A')}")
        
        return level
    
    def get_fallback_content(self, level_num: int, topic_name: str) -> Dict:
        """Fallback content if API fails"""
        return {
            "id": level_num,
            "title": topic_name,
            "description": f"Learn {topic_name}",
            "icon": "📚",
            "xp": 100,
            "videoUrl": "",
            "concepts": [
                {
                    "title": topic_name,
                    "content": f"Core concepts of {topic_name}",
                    "example": "// Example code"
                }
            ],
            "quiz": {
                "questions": [
                    {
                        "question": f"What is {topic_name}?",
                        "options": ["Option A", "Option B", "Option C", "Option D"],
                        "correct": 0
                    }
                ] * 5
            },
            "coding": {
                "title": f"{topic_name} Challenge",
                "description": "Implement the solution",
                "starterCode": "// Your code here"
            }
        }

def main():
    """Generate content for levels 16-19"""
    generator = LevelContentGenerator()
    
    print("\n" + "="*70)
    print("🎓 GENERATING DSA LEVELS 17-19 CONTENT")
    print("="*70)
    
    # Define levels to generate (17, 18, 19 only - 16 is already done)
    levels_to_generate = [
        {"id": 17, "title": "Heaps", "difficulty": "intermediate"},
        {"id": 18, "title": "Dynamic Programming", "difficulty": "advanced"},
        {"id": 19, "title": "Greedy Algorithms", "difficulty": "advanced"}
    ]
    
    generated_levels = []
    
    for level_info in levels_to_generate:
        level = generator.generate_level_content(
            level_info["id"],
            level_info["title"],
            level_info["difficulty"]
        )
        generated_levels.append(level)
        
        # Add delay to avoid rate limiting
        if level_info["id"] < 19:
            print(f"⏳ Waiting 3 seconds before next request...")
            time.sleep(3)
    
    # Load existing config
    config_file = "data/dsa-courses-config.json"
    try:
        with open(config_file, 'r', encoding='utf-8') as f:
            courses_data = json.load(f)
    except FileNotFoundError:
        print(f"❌ Config file not found: {config_file}")
        return
    
    # Update levels 16-19
    existing_levels = courses_data["courses"]["dsa"]["levels"]
    
    for new_level in generated_levels:
        level_id = new_level["id"]
        # Find and replace the level
        for i, level in enumerate(existing_levels):
            if level["id"] == level_id:
                existing_levels[i] = new_level
                print(f"✅ Updated Level {level_id} in config")
                break
    
    # Save updated config
    with open(config_file, 'w', encoding='utf-8') as f:
        json.dump(courses_data, f, indent=2, ensure_ascii=False)
    
    print("\n" + "="*70)
    print(f"✅ LEVELS 17-19 UPDATED IN {config_file}")
    print("="*70)
    print(f"\n📊 Summary:")
    print(f"   - Levels Generated: {len(generated_levels)}")
    print(f"   - Level 17: Heaps")
    print(f"   - Level 18: Dynamic Programming")
    print(f"   - Level 19: Greedy Algorithms")
    print("\n🎉 Content generation complete!")
    print("\n💡 Next steps:")
    print("   1. Review the generated content in data/dsa-courses-config.json")
    print("   2. Add video URLs manually if needed")
    print("   3. Test the levels in the application")
    print()

if __name__ == "__main__":
    main()
