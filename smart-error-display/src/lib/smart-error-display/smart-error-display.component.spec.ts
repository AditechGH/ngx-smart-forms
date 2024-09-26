import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SmartErrorDisplayComponent } from './smart-error-display.component';

describe('SmartErrorDisplayComponent', () => {
  let component: SmartErrorDisplayComponent;
  let fixture: ComponentFixture<SmartErrorDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmartErrorDisplayComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SmartErrorDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
