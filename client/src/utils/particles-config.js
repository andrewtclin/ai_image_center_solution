export const particlesOptions = {
  particles: {
    number: {
      value: 300,
      density: { enable: true, value_area: 900 },
    },
    color: {
      value: ["#BD10E0", "#B8E986", "#50E3C2", "#FFD300", "#E86363"],
    },

    line_linked: {
      enable: false,
      distance: 150,
      color: "#c8c8c8",
      opacity: 0.4,
      width: 1,
    },
    size: {
      value: 1.017060304327615,
      random: true,
      anim: {
        enable: true,
        speed: 1.181158184520175,
        size_min: 1,
        sync: true,
      },
    },
    move: {
      enable: true,
      speed: 1.5,
      direction: "none",
      random: true,
      out_mode: "out",
    },
  },

  interactivity: {
    detect_on: "window",
    events: {
      onhover: { enable: true, mode: "repulse" },
      // onclick: { enable: true, mode: "push" },
      resize: true,
    },
    modes: {
      grab: { distance: 400, line_linked: { opacity: 0.5 } },
      bubble: { distance: 400, size: 40, duration: 2, opacity: 0.2, speed: 3 },
    },
  },
};
