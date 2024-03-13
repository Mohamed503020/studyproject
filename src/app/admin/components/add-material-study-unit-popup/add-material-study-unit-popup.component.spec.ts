/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AddMaterialStudyUnitPopupComponent } from './add-material-study-unit-popup.component';

describe('AddMaterialStudyUnitPopupComponent', () => {
  let component: AddMaterialStudyUnitPopupComponent;
  let fixture: ComponentFixture<AddMaterialStudyUnitPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMaterialStudyUnitPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMaterialStudyUnitPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
