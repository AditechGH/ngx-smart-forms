import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedUtilsComponent } from './shared-utils.component';

describe('SharedUtilsComponent', () => {
  let component: SharedUtilsComponent;
  let fixture: ComponentFixture<SharedUtilsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedUtilsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedUtilsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
