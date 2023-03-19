/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["public/index.html", "./src/**/*.vue"],
  theme: {
    extend: {
      maxHeight: {
        "video-list": "30rem",
      },
      backgroundSize: {
        160: "160%",
        200: "200%",
      },
    },
  },
};
