import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/shared/services/user.service';
import { SubSink } from 'subsink';
import { LoginFormInterface } from '../../form-interfaces/login.form-interface';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  private subs = new SubSink();
  rForm?: FormGroup<LoginFormInterface>;
  constructor(
    private _FormBuilder: FormBuilder,
    private _AuthService:AuthService,
    private _ToastrService : ToastrService
  ) {
    this.rForm = this._FormBuilder.group<LoginFormInterface>({
      phoneNumber: new FormControl(null),
      password: new FormControl(null)
    });

  }
  get fCtrls() {
    return this.rForm!.controls;
  }
  ngOnInit(): void {
  }
  onSave(){
    const formValue = this.rForm?.value;
    console.log(formValue);
    const observ = this._AuthService.login({
      phoneNumber: this.fCtrls.phoneNumber.value!,
      password:  this.fCtrls.password.value!
    });
    this.subs.sink = observ.subscribe((res) => {
      this._ToastrService.success('create Account succesfully ');
      console.log(res);
    },err=>{
      this._ToastrService.error(err.error.message);
    })
    this._AuthService.currentUserObserv.subscribe(res=>{
      console.log(res);
          })
  }

}
