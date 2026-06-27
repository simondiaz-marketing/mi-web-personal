# Guía de publicación paso a paso

Si modificaste algún texto, agregaste una imagen o actualizaste un enlace y quieres que esos cambios se vean en tu página web online, sigue esta guía.

No necesitas ser un experto en programación ni saber usar la consola. Sigue estas instrucciones al pie de la letra.

## Paso 1: Abrir la terminal en la carpeta correcta

Para que los comandos funcionen, la terminal (esa pantalla negra donde se escriben textos) debe estar ubicada exactamente en la carpeta de tu página web.

**Opción A: Desde el Explorador de Archivos de Windows**
1. Abre tu carpeta `Simón Diaz - Web` normalmente con doble clic.
2. Haz clic derecho sobre un espacio en blanco adentro de la carpeta (donde no haya ningún archivo).
3. Verás varias opciones. Es importante conocer la diferencia entre estas dos:
   - **"Open Git GUI here" (Abrir la interfaz gráfica de Git aquí):** Abre un programa visual con ventanas y botones (Graphic User Interface). **NO** usaremos esta opción.
   - **"Open Git Bash here" (Abrir la terminal de Git aquí):** Abre la interfaz de línea de comandos (command-line interface). Es una ventana negra donde puedes escribir instrucciones de texto directamente. **Haz clic en esta opción.**
4. Se abrirá una ventana lista para que escribas.

**Opción B: Desde tu editor de código (VS Code o Antigravity IDE)**
1. Asegúrate de tener abierta la carpeta `Simón Diaz - Web` en tu programa.
2. Ve al menú superior, busca la opción **"Terminal"** y haz clic en **"New terminal" (Nueva terminal)**.
3. Aparecerá un panel en la parte inferior donde podrás escribir.

---

## Paso 2: Subir los cambios a internet

Ahora que tienes la terminal abierta, solo tienes que escribir tres comandos. Debes presionar la tecla **Enter** (Intro) después de escribir cada uno.

**1. El comando `add` (Comando para añadir/preparar)**
Este comando le indica al sistema que debe rastrear y agrupar todos los archivos que has modificado, añadido o eliminado, preparándolos para ser guardados.
Escribe exactamente esto y presiona Enter:
```bash
git add -A
```
*(Nota: La letra "A" viene de la palabra "All" (Todo). Esto prepara absolutamente todos los cambios que hiciste).*

**2. El comando `commit` (Comando para confirmar/etiquetar)**
Esta función guarda una captura o fotografía de tus archivos preparados en el historial del proyecto, y les adjunta un mensaje descriptivo a modo de etiqueta.
Escribe esto y presiona Enter. Puedes cambiar el texto que está entre comillas para describir lo que hiciste:
```bash
git commit -m "update text (actualicé el texto)"
```
*(Nota: La letra `-m` viene de la palabra "message" (mensaje). Asegúrate de incluir las comillas `"` al principio y al final de tu mensaje).*

**3. El comando `push` (Comando para empujar/subir)**
Este es el paso final. Toma la captura que creaste en el paso anterior y la "empuja" desde tu computadora local hacia el servidor remoto (en internet).
Escribe esto y presiona Enter:
```bash
git push origin main
```
*(Nota: La palabra `origin` (origen) hace referencia al servidor de internet, en este caso GitHub, y `main` (principal) hace referencia a tu rama principal de trabajo. Al finalizar, verás un mensaje de éxito).*

---

## ¡Y eso es todo!

Una vez que completes el tercer comando, tu página web se actualizará sola en internet (puede demorar un par de minutos). Ya puedes cerrar la ventana de la terminal.
