import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackTable } from './track-table';

describe('TrackTable', () => {
  let component: TrackTable;
  let fixture: ComponentFixture<TrackTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrackTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
