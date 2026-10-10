// @ts-check

const isAnalyze = process.env.ANALYZE === 'true';

const withBundleAnalyzer = require('@next/bundle-analyzer')({ enabled: true });

/**
 * @type {import('next').NextConfig}
 **/
const config = {
    reactCompiler: true,
    experimental: {
        agentUpgrade: 'latest',
        turbopackRustReactCompiler: !isAnalyze,
    },
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
    async rewrites() {
        return [{ source: '/:locale(en|gr)/:path*', destination: '/:path*' }];
    },
};

module.exports = isAnalyze ? withBundleAnalyzer(config) : config;
