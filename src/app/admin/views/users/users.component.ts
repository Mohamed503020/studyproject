import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { RightSidebarComponent } from 'src/app/shared/components/right-sidebar/right-sidebar.component';
import { UserDto } from 'src/app/shared/dtos/user.dto';
import { GetUserFilter } from 'src/app/shared/filters/get-user.filter';
import { UserService } from 'src/app/shared/services/user.service';
import { SubSink } from 'subsink';
import Swal from 'sweetalert2';
import { UserFormInterface, PaggingConfigChildOfUserFormInterface } from '../../form-interfaces/user.form-interface';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnDestroy {
  private subs = new SubSink();
userArr:UserDto[]=[];
  rForm: FormGroup<UserFormInterface>;

  get fCtrls() {
    return this.rForm.controls;
  }

  @ViewChild('rightSidebar', { static: false }) rightSidebar!: RightSidebarComponent;

  constructor(
    private _ToastrService: ToastrService,
    private _UserService: UserService,
    private _FormBuilder: FormBuilder,
  ) {
    this.rForm = this._FormBuilder.group<UserFormInterface>({
      firstName:  new FormControl(null),
      phone:  new FormControl(null),
      orderBy: new FormControl(null),
      paggingConfig: this._FormBuilder.group<PaggingConfigChildOfUserFormInterface>({
        take: new FormControl(10, { nonNullable: true }),
        itemsPerPage: new FormControl(10, { nonNullable: true }),
        currentPage: new FormControl(1, { nonNullable: true }),
        totalItems: new FormControl(0, { nonNullable: true })
      }),

    });
  }

  ngOnInit() {
    // this.getData();

  }

  ngAfterViewInit(): void { }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }


  onPageChanged(event: PageChangedEvent) {
    this.fCtrls.paggingConfig.controls.currentPage.setValue(event.page);
    // this.getData();
  }

  onDelete(item:UserDto) {
    Swal.fire({
      title: `Delete ${item.firstName} ${item.lastName} `,
      text: 'Are you sure ?',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.subs.sink = this._UserService.delete(item.id).pipe(take(1)).subscribe(
          () => {
            this._ToastrService.success('User has been deleted successfully');
            // this.getData();
          },
          (err: any) => {
            this._ToastrService.error(err.error.message);
          }
        );
      }
    });
  }

  onSearch() {
    this.fCtrls.paggingConfig.controls.currentPage.setValue(1);
    // this.getData();
  }

  onClearFilter() {
    this.rForm.patchValue({
      firstName: null,
      phone:null,
    });
  }

  onSorting(sort: Sort) {
    this.rForm.controls.orderBy.setValue(`${sort.active}-${sort.direction}`);
    // this.getData();
  }

  // private getData() {
  //   const formValue = this.rForm.value;
  //   const filter: GetUserFilter= {
  //     skip: (formValue.paggingConfig?.currentPage! - 1) * formValue.paggingConfig?.itemsPerPage!,
  //     take: formValue.paggingConfig?.take!,
  //     orderBy: formValue.orderBy!,
  //     firstName: formValue.firstName!,
  //     phone: formValue.phone!
  //   };
  //   this.subs.sink = this._UserService.getUsers(filter).subscribe((result) => {
  //     this.userArr = result.data;
  //     this.fCtrls.paggingConfig.controls.totalItems.setValue(result.count);
  //   });
  // }

}
