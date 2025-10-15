# 🎓 DSA Course Generation Guide

## Overview

This guide explains the updated AI-powered course generation system for the DSA (Data Structures & Algorithms) course with your custom requirements.

---

## 🎯 Your Requirements

### 1. **Video URLs**
- ✅ All video URLs are **empty strings ("")**
- ✅ You will manually add YouTube URLs later

### 2. **Milestone Levels (5, 10, 15, 20)**
- ✅ **NO video** (empty string)
- ✅ **NO new concepts** (only review of previous 4 levels)
- ✅ **Game simulation** based on previous concepts
- ✅ **Coding challenge** combining previous concepts
- ✅ **Updated titles** to reflect challenge nature

### 3. **Regular Levels (1-4, 6-9, 11-14, 16-19)**
- ✅ **Empty video URL** (you add manually)
- ✅ **2 Concepts** with explanations and code examples
- ✅ **5 Quiz questions** (multiple choice)
- ✅ **1 Coding challenge** with starter code

### 4. **Content Generation**
- ✅ Uses **Gemini API** to generate:
  - Titles
  - Concept explanations
  - Quiz questions
  - Coding exercises
  - Game descriptions

---

## 📁 Generated File Structure

### Regular Level Example (Level 1-4, 6-9, 11-14, 16-19):

```json
{
  "id": 1,
  "title": "Introduction to DSA",
  "description": "Brief description",
  "icon": "📚",
  "xp": 100,
  "videoUrl": "",  // ← EMPTY - You add manually
  "concepts": [
    {
      "title": "Concept 1",
      "content": "Detailed explanation",
      "example": "code example"
    },
    {
      "title": "Concept 2",
      "content": "Detailed explanation",
      "example": "code example"
    }
  ],
  "quiz": {
    "questions": [
      {
        "question": "Question text?",
        "options": ["A", "B", "C", "D"],
        "correct": 0
      }
      // ... 4 more questions
    ]
  },
  "coding": {
    "title": "Challenge title",
    "description": "What to implement",
    "starterCode": "// Starter code"
  }
}
```

### Milestone Level Example (Level 5, 10, 15, 20):

```json
{
  "id": 5,
  "title": "Stack & Queue Mastery Challenge",  // ← Creative title
  "description": "Review and master previous concepts",
  "icon": "🎮",
  "xp": 200,
  "videoUrl": "",  // ← EMPTY for milestones
  "concepts": [
    {
      "title": "Review: Arrays",
      "content": "Brief review summary",
      "example": "quick example"
    },
    {
      "title": "Review: Linked Lists",
      "content": "Brief review summary",
      "example": "quick example"
    }
  ],
  "game": "dsa-level-5-game",
  "gameManual": "🎮 Game: Interactive simulation testing previous concepts",
  "coding": {
    "title": "Advanced Challenge",
    "description": "Combines multiple previous concepts",
    "starterCode": "// Starter code"
  }
}
```

---

## 🚀 How to Use

### Step 1: Run the Generator

```bash
python generate-dsa-courses-updated.py
```

**Output**: `data/courses-config-dsa-updated.json`

**Time**: ~2-3 minutes (40 API calls with 2-second delays)

### Step 2: Review Generated Content

Open `data/courses-config-dsa-updated.json` and review:
- ✅ Concept explanations
- ✅ Quiz questions
- ✅ Coding challenges
- ✅ Game descriptions

### Step 3: Add Video URLs

Manually add YouTube URLs to each level:

```json
{
  "id": 1,
  "videoUrl": "https://www.youtube.com/watch?v=YOUR_VIDEO_ID",
  // ... rest of content
}
```

**For Milestone Levels**: Leave `videoUrl` as empty string `""`

### Step 4: Replace Original File

Once satisfied, replace the original:

```bash
# Backup original
cp data/courses-config.json data/courses-config-backup.json

# Copy DSA section from updated file
# Manually merge or replace the "dsa" section
```

---

## 📊 Course Structure

### 20 Levels Total:

**Levels 1-4: Fundamentals**
1. Introduction to DSA
2. Arrays
3. Linked Lists
4. Stacks & Queues

**Level 5: 🎮 MILESTONE** - Review Levels 1-4 + Game

**Levels 6-9: Trees**
6. Trees
7. Tree Traversals
8. Binary Search Trees
9. AVL Trees

**Level 10: 🎮 MILESTONE** - Review Levels 6-9 + Game

