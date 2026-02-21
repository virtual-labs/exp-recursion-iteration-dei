
## 1. Introduction

This application helps you understand the **Fibonacci sequence** through interactive, step-by-step code walkthroughs. You can explore two approaches:

- **Iterative Fibonacci** – Loop-based computation with animated state and array
- **Recursive Fibonacci** – Tree-based computation with a dynamic recursion tree

At the entry point, you choose either Iterative or Recursive mode. Each mode provides a focused code walkthrough experience.

---

## 2. Using the Simulation

### 2.1 Mode Selection

On startup, select one of the following:
- **Iterative Fibonacci**
- **Recursive Fibonacci**

### 2.2 Controls

For both modes, the following controls are available:
- **Input Value (n):** Set the Fibonacci number to compute  
  - Recommended: `n ≤ 15` for iterative, `n ≤ 5` for recursive
- **Execution Speed:** Slow / Normal / Fast
- **Play / Pause:** Automatic step-through
- **Next Line:** Step through code one line at a time
- **Reset:** Restart the walkthrough

---

## 3. Code Walkthrough Experience

### 3.1 Code Area
- The currently executing line is highlighted
- An inline explanation appears beside the highlighted line
- The code view scrolls automatically to keep the active line visible

### 3.2 State and Visualization

#### Iterative Mode
- See live values for: `n`, loop index `i`, `prev`, `curr`, `next`, iteration count, and result
- Animated array shows the sequence as it is built

#### Recursive Mode
- See the current call stack, recursion depth, max depth, and total calls
- A dynamic recursion tree visualizes function calls and returns

---

## 4. Tips and Performance

- Use small `n` for recursion (`n ≤ 5`) to avoid slowdowns
- Iterative mode is efficient for larger `n`

---

## 5. Learning Outcomes

By using this tool, you will:
- Understand the difference between iteration and recursion
- Visualize recursive function calls and returns
- Learn why recursive Fibonacci is inefficient
- Connect algorithm logic with actual program execution
