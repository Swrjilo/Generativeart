// ART 9 — Generative animated particle tracing mesh
new p5((p) => {
  let particles = [];
  const PARTICLE_COUNT = 220;
  let connectThreshold = 140;
  let heartbeat = 0;
  let time = 0;
  let globalPulse = 1;

  p.setup = function () {
    let container = document.getElementById("art9");
    p.createCanvas(container.offsetWidth, container.offsetHeight).parent(container);
    p.colorMode(p.HSB, 360, 100, 100, 100);
    p.noStroke();
    initParticles();
  };

  p.draw = function () {
    p.background(0, 0, 100); // white background

    time += 0.01;

    // expand + contract pulse
    globalPulse = 1 + 0.25 * p.sin(time * 1.2);

    // heartbeat for particle pulsing
    heartbeat = p.map(p.sin(p.frameCount * 0.03), -1, 1, 0.85, 1.25);

    // update + display particles
    for (let pt of particles) {
      pt.update();
      pt.display();
    }

    // connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < i + 18 && j < particles.length; j++) {
        let a = particles[i];
        let b = particles[j];
        let d = p.dist(a.x, a.y, b.x, b.y);

        if (d < connectThreshold * heartbeat * globalPulse) {
          let alpha = p.map(d, 0, connectThreshold, 160, 0);
          p.stroke((a.color[0] + b.color[0]) / 2, 90, 90, alpha);
          p.strokeWeight(p.map(d, 0, connectThreshold, 2, 0.2));
          p.line(a.x, a.y, b.x, b.y);
        }
      }
    }
  };

  function initParticles() {
    particles = [];
    let radiusBase = Math.min(p.width, p.height) * 0.38; // cluster size
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      let angle = p.random(p.TWO_PI);
      let radius = p.random(radiusBase * 0.2, radiusBase);
      let x = p.width / 2 + radius * p.cos(angle);
      let y = p.height / 2 + radius * p.sin(angle);

      let hue = p.random(360);
      particles.push(new DotParticle(x, y, [hue, 100, 100]));
    }
  }

  class DotParticle {
    constructor(x, y, c) {
      this.baseX = x;
      this.baseY = y;
      this.x = x;
      this.y = y;
      this.baseSize = p.random(1.5, 3.5);
      this.size = this.baseSize;
      this.color = c;
      this.alpha = p.random(100, 180);
      this.twinkleOffset = p.random(1000);
    }

    update() {
      let cx = p.width / 2;
      let cy = p.height / 2;
      let dx = this.baseX - cx;
      let dy = this.baseY - cy;
      let r = p.sqrt(dx * dx + dy * dy);
      let angle = p.atan2(dy, dx);

      // 🔮 Alien folding/unfolding arms
      let armCount = 4 + 2 * p.sin(time * 0.7); 
      angle = Math.round(angle / (p.TWO_PI / armCount)) * (p.TWO_PI / armCount);

      // swirl + breathing
      angle += 0.004 * r + 0.4 * p.sin(time * 1.5 + r * 0.015);

      let radius = r * globalPulse * (0.85 + 0.25 * p.sin(time * 0.9 + this.twinkleOffset));

      this.x = cx + radius * p.cos(angle) + p.random(-0.6, 0.6);
      this.y = cy + radius * p.sin(angle) + p.random(-0.6, 0.6);

      // pulsating size
      let twinkle = p.map(p.sin(time * 3 + this.twinkleOffset), -1, 1, 0.6, 1.6);
      this.size = this.baseSize * heartbeat * twinkle;

      // psychedelic hue shift
      this.color[0] = (this.color[0] + 1.2) % 360;
    }

    display() {
      // glowing aura
      p.fill(this.color[0], 100, 100, this.alpha * 0.25);
      p.ellipse(this.x, this.y, this.size * 4);

      // core particle
      p.fill(this.color[0], 100, 100, this.alpha);
      p.ellipse(this.x, this.y, this.size);
    }
  }
});




//art10//

