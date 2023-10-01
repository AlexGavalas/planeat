import '@testing-library/jest-dom';
import 'jest-axe/extend-expect';

Object.defineProperty(window, 'matchMedia', {
    value: jest.fn().mockImplementation((query: string) => ({
        addEventListener: jest.fn(),
        addListener: jest.fn(), // deprecated
        dispatchEvent: jest.fn(),
        matches: false,
        media: query,
        onchange: null,
        removeEventListener: jest.fn(),
        removeListener: jest.fn(), // deprecated
    })),
    writable: true,
});
