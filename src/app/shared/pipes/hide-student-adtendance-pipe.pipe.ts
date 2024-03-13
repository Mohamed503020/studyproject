import { Pipe, PipeTransform } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AddStudentAdtendanceChildPopupFormInerface } from 'src/app/admin/form-interfaces/add-student-adtendance-popup.form-inerface';

@Pipe({
  name: 'hideStudentAdtendancePipe'
})
export class HideStudentAdtendancePipePipe implements PipeTransform {

  transform(value: FormGroup<AddStudentAdtendanceChildPopupFormInerface>[], search: string): FormGroup<AddStudentAdtendanceChildPopupFormInerface>[] {
    var arr = [...value];
    if(search != null && search != ''){
      arr = arr.filter(x => x.controls.name.value!.toLowerCase().includes(search.toLowerCase()));
    }
    return arr;
  }
}
