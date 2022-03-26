// @ts-check

/**
 * @type {import('next').NextConfig}
 **/

const { i18n } = require('./next-i18next.config');

const config = {
    reactStrictMode: true,
    images: {
        domains: ['lh3.googleusercontent.com'],
    },
    i18n,
};

module.exports = config;
