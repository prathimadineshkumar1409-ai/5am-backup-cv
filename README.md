# 🎮 CodeVerse: The Logic Forge

An interactive, gamified learning platform for mastering Computer Science fundamentals through Phaser.js games, AI-powered personalization, and real-time multiplayer challenges.

---

## 🌟 Features

### ✅ **Implemented Features**

1. **🔐 Authentication System**
   - Firebase Authentication (Email/Password)
   - User profiles with avatars
   - Secure data storage

2. **🎮 Interactive Games (Phaser.js)**
   - **Operating Systems:**
     - Process Scheduler (FCFS, SJF, Round Robin)
     - Memory Manager (First Fit, Best Fit, Worst Fit)
     - Deadlock Detection (Resource Allocation Graph)
   - Real-time scoring and feedback
   - Visual animations and interactive gameplay

3. **📜 Certificate Management**
   - Upload certificates from any platform
   - AI-powered extraction (Gemini Vision API)
   - Automatic parsing of course name, date, platform
   - Secure storage in Firebase

4. **🌐 External Course Integration**
   - Udemy course recommendations (via Gemini API)
   - Coursera course suggestions
   - Professional certification tracking
   - Topic-specific resource discovery

5. **👥 Multiplayer Mode**
   - Peer-to-peer WebRTC connection
   - No backend server required
   - Real-time game synchronization
   - Room-based matchmaking

6. **📹 Video Tutorials**
   - YouTube integration
   - Difficulty-based content (Basic to Advanced)
   - Embedded video players

7. **📊 Progress Tracking**
   - Score accumulation
   - Concept completion tracking
   - Achievement system
   - User dashboard

---

## 📁 Project Structure

```
CodeVerse/
├── index.html              # Original prototype
├── index-new.html          # New integrated version ⭐
├── README.md              # This file
├── TODO.md                # Implementation checklist
│
├── data/
│   └── topics-config.json # All topics and subtopics configuration
│
├── js/
│   ├── phaser-config.js          # Phaser game manager
│   ├── certificate-manager.js    # Certificate handling
│   └── multiplayer-manager.js    # WebRTC multiplayer
│
├── games/
│   ├── os/
│   │   ├── process-scheduler.js  # CPU scheduling game
│   │   ├── memory-manager.js     # Memory allocation game
│   │   └── deadlock-game.js      # Deadlock detection game
│   ├── networks/          # (To be implemented)
│   ├── cybersec/          # (To be implemented)
│   ├── dsa/               # (To be implemented)
│   └── interview/         # (To be implemented)
│
├── assets/                # Images, sounds (to be added)
├── css/                   # Additional styles (optional)
└── planning/              # Original Godot planning files
```

---

## 🚀 Quick Start Guide

### **Step 1: Create Folder Structure**

Open CMD in `C:\Users\Dell\Desktop\CodeVerse` and run:

```cmd
mkdir games\os games\networks games\cybersec games\dsa games\interview
mkdir assets\images assets\sounds
mkdir css js data
```

### **Step 2: Replace index.html**

1. Backup your current `index.html`:
   ```cmd
   copy index.html index-old-backup.html
   ```

2. Replace with the new version:
   ```cmd
   copy index-new.html index.html
   ```

### **Step 3: Test Locally**

1. Open `index.html` in your browser
2. Create an account (Sign Up)
3. Set up your profile
4. Explore the dashboard
5. Try an Operating Systems game!

---

## 🎯 How to Use Each Feature

### **1. Playing Games**

1. From Dashboard → Click a topic (e.g., "Operating Systems")
2. Select a subtopic (e.g., "Process Scheduling")
3. Click "Play Game" tab
4. Complete the challenge
5. View your score and metrics

### **2. Uploading Certificates**

1. Navigate to "Certificates" in the navbar
2. Click "Upload Certificate"
3. Select an image/PDF of your certificate
4. AI will automatically extract:
   - Course name
   - Platform
   - Completion date
   - Issuer
5. Certificate appears in your profile

### **3. Finding External Courses**

1. Open any concept (e.g., "Memory Management")
2. Click "Resources" tab
3. Click "Find Relevant Courses"
4. View Udemy, Coursera, and professional certifications
5. Click links to enroll

### **4. Multiplayer Mode**

**Host a Game:**
1. Go to "Multiplayer" in navbar
2. Click "Create Room"
3. Share the room code with a friend
4. Wait for them to join

**Join a Game:**
1. Get room code from friend
2. Go to "Multiplayer"
3. Enter room code
4. Click "Join Room"

---

## 🔧 Configuration

### **Firebase Setup** (Already configured)

