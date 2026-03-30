// ----------------------------- Utility helpers -----------------------------
function $(id) {
  return document.getElementById(id);
}

function createElem(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined) el.textContent = text;
  return el;
}

// Clamp n for safe visuals
function clampN(value, max) {
  const n = Number(value);
  if (Number.isNaN(n) || n < 0) return 0;
  return Math.min(n, max);
}

// ----------------------------- Top-level elements -----------------------------
const modeSelection = document.getElementById('modeSelection');
const mainContainer = document.getElementById('mainContainer');
const modeButtons = document.querySelectorAll('.modeBtn');
const backToModeSelectionBtn = document.getElementById('backToModeSelection');
const codeSection = document.getElementById('codeSection');
const codeRecTree = document.getElementById("codeRecTree");

// ----------------------------- Code Walkthrough: shared state -----------------------------
const codeNInput = $('codeN');
const codeSpeedSelect = $('codeSpeed');
const codePlayPauseBtn = $('codePlayPause');
const codeNextBtn = $('codeNext');
const codeResetBtn = $('codeReset');
const codeStepLabel = $('codeStepLabel');
const codeExplanation = $('codeExplanation');

const iterativeCodePre = $('iterativeCode');
const recursiveCodePre = $('recursiveCode');

const iterativeStateBox = $('iterativeState');
const recursiveStateBox = $('recursiveState');

const itVarN = $('itVarN');
const itVarI = $('itVarI');
const itVarPrev = $('itVarPrev');
const itVarCurr = $('itVarCurr');
const itVarNext = $('itVarNext');
const itIterations = $('itIterations');
const itResult = $('itResult');

const stackContainer = $('stackContainer');
const recDepthSpan = $('recDepth');
const recMaxHeightSpan = $('recMaxHeight');
const recCallsCodeSpan = $('recCallsCode');
const recTimeComplexity = $('recTimeComplexity');

let codeMode = 'iterative'; // 'iterative' or 'recursive'
let codeTimer = null;
let codeSpeed = Number(codeSpeedSelect.value);

// ----------------------------- Mode Selection Handling -----------------------------
modeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const mode = btn.dataset.mode;
    modeSelection.style.display = 'none';
    mainContainer.style.display = 'flex';
    codeSection.style.display = 'flex';

    // Set the code mode based on selection
    codeMode = mode;

    if (mode === 'iterative') {
      $('codeWalkthroughTitle').textContent = 'Iterative Fibonacci';
      iterativeCodePre.classList.add('active');
      recursiveCodePre.classList.remove('active');
      iterativeStateBox.classList.add('active');
      recursiveStateBox.classList.remove('active');
      $('stack-container').hidden = true;
      $('iterArrayContainer').style.display = 'block';

      for (const el of document.getElementsByClassName('code-rec-state')) {
        el.hidden = true;
      }

      $('info-code').innerText = "Keep n ≤ 15 for iterative approach.";
      $('code-area-div').style.minHeight = '250px';
      $('code-area-div').classList.remove('recursive-mode');
      const codeStateRow = document.getElementById('code-state-row');
      if (codeStateRow) codeStateRow.classList.remove('recursion-mode');
      // Remove references to explanation side divs (no longer present)
      // Move explanation text back to main area if needed (no-op now)
      codeNInput.max = 15;
      codeNInput.value = 5;
      resetIterativeCode();
    } else {
      $('codeWalkthroughTitle').textContent = 'Recursive Fibonacci';
      iterativeCodePre.classList.remove('active');
      recursiveCodePre.classList.add('active');
      iterativeStateBox.classList.remove('active');
      recursiveStateBox.classList.add('active');
      $('stack-container').hidden = false;
      $('iterArrayContainer').style.display = 'none';

      for (const el of document.getElementsByClassName('code-rec-state')) {
        el.hidden = false;
      }

      $('info-code').innerText = "Keep n ≤ 5 for recursive approach.";
      $('code-area-div').style.minHeight = '80px';
      $('code-area-div').classList.add('recursive-mode');
      const codeStateRow = document.getElementById('code-state-row');
      if (codeStateRow) codeStateRow.classList.add('recursion-mode');
      // Remove references to explanation side divs (no longer present)
      codeNInput.max = 5;
      codeNInput.value = 5;
      resetRecursiveCode();
    }

    $('codePlayPause').hidden = false;
    $('codeNext').hidden = false;
  });
});

