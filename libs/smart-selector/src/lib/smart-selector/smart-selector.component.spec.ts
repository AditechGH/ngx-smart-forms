import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SmartSelectorComponent } from './smart-selector.component';

describe('SmartSelectorComponent', () => {
  let component: SmartSelectorComponent;
  let fixture: ComponentFixture<SmartSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmartSelectorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SmartSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
