# 🤖 AI-Powered Course Generator

## Overview

The AI Course Generator uses Google's Gemini API to automatically generate comprehensive course content including:

- 📹 **YouTube Video Recommendations** - Real, curated educational videos
- 📖 **Concept Explanations** - Detailed technical content with code examples
- ❓ **Quiz Questions** - 5 challenging multiple-choice questions per level
- 💻 **Coding Challenges** - Practical exercises with starter code
- 🎮 **Game Simulations** - Interactive Phaser.js games for milestone levels

---

## 🚀 Quick Start

### Prerequisites

1. **Python 3.7+** installed
2. **requests** library: `pip install requests`
3. **Gemini API Key** (already configured): `AIzaSyBe8CbokZF-iST6PYzAUEQKG-EKqmEOFMM`

### Generate Courses

Run the AI course generator:

```bash
python generate-courses-ai.py
```

This will:
1. Generate 20 levels for DSA course
2. Generate 20 levels for OS course
3. Create `data/courses-config.json` with all content
4. Take approximately 2-3 minutes (with API rate limiting delays)

---

## 📁 File Structure

```
CodeVerse/
├── generate-courses-ai.py          # Main Python script
├── js/
│   ├── ai-course-generator.js      # Browser-based generator
│   └── game-template-generator.js  # Game code generator
├── data/
│   └── courses-config.json         # Generated course data
└── games/
    ├── dsa/                        # DSA game files
    └── os/                         # OS game files
```

---

## 🎯 Course Structure

### Regular Levels (1-4, 6-9, 11-14, 16-19)

Each regular level includes:

```json
{
  "id": 1,
  "title": "Topic Name",
  "description": "Brief description",
  "icon": "📚",
  "xp": 100,
  "videoUrl": "https://www.youtube.com/watch?v=...",
  "concepts": [
    {
      "title": "Concept Name",
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
    ]
  }
}
```

### Milestone Levels (5, 10, 15, 20)

Milestone levels include:

```json
{
  "id": 5,
  "title": "Challenge Name",
  "description": "Challenge description",
  "icon": "🎮",
  "xp": 200,
  "videoUrl": "https://www.youtube.com/watch?v=...",
  "concepts": [...],
  "game": "dsa-stack-queue-game",
  "gameManual": "🎮 Game description",
  "coding": {
    "title": "Coding Challenge",
    "description": "What to implement",
    "starterCode": "// Starter code"
  }
}
```

---

## 🎮 Game Generation

### Automatic Game Templates

The system generates Phaser.js game templates for milestone levels:

1. **Stack/Queue Games** - Interactive data structure visualization
2. **Tree Games** - Binary tree operations
3. **Graph Games** - Graph traversal and algorithms
4. **Scheduling Games** - Process scheduling simulation
5. **Memory Games** - Memory allocation challenges
6. **Deadlock Games** - Deadlock detection

### Game Features

Each generated game includes:
- ✅ Interactive gameplay
- ✅ Score tracking
- ✅ Timer (60 seconds)
- ✅ Visual feedback
- ✅ Performance evaluation
- ✅ Restart/Continue options

---

## 🔧 Customization

### Modify Course Topics

Edit the topic lists in `generate-courses-ai.py`:

```python
DSA_TOPICS = [
    {"title": "Your Topic", "difficulty": "intermediate"},
    # Add more topics...
]
```

### Adjust API Parameters

Modify Gemini API settings:

```python
"generationConfig": {
    "temperature": 0.7,      # Creativity (0.0-1.0)
    "topK": 40,              # Token selection
    "topP": 0.95,            # Nucleus sampling
    "maxOutputTokens": 2048  # Response length
}
```

### Change Rate Limiting

Adjust delay between API calls:

```python
time.sleep(2)  # Wait 2 seconds between requests
```

---

## 📊 API Usage

### Gemini API Limits

- **Free Tier**: 60 requests per minute
- **Rate Limiting**: 2-second delay between requests
- **Token Limit**: 2048 tokens per response

### Cost Estimation

- **DSA Course**: 20 API calls
- **OS Course**: 20 API calls
- **Total**: 40 API calls (~2-3 minutes)
- **Cost**: Free tier (no charges)

---

## 🎨 Generated Content Quality

### Video URLs

The AI searches for and recommends:
- ✅ Popular educational channels (freeCodeCamp, Traversy Media, etc.)
- ✅ Real, working YouTube URLs
- ✅ Topic-relevant content
- ✅ High-quality tutorials

