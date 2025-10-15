import json
import os
import time
import requests

# Gemini API configuration
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY', '')
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"

def call_gemini_api(prompt):
    """Call Gemini API to generate content"""
    if not GEMINI_API_KEY:
        print("⚠️  GEMINI_API_KEY not set. Using fallback content.")
        return None
    
    headers = {"Content-Type": "application/json"}
    data = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.7,
            "topK": 40,
            "topP": 0.95,
            "maxOutputTokens": 2048
        }
    }
    
    try:
        response = requests.post(
            f"{GEMINI_API_URL}?key={GEMINI_API_KEY}",
            headers=headers,
            json=data,
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            return result['candidates'][0]['content']['parts'][0]['text']
        else:
            print(f"❌ API Error: {response.status_code}")
            return None
    except Exception as e:
        print(f"❌ Exception: {e}")
        return None

# Fallback content for each level
FALLBACK_CONTENT = {
    11: {
        "concepts": [
            {
                "title": "Graph Fundamentals",
                "content": "A graph is a non-linear data structure consisting of vertices (nodes) and edges (connections). Graphs can be directed (edges have direction) or undirected (edges are bidirectional). They can be weighted (edges have values) or unweighted. Key terminology: adjacent vertices (connected by edge), degree (number of edges connected to vertex), path (sequence of vertices), cycle (path that starts and ends at same vertex). Graphs model real-world networks like social networks, maps, computer networks, and dependencies.",
                "example": "// Graph using Adjacency List\nclass Graph {\n  constructor() {\n    this.adjacencyList = new Map();\n  }\n  \n  addVertex(vertex) {\n    if (!this.adjacencyList.has(vertex)) {\n      this.adjacencyList.set(vertex, []);\n    }\n  }\n  \n  addEdge(v1, v2) {\n    this.adjacencyList.get(v1).push(v2);\n    this.adjacencyList.get(v2).push(v1); // For undirected\n  }\n}\n\nconst graph = new Graph();\ngraph.addVertex('A');\ngraph.addVertex('B');\ngraph.addEdge('A', 'B');"
            },
            {
                "title": "Graph Representations",
                "content": "Two main ways to represent graphs: 1) Adjacency Matrix: 2D array where matrix[i][j] = 1 if edge exists. Space: O(V²), Edge lookup: O(1). Good for dense graphs. 2) Adjacency List: Array/Map of lists where each vertex stores list of adjacent vertices. Space: O(V+E), Edge lookup: O(degree). Good for sparse graphs. Choice depends on graph density and required operations.",
                "example": "// Adjacency Matrix\nclass GraphMatrix {\n  constructor(vertices) {\n    this.V = vertices;\n    this.matrix = Array(vertices).fill(0).map(() => Array(vertices).fill(0));\n  }\n  \n  addEdge(i, j) {\n    this.matrix[i][j] = 1;\n    this.matrix[j][i] = 1; // Undirected\n  }\n}\n\nconst g = new GraphMatrix(4);\ng.addEdge(0, 1);\ng.addEdge(1, 2);"
            }
        ],
        "quiz": {
            "questions": [
                {"question": "In a directed graph, edges have:", "options": ["No direction", "One direction", "Two directions", "Multiple directions"], "correct": 1},
                {"question": "What is the space complexity of an adjacency matrix for V vertices?", "options": ["O(V)", "O(V²)", "O(E)", "O(V+E)"], "correct": 1},
                {"question": "Which representation is better for sparse graphs?", "options": ["Adjacency Matrix", "Adjacency List", "Both are equal", "Neither"], "correct": 1},
                {"question": "The degree of a vertex is:", "options": ["Its depth", "Number of edges connected to it", "Its height", "Its value"], "correct": 1},
                {"question": "A path that starts and ends at the same vertex is called:", "options": ["Loop", "Cycle", "Circuit", "Edge"], "correct": 1}
            ]
        }
    },
    12: {
        "concepts": [
            {
                "title": "Breadth-First Search (BFS)",
                "content": "BFS explores graph level by level, visiting all neighbors before moving to next level. Uses a queue. Applications: shortest path in unweighted graphs, level-order traversal, finding connected components, testing bipartiteness. Time: O(V+E), Space: O(V). BFS guarantees shortest path in unweighted graphs. Requires visited array to avoid cycles.",
                "example": "// BFS Implementation\nfunction bfs(graph, start) {\n  const visited = new Set();\n  const queue = [start];\n  const result = [];\n  visited.add(start);\n  \n  while (queue.length > 0) {\n    const vertex = queue.shift();\n    result.push(vertex);\n    \n    for (let neighbor of graph.get(vertex)) {\n      if (!visited.has(neighbor)) {\n        visited.add(neighbor);\n        queue.push(neighbor);\n      }\n    }\n  }\n  return result;\n}"
            },
            {
                "title": "Depth-First Search (DFS)",
                "content": "DFS explores as far as possible along each branch before backtracking. Can be implemented recursively or with a stack. Applications: detecting cycles, topological sorting, finding strongly connected components, solving mazes. Time: O(V+E), Space: O(V). DFS doesn't guarantee shortest path but uses less memory than BFS for deep graphs.",
                "example": "// DFS Recursive\nfunction dfs(graph, vertex, visited = new Set(), result = []) {\n  visited.add(vertex);\n  result.push(vertex);\n  \n  for (let neighbor of graph.get(vertex)) {\n    if (!visited.has(neighbor)) {\n      dfs(graph, neighbor, visited, result);\n    }\n  }\n  return result;\n}"
            }
        ],
        "quiz": {
            "questions": [
                {"question": "Which data structure does BFS use?", "options": ["Stack", "Queue", "Heap", "Tree"], "correct": 1},
                {"question": "Which algorithm guarantees shortest path in unweighted graphs?", "options": ["DFS", "BFS", "Both", "Neither"], "correct": 1},
                {"question": "What is the time complexity of BFS and DFS?", "options": ["O(V)", "O(E)", "O(V+E)", "O(V*E)"], "correct": 2},
                {"question": "DFS can be implemented using:", "options": ["Only recursion", "Only stack", "Both recursion and stack", "Only queue"], "correct": 2},
                {"question": "Which traversal explores level by level?", "options": ["DFS", "BFS", "Both", "Neither"], "correct": 1}
            ]
        }
    },
    13: {
        "concepts": [
            {
                "title": "Dijkstra's Algorithm Basics",
                "content": "Dijkstra's algorithm finds the shortest path from a source vertex to all other vertices in a weighted graph with non-negative edge weights. Uses a greedy approach, always selecting the vertex with minimum distance. Uses a priority queue (min-heap) for efficiency. Time: O((V+E) log V) with binary heap. Cannot handle negative edge weights. Applications: GPS navigation, network routing, social networking.",
                "example": "// Dijkstra's Algorithm (simplified)\nfunction dijkstra(graph, start) {\n  const distances = {};\n  const visited = new Set();\n  const pq = []; // Priority queue\n  \n  for (let vertex in graph) {\n    distances[vertex] = vertex === start ? 0 : Infinity;\n  }\n  \n  pq.push({vertex: start, distance: 0});\n  \n  while (pq.length > 0) {\n    pq.sort((a, b) => a.distance - b.distance);\n    const {vertex, distance} = pq.shift();\n    \n    if (visited.has(vertex)) continue;\n    visited.add(vertex);\n    \n    for (let neighbor in graph[vertex]) {\n      const newDist = distance + graph[vertex][neighbor];\n      if (newDist < distances[neighbor]) {\n        distances[neighbor] = newDist;\n        pq.push({vertex: neighbor, distance: newDist});\n      }\n    }\n  }\n  return distances;\n}"
            },
            {
                "title": "Dijkstra's Algorithm Steps",
                "content": "Algorithm steps: 1) Initialize distances: source = 0, all others = infinity. 2) Create a priority queue with source vertex. 3) While queue not empty: extract vertex with minimum distance, for each unvisited neighbor calculate distance through current vertex, if new distance < stored distance update and add to queue. The algorithm maintains a set of visited vertices and always processes the closest unvisited vertex next.",
                "example": "// Example: Finding shortest path\n// Graph: A-1-B-2-D\n//        |     |\n//        4     1\n//        |     |\n//        C-----+\n//\n// From A:\n// Step 1: A=0, B=∞, C=∞, D=∞\n// Step 2: Visit A, update B=1, C=4\n// Step 3: Visit B, update D=3\n// Step 4: Visit D, C=4 (no change)\n// Result: A=0, B=1, C=4, D=3"
            }
        ],
        "quiz": {
            "questions": [
                {"question": "Dijkstra's algorithm finds:", "options": ["Longest path", "Shortest path", "All paths", "Minimum spanning tree"], "correct": 1},
                {"question": "Can Dijkstra's algorithm handle negative edge weights?", "options": ["Yes", "No", "Sometimes", "Only in directed graphs"], "correct": 1},
                {"question": "What data structure is used for efficiency in Dijkstra's?", "options": ["Stack", "Queue", "Priority Queue", "Array"], "correct": 2},
                {"question": "Time complexity of Dijkstra's with binary heap?", "options": ["O(V)", "O(V²)", "O((V+E) log V)", "O(V*E)"], "correct": 2},
                {"question": "Dijkstra's algorithm uses which approach?", "options": ["Divide and Conquer", "Dynamic Programming", "Greedy", "Backtracking"], "correct": 2}
            ]
        }
    },
    14: {
        "concepts": [
            {
                "title": "MST Fundamentals",
                "content": "A Minimum Spanning Tree (MST) of a weighted, connected, undirected graph is a subset of edges that connects all vertices with minimum total edge weight, without forming cycles. Properties: MST has V-1 edges for V vertices, removing any edge disconnects the tree, adding any edge creates a cycle. Applications: network design (minimizing cable length), clustering, approximation algorithms. Two main algorithms: Kruskal's (edge-based) and Prim's (vertex-based).",
                "example": "// Edge class for MST\nclass Edge {\n  constructor(src, dest, weight) {\n    this.src = src;\n    this.dest = dest;\n    this.weight = weight;\n  }\n}\n\n// Example graph:\n// A-1-B\n// |   |\n// 4   3\n// |   |\n// C-5-D\n// MST: A-B(1), A-D(2), B-D(3)\n// Total: 6"
            },
            {
                "title": "Kruskal's and Prim's Algorithms",
                "content": "Kruskal's Algorithm: Sort all edges by weight, add edges one by one if they don't form cycle (use Union-Find). Time: O(E log E). Prim's Algorithm: Start from any vertex, repeatedly add minimum weight edge connecting tree to non-tree vertex (use priority queue). Time: O(E log V). Both produce same total weight but may have different edge sets. Kruskal's better for sparse graphs, Prim's better for dense graphs.",
                "example": "// Kruskal's (simplified)\nfunction kruskal(edges, vertices) {\n  const mst = [];\n  edges.sort((a, b) => a.weight - b.weight);\n  const parent = {};\n  \n  // Initialize Union-Find\n  vertices.forEach(v => parent[v] = v);\n  \n  function find(v) {\n    if (parent[v] !== v) parent[v] = find(parent[v]);\n    return parent[v];\n  }\n  \n  for (let edge of edges) {\n    const root1 = find(edge.src);\n    const root2 = find(edge.dest);\n    if (root1 !== root2) {\n      mst.push(edge);\n      parent[root1] = root2;\n    }\n  }\n  return mst;\n}"
            }
        ],
        "quiz": {
            "questions": [
                {"question": "How many edges does an MST have for V vertices?", "options": ["V", "V-1", "V+1", "2V"], "correct": 1},
                {"question": "Which algorithm sorts edges by weight?", "options": ["Prim's", "Kruskal's", "Dijkstra's", "BFS"], "correct": 1},
                {"question": "What data structure does Kruskal's use to detect cycles?", "options": ["Stack", "Queue", "Union-Find", "Heap"], "correct": 2},
                {"question": "Time complexity of Kruskal's algorithm?", "options": ["O(V)", "O(E log E)", "O(V²)", "O(E)"], "correct": 1},
                {"question": "Can an MST have cycles?", "options": ["Yes", "No", "Sometimes", "Only in directed graphs"], "correct": 1}
            ]
        }
    }
}

def generate_content_with_gemini(level_id, title, topic):
    """Generate content using Gemini API with fallback"""
    print(f"\n🔄 Generating content for Level {level_id}: {title}...")
    
    # Try to generate concepts
    concepts_prompt = f"""Generate 2 detailed educational concepts for a DSA course about "{topic}".
Each concept should have:
- title: Clear, descriptive title (3-5 words)
- content: Detailed explanation in 150-200 words covering key points, use cases, and complexity
- example: JavaScript code example with comments (10-20 lines showing practical usage)

Return ONLY valid JSON array (no markdown, no extra text):
[
  {{"title": "Concept 1 Title", "content": "Detailed explanation...", "example": "// Code example\\ncode here..."}},
  {{"title": "Concept 2 Title", "content": "Detailed explanation...", "example": "// Code example\\ncode here..."}}
]

Topic: {topic}
Make it educational, accurate, and practical for students."""

    concepts_text = call_gemini_api(concepts_prompt)
    time.sleep(2)
    
    # Try to generate quiz
    quiz_prompt = f"""Generate 5 multiple choice quiz questions about "{topic}" for a DSA course.
Return ONLY valid JSON (no markdown, no extra text):
{{
  "questions": [
    {{"question": "Question text?", "options": ["A", "B", "C", "D"], "correct": 0}},
    {{"question": "Question text?", "options": ["A", "B", "C", "D"], "correct": 1}},
    {{"question": "Question text?", "options": ["A", "B", "C", "D"], "correct": 2}},
    {{"question": "Question text?", "options": ["A", "B", "C", "D"], "correct": 3}},
    {{"question": "Question text?", "options": ["A", "B", "C", "D"], "correct": 0}}
  ]
}}

Topic: {topic}
Test understanding, not just memorization."""

    quiz_text = call_gemini_api(quiz_prompt)
    
    # Parse or use fallback
    try:
        if concepts_text:
            # Clean up markdown if present
            concepts_text = concepts_text.strip()
            if concepts_text.startswith('```'):
                concepts_text = '\n'.join(concepts_text.split('\n')[1:-1])
            concepts = json.loads(concepts_text)
        else:
            concepts = FALLBACK_CONTENT[level_id]["concepts"]
            print(f"  ⚠️  Using fallback concepts")
    except:
        concepts = FALLBACK_CONTENT[level_id]["concepts"]
        print(f"  ⚠️  JSON parse failed, using fallback concepts")
    
    try:
        if quiz_text:
            quiz_text = quiz_text.strip()
            if quiz_text.startswith('```'):
                quiz_text = '\n'.join(quiz_text.split('\n')[1:-1])
            quiz = json.loads(quiz_text)
        else:
            quiz = FALLBACK_CONTENT[level_id]["quiz"]
            print(f"  ⚠️  Using fallback quiz")
    except:
        quiz = FALLBACK_CONTENT[level_id]["quiz"]
        print(f"  ⚠️  JSON parse failed, using fallback quiz")
    
    print(f"  ✅ Level {level_id} content ready")
    return concepts, quiz

def main():
    print("🚀 Starting content generation for Levels 11-14...\n")
    
    # Load config
    with open('data/dsa-courses-config.json', 'r', encoding='utf-8') as f:
        config = json.load(f)
    
    # Levels to update
    levels_info = [
        (11, "Graphs", "Graphs - vertices, edges, directed/undirected, weighted, adjacency matrix, adjacency list"),
        (12, "BFS & DFS", "Graph Traversal - Breadth-First Search (BFS), Depth-First Search (DFS), applications"),
        (13, "Dijkstra's Algorithm", "Dijkstra's Algorithm - shortest path, priority queue, greedy approach, weighted graphs"),
        (14, "Minimum Spanning Tree", "Minimum Spanning Tree - Kruskal's algorithm, Prim's algorithm, Union-Find, MST properties")
    ]
    
    # Generate and update each level
    for level_id, title, topic in levels_info:
        concepts, quiz = generate_content_with_gemini(level_id, title, topic)
        
        # Find and update level
        for level in config['courses']['dsa']['levels']:
            if level['id'] == level_id:
                level['concepts'] = concepts
                level['quiz'] = quiz
                # Keep video URL, remove coding
                if 'coding' in level:
                    del level['coding']
                print(f"  ✅ Updated Level {level_id} in config")
                break
        
        time.sleep(2)  # Rate limiting
    
    # Save
    with open('data/dsa-courses-config.json', 'w', encoding='utf-8') as f:
        json.dump(config, f, indent=2, ensure_ascii=False)
    
    print("\n✅ Successfully updated levels 11, 12, 13, 14!")
    print("📁 File: data/dsa-courses-config.json")

if __name__ == "__main__":
    main()
