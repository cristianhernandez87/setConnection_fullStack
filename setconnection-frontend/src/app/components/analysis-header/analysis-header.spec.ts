import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisHeader } from './analysis-header';

describe('AnalysisHeader', () => {
  let component: AnalysisHeader;
  let fixture: ComponentFixture<AnalysisHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalysisHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalysisHeader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
