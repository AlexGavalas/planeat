// @ts-check

const isAnalyze = process.env.ANALYZE === 'true';

const withBundleAnalyzer = require('@next/bundle-analyzer')({ enabled: true });

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
};

module.exports = isAnalyze ? withBundleAnalyzer(config) : config;
