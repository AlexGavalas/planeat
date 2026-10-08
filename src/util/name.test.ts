import { getInitials } from './name';

describe('getInitials', () => {
    it.each([
        ['Test Example User', 'TU'],
        ['Test', 'T'],
        ['  Test   User  ', 'TU'],
        ['Άλεξ Γαβαλάς', 'ΆΓ'],
        [null, null],
        [undefined, null],
        ['', null],
        ['---', null],
    ])('returns initials for %p', (name, expected) => {
        expect(getInitials(name)).toBe(expected);
    });
});
