const chart_data = {
  day: [
    { label: "DM Sent", value: 3500, trend: "0.5%" },
    { label: "Viewed", value: 1200, trend: "0.2%" },
    { label: "Link Taps", value: 400, trend: "0.1%" },
  ],
  week: [
    { label: "DM Sent", value: 25000, trend: "2.3%" },
    { label: "Viewed", value: 10000, trend: "1.2%" },
    { label: "Link Taps", value: 2000, trend: "1.2%" },
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
  const block_w_ratio = 0.25;
  const slope_w_ratio = 0.12;

  data.forEach((item, i) => {
    const h = (item.value / max_val) * (height * 0.8);
    const y = height - h;
    const w = width * block_w_ratio;

    // Create Rectangle
    const rect = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    );
    rect.setAttribute("x", current_x);
    rect.setAttribute("y", y);
    rect.setAttribute("width", w);
    rect.setAttribute("height", h);
    rect.setAttribute("fill", "var(--color-main)");
    container.appendChild(rect);

    // Create Label
    const label = document.createElement("div");
    label.className = "label-group";
    label.style.left = `${(current_x / width) * 100}%`;
    label.style.bottom = `${(h / height) * 100 + 12}%`;
    label.innerHTML = `
            <span class="label-group__title">${
              item.label
            }</span>
            <span class="label-group__value">${item.value.toLocaleString()}</span>
            <span class="label-group__trend">↗ ${
              item.trend
            }</span>
        `;
    label_box.appendChild(label);

    // Show labels with a slight delay relative to the wipe animation
    setTimeout(
      () => label.classList.add("label-group--visible"),
      i * 500 + 600
    );

    current_x += w;

    // Create Slope
    if (i < data.length - 1) {
      const next_h =
        (data[i + 1].value / max_val) * (height * 0.8);
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
    progress += 4; // Speed of the wipe
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
      .querySelector(".btn--active")
      .classList.remove("btn--active");
    e.target.classList.add("btn--active");
    renderChart(e.target.dataset.range);
  });
});

document.addEventListener("DOMContentLoaded", () =>
  renderChart("week")
);
