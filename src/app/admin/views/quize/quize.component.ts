import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { QuizeDto } from 'src/app/shared/dtos/quize.dto';
import { GetMaterialStudiesFilterModel } from 'src/app/shared/filters/get-material-studies.filter';
import { QuizeService } from 'src/app/shared/services/quize.service';
import { SubSink } from 'subsink';
import Swal from 'sweetalert2';
import { QuizeFormInterface, PaggingConfigChildOfQuizeFormInterface } from '../../form-interfaces/quize.form-interface';
import { GetQuizeFilter } from 'src/app/shared/filters/get-quize.filter';
import { AddQuizePopupComponent } from '../../components/add-quize-popup/add-quize-popup.component';

@Component({
  selector: 'app-quize',
  templateUrl: './quize.component.html',
  styleUrls: ['./quize.component.scss']
})
export class QuizeComponent implements OnInit {

  private subs = new SubSink();

  rForm: FormGroup<QuizeFormInterface>;
 quizeArr: QuizeDto[] = [];

  get fCtrls() {
    return this.rForm.controls;
  }

  // @ViewChild('rightSidebar', { static: false }) rightSidebar!: RightSidebarComponent;
  @ViewChild('addQuizePopup', { static: false }) addQuizePopup!: AddQuizePopupComponent;

  constructor(
    private _ToastrService: ToastrService,
    private _QuizeService: QuizeService,
    private _FormBuilder: FormBuilder,
  ) {
    this.rForm = this._FormBuilder.group<QuizeFormInterface>({
      orderBy: new FormControl(null),
      paggingConfig: this._FormBuilder.group<PaggingConfigChildOfQuizeFormInterface>({
        take: new FormControl(10, { nonNullable: true }),
        itemsPerPage: new FormControl(10, { nonNullable: true }),
        currentPage: new FormControl(1, { nonNullable: true }),
        totalItems: new FormControl(0, { nonNullable: true })
      })
    });
  }

  ngOnInit() {
    this.getData();

  }

  ngAfterViewInit(): void { }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onShowAddQuizePopup(id: string | null = null) {
    this.addQuizePopup.openModal(id);
    this.addQuizePopup.emitter.pipe(take(1)).subscribe((result) => {
      if (result.isNew == true) {
        this.getData();
      } else {
        const index = this.quizeArr.findIndex(x => x.id == result.data.id);
        this.quizeArr[index] = result.data;
      }
    });
  }

  onPageChanged(event: PageChangedEvent) {
    this.fCtrls.paggingConfig.controls.currentPage.setValue(event.page);
    this.getData();
  }

  onDelete(item:QuizeDto) {
    Swal.fire({
      title: `Delete ${item.name} `,
      text: 'Are you sure ?',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.subs.sink = this._QuizeService.delete(item.id).pipe(take(1)).subscribe(
          () => {
            this._ToastrService.success('Quize has been deleted successfully');
            this.getData();
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
    this.getData();
  }

  onClearFilter() {
    this.rForm.patchValue({
    });
  }

  onSorting(sort: Sort) {
    this.rForm.controls.orderBy.setValue(`${sort.active}-${sort.direction}`);
    this.getData();
  }

  private getData() {
    const formValue = this.rForm.value;
    const filter: GetQuizeFilter = {
      skip: (formValue.paggingConfig?.currentPage! - 1) * formValue.paggingConfig?.itemsPerPage!,
      take: formValue.paggingConfig?.take!,
      orderBy: formValue.orderBy!,
    };
    this.subs.sink = this._QuizeService.getQuizes(filter).subscribe((result) => {
      this.quizeArr = result.data;
      this.fCtrls.paggingConfig.controls.totalItems.setValue(result.count);
    });
  }

}