backToModeSelectionBtn.addEventListener('click', () => {
  mainContainer.style.display = 'none';
  modeSelection.style.display = 'flex';

  // Reset any running animations
  if (codeTimer) {
    clearInterval(codeTimer);
    codeTimer = null;
    codePlayPauseBtn.textContent = 'Play';
  }
});

// ----------------------------- Input Validation -----------------------------
function validateNInput(inputEl, mode) {
  const rawValue = inputEl.value.trim();
  const n = Number(rawValue);

  if (rawValue === "") {
    alert("Input cannot be empty.");
    inputEl.value = 0;
    return null;
  }

  if (Number.isNaN(n)) {
    alert("Please enter a valid number.");
    inputEl.value = 0;
    return null;
  }

  if (n < 0) {
    alert("Value must be non-negative (0 or greater).");
    inputEl.value = 0;
    return null;
  }

  if (mode === "iterative" && n > 15) {
    alert("Maximum allowed value is 15.");
    inputEl.value = 15;
    return 15;
  }

  if (mode === "recursive" && n > 5) {
    alert("Maximum allowed value is 5.");
    inputEl.value = 5;
    return 5;
  }

  return n;
}

// ----------------------------- Code Block Preparation -----------------------------
function prepareCodeBlock(preElement) {
  const raw = preElement.textContent
    .replace(/\n$/, '')
    .replace(/^\n/, '');

  const lines = raw.split('\n');
  preElement.innerHTML = '';

  lines.forEach(line => {
    const span = document.createElement('span');
    span.className = 'code-line';

    if (line.trim().startsWith('//')) {
      span.classList.add('comment');
    }

    span.textContent = line || ' ';
    preElement.appendChild(span);
  });
}

prepareCodeBlock(iterativeCodePre);
prepareCodeBlock(recursiveCodePre);

function clearActiveLines(preElement) {
  preElement
    .querySelectorAll('.code-line.active')
    .forEach(line => line.classList.remove('active'));
}

function highlightLine(preElement, index) {
  const lines = preElement.querySelectorAll('.code-line');
  clearActiveLines(preElement);
  // Remove any previous inline explanation
  preElement.querySelectorAll('.inline-explanation').forEach(e => e.remove());
  if (index >= 0 && index < lines.length) {
    const line = lines[index];
    line.classList.add('active');

    line.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest'
    });
  }
}

// Insert inline explanation after a code line
function insertInlineExplanation(preElement, index, text) {
  const lines = preElement.querySelectorAll('.code-line');
  if (index >= 0 && index < lines.length && text && text.trim()) {
    // Remove any previous inline explanation
    preElement.querySelectorAll('.inline-explanation').forEach(e => e.remove());
    const explanation = document.createElement('span');
    explanation.className = 'inline-explanation';
    explanation.textContent = text;
    // Insert explanation as a sibling, in the same line
    lines[index].appendChild(explanation);
  }
}

// ----------------------------- Code Walkthrough: Iterative simulation -----------------------------
let itSteps = [];
let itIndex = 0;

function buildIterativeCodeSteps(n) {
  const steps = [];
  const add = (line, vars, explanation) =>
    steps.push({ line, vars: { ...vars }, explanation });

  let vars = {
    n,
    i: null,
    prev: null,
    curr: null,
    next: null,
    iterations: 0,
    result: null
  };

  // 1. Function entry
  add(0, vars, 'Call F(n)');

  // 2. if condition check
  add(1, vars, 'Evaluate n <= 1');

  // 3. Branch decision
  if (n <= 1) {
    vars.result = n;
    add(2, vars, 'Return n');
    return steps;
  }

  // 4. Continue execution
  vars.prev = 0;
  add(3, vars, 'Initialize prev = 0');

  vars.curr = 1;
  add(4, vars, 'Initialize curr = 1');

  vars.next = null;
  add(5, vars, 'Declare next');

  for (let i = 2; i <= n; i++) {
    vars.i = i;
    add(6, vars, 'Loop condition i = ' + i);

    vars.next = vars.prev + vars.curr;
    add(7, vars, 'Compute next = ' + vars.prev + ' + ' + (vars.curr - vars.prev + vars.prev) + ' = ' + vars.next);

    vars.prev = vars.curr;
    add(8, vars, 'Update prev = ' + vars.prev);

    vars.curr = vars.next;
    vars.iterations++;
    add(9, vars, 'Update curr = ' + vars.curr);
  }

  vars.result = vars.curr;
  add(11, vars, 'Return curr = ' + vars.result);

  return steps;
}

