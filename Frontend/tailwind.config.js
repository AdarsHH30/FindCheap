module.exports = {
  theme: {
    extend: {
      keyframes: {
        "truck-motion": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(3px)" },
        },
        road: {
          "0%": { transform: "translateX(0px)" },
          "100%": { transform: "translateX(-350px)" },
        },
      },
      animation: {
        "truck-motion": "truck-motion 1s linear infinite",
        road: "road 1.4s linear infinite",
      },
    },
  },
};
