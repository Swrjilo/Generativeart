// Example sketches with p5.js
new p5((p) => {
  let rings = 6;   
  let slices = 70; 
  let grid = [];
  let t = 0;

  let ringAngles = [];
  let ringTargets = [];
  let inhaleTriggered = false;
  let exhaleTriggered = false;

  p.setup = () => {
    let container = document.getElementById("art1");
    p.createCanvas(container.offsetWidth, container.offsetHeight).parent(container);
    p.colorMode(p.HSB, 360, 100, 100, 100);
    generateLabyrinth();

    for (let r = 0; r < rings; r++) {
      ringAngles[r] = 0;
      ringTargets[r] = 0;
    }

    window.addEventListener("resize", onResize);
  };

  function onResize() {
    const c = document.getElementById("art1");
    p.resizeCanvas(c ? c.offsetWidth : p.windowWidth, c ? c.offsetHeight : p.windowHeight);
    generateLabyrinth();
  }

  p.draw = () => {
    t += 0.015;

    let breathPhase = Math.sin(t * 1.3);

    if (breathPhase > 0.95 && !inhaleTriggered) {
      randomizeRingTargets(false); 
      inhaleTriggered = true;
    }
    if (breathPhase < 0.8) inhaleTriggered = false;

    if (breathPhase < -0.95 && !exhaleTriggered) {
      randomizeRingTargets(true); 
      exhaleTriggered = true;
    }
    if (breathPhase > -0.8) exhaleTriggered = false;

    for (let r = 0; r < rings; r++) {
      ringAngles[r] = p.lerp(ringAngles[r], ringTargets[r], 0.05);
    }

    // 🌌 deeper background
    p.background(220, 40, 10);  
    p.translate(p.width / 2, p.height / 2);

    let breathBase = 1 + 0.15 * breathPhase;
    let breathNoise = 1 + (p.noise(t * 0.2) - 0.5) * 0.3;
    let breath = breathBase * breathNoise;

    let maxR = Math.min(p.width, p.height) * 0.45 * breath;
    let ringStep = maxR / rings;

    for (let r = 0; r < rings; r++) {
      let ripple = 1 + 0.05 * Math.sin(t * 2 - r * 0.6);
      let innerR = r * ringStep * ripple;
      let outerR = (r + 1) * ringStep * ripple;

      p.push();
      p.rotate(ringAngles[r]);

      for (let s = 0; s < slices; s++) {
        let a1 = (s / slices) * p.TWO_PI;
        let a2 = ((s + 1) / slices) * p.TWO_PI;

        let jx1 = (p.noise(r, s * 0.1, t * 0.8) - 0.5) * 3;
        let jy1 = (p.noise(r + 50, s * 0.1, t * 0.8) - 0.5) * 3;
        let jx2 = (p.noise(r, (s + 1) * 0.1, t * 0.8) - 0.5) * 3;
        let jy2 = (p.noise(r + 50, (s + 1) * 0.1, t * 0.8) - 0.5) * 3;

        if (grid[r][s] === 1) {
          let hue = (t * 40 + r * 30 + s * 2) % 360;
          // 🌈 deeper & richer
          p.fill(hue, 100, 65, 85);    
          p.stroke(hue, 100, 90, 50);  

          p.beginShape();
          p.vertex(innerR * Math.cos(a1) + jx1, innerR * Math.sin(a1) + jy1);
          p.vertex(outerR * Math.cos(a1) + jx1, outerR * Math.sin(a1) + jy1);
          p.vertex(outerR * Math.cos(a2) + jx2, outerR * Math.sin(a2) + jy2);
          p.vertex(innerR * Math.cos(a2) + jx2, innerR * Math.sin(a2) + jy2);
          p.endShape(p.CLOSE);
        } else {
          let hue = (t * 25 + r * 15) % 360;
          // 🌑 darker contrast fill
          p.fill(hue, 60, 25, 25);
          p.noStroke();

          p.beginShape();
          p.vertex(innerR * Math.cos(a1) + jx1, innerR * Math.sin(a1) + jy1);
          p.vertex(outerR * Math.cos(a1) + jx1, outerR * Math.sin(a1) + jy1);
          p.vertex(outerR * Math.cos(a2) + jx2, outerR * Math.sin(a2) + jy2);
          p.vertex(innerR * Math.cos(a2) + jx2, innerR * Math.sin(a2) + jy2);
          p.endShape(p.CLOSE);
        }
      }

      p.pop();
    }

    let corePulse = 1 + 0.25 * Math.sin(t * 1.5 + p.noise(t) * 2);
    p.noStroke();
    for (let g = 8; g > 0; g--) {
      p.fill((t * 80) % 360, 100, 80, 12);
      p.ellipse(0, 0, ringStep * g * 0.4 * corePulse);
    }
    p.fill((t * 80) % 360, 100, 90, 95);
    p.ellipse(0, 0, ringStep * 0.6 * corePulse);
  };

  function randomizeRingTargets(strong) {
    for (let r = 0; r < rings; r++) {
      let step = strong ? p.random(-40, 40) : p.random(-15, 15);
      ringTargets[r] += p.radians(step);
    }
  }

  function generateLabyrinth() {
    grid = [];
    for (let r = 0; r < rings; r++) {
      let row = [];
      for (let s = 0; s < slices; s++) {
        let prob = 0.3 + r * 0.05;
        row.push(Math.random() < prob ? 1 : 0);
      }
      grid.push(row);
    }
    for (let i = 0; i < slices; i++) {
      grid[0][i] = 0;
    }
  }
});




