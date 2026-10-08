export const getInitials = (name: string | null | undefined): string | null => {
    const parts = name?.trim().split(/\s+/).filter(Boolean) ?? [];
    const first = parts.at(0)?.match(/[\p{L}\p{N}]/u)?.[0];
    const last = parts.at(-1)?.match(/[\p{L}\p{N}]/u)?.[0];

    if (!first) {
        return null;
    }

    return (parts.length === 1 ? first : `${first}${last ?? ''}`).toUpperCase();
};
