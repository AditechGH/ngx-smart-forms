import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SmartInputTypeDemoComponent } from './smart-input-type-demo.component';
import { By } from '@angular/platform-browser';

describe('SmartInputDemoComponent', () => {
  let component: SmartInputTypeDemoComponent;
  let fixture: ComponentFixture<SmartInputTypeDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, SmartInputTypeDemoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SmartInputTypeDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Enhanced Input Validation and Formatting', () => {
    it('should transform alphanumeric input (no spaces)', () => {
      const input = fixture.debugElement.query(
        By.css('#alphanumeric-no-spaces')
      ).nativeElement;
      input.value = 'Test 123!@#';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(input.value).toBe('Test123');
    });

    it('should allow alphanumeric input with spaces', () => {
      const input = fixture.debugElement.query(
        By.css('#alphanumeric-with-spaces')
      ).nativeElement;
      input.value = 'Test 123!@#';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(input.value).toBe('Test 123');
    });

    it('should validate numeric input without spaces', () => {
      const input = fixture.debugElement.query(
        By.css('#numeric-no-spaces')
      ).nativeElement;
      input.value = '123abc';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(input.value).toBe('123');
    });

    it('should allow numeric input with spaces', () => {
      const input = fixture.debugElement.query(
        By.css('#numeric-with-spaces')
      ).nativeElement;
      input.value = '123 abc';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(input.value).toBe('123 ');
    });

    it('should transform alpha input (no spaces)', () => {
      const input = fixture.debugElement.query(
        By.css('#alpha-no-spaces')
      ).nativeElement;
      input.value = 'Test123';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(input.value).toBe('Test');
    });

    it('should allow alpha input with spaces', () => {
      const input = fixture.debugElement.query(
        By.css('#alpha-with-spaces')
      ).nativeElement;
      input.value = 'Test 123';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(input.value).toBe('Test ');
    });

    it('should validate input based on custom pattern', () => {
      const input = fixture.debugElement.query(
        By.css('#custom-pattern')
      ).nativeElement;
      input.value = '123abc';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(input.value).toBe('123');
    });

    it('should handle language-specific input (Spanish)', () => {
      const input = fixture.debugElement.query(
        By.css('#language-specific-input')
      ).nativeElement;
      input.value = 'testéñ123';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(input.value).toBe('testéñ123');
    });

    it('should handle language-specific input (Arabic numerals)', () => {
      const input = fixture.debugElement.query(
        By.css('#arabic-numerals')
      ).nativeElement;
      input.value = '123٤٥٦abc';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(input.value).toBe('٤٥٦');
    });

    it('should transform input to uppercase', () => {
      const input = fixture.debugElement.query(
        By.css('#case-sensitive-input')
      ).nativeElement;
      input.value = 'test123';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(input.value).toBe('TEST123');
    });

    it('should work with password input type', () => {
      const input = fixture.debugElement.query(
        By.css('#password')
      ).nativeElement;
      fixture.detectChanges();

      expect(input.type).toBe('password');
    });

    it('should debounce input validation', async () => {
      jest.useFakeTimers();
      const input = fixture.debugElement.query(
        By.css('#debounce-input')
      ).nativeElement;
      input.value = 'Test123';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      jest.advanceTimersByTime(500); // Debounce time
      fixture.detectChanges();

      // You can extend the test to verify additional behavior after debounce.
      expect(input.value).toBe('Test123');
    });

    it('should handle language set with case transformation', () => {
      const input = fixture.debugElement.query(
        By.css('#language-set-case-sensitivity')
      ).nativeElement;
      input.value = 'tëst123';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(input.value).toBe('tëst123');
    });

    it('should add .has-error class for invalid email input', () => {
      const inputElement = fixture.debugElement.query(
        By.css('#visual-feedback-input')
      ).nativeElement;

      inputElement.value = 'invalidEmail';
      inputElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(inputElement.classList).toContain('has-error');
    });

    it('should not have .has-error class for valid email input', () => {
      const inputElement = fixture.debugElement.query(
        By.css('#visual-feedback-input')
      ).nativeElement;

      inputElement.value = 'test@example.com';
      inputElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(inputElement.classList).not.toContain('has-error');
    });
  });

  describe('Enhanced Form Validation', () => {
    it('should show error for invalid email', () => {
      const emailInput = fixture.debugElement.query(
        By.css('#email')
      ).nativeElement;
      emailInput.value = 'invalidEmail';
      emailInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      const errorDiv = fixture.debugElement.query(
        By.css('#email + div')
      ).nativeElement;

      expect(errorDiv.textContent).toContain('Invalid Email');
    });

    it('should show error for invalid URL', () => {
      const urlInput = fixture.debugElement.query(By.css('#url')).nativeElement;
      urlInput.value = 'invalid-url';
      urlInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      const errorDiv = fixture.debugElement.query(
        By.css('#url + div')
      ).nativeElement;

      expect(errorDiv.textContent).toContain('Invalid URL format');
    });

    it('should show error for invalid phone number', () => {
      const telInput = fixture.debugElement.query(By.css('#tel')).nativeElement;
      telInput.value = 'abc123';
      telInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      const errorDiv = fixture.debugElement.query(
        By.css('#tel + div')
      ).nativeElement;

      expect(errorDiv.textContent).toContain('Invalid phone number');
    });

    it('should not show errors for valid form inputs', () => {
      const emailInput = fixture.debugElement.query(
        By.css('#email')
      ).nativeElement;
      emailInput.value = 'test@example.com';
      emailInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      const errorDiv = fixture.debugElement.query(
        By.css('#email + div')
      )?.nativeElement;

      expect(errorDiv).toBeFalsy();
    });
  });
});
