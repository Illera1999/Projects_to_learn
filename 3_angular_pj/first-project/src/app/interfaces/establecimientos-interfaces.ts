interface Coordenadas {
    lat: number;
    lon: number; 
}

interface Opinion {
    usuario: string;
    comentario: string;
}

export interface Establecimiento {
    id: number;
    nombre: string;
    direccion: string;
    telefono?: string;           
    tipo_comida: string[];       
    coordenadas: Coordenadas;
    avatar?: string;             
    web?: string;                
    email?: string;              
    opiniones: Opinion[];        
}