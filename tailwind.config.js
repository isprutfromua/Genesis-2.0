/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["public/index.html", "./src/**/*.vue"],
  theme: {
    extend: {
      maxHeight: {
        128: "32rem",
      },
      backgroundSize: {
        160: "160%",
        200: "200%",
      },
    },
  },
};
