import NextAuth from 'next-auth';
import { type NextRequest } from 'next/server';

import { authOptions } from '~api/auth-options';

const handler = NextAuth(authOptions) as (
    request: NextRequest,
    context: { params: Promise<{ nextauth: string[] }> },
) => Promise<Response>;

export { handler as GET, handler as POST };
