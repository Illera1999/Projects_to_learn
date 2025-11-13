import { Component, signal, computed } from '@angular/core';

@Component({
  selector: 'app-senales',
  imports: [],
  templateUrl: './senales.html',
  styleUrl: './senales.css',
})
export class Senales {
  precioKilo = signal<number>(2.5)
  cantidada = signal<number>(1)

  precioTotal = computed(() => {
    return this.precioKilo() * this.cantidada()
  })
  aumentarCantidad() {
    this.cantidada.set(this.cantidada() + 1)
  }

  disminuirCantidad() {
    this.cantidada.update(valor => valor - 1)

  }
}
