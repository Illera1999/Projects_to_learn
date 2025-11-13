import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Receta } from '../../interfaces/recetas-interfaces';

@Component({
  selector: 'app-detalle-receta',
  imports: [],
  templateUrl: './detalle-receta.html',
  styleUrl: './detalle-receta.css',
})
export class DetalleReceta {
  @Input() receta!: Receta;
  @Output() anadirFavorita = new EventEmitter<Receta>();

  anadirFavoritos() {
    console.log('pulsado añadir a favoritos');
    this.anadirFavorita.emit(this.receta);
  }
}