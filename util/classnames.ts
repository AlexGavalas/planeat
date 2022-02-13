export const getClassnames = (
    options: Record<string, boolean>,
    defaultClassnames = ''
) =>
    Object.entries(options)
        .filter(([, value]) => value)
        .reduce((acc, [key]) => `${acc} ${key}`, defaultClassnames);
