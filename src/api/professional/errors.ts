export type ProfessionalErrorCode =
    | 'active_clients'
    | 'already_managed'
    | 'capacity_reached'
    | 'forbidden'
    | 'invalid_relationship'
    | 'not_professional';

export class ProfessionalError extends Error {
    constructor(readonly code: ProfessionalErrorCode) {
        super(code);
        this.name = 'ProfessionalError';
    }
}
