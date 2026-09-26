import { randomBytes, scrypt, timingSafeEqual } from 'crypto';

const KEY_LENGTH = 64;
const ALGORITHM = 'scrypt';

const deriveKey = (password: string, salt: string): Promise<Buffer> =>
    new Promise((resolve, reject) => {
        scrypt(password, salt, KEY_LENGTH, (error, key) => {
            if (error) {
                reject(error);
                return;
            }

            resolve(key);
        });
    });

export const hashPassword = async (password: string): Promise<string> => {
    const salt = randomBytes(16).toString('hex');
    const hash = await deriveKey(password, salt);

    return `${ALGORITHM}:${salt}:${hash.toString('hex')}`;
};

export const verifyPassword = async (
    password: string,
    storedPassword: string,
): Promise<boolean> => {
    const [algorithm, salt, storedHash] = storedPassword.split(':');

    if (algorithm !== ALGORITHM || !salt || !storedHash) {
        return false;
    }

    const expected = Buffer.from(storedHash, 'hex');

    if (expected.length !== KEY_LENGTH) {
        return false;
    }

    const actual = await deriveKey(password, salt);

    return timingSafeEqual(actual, expected);
};