Your Firebase config is in `index-new.html`:
```javascript
const firebaseConfig = {
    apiKey: "AIzaSyA92E7a67gbSmNCN5w_f65vMq4NNHbWuAA",
    authDomain: "codeverse-80575.firebaseapp.com",
    projectId: "codeverse-80575",
    // ...
};
```

### **Gemini API** (Already configured)

API key for AI features:
```javascript
const GEMINI_API_KEY = "AIzaSyBe8CbokZF-iST6PYzAUEQKG-EKqmEOFMM";
```

---

## 📚 Topics Covered

### **1. Operating Systems** ✅
- Process Scheduling (FCFS, SJF, RR)
- Memory Management (Paging, Segmentation)
- Deadlock Detection & Prevention
- File Systems (Coming Soon)

### **2. Computer Networks** 🔄
- TCP/IP Protocol Simulation
- DNS Resolution Game
- Network Routing Algorithms
- Subnetting Challenges

### **3. Cyber Security** 🔄
- Encryption/Decryption Games
- SQL Injection Prevention
- Password Security
- Network Security

### **4. Data Structures & Algorithms** 🔄
- Stack (LIFO) Operations
- Queue (FIFO) Operations
- Binary Tree Traversal
- Graph Algorithms

### **5. Interview Preparation** 🔄
- Coding Challenges
- System Design
- Behavioral Questions
- Mock Interviews

### **6. Resume Builder** 🔄
- Professional Templates
- GitHub Integration
- Project Showcase
- LinkedIn Optimization

---

## 🎨 Customization

### **Adding New Games**

1. Create game file in appropriate folder:
   ```javascript
   // games/os/new-game.js
   class NewGame extends BaseGameScene {
       constructor() {
           super('NewGame');
       }
       
       create() {
           super.create();
           // Your game logic
       }
   }
   window.NewGame = NewGame;
   ```

2. Add to `data/topics-config.json`:
   ```json
   {
       "id": "new-game",
       "name": "New Game",
       "difficulty": "beginner",
       "description": "Description here",
       "gameFile": "games/os/new-game.js",
       "videoBasic": "YouTube URL"
   }
   ```

3. Include script in `index.html`:
   ```html
   <script src="games/os/new-game.js"></script>
   ```

### **Changing Colors/Theme**

Edit the CSS in `<style>` section of `index-new.html`:
```css
body { background-color: #1e1e3f; } /* Dark blue background */
.card { background-color: #2c2c54; } /* Card background */
.btn-primary { background-color: #7b3fe8; } /* Purple buttons */
```

---

## 🐛 Troubleshooting

### **Games Not Loading**

1. Check browser console (F12)
2. Ensure all script files are loaded
3. Verify Phaser.js CDN is accessible
4. Check `gameManager` is initialized

### **Certificate Upload Fails**

1. Check file size (< 5MB recommended)
2. Ensure Gemini API key is valid
3. Check browser console for errors
4. Try with a clear certificate image

### **Multiplayer Connection Issues**

1. Ensure both users have stable internet
2. Check if WebRTC is supported (modern browsers)
3. Try creating a new room
4. Check browser console for PeerJS errors

### **Firebase Authentication Errors**

1. Verify Firebase config is correct
2. Check Firebase console for project status
3. Ensure email/password auth is enabled
4. Clear browser cache and try again

---

## 📈 Next Steps

### **Immediate Priorities:**

1. ✅ Test all 3 OS games
2. ✅ Upload a test certificate
3. ✅ Try multiplayer with a friend
4. 🔄 Add Computer Networks games
5. 🔄 Add Cyber Security games
6. 🔄 Implement DSA games

### **Future Enhancements:**

- [ ] Personalized AI advisor (Gemini + Twine)
- [ ] Multilingual support
- [ ] Mobile responsive design
- [ ] Leaderboard system
- [ ] Achievement badges
- [ ] Resume builder integration
- [ ] GitHub portfolio sync

---

## 🤝 Contributing

This is a personal project, but feel free to:
1. Report bugs
2. Suggest features
3. Improve game mechanics
4. Add new topics

---

## 📄 License

Personal Educational Project - 2024

---

## 🎓 Learning Resources

- **Phaser.js Docs:** https://photonstorm.github.io/phaser3-docs/
- **Firebase Docs:** https://firebase.google.com/docs
- **WebRTC Guide:** https://webrtc.org/getting-started/overview
- **Gemini API:** https://ai.google.dev/docs

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review browser console errors
3. Verify all files are in correct locations
4. Test with a fresh browser session

---

**Built with ❤️ for Computer Science Education**

*CodeVerse - Where Learning Meets Gaming* 🎮✨
#   C o d e v e r s e  
 #   C o d e v e r s e  
 