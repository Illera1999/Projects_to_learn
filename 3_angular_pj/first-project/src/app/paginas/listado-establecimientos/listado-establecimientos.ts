import { Component, inject } from '@angular/core';
import { RouterLink } from "@angular/router";
import { Establecimientos } from '../../servicios/establecimientos';
import { Establecimiento } from '../../interfaces/establecimientos-interfaces';

@Component({
  selector: 'app-listado-establecimientos',
  imports: [RouterLink],
  templateUrl: './listado-establecimientos.html',
  styleUrl: './listado-establecimientos.css',
})

export class ListadoEstablecimientos {

  establecimientos: Establecimiento[] = [];
  _Establecimientos = inject(Establecimientos)

  constructor() {
    this.establecimientos = this._Establecimientos.getListadoDeEstablecimientos();
  }
}