import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMaterialStudyPopupComponent } from './add-material-study-popup.component';

describe('AddMaterialStudyPopupComponent', () => {
  let component: AddMaterialStudyPopupComponent;
  let fixture: ComponentFixture<AddMaterialStudyPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddMaterialStudyPopupComponent]
    });
    fixture = TestBed.createComponent(AddMaterialStudyPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
