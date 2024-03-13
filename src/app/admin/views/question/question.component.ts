import { Component, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { distinctUntilChanged, take } from 'rxjs';
import { RightSidebarComponent } from 'src/app/shared/components/right-sidebar/right-sidebar.component';
import { SubSink } from 'subsink';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { Sort } from '@angular/material/sort';
import { PaggingConfigChildOfQuestionFormInterface, QuestionFormInterface } from '../../form-interfaces/question.form-interface';
import { QuestionDto } from 'src/app/shared/dtos/question.dto';
import { QuestionService } from 'src/app/shared/services/question.service';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { GetQuestionFilter } from 'src/app/shared/filters/get-question.filter';
import { AddQuestionPopupComponent } from '../../components/add-question-popup/add-question-popup.component';
import { Store } from '@ngrx/store';
import { MaterialStudyActions } from 'src/app/core/states/material-study/material-study.action';
import { StudentGradeActions } from 'src/app/core/states/student-grade/student-grade.action';
import { StudentGradeSelectors } from 'src/app/core/states/student-grade/student-grade.selector';
import { MaterialStudyLessonDto } from 'src/app/shared/dtos/material-study.-lesson.dto';
import { MaterialStudyLessonService } from 'src/app/shared/services/material-study-lesson.service';
import { MaterialStudySelectors } from 'src/app/core/states/material-study/material-study.selector';
import { TermNumberEnum } from 'src/app/shared/enums/term-number.enum';
@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnDestroy {


  private subs = new SubSink();

  rForm: FormGroup<QuestionFormInterface>;
  QuestionArr: QuestionDto[] = [];
  studentGradeArr$ = this._Store.select(StudentGradeSelectors.studentGradeArr);
  materialStudyArr$ = this._Store.select(s => MaterialStudySelectors.materialStudyArr(s, { studentGradeId: this.fCtrls?.studentGradeId.value! }));
  materialStudyLessonArr: MaterialStudyLessonDto[] = [];
  TermNumber = TermNumberEnum;

  get fCtrls() {
    return this.rForm.controls;
  }

  @ViewChild('rightSidebar', { static: false }) rightSidebar!: RightSidebarComponent;
  @ViewChild('addQuestionPopup', { static: false }) addQuestionPopup!: AddQuestionPopupComponent;

  constructor(
    private _ToastrService: ToastrService,
    private _QuestionService: QuestionService,
    private _FormBuilder: FormBuilder,
    private _Store: Store,
    private _MaterialStudyLessonService: MaterialStudyLessonService
  ) {
    this.rForm = this._FormBuilder.group<QuestionFormInterface>({
      orderBy: new FormControl(null),
      paggingConfig: this._FormBuilder.group<PaggingConfigChildOfQuestionFormInterface>({
        take: new FormControl(10, { nonNullable: true }),
        itemsPerPage: new FormControl(1, { nonNullable: true }),
        currentPage: new FormControl(1, { nonNullable: true }),
        totalItems: new FormControl(0, { nonNullable: true })
      }),
      name: new FormControl(null),
      materialStudyId: new FormControl(null),
      materialStudyLessonId: new FormControl(null),
      studentGradeId: new FormControl(null),
      termNumber: new FormControl(null),
      materialStudyUnitId: new FormControl(null),
    });
  }

  ngOnInit() {
    this.getData();
    this._Store.dispatch(StudentGradeActions.loadStudentGrade());
    this._Store.dispatch(MaterialStudyActions.loadMaterialesStudy())

    this.fCtrls.studentGradeId.valueChanges.pipe(distinctUntilChanged()).subscribe((value: any) => {
      this.materialStudyArr$ = this._Store.select(s =>
        MaterialStudySelectors.materialStudyArr(s, { studentGradeId: value }));
    });

  }

  ngAfterViewInit(): void { }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onShowAddMaterialStudyPopup(id: string | null = null) {
    this.addQuestionPopup.openModal(id);
    this.addQuestionPopup.emitter.pipe(take(1)).subscribe((result) => {
      if (result.isNew == true) {
        this.getData();
      } else {
        const index = this.QuestionArr.findIndex(x => x.id == result.data.id);
        this.QuestionArr[index] = result.data;
      }
    });
  }

  onPageChanged(event: PageChangedEvent) {
    this.fCtrls.paggingConfig.controls.currentPage.setValue(event.page);
    this.getData();
  }

  onDelete(item: QuestionDto) {
    Swal.fire({
      title: `Delete ${item.questionBook.name} `,
      text: 'Are you sure ?',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.subs.sink = this._QuestionService.delete(item.id).pipe(take(1)).subscribe(
          () => {
            this._ToastrService.success('Question  has been deleted successfully');
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
      termNumber: null,
      studentGradeId: null,
      materialStudyId: null,
      materialStudyLessonId: null,
      materialStudyUnitId: null
    });
  }

  onSorting(sort: Sort) {
    this.rForm.controls.orderBy.setValue(`${sort.active}-${sort.direction}`);
    this.getData();
  }

  private getData() {
    const formValue = this.rForm.value;
    const filter: GetQuestionFilter = {
      skip: (formValue.paggingConfig?.currentPage! - 1) * formValue.paggingConfig?.itemsPerPage!,
      take: formValue.paggingConfig?.take!,
      orderBy: formValue.orderBy!,
      name: formValue.name!,
      studentGrade: formValue.studentGradeId!,
      materialStudy: formValue.materialStudyId!,
      materialStudyLesson: formValue.materialStudyLessonId!,
      termNumber: formValue.termNumber!,
      materialStudyUnit: formValue.materialStudyUnitId!
    };
    this.subs.sink = this._QuestionService.getQestions(filter).subscribe((result) => {
      this.QuestionArr = result.data;
      console.log(result);
      this.fCtrls.paggingConfig.controls.totalItems.setValue(result.count);
    });
  }

  private getAllMaterialStudyLesson() {
    this.materialStudyLessonArr = [];
    const formValue = this.rForm.value;
    this._MaterialStudyLessonService.getAllMaterialStudyLessons({
      studentGrade: formValue.studentGradeId!,
      materialStudy: formValue.materialStudyId!,
      materialStudyUnit: formValue.materialStudyUnitId! ,
      termNumber: formValue.termNumber!
    }).subscribe(arr => {
      this.materialStudyLessonArr = arr;
    })
  }
}
