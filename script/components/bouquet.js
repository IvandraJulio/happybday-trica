/**
 * Bouquet Component - Canvas-based hand-held flower bouquet
 */

if (!window.Components) window.Components = {};

window.Components.bouquet = {
  render(container, section, CONFIG) {
    const el = document.createElement("section");
    el.className = "bouquet-section";
    el.innerHTML = `<canvas id="bouquet-canvas"></canvas>`;
    container.appendChild(el);
    return el;
  },

  animate(tl, el, CONFIG) {
    const canvas = el.querySelector("#bouquet-canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = {
      stem: "#3a7d44",
      stemDark: "#2d6035",
      petals: ["#ff1493", "#ff69b4", "#c91f7c", "#d946aa", "#e91e63", "#ff85c2", "#ff4da6"],
      center: "#ffd700",
      centerHighlight: "#fff8b0",
      leaf: "#4caf50",
      leafDark: "#388e3c",
      ribbon: "#ffb6c1",
      ribbonDark: "#ff69b4",
      ribbonDeep: "#e91e8c",
      wrap: "#fff8e7",
      wrapLine: "#f5e6c8",
    };

    // Draw a petal
    function drawPetal(cx, cy, angle, width, height, color) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);
      ctx.fillStyle = color;
      ctx.shadowColor = "rgba(0,0,0,0.18)";
      ctx.shadowBlur = 5;
      ctx.beginPath();
      ctx.ellipse(0, 0, width, height, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Draw one flower
    function drawFlower(cx, cy, petalCount = 6, scale = 1, opacity = 1, colorShift = 0) {
      ctx.save();
      ctx.globalAlpha = opacity;

      const petalRadius = 28 * scale;
      const petalW = 13 * scale;
      const petalH = 22 * scale;

      for (let i = 0; i < petalCount; i++) {
        const angle = (i / petalCount) * Math.PI * 2;
        const px = cx + Math.cos(angle) * petalRadius;
        const py = cy + Math.sin(angle) * petalRadius;
        const ci = (i + colorShift) % colors.petals.length;
        drawPetal(px, py, angle, petalW, petalH, colors.petals[ci]);
      }

      // Center
      ctx.shadowColor = "rgba(0,0,0,0.2)";
      ctx.shadowBlur = 3;
      ctx.fillStyle = colors.center;
      ctx.beginPath();
      ctx.arc(cx, cy, 9 * scale, 0, Math.PI * 2);
      ctx.fill();

      // Highlight
      ctx.shadowBlur = 0;
      ctx.fillStyle = colors.centerHighlight;
      ctx.beginPath();
      ctx.arc(cx - 2 * scale, cy - 2 * scale, 3.5 * scale, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    // Draw leaf
    function drawLeaf(cx, cy, angle, scale, opacity) {
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.translate(cx, cy);
      ctx.rotate(angle);
      ctx.fillStyle = colors.leaf;
      ctx.shadowColor = "rgba(0,0,0,0.1)";
      ctx.shadowBlur = 3;
      ctx.beginPath();
      ctx.ellipse(0, 0, 7 * scale, 18 * scale, 0, 0, Math.PI * 2);
      ctx.fill();
      // Vein
      ctx.strokeStyle = colors.leafDark;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, -16 * scale);
      ctx.lineTo(0, 14 * scale);
      ctx.stroke();
      ctx.restore();
    }

    // Draw stems bundled together
    function drawStems(cx, cy, flowers, stemBottom, opacity = 1) {
      ctx.save();
      ctx.globalAlpha = opacity;

      flowers.forEach((f, i) => {
        const tx = cx + f.x;
        const ty = cy + f.y - 55;

        // Stem line
        ctx.strokeStyle = i % 2 === 0 ? colors.stem : colors.stemDark;
        ctx.lineWidth = 2.2;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(cx + f.x * 0.08, stemBottom);
        ctx.quadraticCurveTo(
          cx + f.x * 0.4,
          stemBottom - Math.abs(f.y) * 0.45,
          tx,
          ty
        );
        ctx.stroke();

        // Leaf
        if (i % 3 === 0) {
          const lx = cx + f.x * 0.38;
          const ly = stemBottom - Math.abs(f.y) * 0.38;
          const la = Math.atan2(f.y - 55, f.x) + (f.x >= 0 ? -0.7 : 0.7);
          drawLeaf(lx, ly, la, 0.85, opacity);
        }
      });

      ctx.restore();
    }

    // Draw paper/wrap cone at the bottom
    function drawWrap(cx, bottom, wrapH, wrapTopW, wrapBotW, opacity = 1) {
      ctx.save();
      ctx.globalAlpha = opacity;

      const top = bottom - wrapH;

      // Main wrap body
      const g = ctx.createLinearGradient(cx - wrapTopW, top, cx + wrapTopW, top);
      g.addColorStop(0, "#f5e6c8");
      g.addColorStop(0.4, "#fff8e7");
      g.addColorStop(0.75, "#faebd7");
      g.addColorStop(1, "#f0d9b5");
      ctx.fillStyle = g;
      ctx.shadowColor = "rgba(0,0,0,0.15)";
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 3;
      ctx.beginPath();
      ctx.moveTo(cx - wrapTopW, top);
      ctx.lineTo(cx + wrapTopW, top);
      ctx.lineTo(cx + wrapBotW, bottom);
      ctx.lineTo(cx - wrapBotW, bottom);
      ctx.closePath();
      ctx.fill();

      // Reset shadow
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;

      // Wrap stripes
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx - wrapTopW, top);
      ctx.lineTo(cx + wrapTopW, top);
      ctx.lineTo(cx + wrapBotW, bottom);
      ctx.lineTo(cx - wrapBotW, bottom);
      ctx.closePath();
      ctx.clip();

      ctx.strokeStyle = "rgba(220, 190, 140, 0.4)";
      ctx.lineWidth = 1.2;
      for (let s = 1; s <= 4; s++) {
        const sy = top + (wrapH / 5) * s;
        const t = s / 5;
        const sw = wrapTopW * (1 - t) + wrapBotW * t;
        ctx.beginPath();
        ctx.moveTo(cx - sw, sy);
        ctx.lineTo(cx + sw, sy);
        ctx.stroke();
      }

      // Diagonal crinkle lines
      ctx.strokeStyle = "rgba(200, 170, 120, 0.25)";
      ctx.lineWidth = 1;
      for (let d = -3; d <= 3; d++) {
        ctx.beginPath();
        ctx.moveTo(cx + d * 18, top);
        ctx.lineTo(cx + d * 10, bottom);
        ctx.stroke();
      }
      ctx.restore();

      // Wrap outline
      ctx.strokeStyle = "#deb887";
      ctx.lineWidth = 1.5;
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(cx - wrapTopW, top);
      ctx.lineTo(cx + wrapTopW, top);
      ctx.lineTo(cx + wrapBotW, bottom);
      ctx.lineTo(cx - wrapBotW, bottom);
      ctx.closePath();
      ctx.stroke();

      ctx.restore();
    }

    // Draw ribbon bow at wrap opening
    function drawRibbonBow(cx, cy, opacity = 1) {
      ctx.save();
      ctx.globalAlpha = opacity;

      // Left lobe
      ctx.fillStyle = colors.ribbonDark;
      ctx.shadowColor = "rgba(0,0,0,0.2)";
      ctx.shadowBlur = 5;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.bezierCurveTo(cx - 30, cy - 22, cx - 44, cy + 8, cx - 22, cy + 20);
      ctx.bezierCurveTo(cx - 8, cy + 26, cx, cy + 12, cx, cy);
      ctx.fill();

      // Right lobe
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.bezierCurveTo(cx + 30, cy - 22, cx + 44, cy + 8, cx + 22, cy + 20);
      ctx.bezierCurveTo(cx + 8, cy + 26, cx, cy + 12, cx, cy);
      ctx.fill();

      // Left tail
      ctx.shadowBlur = 0;
      ctx.fillStyle = colors.ribbon;
      ctx.beginPath();
      ctx.moveTo(cx - 7, cy + 10);
      ctx.quadraticCurveTo(cx - 26, cy + 40, cx - 22, cy + 62);
      ctx.quadraticCurveTo(cx - 19, cy + 66, cx - 10, cy + 60);
      ctx.quadraticCurveTo(cx - 4, cy + 40, cx + 3, cy + 12);
      ctx.fill();

      // Right tail
      ctx.beginPath();
      ctx.moveTo(cx + 7, cy + 10);
      ctx.quadraticCurveTo(cx + 26, cy + 40, cx + 22, cy + 62);
      ctx.quadraticCurveTo(cx + 19, cy + 66, cx + 10, cy + 60);
      ctx.quadraticCurveTo(cx + 4, cy + 40, cx - 3, cy + 12);
      ctx.fill();

      // Center knot
      ctx.fillStyle = colors.ribbonDeep;
      ctx.shadowColor = "rgba(0,0,0,0.25)";
      ctx.shadowBlur = 4;
      ctx.beginPath();
      ctx.ellipse(cx, cy + 10, 11, 13, 0, 0, Math.PI * 2);
      ctx.fill();

      // Knot highlight
      ctx.shadowBlur = 0;
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.beginPath();
      ctx.ellipse(cx - 2, cy + 7, 4, 5, -0.3, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    // ── Flower layout ─────────────────────────────────────────────
    const flowerArrangement = [
      // Center top
      { x:   0, y: -170 },
      // Upper ring
      { x: -42, y: -178 },
      { x:  42, y: -178 },
      { x: -22, y: -195 },
      { x:  22, y: -195 },
      // Mid ring
      { x: -78, y: -130 },
      { x:  78, y: -130 },
      { x: -55, y: -155 },
      { x:  55, y: -155 },
      // Lower sides
      { x: -32, y:  -95 },
      { x:  32, y:  -95 },
      { x: -68, y: -100 },
      { x:  68, y: -100 },
    ];

    // ── Animation ─────────────────────────────────────────────────
    const duration = 4.0;

    tl.to({}, {
      duration,
      onUpdate: function () {
        const progress = this.progress();
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const cx = canvas.width / 2;
        const cy = canvas.height / 2 + 30;

        // Wrap dimensions
        const wrapTopW = Math.min(68, canvas.width * 0.12);
        const wrapBotW = Math.min(32, canvas.width * 0.055);
        const wrapH = Math.min(140, canvas.height * 0.22);
        const wrapTop = cy;             // top of wrap = where stems converge
        const wrapBottom = cy + wrapH;  // bottom tip of bouquet

        // Ribbon sits at top of wrap
        const ribbonY = wrapTop - 8;

        // 1. Wrap paper (slides up)
        const wrapP = Math.min(1, progress * 2.8);
        if (wrapP > 0) {
          const slide = (1 - wrapP) * 50;
          ctx.save();
          ctx.translate(0, slide);
          drawWrap(cx, wrapBottom, wrapH, wrapTopW, wrapBotW, wrapP);
          ctx.restore();
        }

        // 2. Stems grow upward from wrap opening
        const stemP = Math.max(0, Math.min(1, (progress - 0.12) * 2.8));
        if (stemP > 0) {
          drawStems(cx, cy, flowerArrangement, wrapTop, stemP);
        }

        // 3. Flowers bloom one by one
        flowerArrangement.forEach((f, i) => {
          const delay = 0.22 + i * 0.055;
          const op = Math.max(0, Math.min(1, (progress - delay) * 4.5));
          if (op > 0) {
            const wobble = Math.sin(progress * Math.PI * 2.5 + i * 0.6) * 0.07;
            const scale = (0.85 + wobble) * (0.25 + op * 0.75);
            drawFlower(cx + f.x, cy + f.y, 6, scale, op, (i * 2) % colors.petals.length);
          }
        });

        // 4. Ribbon bow at wrap opening
        if (progress > 0.52) {
          const bowP = Math.min(1, (progress - 0.52) * 3.5);
          drawRibbonBow(cx, ribbonY, bowP);
        }
      },
    }, 0);

    tl.to(".bouquet-section", { duration: 1, opacity: 1 });
  },

  exit(tl, el) {
    tl.to(el, { duration: 0.8, opacity: 0 }, "-=0.5");
  },
};
