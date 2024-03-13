import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { SubSink } from 'subsink';
import { ToastrService } from 'ngx-toastr';
import { AddStudentFormPopupInterface } from '../../form-interfaces/add-student-popup.form-interface';
import { StudentService } from 'src/app/shared/services/student.service';
import { GenderEnum } from 'src/app/shared/enums/gender.enum';
import { Store } from '@ngrx/store';
import { StudentGradeActions } from 'src/app/core/states/student-grade/student-grade.action';
import { StudentGradeSelectors } from 'src/app/core/states/student-grade/student-grade.selector';
import { confirmPasswordValidator, passwordValidator } from 'src/app/shared/validators/password-validator';
import { UserService } from 'src/app/shared/services/user.service';
@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.scss']
})
export class RegisterUserComponent implements OnInit {
  private subs = new SubSink();
  genders = [
    { value: GenderEnum.Male, label: 'Male' },
    { value: GenderEnum.Female, label: 'Female' }
  ]
  studentGradeArr$ = this._Store.select(StudentGradeSelectors.studentGradeArr);

  rForm?: FormGroup<AddStudentFormPopupInterface>;
  constructor(
    private _FormBuilder: FormBuilder,
    private _UserService:UserService,
    private _ToastrService : ToastrService,
    private _Store: Store,
  ) {
    this.rForm = this._FormBuilder.group<AddStudentFormPopupInterface>({
      firstName: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      phoneNumber: new FormControl(null, Validators.required),
      password: new FormControl(null, [Validators.required, passwordValidator()]),
      confirmPassword: new FormControl(null, [Validators.required]),
      gender: new FormControl(null, Validators.required),
      studentGradeId: new FormControl(null, Validators.required),
    },{

        validators: confirmPasswordValidator(),

    });

  }
  get fCtrls() {
    return this.rForm!.controls;
  }
  ngOnInit(): void {
    this._Store.dispatch(StudentGradeActions.loadStudentGrade());
  }
  onSave(){
    const formValue = this.rForm?.value;
    console.log(formValue);
    const x={
      password: this.fCtrls?.password.value!,
      firstName: this.fCtrls?.firstName.value!,
      lastName: this.fCtrls?.lastName.value!,
      gender: this.fCtrls?.gender.value!,
      phoneNumber: this.fCtrls?.phoneNumber.value!,
      email: this.fCtrls?.email.value!,
      studentGrade: this.fCtrls?.studentGradeId.value!,
    }
    console.log(x);
    const observ = this._UserService.create({
      phoneNumber: this.fCtrls?.phoneNumber.value!,
      password: this.fCtrls?.password.value!,
      firstName: this.fCtrls?.firstName.value!,
      lastName: this.fCtrls?.lastName.value!,
      email: this.fCtrls?.email.value!,
      gender: this.fCtrls?.gender.value!,
      studentGrade: this.fCtrls?.studentGradeId.value!,

    });
    this.subs.sink = observ.subscribe((res) => {
      this._ToastrService.success('create Account succesfully ');
    },err=>{
      this._ToastrService.error(err.error.message);
    })
  }

}
