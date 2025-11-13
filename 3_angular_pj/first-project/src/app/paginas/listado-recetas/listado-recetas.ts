import { Component, inject } from '@angular/core';
import { DetalleReceta } from "../detalle-receta/detalle-receta";
import { Recetas } from '../../servicios/recetas';
import { Receta } from '../../interfaces/recetas-interfaces';

@Component({
  selector: 'app-listado-recetas',
  imports: [DetalleReceta],
  templateUrl: './listado-recetas.html',
  styleUrl: './listado-recetas.css',
})

export class ListadoRecetas {
  recetas: Receta[] = [];
  _Recetas = inject(Recetas)


  constructor() {
    this.recetas = this._Recetas.getListadoDeRecetas();
  }

  manejarFavorita(receta: Receta) {
  console.log('Receta marcada como favorita:', receta);
}
}