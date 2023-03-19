/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["public/index.html", "./src/**/*.vue"],
  theme: {
    extend: {
      maxHeight: {
        "video-list": "44rem",
      },
      backgroundSize: {
        160: "160%",
        200: "200%",
      },
    },
  },
};
