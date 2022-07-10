import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateMovementComponent } from './update-movement.component';

describe('UpdateMovementComponent', () => {
  let component: UpdateMovementComponent;
  let fixture: ComponentFixture<UpdateMovementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateMovementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateMovementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
