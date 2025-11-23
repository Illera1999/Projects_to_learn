import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

export interface PostPhoto {
  webPath: string;
  blob: Blob
}

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  async pickPostPhoto(): Promise<PostPhoto | null> {
    try {
      console.log('[PhotoService] Abriendo Camera.getPhoto...');

      const photo = await Camera.getPhoto({
        quality: 80,
        resultType: CameraResultType.Uri,
        source: CameraSource.Prompt,
        allowEditing: false,
      });

      if (!photo.webPath) {
        console.warn('[PhotoService] La foto no tiene webPath');
        return null;
      }

      const response = await fetch(photo.webPath);
      const blob = await response.blob();

      return {
        webPath: photo.webPath,
        blob,
      };
    } catch (err) {
      console.error('[PhotoService] Error o cancelación en Camera.getPhoto:', err);
      return null;
    }
  }
}