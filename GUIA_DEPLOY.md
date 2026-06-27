# Guía rápida para desplegar cambios manualmente

Esta guía te servirá para subir cambios a la web por tu cuenta cuando hagas modificaciones menores (como corregir un párrafo, cambiar una imagen o actualizar un enlace) sin necesidad de usar al agente virtual.

Tus cambios se subirán a GitHub y, gracias a las automatizaciones que ya tienes configuradas, la página web online se actualizará de forma automática en pocos minutos.

## Opción 1: Usar comandos de Git (Recomendado)

Abre la terminal en tu editor de código asegurándote de estar en la carpeta principal del proyecto (`Simón Diaz - Web`) y ejecuta estos tres comandos paso a paso:

1. **Prepara todos los archivos que modificaste:**
   ```bash
   git add -A
   ```

2. **Guarda los cambios con un mensaje descriptivo:**
   *(Cambia el texto entre comillas por algo corto que describa lo que hiciste)*
   ```bash
   git commit -m "fix: corregir error ortográfico en artículo de Materia Viva"
   ```

3. **Sube los cambios a internet:**
   ```bash
   git push origin main
   ```

¡Y listo! En la terminal verás un mensaje que dice `[Git Hook] ¡Subida completada con exito!` y tu web se actualizará sola.

---

## Opción 2: Usar el script automático (`deploy.ps1`)

En la carpeta principal de tu proyecto tienes un archivo llamado `deploy.ps1`. Es un pequeño programa pre-configurado que hace los 3 pasos anteriores de forma automática.

Para usarlo, escribe esto en tu terminal:

```powershell
.\deploy.ps1
```

*Nota: Si Windows te muestra un error en color rojo diciendo que "la ejecución de scripts está deshabilitada", puedes saltar esa restricción escribiendo el siguiente comando:*

```powershell
powershell -ExecutionPolicy Bypass -File .\deploy.ps1
```

El script revisará qué archivos cambiaste, te generará un mensaje de subida automático (con la fecha y los nombres de los archivos modificados) y publicará todo en GitHub por ti.
