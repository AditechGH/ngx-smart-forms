import { ElementRef, Renderer2 } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { By } from '@angular/platform-browser';
import { SmartErrorDisplayComponent } from './smart-error-display.component';

describe('SmartErrorDisplayComponent', () => {
  let component: SmartErrorDisplayComponent;
  let fixture: ComponentFixture<SmartErrorDisplayComponent>;
  let mockElementRef: ElementRef;

  beforeEach(async () => {
    mockElementRef = new ElementRef(document.createElement('input'));

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, SmartErrorDisplayComponent],
      providers: [{ provide: ElementRef, useValue: mockElementRef }, Renderer2],
    }).compileComponents();

    fixture = TestBed.createComponent(SmartErrorDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.inputRef = mockElementRef;
  });

  // Helper functions
  const setupControl = (
    value: string,
    validators: ValidatorFn | ValidatorFn[] = Validators.required
  ) => {
    component.control = new FormControl(value, validators);
    component.ngOnInit();
  };

  const simulateInputChange = (value: string | null, ms = 300) => {
    if (component.control && value !== null) {
      component.control.setValue(value);
    }
    tick(ms);
    fixture.detectChanges();
  };

  const getErrorDisplayText = (): string => {
    const errorDisplay = fixture.debugElement.query(
      By.css('#smart-error-display')
    );
    return errorDisplay ? errorDisplay.nativeElement.textContent : '';
  };

  const markControlAsTouched = () => component.control?.markAsTouched();

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not display errors if the control is valid', fakeAsync(() => {
    setupControl('valid value', Validators.required);
    markControlAsTouched();

    simulateInputChange('valid value');
    expect(
      fixture.debugElement.query(By.css('#smart-error-display'))
    ).toBeNull();
  }));

  it('should display the default error message for the form control', fakeAsync(() => {
    setupControl('', Validators.required);
    markControlAsTouched();

    simulateInputChange('');
    expect(getErrorDisplayText()).toContain('This field is required.');
  }));

  it('should display custom error messages if provided', fakeAsync(() => {
    setupControl('', Validators.required);
    component.customMessages = { required: 'Custom required message' };
    markControlAsTouched();

    simulateInputChange('');
    expect(getErrorDisplayText()).toContain('Custom required message');
  }));

  it('should display multiple error messages for multiple validations', fakeAsync(() => {
    setupControl('', [Validators.required, Validators.minLength(5)]);
    markControlAsTouched();

    simulateInputChange('');
    expect(getErrorDisplayText()).toContain('This field is required.');

    simulateInputChange('1234');
    expect(getErrorDisplayText()).toContain('The value is too short.');
  }));

  it('should display errors only on blur when displayOn is set to "blur"', fakeAsync(() => {
    setupControl('', Validators.required);
    component.displayOn = 'blur';
    markControlAsTouched();

    // Simulate focus
    component.handleFocus();
    simulateInputChange('');

    expect(
      fixture.debugElement.query(By.css('#smart-error-display'))
    ).toBeNull();

    // Simulate blur
    component.handleBlur();
    fixture.detectChanges();

    expect(getErrorDisplayText()).toContain('This field is required.');
  }));

  it('should display errors on focus when displayOn is set to "focus"', fakeAsync(() => {
    setupControl('', Validators.required);
    component.displayOn = 'focus';
    markControlAsTouched();

    simulateInputChange('');
    expect(
      fixture.debugElement.query(By.css('#smart-error-display'))
    ).toBeNull();

    // Simulate focus
    component.handleFocus();
    fixture.detectChanges();

    expect(getErrorDisplayText()).toContain('This field is required.');
  }));

  it('should display errors on hover when displayOn is set to "hover"', fakeAsync(() => {
    setupControl('', Validators.required);
    component.displayOn = 'hover';
    markControlAsTouched();

    simulateInputChange('');
    expect(
      fixture.debugElement.query(By.css('#smart-error-display'))
    ).toBeNull();

    // Simulate hover
    component.handleMouseEnter();
    fixture.detectChanges();

    expect(getErrorDisplayText()).toContain('This field is required.');
  }));

  it('should respect debounce time for error display', fakeAsync(() => {
    component.debounceTime = 500;
    setupControl('', Validators.required);
    markControlAsTouched();

    simulateInputChange('', 400);
    expect(
      fixture.debugElement.query(By.css('#smart-error-display'))
    ).toBeNull();

    simulateInputChange(null, 100);
    expect(getErrorDisplayText()).toContain('This field is required.');
  }));

  it('should log errors using analyticsService if provided', fakeAsync(() => {
    const logSpy = jest.fn();
    component.analyticsService = { logEvent: logSpy };
    setupControl('', Validators.required);
    markControlAsTouched();

    simulateInputChange('');
    expect(logSpy).toHaveBeenCalledWith('form_error', { error: 'required' });
  }));

  it('should translate error messages if translationService is provided', fakeAsync(() => {
    const translateSpy = jest.fn((message: string) => 'Translated: ' + message);
    component.translationService = { translate: translateSpy };
    setupControl('', Validators.required);
    markControlAsTouched();

    simulateInputChange('');
    expect(getErrorDisplayText()).toContain(
      'Translated: This field is required.'
    );
  }));

  it('should not display errors if no form control is provided', fakeAsync(() => {
    component.control = null;
    component.ngOnInit();
    fixture.detectChanges();

    expect(
      fixture.debugElement.query(By.css('#smart-error-display'))
    ).toBeNull();
  }));

  it('should display default message if no custom message is provided for unknown error', fakeAsync(() => {
    const unknownValidator: ValidatorFn = (): ValidationErrors => ({
      unknownError: true,
    });
    setupControl('', [unknownValidator]);
    markControlAsTouched();

    simulateInputChange('abc');
    expect(getErrorDisplayText()).toContain('Invalid input.');
  }));

  it('should default debounce time to 300ms if invalid debounceTime is provided', fakeAsync(() => {
    component.debounceTime = -100;
    setupControl('', Validators.required);
    markControlAsTouched();

    simulateInputChange('');
    expect(getErrorDisplayText()).toContain('This field is required.');
  }));
});
