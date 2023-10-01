import { calculateBMI } from './helpers';

describe('calculateBMI', () => {
    it('calculates BMI correctly', () => {
        expect(calculateBMI({ height: 180, weight: 80 })).toBe(
            24.691358024691358,
        );
    });

    describe('when height is `0`', () => {
        it('returns `0`', () => {
            expect(calculateBMI({ height: 0, weight: 80 })).toBe(0);
        });
    });

    describe('when weight is `null`', () => {
        it('returns `0`', () => {
            expect(calculateBMI({ height: 180, weight: null })).toBe(0);
        });
    });
});
