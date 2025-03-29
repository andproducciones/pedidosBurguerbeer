import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SinConexionPage } from './sin-conexion.page';

describe('SinConexionPage', () => {
  let component: SinConexionPage;
  let fixture: ComponentFixture<SinConexionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SinConexionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
