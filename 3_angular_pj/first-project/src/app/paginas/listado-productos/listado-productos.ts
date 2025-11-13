import { Component, inject } from '@angular/core';
import { Productos } from '../../servicios/productos';

@Component({
  selector: 'app-listado-productos',
  imports: [],
  templateUrl: './listado-productos.html',
  styleUrl: './listado-productos.css',
})
export class ListadoProductos {

  _Productos = inject(Productos)
  listadoProductos: any[] = []

  constructor() {
    this._Productos.getProducts()
      .subscribe((data: any) => {
        this.listadoProductos = data
        console.log(this.listadoProductos)
      }
      )
  }
}