// ART 10 — Generative animated particle tracing mesh
new p5((p) => {
  let particles = [];
  const PARTICLE_COUNT = 220; 
  let connectThreshold = 120;
  let heartbeat = 0;
  let time = 0;
  let globalPulse = 1;

  p.setup = function () {
    let container = document.getElementById("art10");
    p.createCanvas(container.offsetWidth, container.offsetHeight).parent(container);
    p.colorMode(p.HSB, 360, 100, 100, 100);
    p.noStroke();
    initParticles();
  };

  p.draw = function () {
    p.background(0, 0, 100); // white

    time += 0.01;

    // expand + contract pulse
    globalPulse = 1 + 0.25 * p.sin(time * 1.2);

    // heartbeat pulse
    heartbeat = p.map(p.sin(p.frameCount * 0.025), -1, 1, 0.85, 1.25);

    // update + display particles
    for (let pt of particles) {
      pt.update();
      pt.display();
    }

    // connecting lines (alien geometry threads)
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < i + 15 && j < particles.length; j++) {
        let a = particles[i];
        let b = particles[j];
        let d = p.dist(a.x, a.y, b.x, b.y);

        if (d < connectThreshold * globalPulse) {
          let alpha = p.map(d, 0, connectThreshold, 120, 0);
          p.stroke((a.hue + b.hue) / 2, 80, 90, alpha);
          p.strokeWeight(p.map(d, 0, connectThreshold, 1.5, 0.2));
          p.line(a.x, a.y, b.x, b.y);
        }
      }
    }
  };

  function initParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      let angle = p.random(p.TWO_PI);
      let radius = p.random(p.width * 0.35); // slightly smaller cluster to avoid cutoff
      let x = p.width / 2 + radius * p.cos(angle);
      let y = p.height / 2 + radius * p.sin(angle);
      let hue = p.random(360);
      particles.push(new DotParticle(x, y, hue));
    }
  }

  class DotParticle {
    constructor(x, y, hue) {
      this.baseX = x;
      this.baseY = y;
      this.x = x;
      this.y = y;
      this.hue = hue;
      this.baseSize = p.random(1, 3);
      this.size = this.baseSize;
      this.twinkleOffset = p.random(1000);
    }

    update() {
      let dx = this.baseX - p.width / 2;
      let dy = this.baseY - p.height / 2;
      let r = p.sqrt(dx * dx + dy * dy);
      let angle = p.atan2(dy, dx);

      // 🔮 Folding & unfolding arms (symmetry count oscillates)
      let armCount = 4 + 2 * p.sin(time * 0.6);
      angle = Math.round(angle / (p.TWO_PI / armCount)) * (p.TWO_PI / armCount);

      // swirling + wave distortion
      let swirl = 0.002 * r + 0.4 * p.sin(time * 0.7 + r * 0.015);
      let morph = 0.0015 * r * p.sin(time * 0.25);

      angle += swirl + morph;

      // radius breathing with global pulse
      let radius = r * globalPulse * (0.85 + 0.25 * p.sin(time * 0.8 + this.twinkleOffset));

      // update position (with slight jitter for alive feel)
      this.x = p.width / 2 + radius * p.cos(angle) + p.random(-0.5, 0.5);
      this.y = p.height / 2 + radius * p.sin(angle) + p.random(-0.5, 0.5);

      // size pulsation
      let twinkle = p.map(p.sin(time * 2 + this.twinkleOffset), -1, 1, 0.6, 1.5);
      this.size = this.baseSize * heartbeat * twinkle;

      // psychedelic hue shift
      this.hue = (this.hue + 0.6) % 360;
    }

    display() {
      // aura glow
      p.fill(this.hue, 90, 100, 25);
      p.ellipse(this.x, this.y, this.size * 3);

      // core
      p.fill(this.hue, 90, 80, 90);
      p.ellipse(this.x, this.y, this.size);
    }
  }
});




//art11
// background-art1.js
// Dotted Particles Head Array Style (inside #art1)

