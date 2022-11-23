import { ValidationError } from 'class-validator';

export const formErrorMessage = (errors: ValidationError[]) => {
    const message = errors.map(error => `${error.property} - ${Object.values(error.constraints!).join(', ')}`).join('; ');
    return message;
}