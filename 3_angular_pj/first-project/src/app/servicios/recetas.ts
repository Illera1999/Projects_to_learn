import { Injectable } from '@angular/core';
import { Receta } from '../interfaces/recetas-interfaces';

@Injectable({
  providedIn: 'root',
})
export class Recetas {

  listadoRecetas:Receta[] =
    [
      {
        "id": 1,
        "nombre": "Hummus de aguacate y garbanzos",
        "tipo": "Entrante",
        "imagen": "/images/recetas/1/1.jpg",
        "dificultad": "Baja",
        "ingredientes": [
          "1 bote de garbanzos cocidos (400g)",
          "1 aguacate maduro",
          "1 diente de ajo",
          "3 cucharadas de tahini",
          "el zumo de 1/2 limón",
          "4 cucharadas de aceite de oliva virgen extra",
          "sal",
          "comino molido al gusto",
          "pimentón dulce para decorar."
        ],
        "elaboracion": [
          "Escurrir y enjuagar bien los garbanzos.",
          "Pelar el aguacate y quitarle el hueso.",
          "En el vaso de la batidora, añadir los garbanzos, el aguacate, el diente de ajo pelado, el tahini, el zumo de limón, el aceite y una pizca de sal y comino.",
          "Triturar todo hasta obtener una pasta cremosa y homogénea. Si queda muy espeso, se puede añadir un poco de agua.",
          "Servir en un cuenco, regar con un chorrito de aceite de oliva y espolvorear pimentón por encima. Ideal para dipear con bastones de zanahoria o pepino."
        ],
        "galeria": ["/images/recetas/1/1.jpg", "/images/recetas/1/2.jpg", "/images/recetas/1/3.jpg"]

      },
      {
        "id": 2,
        "nombre": "Pan de trigo sarraceno",
        "tipo": "Pan",
        "imagen": "/images/recetas/2/1.jpg",
        "dificultad": "Media",
        "ingredientes": [
          "500g de trigo sarraceno en grano",
          "100g de semillas de girasol",
          "50g de semillas de lino",
          "2 cucharaditas de sal",
          "1 cucharada de sirope de arce (opcional)",
          "350ml de agua."
        ],
        "elaboracion": [
          "Dejar el trigo sarraceno en remojo durante al menos 6 horas.",
          "Escurrir y enjuagar muy bien el grano.",
          "Poner el trigo sarraceno escurrido en un procesador de alimentos junto con el agua y la sal. Triturar hasta obtener una masa.",
          "Añadir las semillas y mezclar con una espátula.",
          "Verter la masa en un molde para pan previamente engrasado.",
          "Hornear a 180°C durante aproximadamente 60-70 minutos, o hasta que al pinchar con un palillo, este salga limpio.",
          "Dejar enfriar completamente sobre una rejilla antes de cortarlo."
        ],
        "galeria": ["/images/recetas/2/1.jpg", "/images/recetas/2/2.jpg"]

      },
      {
        "id": 3,
        "nombre": "Bizcocho de chocolate y calabacín",
        "tipo": "Bizcocho",
        "imagen": "/images/recetas/3/1.jpg",
        "dificultad": "Media",
        "ingredientes": [
          "200g de harina de almendras",
          "50g de cacao en polvo sin azúcar",
          "1 cucharadita de bicarbonato",
          "una pizca de sal",
          "3 huevos",
          "150g de azúcar de coco o panela",
          "100ml de aceite de coco derretido",
          "1 calabacín mediano rallado y escurrido (aprox. 250g)",
          "100g de chips de chocolate negro."
        ],
        "elaboracion": [
          "Precalentar el horno a 180°C y engrasar un molde.",
          "En un bol, mezclar los ingredientes secos: harina de almendras, cacao, bicarbonato y sal.",
          "En otro bol, batir los huevos con el azúcar hasta que estén espumosos. Añadir el aceite de coco y mezclar.",
          "Incorporar la mezcla de ingredientes secos a la de los húmedos y batir hasta que esté todo integrado.",
          "Añadir el calabacín rallado y los chips de chocolate, mezclando con una espátula.",
          "Verter la masa en el molde y hornear durante 45-50 minutos.",
          "Dejar enfriar antes de desmoldar."
        ],
        "galeria": ["/images/recetas/3/1.jpg", "/images/recetas/3/2.jpg", "/images/recetas/3/3.jpg"]

      },
      {
        "id": 4,
        "nombre": "Galletas de almendra y naranja",
        "tipo": "Galletas",
        "imagen": "/images/recetas/4/1.jpg",
        "dificultad": "Baja",
        "ingredientes": [
          "250g de harina de almendras",
          "80g de sirope de agave o miel",
          "la ralladura de una naranja",
          "1 clara de huevo",
          "almendras laminadas para decorar."
        ],
        "elaboracion": [
          "Precalentar el horno a 170°C.",
          "En un bol, mezclar la harina de almendras, el sirope y la ralladura de naranja hasta formar una masa pegajosa.",
          "En otro recipiente, batir ligeramente la clara de huevo (sin llegar a punto de nieve).",
          "Incorporar la clara a la masa y mezclar bien.",
          "Con las manos húmedas, formar pequeñas bolas y aplastarlas ligeramente sobre una bandeja de horno con papel vegetal.",
          "Decorar con almendras laminadas por encima.",
          "Hornear durante 12-15 minutos o hasta que los bordes estén dorados.",
          "Dejar enfriar completamente en la bandeja."
        ],
        "galeria": ["/images/recetas/4/1.jpg", "/images/recetas/4/2.jpg", "/images/recetas/4/3.jpg"]
      },
      {
        "id": 5,
        "nombre": "Lentejas estofadas con verduras",
        "tipo": "Plato principal",
        "imagen": "/images/recetas/5/1.jpg",
        "dificultad": "Baja",
        "ingredientes": [
          "400g de lentejas pardinas (secas)",
          "1 cebolla",
          "2 zanahorias",
          "1 pimiento verde",
          "2 dientes de ajo",
          "1 tomate maduro rallado",
          "1 hoja de laurel",
          "1 cucharadita de pimentón dulce",
          "aceite de oliva virgen extra",
          "sal y pimienta."
        ],
        "elaboracion": [
          "Poner las lentejas en remojo durante al menos 2 horas (opcional, pero reduce el tiempo de cocción).",
          "Picar finamente la cebolla, el pimiento y los ajos. Cortar las zanahorias en rodajas.",
          "En una olla grande, pochar la cebolla y el ajo con un chorro de aceite. Cuando estén transparentes, añadir el pimiento y la zanahoria y cocinar 5 minutos.",
          "Añadir el tomate rallado y el pimentón, remover y cocinar 2 minutos más.",
          "Escurrir las lentejas y añadirlas a la olla. Añadir la hoja de laurel.",
          "Cubrir con agua fría (unos 3 dedos por encima de las lentejas).",
          "Llevar a ebullición y luego bajar el fuego. Cocer a fuego lento durante 45-60 minutos, o hasta que las lentejas estén tiernas. Salpimentar al gusto al final de la cocción."
        ],
        "galeria": ["/images/recetas/5/1.jpg", "/images/recetas/5/2.jpg", "/images/recetas/5/3.jpg"]

      }
    ]

  getListadoDeRecetas() {
    console.log('Devolviendo Recetas desde el servicio')
    return this.listadoRecetas;
  }
}
