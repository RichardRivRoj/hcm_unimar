module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            colors: {
                primary: '#004b9a',
                'primary-dark': '#003a7d',
            },
        },
    },
    plugins: [require('@tailwindcss/forms')],
}
