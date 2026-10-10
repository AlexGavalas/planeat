type RequestDateOptions = Readonly<{
    allowHeaderDate: boolean;
    environmentDate?: string;
    headerDate?: string | null;
    now?: () => Date;
}>;

export const resolveRequestDate = ({
    allowHeaderDate,
    environmentDate,
    headerDate,
    now = () => new Date(),
}: RequestDateOptions): Date => {
    const value = environmentDate ?? (allowHeaderDate ? headerDate : null);
    const parsedDate = value ? new Date(value) : null;

    return parsedDate && !Number.isNaN(parsedDate.getTime())
        ? parsedDate
        : now();
};
