import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

export interface PostPhoto {
  webPath: string;
  blob: Blob
}

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  async getPhotoFromSource(source: CameraSource): Promise<PostPhoto | null> {
    try {
      const platform = Capacitor.getPlatform();
      const isWeb = platform === 'web';

      console.log('[PhotoService] getPhotoFromSource()', { platform, source });

      const photo = await Camera.getPhoto({
        quality: 80,
        resultType: isWeb ? CameraResultType.DataUrl : CameraResultType.Uri,
        source,
        allowEditing: false,
      });

      let webPath: string;
      let blob: Blob;

      if (isWeb) {
        if (!photo.dataUrl) {
          console.warn('[PhotoService] No se recibió dataUrl en web');
          return null;
        }
        webPath = photo.dataUrl;
        blob = this.dataUrlToBlob(photo.dataUrl);
      } else {
        if (!photo.webPath) {
          console.warn('[PhotoService] La foto no tiene webPath en plataforma nativa');
          return null;
        }
        webPath = photo.webPath;
        const response = await fetch(photo.webPath);
        blob = await response.blob();
      }

      return { webPath, blob };
    } catch (err: any) {
      const message = err?.message || String(err);

      if (message.includes('User cancelled photos app')) {
        console.log('[PhotoService] Usuario canceló la selección de foto');
        return null;
      }

      console.error('[PhotoService] Error en Camera.getPhoto:', err);
      return null;
    }
  }

  private dataUrlToBlob(dataUrl: string): Blob {
    const parts = dataUrl.split(',');
    const mimeMatch = parts[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
    const binary = atob(parts[1]);
    const len = binary.length;
    const buffer = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      buffer[i] = binary.charCodeAt(i);
    }
    return new Blob([buffer], { type: mime });
  }
}