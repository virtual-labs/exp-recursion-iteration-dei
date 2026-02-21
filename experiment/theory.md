## 1. Introduction

The Fibonacci series is one of the most famous numerical sequences in mathematics and computer science.  
It appears in many real-world applications such as algorithm design, data structures, nature patterns, and problem-solving techniques.

In programming, the Fibonacci series is commonly used to understand:
- Looping concepts
- Function calls
- Recursion
- Time and space complexity comparison

### Real-World Applications
- Used in algorithm analysis to explain recursion and dynamic programming
- Applied in data structures like trees and heaps
- Seen in nature patterns such as leaf arrangement and shell spirals
- Used in financial models for trend and ratio analysis
- Helpful in teaching problem-solving and optimization techniques


---

## 2. Definition of Fibonacci Series

The Fibonacci series is a sequence of numbers where **each number is the sum of the previous two numbers**.

### Mathematical Definition:
- F(0) = 0  
- F(1) = 1  
- F(n) = F(n−1) + F(n−2) for n ≥ 2  

### Example:
0, 1, 1, 2, 3, 5, 8, 13, 21, ...


---

## 3. Methods to Generate Fibonacci Series

There are two commonly used programming approaches:
1. Iterative Method
2. Recursive Method

Each approach has its own advantages and disadvantages.

---

## 4. Iterative Approach

### Concept

The iterative approach generates the Fibonacci series using **loops** such as `for` or `while`.  
It calculates each Fibonacci number step-by-step and stores only the required values.

### Working Principle
- Initialize the first two numbers
- Use a loop to calculate the next terms
- Update values in each iteration

### Pseudocode
```

a ← 0  
b ← 1  

for i ← 2 to n do  
   c ← a + b  
   a ← b  
   b ← c  
end for


```

### Flowchart: Iterative Fibonacci

![Iterative Fibonacci Flowchart](images/iter_flowchart.png)

*The flowchart illustrates the iterative process for finding 4th Fibonacci number.*

### Advantages
- Faster execution time
- Uses less memory
- Simple and efficient for large values of n

### Disadvantages
- Logic may look less mathematical compared to recursion

---

## 5. Recursive Approach

### Concept

The recursive approach uses **function calls** where a function calls itself to calculate Fibonacci numbers.

### Working Principle
- The recursion stops at **base cases** (`n = 0` and `n = 1`)
- For other values, the function calls itself to compute the two previous Fibonacci numbers
- The final value is obtained by adding results of smaller subproblems

### Pseudocode
```

F(n):
  if n == 0:
      return 0
  if n == 1:
      return 1
  return F(n-1) + F(n-2)

```

### Flowchart: Recursive Fibonacci

![Recursive Fibonacci Flowchart](images/rec_flowchart.png)

*The flowchart shows the recursive logic for F(4): checking base cases (n=0 or n=1) and recursively calling the function for (n-1) and (n-2) to compute the result.*

### Advantages
- Simple and close to mathematical definition
- Easy to understand conceptually

### Disadvantages
- Slower execution time due to repeated calculations
- Uses more memory space (stack calls)
- Inefficient for large values of n

---

## 6. Comparison: Iterative vs Recursive

| Feature | Iterative Approach | Recursive Approach |
|---------|-------------------|-------------------|
| **Execution Speed** | Fast – computes each term once in a single pass | Slow – recalculates the same subproblems multiple times |
| **Time Complexity** | O(n) – linear growth with input size | O(2ⁿ) – exponential growth due to overlapping subproblems |
| **Space Complexity** | O(1) – uses only a fixed number of variables | O(n) – requires stack space proportional to recursion depth |
| **Memory Usage** | Low – no additional stack frames needed | High – each recursive call adds a new frame to the call stack |
| **Risk of Stack Overflow** | None – no recursion involved | High – deep recursion for large n can exceed stack limit |
| **Scalability** | Highly scalable for large values of n | Not scalable – becomes impractical for n > 30–40 |
| **Function Call Overhead** | None – all computation happens within a single function | Significant – each call incurs overhead for stack management |
| **Suitability for Optimization** | Already optimal for basic Fibonacci | Can be optimized using memoization or dynamic programming |
| **Best Use Case** | Production code, large inputs, performance-critical applications | Teaching recursion concepts, small inputs, algorithm demonstrations |

### Key Insights

- **For practical applications**, the iterative method is almost always preferred due to its efficiency and predictable performance.
- **For educational purposes**, the recursive method helps students understand the concept of breaking problems into smaller subproblems.
- **Optimization techniques** like memoization can improve recursive performance to O(n), but still carry stack overhead compared to iteration.

---

## 7. Time and Space Complexity

### Iterative Method
- **Time Complexity:** `O(n)`  
  The loop runs once for each value from `0` to `n`, performing a constant amount of work each time.
- **Space Complexity:** `O(1)`  
  Only a few variables are used, regardless of the value of `n`.

### Recursive Method (Naive)
- **Time Complexity:** `O(2ⁿ)`  
  Each function call makes two more calls, leading to an exponential number of repeated calculations.
- **Space Complexity:** `O(n)`  
  The maximum recursion depth is `n`, so the call stack grows linearly with `n`.

---

## 8. Conclusion

Both iterative and recursive methods are important for learning programming concepts.

- **Iterative approach** is preferred for performance and real-world applications.
- **Recursive approach** is useful for understanding recursion and mathematical problem-solving.

Understanding both methods helps students choose the right approach based on the problem requirements.

For further reading, refer to: [Fibonacci and Recurrences (Cornell CS2110)](https://www.cs.cornell.edu/courses/cs2110/2016sp/L26-Recurrences/cs2110Fibonacci.pdf)

---