import { Component, inject, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Establecimiento } from '../../interfaces/establecimientos-interfaces';

@Component({
  selector: 'app-detalle-establecimiento',
  imports: [],
  templateUrl: './detalle-establecimiento.html',
  styleUrl: './detalle-establecimiento.css',
})
export class DetalleEstablecimiento {
  @Input() establecimiento!: Establecimiento;

  activatedRoute = inject(ActivatedRoute)
  idEstablecimiento: any;

  constructor(){
    this.idEstablecimiento = this.activatedRoute.snapshot.paramMap.get('idEstablecimiento')
  }
}
