import { QuestionBookDto } from './../../../shared/dtos/question-book.dto';
import { Component, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { distinctUntilChanged, take } from 'rxjs';
import { RightSidebarComponent } from 'src/app/shared/components/right-sidebar/right-sidebar.component';
import { SubSink } from 'subsink';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { Sort } from '@angular/material/sort';
import { PaggingConfigChildOfQuestionBookFormInterface, QuestionBookFormInterface } from '../../form-interfaces/question-book.form-interface';
import { AddQuestionBookPopupComponent } from '../../components/add-question-book-popup/add-question-book-popup.component';
import { QuestionBookService } from 'src/app/shared/services/question-book.service';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { GetQuestionBookFilter } from 'src/app/shared/filters/get-question-book.filter';
import { MaterialStudyDto } from 'src/app/shared/dtos/material-study.dto';
import { MaterialStudyService } from 'src/app/shared/services/material-study.service';
import { Store } from '@ngrx/store';
import { MaterialStudySelectors } from 'src/app/core/states/material-study/material-study.selector';
import { MaterialStudyActions } from 'src/app/core/states/material-study/material-study.action';
import { StudentGradeSelectors } from 'src/app/core/states/student-grade/student-grade.selector';
import { TermNumberEnum } from 'src/app/shared/enums/term-number.enum';
import { StaticDataSelectors } from 'src/app/core/states/static-data/static-data.selector';
import { StaticDataActions } from 'src/app/core/states/static-data/static-data.action';
@Component({
  selector: 'app-question-book',
  templateUrl: './question-book.component.html',
  styleUrls: ['./question-book.component.scss']
})
export class QuestionBookComponent implements OnDestroy {

  private subs = new SubSink();

  rForm: FormGroup<QuestionBookFormInterface>;
  QuestionBookArr: QuestionBookDto[] = [];

  termNumberArr$ = this._Store.select(StaticDataSelectors.termNumberArr);
  materialStudyArr$ = this._Store.select(s =>
    MaterialStudySelectors.materialStudyArr(s, { studentGradeId: this.fCtrls?.studentGradeId.value! }));
  studentGradeArr$ = this._Store.select(StudentGradeSelectors.studentGradeArr);

  get fCtrls() {
    return this.rForm.controls;
  }

  @ViewChild('rightSidebar', { static: false }) rightSidebar!: RightSidebarComponent;
  @ViewChild('addBookQuestionPopup', { static: false }) addBookQuestionPopup!: AddQuestionBookPopupComponent;

  constructor(
    private _ToastrService: ToastrService,
    private _QuestionBookService: QuestionBookService,
    private _FormBuilder: FormBuilder,
    private _MaterialStudyService: MaterialStudyService,
    private _Store: Store
  ) {
    this.rForm = this._FormBuilder.group<QuestionBookFormInterface>({
      name: new FormControl(null),
      termNumber: new FormControl(null),
      materialStudyId: new FormControl(null),
      studentGradeId: new FormControl(null),
      orderBy: new FormControl(null),
      paggingConfig: this._FormBuilder.group<PaggingConfigChildOfQuestionBookFormInterface>({
        take: new FormControl(10, { nonNullable: true }),
        itemsPerPage: new FormControl(10, { nonNullable: true }),
        currentPage: new FormControl(1, { nonNullable: true }),
        totalItems: new FormControl(0, { nonNullable: true })
      }),

    });
  }

  ngOnInit() {
    this._Store.dispatch(StaticDataActions.loadTermNumberArr());
    this._Store.dispatch(MaterialStudyActions.loadMaterialesStudy());
    this.fCtrls.studentGradeId.valueChanges.pipe(distinctUntilChanged()).subscribe((value: any) => {
      this.materialStudyArr$ = this._Store.select(s =>
        MaterialStudySelectors.materialStudyArr(s, { studentGradeId: value }));
    });

    this.getData();
  }

  ngAfterViewInit(): void { }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onShowAddMaterialStudyPopup(id: string | null = null) {
    this.addBookQuestionPopup.openModal(id);
    this.addBookQuestionPopup.emitter.pipe(take(1)).subscribe((result) => {
      if (result.isNew == true) {
        this.getData();
      } else {
        const index = this.QuestionBookArr.findIndex(x => x.id == result.data.id);
        this.QuestionBookArr[index] = result.data;
      }
    });
  }

  onPageChanged(event: PageChangedEvent) {
    this.fCtrls.paggingConfig.controls.currentPage.setValue(event.page);
    this.getData();
  }

  onDelete(item: QuestionBookDto) {
    Swal.fire({
      title: `Delete ${item.name} `,
      text: 'Are you sure ?',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.subs.sink = this._QuestionBookService.delete(item.id).pipe(take(1)).subscribe(
          () => {
            this._ToastrService.success('Question Book has been deleted successfully');
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
      name: null,
      studentGradeId: null
    });
  }

  onSorting(sort: Sort) {
    this.rForm.controls.orderBy.setValue(`${sort.active}-${sort.direction}`);
    this.getData();
  }

  private getData() {
    const formValue = this.rForm.value;
    const filter: GetQuestionBookFilter = {
      name: formValue.name!,
      skip: (formValue.paggingConfig?.currentPage! - 1) * formValue.paggingConfig?.itemsPerPage!,
      take: formValue.paggingConfig?.take!,
      orderBy: formValue.orderBy!,
      materialStudy: formValue.materialStudyId!,
    };
    this.subs.sink = this._QuestionBookService.getQestionBookes(filter).subscribe((result) => {
      this.QuestionBookArr = result.data;
      console.log(this.QuestionBookArr);
      this.fCtrls.paggingConfig.controls.totalItems.setValue(result.count);
    });
  }

}
