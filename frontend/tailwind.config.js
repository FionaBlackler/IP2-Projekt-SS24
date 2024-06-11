/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,jsx}'],
    theme: {
        extend: {
            colors: {
                'primary-color': '#FEF2DE',
                'secondary-color': '#AF8A74',
                'accent-color': '#73594b',
            },
        },
    },
    plugins: [],
}