function updateValue(el, newValue) {
  if (!el) return;

  const prev = el.textContent;
  const next = newValue ?? '-';

  if (prev !== String(next)) {
    el.textContent = next;

    el.classList.remove('flash-change');
    void el.offsetWidth;
    el.classList.add('flash-change');

    const row = el.closest('tr');
    if (row) {
      const nameSpan = row.querySelector('.var-name');
      if (nameSpan) {
        nameSpan.classList.remove('flash-change');
        void nameSpan.offsetWidth;
        nameSpan.classList.add('flash-change');
      }
    }
  }
}

function renderIterativeCodeStep(stepObj) {
  highlightLine(iterativeCodePre, stepObj.line);

  const v = stepObj.vars;

  updateValue(itVarN, v.n);
  updateValue(itVarI, v.i);
  updateValue(itVarPrev, v.prev);
  updateValue(itVarCurr, v.curr);
  updateValue(itVarNext, v.next);
  itIterations.textContent = v.iterations;
  updateValue(itResult, v.result);

  codeExplanation.textContent = stepObj.explanation;
  // Also update side explanation if present (clear it in iterative mode)
  const codeExplanationSide = document.getElementById('codeExplanationSide');
  if (codeExplanationSide) codeExplanationSide.textContent = '';
  codeStepLabel.textContent = String(itIndex);

  // Render animated array for iterative code walkthrough
  renderIterativeArray(v);
}

// Render animated Fibonacci array for iterative code walkthrough
function renderIterativeArray(vars) {
  const codeIterArray = $('codeIterArray');
  if (!codeIterArray) return;

  codeIterArray.innerHTML = '';

  const n = vars.n;
  const currentI = vars.i;
  const fibValues = [];

  // Calculate Fibonacci values up to current iteration
  if (n >= 0) fibValues.push(0);
  if (n >= 1) fibValues.push(1);

  // Add computed values based on iterations
  for (let i = 2; i <= Math.min(currentI || 1, n); i++) {
    fibValues.push(fibValues[i - 1] + fibValues[i - 2]);
  }

  // Render cells
  fibValues.forEach((val, idx) => {
    const cell = createElem('div', 'fib-cell');
    const indexSpan = createElem('div', 'index', 'F(' + idx + ')');
    const valueSpan = createElem('div', 'value', String(val));
    cell.appendChild(indexSpan);
    cell.appendChild(valueSpan);

    // Highlight current position
    if (currentI !== null && idx === currentI) {
      cell.classList.add('current');
    }

    codeIterArray.appendChild(cell);

    // Trigger animation
    requestAnimationFrame(() => {
      cell.classList.add('visible');
    });
  });
}

// ----------------------------- Code Walkthrough: Recursive simulation -----------------------------
let recStepsCode = [];
let recIndexCode = 0;

