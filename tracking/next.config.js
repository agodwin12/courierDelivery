/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env: {
        GOOGLE_MAPS_API_KEY: 'AIzaSyBn88TP5X-xaRCYo5gYxvGnVy_0WYotZWo',
    },
    images: {
        domains: ['images.unsplash.com'],
    },
}

module.exports = nextConfig