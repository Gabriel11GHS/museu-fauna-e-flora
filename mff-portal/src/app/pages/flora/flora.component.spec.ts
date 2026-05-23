import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

import { FloraComponent } from './flora.component';

describe('FloraComponent', () => {
  let component: FloraComponent;
  let fixture: ComponentFixture<FloraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FloraComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideNoopAnimations(),
        provideRouter([])
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FloraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
