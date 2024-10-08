/* eslint-disable @typescript-eslint/no-explicit-any */
import { SmartInputType } from './smart-input-type.directive';
import { ElementRef } from '@angular/core';
import { fromEvent, Subject, Observable } from 'rxjs';

const mockElementRef = new ElementRef(document.createElement('input'));
let mockRenderer: any;
let mockNgControl: any;
let directive: SmartInputType;

describe('SmartInputTypeDirective', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockRenderer = {
      setProperty: jest.fn(),
      addClass: jest.fn(),
      removeClass: jest.fn(),
    };
    mockNgControl = {
      control: {
        setValue: jest.fn(),
        setErrors: jest.fn(),
        errors: {} as { [key: string]: any } | null,
      },
    };

    directive = new SmartInputType(
      mockElementRef,
      mockRenderer as any,
      mockNgControl as any
    );
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  describe('Smart Type Validation', () => {
    it('should validate alphanumeric input (no spaces)', () => {
      directive.smartType = 'alphanumeric';
      mockElementRef.nativeElement.value = 'Test 123!@#';
      directive.ngOnInit();

      expect(mockElementRef.nativeElement.value).toBe('Test123');
    });

    it('should validate alphanumeric input (with spaces)', () => {
      directive.smartType = 'alphanumeric';
      directive.acceptSpace = true;
      mockElementRef.nativeElement.value = 'Test 123!@#';
      directive.ngOnInit();

      expect(mockElementRef.nativeElement.value).toBe('Test 123');
    });

    it('should validate alpha input (no spaces)', () => {
      directive.smartType = 'alpha';
      mockElementRef.nativeElement.value = 'Test123';
      directive.ngOnInit();

      expect(mockElementRef.nativeElement.value).toBe('Test');
    });

    it('should validate alpha input (with spaces)', () => {
      directive.smartType = 'alpha';
      directive.acceptSpace = true;
      mockElementRef.nativeElement.value = 'Test 123';
      directive.ngOnInit();

      expect(mockElementRef.nativeElement.value).toBe('Test ');
    });

    it('should validate numeric input (no spaces)', () => {
      directive.smartType = 'numeric';
      mockElementRef.nativeElement.value = '123abc';
      directive.ngOnInit();

      expect(mockElementRef.nativeElement.value).toBe('123');
    });

    it('should validate numeric input (with spaces)', () => {
      directive.smartType = 'numeric';
      directive.acceptSpace = true;
      mockElementRef.nativeElement.value = '123 abc';
      directive.ngOnInit();

      expect(mockElementRef.nativeElement.value).toBe('123 ');
    });

    it('should validate email input', () => {
      directive.smartType = 'email';
      mockElementRef.nativeElement.value = 'invalidEmail';
      directive.ngOnInit();

      expect(mockNgControl.control.setErrors).toHaveBeenCalledWith({
        strictEmail: true,
      });
    });

    it('should validate url input', () => {
      directive.smartType = 'url';
      mockElementRef.nativeElement.value = 'invalid-url';
      directive.ngOnInit();

      expect(mockNgControl.control.setErrors).toHaveBeenCalledWith({
        strictUrl: true,
      });
    });

    it('should validate tel input', () => {
      directive.smartType = 'tel';
      mockElementRef.nativeElement.value = 'a12';
      directive.ngOnInit();

      expect(mockNgControl.control.setErrors).toHaveBeenCalledWith({
        strictTel: true,
      });
    });

    it('should validate with custom pattern', () => {
      directive.smartType = 'pattern';
      directive.pattern = 'a-zA-Z';
      mockElementRef.nativeElement.value = '123abc';
      directive.ngOnInit();

      expect(mockElementRef.nativeElement.value).toBe('abc');
    });
  });

  describe('Case Transformation', () => {
    it('should transform to uppercase', () => {
      directive.case = 'uppercase';
      mockElementRef.nativeElement.value = 'test';
      directive.ngOnInit();

      expect(mockElementRef.nativeElement.value).toBe('TEST');
    });

    it('should transform to lowercase', () => {
      directive.case = 'lowercase';
      mockElementRef.nativeElement.value = 'TEST';
      directive.ngOnInit();

      expect(mockElementRef.nativeElement.value).toBe('test');
    });
  });

  describe('Language Set Filtering', () => {
    it('should filter input based on English language set', () => {
      directive.languageSet = 'en';
      mockElementRef.nativeElement.value = 'testéñ123';
      directive.ngOnInit();

      expect(mockElementRef.nativeElement.value).toBe('test123');
    });

    it('should filter input based on Spanish language set', () => {
      directive.languageSet = 'es';
      mockElementRef.nativeElement.value = 'testéñ123';
      directive.ngOnInit();

      expect(mockElementRef.nativeElement.value).toBe('testéñ123');
    });

    it('should filter input based on French language set', () => {
      directive.languageSet = 'fr';
      mockElementRef.nativeElement.value = '@testëûç123';
      directive.ngOnInit();

      expect(mockElementRef.nativeElement.value).toBe('testëûç123');
    });

    it('should filter input based on custom pattern', () => {
      directive.languageSet = 'abc';
      mockElementRef.nativeElement.value = 'testabc123';
      directive.ngOnInit();

      expect(mockElementRef.nativeElement.value).toBe('abc');
    });
  });

  describe('Debounce Time', () => {
    it('should debounce input validation', () => {
      directive.debounceTime = 300;
      const inputEvent = new Subject<Event>();

      jest
        .spyOn(fromEvent as any, 'call')
        .mockReturnValue(inputEvent as Observable<Event>);

      directive.ngOnInit();
      inputEvent.next(new Event('input'));
      jest.advanceTimersByTime(300);

      expect(mockNgControl.control.setValue).toHaveBeenCalled();
    });
  });

  describe('Form Control Errors', () => {
    it('should set form control errors', () => {
      directive.smartType = 'email';
      mockElementRef.nativeElement.value = 'invalidEmail';
      directive.ngOnInit();

      expect(mockNgControl.control.setErrors).toHaveBeenCalledWith({
        strictEmail: true,
      });
    });

    it('should remove form control errors', () => {
      directive.smartType = 'email';
      mockElementRef.nativeElement.value = 'test@example.com';
      directive.ngOnInit();

      expect(mockNgControl.control.setErrors).toHaveBeenCalledWith(null);
    });
  });

  describe('Visual Feedback', () => {
    it('should add "has-error" class for invalid input', () => {
      directive.smartType = 'email';
      mockElementRef.nativeElement.value = 'invalidEmail';
      directive.ngOnInit();

      expect(mockRenderer.addClass).toHaveBeenCalledWith(
        mockElementRef.nativeElement,
        'has-error'
      );
    });

    it('should remove "has-error" class for valid input', () => {
      directive.smartType = 'email';
      mockElementRef.nativeElement.value = 'test@example.com';
      directive.ngOnInit();

      expect(mockRenderer.removeClass).toHaveBeenCalledWith(
        mockElementRef.nativeElement,
        'has-error'
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty input value', () => {
      mockElementRef.nativeElement.value = '';
      directive.ngOnInit();

      expect(mockElementRef.nativeElement.value).toBe('');
    });

    it('should handle very long input string', () => {
      mockElementRef.nativeElement.value = 'a'.repeat(10000);
      directive.ngOnInit();

      expect(mockElementRef.nativeElement.value.length).toBe(10000);
    });

    it('should handle special characters', () => {
      directive.smartType = 'alphanumeric';
      directive.acceptSpace = true;
      mockElementRef.nativeElement.value =
        'Test with special characters like ® © and emojis 😀 🎉';
      directive.ngOnInit();

      expect(mockElementRef.nativeElement.value).toBe(
        'Test with special characters like   and emojis  '
      );
    });
  });

  describe('HTML Input Types', () => {
    it('should work with password type', () => {
      directive.smartType = 'password';
      directive.ngOnInit();

      expect(mockElementRef.nativeElement.type).toBe('password');
    });
  });

  describe('isValidHtmlType', () => {
    it('should correctly identify valid HTML input types', () => {
      expect(directive['isValidHtmlType']('text')).toBe(true);
      expect(directive['isValidHtmlType']('email')).toBe(true);
    });

    it('should correctly identify invalid HTML input types', () => {
      expect(directive['isValidHtmlType']('invalidType')).toBe(false);
    });
  });
});
