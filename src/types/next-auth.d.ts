import 'next-auth';

declare module 'next-auth' {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    interface User {
        locale?: string | null;
    }
}