//art2
new p5((p) => {
  let c;
  let baseRadius;
  let divisions;
  let divAngle;
  let speed;

  p.setup = () => {
    let container = document.getElementById("art2");
    p.createCanvas(container.offsetWidth, container.offsetHeight).parent(container);
    p.colorMode(p.HSB, 360, 100, 100, 100);
    generatePattern();
  };

  function generatePattern() {
    // pick new random style parameters each refresh
    c = 0;                                          // reset cycle
    speed = p.random(0.005, 0.02);                  // how fast it evolves
    divisions = p.int(p.random(100, 200));          // number of divisions
    baseRadius = Math.min(p.width, p.height) * p.random(0.35, 0.45); // size
    divAngle = p.TWO_PI / divisions;
  }

  function mathf(x) {
    // smoothly evolving mapping
    return x * (1 + c) + Math.sin(x * 0.2 + c * 2) * 12;
  }

  function divPos(num, radius) {
    let x = Math.cos(divAngle * num) * radius;
    let y = Math.sin(divAngle * num) * radius;
    return p.createVector(x, y);
  }

  p.draw = () => {
    // pure white background
    p.background(0, 0, 100);
    p.translate(p.width / 2, p.height / 2);

    let radius = baseRadius;

    // outer steel ring
    p.noFill();
    p.stroke(0, 0, 15, 50);
    p.strokeWeight(1.8);
    p.circle(0, 0, radius * 2);

    // metallic web
    for (let i = 0; i < divisions; i++) {
      let x = i;
      let y = mathf(x);

      let startPos = divPos(x, radius);
      let endPos = divPos(y % divisions, radius);

      let shade = p.map(i, 0, divisions, 8, 25); // darker metallic tones
      p.stroke(shade, 5, 30, 80);
      p.strokeWeight(1);
      p.line(startPos.x, startPos.y, endPos.x, endPos.y);
    }

    // evolve c
    c += speed;

    // ✅ once a full cycle completes, refresh style
    if (c > p.TWO_PI) {
      generatePattern();
    }
  };
});


