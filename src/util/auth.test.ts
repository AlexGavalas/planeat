import { makeSessionSerializable } from './auth';

describe('makeSessionSerializable', () => {
    it('uses null when a session user has no image', () => {
        expect(
            makeSessionSerializable({
                expires: '2099-01-01T00:00:00.000Z',
                user: {
                    email: 'user@example.com',
                    name: 'Example User',
                },
            }),
        ).toStrictEqual({
            expires: '2099-01-01T00:00:00.000Z',
            user: {
                email: 'user@example.com',
                image: null,
                name: 'Example User',
            },
        });
    });
});
