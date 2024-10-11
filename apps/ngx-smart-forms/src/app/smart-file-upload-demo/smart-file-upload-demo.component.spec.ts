import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { SmartFileUpload } from '@ngx-smart-forms/smart-file-upload';
import { SmartFileUploadDemoComponent } from './smart-file-upload-demo.component';

describe('SmartFileUploadDemoComponent', () => {
  let component: SmartFileUploadDemoComponent;
  let fixture: ComponentFixture<SmartFileUploadDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        SmartFileUploadDemoComponent,
        SmartFileUpload,
      ],
      providers: [FormBuilder],
    }).compileComponents();

    fixture = TestBed.createComponent(SmartFileUploadDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize forms on component initialization', () => {
    expect(component.basicForm).toBeDefined();
    expect(component.multipleFilesForm).toBeDefined();
    expect(component.validationForm).toBeDefined();
    expect(component.imageForm).toBeDefined();
    expect(component.debouncedForm).toBeDefined();
    expect(component.lazyLoadForm).toBeDefined();
    expect(component.themeForm).toBeDefined();
    expect(component.dragDropForm).toBeDefined();
    expect(component.previewForm).toBeDefined();
  });

  it('should validate single file upload form', () => {
    const form = component.basicForm;
    const fileUpload = form.get('singleFile');
    expect(fileUpload?.valid).toBeFalsy();

    fileUpload?.setValue(new File(['test'], 'test.txt'));
    expect(fileUpload?.valid).toBeTruthy();
  });

  it('should validate multiple file uploads', () => {
    const form = component.multipleFilesForm;
    const fileUpload = form.get('multipleFiles');

    expect(fileUpload?.valid).toBeFalsy();

    fileUpload?.setValue([
      new File(['test'], 'test1.jpg'),
      new File(['test'], 'test2.jpg'),
    ]);
    expect(fileUpload?.valid).toBeTruthy();
  });

  it('should handle debounced validation', async () => {
    const form = component.debouncedForm;
    const fileUpload = form.get('debouncedFile');

    const validImage = new File([''], 'image.jpg', { type: 'image/jpeg' });

    fileUpload?.setValue(validImage);
    fixture.detectChanges();

    setTimeout(() => {
      expect(fileUpload?.errors).toBeNull();
    }, 600);
  });

  it('should apply dark theme to file upload', () => {
    const themedComponent = fixture.debugElement.query(
      By.css('smart-file-upload[formControlName="themedFile"]')
    );

    const hasDarkThemeClass =
      themedComponent.nativeElement.classList.contains('dark-theme');
    expect(hasDarkThemeClass).toBeTruthy();
  });
});
