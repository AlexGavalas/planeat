import manifest from './manifest';

describe('web app manifest', () => {
    it('is installable with standalone display and required icon sizes', () => {
        const value = manifest();

        expect(value).toMatchObject({
            display: 'standalone',
            id: '/',
            name: 'Planeat',
            scope: '/',
            short_name: 'Planeat',
            start_url: '/',
        });
        expect(value.icons).toStrictEqual(
            expect.arrayContaining([
                expect.objectContaining({ sizes: '192x192' }),
                expect.objectContaining({ sizes: '512x512' }),
                expect.objectContaining({ purpose: 'maskable' }),
            ]),
        );
    });
});
