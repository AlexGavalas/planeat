import { type MetadataRoute } from 'next';

const APP_NAME = 'Planeat';
const APP_DESCRIPTION = 'Plan meals, track health, and eat better together.';

export default function manifest(): MetadataRoute.Manifest {
    return {
        background_color: '#ecf5ec',
        categories: ['food', 'health', 'lifestyle'],
        description: APP_DESCRIPTION,
        display: 'standalone',
        icons: [
            {
                purpose: 'any',
                sizes: '192x192',
                src: '/icons/icon-192x192.png',
                type: 'image/png',
            },
            {
                purpose: 'any',
                sizes: '512x512',
                src: '/icons/icon-512x512.png',
                type: 'image/png',
            },
            {
                purpose: 'maskable',
                sizes: '512x512',
                src: '/icons/maskable-icon-512x512.png',
                type: 'image/png',
            },
        ],
        id: '/',
        name: APP_NAME,
        orientation: 'natural',
        scope: '/',
        short_name: APP_NAME,
        start_url: '/',
        theme_color: '#047d55',
    };
}
