import { SmartInputTypeDirective } from './smart-input-type.directive';
import { ElementRef } from '@angular/core';

describe('SmartInputTypeDirective', () => {
  it('should create an instance', () => {
    const mockElementRef = new ElementRef(document.createElement('input'));
    const mockRenderer = jasmine.createSpyObj('Renderer2', [
      'setProperty',
      'addClass',
      'removeClass',
    ]);
    // const mockNgControl = jasmine.createSpyObj('NgControl', ['control']);

    const directive = new SmartInputTypeDirective(mockElementRef, mockRenderer);
    expect(directive).toBeTruthy();
  });
});
