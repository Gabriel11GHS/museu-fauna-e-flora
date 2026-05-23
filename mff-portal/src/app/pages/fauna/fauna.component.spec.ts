import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

import { FaunaComponent } from './fauna.component';

describe('FaunaComponent', () => {
  let component: FaunaComponent;
  let fixture: ComponentFixture<FaunaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FaunaComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideNoopAnimations(),
        provideRouter([])
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FaunaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should use the Projeto Click stream id in the proxied camera URL', () => {
    expect(component.cameras).toEqual([
      { nome: 'Câmera 1', id: '6738e98d' }
    ]);
    expect(component.selectedCameraId).toBe('6738e98d');
    expect(component.streamUrl).toBe('/camera-feed/6738e98d');
  });

  it('should allow adding another camera id through the cameras list and switching to it', () => {
    component.cameras = [
      ...component.cameras,
      { nome: 'Câmera 2', id: 'nova-camera' }
    ];

    component.trocarCamera('nova-camera');

    expect(component.selectedCameraId).toBe('nova-camera');
    expect(component.streamUrl).toBe('/camera-feed/nova-camera');
    expect(component.isStreamOnline).toBeTrue();
  });
});
