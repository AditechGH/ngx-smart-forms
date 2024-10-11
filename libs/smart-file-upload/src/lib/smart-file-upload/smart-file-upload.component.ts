/* eslint-disable @typescript-eslint/no-empty-function */
import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';

import { FilePreviewPipe, FileSizePipe, MimeTypePipe } from '../pipe';
import { debounceTime, Subject, takeUntil } from 'rxjs';

/**
 * SmartFileUpload component provides a customizable file upload interface with validation and preview capabilities.
 *
 * @selector smart-file-upload
 * @standalone true
 * @imports [CommonModule, FilePreviewPipe, FileSizePipe, MimeTypePipe]
 * @providers [
 *   {
 *     provide: NG_VALUE_ACCESSOR,
 *     useExisting: forwardRef(() => SmartFileUpload),
 *     multi: true,
 *   },
 *   {
 *     provide: NG_VALIDATORS,
 *     useExisting: forwardRef(() => SmartFileUpload),
 *     multi: true,
 *   },
 * ]
 * @templateUrl ./smart-file-upload.component.html
 * @styleUrls ['./smart-file-upload.component.scss']
 *
 * @implements ControlValueAccessor, Validator, OnDestroy
 *
 * @property {ElementRef} fileInput - Reference to the file input element.
 * @property {string} accept - Specifies the file types that the input should accept, using MIME types (e.g., 'image/*,application/pdf').
 * @property {boolean} multiple - When set to true, allows users to select multiple files.
 * @property {number} maxFileSize - Defines the maximum file size allowed for upload in bytes. The default is 5 MB.
 * @property {number} maxFiles - Specifies the maximum number of files allowed when multiple uploads are enabled.
 * @property {boolean} showPreview - Enables or disables the display of image previews after a file is selected.
 * @property {boolean} lazyLoadPreviews - When true, image previews are lazy-loaded, meaning they are only loaded once visible in the viewport.
 * @property {number} debounceTime - Optional debounce time for validation checks, in milliseconds. Set to 0 by default.
 * @property {number | null} maxWidth - Specifies the maximum allowed width for image uploads (in pixels).
 * @property {number | null} maxHeight - Specifies the maximum allowed height for image uploads (in pixels).
 * @property {'light' | 'dark' | 'custom'} theme - Determines the theme of the file upload component. Options include 'light', 'dark', and 'custom'.
 * @property {EventEmitter<Event>} fileSelected - Emits an event when files are selected using the input field.
 * @property {EventEmitter<DragEvent>} dragOver - Emits an event when a drag-over action occurs on the file drop area.
 * @property {EventEmitter<DragEvent>} fileDrop - Emits an event when files are dropped into the file drop area.
 * @property {File[]} files - Holds valid files.
 * @property {ValidationErrors | null} errors - Holds validation errors.
 * @property {boolean} isDragOver - Drag-over state.
 *
 * @method triggerFileInput - Triggers the file input dialog.
 * @method onFileSelected - Handles the file selection from the input field. Emits the fileSelected event.
 * @method onDragOver - Handles the drag-over event, updating the drag-over state. Emits the dragOver event.
 * @method onDragLeave - Handles the drag-leave event, updating the drag-over state.
 * @method onDrop - Handles file drop events, processes the dropped files, and emits the fileDrop event.
 * @method validateFiles - Validates and processes the selected files.
 * @method validateFileType - Validates the file type against the allowed MIME types.
 * @method isImage - Determines whether the given file is an image based on its MIME type.
 * @method validateImageDimensions - Validates the dimensions of the image file (if applicable).
 * @method imageVisible - Determines whether the image preview should be visible based on the lazyLoadPreviews setting.
 * @method removeFile - Removes a file from the list at the specified index and updates the change event.
 * @method writeValue - ControlValueAccessor method to write the value.
 * @method registerOnChange - ControlValueAccessor method to register the onChange callback.
 * @method registerOnTouched - ControlValueAccessor method to register the onTouched callback.
 * @method setDisabledState - ControlValueAccessor method to set the disabled state.
 * @method validate - Validator method for form validation.
 * @method ngOnDestroy - Lifecycle hook that is called when the component is destroyed.
 */