// background-art3.js
// Striped Noise Fields (instance mode, scroll reactive, auto-resize)
new p5((p) => {
  let minYchange = 0;
  let maxYchange = 120;
  let layers = 6;
  let rotStripe = 0;
  let lines = true;
  let alph = 180;
  let filling = true;
  let colorLines = false;
  let sw = 1.2;
  let extraBlackAlph = 255;

  let stripes = [];
  let scrollFactor = 0;

  // Example palettes (arrays of [r,g,b])
  const palettes = [
    // Bright Kingfisher
    [ [1,110,117], [205,2,5], [250,119,1], [0,200,216], [238,222,197] ],
    // Butterfly fish
    [ [39,41,50], [158,144,162], [231,226,71], [92,128,188], [233,237,222] ],
    // A tropical reef style
    [ [10,150,200], [200,80,120], [255,200,70], [80,220,160], [220,240,255] ]
  ];

  p.setup = function () {
    let container = document.getElementById("art3");
    p.createCanvas(container.offsetWidth, container.offsetHeight).parent(container);

    p.angleMode(p.DEGREES);
    p.frameRate(20);

    generateStripes();
    window.addEventListener("scroll", updateScrollFactor);
  };

  function generateStripes() {
    stripes = [];
    let end = p.height / 2 + 500;

    for (let i = 0; i < layers; i++) {
      let y1 = (i === 0) ? -p.height / 2 - 300 : -p.height / 2 + (p.height / layers) * i;
      let y2 = y1, y3 = y1, y4 = y1, y5 = y1, y6 = y1;

      let rotLayer = p.random(359);

      while ((y1 < end) && (y2 < end) && (y3 < end) && (y4 < end) && (y5 < end) && (y6 < end)) {
        y1 += p.random(minYchange, maxYchange);
        y2 += p.random(minYchange, maxYchange);
        y3 += p.random(minYchange, maxYchange);
        y4 += p.random(minYchange, maxYchange);
        y5 += p.random(minYchange, maxYchange);
        y6 += p.random(minYchange, maxYchange);

        // pick a random palette, then pick a random color from it
        let pal = palettes[Math.floor(p.random(palettes.length))];
        let col = pal[Math.floor(p.random(pal.length))];
        let [r, g, b] = col;

        stripes.push({
          baseY: [y1, y2, y3, y4, y5, y6],
          color: [r, g, b],
          rotLayer,
          seed: p.random(10000)
        });
      }
    }
  }

  p.draw = function () {
    p.background(0, 50);

    if (lines) {
      p.stroke(0, 0, 0, extraBlackAlph);
      p.strokeWeight(sw);
    } else {
      p.noStroke();
    }

    let amp = p.lerp(6, 40, scrollFactor);
    let speed = p.lerp(0.003, 0.03, scrollFactor);
    let colorAmp = p.lerp(10, 70, scrollFactor);

    p.push();
    p.translate(p.width / 2, p.height / 2);

    for (let s of stripes) {
      let n = p.noise(s.seed + p.frameCount * speed);
      let offset = p.map(n, 0, 1, -amp, amp);
      let ys = s.baseY.map(y => y + offset);

      // drift color a little within the same palette/tonal family
      let r = p.constrain(s.color[0] + p.map(p.noise(s.seed + 100 + p.frameCount * speed), 0, 1, -colorAmp * 0.5, colorAmp * 0.5), 0, 255);
      let g = p.constrain(s.color[1] + p.map(p.noise(s.seed + 200 + p.frameCount * speed), 0, 1, -colorAmp * 0.5, colorAmp * 0.5), 0, 255);
      let b = p.constrain(s.color[2] + p.map(p.noise(s.seed + 300 + p.frameCount * speed), 0, 1, -colorAmp * 0.5, colorAmp * 0.5), 0, 255);

      if (filling) p.fill(r, g, b, alph);
      else p.noFill();

      if (colorLines) p.stroke(r, g, b, alph);

      p.push();
      p.rotate(s.rotLayer + rotStripe);
      let xStart = -p.width / 2;
      p.beginShape();
      p.curveVertex(xStart - 300, p.height / 2 + 500);
      for (let i = 0; i < 6; i++) {
        p.curveVertex(xStart + (p.width / 5) * (i + 1), ys[i]);
      }
      p.curveVertex(p.width / 2 + 300, ys[5]);
      p.curveVertex(p.width / 2 + 300, p.height / 2 + 500);
      p.endShape(p.CLOSE);
      p.pop();
    }

    p.pop();
  };

  p.windowResized = function () {
    let container = document.getElementById("art3");
    p.resizeCanvas(container.offsetWidth, container.offsetHeight);
    generateStripes();
  };

  function updateScrollFactor() {
    let maxScroll = document.body.scrollHeight - window.innerHeight;
    scrollFactor = p.constrain(window.scrollY / (maxScroll * 0.3), 0, 1);
  }
});




