import {
    type CSSVariablesResolver,
    DEFAULT_THEME,
    type MantineColorsTuple,
    createTheme,
} from '@mantine/core';

const FONT_FAMILY = [
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'Oxygen',
    'Ubuntu',
    'Cantarell',
    'Fira Sans',
    'Droid Sans',
    'Helvetica Neue',
    'sans-serif',
].join(', ');

export const BRAND_COLORS = [
    '#e6f7f1',
    '#ccefe3',
    '#99dfc7',
    '#66cea8',
    '#33be8a',
    '#04a670',
    '#047d55',
    '#046745',
    '#045438',
    '#033c28',
] satisfies MantineColorsTuple;

export const HEALTH_RANGE_COLORS = [
    '#339af0',
    '#165b99',
    '#32ad4c',
    '#ff7600',
    '#ff0000',
] as const;

export const APP_TOKENS = {
    blur: {
        glass: '0.125rem',
        glassStrong: '0.3125rem',
    },
    color: {
        chartText: '#333333',
        decorationGrid: '#a7d3a5',
        decorationMuted: '#9d9d9d',
        surfacePage: '#ecf5ec',
        surfaceStripe: '#e5f6e5',
    },
    layer: {
        behind: '-1',
        fab: '10',
        sticky: '20',
    },
    motion: {
        fast: '150ms',
    },
    size: {
        action: '2.75rem',
        calendarCellSpace: '0.3125rem',
        header: '4.25rem',
        headerMobile: '4rem',
        pageBorder: '0.3125rem',
    },
    surfaceAlpha: {
        glass: '25%',
        meal: '55%',
        mobileCard: '50%',
        overlay: '50%',
        sticky: '92%',
    },
} as const;

export const APP_THEME = createTheme({
    colors: {
        brand: BRAND_COLORS,
        danger: DEFAULT_THEME.colors.red,
        modified: DEFAULT_THEME.colors.orange,
        success: DEFAULT_THEME.colors.green,
    },
    fontFamily: FONT_FAMILY,
    fontWeights: {
        bold: '700',
        medium: '500',
        regular: '400',
        semibold: '600',
    },
    primaryColor: 'brand',
    primaryShade: 7,
    respectReducedMotion: true,
    spacing: {
        compact: '0.5rem',
        lg: '1.25rem',
        md: '1rem',
        micro: '0.125rem',
        sm: '0.75rem',
        tight: '0.375rem',
        xl: '2rem',
        xs: '0.625rem',
        xxs: '0.25rem',
    },
});

export const appCssVariablesResolver: CSSVariablesResolver = () => ({
    dark: {},
    light: {},
    variables: {
        '--app-blur-glass': APP_TOKENS.blur.glass,
        '--app-blur-glass-strong': APP_TOKENS.blur.glassStrong,
        '--app-color-border-default': 'var(--mantine-color-black)',
        '--app-color-chart-target': 'var(--mantine-color-danger-6)',
        '--app-color-chart-text': APP_TOKENS.color.chartText,
        '--app-color-decoration-grid': APP_TOKENS.color.decorationGrid,
        '--app-color-decoration-muted': APP_TOKENS.color.decorationMuted,
        '--app-color-state-modified': 'var(--mantine-color-modified-6)',
        '--app-color-surface-default': 'var(--mantine-color-white)',
        '--app-color-surface-glass': `rgb(255 255 255 / ${APP_TOKENS.surfaceAlpha.glass})`,
        '--app-color-surface-meal': `rgb(255 255 255 / ${APP_TOKENS.surfaceAlpha.meal})`,
        '--app-color-surface-mobile-card': `rgb(255 255 255 / ${APP_TOKENS.surfaceAlpha.mobileCard})`,
        '--app-color-surface-overlay': `rgb(255 255 255 / ${APP_TOKENS.surfaceAlpha.overlay})`,
        '--app-color-surface-page': APP_TOKENS.color.surfacePage,
        '--app-color-surface-sticky': `rgb(255 255 255 / ${APP_TOKENS.surfaceAlpha.sticky})`,
        '--app-color-surface-stripe': APP_TOKENS.color.surfaceStripe,
        '--app-layer-behind': APP_TOKENS.layer.behind,
        '--app-layer-fab': APP_TOKENS.layer.fab,
        '--app-layer-sticky': APP_TOKENS.layer.sticky,
        '--app-motion-fast': APP_TOKENS.motion.fast,
        '--app-size-action': APP_TOKENS.size.action,
        '--app-size-header': APP_TOKENS.size.header,
        '--app-size-header-mobile': APP_TOKENS.size.headerMobile,
        '--app-size-page-border': APP_TOKENS.size.pageBorder,
        '--app-space-calendar-cell': APP_TOKENS.size.calendarCellSpace,
        '--app-space-page': 'var(--mantine-spacing-xl)',
        '--app-space-page-mobile': 'var(--mantine-spacing-md)',
    },
});
