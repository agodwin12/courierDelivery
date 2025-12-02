import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                green: {
                    primary: '#8BC34A',
                    dark: '#7CB342',
                    light: '#AED581',
                    50: '#F1F8E9',
                    100: '#DCEDC8',
                    200: '#C5E1A5',
                    300: '#AED581',
                    400: '#9CCC65',
                    500: '#8BC34A',
                    600: '#7CB342',
                    700: '#689F38',
                    800: '#558B2F',
                    900: '#33691E',
                },
            },
            fontFamily: {
                sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Helvetica Neue', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
export default config