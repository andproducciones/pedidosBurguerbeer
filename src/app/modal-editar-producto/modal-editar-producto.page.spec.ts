import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalEditarProductoPage } from './modal-editar-producto.page';

describe('ModalEditarProductoPage', () => {
  let component: ModalEditarProductoPage;
  let fixture: ComponentFixture<ModalEditarProductoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalEditarProductoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