//art4//
new p5((p) => {
  let maxDepth = 4;
  let t = 0;

  p.setup = () => {
    let container = document.getElementById("art4");
    p.createCanvas(container.offsetWidth, container.offsetHeight).parent(container);

    p.colorMode(p.HSB, 360, 100, 100, 100);
    p.noFill();
    p.strokeWeight(1.2);
    window.addEventListener("resize", onResize);
  };

  function onResize() {
    const c = document.getElementById("art4");
    p.resizeCanvas(c ? c.offsetWidth : p.windowWidth, c ? c.offsetHeight : p.windowHeight);
  }

  p.draw = () => {
    t += 0.02;

    // ✨ Clean white background
    p.background(0, 0, 100);

    p.translate(p.width / 2, p.height / 2);

    let baseRadius = Math.min(p.width, p.height) * 0.35;

    drawFractal(0, 0, baseRadius, maxDepth);

    // 🌀 Sacred geometry overlay (heartbeat + faint multi-hexagons)
    drawHeartbeatGeometry(Math.min(p.width, p.height) * 0.45);
  };

  function drawFractal(x, y, radius, depth) {
    if (depth <= 0 || radius < 5) return;

    // 🌈 Vibrant neon palette
    let hue = (t * 120 + depth * 90) % 360;
    let alpha = p.map(depth, 0, maxDepth, 50, 100);
    let bright = 65 + 30 * Math.sin(t * 1.2 + depth);

    // Glow effect
    for (let g = 4; g > 0; g--) {
      p.stroke(hue, 100, bright, alpha / (g * 1.8));
      p.ellipse(x, y, radius * 2 + g * 3);
    }

    // branching petals
    let branches = 6;
    for (let i = 0; i < branches; i++) {
      let angle = (p.TWO_PI / branches) * i + t * 0.35;

      let n = p.noise(x * 0.004, y * 0.004, t + depth);
      let offset = p.map(n, 0, 1, -radius * 0.2, radius * 0.2);

      let nx = x + (radius * 0.65 + offset) * p.cos(angle);
      let ny = y + (radius * 0.65 + offset) * p.sin(angle);

      drawFractal(nx, ny, radius * 0.5, depth - 1);
    }
  }

  function drawHeartbeatGeometry(r) {
    p.push();

    // ❤️ Heartbeat scaling + jitter
    let pulse = 1 + 0.18 * Math.sin(t * 6);
    let jitter = Math.sin(t * 6) * 2; // synced jitter
    p.translate(jitter, jitter * 0.6);

    // 🔷 Many faint hexagon layers
    let layers = 6; // more layers than before
    for (let i = 0; i < layers; i++) {
      let size = r * (1 - i * 0.15) * pulse;
      let rotation = t * (0.25 - i * 0.05); // different speeds
      p.push();
      p.rotate(rotation);
      p.stroke(280 - i * 20, 90, 90, 20 - i * 3); // faint hologram look
      drawPolygon(0, 0, size, 6);
      p.pop();
    }

    // 🟣 Concentric Circles
    p.stroke(200, 80, 70, 25);
    for (let i = 1; i <= 6; i++) {
      let rr = r * (i / 6) * pulse * (1.1 + 0.1 * Math.sin(t * 5 + i));
      p.ellipse(0, 0, rr * 2);
    }

    p.pop();
  }

  function drawPolygon(x, y, radius, npoints) {
    let angle = p.TWO_PI / npoints;
    p.beginShape();
    for (let a = 0; a < p.TWO_PI; a += angle) {
      let sx = x + p.cos(a) * radius;
      let sy = y + p.sin(a) * radius;
      p.vertex(sx, sy);
    }
    p.endShape(p.CLOSE);
  }
});




