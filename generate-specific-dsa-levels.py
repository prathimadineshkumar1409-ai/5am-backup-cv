"""
Generate content for specific DSA levels that need updating
Targets levels: 2, 3, 4, 6, 8, 9, 11, 12, 13, 14, 16, 17, 18, 19
"""

import json
import requests
import time
from typing import Dict, List

# Gemini API Configuration
GEMINI_API_KEY = "AIzaSyBe8CbokZF-iST6PYzAUEQKG-EKqmEOFMM"
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent"

class DSALevelGenerator:
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

    def generate_level_content(self, level_num: int, topic_name: str, video_url: str) -> Dict:
        """Generate comprehensive content for a DSA level"""
        
        prompt = f"""You are an expert educational content creator for Data Structures & Algorithms. Generate comprehensive learning content for:

**Level {level_num}: {topic_name}**

Generate a JSON response with the following structure:

{{
    "concepts": [
        {{
            "title": "First key concept about {topic_name}",
            "content": "Detailed explanation (3-4 sentences) covering what it is, why it's important, and how it works. Be technically accurate and educational.",
            "example": "// Practical code example in JavaScript demonstrating this concept\\n// Include comments explaining the code\\nfunction example() {{\\n  // implementation\\n}}"
        }},
        {{
            "title": "Second key concept about {topic_name}",
            "content": "Detailed explanation (3-4 sentences) covering another important aspect of {topic_name}.",
            "example": "// Another practical code example\\n// With clear comments\\nfunction example2() {{\\n  // implementation\\n}}"
        }}
    ],
    "quiz": {{
        "questions": [
            {{
                "question": "Challenging technical question about {topic_name}",
                "options": ["Correct answer", "Plausible wrong answer", "Another wrong answer", "Fourth option"],
                "correct": 0
            }},
            {{
                "question": "Second question testing understanding",
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
                "correct": 3
            }},
            {{
                "question": "Fifth question testing deeper understanding",
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "correct": 0
            }}
        ]
    }},
    "coding": {{
        "title": "Practical coding challenge title related to {topic_name}",
        "description": "Clear description of what the student needs to implement. Be specific about inputs, outputs, and requirements.",
        "starterCode": "// Starter code template with helpful comments\\n// Explain what needs to be implemented\\nfunction solution(input) {{\\n  // Your code here\\n  // TODO: Implement the solution\\n  \\n  return result;\\n}}"
    }}
}}

Requirements:
1. **Concepts**: Provide exactly 2 comprehensive concepts with clear explanations and working code examples
2. **Quiz**: Generate exactly 5 unique, challenging multiple-choice questions. Each question should test different aspects of {topic_name}. Ensure the correct answer index (0-3) is accurate.
3. **Coding**: Create a practical, level-appropriate coding challenge with a helpful starter code template
4. Make all content educational, technically accurate, and engaging for learners

Return ONLY valid JSON, no markdown formatting or extra text."""

        print(f"🤖 Generating content for Level {level_num}: {topic_name}...")
        response = self.call_gemini_api(prompt)
        
        if not response:
            print(f"❌ Failed to generate content for Level {level_num}")
            return None
        
        content = self.parse_json_response(response)
        if not content:
            print(f"❌ Failed to parse content for Level {level_num}")
            return None
        
        # Validate quiz has exactly 5 questions
        quiz = content.get("quiz", {})
        questions = quiz.get("questions", [])
        if len(questions) != 5:
            print(f"⚠️  Warning: Level {level_num} has {len(questions)} questions instead of 5")
        
        print(f"✅ Level {level_num} content generated successfully!")
        return content

def main():
    """Main function to update specific DSA levels"""
    generator = DSALevelGenerator()
    
    print("\n" + "="*70)
    print("🎓 DSA COURSE CONTENT GENERATOR - SPECIFIC LEVELS UPDATE")
    print("="*70)
    
    # Load existing config
    config_path = "data/dsa-courses-config.json"
    try:
        with open(config_path, 'r', encoding='utf-8') as f:
            courses_data = json.load(f)
    except Exception as e:
        print(f"❌ Error loading config: {e}")
        return
    
    levels = courses_data["courses"]["dsa"]["levels"]
    
    # Levels to update (excluding 1, 5, 7, 10, 15, 20 which are already done or are milestones)
    levels_to_update = [2, 3, 4, 6, 8, 9, 11, 12, 13, 14, 16, 17, 18, 19]
    
    print(f"\n📚 Updating {len(levels_to_update)} levels...")
    print(f"Levels: {levels_to_update}\n")
    print("="*70 + "\n")
    
    for level_id in levels_to_update:
        # Find the level in the config
        level_index = level_id - 1  # Array is 0-indexed
        current_level = levels[level_index]
        
        topic_name = current_level["title"]
        video_url = current_level.get("videoUrl", "")
        
        # Generate new content
        new_content = generator.generate_level_content(level_id, topic_name, video_url)
        
        if new_content:
            # Update the level with new content
            current_level["concepts"] = new_content.get("concepts", current_level["concepts"])
            current_level["quiz"] = new_content.get("quiz", current_level["quiz"])
            current_level["coding"] = new_content.get("coding", current_level["coding"])
            
            # Keep existing fields
            current_level["description"] = new_content.get("concepts", [{}])[0].get("content", current_level["description"])[:100] + "..." if new_content.get("concepts") else current_level["description"]
        
        # Add delay to avoid rate limiting
        if level_id != levels_to_update[-1]:
            print(f"⏳ Waiting 3 seconds before next request...\n")
            time.sleep(3)
    
    # Save updated config
    try:
        with open(config_path, 'w', encoding='utf-8') as f:
            json.dump(courses_data, f, indent=2, ensure_ascii=False)
        print("\n" + "="*70)
        print(f"✅ Successfully updated {config_path}")
        print("="*70)
        print(f"\n📊 Summary:")
        print(f"   - Levels Updated: {len(levels_to_update)}")
        print(f"   - Total Levels: {len(levels)}")
        print("\n🎉 Content generation complete!\n")
    except Exception as e:
        print(f"❌ Error saving config: {e}")

if __name__ == "__main__":
    main()
