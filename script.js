(function () {
  const canvas = document.getElementById("signal-field");
  const ctx = canvas.getContext("2d");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let width = 0;
  let height = 0;
  let nodes = [];
  let rafId = 0;

  function resize() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    const count = Math.max(36, Math.min(82, Math.floor(width / 18)));
    nodes = Array.from({ length: count }, (_, index) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.34,
      vy: (Math.random() - 0.5) * 0.34,
      r: index % 7 === 0 ? 2.2 : 1.35,
      hue: index % 3
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    ctx.lineWidth = 1;

    for (let i = 0; i < nodes.length; i += 1) {
      const a = nodes[i];
      a.x += a.vx;
      a.y += a.vy;

      if (a.x < -20) a.x = width + 20;
      if (a.x > width + 20) a.x = -20;
      if (a.y < -20) a.y = height + 20;
      if (a.y > height + 20) a.y = -20;

      for (let j = i + 1; j < nodes.length; j += 1) {
        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distance = Math.hypot(dx, dy);
        const limit = width < 700 ? 118 : 156;

        if (distance < limit) {
          const alpha = (1 - distance / limit) * 0.24;
          ctx.strokeStyle = `rgba(110, 231, 242, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    for (const node of nodes) {
      const colors = [
        "rgba(110, 231, 242, 0.78)",
        "rgba(157, 242, 195, 0.72)",
        "rgba(255, 179, 145, 0.7)"
      ];
      ctx.fillStyle = colors[node.hue];
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
      ctx.fill();
    }

    rafId = window.requestAnimationFrame(draw);
  }

  function initReveal() {
    const revealItems = document.querySelectorAll("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.16 }
    );

    revealItems.forEach((item) => observer.observe(item));
  }

  document.getElementById("year").textContent = new Date().getFullYear();

  window.addEventListener("resize", resize);
  resize();

  if (!prefersReducedMotion) {
    draw();
  }

  initReveal();

  window.addEventListener("load", () => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  });

  window.addEventListener("pagehide", () => {
    window.cancelAnimationFrame(rafId);
  });
})();
