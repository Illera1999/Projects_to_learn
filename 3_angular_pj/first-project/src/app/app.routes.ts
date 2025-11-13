import { Routes } from '@angular/router';
import { ListadoRecetas } from './paginas/listado-recetas/listado-recetas';
import { ListadoEstablecimientos } from './paginas/listado-establecimientos/listado-establecimientos';
import { DetalleEstablecimiento } from './paginas/detalle-establecimiento/detalle-establecimiento';
import { Senales } from './paginas/senales/senales';
import { ListadoProductos } from './paginas/listado-productos/listado-productos';

export const routes: Routes = [
    {path: '', component: ListadoRecetas},
    {path: 'listadoRecetas', component: ListadoRecetas},
    {path: 'listadoEstablecimientos', component: ListadoEstablecimientos},
    {path: 'listadoEstablecimientos/:idEstablecimiento', component: DetalleEstablecimiento},
    {path: 'senales', component: Senales},
    {path: 'listadoProductos', component: ListadoProductos},
    {path: '**', redirectTo: ''},
];