// background-art5-floral.js
// Abstract 3D-style floral layers — heartbeat + synchronized jitter
new p5((p) => {
  let layers = [];
  const NUM_LAYERS = 8;
  const RING_POINTS = 120;
  let colors = [
    { h: 0,   s: 90, b: 95 },   // red
    { h: 15,  s: 85, b: 90 },   // coral
    { h: 30,  s: 85, b: 95 },   // orange
    { h: 50,  s: 90, b: 100 },  // golden yellow
    { h: 95,  s: 65, b: 70 },   // moss green
    { h: 120, s: 70, b: 60 },   // forest green
    { h: 165, s: 90, b: 90 },   // emerald teal
    { h: 180, s: 80, b: 95 },   // cyan
    { h: 220, s: 90, b: 90 },   // blue
    { h: 270, s: 90, b: 90 },   // violet
    { h: 300, s: 90, b: 95 },   // magenta
    { h: 25,  s: 60, b: 55 },   // earthy brown
    { h: 45,  s: 20, b: 95 },   // cream
    { h: 0,   s: 0,  b: 20 },   // charcoal
    { h: 340, s: 80, b: 95 },   // pink
    { h: 20,  s: 90, b: 95 },   // warm red-orange
    { h: 60,  s: 80, b: 90 },   // lime yellow
    { h: 280, s: 90, b: 95 },   // purple-blue
    { h: 310, s: 90, b: 90 },   // neon magenta
    { h: 200, s: 80, b: 95 },   // sky blue
    { h: 240, s: 85, b: 95 },   // deep blue
    { h: 330, s: 80, b: 90 }    // rose violet
    
  ];

  let t = 0;
  let lastBeatFrame = 0;
  let nextLayerToRecolor = 0; // track which plate changes next

  p.setup = function () {
    let container = document.getElementById("art5");
    p.createCanvas(container.offsetWidth, container.offsetHeight).parent(container);
    p.colorMode(p.HSB, 360, 100, 100, 100);
    p.noFill();
    initLayers();
    window.addEventListener("resize", onResize);
  };

  function onResize() {
    const c = document.getElementById("art5");
    p.resizeCanvas(c ? c.offsetWidth : p.windowWidth, c ? c.offsetHeight : p.windowHeight);
    initLayers();
  }

  function initLayers() {
    layers = [];
    let maxR = Math.min(p.width, p.height) * 0.5;
    for (let i = 0; i < NUM_LAYERS; i++) {
      layers.push({
        radius: maxR * (1 - i * 0.1),
        noiseOffset: p.random(10, 1000),
        color: colors[Math.floor(p.random(colors.length))],
        shakeOffset: p.random(1000)
      });
    }
  }

  // ❤️ Heartbeat pulse (returns multiplier)
  function heartbeat(time) {
    let cycle = (time % 180) / 180.0;
    if (cycle < 0.15) return 1.15; // strong thump
    if (cycle < 0.3) return 1.07;  // softer thump
    return 1.0;
  }

  function recolorOneLayer() {
    let idx = nextLayerToRecolor % layers.length;
    layers[idx].color = colors[Math.floor(p.random(colors.length))];
    nextLayerToRecolor++;
  }

  p.draw = function () {
    t += 1;
    p.background(0, 0, 100); // white background

    p.translate(p.width / 2, p.height / 2);

    // get heartbeat each frame
    let hb = heartbeat(t);

    // if strong beat → recolor one layer at a time
    if (hb > 1.1 && t - lastBeatFrame > 20) {
      recolorOneLayer();
      lastBeatFrame = t;
    }

    for (let i = 0; i < layers.length; i++) {
      let lyr = layers[i];
      let r0 = lyr.radius;

      // ❤️ heartbeat affects only the topmost layer
      if (i === layers.length - 1) {
        r0 *= hb;
      }

      // ⚡ jitter with heartbeat scaling
      let intensity = p.map(hb, 1.0, 1.15, 2, 8);
      let dx = p.map(p.noise(lyr.shakeOffset, t * 0.15), 0, 1, -intensity, intensity);
      let dy = p.map(p.noise(lyr.shakeOffset + 200, t * 0.15), 0, 1, -intensity, intensity);

      // outline layer
      p.stroke(lyr.color.h, lyr.color.s, lyr.color.b, 90);
      p.strokeWeight(1.6);
      p.beginShape();
      for (let j = 0; j <= RING_POINTS; j++) {
        let angle = p.map(j, 0, RING_POINTS, 0, p.TWO_PI);
        let n = p.noise(
          lyr.noiseOffset + p.cos(angle * 2 + t * 0.005) * 0.5,
          lyr.noiseOffset + p.sin(angle * 3 - t * 0.004) * 0.5
        );
        let variation = p.map(n, 0, 1, -r0 * 0.15, r0 * 0.15);
        let rr = r0 + variation;
        let x = rr * p.cos(angle) + dx;
        let y = rr * p.sin(angle) + dy;
        p.curveVertex(x, y);
      }
      p.endShape(p.CLOSE);

      // translucent fill
      p.noStroke();
      p.fill(lyr.color.h, lyr.color.s, lyr.color.b, 30);
      p.beginShape();
      for (let j = 0; j <= RING_POINTS; j++) {
        let angle = p.map(j, 0, RING_POINTS, 0, p.TWO_PI);
        let n = p.noise(
          lyr.noiseOffset + p.cos(angle * 3 + t * 0.006),
          lyr.noiseOffset + p.sin(angle * 2 - t * 0.007)
        );
        let variation = p.map(n, 0, 1, -r0 * 0.12, +r0 * 0.12);
        let rr = r0 * 0.8 + variation;
        let x = rr * p.cos(angle) + dx;
        let y = rr * p.sin(angle) + dy;
        p.curveVertex(x, y);
      }
      p.endShape(p.CLOSE);
    }
  };
});




