type CalculateBMI = (args: { weight: number | null; height: number }) => number;

export const calculateBMI: CalculateBMI = ({ weight, height }) => {
    if (!height || !weight) {
        return 0;
    }

    return weight / (height / 100) ** 2;
};
