import { FormControl } from "@angular/forms";

export interface LoginFormInterface {
    phoneNumber: FormControl<string | null>;
    password:FormControl<string | null>;
}
