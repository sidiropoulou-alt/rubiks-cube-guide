/* Small helpers to draw cube faces, an unfolded cube net and algorithm chips. */

const FACE_NAMES = { R: "right", L: "left", U: "top", T: "top", F: "front", B: "back", D: "down" };

/* Draw one 3x3 face. `s` is 9 colour letters: w y g b r o x (x = don't care). */
function drawFace(target, s, highlight) {
  const el = typeof target === "string" ? document.querySelector(target) : target;
  if (!el) return;
  const hl = highlight || [];
  el.innerHTML = "";
  for (let i = 0; i < 9; i++) {
    const d = document.createElement("div");
    d.className = "st " + (s[i] || "x");
    if (hl.includes(i)) d.classList.add("hl");
    el.appendChild(d);
  }
}

/* Draw the unfolded net: rows 0-2 = U, row 3-5 = L F R B, rows 6-8 = D. */
function drawNet(target, faces, highlight) {
  const el = typeof target === "string" ? document.querySelector(target) : target;
  if (!el) return;
  const layout = [];
  for (let r = 0; r < 9; r++) for (let c = 0; c < 12; c++) layout.push(null);
  const put = (face, r0, c0) => {
    const s = faces[face] || "xxxxxxxxx";
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) layout[(r0 + r) * 12 + (c0 + c)] = { f: face, i: r * 3 + c, ch: s[r * 3 + c] };
  };
  put("U", 0, 3); put("L", 3, 0); put("F", 3, 3); put("R", 3, 6); put("B", 3, 9); put("D", 6, 3);
  el.innerHTML = "";
  const hl = highlight || [];
  layout.forEach((cell) => {
    const d = document.createElement("div");
    if (!cell) { d.className = "st empty"; }
    else {
      d.className = "st " + (cell.ch || "x");
      if (hl.includes(cell.f + cell.i)) d.classList.add("hl");
    }
    el.appendChild(d);
  });
}

/* Draw an algorithm as chips. `alg` = "R U' R'" (U2 or T2 = double turn). */
function drawAlg(target, alg) {
  const el = typeof target === "string" ? document.querySelector(target) : target;
  if (!el) return;
  el.innerHTML = "";
  alg.split(/\s+/).filter(Boolean).forEach((raw) => {
    const m = raw.match(/^([RLUTFBD])(['1]|2)?$/i);
    const letter = (m ? m[1] : raw[0]).toUpperCase();
    const mod = m && m[2] ? m[2] : "";
    const isPrime = mod === "'" || mod === "1";
    const isDouble = mod === "2";
    const chip = document.createElement("span");
    chip.className = "mv" + (isPrime ? " prime" : "") + (isDouble ? " dbl" : "");
    const shown = letter === "U" ? "T" : letter;
    const note = FACE_NAMES[letter] + (isDouble ? " twice" : isPrime ? " reverse" : "");
    chip.innerHTML = shown + (isPrime ? "<small>1</small>" : isDouble ? "<small>2</small>" : "<small>&nbsp;</small>");
    chip.title = shown + mod + " — " + note;
    const wrap = document.createElement("span");
    wrap.className = "arrow";
    wrap.textContent = " ";
    el.appendChild(chip);
    el.appendChild(wrap);
  });
  const last = el.lastChild;
  if (last) last.remove();
}

/* Mark the current page in the top navigation. */
function markNav() {
  const here = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("header.top nav a").forEach((a) => {
    if (a.getAttribute("href") === here) a.classList.add("active");
  });
}

document.addEventListener("DOMContentLoaded", markNav);
