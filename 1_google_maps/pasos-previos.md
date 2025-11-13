## ⚙️ Pasos previos al inicio del proyecto

Antes de comenzar con el desarrollo, quiero poder **visualizar el proyecto directamente en el navegador (uso Firefox)** sin tener que estar arrastrando manualmente el archivo `index.html`.

Para ello, decidí configurar mi **propio servidor local**. Así puedo escribir `http://localhost` en el navegador y ver automáticamente el proyecto cargado.

---

## 🧩 Configuración del servidor local en macOS

Estoy trabajando con un **Mac Mini**, y este sistema operativo ya incluye **Apache instalado por defecto**, aunque viene desactivado.  
Por tanto, solo fue necesario **configurarlo y activarlo** para que funcione correctamente.

Los pasos que seguí fueron los siguientes:

1. **Comprobar que Apache está instalado**
```bash
httpd -v
```

Si devuelve la versión de Apache, todo está correcto.

2. **Iniciar el servidor**
```bash
sudo apachectl start
```

3. **Verificar funcionamiento**

Abre en el navegador:
```bash
http://localhost
```
Si aparece el mensaje “It works!”, Apache está corriendo.

4. **Configurar el VirtualHost para el puerto 8080**

Para no usar la carpeta del sistema (`/Library/WebServer/Documents`), configuré un **VirtualHost** personalizado que apunta a mi carpeta de trabajo y escucha en el puerto `8080`.

Abrí el archivo de configuración de Virtual Hosts:
```bash
sudo vim /etc/apache2/extra/httpd-vhosts.conf
```

Y añadí lo siguiente al final del archivo:
```bash
Listen 8080

<VirtualHost *:8080>
    ServerName localhost
    DocumentRoot "/Users/usuario/ruta/del/proyecto"

    <Directory "/Users/usuario/ruta/del/proyecto">
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog "/private/var/log/apache2/html5_error.log"
    CustomLog "/private/var/log/apache2/html5_access.log" common
</VirtualHost>
```


5. **Reiniciar Apache para aplicar los cambios**
```bash
sudo apachectl restart
```

6. **Verificar que Apache escucha en el puerto 8080**
```bash
sudo lsof -i :8080
```
Si aparece un proceso de Apache en la lista, el servidor está en escucha correctamente.

---

### ⚠️ Si aparece el error “Forbidden” en el navegador

Si al acceder a `http://localhost:8080` aparece el mensaje:

Forbidden
You don’t have permission to access this resource.

significa que **Apache no tiene permisos para acceder a la ruta que configuraste** como `DocumentRoot`.

Para solucionarlo, debes otorgar permisos de lectura y ejecución al usuario del servidor (`_www`) sobre tu carpeta del proyecto:

```bash
chmod -R o+rX /Users/usuario/ruta/del/proyecto
```

Esto permite que Apache pueda entrar en las carpetas y leer los archivos necesarios para mostrar la web.

Después de aplicar los permisos, **reinicia Apache**:
```bash
sudo apachectl restart
```

Y vuelve a probar en el navegador:
```bash
http://localhost:8080
```

---

Ahora tengo un **entorno local configurado en el puerto 8080**, completamente funcional, que me permite trabajar y visualizar los cambios de mi proyecto en tiempo real sin necesidad de arrastrar archivos manualmente.