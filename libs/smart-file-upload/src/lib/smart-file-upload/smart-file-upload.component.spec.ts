/* eslint-disable @typescript-eslint/no-empty-function */
import {
  ComponentFixture,
  fakeAsync,
  flushMicrotasks,
  TestBed,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SmartFileUpload } from './smart-file-upload.component';
import { FilePreviewPipe, FileSizePipe, MimeTypePipe } from '../pipe';

describe('SmartFileUpload', () => {
  let component: SmartFileUpload;
  let fixture: ComponentFixture<SmartFileUpload>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmartFileUpload, FilePreviewPipe, FileSizePipe, MimeTypePipe],
    }).compileComponents();

    fixture = TestBed.createComponent(SmartFileUpload);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    global.URL.createObjectURL = jest.fn(() => 'mockedObjectURL');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should trigger file input on click', () => {
    jest.spyOn(component, 'triggerFileInput');
    const container = fixture.debugElement.query(
      By.css('.file-upload-container')
    );
    container.triggerEventHandler('click', null);
    expect(component.triggerFileInput).toHaveBeenCalled();
  });

  it('should trigger file input on Enter key', () => {
    jest.spyOn(component, 'triggerFileInput');
    const container = fixture.debugElement.query(
      By.css('.file-upload-container')
    );
    container.triggerEventHandler('keydown.enter', null);
    expect(component.triggerFileInput).toHaveBeenCalled();
  });

  it('should trigger file input on Space key', () => {
    jest.spyOn(component, 'triggerFileInput');
    const container = fixture.debugElement.query(
      By.css('.file-upload-container')
    );
    container.triggerEventHandler('keydown.space', null);
    expect(component.triggerFileInput).toHaveBeenCalled();
  });

  it('should update drag-over state on dragover and dragleave', () => {
    const container = fixture.debugElement.query(
      By.css('.file-upload-container')
    );

    const mockDragEvent = {
      preventDefault: () => {},
    } as DragEvent;

    container.triggerEventHandler('dragover', mockDragEvent);
    expect(component.isDragOver).toBe(true);

    container.triggerEventHandler('dragleave', mockDragEvent);
    expect(component.isDragOver).toBeFalsy();
  });

  it('should handle file selection', fakeAsync(() => {
    component.accept = 'application/pdf';
    const file = new File([''], 'test.pdf', { type: 'application/pdf' });
    const fileList = {
      0: file,
      length: 1,
      item: () => file,
    } as FileList;

    const event = {
      target: { files: fileList },
    } as unknown as Event;

    component.onFileSelected(event);
    tick(100); // Simulate debounce time

    fixture.detectChanges();

    expect(component.files.length).toBe(1);
    expect(component.files[0].name).toBe('test.pdf');
  }));

  it('should handle file drop', fakeAsync(() => {
    component.accept = 'application/pdf';
    const file = new File([''], 'test.pdf', { type: 'application/pdf' });
    const dataTransfer = { files: { 0: file, length: 1, item: () => file } };
    const event = {
      preventDefault: () => {},
      dataTransfer: dataTransfer as unknown as DataTransfer,
    } as DragEvent;

    component.onDrop(event);
    tick(100); // Simulate debounce time

    fixture.detectChanges();

    expect(component.files.length).toBe(1);
    expect(component.files[0].name).toBe('test.pdf');
  }));

  it('should validate file type', () => {
    component.accept = 'image/jpeg, image/png';
    const jpegFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
    const pngFile = new File([''], 'test.png', { type: 'image/png' });
    const pdfFile = new File([''], 'test.pdf', { type: 'application/pdf' });
    expect(component.validateFileType(jpegFile)).toBeTruthy();
    expect(component.validateFileType(pngFile)).toBeTruthy();
    expect(component.validateFileType(pdfFile)).toBeFalsy();
  });

  it('should validate file size', async () => {
    component.maxFileSize = 1024; // 1 KB
    component.accept = 'text/plain';
    const smallFile = new File(['a'.repeat(512)], 'small.txt', {
      type: 'text/plain',
    });
    const largeFile = new File(['a'.repeat(2048)], 'large.txt', {
      type: 'text/plain',
    });
    await component.validateFiles([smallFile]);
    expect(component.errors).toBeNull();
    await component.validateFiles([largeFile]);
    expect(component.errors?.['maxSize']).toBeDefined();
  });

  it('should validate image dimensions correctly', fakeAsync(() => {
    Object.defineProperty(window.URL, 'revokeObjectURL', {
      value: jest.fn(),
    });
    component.maxWidth = 200;
    component.maxHeight = 200;

    const mockFile = new File([''], 'test-image.jpg', { type: 'image/jpeg' });
    const img = new Image();
    jest.spyOn(window, 'Image').mockImplementation(() => img);

    img.width = 100;
    img.height = 100;
    component.validateFiles([mockFile]);
    img.onload?.({} as Event);
    tick();

    expect(component.errors).toBeNull();

    img.width = 250;
    component.validateFiles([mockFile]);
    img.onload?.({} as Event);
    tick();

    expect(component.errors?.['maxWidth']).toBeDefined();

    img.width = 100;
    img.height = 250;
    component.validateFiles([mockFile]);
    img.onload?.({} as Event);
    tick();

    expect(component.errors?.['maxHeight']).toBeDefined();
  }));

  it('should handle maxFiles limit', async () => {
    component.multiple = true;
    component.maxFiles = 2;
    const files = [
      new File([''], 'test1.jpg', { type: 'image/jpeg' }),
      new File([''], 'test2.jpg', { type: 'image/jpeg' }),
      new File([''], 'test3.jpg', { type: 'image/jpeg' }),
    ];
    await component.validateFiles(files);
    expect(component.errors?.['maxFiles']).toBeDefined();
  });

  it('should update files array with valid files only', async () => {
    component.accept = 'application/pdf';
    component.maxFileSize = 1024;

    const validFile = new File([''], 'valid.pdf', { type: 'application/pdf' });
    const invalidTypeFile = new File([''], 'invalid.png', {
      type: 'image/png',
    });
    const invalidSizeFile = new File(['a'.repeat(2048)], 'large.pdf', {
      type: 'application/pdf',
    });

    await component.validateFiles([
      validFile,
      invalidTypeFile,
      invalidSizeFile,
    ]);
    expect(component.files).toContain(validFile);
    expect(component.files).not.toContain(invalidTypeFile);
    expect(component.files).not.toContain(invalidSizeFile);
  });

  it('should disable file input when setDisabledState is called', () => {
    if (component.setDisabledState) {
      component.setDisabledState(true);
    }
    fixture.detectChanges();

    const fileInput = fixture.debugElement.query(
      By.css('input[type="file"]')
    ).nativeElement;
    expect(fileInput.disabled).toBe(true);
  });

  it('should enable file input when setDisabledState is called with false', () => {
    if (component.setDisabledState) {
      component.setDisabledState(false);
    }
    fixture.detectChanges();

    const fileInput = fixture.debugElement.query(
      By.css('input[type="file"]')
    ).nativeElement;
    expect(fileInput.disabled).toBe(false);
  });

  it('should apply aria-invalid attribute when there are validation errors', async () => {
    component.accept = 'application/pdf';
    component.maxFileSize = 1024;
    const invalidFile = new File(['a'.repeat(2048)], 'large.pdf', {
      type: 'application/pdf',
    });

    await component.validateFiles([invalidFile]);
    fixture.detectChanges();

    const fileInput = fixture.debugElement.query(
      By.css('input[type="file"]')
    ).nativeElement;
    expect(fileInput.getAttribute('aria-invalid')).toBe('true');
  });

  it('should not apply aria-invalid attribute when there are no validation errors', async () => {
    component.accept = 'application/pdf';
    const validFile = new File(['a'.repeat(512)], 'valid.pdf', {
      type: 'application/pdf',
    });

    await component.validateFiles([validFile]);
    fixture.detectChanges();

    const fileInput = fixture.debugElement.query(
      By.css('input[type="file"]')
    ).nativeElement;
    expect(fileInput.getAttribute('aria-invalid')).toBeNull();
  });

  it('should show file previews when showPreview is true', fakeAsync(() => {
    component.showPreview = true;
    component.accept = 'image/jpeg';
    const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });

    const img = new Image();
    jest.spyOn(window, 'Image').mockImplementation(() => img);

    jest.spyOn(component, 'imageVisible').mockReturnValue(true);

    component.validateFiles([mockFile]);
    img.onload?.({} as Event);
    tick();

    fixture.detectChanges();
    const previewElement = fixture.debugElement.query(By.css('.file-preview'));
    expect(previewElement).toBeTruthy();
  }));

  it('should not show file previews when showPreview is false', fakeAsync(() => {
    component.showPreview = false;
    component.accept = 'image/jpeg';
    const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });

    const img = new Image();
    jest.spyOn(window, 'Image').mockImplementation(() => img);

    jest.spyOn(component, 'imageVisible').mockReturnValue(true);

    component.validateFiles([mockFile]);
    img.onload?.({} as Event);
    tick();

    fixture.detectChanges();
    const previewElement = fixture.debugElement.query(By.css('.file-preview'));
    expect(previewElement).toBeFalsy();
  }));

  it('should delay validation by debounceTime', fakeAsync(() => {
    component.debounceTime = 500;

    const mockFile = new File([''], 'test.txt', { type: 'text/plain' });

    jest.spyOn(component, 'validateFiles');

    component.onFileSelected({
      target: {
        files: { 0: mockFile, length: 1, item: () => mockFile },
      },
    } as never);

    expect(component.validateFiles).not.toHaveBeenCalled();

    flushMicrotasks();
    tick(500);
    expect(component.validateFiles).toHaveBeenCalledWith([mockFile]);
  }));

  it('should lazy load image previews when lazyLoadPreviews is true', fakeAsync(() => {
    component.lazyLoadPreviews = true;
    component.showPreview = true;
    const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });

    const img = new Image();
    jest.spyOn(window, 'Image').mockImplementation(() => img);

    jest.spyOn(component, 'imageVisible').mockReturnValue(true);

    component.validateFiles([mockFile]);
    img.onload?.({} as Event);
    tick();

    fixture.detectChanges();
    const previewElement = fixture.debugElement.query(
      By.css('.file-thumbnail')
    );
    expect(previewElement).toBeTruthy();
  }));

  it('should reject files exceeding maxFileSize in multiple file uploads', async () => {
    component.multiple = true;
    component.maxFileSize = 1024;
    component.accept = 'application/pdf';
    const validFile = new File(['a'.repeat(512)], 'valid.pdf', {
      type: 'application/pdf',
    });
    const largeFile = new File(['a'.repeat(2048)], 'large.pdf', {
      type: 'application/pdf',
    });

    await component.validateFiles([validFile, largeFile]);
    expect(component.files).toContain(validFile);
    expect(component.files).not.toContain(largeFile);
    expect(component.errors?.['maxSize']).toBeDefined();
  });

  it('should clear the files when removeFile method is called', () => {
    const file = new File([''], 'test.pdf', { type: 'application/pdf' });
    component.files = [file];

    const event = {
      stopPropagation: jest.fn(),
    } as unknown as Event;

    component.removeFile(0, event);

    expect(component.files.length).toBe(0);
  });

  it('should handle no files selected gracefully', () => {
    const event = { target: { files: [] } } as unknown as Event;
    component.onFileSelected(event);
    expect(component.files.length).toBe(0);
  });

  it('should reset files when form control is reset', () => {
    const file = new File([''], 'test.pdf', { type: 'application/pdf' });
    component.files = [file];

    component.writeValue(null);
    expect(component.files.length).toBe(0);
  });
});
