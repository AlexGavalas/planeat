// @ts-check

const { i18n } = require('./next-i18next.config');

/**
 * @type {import('next').NextConfig}
 **/
const config = {
    reactStrictMode: true,
    images: {
        domains: ['lh3.googleusercontent.com'],
    },
    i18n: {
        defaultLocale: i18n.defaultLocale,
        locales: i18n.locales,
    },
};

module.exports = config;
