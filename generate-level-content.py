import json
import time

# Level topics and their detailed content
LEVEL_CONTENT = {
    6: {
        "title": "Trees",
        "description": "Learn about tree data structures, their properties, and basic operations",
        "concepts": [
            {
                "title": "Introduction to Trees",
                "content": "A tree is a hierarchical data structure consisting of nodes connected by edges. Each tree has a root node, and every node has zero or more child nodes. Trees are used to represent hierarchical relationships, such as file systems, organizational structures, and HTML DOM. Key terminology includes: root (top node), leaf (node with no children), parent, child, sibling, depth (distance from root), and height (longest path from node to leaf).",
                "example": "// Basic Tree Node Structure\nclass TreeNode {\n  constructor(value) {\n    this.value = value;\n    this.children = []; // Array of child nodes\n  }\n  \n  addChild(node) {\n    this.children.push(node);\n  }\n}\n\n// Example: Creating a simple tree\nconst root = new TreeNode('A');\nconst nodeB = new TreeNode('B');\nconst nodeC = new TreeNode('C');\nroot.addChild(nodeB);\nroot.addChild(nodeC);"
            },
            {
                "title": "Binary Trees",
                "content": "A binary tree is a special type of tree where each node has at most two children, referred to as the left child and right child. Binary trees are fundamental in computer science and form the basis for more complex structures like Binary Search Trees, AVL Trees, and Heaps. Properties include: maximum nodes at level l = 2^l, maximum nodes in tree of height h = 2^(h+1) - 1. Types include: full binary tree (every node has 0 or 2 children), complete binary tree (all levels filled except possibly the last), and perfect binary tree (all internal nodes have 2 children and all leaves at same level).",
                "example": "// Binary Tree Node\nclass BinaryTreeNode {\n  constructor(value) {\n    this.value = value;\n    this.left = null;\n    this.right = null;\n  }\n}\n\n// Creating a binary tree\nconst root = new BinaryTreeNode(1);\nroot.left = new BinaryTreeNode(2);\nroot.right = new BinaryTreeNode(3);\nroot.left.left = new BinaryTreeNode(4);\nroot.left.right = new BinaryTreeNode(5);"
            }
        ],
        "quiz": [
            {
                "question": "What is the maximum number of nodes at level 3 in a binary tree?",
                "options": ["4", "6", "8", "16"],
                "correct": 2
            },
            {
                "question": "In a tree, a node with no children is called a:",
                "options": ["Root", "Leaf", "Branch", "Stem"],
                "correct": 1
            },
            {
                "question": "What is the height of a tree with only one node?",
                "options": ["0", "1", "-1", "Undefined"],
                "correct": 0
            },
            {
                "question": "Which of the following is NOT a type of binary tree?",
                "options": ["Full Binary Tree", "Complete Binary Tree", "Circular Binary Tree", "Perfect Binary Tree"],
                "correct": 2
            },
            {
                "question": "In a binary tree, each node can have at most how many children?",
                "options": ["1", "2", "3", "Unlimited"],
                "correct": 1
            }
        ]
    },
    7: {
        "title": "Tree Traversals",
        "description": "Master different methods of traversing tree data structures",
        "concepts": [
            {
                "title": "Depth-First Search (DFS) Traversals",
                "content": "DFS explores as far as possible along each branch before backtracking. Three main DFS traversals for binary trees are: Inorder (Left-Root-Right), Preorder (Root-Left-Right), and Postorder (Left-Right-Root). Inorder traversal of a BST gives nodes in sorted order. Preorder is useful for creating a copy of the tree. Postorder is useful for deleting the tree. Time complexity: O(n) for all three, Space complexity: O(h) where h is height.",
                "example": "// Inorder Traversal (Left-Root-Right)\nfunction inorder(node) {\n  if (node === null) return;\n  inorder(node.left);\n  console.log(node.value);\n  inorder(node.right);\n}\n\n// Preorder Traversal (Root-Left-Right)\nfunction preorder(node) {\n  if (node === null) return;\n  console.log(node.value);\n  preorder(node.left);\n  preorder(node.right);\n}\n\n// Postorder Traversal (Left-Right-Root)\nfunction postorder(node) {\n  if (node === null) return;\n  postorder(node.left);\n  postorder(node.right);\n  console.log(node.value);\n}"
            },
            {
                "title": "Breadth-First Search (BFS) / Level Order Traversal",
                "content": "BFS explores all nodes at the present depth before moving to nodes at the next depth level. It uses a queue data structure to keep track of nodes to visit. Level order traversal visits nodes level by level from left to right. This is useful for finding the shortest path in unweighted trees, level-wise processing, and finding nodes at a specific level. Time complexity: O(n), Space complexity: O(w) where w is maximum width of tree.",
                "example": "// Level Order Traversal using Queue\nfunction levelOrder(root) {\n  if (!root) return [];\n  \n  const result = [];\n  const queue = [root];\n  \n  while (queue.length > 0) {\n    const node = queue.shift();\n    result.push(node.value);\n    \n    if (node.left) queue.push(node.left);\n    if (node.right) queue.push(node.right);\n  }\n  \n  return result;\n}\n\n// Example: [1,2,3,4,5] for tree:\n//     1\n//    / \\\n//   2   3\n//  / \\\n// 4   5"
            }
        ],
        "quiz": [
            {
                "question": "Which traversal visits the root node last?",
                "options": ["Preorder", "Inorder", "Postorder", "Level Order"],
                "correct": 2
            },
            {
                "question": "Which data structure is used for Level Order Traversal?",
                "options": ["Stack", "Queue", "Array", "Linked List"],
                "correct": 1
            },
            {
                "question": "For a Binary Search Tree, which traversal gives nodes in sorted order?",
                "options": ["Preorder", "Inorder", "Postorder", "Level Order"],
                "correct": 1
            },
            {
                "question": "What is the time complexity of tree traversal algorithms?",
                "options": ["O(log n)", "O(n)", "O(n log n)", "O(n²)"],
                "correct": 1
            },
            {
                "question": "Which traversal is best for creating a copy of a tree?",
                "options": ["Inorder", "Preorder", "Postorder", "Level Order"],
                "correct": 1
            }
        ]
    },
    8: {
        "title": "Binary Search Trees",
        "description": "Learn about Binary Search Trees and their efficient search operations",
        "concepts": [
            {
                "title": "BST Properties and Operations",
                "content": "A Binary Search Tree (BST) is a binary tree where for each node: all values in the left subtree are less than the node's value, and all values in the right subtree are greater. This property enables efficient searching, insertion, and deletion. Average time complexity: O(log n) for search, insert, delete. Worst case (skewed tree): O(n). BSTs are used in implementing sets, maps, and priority queues. The inorder traversal of a BST always produces a sorted sequence.",
                "example": "// BST Node and Basic Operations\nclass BSTNode {\n  constructor(value) {\n    this.value = value;\n    this.left = null;\n    this.right = null;\n  }\n}\n\nclass BST {\n  constructor() {\n    this.root = null;\n  }\n  \n  insert(value) {\n    const newNode = new BSTNode(value);\n    if (!this.root) {\n      this.root = newNode;\n      return;\n    }\n    \n    let current = this.root;\n    while (true) {\n      if (value < current.value) {\n        if (!current.left) {\n          current.left = newNode;\n          return;\n        }\n        current = current.left;\n      } else {\n        if (!current.right) {\n          current.right = newNode;\n          return;\n        }\n        current = current.right;\n      }\n    }\n  }\n  \n  search(value) {\n    let current = this.root;\n    while (current) {\n      if (value === current.value) return true;\n      current = value < current.value ? current.left : current.right;\n    }\n    return false;\n  }\n}"
            },
            {
                "title": "BST Deletion",
                "content": "Deleting a node from a BST has three cases: 1) Node is a leaf (no children) - simply remove it. 2) Node has one child - replace node with its child. 3) Node has two children - find inorder successor (smallest node in right subtree) or inorder predecessor (largest node in left subtree), replace node's value with successor/predecessor, then delete the successor/predecessor. This maintains the BST property after deletion.",
                "example": "// BST Deletion (simplified)\nfunction deleteNode(root, key) {\n  if (!root) return null;\n  \n  if (key < root.value) {\n    root.left = deleteNode(root.left, key);\n  } else if (key > root.value) {\n    root.right = deleteNode(root.right, key);\n  } else {\n    // Node found\n    // Case 1: Leaf node\n    if (!root.left && !root.right) return null;\n    \n    // Case 2: One child\n    if (!root.left) return root.right;\n    if (!root.right) return root.left;\n    \n    // Case 3: Two children\n    // Find inorder successor (min in right subtree)\n    let successor = root.right;\n    while (successor.left) {\n      successor = successor.left;\n    }\n    root.value = successor.value;\n    root.right = deleteNode(root.right, successor.value);\n  }\n  return root;\n}"
            }
        ],
        "quiz": [
            {
                "question": "In a BST, values in the left subtree are:",
                "options": ["Greater than root", "Less than root", "Equal to root", "Random"],
                "correct": 1
            },
            {
                "question": "What is the average time complexity for searching in a balanced BST?",
                "options": ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
                "correct": 1
            },
            {
                "question": "What traversal of a BST gives elements in sorted order?",
                "options": ["Preorder", "Inorder", "Postorder", "Level Order"],
                "correct": 1
            },
            {
                "question": "In BST deletion, what is the inorder successor?",
                "options": ["Largest in left subtree", "Smallest in right subtree", "Parent node", "Root node"],
                "correct": 1
            },
            {
                "question": "What is the worst-case time complexity for search in a skewed BST?",
                "options": ["O(1)", "O(log n)", "O(n)", "O(n²)"],
                "correct": 2
            }
        ]
    },
    9: {
        "title": "AVL Trees",
        "description": "Understand self-balancing binary search trees",
        "concepts": [
            {
                "title": "AVL Tree Properties",
                "content": "An AVL tree is a self-balancing Binary Search Tree where the heights of left and right subtrees of any node differ by at most 1. This balance factor (height of left subtree - height of right subtree) must be -1, 0, or 1 for all nodes. AVL trees guarantee O(log n) time complexity for search, insert, and delete operations even in worst case. Named after inventors Adelson-Velsky and Landis. The tree rebalances itself through rotations after insertions and deletions.",
                "example": "// AVL Node with height\nclass AVLNode {\n  constructor(value) {\n    this.value = value;\n    this.left = null;\n    this.right = null;\n    this.height = 1;\n  }\n}\n\n// Helper functions\nfunction getHeight(node) {\n  return node ? node.height : 0;\n}\n\nfunction getBalance(node) {\n  return node ? getHeight(node.left) - getHeight(node.right) : 0;\n}\n\nfunction updateHeight(node) {\n  if (node) {\n    node.height = 1 + Math.max(getHeight(node.left), getHeight(node.right));\n  }\n}"
            },
            {
                "title": "AVL Rotations",
                "content": "AVL trees use four types of rotations to maintain balance: 1) Left Rotation (LL): Used when right subtree is heavier. 2) Right Rotation (RR): Used when left subtree is heavier. 3) Left-Right Rotation (LR): Left rotation on left child, then right rotation on node. 4) Right-Left Rotation (RL): Right rotation on right child, then left rotation on node. Rotations are performed after insertion or deletion when balance factor becomes ±2.",
                "example": "// Right Rotation\nfunction rightRotate(y) {\n  const x = y.left;\n  const T2 = x.right;\n  \n  // Perform rotation\n  x.right = y;\n  y.left = T2;\n  \n  // Update heights\n  updateHeight(y);\n  updateHeight(x);\n  \n  return x; // New root\n}\n\n// Left Rotation\nfunction leftRotate(x) {\n  const y = x.right;\n  const T2 = y.left;\n  \n  // Perform rotation\n  y.left = x;\n  x.right = T2;\n  \n  // Update heights\n  updateHeight(x);\n  updateHeight(y);\n  \n  return y; // New root\n}"
            }
        ],
        "quiz": [
            {
                "question": "What is the maximum allowed difference in heights of left and right subtrees in an AVL tree?",
                "options": ["0", "1", "2", "3"],
                "correct": 1
            },
            {
                "question": "What is the time complexity of search in an AVL tree?",
                "options": ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
                "correct": 1
            },
            {
                "question": "Which rotation is used when the left subtree of left child is heavier?",
                "options": ["Left Rotation", "Right Rotation", "Left-Right Rotation", "Right-Left Rotation"],
                "correct": 1
            },
            {
                "question": "AVL trees are named after:",
                "options": ["A programming language", "Two inventors", "A company", "A city"],
                "correct": 1
            },
            {
                "question": "What is the balance factor of a node in an AVL tree?",
                "options": ["Height of node", "Height of left - height of right", "Number of children", "Depth of node"],
                "correct": 1
            }
        ]
    },
    11: {
        "title": "Graphs",
        "description": "Learn about graph data structures and their representations",
        "concepts": [
            {
                "title": "Graph Fundamentals",
                "content": "A graph is a non-linear data structure consisting of vertices (nodes) and edges (connections). Graphs can be directed (edges have direction) or undirected (edges are bidirectional). They can be weighted (edges have values) or unweighted. Key terminology: adjacent vertices (connected by edge), degree (number of edges connected to vertex), path (sequence of vertices), cycle (path that starts and ends at same vertex). Graphs model real-world networks like social networks, maps, computer networks, and dependencies.",
                "example": "// Graph using Adjacency List\nclass Graph {\n  constructor() {\n    this.adjacencyList = new Map();\n  }\n  \n  addVertex(vertex) {\n    if (!this.adjacencyList.has(vertex)) {\n      this.adjacencyList.set(vertex, []);\n    }\n  }\n  \n  addEdge(v1, v2) {\n    this.adjacencyList.get(v1).push(v2);\n    this.adjacencyList.get(v2).push(v1); // For undirected graph\n  }\n  \n  display() {\n    for (let [vertex, edges] of this.adjacencyList) {\n      console.log(vertex + ' -> ' + edges.join(', '));\n    }\n  }\n}\n\n// Example usage\nconst graph = new Graph();\ngraph.addVertex('A');\ngraph.addVertex('B');\ngraph.addVertex('C');\ngraph.addEdge('A', 'B');\ngraph.addEdge('B', 'C');"
            },
            {
                "title": "Graph Representations",
                "content": "Two main ways to represent graphs: 1) Adjacency Matrix: 2D array where matrix[i][j] = 1 if edge exists between vertex i and j. Space: O(V²), Edge lookup: O(1), Good for dense graphs. 2) Adjacency List: Array/Map of lists where each vertex stores list of adjacent vertices. Space: O(V+E), Edge lookup: O(degree), Good for sparse graphs. Choice depends on graph density and required operations.",
                "example": "// Adjacency Matrix\nclass GraphMatrix {\n  constructor(vertices) {\n    this.V = vertices;\n    this.matrix = Array(vertices).fill(0)\n      .map(() => Array(vertices).fill(0));\n  }\n  \n  addEdge(i, j) {\n    this.matrix[i][j] = 1;\n    this.matrix[j][i] = 1; // For undirected\n  }\n  \n  hasEdge(i, j) {\n    return this.matrix[i][j] === 1;\n  }\n}\n\n// Example: Graph with 4 vertices\nconst g = new GraphMatrix(4);\ng.addEdge(0, 1);\ng.addEdge(0, 2);\ng.addEdge(1, 2);\ng.addEdge(2, 3);"
            }
        ],
        "quiz": [
            {
                "question": "In a directed graph, edges have:",
                "options": ["No direction", "One direction", "Two directions", "Multiple directions"],
                "correct": 1
            },
            {
                "question": "What is the space complexity of an adjacency matrix for V vertices?",
                "options": ["O(V)", "O(V²)", "O(E)", "O(V+E)"],
                "correct": 1
            },
            {
                "question": "Which representation is better for sparse graphs?",
                "options": ["Adjacency Matrix", "Adjacency List", "Both are equal", "Neither"],
                "correct": 1
            },
            {
                "question": "The degree of a vertex is:",
                "options": ["Its depth", "Number of edges connected to it", "Its height", "Its value"],
                "correct": 1
            },
            {
                "question": "A path that starts and ends at the same vertex is called:",
                "options": ["Loop", "Cycle", "Circuit", "Edge"],
                "correct": 1
            }
        ]
    },
    12: {
        "title": "BFS & DFS",
        "description": "Master graph traversal algorithms",
        "concepts": [
            {
                "title": "Breadth-First Search (BFS)",
                "content": "BFS explores graph level by level, visiting all neighbors of a vertex before moving to next level. Uses a queue data structure. Applications: shortest path in unweighted graphs, level-order traversal, finding connected components, testing bipartiteness. Time complexity: O(V+E), Space complexity: O(V). BFS guarantees shortest path in unweighted graphs. Requires visited array to avoid cycles.",
                "example": "// BFS Implementation\nfunction bfs(graph, start) {\n  const visited = new Set();\n  const queue = [start];\n  const result = [];\n  \n  visited.add(start);\n  \n  while (queue.length > 0) {\n    const vertex = queue.shift();\n    result.push(vertex);\n    \n    const neighbors = graph.adjacencyList.get(vertex);\n    for (let neighbor of neighbors) {\n      if (!visited.has(neighbor)) {\n        visited.add(neighbor);\n        queue.push(neighbor);\n      }\n    }\n  }\n  \n  return result;\n}\n\n// Example: BFS from vertex 'A'\n// Graph: A-B-C\n//        |   |\n//        D---E\n// BFS order: A, B, D, C, E"
            },
            {
                "title": "Depth-First Search (DFS)",
                "content": "DFS explores as far as possible along each branch before backtracking. Can be implemented recursively or with a stack. Applications: detecting cycles, topological sorting, finding strongly connected components, solving mazes, path finding. Time complexity: O(V+E), Space complexity: O(V). DFS doesn't guarantee shortest path but uses less memory than BFS for deep graphs.",
                "example": "// DFS Recursive Implementation\nfunction dfsRecursive(graph, vertex, visited = new Set(), result = []) {\n  visited.add(vertex);\n  result.push(vertex);\n  \n  const neighbors = graph.adjacencyList.get(vertex);\n  for (let neighbor of neighbors) {\n    if (!visited.has(neighbor)) {\n      dfsRecursive(graph, neighbor, visited, result);\n    }\n  }\n  \n  return result;\n}\n\n// DFS Iterative (using stack)\nfunction dfsIterative(graph, start) {\n  const visited = new Set();\n  const stack = [start];\n  const result = [];\n  \n  while (stack.length > 0) {\n    const vertex = stack.pop();\n    \n    if (!visited.has(vertex)) {\n      visited.add(vertex);\n      result.push(vertex);\n      \n      const neighbors = graph.adjacencyList.get(vertex);\n      for (let neighbor of neighbors) {\n        if (!visited.has(neighbor)) {\n          stack.push(neighbor);\n        }\n      }\n    }\n  }\n  \n  return result;\n}"
            }
        ],
        "quiz": [
            {
                "question": "Which data structure does BFS use?",
                "options": ["Stack", "Queue", "Heap", "Tree"],
                "correct": 1
            },
            {
                "question": "Which algorithm guarantees shortest path in unweighted graphs?",
                "options": ["DFS", "BFS", "Both", "Neither"],
                "correct": 1
            },
            {
                "question": "What is the time complexity of BFS and DFS?",
                "options": ["O(V)", "O(E)", "O(V+E)", "O(V*E)"],
                "correct": 2
            },
            {
                "question": "DFS can be implemented using:",
                "options": ["Only recursion", "Only stack", "Both recursion and stack", "Only queue"],
                "correct": 2
            },
            {
                "question": "Which traversal explores level by level?",
                "options": ["DFS", "BFS", "Both", "Neither"],
                "correct": 1
            }
        ]
    },
    13: {
        "title": "Dijkstra's Algorithm",
        "description": "Learn shortest path algorithm for weighted graphs",
        "concepts": [
            {
                "title": "Dijkstra's Algorithm Basics",
                "content": "Dijkstra's algorithm finds the shortest path from a source vertex to all other vertices in a weighted graph with non-negative edge weights. It uses a greedy approach, always selecting the vertex with minimum distance. Uses a priority queue (min-heap) for efficiency. Time complexity: O((V+E) log V) with binary heap, O(V²) with array. Cannot handle negative edge weights. Applications: GPS navigation, network routing, social networking.",
                "example": "// Dijkstra's Algorithm (simplified)\nfunction dijkstra(graph, start) {\n  const distances = {};\n  const visited = new Set();\n  const pq = new PriorityQueue(); // Min-heap\n  \n  // Initialize distances\n  for (let vertex of graph.vertices) {\n    distances[vertex] = vertex === start ? 0 : Infinity;\n  }\n  \n  pq.enqueue(start, 0);\n  \n  while (!pq.isEmpty()) {\n    const { vertex, distance } = pq.dequeue();\n    \n    if (visited.has(vertex)) continue;\n    visited.add(vertex);\n    \n    for (let neighbor of graph.getNeighbors(vertex)) {\n      const newDist = distance + graph.getWeight(vertex, neighbor);\n      \n      if (newDist < distances[neighbor]) {\n        distances[neighbor] = newDist;\n        pq.enqueue(neighbor, newDist);\n      }\n    }\n  }\n  \n  return distances;\n}"
            },
            {
                "title": "Dijkstra's Algorithm Steps",
                "content": "Algorithm steps: 1) Initialize distances: source = 0, all others = infinity. 2) Create a priority queue with source vertex. 3) While queue not empty: a) Extract vertex with minimum distance. b) For each unvisited neighbor: calculate distance through current vertex. c) If new distance < stored distance: update distance and add to queue. 4) Repeat until all vertices processed. The algorithm maintains a set of visited vertices and always processes the closest unvisited vertex next.",
                "example": "// Example: Finding shortest path\n// Graph:\n//     A --1-- B\n//     |       |\n//     4       2\n//     |       |\n//     C --1-- D\n//\n// From A:\n// Step 1: A=0, B=∞, C=∞, D=∞\n// Step 2: Visit A, update B=1, C=4\n// Step 3: Visit B, update D=3\n// Step 4: Visit D, update C=4 (no change)\n// Step 5: Visit C\n// Result: A=0, B=1, C=4, D=3\n\n// Shortest paths:\n// A to B: A->B (distance 1)\n// A to C: A->C (distance 4)\n// A to D: A->B->D (distance 3)"
            }
        ],
        "quiz": [
            {
                "question": "Dijkstra's algorithm finds:",
                "options": ["Longest path", "Shortest path", "All paths", "Minimum spanning tree"],
                "correct": 1
            },
            {
                "question": "Can Dijkstra's algorithm handle negative edge weights?",
                "options": ["Yes", "No", "Sometimes", "Only in directed graphs"],
                "correct": 1
            },
            {
                "question": "What data structure is used for efficiency in Dijkstra's algorithm?",
                "options": ["Stack", "Queue", "Priority Queue", "Array"],
                "correct": 2
            },
            {
                "question": "What is the time complexity of Dijkstra's with binary heap?",
                "options": ["O(V)", "O(V²)", "O((V+E) log V)", "O(V*E)"],
                "correct": 2
            },
            {
                "question": "Dijkstra's algorithm uses which approach?",
                "options": ["Divide and Conquer", "Dynamic Programming", "Greedy", "Backtracking"],
                "correct": 2
            }
        ]
    },
    14: {
        "title": "Minimum Spanning Tree",
        "description": "Learn algorithms for finding minimum spanning trees",
        "concepts": [
            {
                "title": "MST Fundamentals",
                "content": "A Minimum Spanning Tree (MST) of a weighted, connected, undirected graph is a subset of edges that connects all vertices with minimum total edge weight, without forming cycles. Properties: MST has V-1 edges for V vertices, removing any edge disconnects the tree, adding any edge creates a cycle. Applications: network design (minimizing cable length), clustering, approximation algorithms. Two main algorithms: Kruskal's (edge-based) and Prim's (vertex-based).",
                "example": "// Graph representation for MST\nclass Edge {\n  constructor(src, dest, weight) {\n    this.src = src;\n    this.dest = dest;\n    this.weight = weight;\n  }\n}\n\n// Example graph:\n//     A --1-- B\n//     |  \\    |\n//     4   2   3\n//     |    \\  |\n//     C --5-- D\n//\n// MST edges: A-B(1), A-D(2), B-D(3)\n// Total weight: 6\n// Excluded: A-C(4), C-D(5)"
            },
            {
                "title": "Kruskal's and Prim's Algorithms",
                "content": "Kruskal's Algorithm: Sort all edges by weight, add edges one by one if they don't form cycle (use Union-Find). Time: O(E log E). Prim's Algorithm: Start from any vertex, repeatedly add minimum weight edge connecting tree to non-tree vertex (use priority queue). Time: O(E log V). Both produce same total weight but may have different edge sets. Kruskal's better for sparse graphs, Prim's better for dense graphs.",
                "example": "// Kruskal's Algorithm (simplified)\nfunction kruskal(graph) {\n  const mst = [];\n  const edges = graph.edges.sort((a, b) => a.weight - b.weight);\n  const uf = new UnionFind(graph.vertices);\n  \n  for (let edge of edges) {\n    if (!uf.connected(edge.src, edge.dest)) {\n      uf.union(edge.src, edge.dest);\n      mst.push(edge);\n      \n      if (mst.length === graph.vertices - 1) break;\
