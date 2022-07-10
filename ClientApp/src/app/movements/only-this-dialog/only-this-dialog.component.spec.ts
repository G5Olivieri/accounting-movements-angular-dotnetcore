import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlyThisDialogComponent } from './only-this-dialog.component';

describe('OnlyThisDialogComponent', () => {
  let component: OnlyThisDialogComponent;
  let fixture: ComponentFixture<OnlyThisDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnlyThisDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnlyThisDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