new p5((p) => {
  let particles = [];
  const PARTICLE_COUNT = 200; 
  let connectThreshold = 40;

  p.setup = function () {
    let container = document.getElementById("art11");
    p.createCanvas(container.offsetWidth, container.offsetHeight).parent(container);
    p.colorMode(p.HSB, 360, 100, 100, 100);
    p.noStroke();

    // Generate particles inside silhouette
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new DotParticle());
    }
  };

  p.draw = function () {
    p.background(255); // soft pastel

    // draw & update particles
    for (let pt of particles) {
      pt.update();
      pt.display();
    }

    // connecting lines
    p.strokeWeight(0.8);
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        let a = particles[i];
        let b = particles[j];
        let d = p.dist(a.x, a.y, b.x, b.y);
        if (d < connectThreshold) {
          p.stroke(a.hue, 80, 100, p.map(d, 0, connectThreshold, 90, 0));
          p.line(a.x, a.y, b.x, b.y);
        }
      }
    }
    p.noStroke();
  };

  p.windowResized = function () {
    let container = document.getElementById("art11");
    p.resizeCanvas(container.offsetWidth, container.offsetHeight);
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new DotParticle());
    }
  };

  function randomInHead() {
    let x, y, nx, ny;
    do {
      x = p.random(p.width * 0.25, p.width * 0.75);
      y = p.random(p.height * 0.25, p.height * 0.75);
      nx = p.map(x, p.width * 0.25, p.width * 0.75, -1, 1);
      ny = p.map(y, p.height * 0.25, p.height * 0.75, -1.2, 1.2);
    } while (nx * nx + (ny * ny) / (1.2 * 1.2) > 1);
    return { x, y };
  }

  class DotParticle {
    constructor() {
      let pos = randomInHead();
      this.x = pos.x;
      this.y = pos.y;
      this.size = p.random(1, 3);
      this.hue = p.random(180, 300);
      this.alpha = p.random(50, 100);
      this.vx = p.random(-0.3, 0.3);
      this.vy = p.random(-0.3, 0.3);
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // flicker alpha or size
      this.alpha = p.map(
        p.sin((this.x + this.y + p.frameCount * 0.02)),
        -1, 1,
        40, 100
      );
      this.size = p.map(
        p.cos((this.x * 0.05 + p.frameCount * 0.01)),
        -1, 1,
        1, 3
      );

      // reset if outside head silhouette
      let nx = p.map(this.x, p.width * 0.25, p.width * 0.75, -1, 1);
      let ny = p.map(this.y, p.height * 0.25, p.height * 0.75, -1.2, 1.2);
      if (nx * nx + (ny * ny) / (1.2 * 1.2) > 1) {
        let pos = randomInHead();
        this.x = pos.x;
        this.y = pos.y;
      }
    }

    display() {
      p.fill(this.hue, 80, 100, this.alpha);
      p.ellipse(this.x, this.y, this.size);
    }
  }
});




// background-art2-particles.js
// Minimal Elegant Particle Network (Rainbow Dots + Single Color Lines) for #art2
// Auto-resizes with container

new p5((p) => {
  let particles = [];
  const PARTICLE_COUNT = 110; 
  let connectThreshold = 60;  
  let container;

  p.setup = function () {
    container = document.getElementById("art12");
    p.createCanvas(container.offsetWidth, container.offsetHeight).parent(container);
    p.colorMode(p.HSB, 360, 100, 100, 100);
    p.noStroke();

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new DotParticle());
    }

    window.addEventListener("resize", onResize);
  };

  function onResize() {
    container = document.getElementById("art12");
    let newW = container.offsetWidth;
    let newH = container.offsetHeight;

    // scale particle positions relative to new canvas size
    let scaleX = newW / p.width;
    let scaleY = newH / p.height;

    for (let part of particles) {
      part.x *= scaleX;
      part.y *= scaleY;
    }

    p.resizeCanvas(newW, newH);
  }

  p.draw = function () {
    // light elegant background
    p.background(255); // off-white

    // update + draw particles
    for (let part of particles) {
      part.update();
      part.display();
    }

    // connections: single elegant color (soft grey/blue)
    p.strokeWeight(1);
    p.stroke(200, 20, 30, 25); // bluish-grey, subtle
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        let a = particles[i];
        let b = particles[j];
        let d = p.dist(a.x, a.y, b.x, b.y);

        if (d < connectThreshold) {
          p.line(a.x, a.y, b.x, b.y);
        }
      }
    }
    p.noStroke();
  };

  function randomInHead() {
    let x, y, nx, ny;
    do {
      x = p.random(p.width * 0.25, p.width * 0.75);
      y = p.random(p.height * 0.25, p.height * 0.75);
      nx = p.map(x, p.width * 0.25, p.width * 0.75, -1, 1);
      ny = p.map(y, p.height * 0.25, p.height * 0.75, -1.2, 1.2);
    } while (nx * nx + (ny * ny) / (1.2 * 1.2) > 1);
    return { x, y };
  }

  class DotParticle {
    constructor() {
      let pos = randomInHead();
      this.x = pos.x;
      this.y = pos.y;
      this.size = p.random(3, 5);
      this.hue = p.random(0, 360); // 🌈 rainbow colors
      this.alpha = p.random(70, 100);
      this.vx = p.random(-1, 1);
      this.vy = p.random(-1, 1);
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // keep inside silhouette
      let nx = p.map(this.x, p.width * 0.25, p.width * 0.75, -1, 1);
      let ny = p.map(this.y, p.height * 0.25, p.height * 0.75, -1.2, 1.2);
      if (nx * nx + (ny * ny) / (1.2 * 1.2) > 1) {
        let pos = randomInHead();
        this.x = pos.x;
        this.y = pos.y;
      }
    }

    display() {
      p.noStroke();
      p.fill(this.hue, 70, 80, this.alpha); // rainbow dots
      p.ellipse(this.x, this.y, this.size);
    }
  }
});



