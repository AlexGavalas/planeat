import { type Session } from 'next-auth';
import invariant from 'tiny-invariant';

export function assertSession(session: unknown): asserts session is Session {
    invariant(session, 'User must be have a session');
}

export function assertUserEmail(email: unknown): asserts email is string {
    invariant(email, 'User must have an email');
}
