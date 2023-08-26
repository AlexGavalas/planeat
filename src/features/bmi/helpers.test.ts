import { calculateBMI } from './helpers';

describe('calculateBMI', () => {
    it('calculates BMI correctly', () => {
        expect(calculateBMI({ weight: 80, height: 180 })).toBe(
            24.691358024691358,
        );
    });

    describe('when height is missing', () => {
        it('returns 0', () => {
            expect(calculateBMI({ weight: 80 })).toBe(0);
        });
    });

    describe('when weight is missing', () => {
        it('returns 0', () => {
            expect(calculateBMI({ height: 180 })).toBe(0);
        });
    });
});
