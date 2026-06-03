/**
 * Bouquet Component - Canvas-based flower drawing
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
    
    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Color palette
    const colors = {
      stem: "#4a7c59",
      petals: ["#ff1493", "#ff69b4", "#c91f7c", "#d946aa", "#e91e63"],
      center: "#ffd700",
      leaf: "#5cb85c",
      ribbon: "#ffb6c1",
      ribbonDark: "#ff69b4",
    };

    // Draw a petal shape
    function drawPetal(ctx, x, y, angle, width, height, color) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.ellipse(0, 0, width, height, 0, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    }

    // Draw a single flower with petals arranged in circle
    function drawFlower(cx, cy, petalCount = 5, scale = 1, opacity = 1, colorShift = 0) {
      ctx.save();
      ctx.globalAlpha = opacity;

      const petalRadius = 32 * scale;
      const petalWidth = 16 * scale;
      const petalHeight = 26 * scale;

      // Draw petals in circle
      for (let i = 0; i < petalCount; i++) {
        const angle = (i / petalCount) * Math.PI * 2;
        const px = cx + Math.cos(angle) * petalRadius;
        const py = cy + Math.sin(angle) * petalRadius;
        const colorIndex = (i + colorShift) % colors.petals.length;

        drawPetal(ctx, px, py, angle, petalWidth, petalHeight, colors.petals[colorIndex]);
      }

      // Draw flower center
      ctx.fillStyle = colors.center;
      ctx.beginPath();
      ctx.arc(cx, cy, 9 * scale, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    // Draw stems from bundle point
    function drawStems(bundleX, bundleY, flowerPositions, opacity = 1) {
      ctx.save();
      ctx.globalAlpha = opacity;

      flowerPositions.forEach(pos => {
        ctx.strokeStyle = colors.stem;
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        
        // Curved stem
        ctx.beginPath();
        ctx.moveTo(bundleX, bundleY);
        ctx.quadraticCurveTo(
          bundleX + pos.controlX * 0.3,
          bundleY + pos.controlY * 0.5,
          pos.x,
          pos.y - 70
        );
        ctx.stroke();

        // Leaves
        ctx.strokeStyle = colors.leaf;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(bundleX + pos.controlX * 0.2, bundleY + pos.controlY * 0.3);
        ctx.quadraticCurveTo(
          bundleX + pos.controlX * 0.5,
          bundleY + pos.controlY * 0.5,
          bundleX + pos.controlX * 0.6,
          bundleY + pos.controlY * 0.7
        );
        ctx.stroke();
      });

      ctx.restore();
    }

    // Draw ribbon bow
    function drawRibbonBow(x, y, width, opacity = 1) {
      ctx.save();
      ctx.globalAlpha = opacity;

      // Left ribbon tail
      ctx.fillStyle = colors.ribbon;
      ctx.beginPath();
      ctx.moveTo(x - 10, y);
      ctx.quadraticCurveTo(x - 35, y + 40, x - 30, y + 90);
      ctx.quadraticCurveTo(x - 28, y + 95, x - 15, y + 85);
      ctx.quadraticCurveTo(x - 10, y + 45, x + 5, y + 5);
      ctx.fill();

      // Right ribbon tail
      ctx.beginPath();
      ctx.moveTo(x + 10, y);
      ctx.quadraticCurveTo(x + 35, y + 40, x + 30, y + 90);
      ctx.quadraticCurveTo(x + 28, y + 95, x + 15, y + 85);
      ctx.quadraticCurveTo(x + 10, y + 45, x - 5, y + 5);
      ctx.fill();

      // Ribbon bow knot
      ctx.fillStyle = colors.ribbonDark;
      ctx.beginPath();
      ctx.arc(x, y, 14, 0, Math.PI * 2);
      ctx.fill();

      // Center accent
      ctx.fillStyle = colors.ribbon;
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    // Animation
    const duration = 3.5;
    tl.to(
      {},
      {
        duration: duration,
        onUpdate: function() {
          const progress = this.progress();
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          const centerX = canvas.width / 2;
          const centerY = canvas.height * 0.6;
          const bundleX = centerX;
          const bundleY = centerY + 100;

          // Flower arrangement - dense cluster
          const flowerArrangement = [
            // Main center flowers (top)
            { x: 0, y: -80, controlX: 0, controlY: -100 },
            
            // Upper ring
            { x: -50, y: -90, controlX: -60, controlY: -120 },
            { x: 50, y: -90, controlX: 60, controlY: -120 },
            { x: -30, y: -110, controlX: -40, controlY: -140 },
            { x: 30, y: -110, controlX: 40, controlY: -140 },
            
            // Middle ring
            { x: -75, y: -30, controlX: -90, controlY: -50 },
            { x: 75, y: -30, controlX: 90, controlY: -50 },
            { x: -55, y: -50, controlX: -70, controlY: -70 },
            { x: 55, y: -50, controlX: 70, controlY: -70 },
            
            // Lower sides
            { x: -40, y: 20, controlX: -50, controlY: 0 },
            { x: 40, y: 20, controlX: 50, controlY: 0 },
            { x: -65, y: 10, controlX: -80, controlY: -10 },
            { x: 65, y: 10, controlX: 80, controlY: -10 },
          ];

          // Draw stems
          const stemsOpacity = Math.max(0, Math.min(1, progress * 1.5));
          drawStems(bundleX, bundleY, flowerArrangement, stemsOpacity);

          // Draw flowers in sequence
          flowerArrangement.forEach((flower, i) => {
            const delay = i * 0.06;
            const opacity = Math.max(0, Math.min(1, (progress - delay) * 3));
            
            if (opacity > 0) {
              const scale = 0.85 + Math.sin(progress * Math.PI * 2 + i * 0.4) * 0.12;
              const colorShift = Math.floor(i / 2) % colors.petals.length;
              
              drawFlower(
                centerX + flower.x,
                centerY + flower.y,
                5,
                scale,
                opacity,
                colorShift
              );
            }
          });

          // Draw ribbon bow
          if (progress > 0.5) {
            const ribbonOpacity = Math.min(1, (progress - 0.5) * 2.5);
            drawRibbonBow(centerX, centerY + 115, 60, ribbonOpacity);
          }
        },
      },
      0
    );

    tl.to(".bouquet-section", { duration: 1, opacity: 1 });
  },

  exit(tl, el) {
    tl.to(el, { duration: 0.8, opacity: 0 }, "-=0.5");
  },
};
