import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialStudyComponent } from './material-study.component';

describe('MaterialStudyComponent', () => {
  let component: MaterialStudyComponent;
  let fixture: ComponentFixture<MaterialStudyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MaterialStudyComponent]
    });
    fixture = TestBed.createComponent(MaterialStudyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