// background-fractal-orange.js
// Advanced fractal art — elegant orange bg + dark psychedelic object
new p5((p) => {
  let maxDepth = 4;
  let t = 0;

  p.setup = () => {
    let container = document.getElementById("art6"); 
    p.createCanvas(container.offsetWidth, container.offsetHeight).parent(container);
      
    p.colorMode(p.HSB, 360, 100, 100, 100);
    p.noFill();
    p.strokeWeight(1.2);
    window.addEventListener("resize", onResize);
  };

  function onResize() {
    const c = document.getElementById("art6");
    p.resizeCanvas(c ? c.offsetWidth : p.windowWidth, c ? c.offsetHeight : p.windowHeight);
  }

  p.draw = () => {
    t += 0.01;

    // 🏳️ White background
    p.background(0, 0, 100);

    p.translate(p.width / 2, p.height / 2);
    p.rotate(t * 0.1); // slow global spin

    let baseRadius = Math.min(p.width, p.height) * 0.35;

    drawFractal(0, 0, baseRadius, maxDepth);
  };

  function drawFractal(x, y, radius, depth) {
    if (depth <= 0 || radius < 5) return;

    let hue = (t * 80 + depth * 50) % 360;
    let alpha = p.map(depth, 0, maxDepth, 40, 90);
    let bright = 25 + 20 * Math.sin(t * 0.8 + depth);

    for (let g = 3; g > 0; g--) {
      p.stroke(hue, 90, bright, alpha / (g * 2));
      p.ellipse(x, y, radius * 2 + g * 4);
    }

    let branches = 6;
    for (let i = 0; i < branches; i++) {
      let angle = (p.TWO_PI / branches) * i + t * 0.3;
      let n = p.noise(x * 0.004, y * 0.004, t + depth);
      let offset = p.map(n, 0, 1, -radius * 0.18, radius * 0.18);

      let nx = x + (radius * 0.6 + offset) * p.cos(angle);
      let ny = y + (radius * 0.6 + offset) * p.sin(angle);

      drawFractal(nx, ny, radius * 0.5, depth - 1);
    }
  }
});




//art7//
// background-art7.js
// Vibrant Guilloche Pattern with Faster Motion & Deep Colors

new p5((p) => {
  let steps = 1200;
  let baseRadius;
  let time = 0;

  // deep vibrant palette
  let palette = [
    [210, 100, 100], // electric blue
    [150, 100, 90],  // deep green
    [280, 100, 100], // royal violet
    [330, 100, 100], // neon magenta
    [45, 100, 100]   // golden yellow
  ];

  p.setup = function () {
    let container = document.getElementById("art7");
    p.createCanvas(container.offsetWidth, container.offsetHeight).parent(container);
    p.colorMode(p.HSB, 360, 100, 100, 100);
    baseRadius = Math.min(p.width, p.height) * 0.4;
  };

  p.draw = function () {
    p.background(0, 0, 100); // white background
    p.translate(p.width / 2, p.height / 2);

    // outer animated layers
    for (let l = 0; l < 6; l++) {
      let rFactor = baseRadius * (1 - l * 0.12);
      let freq1 = 6 + l * 2;
      let freq2 = 10 + l * 3;

      // deeper vibrant color with strong opacity
      let col = palette[(l + Math.floor(time * 0.4)) % palette.length];
      p.stroke(col[0], col[1], col[2], 95);
      p.strokeWeight(1);
      p.noFill();

      p.beginShape();
      for (let i = 0; i <= steps; i++) {
        let t = p.map(i, 0, steps, 0, p.TWO_PI);
        let r =
          rFactor *
          (1 +
            0.25 * p.sin(freq1 * t + time * 1.2) +
            0.2 * p.cos(freq2 * t + time * 0.9));
        let x = r * p.cos(t);
        let y = r * p.sin(t);
        p.vertex(x, y);
      }
      p.endShape(p.CLOSE);
    }

    // center rosette (clean & crisp)
    drawInnerRosette(baseRadius * 0.3, 30, 45);

    time += 0.015; // faster speed
  };

  function drawInnerRosette(rFactor, freq1, freq2) {
    let col = palette[Math.floor(time * 0.4) % palette.length];
    p.stroke(col[0], col[1], col[2], 95);
    p.strokeWeight(1.1);
    p.noFill();

    p.beginShape();
    for (let i = 0; i <= steps; i++) {
      let t = p.map(i, 0, steps, 0, p.TWO_PI);
      let r =
        rFactor *
        (1 +
          0.5 * p.sin(freq1 * t + time * 1.3) +
          0.4 * p.cos(freq2 * t + time * 1.1));
      let x = r * p.cos(t);
      let y = r * p.sin(t);
      p.vertex(x, y);
    }
    p.endShape(p.CLOSE);
  }

  p.windowResized = function () {
    let container = document.getElementById("art7");
    p.resizeCanvas(container.offsetWidth, container.offsetHeight);
    baseRadius = Math.min(p.width, p.height) * 0.4;
  };
});



