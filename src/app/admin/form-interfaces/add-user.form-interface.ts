import { FormControl } from "@angular/forms";

export interface AddUserFormInterface {
  firstName:FormControl<string | null>;
  lastName:FormControl<string | null>;
  email:FormControl<string | null>;
  password:FormControl<string | null>;
  phoneNumber: FormControl<string | null>;
  userType:FormControl<number | null>;
}