function buildRecursiveCodeSteps(n) {
  const steps = [];
  let callIdCounter = 0;

  function record(line, stack, frameId, depth, explanation, extra) {
    extra = extra || {};
    steps.push({
      line: line,
      stack: stack.map(function (s) { return { id: s.id, n: s.n }; }),
      currentId: frameId,
      depth: depth,
      explanation: explanation,
      type: extra.type,
      n: extra.n,
      result: extra.result
    });
  }

  function visit(valueN, depth, stack) {
    const id = ++callIdCounter;
    const frame = { id: id, n: valueN };
    const newStack = stack.concat([frame]);

    record(0, newStack, id, depth, 'Call F(' + valueN + ')', {
      type: "call",
      n: valueN
    });

    record(1, newStack, id, depth, "Check if n <= 1", {
      type: "check",
      n: valueN
    });

    if (valueN <= 1) {
      record(2, newStack, id, depth, 'Return ' + valueN, {
        type: "returnBase",
        n: valueN,
        result: valueN
      });
      return { result: valueN };
    }

    record(4, newStack, id, depth, 'Call F(' + (valueN - 1) + ')', {
      type: "leftCall"
    });

    const left = visit(valueN - 1, depth + 1, newStack);

    record(5, newStack, id, depth, 'Call F(' + (valueN - 2) + ')', {
      type: "rightCall"
    });

    const right = visit(valueN - 2, depth + 1, newStack);

    const result = left.result + right.result;

    record(7, newStack, id, depth, 'Return ' + result, {
      type: "return",
      n: valueN,
      result: result
    });

    return { result: result };
  }

  visit(n, 0, []);
  return steps;
}

function renderStack(stack, currentId) {
  stackContainer.innerHTML = '';
  stack.forEach(function (frame) {
    const div = createElem('div', 'stackFrame');
    if (frame.id === currentId) div.classList.add('current');
    div.appendChild(createElem('span', null, 'F(' + frame.n + ')'));
    div.appendChild(createElem('span', null, 'id: ' + frame.id));
    stackContainer.appendChild(div);
  });
}

function renderRecursiveCodeStep(stepObj) {
  highlightLine(recursiveCodePre, stepObj.line || 0);
  // Show explanation inline in code area (recursion mode)
  insertInlineExplanation(recursiveCodePre, stepObj.line || 0, stepObj.explanation);
  renderStack(stepObj.stack || [], stepObj.currentId);

  recDepthSpan.textContent = stepObj.depth != null ? stepObj.depth : 0;

  let maxDepth = 0;
  for (let i = 0; i < recStepsCode.length; i++) {
    if (recStepsCode[i].depth != null && recStepsCode[i].depth > maxDepth) {
      maxDepth = recStepsCode[i].depth;
    }
  }

  recMaxHeightSpan.textContent = String(maxDepth + 1);

  let callCount = 0;
  for (let i = 0; i < recStepsCode.length; i++) {
    if (recStepsCode[i].type === "call") callCount++;
  }
  recCallsCodeSpan.textContent = String(callCount);

  recTimeComplexity.textContent = "O(2^n)";
  // Show explanation in the side panel in recursion mode
  const codeExplanationSide = document.getElementById('codeExplanationSide');
  if (codeExplanationSide) {
    codeExplanationSide.textContent = stepObj.note || "";
    codeExplanation.textContent = '';
  } else {
    codeExplanation.textContent = stepObj.note || "";
  }
  codeStepLabel.textContent = String(recIndexCode);

  renderCodeRecursiveTree(
    recStepsCode.slice(0, recIndexCode + 1),
    recStepsCode[recIndexCode]
  );
}