//art13
new p5((p) => {
  let c;
  let baseRadius;
  let divisions;
  let divAngle;
  let speed;

  p.setup = () => {
    let container = document.getElementById("art13");
    p.createCanvas(container.offsetWidth, container.offsetHeight).parent(container);
    p.colorMode(p.HSB, 360, 100, 100, 100);
    generatePattern();
  };

  function generatePattern() {
    c = 0;                                          // reset cycle
    speed = p.random(0.004, 0.012);                 // smooth & slow
    divisions = p.int(p.random(80, 160));           // abstract elegance
    baseRadius = Math.min(p.width, p.height) * p.random(0.32, 0.45);
    divAngle = p.TWO_PI / divisions;
  }

  function mathf(x) {
    // nonlinear abstract mapping (organic flow)
    return (
      x * (1 + 0.4 * Math.sin(c * 0.5)) +
      18 * Math.sin(x * 0.12 + c) +
      12 * Math.cos(x * 0.07 - c * 1.8)
    );
  }

  function divPos(num, r) {
    let x = Math.cos(divAngle * num) * r;
    let y = Math.sin(divAngle * num) * r;
    return p.createVector(x, y);
  }

  p.draw = () => {
    p.background(0, 0, 100); // pure white
    p.translate(p.width / 2, p.height / 2);

    let radius = baseRadius * (1 + 0.05 * Math.sin(c * 0.4)); // gentle breathing

    // faint aura circles (like spores)
    p.noFill();
    for (let g = 5; g > 0; g--) {
      p.stroke((c * 50 + g * 40) % 360, 60, 100, 12);
      p.strokeWeight(0.6);
      p.circle(0, 0, radius * 0.25 * g);
    }

    // psychedelic mycelium curves
    for (let i = 0; i < divisions; i++) {
      let x = i;
      let y = mathf(x);

      let start = divPos(x, radius);
      let end = divPos(y % divisions, radius * 0.9);

      // control point halfway for organic arcs
      let midX = (start.x + end.x) * 0.5 + Math.sin(c + i * 0.1) * 40;
      let midY = (start.y + end.y) * 0.5 + Math.cos(c + i * 0.1) * 40;

      // psychedelic color mapping
      let hue = (c * 120 + i * 4) % 360;
      let sat = 80 + 20 * Math.sin(c + i * 0.05);
      let bri = 70 + 30 * Math.cos(c * 0.5 + i * 0.07);
      let alpha = 60 + 40 * Math.sin(c + i * 0.08);

      p.noFill();
      p.stroke(hue, sat, bri, alpha);
      p.strokeWeight(0.8 + 0.4 * Math.sin(i * 0.2 + c * 2));

      // draw curve (mycelium thread-like)
      p.beginShape();
      p.vertex(start.x, start.y);
      p.quadraticVertex(midX, midY, end.x, end.y);
      p.endShape();
    }

    // evolve cycle
    c += speed;

    // full loop → refresh new pattern
    if (c > p.TWO_PI) {
      generatePattern();
    }
  };
});

