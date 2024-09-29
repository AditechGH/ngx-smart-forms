import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SmartErrorDisplayComponent } from '@ngx-smart-forms/smart-error-display';
import { By } from '@angular/platform-browser';

import { SmartErrorDisplayDemoComponent } from './smart-error-display-demo.component';

describe('SmartErrorDisplayDemoComponent', () => {
  let component: SmartErrorDisplayDemoComponent;
  let fixture: ComponentFixture<SmartErrorDisplayDemoComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        SmartErrorDisplayComponent,
        SmartErrorDisplayDemoComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SmartErrorDisplayDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Basic Form Validation', () => {
    it('should display required error when username is empty', fakeAsync(() => {
      const usernameInput = fixture.debugElement.query(
        By.css('input[formControlName="username"]')
      );
      usernameInput.nativeElement.value = '';
      usernameInput.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      tick(400);

      const errorDisplay = fixture.debugElement.query(By.css('#usernameError'));
      expect(errorDisplay.nativeElement.textContent).toContain(
        'This field is required.'
      );
    }));

    it('should remove error when username becomes valid', fakeAsync(() => {
      const usernameInput = fixture.debugElement.query(
        By.css('input[formControlName="username"]')
      );
      usernameInput.nativeElement.value = 'validUsername';
      usernameInput.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      tick(400);

      const errorDisplay = fixture.debugElement.query(By.css('#usernameError'));
      expect(errorDisplay.nativeElement.textContent).toBe('');
    }));
  });

  describe('Custom Error Messages', () => {
    it('should display custom error message when username is too short', fakeAsync(() => {
      const usernameInput = fixture.debugElement.query(
        By.css('input[formControlName="customUsername"]')
      );
      usernameInput.nativeElement.value = 'ab';
      usernameInput.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      tick(400);

      const errorDisplay = fixture.debugElement.query(
        By.css('#customUsernameError')
      );
      expect(errorDisplay.nativeElement.textContent).toContain(
        'Username must be at least 3 characters long.'
      );
    }));
  });

  describe('Custom Error Formatter', () => {
    it('should display custom error formatter message', fakeAsync(() => {
      const usernameInput = fixture.debugElement.query(
        By.css('input[formControlName="customFormatterUsername"]')
      );
      usernameInput.nativeElement.value = 'ab';
      usernameInput.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      tick(400);

      const errorDisplay = fixture.debugElement.query(
        By.css('#customFormatterUsernameError')
      );
      expect(errorDisplay.nativeElement.textContent).toContain(
        'Minimum length is 5 characters.'
      );
    }));
  });

  describe('Theming', () => {
    it('should apply dark theme', fakeAsync(() => {
      const usernameInput = fixture.debugElement.query(
        By.css('input[formControlName="themeUsername"]')
      );
      usernameInput.nativeElement.value = '';
      usernameInput.nativeElement.dispatchEvent(new Event('input'));

      fixture.detectChanges();
      tick(400);

      const errorDisplay = fixture.debugElement.query(
        By.css('#themeUsernameError')
      );

      expect(errorDisplay.nativeElement.innerHTML).toContain(
        'color: rgb(255, 82, 82)'
      );
    }));

    it('should apply custom styles', fakeAsync(() => {
      const emailInput = fixture.debugElement.query(
        By.css('input[formControlName="themeEmail"]')
      );
      emailInput.nativeElement.value = '';
      emailInput.nativeElement.dispatchEvent(new Event('input'));

      fixture.detectChanges();
      tick(400);

      const errorDisplay = fixture.debugElement.query(
        By.css('#themeEmailError')
      );

      expect(errorDisplay.nativeElement.innerHTML).toContain(
        'color: blue; font-size: 14px;'
      );
    }));
  });

  describe('Localization (i18n)', () => {
    it('should display translated error message', fakeAsync(() => {
      const emailInput = fixture.debugElement.query(
        By.css('input[formControlName="localizationEmail"]')
      );
      emailInput.nativeElement.value = '';
      emailInput.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      tick(400);

      const errorDisplay = fixture.debugElement.query(
        By.css('#localizationEmailError')
      );
      expect(errorDisplay.nativeElement.textContent).toContain(
        'Este campo es obligatorio.'
      );
    }));
  });
});
