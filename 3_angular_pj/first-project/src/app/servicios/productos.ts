import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Productos {
  url = "https://fakestoreapi.com/products"

  _Http = inject(HttpClient);

  getProducts(){
    return this._Http.get(this.url)
  }
  
}
