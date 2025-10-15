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
        print("Warning: GEMINI_API_KEY not set. Using fallback content.")
        return None
    
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
            f"{GEMINI_API_URL}?key={GEMINI_API_KEY}",
            headers=headers,
            json=data,
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            return result['candidates'][0]['content']['parts'][0]['text']
        else:
            print(f"API Error: {response.status_code}")
            return None
    except Exception as e:
        print(f"Exception: {e}")
        return None

def generate_level_content(level_id, title, topic):
    """Generate content for a specific level"""
    print(f"\nGenerating content for Level {level_id}: {title}...")
    
    # Generate concepts
    concepts_prompt = f"""Generate 2 detailed concepts for a DSA course level about "{topic}".
Each concept should have:
- title: A clear, descriptive title
- content: 3-4 sentences explaining the concept in detail (150-200 words)
- example: JavaScript code example with comments (10-15 lines)

Format as JSON array:
[
  {{
    "title": "Concept 1 Title",
    "content": "Detailed explanation...",
    "example": "// JavaScript code example\\ncode here..."
  }},
  {{
    "title": "Concept 2 Title", 
    "content": "Detailed explanation...",
    "example": "// JavaScript code example\\ncode here..."
  }}
]

Topic: {topic}
Make it educational and practical for students learning DSA."""

    concepts_text = call_gemini_api(concepts_prompt)
    time.sleep(2)  # Rate limiting
    
    # Generate quiz
    quiz_prompt = f"""Generate 5 multiple choice quiz questions about "{topic}" for a DSA course.
Each question should have:
- question: Clear question text
- options: Array of 4 options
- correct: Index of correct answer (0-3)

Format as JSON:
{{
  "questions": [
    {{
      "question": "Question text?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 0
    }},
    ... (5 questions total)
  ]
}}

Topic: {topic}
Make questions test understanding, not just memorization."""

    quiz_text = call_gemini_api(quiz_prompt)
    
    # Parse JSON responses
    try:
        concepts = json.loads(concepts_text) if concepts_text else get_fallback_concepts(level_id, title)
        quiz = json.loads(quiz_text) if quiz_text else get_fallback_quiz(level_id, title)
    except:
        print(f"Failed to parse JSON for level {level_id}, using fallback")
        concepts = get_fallback_concepts(level_id, title)
        quiz = get_fallback_quiz(level_id, title)
    
    return concepts, quiz