**Levels 11-14: Graphs**
11. Graphs
12. BFS & DFS
13. Dijkstra's Algorithm
14. Minimum Spanning Tree

**Level 15: 🎮 MILESTONE** - Review Levels 11-14 + Game

**Levels 16-19: Advanced**
16. Hashing
17. Heaps
18. Dynamic Programming
19. Greedy Algorithms

**Level 20: 🎮 MILESTONE** - Final Mastery Challenge

---

## 🎮 Game Simulations

Milestone levels include game descriptions that test previous concepts:

### Level 5 Game Example:
"Interactive stack and queue visualization where players must efficiently manage data structures to solve problems"

### Level 10 Game Example:
"Binary tree navigation game where players traverse trees using different algorithms"

### Level 15 Game Example:
"Graph pathfinding challenge where players implement BFS/DFS to find optimal routes"

### Level 20 Game Example:
"Comprehensive DSA challenge combining all concepts learned"

---

## 🔧 Customization

### Modify Topics

Edit `DSA_TOPICS` in `generate-dsa-courses-updated.py`:

```python
DSA_TOPICS = [
    {"id": 1, "title": "Your Topic", "difficulty": "beginner"},
    # ... more topics
]
```

### Adjust Difficulty

Change difficulty levels:
- `"beginner"` - Basic concepts
- `"intermediate"` - Standard topics
- `"advanced"` - Complex algorithms
- `"expert"` - Advanced challenges

### Modify API Parameters

```python
"generationConfig": {
    "temperature": 0.7,      # Creativity (0.0-1.0)
    "topK": 40,
    "topP": 0.95,
    "maxOutputTokens": 2048
}
```

---

## ✅ Quality Checklist

After generation, verify:

- [ ] All 20 levels generated
- [ ] Video URLs are empty strings
- [ ] Milestone levels (5, 10, 15, 20) have:
  - [ ] Review concepts (not new concepts)
  - [ ] Game descriptions
  - [ ] Advanced coding challenges
  - [ ] Creative titles
- [ ] Regular levels have:
  - [ ] 2 concepts with examples
  - [ ] 5 quiz questions
  - [ ] 1 coding challenge
- [ ] All JSON is valid
- [ ] No API errors in generation

---

## 📝 Adding Video URLs

### Recommended YouTube Channels:

1. **freeCodeCamp** - Comprehensive tutorials
2. **Abdul Bari** - Algorithm explanations
3. **CS Dojo** - Beginner-friendly
4. **Traversy Media** - Practical coding
5. **Programming with Mosh** - Clear explanations
6. **mycodeschool** - DSA fundamentals

### URL Format:

```
https://www.youtube.com/watch?v=VIDEO_ID
```

### Tips:

- Choose videos 10-30 minutes long
- Prefer recent videos (last 2-3 years)
- Check video quality and audio
- Verify content matches the topic
- Test URLs before adding

---

## 🐛 Troubleshooting

### Issue: API Rate Limit

**Solution**: Increase delay in script:
```python
time.sleep(3)  # Change from 2 to 3 seconds
```

### Issue: JSON Parse Error

**Solution**: Check console output for the problematic level. The system will use fallback content automatically.

### Issue: Poor Quality Content

**Solution**: Regenerate specific levels by modifying the script to only generate those levels.

### Issue: Missing Concepts

**Solution**: Manually add concepts to the JSON file or regenerate with adjusted prompts.

---

## 📈 Next Steps

1. ✅ **Generate Course** - Run the script
2. ✅ **Review Content** - Check all generated content
3. ✅ **Add Videos** - Manually add YouTube URLs
4. ✅ **Test Quiz** - Verify quiz questions are accurate
5. ✅ **Test Coding** - Ensure coding challenges work
6. ✅ **Create Games** - Implement game simulations
7. ✅ **Deploy** - Integrate into platform

---

## 🎉 Summary

Your updated DSA course will have:

- **20 Levels** of AI-generated content
- **Empty video URLs** for manual addition
- **4 Milestone levels** with review + games
- **16 Regular levels** with concepts, quizzes, and coding
- **80 Quiz questions** (5 per regular level)
- **20 Coding challenges** (1 per level)
- **4 Game simulations** (milestone levels)

**Total Generation Time**: ~2-3 minutes
**API Calls**: 20 (within free tier)
**Manual Work**: Add 16 video URLs (milestones don't need videos)

---

**Status**: ✅ Script running, generating your custom DSA course!

*Built with ❤️ using Google Gemini AI*