//art8//
// background-art8-alien.js
// Alien Planet Landscape — Parallax Terrain Motion, Gradient Sky, Fog

new p5((p) => {
  const TERRAIN_LAYERS = 10;
  const NOISE_SCALE = 0.003;
  const HEIGHT = 220;
  let offsets = [];
  let skyGradient;
  let time = 0; // global animation time

  p.setup = function () {
    let container = document.getElementById("art8");
    p.createCanvas(container.offsetWidth, container.offsetHeight).parent(container);
    p.colorMode(p.HSB, 360, 100, 100, 100);
    p.noFill();

    initOffsets();
    skyGradient = createSkyGradient();
  };

  p.draw = function () {
    // sky background
    p.background(0);
    p.image(skyGradient, 0, 0, p.width, p.height);

    // terrain + fog
    drawAlienTerrain();
    drawFog();

    // advance time
    time += 0.004;
  };

  p.windowResized = function () {
    let container = document.getElementById("art8");
    p.resizeCanvas(container.offsetWidth, container.offsetHeight);
    initOffsets();
    skyGradient = createSkyGradient();
  };

  function initOffsets() {
    offsets = [];
    for (let i = 0; i < TERRAIN_LAYERS; i++) {
      offsets.push(p.random(1000));
    }
  }

  function createSkyGradient() {
    let gfx = p.createGraphics(p.width, p.height);
    gfx.colorMode(p.HSB, 360, 100, 100, 100);
    for (let y = 0; y < gfx.height; y++) {
      let t = p.map(y, 0, gfx.height, 0, 1);
      let h = p.lerp(180, 320, t); // cyan → pink
      let s = p.lerp(40, 70, t);
      let b = p.lerp(95, 80, t);
      gfx.stroke(h, s, b);
      gfx.line(0, y, gfx.width, y);
    }
    return gfx;
  }

  function drawAlienTerrain() {
    for (let i = 0; i < TERRAIN_LAYERS; i++) {
      let yBase = p.height * 0.5 + i * 30;

      // closer layers move more
      let depthFactor = p.map(i, 0, TERRAIN_LAYERS - 1, 0.3, 1.2);
      let hue = (220 + i * 10) % 360;

      // fill body
      p.beginShape();
      p.noStroke();
      p.fill(hue, 50, 20 + i * 5, 90);
      for (let x = 0; x <= p.width; x += 8) {
        let n = p.noise(
          x * NOISE_SCALE + time * 0.6 * depthFactor,
          offsets[i] + i * 20,
          time * 0.4 * depthFactor
        );
        let h = n * HEIGHT * depthFactor;
        let y = yBase - h;
        p.vertex(x, y);
      }
      p.vertex(p.width, p.height);
      p.vertex(0, p.height);
      p.endShape(p.CLOSE);

      // glowing ridge stroke
      p.stroke(hue, 60, 95, p.map(i, 0, TERRAIN_LAYERS - 1, 90, 30));
      p.noFill();
      p.beginShape();
      for (let x = 0; x <= p.width; x += 8) {
        let n = p.noise(
          x * NOISE_SCALE + time * 0.6 * depthFactor,
          offsets[i] + i * 20,
          time * 0.4 * depthFactor
        );
        let h = n * HEIGHT * depthFactor;
        let y = yBase - h;
        p.vertex(x, y);
      }
      p.endShape();
    }
  }

  function drawFog() {
    for (let i = 0; i < 3; i++) {
      let y = p.height * 0.4 + i * 100;
      p.noStroke();
      p.fill(200, 20, 100, 10);
      p.ellipse(p.width / 2, y, p.width * 1.5, 150);
    }
  }
});








