import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewProblem } from './new-problem';

describe('NewProblem', () => {
  let component: NewProblem;
  let fixture: ComponentFixture<NewProblem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewProblem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewProblem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
