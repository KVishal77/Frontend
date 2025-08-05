/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                "rooted-primary": "#4F9D69",   // Green header & buttons
                "rooted-light": "#F4F9F4",     // Light page background
            },
        },
    },
    plugins: [require('@tailwindcss/line-clamp')],
};