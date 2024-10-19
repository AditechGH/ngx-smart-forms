import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SmartSelector } from './smart-selector.component';

function dispatchKeyboardEvent(
  element: HTMLElement,
  type: string,
  key: string
) {
  const event = new KeyboardEvent(type, { key });
  element.dispatchEvent(event);
}

describe('SmartSelectorComponent', () => {
  let component: SmartSelector;
  let fixture: ComponentFixture<SmartSelector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, SmartSelector],
    }).compileComponents();

    fixture = TestBed.createComponent(SmartSelector);
    component = fixture.componentInstance;

    // Set up default options
    component.options = [
      { id: '1', label: 'Option 1', image: 'assets/img/1.png' },
      { id: '2', label: 'Option 2', image: 'assets/img/2.png' },
      { id: '3', label: 'Option 3' },
    ];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display options correctly in list layout', () => {
    component.layout = 'list'; // Ensure it's in list layout
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      const optionElements = fixture.debugElement.queryAll(
        By.css('.smart-selector__pane')
      );

      // Check if the options are rendered correctly
      expect(optionElements.length).toBe(3);
      expect(optionElements[0].nativeElement.textContent).toContain('Option 1');
      expect(optionElements[1].nativeElement.textContent).toContain('Option 2');
      expect(optionElements[2].nativeElement.textContent).toContain('Option 3');

      // Check layout-specific CSS properties
      const selectorElement = fixture.debugElement.query(
        By.css('.smart-selector')
      ).nativeElement;

      expect(getComputedStyle(selectorElement).display).toBe('flex');
      expect(getComputedStyle(selectorElement).flexDirection).toBe('column');
    });
  });

  it('should display options correctly in grid layout', () => {
    component.layout = 'grid'; // Switch to grid layout
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      const optionElements = fixture.debugElement.queryAll(
        By.css('.smart-selector__pane')
      );

      // Check if the options are rendered correctly
      expect(optionElements.length).toBe(3);
      expect(optionElements[0].nativeElement.textContent).toContain('Option 1');
      expect(optionElements[1].nativeElement.textContent).toContain('Option 2');
      expect(optionElements[2].nativeElement.textContent).toContain('Option 3');

      // Check layout-specific CSS properties
      const selectorElement = fixture.debugElement.query(
        By.css('.smart-selector')
      ).nativeElement;

      const computedStyle = getComputedStyle(selectorElement);

      expect(computedStyle.display).toBe('grid');
      expect(computedStyle.gridTemplateColumns).toContain('minmax(150px');
      expect(computedStyle.gap).toBe('10px');
    });
  });

  it('should display placeholder text when no option is selected and placeholder is provided', () => {
    component.placeholder = 'Select an option';
    component.value = [];
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      const placeholderElement = fixture.debugElement.query(
        By.css('.placeholder')
      );
      expect(placeholderElement).toBeTruthy();
      expect(placeholderElement.nativeElement.textContent).toContain(
        'Select an option'
      );
    });
  });

  it('should display noOptionsText when options array is empty', () => {
    component.options = [];
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      const noOptionsElement = fixture.debugElement.query(
        By.css('.no-options')
      );
      expect(noOptionsElement).toBeTruthy();
      expect(noOptionsElement.nativeElement.textContent).toContain(
        'No options available'
      );
    });
  });

  it('should select an option correctly in single select mode', () => {
    const optionElements = fixture.debugElement.queryAll(
      By.css('.smart-selector__pane')
    );
    optionElements[1].triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(component.value).toEqual([component.options[1]]);
    expect(optionElements[1].nativeElement.classList).toContain('active');
  });

  it('should emit optionChanged and onSelect events with the correct selected option', () => {
    jest.spyOn(component.optionChanged, 'emit');
    jest.spyOn(component.onSelect, 'emit');
    const optionElements = fixture.debugElement.queryAll(
      By.css('.smart-selector__pane')
    );
    optionElements[1].triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(component.optionChanged.emit).toHaveBeenCalledWith(
      component.options[1]
    );
    expect(component.onSelect.emit).toHaveBeenCalledWith(component.options[1]);
  });

  it('should select multiple options correctly in multi-select mode', () => {
    component.multiSelect = true;
    fixture.detectChanges();
    const optionElements = fixture.debugElement.queryAll(
      By.css('.smart-selector__pane')
    );
    optionElements[0].triggerEventHandler('click', null);
    fixture.detectChanges();
    optionElements[2].triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(component.value).toEqual([
      component.options[0],
      component.options[2],
    ]);
    expect(optionElements[0].nativeElement.classList).toContain('active');
    expect(optionElements[2].nativeElement.classList).toContain('active');
  });

  it('should deselect options correctly in multi-select mode', () => {
    component.multiSelect = true;
    fixture.detectChanges();
    const optionElements = fixture.debugElement.queryAll(
      By.css('.smart-selector__pane')
    );
    optionElements[0].triggerEventHandler('click', null);
    fixture.detectChanges();
    optionElements[2].triggerEventHandler('click', null);
    fixture.detectChanges();
    // Deselect the first option
    optionElements[0].triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(component.value).toEqual([component.options[2]]);
    expect(optionElements[0].nativeElement.classList).not.toContain('active');
    expect(optionElements[2].nativeElement.classList).toContain('active');
  });

  it('should emit optionChanged, onSelect, and onDeselect events with correct options in multi-select mode', () => {
    component.multiSelect = true;
    fixture.detectChanges();

    jest.spyOn(component.optionChanged, 'emit');
    jest.spyOn(component.onSelect, 'emit');
    jest.spyOn(component.onDeselect, 'emit');

    const optionElements = fixture.debugElement.queryAll(
      By.css('.smart-selector__pane')
    );
    optionElements[0].triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(component.optionChanged.emit).toHaveBeenCalledWith([
      component.options[0],
    ]);
    expect(component.onSelect.emit).toHaveBeenCalledWith(component.options[0]);

    optionElements[2].triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(component.optionChanged.emit).toHaveBeenCalledWith([
      component.options[0],
      component.options[2],
    ]);
    expect(component.onSelect.emit).toHaveBeenCalledWith(component.options[2]);

    // Deselect the first option
    optionElements[0].triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(component.optionChanged.emit).toHaveBeenCalledWith([
      component.options[2],
    ]);
    expect(component.onDeselect.emit).toHaveBeenCalledWith(
      component.options[0]
    );
  });

  it('should validate maxSelection and emit validationErrors if exceeded in multi-select mode', () => {
    component.multiSelect = true;
    component.maxSelection = 2;
    fixture.detectChanges();

    jest.spyOn(component.validationErrors, 'emit');

    const optionElements = fixture.debugElement.queryAll(
      By.css('.smart-selector__pane')
    );
    optionElements[0].triggerEventHandler('click', null);
    fixture.detectChanges();
    optionElements[1].triggerEventHandler('click', null);
    fixture.detectChanges();
    optionElements[2].triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(component.validate()).toEqual({
      maxSelection: { actual: 3, maxAllowed: 2 },
    });
    expect(component.validationErrors.emit).toHaveBeenCalledWith({
      maxSelection: { actual: 3, maxAllowed: 2 },
    });
  });

  it('should navigate options using arrow keys (up, down) and select with Enter key', () => {
    const optionElements = fixture.debugElement.queryAll(
      By.css('.smart-selector__pane')
    );

    // Focus the first option
    optionElements[0].nativeElement.focus();
    expect(component.ariaActiveDescendant).toBe('option-0');

    // Press ArrowDown to move to the second option
    setTimeout(() => {
      dispatchKeyboardEvent(
        optionElements[0].nativeElement,
        'keydown',
        'ArrowDown'
      ); // ArrowDown
      fixture.detectChanges();
      expect(component.ariaActiveDescendant).toBe('option-1');

      // Press ArrowDown again to move to the third option
      dispatchKeyboardEvent(
        optionElements[0].nativeElement,
        'keydown',
        'ArrowDown'
      ); // ArrowDown
      fixture.detectChanges();
      expect(component.ariaActiveDescendant).toBe('option-2');

      // Press ArrowUp to move back to the second option
      dispatchKeyboardEvent(
        optionElements[0].nativeElement,
        'keydown',
        'ArrowUp'
      ); // ArrowUp
      fixture.detectChanges();
      expect(component.ariaActiveDescendant).toBe('option-1');

      // Press Enter to select the second option
      dispatchKeyboardEvent(
        optionElements[0].nativeElement,
        'keydown',
        'Enter'
      ); // Enter
      fixture.detectChanges();
      expect(component.value).toEqual([component.options[1]]);
    });
  });
});