def get_fallback_concepts(level_id, title):
    """Fallback concepts if API fails"""
    fallback_data = {
        6: [
            {
                "title": "Introduction to Trees",
                "content": "A tree is a hierarchical data structure consisting of nodes connected by edges. Each tree has a root node, and every node has zero or more child nodes. Trees are used to represent hierarchical relationships, such as file systems, organizational structures, and HTML DOM. Key terminology includes: root (top node), leaf (node with no children), parent, child, sibling, depth (distance from root), and height (longest path from node to leaf).",
                "example": "// Basic Tree Node Structure\nclass TreeNode {\n  constructor(value) {\n    this.value = value;\n    this.children = []; // Array of child nodes\n  }\n  \n  addChild(node) {\n    this.children.push(node);\n  }\n}\n\n// Example: Creating a simple tree\nconst root = new TreeNode('A');\nconst nodeB = new TreeNode('B');\nconst nodeC = new TreeNode('C');\nroot.addChild(nodeB);\nroot.addChild(nodeC);"
            },
            {
                "title": "Binary Trees",
                "content": "A binary tree is a special type of tree where each node has at most two children, referred to as the left child and right child. Binary trees are fundamental in computer science and form the basis for more complex structures like Binary Search Trees, AVL Trees, and Heaps. Properties include: maximum nodes at level l = 2^l, maximum nodes in tree of height h = 2^(h+1) - 1.",
                "example": "// Binary Tree Node\nclass BinaryTreeNode {\n  constructor(value) {\n    this.value = value;\n    this.left = null;\n    this.right = null;\n  }\n}\n\n// Creating a binary tree\nconst root = new BinaryTreeNode(1);\nroot.left = new BinaryTreeNode(2);\nroot.right = new BinaryTreeNode(3);\nroot.left.left = new BinaryTreeNode(4);\nroot.left.right = new BinaryTreeNode(5);"
            }
        ],
        7: [
            {
                "title": "Depth-First Search (DFS) Traversals",
                "content": "DFS explores as far as possible along each branch before backtracking. Three main DFS traversals for binary trees are: Inorder (Left-Root-Right), Preorder (Root-Left-Right), and Postorder (Left-Right-Root). Inorder traversal of a BST gives nodes in sorted order. Preorder is useful for creating a copy of the tree. Postorder is useful for deleting the tree.",
                "example": "// Inorder Traversal (Left-Root-Right)\nfunction inorder(node) {\n  if (node === null) return;\n  inorder(node.left);\n  console.log(node.value);\n  inorder(node.right);\n}\n\n// Preorder Traversal (Root-Left-Right)\nfunction preorder(node) {\n  if (node === null) return;\n  console.log(node.value);\n  preorder(node.left);\n  preorder(node.right);\n}"
            },
            {
                "title": "Breadth-First Search (BFS)",
                "content": "BFS explores all nodes at the present depth before moving to nodes at the next depth level. It uses a queue data structure to keep track of nodes to visit. Level order traversal visits nodes level by level from left to right. This is useful for finding the shortest path in unweighted trees and level-wise processing.",
                "example": "// Level Order Traversal using Queue\nfunction levelOrder(root) {\n  if (!root) return [];\n  \n  const result = [];\n  const queue = [root];\n  \n  while (queue.length > 0) {\n    const node = queue.shift();\n    result.push(node.value);\n    \n    if (node.left) queue.push(node.left);\n    if (node.right) queue.push(node.right);\n  }\n  \n  return result;\n}"
            }
        ],
        8: [
            {
                "title": "BST Properties and Operations",
                "content": "A Binary Search Tree (BST) is a binary tree where for each node: all values in the left subtree are less than the node's value, and all values in the right subtree are greater. This property enables efficient searching, insertion, and deletion. Average time complexity: O(log n) for search, insert, delete. The inorder traversal of a BST always produces a sorted sequence.",
                "example": "// BST Node and Basic Operations\nclass BSTNode {\n  constructor(value) {\n    this.value = value;\n    this.left = null;\n    this.right = null;\n  }\n}\n\nfunction search(root, value) {\n  if (!root || root.value === value) return root;\n  \n  if (value < root.value) {\n    return search(root.left, value);\n  }\n  return search(root.right, value);\n}"
            },
            {
                "title": "BST Insertion",
                "content": "Inserting a node in a BST involves finding the correct position while maintaining the BST property. Start from the root and compare the value to be inserted with the current node. If smaller, go left; if larger, go right. Continue until finding an empty spot. Time complexity: O(h) where h is height.",
                "example": "// BST Insertion\nfunction insert(root, value) {\n  if (!root) {\n    return new BSTNode(value);\n  }\n  \n  if (value < root.value) {\n    root.left = insert(root.left, value);\n  } else if (value > root.value) {\n    root.right = insert(root.right, value);\n  }\n  \n  return root;\n}"
            }
        ],
        9: [
            {
                "title": "AVL Tree Properties",
                "content": "An AVL tree is a self-balancing Binary Search Tree where the heights of left and right subtrees of any node differ by at most 1. This balance factor must be -1, 0, or 1 for all nodes. AVL trees guarantee O(log n) time complexity for search, insert, and delete operations. The tree rebalances itself through rotations after insertions and deletions.",
                "example": "// AVL Node with height\nclass AVLNode {\n  constructor(value) {\n    this.value = value;\n    this.left = null;\n    this.right = null;\n    this.height = 1;\n  }\n}\n\nfunction getHeight(node) {\n  return node ? node.height : 0;\n}\n\nfunction getBalance(node) {\n  return node ? getHeight(node.left) - getHeight(node.right) : 0;\n}"
            },
            {
                "title": "AVL Rotations",
                "content": "AVL trees use four types of rotations to maintain balance: Left Rotation (LL), Right Rotation (RR), Left-Right Rotation (LR), and Right-Left Rotation (RL). Rotations are performed after insertion or deletion when balance factor becomes ±2. These rotations restructure the tree while maintaining the BST property.",
                "example": "// Right Rotation\nfunction rightRotate(y) {\n  const x = y.left;\n  const T2 = x.right;\n  \n  // Perform rotation\n  x.right = y;\n  y.left = T2;\n  \n  // Update heights\n  y.height = 1 + Math.max(getHeight(y.left), getHeight(y.right));\n  x.height = 1 + Math.max(getHeight(x.left), getHeight(x.right));\n  \n  return x;\n}"
            }
        ]
    }
    return fallback_data.get(level_id, [])

def get_fallback_quiz(level_id, title):
    """Fallback quiz if API fails"""
    fallback_quizzes = {
        6: {
            "questions": [
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
            "questions": [
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
            "questions": [
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
            "questions": [
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
        }
    }
    return fallback_quizzes.get(level_id, {"questions": []})

def main():
    # Load existing config
    with open('data/dsa-courses-config.json', 'r', encoding='utf-8') as f:
        config = json.load(f)
    
    # Levels to update
    levels_to_update = [
        (6, "Trees", "Trees - hierarchical data structures, binary trees, tree properties"),
        (7, "Tree Traversals", "Tree Traversals - DFS (Inorder, Preorder, Postorder), BFS, Level Order"),
        (8, "Binary Search Trees", "Binary Search Trees - BST properties, search, insertion, deletion"),
        (9, "AVL Trees", "AVL Trees - self-balancing BST, rotations, balance factor")
    ]
    
    # Update each level
    for level_id, title, topic in levels_to_update:
        concepts, quiz = generate_level_content(level_id, title, topic)
        
        # Find and update the level in config
        for level in config['courses']['dsa']['levels']:
            if level['id'] == level_id:
                level['concepts'] = concepts
                level['quiz'] = quiz
                # Remove coding challenge for non-milestone levels
                if 'coding' in level:
                    del level['coding']
                print(f"✓ Updated Level {level_id}: {title}")
                break
        
        time.sleep(2)  # Rate limiting between levels
    
    # Save updated config
    with open('data/dsa-courses-config.json', 'w', encoding='utf-8') as f:
        json.dump(config, f, indent=2, ensure_ascii=False)
    
    print("\n✅ Successfully updated levels 6, 7, 8, 9!")
    print("Updated file: data/dsa-courses-config.json")

if __name__ == "__main__":
    main()
