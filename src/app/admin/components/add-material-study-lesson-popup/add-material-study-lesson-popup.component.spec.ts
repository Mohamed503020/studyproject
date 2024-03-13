/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AddMaterialStudyLessonPopupComponent } from './add-material-study-lesson-popup.component';

describe('AddMaterialStudyLessonPopupComponent', () => {
  let component: AddMaterialStudyLessonPopupComponent;
  let fixture: ComponentFixture<AddMaterialStudyLessonPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMaterialStudyLessonPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMaterialStudyLessonPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
