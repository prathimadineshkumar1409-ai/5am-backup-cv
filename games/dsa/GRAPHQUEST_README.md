# GraphQuest: The Network Nexus - Game Guide

## 🎮 Complete Walkthrough

---

## Level 1: The Broken Network (Graph Basics)

**Objective**: Connect 5 pairs of nodes to restore the network

**How to Play**:
1. Click on any node (it will turn gold)
2. Click on another node to connect them with an edge
3. Repeat until you've made 5 connections
4. Any 5 connections will work - there's no wrong answer!
5. Click "NEXT LEVEL" when it appears

**Concept**: Learn that graphs are made of nodes (vertices) and edges (connections)

---

## Level 2: Path of Exploration (BFS - Breadth-First Search)

**Objective**: Click nodes in the correct BFS order starting from node A

**How to Play**:
1. The graph structure is:
   ```
       A
      / \
     B   C
     |   |
     D   E
   ```
2. **Correct BFS Order**: A → B → C → D → E
3. **Strategy**: Visit all neighbors of A first (B and C), then visit their neighbors (D and E)
4. Click nodes in this exact order
5. If wrong, the game will show your order vs correct order and restart
6. When correct, click the pulsing "NEXT LEVEL" button

**Concept**: BFS explores level by level (breadth-first)

---

## Level 3: The Depth Realm (DFS - Depth-First Search)

**Objective**: Click nodes in the correct DFS order starting from node A

**How to Play**:
1. Same graph structure as Level 2
2. **Correct DFS Order**: A → B → D → C → E
3. **Strategy**: Go as deep as possible before backtracking
   - Start at A
   - Go to B (first neighbor)
   - Go to D (B's only child)
   - Backtrack to A
   - Go to C (second neighbor)
   - Go to E (C's only child)
4. Nodes will change color based on depth
5. Small "d:X" labels show the depth number

**Concept**: DFS explores depth-first (goes deep before wide)

---

## Level 4: The Path of Light (Dijkstra's Algorithm) ⭐

**Objective**: Find the shortest path from node A (green) to node D (red)

**Graph Structure**:
```
A ---1--- B ---3--- D
|                   |
4                   2
|                   |
C ------------------+
```

**Edge Weights**:
- A to B: weight 1
- A to C: weight 4
- B to D: weight 3
- C to D: weight 2

**How to Play**:
1. **Click on edges** (the lines between nodes) to select them
2. Selected edges turn gold and their weight is added to "Path Cost"
3. You need to find the path from A to D with the **minimum total cost**

**Solution**:
- **Correct Path**: A → B → D
- **Edges to Click**: 
  1. Click the edge between A and B (cost: 1)
  2. Click the edge between B and D (cost: 3)
- **Total Cost**: 4 (this is optimal!)

**Wrong Paths** (don't do these):
- A → C → D = 4 + 2 = 6 (too expensive!)
- A → B → C → D = not a valid path

**Steps**:
1. Click the line connecting A to B (it will turn gold, cost shows 1)
2. Click the line connecting B to D (it will turn gold, cost shows 4)
3. Click the "CHECK PATH" button
4. If correct (cost = 4), you'll see "✓ Shortest Path Found!"
5. Click "FINAL LEVEL" to proceed

**Tip**: The edges are clickable lines. Hover over them to see them get thicker, then click to select.

**Concept**: Dijkstra's algorithm finds the shortest path in weighted graphs

---

## Level 5: The Network Core (Minimum Spanning Tree)

**Objective**: Select edges to form an MST that connects all nodes with minimum total cost

**Graph Structure**:
```
A ---1--- B
|    \    |
4     7   2
|      \  |
C ---5--- D ---3--- E
```

**How to Play**:
1. Click on edges to select/deselect them (they toggle gold when selected)
2. You need exactly 3 edges to connect all 4 nodes (MST has V-1 edges)
3. Find the combination with the **minimum total cost**

**Solution**:
- **Correct MST Edges**:
  1. A-B (weight 1)
  2. B-D (weight 2)
  3. D-E (weight 3)
- **Total Cost**: 6 (optimal!)

**Steps**:
1. Click edge A-B (cost: 1)
2. Click edge B-D (cost: 2)
3. Click edge D-E (cost: 3)
4. Click "CHECK MST" button
5. If correct, enjoy the victory animation! 🎉

**Concept**: MST connects all nodes with minimum total edge weight, no cycles

---

## 🎯 Quick Tips

### For Level 4 (Dijkstra):
- **Goal**: Find cheapest path from green node (A) to red node (D)
- **Method**: Click edges (lines), not nodes
- **Edges are clickable**: Hover to see them get thicker
- **Path must be continuous**: A→B→D (not A→C→D)
- **Optimal cost**: 4

### For Level 5 (MST):
- **Goal**: Connect all 5 nodes with minimum cost
- **Need**: Exactly 4 edges (one less than number of nodes)
- **No cycles**: Don't create loops
- **Edges toggle**: Click again to deselect
- **Optimal cost**: 6

---

## 🐛 Troubleshooting

**"I can't click the edges in Level 4/5"**
- Edges are the **lines between nodes**, not the nodes themselves
- Hover your mouse over the lines - they should get thicker
- Click directly on the line (not the weight number)

**"The button doesn't appear after completing a level"**
- Make sure you followed the correct order/solution
- Wait a moment - buttons appear after a short delay
- Check the console for any error messages

**"I don't know the correct order for BFS/DFS"**
- Level 2 (BFS): A, B, C, D, E (level by level)
- Level 3 (DFS): A, B, D, C, E (depth first)

---

## 📚 Learning Outcomes

After completing all 5 levels, you will understand:
- ✅ Graph structure (nodes and edges)
- ✅ BFS traversal (breadth-first, uses queue)
- ✅ DFS traversal (depth-first, uses stack/recursion)
- ✅ Dijkstra's Algorithm (shortest path in weighted graphs)
- ✅ Minimum Spanning Tree (connecting all nodes with minimum cost)

---

**Game Duration**: 5-7 minutes  
**Technology**: Phaser.js 3.70.0  
**Difficulty**: Beginner to Intermediate

Enjoy mastering Graph Algorithms! 🌐✨