### Concept Explanations

Each concept includes:
- ✅ Clear, technical explanations
- ✅ Code examples
- ✅ Real-world applications
- ✅ Best practices

### Quiz Questions

Questions are:
- ✅ Technically accurate
- ✅ Challenging but fair
- ✅ Multiple-choice format
- ✅ Properly indexed answers

### Coding Challenges

Challenges include:
- ✅ Clear objectives
- ✅ Starter code templates
- ✅ Helpful comments
- ✅ Practical applications

---

## 🐛 Troubleshooting

### API Errors

**Problem**: `API Error: 429 Too Many Requests`
**Solution**: Increase delay between requests:
```python
time.sleep(3)  # Increase from 2 to 3 seconds
```

**Problem**: `JSON Parse Error`
**Solution**: The AI response wasn't valid JSON. The system will use fallback content automatically.

**Problem**: `Invalid API Key`
**Solution**: Verify the API key in the script:
```python
GEMINI_API_KEY = "AIzaSyBe8CbokZF-iST6PYzAUEQKG-EKqmEOFMM"
```

### Generation Issues

**Problem**: Videos not loading
**Solution**: The AI might have provided invalid URLs. Manually verify and update in `courses-config.json`.

**Problem**: Quiz questions too easy/hard
**Solution**: Adjust the difficulty in the prompt or regenerate specific levels.

**Problem**: Game code not working
**Solution**: Use the game template generator to create working templates.

---

## 🔄 Regenerating Content

### Regenerate Entire Course

```bash
python generate-courses-ai.py
```

### Regenerate Single Level

Modify the script to generate only specific levels:

```python
# Generate only level 5
level = generator.generate_level_content("DSA", 5, "Stack & Queue Challenge")
```

### Update Existing Content

1. Load existing `courses-config.json`
2. Modify specific levels
3. Save back to file

---

## 📈 Future Enhancements

### Planned Features

- [ ] **Multi-language Support** - Generate content in multiple languages
- [ ] **Difficulty Adaptation** - Adjust content based on user performance
- [ ] **Custom Game Logic** - AI-generated game mechanics
- [ ] **Video Transcription** - Extract key points from videos
- [ ] **Interactive Tutorials** - Step-by-step guided learning
- [ ] **Assessment Analytics** - Track learning patterns

### Potential Improvements

- [ ] **Batch Processing** - Generate multiple courses simultaneously
- [ ] **Content Validation** - Verify video URLs and code examples
- [ ] **Version Control** - Track content changes over time
- [ ] **A/B Testing** - Compare different content versions
- [ ] **User Feedback** - Incorporate learner suggestions

---

## 📝 Best Practices

### Content Generation

1. **Review Generated Content** - Always verify AI-generated content for accuracy
2. **Test Video URLs** - Ensure all YouTube links work
3. **Validate Code Examples** - Run code snippets to verify correctness
4. **Check Quiz Answers** - Confirm correct answer indices
5. **Test Games** - Play through generated games

### API Usage

1. **Monitor Rate Limits** - Stay within free tier limits
2. **Handle Errors Gracefully** - Use fallback content when needed
3. **Log API Calls** - Track usage for debugging
4. **Cache Responses** - Save generated content to avoid regeneration
5. **Optimize Prompts** - Refine prompts for better results

### Maintenance

1. **Regular Updates** - Regenerate content periodically
2. **User Feedback** - Incorporate learner suggestions
3. **Content Refresh** - Update outdated information
4. **Performance Monitoring** - Track generation success rates
5. **Backup Data** - Keep copies of generated content

---

## 🤝 Contributing

### Adding New Subjects

1. Define topic list in `generate-courses-ai.py`
2. Add subject to course generation
3. Create game templates for the subject
4. Test generated content

### Improving Prompts

1. Edit prompt templates in `AICourseGenerator` class
2. Test with sample topics
3. Validate output quality
4. Update documentation

### Enhancing Games

1. Add new game templates in `game-template-generator.js`
2. Create subject-specific logic
3. Test gameplay mechanics
4. Document game features

---

## 📞 Support

For issues or questions:

1. Check troubleshooting section
2. Review generated content logs
3. Verify API key and limits
4. Test with fallback content

---

## 📄 License

Personal Educational Project - 2024

---

**Built with ❤️ using Google Gemini AI**

*Transforming CS Education with AI-Powered Content Generation* 🚀