// ----------------------------- SVG Tree Renderer -----------------------------
function renderCodeRecursiveTree(steps, currentStep) {
  codeRecTree.innerHTML = "";

  const nodeMap = new Map();
  let root = null;

  steps.forEach(function (step) {
    if (step.type === "call") {
      const node = {
        id: step.currentId,
        n: step.n,
        depth: step.depth,
        value: null,
        children: [],
        subtreeWidth: 1,
        x: 0,
        y: 0
      };

      nodeMap.set(node.id, node);

      if (step.stack.length > 1) {
        const parentId = step.stack[step.stack.length - 2].id;
        const parent = nodeMap.get(parentId);
        if (parent) parent.children.push(node);
      } else {
        root = node;
      }
    }

    if (step.type === "return" || step.type === "returnBase") {
      const node = nodeMap.get(step.currentId);
      if (node) node.value = step.result;
    }
  });

  if (!root) return;

  function computeWidth(node) {
    if (node.children.length === 0) {
      node.subtreeWidth = 1;
      return 1;
    }
    let total = 0;
    node.children.forEach(function (child) {
      total += computeWidth(child);
    });
    node.subtreeWidth = total;
    return total;
  }
  computeWidth(root);

  const X_GAP = 64;
  const Y_GAP = 74;

  function assignPos(node, depth, startX) {
    const width = node.subtreeWidth * X_GAP;
    node.x = startX + width / 2;
    node.y = depth * Y_GAP + 40;

    let currX = startX;
    node.children.forEach(function (child) {
      const childWidth = child.subtreeWidth * X_GAP;
      assignPos(child, depth + 1, currX);
      currX += childWidth;
    });
  }
  assignPos(root, 0, 0);

  let maxDepth = 0;
  nodeMap.forEach(function (node) {
    if (node.depth > maxDepth) maxDepth = node.depth;
  });

  const svgWidth = root.subtreeWidth * X_GAP + 80;
  const svgHeight = (maxDepth + 1) * Y_GAP + 80;

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", svgWidth);
  svg.setAttribute("height", svgHeight);
  svg.setAttribute("viewBox", "0 0 " + svgWidth + " " + svgHeight);

  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
  marker.setAttribute("id", "arrowCode");
  marker.setAttribute("markerWidth", "10");
  marker.setAttribute("markerHeight", "10");
  marker.setAttribute("refX", "6");
  marker.setAttribute("refY", "3");
  marker.setAttribute("orient", "auto");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M0,0 L6,3 L0,6 Z");
  path.setAttribute("fill", "#333");
  marker.appendChild(path);
  defs.appendChild(marker);
  svg.appendChild(defs);

  // Draw edges
  nodeMap.forEach(function (node) {
    node.children.forEach(function (child) {
      const line = document.createElementNS(svg.namespaceURI, "line");
      line.setAttribute("x1", node.x + 40);
      line.setAttribute("y1", node.y);
      line.setAttribute("x2", child.x + 40);
      line.setAttribute("y2", child.y);
      line.setAttribute("stroke", "#333");
      line.setAttribute("marker-end", "url(#arrowCode)");
      svg.appendChild(line);
    });
  });

  function getNodeRadius(n) {
    const MIN_R = 20;
    const MAX_R = 40;
    const MAX_N = 5;
    const clampedN = Math.min(Math.max(n, 0), MAX_N);
    const t = 1 - clampedN / MAX_N;
    return MIN_R + t * (MAX_R - MIN_R);
  }

  const radius = getNodeRadius(codeNInput.value);

  // Draw nodes
  let currentNodeY = null;
  nodeMap.forEach(function (node) {
    const cx = node.x + 40;
    const isCurrentNode = currentStep && node.id === currentStep.currentId;

    const circle = document.createElementNS(svg.namespaceURI, "circle");
    circle.setAttribute("cx", cx);
    circle.setAttribute("cy", node.y);
    circle.setAttribute("r", radius);
    circle.setAttribute(
      "fill",
      node.value !== null ? "#e6f6ea" : "#eef6ff"
    );
    circle.setAttribute("stroke", isCurrentNode ? "#ff6b6b" : "#333");
    circle.setAttribute("stroke-width", isCurrentNode ? "2.5" : "1");
    svg.appendChild(circle);

    if (isCurrentNode) {
      currentNodeY = node.y;
    }

    const text = document.createElementNS(svg.namespaceURI, "text");
    text.setAttribute("x", cx);
    text.setAttribute("y", node.y + 4);
    text.setAttribute("text-anchor", "middle");

    const fontSize = Math.max(8, radius * 0.55);
    text.setAttribute("font-size", fontSize);
    text.setAttribute("font-weight", "600");

    text.textContent =
      node.value !== null
        ? "F(" + node.n + ")=" + node.value
        : "F(" + node.n + ")";

    svg.appendChild(text);
  });

  const wrapper = document.createElement("div");
  wrapper.style.display = "flex";
  wrapper.style.justifyContent = "center";
  wrapper.appendChild(svg);

  codeRecTree.appendChild(wrapper);

  if (currentNodeY !== null) {
    setTimeout(function () {
      const containerHeight = codeRecTree.clientHeight;
      const scrollTarget = currentNodeY - containerHeight / 2 + 40;

      codeRecTree.scrollTo({
        top: Math.max(0, scrollTarget),
        behavior: 'smooth'
      });
    }, 50);
  }
}