//art14
new p5((p) => {
  // Sacred generative geometry — abstract mandala
  let c;                     
  let speed;                 
  let divisions;             
  let baseRadius;            
  let divAngle;
  let phi = (1 + Math.sqrt(5)) / 2; 
  let pendingRegenerate = false;

  p.setup = () => {
    let container = document.getElementById("art14");
    p.createCanvas(container.offsetWidth, container.offsetHeight).parent(container);
    p.colorMode(p.HSB, 360, 100, 100, 100);
    p.noiseSeed(Math.floor(p.random(9999)));
    p.pixelDensity(1);
    generatePattern();
  };

  function generatePattern() {
    c = 0;
    speed = p.random(0.003, 0.01);
    divisions = p.int(p.random(36, 180));
    baseRadius = Math.min(p.width, p.height) * p.random(0.30, 0.48);
    divAngle = p.TWO_PI / divisions;
    pendingRegenerate = false;

    p._pal = {
      baseHue: p.random(200, 320),  
      accentHue: p.random(30, 50),  
      chroma: p.random(70, 98),     
      darkB: p.random(18, 35),      
      goldB: p.random(80, 98)       
    };
  }

  function mathf(x) {
    let step = x * (1 + 0.45 * Math.sin(c * 0.6 + x * 0.01));
    let spiral = (phi * x) % divisions;
    let wavy = 14 * Math.sin(x * 0.08 + c * 1.2) + 8 * Math.cos(x * 0.045 - c * 0.9);
    let n = p.noise(x * 0.02, c * 0.1) * 6;
    return step + spiral * 0.08 + wavy + n;
  }

  function divPos(num, r) {
    let ang = divAngle * num;
    return p.createVector(Math.cos(ang) * r, Math.sin(ang) * r);
  }

  function drawVesica(a, b, r, hueShift, thickness, alpha) {
    let A = divPos(a, r);
    let B = divPos(b, r);
    let cx = (A.x + B.x) * 0.5 + (Math.cos((a + b) * 0.5) * r * 0.12);
    let cy = (A.y + B.y) * 0.5 + (Math.sin((a + b) * 0.5) * r * 0.12);

    p.noFill();
    p.stroke((p._pal.baseHue + hueShift + 180) % 360, p._pal.chroma * 0.35, p._pal.darkB * 0.45, alpha * 0.35);
    p.strokeWeight(thickness * 1.9);
    p.beginShape();
    p.vertex(A.x + 3, A.y + 3);
    p.quadraticVertex(cx + 3, cy + 3, B.x + 3, B.y + 3);
    p.endShape();

    p.stroke((p._pal.baseHue + hueShift) % 360, p._pal.chroma, p._pal.goldB * 0.9, alpha);
    p.strokeWeight(thickness);
    p.beginShape();
    p.vertex(A.x, A.y);
    p.quadraticVertex(cx, cy, B.x, B.y);
    p.endShape();
  }

  function drawPolygonalBand(radius, rings, offsetSeed) {
    for (let ring = 0; ring < rings; ring++) {
      let r = radius * (0.6 + ring * 0.18);
      let wobble = 6 * Math.sin(c * 0.7 + ring * 0.6 + offsetSeed);
      for (let i = 0; i < divisions; i++) {
        let j = (i + 1 + Math.floor(mathf(i) * 0.04)) % divisions;
        let hueShift = (i / divisions) * 120 * (0.5 + 0.5 * Math.sin(ring + c * 0.7));
        let thickness = 1.6 + 1.8 * Math.abs(Math.sin(i * 0.1 + ring * 0.6 + c));
        let alpha = 65 + 35 * p.noise(i * 0.02, ring * 0.1, c * 0.05);
        drawVesica(i, j, r + wobble, hueShift, thickness, alpha);
      }
    }
  }

 // 🔹 Hexagon core, contained inside mandala center circle
function drawHeartbeatHexagons(radius) {
  // heartbeat + suspension
  let pulse = 1 + 0.05 * Math.sin(c * 0.6);
  let jerk = 1 + 0.08 * Math.sin(c * 2.0);

  // stack settings
  let layers = 35;          // number of hexagons
  let shrinkFactor = 0.85;  // shrinking per layer

  // 🔹 Restrict hexagons to center circle only (about 40% of mandala radius)
  let maxR = radius * 0.35;

  let r = maxR * pulse * jerk; // starting radius

  for (let l = 0; l < layers; l++) {
    if (r < 1) break; // stop at dot

    let verts = 6;

    // fade with depth
    let alpha = 90 - l * 2;
    let col = (l % 2 === 0)
      ? [p._pal.accentHue, 90, 95, alpha]
      : [p._pal.baseHue, 60, 45, alpha * 0.9];

    p.noFill();
    p.stroke(...col);
    p.strokeWeight(Math.max(1.5 - l * 0.04, 0.2));

    // concentric hexagon (center only, no drift)
    p.beginShape();
    for (let v = 0; v < verts; v++) {
      let ang = (p.TWO_PI / verts) * v + c * 0.01 * (l + 1);
      let x = Math.cos(ang) * r;
      let y = Math.sin(ang) * r;
      p.vertex(x, y);
    }
    p.endShape(p.CLOSE);

    // next hexagon smaller
    r *= shrinkFactor;
  }
}


  p.draw = () => {
    p.background(0, 0, 100);
    p.translate(p.width / 2, p.height / 2);

    let radius = baseRadius * (1 + 0.03 * Math.sin(c * 0.6));

    p.noFill();
    for (let g = 6; g > 0; g--) {
      p.stroke((p._pal.baseHue + g * 8) % 360, p._pal.chroma * 0.28, 95, 8 + g * 2);
      p.strokeWeight(1);
      p.circle(0, 0, radius * (0.2 + g * 0.25));
    }

    let polygonLayers = Math.max(2, Math.floor(divisions / 40));
    for (let L = 0; L < polygonLayers; L++) {
      let verts = 6 + L * 2;
      p.noFill();
      p.stroke((p._pal.accentHue + L * 6) % 360, 95, 90, 70);
      p.strokeWeight(1.6 - L * 0.2);
      p.beginShape();
      for (let v = 0; v < verts; v++) {
        let ang = (p.TWO_PI / verts) * v + c * 0.02 * (L + 1);
        let rr = radius * (0.18 + L * 0.12);
        p.vertex(Math.cos(ang) * rr, Math.sin(ang) * rr);
      }
      p.endShape(p.CLOSE);
    }

    // 🔹 Call heartbeat hexagons (robotic machine core feel)
    drawHeartbeatHexagons(radius);

    drawPolygonalBand(radius, 3, 0.0);
    drawPolygonalBand(radius * 0.78, 2, 1.2);
    drawPolygonalBand(radius * 1.12, 2, 2.4);

    for (let i = 0; i < divisions; i += Math.max(1, Math.floor(divisions / 90))) {
      let p0 = divPos(i, radius * 0.98);
      let p1 = divPos((i + Math.floor(mathf(i) * 0.02)) % divisions, radius * 0.42);
      p.stroke((p._pal.baseHue + i * 2.2) % 360, p._pal.chroma * 0.5, 92, 72);
      p.strokeWeight(0.9);
      p.line(p0.x, p0.y, p1.x, p1.y);
    }

    p.noFill();
    p.stroke(p._pal.accentHue, 95, 92, 95);
    p.strokeWeight(2.2);
    p.circle(0, 0, radius * 0.9);

    c += speed;

    if (pendingRegenerate && c > p.TWO_PI) {
      generatePattern();
    }
    if (!pendingRegenerate && c > p.TWO_PI) {
      generatePattern();
    }
  };

  p.mousePressed = () => {
    pendingRegenerate = true;
  };
  p.keyPressed = () => {
    if (p.key === ' ') pendingRegenerate = true;
  };

  p.windowResized = () => {
    const cEl = document.getElementById("art14");
    p.resizeCanvas(cEl ? cEl.offsetWidth : p.windowWidth, cEl ? cEl.offsetHeight : p.windowHeight);
    baseRadius = Math.min(p.width, p.height) * p.random(0.30, 0.48);
  };
});


