import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreasDeportivasComponent } from './areas-deportivas.component';

describe('AreasDeportivasComponent', () => {
  let component: AreasDeportivasComponent;
  let fixture: ComponentFixture<AreasDeportivasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AreasDeportivasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AreasDeportivasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
