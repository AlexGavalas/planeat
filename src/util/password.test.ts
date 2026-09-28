import { hashPassword, verifyPassword } from './password';

describe('password utilities', () => {
    it('hashes and verifies a password without storing it directly', async () => {
        expect.assertions(3);

        const password = 'a-secure-password';
        const hash = await hashPassword(password);

        expect(hash).not.toContain(password);

        await expect(verifyPassword(password, hash)).resolves.toBe(true);
        await expect(verifyPassword('the-wrong-password', hash)).resolves.toBe(
            false,
        );
    });

    it('rejects malformed stored passwords', async () => {
        expect.assertions(1);

        await expect(verifyPassword('password', 'invalid')).resolves.toBe(
            false,
        );
    });
});