//art15
new p5((p) => {
  let t = 0;
  let params;
  let activePalette = [];

  // 🎨 earthy curated palettes (same as before)
  const palettes = [
    [
      { h: 352, s: 8,  b: 38 },
      { h: 12,  s: 59, b: 34 },
      { h: 10,  s: 36, b: 58 },
      { h: 240, s: 4,  b: 63 },
      { h: 192, s: 61, b: 37 },
      { h: 196, s: 34, b: 63 }
    ],
    [
      { h: 14,  s: 64, b: 33 },
      { h: 41,  s: 55, b: 38 },
      { h: 205, s: 75, b: 29 },
      { h: 4,   s: 40, b: 60 },
      { h: 27,  s: 74, b: 61 },
      { h: 320, s: 15, b: 39 }
    ],
    [
      { h: 223, s: 67, b: 34 },
      { h: 230, s: 38, b: 59 },
      { h: 264, s: 27, b: 42 },
      { h: 216, s: 70, b: 57 },
      { h: 286, s: 13, b: 65 },
      { h: 221, s: 58, b: 45 }
    ],
    [
      { h: 18,  s: 87, b: 35 },
      { h: 30,  s: 88, b: 63 },
      { h: 209, s: 92, b: 35 },
      { h: 25,  s: 91, b: 81 },
      { h: 15,  s: 89, b: 57 },
      { h: 24,  s: 59, b: 94 }
    ]
  ];

  p.setup = () => {
    const container = document.getElementById("art15");
    const w = container ? container.offsetWidth : Math.min(1200, p.windowWidth);
    const h = container ? container.offsetHeight : Math.min(800, p.windowHeight);
    p.createCanvas(w, h).parent(container);
    p.pixelDensity(1);
    p.angleMode(p.RADIANS);
    p.colorMode(p.HSB, 360, 100, 100, 100);
    initParams();
  };

  function initParams() {
    params = {
      cx: p.width / 2,
      cy: p.height / 2,
      baseR: Math.min(p.width, p.height) * p.random(0.28, 0.35),
      flowerRings: p.int(p.random(5, 7)),
      flowerSpacing: p.random(0.15, 0.2),
      rotSpeed: p.random(0.0005, 0.0015)
    };

    // pick a palette
    let pal = palettes[Math.floor(p.random(palettes.length))];
    activePalette = pal.map(c => p.color(c.h, c.s, c.b));
  }

  function getGradientColor(factor) {
    let steps = activePalette.length - 1;
    let scaled = factor * steps;
    let i = Math.floor(scaled);
    let frac = scaled - i;
    let c1 = activePalette[i % activePalette.length];
    let c2 = activePalette[(i + 1) % activePalette.length];
    return p.lerpColor(c1, c2, frac);
  }

  function flowerOfLife(cx, cy, baseR, rings, spacing, rot = 0, breath = 1) {
    const step = spacing * baseR * breath;
    const limit = Math.ceil((rings + 1) * (baseR / step) * 1.1);
    p.push();
    p.translate(cx, cy);
    p.rotate(rot);
    p.noFill();

    for (let q = -limit; q <= limit; q++) {
      for (let r = -limit; r <= limit; r++) {
        let x = step * (q + r * 0.5);
        let y = step * (r * Math.sqrt(3) / 2.0);
        let d = p.dist(x, y, 0, 0);
        if (d < baseR * (1 + rings * 0.25) * breath) {
          let a = p.map(d, 0, baseR * (1 + rings * 0.25), 1, 0.1);
          let jitterX = (Math.random() - 0.5) * 0.5 * breath;
          let jitterY = (Math.random() - 0.5) * 0.5 * breath;

          let factor = p.map(d, 0, baseR * (1 + rings * 0.25), 0, 1);
          let col = getGradientColor(factor);

          // 🎨 deepen more aggressively
          let h = p.hue(col);
          let s = Math.min(100, p.saturation(col) * 1.6); 
          let b = p.brightness(col);
          // boost contrast: darker darks, lighter lights
          b = b < 50 ? b * 0.9 : Math.min(100, b * 1.25);

          p.stroke(h, s, b, 80 * a);
          p.strokeWeight(1.8); // bolder lines

          let sizeFactor = p.map(d, 0, baseR * (1 + rings * 0.25), 1, 0.4);
          p.circle(
            x + jitterX,
            y + jitterY,
            baseR * breath * sizeFactor * (0.55 + 0.05 * Math.sin(q + r + t * 0.01))
          );
        }
      }
    }
    p.pop();
  }

  p.draw = () => {
    p.background(0, 0, 100);

    let breath = 1 + 0.2 * Math.sin(t * 0.01);

    flowerOfLife(
      params.cx,
      params.cy,
      params.baseR,
      params.flowerRings,
      params.flowerSpacing,
      t * params.rotSpeed,
      breath
    );

    t++;
    if (t > 1500) {
      initParams();
      t = 0;
    }
  };

  p.mousePressed = initParams;
  p.keyPressed = () => { if (p.key === " ") initParams(); };

  p.windowResized = () => {
    const el = document.getElementById("art15");
    p.resizeCanvas(el ? el.offsetWidth : p.windowWidth, el ? el.offsetHeight : p.windowHeight);
    initParams();
  };
});