@Component({
  selector: 'smart-file-upload',
  standalone: true,
  imports: [CommonModule, FilePreviewPipe, FileSizePipe, MimeTypePipe],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SmartFileUpload),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => SmartFileUpload),
      multi: true,
    },
  ],
  templateUrl: './smart-file-upload.component.html',
  styleUrls: ['./smart-file-upload.component.scss'],
})
export class SmartFileUpload
  implements ControlValueAccessor, Validator, OnDestroy
{
  @ViewChild('fileInput', { static: true }) fileInput!: ElementRef;

  /**
   * Specifies the file types that the input should accept, using MIME types (e.g., 'image/*,application/pdf').
   */
  @Input() accept = 'image/*';

  /**
   * When set to true, allows users to select multiple files.
   */
  @Input() multiple = false;

  /**
   * Defines the maximum file size allowed for upload in bytes. The default is 5 MB.
   */
  @Input() maxFileSize: number = 5 * 1024 * 1024;

  /**
   * Specifies the maximum number of files allowed when multiple uploads are enabled.
   */
  @Input() maxFiles = 10;

  /**
   * Enables or disables the display of image previews after a file is selected.
   */
  @Input() showPreview = false;

  /**
   * When true, image previews are lazy-loaded, meaning they are only loaded once visible in the viewport.
   */
  @Input() lazyLoadPreviews = true;

  /**
   * Optional debounce time for validation checks, in milliseconds. Set to 0 by default.
   */
  @Input() debounceTime = 0;

  /**
   * Specifies the maximum allowed width for image uploads (in pixels).
   */
  @Input() maxWidth: number | null = null;

  /**
   * Specifies the maximum allowed height for image uploads (in pixels).
   */
  @Input() maxHeight: number | null = null;

  /**
   * Determines the theme of the file upload component. Options include 'light', 'dark', and 'custom'.
   */
  @Input() theme: 'light' | 'dark' | 'custom' = 'light';

  /**
   * Emits an event when files are selected using the input field.
   */
  @Output() fileSelected = new EventEmitter<Event>();

  /**
   * Emits an event when a drag-over action occurs on the file drop area.
   */
  @Output() dragOver = new EventEmitter<DragEvent>();

  /**
   * Emits an event when files are dropped into the file drop area.
   */
  @Output() fileDrop = new EventEmitter<DragEvent>();

  @HostBinding('class.light-theme') get isLightTheme() {
    return this.theme === 'light';
  }

  @HostBinding('class.dark-theme') get isDarkTheme() {
    return this.theme === 'dark';
  }

  files: File[] = []; // Holds valid files
  errors: ValidationErrors | null = null; // Holds validation errors
  isDragOver = false; // Drag-over state

  private onChange: (files: File[] | null) => void = () => {};
  private onTouched: () => void = () => {};
  private destroyed$ = new Subject<void>();
  private fileSubject = new Subject<FileList>();

  @HostListener('window:dragover', ['$event'])
  preventDefaultDrag(event: DragEvent) {
    event.preventDefault();
  }

  @HostListener('window:drop', ['$event'])
  preventDefaultDrop(event: DragEvent) {
    event.preventDefault();
  }

  constructor() {
    // Handle file processing with optional debounce
    this.fileSubject
      .pipe(debounceTime(this.debounceTime), takeUntil(this.destroyed$))
      .subscribe((fileList) => {
        this.validateFiles(Array.from(fileList));
      });
  }

  /**
   * Triggers the file input dialog.
   */
  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  /**
   * Handles the file selection from the input field.
   * Emits the fileSelected event.
   */
  async onFileSelected(event: Event) {
    this.fileSelected.emit(event);
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.fileSubject.next(input.files);
    }
  }

  /**
   * Handles the drag-over event, updating the drag-over state.
   * Emits the dragOver event.
   */
  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
    this.dragOver.emit(event);
  }

  /**
   * Handles the drag-leave event, updating the drag-over state.
   */
  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
  }

  /**
   * Handles file drop events, processes the dropped files, and emits the fileDrop event.
   */
  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
    this.fileDrop.emit(event);
    if (event.dataTransfer && event.dataTransfer.files) {
      this.fileSubject.next(event.dataTransfer.files);
    }
  }

  /**
   * Validates and processes the selected files.
   */
  async validateFiles(filesArray: File[]) {
    console.log('Invalid file type');

    this.errors = {}; // Initialize the errors object
    this.files = [];

    // Handle multiple files limit
    if (this.multiple && filesArray.length > this.maxFiles) {
      this.errors['maxFiles'] = {
        filesLength: filesArray.length,
        maxFiles: this.maxFiles,
      };

      this.onChange(null);
      this.onTouched();
      return;
    }

    for (const file of filesArray) {
      if (this.accept && !this.validateFileType(file)) {
        this.errors['invalidType'] = {
          fileType: file.type,
          allowedTypes: this.accept,
        };
      } else if (file.size > this.maxFileSize) {
        this.errors['maxSize'] = {
          fileSize: file.size,
          maxSize: this.maxFileSize,
        };
      } else if (this.isImage(file)) {
        // Validate dimensions if the file is an image
        const dimensionsError = await this.validateImageDimensions(file);
        if (dimensionsError) {
          this.errors[dimensionsError.key] = dimensionsError.value;
        } else {
          this.files.push(file);
        }
      } else {
        this.files.push(file);
      }
    }

    if (Object.keys(this.errors).length > 0) {
      this.onChange(null);
    } else {
      this.errors = null;
      this.onChange(this.files);
    }

    this.onTouched();
  }

  /**
   * Validates the file type against the allowed MIME types.
   */
  validateFileType(file: File): boolean {
    const allowedTypes = this.accept.split(',');
    return allowedTypes.some((type) => file.type.match(type.trim()));
  }

  /**
   * Determines whether the given file is an image based on its MIME type.
   */
  isImage(file: File): boolean {
    return file.type.startsWith('image/');
  }

  /**
   * Validates the dimensions of the image file (if applicable).
   */
  private validateImageDimensions(
    file: File
  ): Promise<{ key: string; value: unknown } | null> {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        if (this.maxWidth && img.width > this.maxWidth) {
          resolve({
            key: 'maxWidth',
            value: { width: img.width, maxWidth: this.maxWidth },
          });
        } else if (this.maxHeight && img.height > this.maxHeight) {
          resolve({
            key: 'maxHeight',
            value: { height: img.height, maxHeight: this.maxHeight },
          });
        } else {
          resolve(null); // Valid dimensions
        }

        // Cleanup the object URL
        URL.revokeObjectURL(img.src);
      };

      img.onerror = () => {
        resolve({ key: 'invalidImage', value: 'Invalid image file' });
      };
    });
  }

  /**
   * Determines whether the image preview should be visible based on the lazyLoadPreviews setting.
   */
  imageVisible(file: File): boolean {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          (entry.target as HTMLImageElement).src = URL.createObjectURL(file);
        }
      });
    });
    const element = document.querySelector(`[src="${file.name}"]`);
    if (element) observer.observe(element);
    return true;
  }

  /**
   * Removes a file from the list at the specified index and updates the change event.
   *
   * @param index - The index of the file to be removed.
   * @param event - The event that triggered the file removal.
   */
  removeFile(index: number, event: Event) {
    event.stopPropagation();
    this.files.splice(index, 1);
    this.onChange(this.files.length > 0 ? this.files : null);
  }

  // ControlValueAccessor methods

  writeValue(files: File[] | null): void {
    this.files = files || [];
  }

  registerOnChange(fn: (files: File[] | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.fileInput.nativeElement.disabled = isDisabled;
  }

  // Validator methods for form validation
  validate(): ValidationErrors | null {
    return this.errors;
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
