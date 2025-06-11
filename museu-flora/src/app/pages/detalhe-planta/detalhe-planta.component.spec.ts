import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalhePlantaComponent } from './detalhe-planta.component';

describe('DetalhePlantaComponent', () => {
  let component: DetalhePlantaComponent;
  let fixture: ComponentFixture<DetalhePlantaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalhePlantaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalhePlantaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
