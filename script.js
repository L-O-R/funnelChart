const chart_data = {
  day: [
    { label: "DM Sent", value: 3500, trend: "0.5%" },
    { label: "Viewed", value: 1200, trend: "0.2%" },
    { label: "Link Taps", value: 400, trend: "0.1%" },
    { label: "Engaged", value: 180, trend: "0.05%" },
    { label: "Converted", value: 65, trend: "0.02%" },
  ],
  week: [
    { label: "DM Sent", value: 25000, trend: "2.3%" },
    { label: "Viewed", value: 10000, trend: "1.2%" },
    { label: "Link Taps", value: 2000, trend: "1.2%" },
    { label: "Engaged", value: 850, trend: "0.8%" },
    { label: "Converted", value: 320, trend: "0.5%" },
  ],
};

function renderChart(range_type) {
  const data = chart_data[range_type];
  const container = document.getElementById("chartContent");
  const label_box = document.getElementById(
    "flowChartLabels"
  );
  const clip_rect = document.getElementById("clip-rect");

  // Reset view
  container.innerHTML = "";
  label_box.innerHTML = "";
  clip_rect.setAttribute("width", "0");

  const width = 1000;
  const height = 400;
  const max_val = Math.max(...data.map((d) => d.value));

  let current_x = 0;
  const block_w_ratio = 0.16;
  const slope_w_ratio = 0.08;

  data.forEach((item, i) => {
    const h = (item.value / max_val) * (height * 0.75);
    const y = height - h;
    const w = width * block_w_ratio;

    // Create Rectangle with gradient
    const rect = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    );
    rect.setAttribute("x", current_x);
    rect.setAttribute("y", y);
    rect.setAttribute("width", w);
    rect.setAttribute("height", h);
    rect.setAttribute("fill", "url(#blockGradient)");
    rect.setAttribute("rx", "4");
    container.appendChild(rect);

    // Create Label - position at the center of each block
    const label = document.createElement("div");
    label.className = "label-group";
    const labelLeftPos =
      ((current_x + w / 2) / width) * 100;
    label.style.left = `${labelLeftPos}%`;
    label.style.bottom = `${(h / height) * 100 + 8}%`;
    label.innerHTML = `
                    <span class="label-group__title">${
                      item.label
                    }</span>
                    <span class="label-group__value">${item.value.toLocaleString()}</span>
                    <span class="label-group__trend">${
                      item.trend
                    }</span>
                `;
    label_box.appendChild(label);

    // Show labels with a slight delay relative to the wipe animation
    setTimeout(
      () => label.classList.add("label-group--visible"),
      i * 400 + 500
    );

    current_x += w;

    // Create Slope
    if (i < data.length - 1) {
      const next_h =
        (data[i + 1].value / max_val) * (height * 0.75);
      const slope_w = width * slope_w_ratio;
      const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      const d = `M${current_x},${y} L${
        current_x + slope_w
      },${height - next_h} L${
        current_x + slope_w
      },${height} L${current_x},${height} Z`;
      path.setAttribute("d", d);
      path.setAttribute("fill", "var(--color-transition)");
      container.appendChild(path);
      current_x += slope_w;
    }
  });

  // Animate the reveal from left to right
  let progress = 0;
  const animateReveal = () => {
    progress += 8;
    clip_rect.setAttribute("width", progress);
    if (progress < width) {
      requestAnimationFrame(animateReveal);
    }
  };
  requestAnimationFrame(animateReveal);
}

// Button Handling
document.querySelectorAll(".btn--toggle").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    document
      .querySelectorAll(".btn--toggle")
      .forEach((b) => {
        b.classList.remove("btn--active");
        b.setAttribute("aria-pressed", "false");
      });
    e.target.classList.add("btn--active");
    e.target.setAttribute("aria-pressed", "true");
    renderChart(e.target.dataset.range);
  });
});

document.addEventListener("DOMContentLoaded", () =>
  renderChart("week")
);
