import { Directive, Input, HostListener } from '@angular/core';
import { SmartSelector } from '../smart-selector/smart-selector.component';

@Directive({
  selector: '[smartToggleSelection]',
  standalone: true,
})
export class SmartToggleSelection {
  @Input() smartToggleSelection!: SmartSelector;

  @HostListener('change', ['$event.target.checked'])
  onToggle(checked: boolean) {
    if (this.smartToggleSelection) {
      if (checked) {
        this.smartToggleSelection.selectAll();
      } else {
        this.smartToggleSelection.deselectAll();
      }
    }
  }
}
