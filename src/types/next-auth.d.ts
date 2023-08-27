import 'next-auth';

declare module 'next-auth' {
    interface User {
        locale?: string | null;
    }
}
