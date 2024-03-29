/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { QuizeComponent } from './quize.component';

describe('QuizeComponent', () => {
  let component: QuizeComponent;
  let fixture: ComponentFixture<QuizeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuizeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
