import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';

import { QuoteDisplay } from './quote-display';

describe('QuoteDisplay', () => {
  let component: QuoteDisplay;
  let fixture: ComponentFixture<QuoteDisplay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuoteDisplay],
    }).compileComponents();

    fixture = TestBed.createComponent(QuoteDisplay);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
