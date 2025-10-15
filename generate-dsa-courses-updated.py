"""
Updated AI-Powered Course Generator for DSA
- Empty video URLs (user will add manually)
- Milestone levels (5, 10, 15, 20) focus on review + game simulation
- Regular levels have concepts, quiz, and coding exercises
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

    def ensure_quiz_questions(self, quiz: Dict, desired_count: int = 5, topic_name: str = None, level_num: int = None) -> Dict:
        """Ensure the quiz object contains `desired_count` unique questions.
        - Removes duplicate question text
        - If too few, fills with fallback questions
        - Ensures each question has 4 options and a valid `correct` index
        """
        if not isinstance(quiz, dict):
            quiz = {"questions": []}

        questions = quiz.get("questions", []) or []

        # Normalize and dedupe by question text
        seen = set()
        unique_questions = []
        for q in questions:
            qtext = str(q.get("question", "")).strip()
            if not qtext:
                continue
            if qtext in seen:
                continue
            seen.add(qtext)

            # Ensure options
            opts = q.get("options") or []
            if not isinstance(opts, list):
                opts = []

            # Coerce to 4 options
            if len(opts) < 4:
                # append generic placeholders if missing
                opts = opts + [f"Option {chr(65 + i)}" for i in range(len(opts), 4)]
            else:
                opts = opts[:4]

            # Ensure correct index is valid
            correct = q.get("correct")
            try:
                correct = int(correct)
            except Exception:
                correct = 0
            if correct < 0 or correct >= len(opts):
                correct = 0

            unique_questions.append({
                "question": qtext,
                "options": opts,
                "correct": correct
            })

        # If still fewer than desired_count, add fallback unique questions
        fallback_idx = 1
        base_topic = topic_name or "this topic"
        while len(unique_questions) < desired_count:
            # Make fallback question include topic/level context for relevance
            if level_num:
                fallback_q = f"Level {level_num} - {base_topic}: fallback question {fallback_idx}"
            else:
                fallback_q = f"{base_topic}: fallback question {fallback_idx}"

            if fallback_q not in seen:
                # Create unique options referencing the topic to avoid same-option repeats
                options = [
                    f"Understand {base_topic}",
                    f"Apply {base_topic}",
                    f"Example of {base_topic}",
                    f"None of the above"
                ]

                # Ensure options are unique
                seen_opts = set()
                unique_opts = []
                for o in options:
                    if o in seen_opts:
                        # append a small suffix to make unique
                        o = o + f" ({fallback_idx})"
                    seen_opts.add(o)
                    unique_opts.append(o)

                unique_questions.append({
                    "question": fallback_q,
                    "options": unique_opts[:4],
                    "correct": 0
                })
                seen.add(fallback_q)
            fallback_idx += 1

        return {"questions": unique_questions[:desired_count]}
    
    def generate_regular_level(self, level_num: int, topic_name: str, difficulty: str = "intermediate") -> Dict:
        """Generate content for regular levels (1-4, 6-9, 11-14, 16-19)"""
        
        prompt = f"""You are an expert educational content creator for Data Structures & Algorithms. Generate comprehensive learning content for:

**Level {level_num}: {topic_name}** (Difficulty: {difficulty})

Generate a JSON response with the following structure:

{{
    "description": "Brief 1-sentence description of this topic",
    "icon": "Single emoji that represents this topic",
    "concepts": [
        {{
            "title": "Main concept name",
            "content": "Detailed explanation (2-3 sentences) with technical accuracy",
            "example": "Code example or pseudocode demonstrating the concept"
        }},
        {{
            "title": "Second concept name",
            "content": "Detailed explanation (2-3 sentences)",
            "example": "Code example"
        }}
    ],
    "quiz": {{
        "questions": [
            {{
                "question": "Technical question about the concept",
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "correct": 0
            }}
        ]
    }},
    "coding": {{
        "title": "Coding challenge title",
        "description": "What the student needs to implement",
        "starterCode": "// Starter code template with comments\\nfunction solution() {{\\n  // Your code here\\n}}"
    }}
}}

Requirements:
1. **Concepts**: Provide 2 key concepts with clear explanations and code examples
2. **Quiz**: Generate 5 challenging multiple-choice questions with correct answer index (0-3)
3. **Coding**: Create a practical coding challenge with starter code template

