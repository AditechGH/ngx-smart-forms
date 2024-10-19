import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SmartSelectorDemoComponent } from './smart-selector-demo.component';

describe('SmartSelectorDemoComponent', () => {
  let component: SmartSelectorDemoComponent;
  let fixture: ComponentFixture<SmartSelectorDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmartSelectorDemoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SmartSelectorDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