//art16
new p5((p) => {
  let circles = [];
  let minRadius = 2;
  let epsilon = 0.5;
  let maxDepth;
  let hueShift = 0;
  let nextRegenFrame = 0;
  let decoratedCircles = []; // store which circles get π

  class Complex {
    constructor(a, b) { this.a = a; this.b = b; }
    add(o) { return new Complex(this.a + o.a, this.b + o.b); }
    sub(o) { return new Complex(this.a - o.a, this.b - o.b); }
    mult(o) { return new Complex(this.a*o.a - this.b*o.b, this.a*o.b + this.b*o.a); }
    scale(s) { return new Complex(this.a*s, this.b*s); }
    sqrt() {
      let mag = Math.sqrt(this.a*this.a + this.b*this.b);
      let ang = Math.atan2(this.b, this.a);
      mag = Math.sqrt(mag);
      ang = ang/2;
      return new Complex(mag * Math.cos(ang), mag * Math.sin(ang));
    }
  }

  class Circle {
    constructor(bend, x, y) {
      this.center = new Complex(x, y);
      this.bend = bend;
      this.radius = Math.abs(1 / bend);
      this.baseHue = p.random(0, 360);
    }

    distance(o) {
      let dx = this.center.a - o.center.a;
      let dy = this.center.b - o.center.b;
      return Math.sqrt(dx*dx + dy*dy);
    }

    draw(depth = 0) {
      let hue = (this.baseHue + hueShift + depth * 40) % 360;
      let hue2 = (hue + 60) % 360;
      let gradBright = p.map(Math.sin((p.frameCount + depth*20) * 0.05), -1, 1, 60, 100);

      p.fill(hue, 100, gradBright, 40);
      p.stroke(hue2, 100, 100, 90);
      p.strokeWeight(1.5);

      p.ellipse(this.center.a, this.center.b, this.radius * 2);
    }
  }

  p.setup = () => {
    const container = document.getElementById("art16");
    const w = container ? container.offsetWidth : Math.min(800, p.windowWidth);
    const h = container ? container.offsetHeight : Math.min(800, p.windowHeight);
    p.createCanvas(w, h).parent(container);
    p.colorMode(p.HSB, 360, 100, 100, 100);
    buildFractal();
  };

  function buildFractal() {
    circles = [];
    decoratedCircles = [];
    p.background(0, 0, 100); // white background

    maxDepth = p.int(p.random(4, 6));
    let r = Math.min(p.width, p.height) * p.random(0.44, 0.54);

    let cx = p.width / 2;
    let cy = p.height / 2;

    let c1 = new Circle(-1 / r, cx, cy); // big bounding
    let c2 = new Circle(1 / (r / 2), cx - r / 2, cy);
    let c3 = new Circle(1 / (r / 2), cx + r / 2, cy);

    circles.push(c1, c2, c3);
    apollonian([c1, c2, c3], 0);

    // Pick random smaller circles for π (skip the first big one)
    for (let i = 1; i < circles.length; i++) {
      if (p.random() < 0.3) { // ~30% chance
        decoratedCircles.push(circles[i]);
      }
    }
  }

  function apollonian(triplet, depth) {
    if (depth > maxDepth) return;
    let [c1, c2, c3] = triplet;
    let ks = descartes(c1, c2, c3);
    let newCircles = complexDescartes(c1, c2, c3, ks);

    for (let c4 of newCircles) {
      if (validate(c4)) {
        circles.push(c4);
        apollonian([c1, c2, c4], depth + 1);
        apollonian([c1, c3, c4], depth + 1);
        apollonian([c2, c3, c4], depth + 1);
      }
    }
  }

  function validate(c4) {
    if (c4.radius < minRadius) return false;
    for (let other of circles) {
      let d = c4.distance(other);
      if (d < epsilon && Math.abs(c4.radius - other.radius) < epsilon) {
        return false;
      }
    }
    return true;
  }

  function descartes(c1, c2, c3) {
    let k1 = c1.bend, k2 = c2.bend, k3 = c3.bend;
    let sum = k1 + k2 + k3;
    let root = 2 * Math.sqrt(Math.abs(k1*k2 + k2*k3 + k1*k3));
    return [sum + root, sum - root];
  }

  function complexDescartes(c1, c2, c3, ks) {
    let k1 = c1.bend, k2 = c2.bend, k3 = c3.bend;
    let z1 = c1.center, z2 = c2.center, z3 = c3.center;
    let zk1 = z1.scale(k1), zk2 = z2.scale(k2), zk3 = z3.scale(k3);
    let sum = zk1.add(zk2).add(zk3);
    let root = zk1.mult(zk2).add(zk2.mult(zk3)).add(zk1.mult(zk3));
    root = root.sqrt().scale(2);

    let candidates = [
      new Circle(ks[0], sum.add(root).scale(1/ks[0]).a, sum.add(root).scale(1/ks[0]).b),
      new Circle(ks[0], sum.sub(root).scale(1/ks[0]).a, sum.sub(root).scale(1/ks[0]).b)
    ];

    let bounding = circles[0]; 
    return candidates.filter(c => c.distance(bounding) + c.radius <= bounding.radius + 1);
  }

  p.draw = () => {
    p.background(0, 0, 100); // white background
    hueShift += 6;

    for (let i = 0; i < circles.length; i++) {
      circles[i].draw(i % maxDepth);
    }

    // ✨ Draw π on selected smaller circles
    p.noStroke();
    p.fill(0, 0, 0); // black symbol
    p.textAlign(p.CENTER, p.CENTER);

    for (let c of decoratedCircles) {
      p.textSize(c.radius * 0.8);
      p.text("π", c.center.a, c.center.b);
    }

    if (p.frameCount > nextRegenFrame) {
      buildFractal();
      nextRegenFrame = p.frameCount + 450;
    }
  };

  p.windowResized = () => {
    const el = document.getElementById("art16");
    p.resizeCanvas(el ? el.offsetWidth : p.windowWidth,
                   el ? el.offsetHeight : p.windowHeight);
    buildFractal();
  };
});