Return ONLY valid JSON, no markdown formatting or extra text."""

        print(f"🤖 Generating content for Level {level_num}: {topic_name}...")
        response = self.call_gemini_api(prompt)
        
        if not response:
            return self.get_fallback_regular_level(level_num, topic_name)
        
        content = self.parse_json_response(response)
        if not content:
            return self.get_fallback_regular_level(level_num, topic_name)
        
        # Ensure quiz contains desired number of unique questions
        quiz_obj = content.get("quiz", {"questions": []})
        quiz_obj = self.ensure_quiz_questions(quiz_obj, desired_count=5, topic_name=topic_name, level_num=level_num)

        level = {
            "id": level_num,
            "title": topic_name,
            "description": content.get("description", f"Learn {topic_name}"),
            "icon": content.get("icon", "📚"),
            "xp": 100,
            "videoUrl": "",  # Empty - user will add manually
            "concepts": content.get("concepts", []),
            "quiz": quiz_obj,
            "coding": content.get("coding", {
                "title": f"{topic_name} Challenge",
                "description": "Implement the solution",
                "starterCode": "// Your code here"
            })
        }
        
        print(f"✅ Level {level_num} generated successfully!")
        return level
    
    def generate_milestone_level(self, level_num: int, prev_topics: List[str]) -> Dict:
        """Generate content for milestone levels (5, 10, 15, 20) - Review + Game"""
        
        topics_covered = ", ".join(prev_topics)
        
        prompt = f"""You are an expert educational content creator for Data Structures & Algorithms. Generate a MILESTONE REVIEW level:

**Level {level_num}: Milestone Challenge**

This level reviews concepts from previous levels: {topics_covered}

Generate a JSON response with the following structure:

{{
    "title": "Creative title for this milestone challenge (e.g., 'Stack & Queue Mastery Challenge')",
    "description": "Brief description emphasizing this is a review and challenge level",
    "icon": "🎮",
    "reviewConcepts": [
        {{
            "title": "Key concept from previous levels",
            "content": "Brief review summary (1-2 sentences)",
            "example": "Quick code example"
        }},
        {{
            "title": "Another key concept",
            "content": "Brief review summary",
            "example": "Quick code example"
        }}
    ],
    "gameManual": "🎮 Game: Detailed description of an interactive game/simulation that tests understanding of the previous concepts. Be creative and specific about game mechanics.",
    "coding": {{
        "title": "Advanced coding challenge title",
        "description": "Complex problem that combines multiple concepts from previous levels",
        "starterCode": "// Starter code template\\nfunction solution() {{\\n  // Your code here\\n}}"
    }}
}}

Requirements:
1. **Title**: Creative, engaging title for the milestone
2. **Review Concepts**: 2-3 key concepts from previous levels
3. **Game Manual**: Detailed, creative game description that tests previous concepts
4. **Coding**: Advanced challenge combining multiple concepts

