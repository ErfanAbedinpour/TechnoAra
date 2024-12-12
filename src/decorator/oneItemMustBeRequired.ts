import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";


@ValidatorConstraint({ name: 'AtOneLeastRequired', async: false })
export class AtOneLeastRequired<T extends object> implements ValidatorConstraintInterface {
    validate(
        _: unknown,
        validationArguments?: ValidationArguments,
    ): Promise<boolean> | boolean {
        const myDto = validationArguments.object as T;

        let isOneRequired = false
        for (const prop in myDto) {
            if (myDto[prop]) {
                isOneRequired = true;
                break;
            }
        }
        return isOneRequired
    }
    defaultMessage(validationArguments?: ValidationArguments): string {
        return "At least one Property must be required."
    }
}