// ----------------------------- Code Walkthrough: control logic -----------------------------
function updateCodeSpeed() {
  codeSpeed = Number(codeSpeedSelect.value);
  if (codeTimer) {
    clearInterval(codeTimer);
    codeTimer = setInterval(handleCodeAutoStep, codeSpeed);
  }
}

function handleCodeAutoStep() {
  if (codeMode === 'iterative') {
    if (itIndex < itSteps.length - 1) {
      itIndex++;
      renderIterativeCodeStep(itSteps[itIndex]);
    } else {
      finishCodeAuto();
    }
  } else {
    if (recIndexCode < recStepsCode.length - 1) {
      recIndexCode++;
      renderRecursiveCodeStep(recStepsCode[recIndexCode]);
    } else {
      finishCodeAuto();
    }
  }
}

function startCodeAuto() {
  if (codeTimer) return;
  codeTimer = setInterval(handleCodeAutoStep, codeSpeed);
  codePlayPauseBtn.textContent = 'Pause';
}

function pauseCodeAuto() {
  if (codeTimer) {
    clearInterval(codeTimer);
    codeTimer = null;
    codePlayPauseBtn.textContent = 'Play';
  }
}

function finishCodeAuto() {
  pauseCodeAuto();
  $('codePlayPause').hidden = true;
  $('codeNext').hidden = true;
}

codeSpeedSelect.addEventListener('change', updateCodeSpeed);

codePlayPauseBtn.addEventListener('click', function () {
  if (codeTimer) {
    pauseCodeAuto();
  } else {
    startCodeAuto();
  }
});

codeNextBtn.addEventListener('click', function () {
  if (codeMode === 'iterative') {
    if (itIndex < itSteps.length - 1) {
      itIndex++;
      renderIterativeCodeStep(itSteps[itIndex]);
    } else {
      finishCodeAuto();
    }
  } else {
    if (recIndexCode < recStepsCode.length - 1) {
      recIndexCode++;
      renderRecursiveCodeStep(recStepsCode[recIndexCode]);
    } else {
      finishCodeAuto();
    }
  }
});

codeResetBtn.addEventListener('click', function () {
  pauseCodeAuto();
  $('codePlayPause').hidden = false;
  $('codeNext').hidden = false;

  codeNInput.value = 5;

  if (codeMode === 'iterative') {
    resetIterativeCode();
  } else {
    resetRecursiveCode();
  }
});

// When n changes in code walkthrough
codeNInput.addEventListener('change', function () {
  const n = validateNInput(codeNInput, codeMode);
  if (n === null) return;

  pauseCodeAuto();
  $('codePlayPause').hidden = false;
  $('codeNext').hidden = false;

  if (codeMode === 'iterative') {
    resetIterativeCode();
  } else {
    resetRecursiveCode();
  }
});

// ----------------------------- Code: reset helpers -----------------------------
function resetIterativeCode() {
  const n = clampN(codeNInput.value, 15);
  codeNInput.value = n;
  itSteps = buildIterativeCodeSteps(n);
  itIndex = 0;

  $('codePlayPause').hidden = false;
  $('codeNext').hidden = false;

  if (itSteps.length > 0) {
    renderIterativeCodeStep(itSteps[0]);
  }
}

function resetRecursiveCode() {
  const n = clampN(codeNInput.value, 5);
  codeNInput.value = n;

  recStepsCode = buildRecursiveCodeSteps(n);
  recIndexCode = 0;

  $('codePlayPause').hidden = false;
  $('codeNext').hidden = false;

  if (!recStepsCode.length) return;

  renderRecursiveCodeStep(recStepsCode[0]);
}

// ----------------------------- Initial bootstrapping -----------------------------
(function init() {
  // Hide code section initially (will show on mode selection)
  codeSection.style.display = 'none';
  // Hide iterative array container initially
  $('iterArrayContainer').style.display = 'none';

  // Initialize the default mode's code and state so that highlight, values, and node are shown on first open after mode selection
  if (codeMode === 'iterative') {
    resetIterativeCode();
  } else {
    resetRecursiveCode();
  }
})();