Return ONLY valid JSON, no markdown formatting or extra text."""

        print(f"🎮 Generating MILESTONE Level {level_num}...")
        response = self.call_gemini_api(prompt)
        
        if not response:
            return self.get_fallback_milestone_level(level_num, prev_topics)
        
        content = self.parse_json_response(response)
        if not content:
            return self.get_fallback_milestone_level(level_num, prev_topics)
        
        level = {
            "id": level_num,
            "title": content.get("title", f"Level {level_num} Challenge"),
            "description": content.get("description", "Review and master previous concepts"),
            "icon": content.get("icon", "🎮"),
            "xp": 200,
            "videoUrl": "",  # Empty for milestone levels
            "concepts": content.get("reviewConcepts", []),
            "game": f"dsa-level-{level_num}-game",
            "gameManual": content.get("gameManual", f"🎮 Challenge game for level {level_num}"),
            "coding": content.get("coding", {
                "title": f"Level {level_num} Challenge",
                "description": "Advanced challenge",
                "starterCode": "// Your code here"
            })
        }
        
        print(f"✅ Milestone Level {level_num} generated successfully!")
        return level
    
    def get_fallback_regular_level(self, level_num: int, topic_name: str) -> Dict:
        """Fallback content for regular levels"""
        fb = {
            "id": level_num,
            "title": topic_name,
            "description": f"Learn {topic_name}",
            "icon": "📚",
            "xp": 100,
            "videoUrl": "",
            "concepts": [{
                "title": topic_name,
                "content": f"Core concepts of {topic_name}",
                "example": "// Example code"
            }],
            "quiz": {
                "questions": [{
                    "question": f"What is {topic_name}?",
                    "options": ["Option A", "Option B", "Option C", "Option D"],
                    "correct": 0
                }]
            },
            "coding": {
                "title": f"{topic_name} Challenge",
                "description": "Implement the solution",
                "starterCode": "// Your code here"
            }
        }

        # Normalize/fill to desired quiz size
        fb["quiz"] = self.ensure_quiz_questions(fb.get("quiz", {}), desired_count=5, topic_name=topic_name, level_num=level_num)
        return fb
    
    def get_fallback_milestone_level(self, level_num: int, prev_topics: List[str]) -> Dict:
        """Fallback content for milestone levels"""
        return {
            "id": level_num,
            "title": f"Level {level_num} Challenge",
            "description": "Review and master previous concepts",
            "icon": "🎮",
            "xp": 200,
            "videoUrl": "",
            "concepts": [{
                "title": "Review",
                "content": f"Review of: {', '.join(prev_topics)}",
                "example": "// Review concepts"
            }],
            "game": f"dsa-level-{level_num}-game",
            "gameManual": f"🎮 Challenge game for level {level_num}",
            "coding": {
                "title": f"Level {level_num} Challenge",
                "description": "Advanced challenge",
                "starterCode": "// Your code here"
            }
        }

# DSA Topics for 20 levels
DSA_TOPICS = [
    {"id": 1, "title": "Introduction to DSA", "difficulty": "beginner"},
    {"id": 2, "title": "Arrays", "difficulty": "beginner"},
    {"id": 3, "title": "Linked Lists", "difficulty": "beginner"},
    {"id": 4, "title": "Stacks & Queues", "difficulty": "beginner"},
    # Level 5 is milestone
    {"id": 6, "title": "Trees", "difficulty": "intermediate"},
    {"id": 7, "title": "Tree Traversals", "difficulty": "intermediate"},
    {"id": 8, "title": "Binary Search Trees", "difficulty": "intermediate"},
    {"id": 9, "title": "AVL Trees", "difficulty": "advanced"},
    # Level 10 is milestone
    {"id": 11, "title": "Graphs", "difficulty": "intermediate"},
    {"id": 12, "title": "BFS & DFS", "difficulty": "intermediate"},
    {"id": 13, "title": "Dijkstra's Algorithm", "difficulty": "advanced"},
    {"id": 14, "title": "Minimum Spanning Tree", "difficulty": "advanced"},
    # Level 15 is milestone
    {"id": 16, "title": "Hashing", "difficulty": "intermediate"},
    {"id": 17, "title": "Heaps", "difficulty": "intermediate"},
    {"id": 18, "title": "Dynamic Programming", "difficulty": "advanced"},
    {"id": 19, "title": "Greedy Algorithms", "difficulty": "advanced"},
    # Level 20 is milestone
]

def main():
    """Main function to generate DSA course"""
    generator = AICourseGenerator()
    
    print("\n" + "="*60)
    print("🎓 AI-POWERED DSA COURSE GENERATOR (UPDATED)")
    print("="*60)
    print("\n📚 Generating Data Structures & Algorithms Course...")
    print("="*60 + "\n")
    
    levels = []
    prev_topics = []
    
    for i in range(1, 21):
        if i % 5 == 0:
            # Milestone level
            level = generator.generate_milestone_level(i, prev_topics[-4:] if len(prev_topics) >= 4 else prev_topics)
            levels.append(level)
            prev_topics = []  # Reset for next section
        else:
            # Regular level
            topic_info = next((t for t in DSA_TOPICS if t["id"] == i), None)
            if topic_info:
                level = generator.generate_regular_level(
                    i,
                    topic_info["title"],
                    topic_info["difficulty"]
                )
                levels.append(level)
                prev_topics.append(topic_info["title"])
        
        # Add delay to avoid rate limiting
        if i < 20:
            print(f"⏳ Waiting 2 seconds before next request...\n")
            time.sleep(2)
    
    # Create course structure
    courses_data = {
        "courses": {
            "dsa": {
                "name": "Data Structures & Algorithms",
                "icon": "🧮",
                "levels": levels
            }
        }
    }
    
    # Save to file
    output_file = "data/courses-config-dsa-updated.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(courses_data, f, indent=2, ensure_ascii=False)
    
    print("\n" + "="*60)
    print(f"✅ DSA Course saved to {output_file}")
    print("="*60)
    print(f"\n📊 Summary:")
    print(f"   - Total Levels: {len(levels)}")
    print(f"   - Regular Levels: {len([l for l in levels if l['id'] % 5 != 0])}")
    print(f"   - Milestone Levels: {len([l for l in levels if l['id'] % 5 == 0])}")
    print(f"   - Video URLs: Empty (add manually)")
    print("\n🎉 Course generation complete!\n")

if __name__ == "__main__":
    main()
