// @ts-check

const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
});

const { i18n } = require('./next-i18next.config');

/**
 * @type {import('next').NextConfig}
 **/
const config = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '*.googleusercontent.com',
                port: '',
                pathname: '**',
            },
        ],
    },
    i18n: {
        defaultLocale: i18n.defaultLocale,
        locales: i18n.locales,
    },
    experimental: {
        esmExternals: false,
    },
    swcMinify: false,
};

module.exports = withBundleAnalyzer(config);
