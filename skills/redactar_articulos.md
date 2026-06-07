---
name: portfolio-article-simondiaz
description: >
  Skill para crear artículos HTML completos y listos para publicar en el portafolio académico
  de Simón Díaz (simondiaz.pages.dev), alojado en GitHub y editado desde Antigravity IDE.
  Activar cuando Simón diga: "escribime un artículo", "nuevo artículo para el portafolio",
  "artículo para [materia]", "publicar en el portfolio", "crear página HTML para el sitio",
  "artículo para Trayectoria", "agregar artículo a [materia]", o cuando pida redactar
  contenido académico para subir al sitio web. También activar si menciona una materia del
  Profesorado de TIC del ISARM y quiere convertir ese contenido en una página del portafolio.
---

# Skill: Artículos HTML para Portafolio — Simón Díaz

Esta skill produce dos entregables en cada ejecución:
1. El **archivo HTML del artículo** (listo para guardar en la ruta correcta del repo).
2. El **fragmento de tarjeta HTML** para insertar en el `index.html` de la materia correspondiente.

Leé este archivo completo antes de escribir una sola línea de código.

---

## 1. Arquitectura del sitio

```
simondiaz.pages.dev/           ← GitHub Pages / Cloudflare Pages
│
├── index.html                 ← Página de inicio
├── trayectoria.html           ← Hub de todas las materias
│
└── trayectoria/
    ├── practica-1/
    │   ├── index.html         ← Lista de artículos de la materia
    │   └── [slug-articulo].html
    ├── comunicacion-1/
    │   ├── index.html
    │   └── [slug-articulo].html
    ├── sistemas-operativos/
    │   ├── index.html
    │   └── [slug-articulo].html
    ├── arquitectura/
    │   ├── index.html
    │   └── [slug-articulo].html
    ├── taller-ole/
    │   ├── index.html
    │   └── [slug-articulo].html
    └── actividades-complementarias/
        ├── index.html
        └── [slug-articulo].html
```

**Regla de slugs:** todo en minúsculas, palabras separadas por guiones, sin tildes ni caracteres especiales.
Ejemplo: "Algoritmos de Planificación de CPU" → `algoritmos-planificacion-cpu.html`

---

## 2. Mapeo de materias → carpetas y etiquetas

| Materia | Carpeta | Etiqueta de badge |
|---|---|---|
| Práctica I | `practica-1` | Práctica Profesional |
| Comunicación I | `comunicacion-1` | Habilidades Blandas |
| Sistemas Operativos | `sistemas-operativos` | Sistemas y Software |
| Arquitectura de Ordenadores | `arquitectura` | Hardware y Sistemas |
| Taller de Oralidad, Lectura y Escritura | `taller-ole` | Comprensión y Escritura |
| Formación Complementaria | `actividades-complementarias` | Formación Complementaria |

---

## 3. Template HTML del artículo

Usá **exactamente** esta estructura. No agregar frameworks externos, no cambiar clases del nav, no modificar el footer.

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="[META DESCRIPTION — 150 chars máx, específica del artículo]" />
  <!-- Open Graph -->
  <meta property="og:title" content="[TÍTULO ARTÍCULO] | [MATERIA] | Simón Diaz" />
  <meta property="og:description" content="[MISMA META DESCRIPTION]" />
  <meta property="og:image" content="https://simondiaz.pages.dev/assets/img/perfil.jpg" />
  <meta property="og:type" content="article" />
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="[TÍTULO ARTÍCULO] | [MATERIA] | Simón Diaz" />
  <meta name="twitter:description" content="[MISMA META DESCRIPTION]" />
  <meta name="twitter:image" content="https://simondiaz.pages.dev/assets/img/perfil.jpg" />

  <title>[TÍTULO ARTÍCULO] | [MATERIA] | Simón Diaz</title>
  <link rel="stylesheet" href="../../../assets/css/style.css" />
  <!-- Ajustar ../ según profundidad real de la ruta -->
</head>
<body>

  <!-- ===== NAV ===== -->
  <nav class="navbar">
    <div class="nav-brand">
      <a href="/index.html">SIMÓN DIAZ</a>
    </div>
    <ul class="nav-links">
      <li><a href="/index.html">Inicio</a></li>
      <li><a href="/sobre-mi.html">Sobre Mí</a></li>
      <li><a href="/trayectoria.html">Trayectoria Académica</a></li>
      <li><a href="/videos.html">Videos</a></li>
      <li><a href="/contacto.html">Contacto</a></li>
      <li><a href="javascript:void(0)" class="menu-toggle">&#9776;</a></li>
    </ul>
  </nav>

  <!-- ===== CONTENIDO PRINCIPAL ===== -->
  <main class="article-container">

    <!-- Breadcrumb -->
    <a href="../index.html" class="back-link">← Volver a [NOMBRE MATERIA]</a>

    <!-- Badge de categoría -->
    <span class="article-badge">[ETIQUETA DE BADGE]</span>

    <!-- Título principal -->
    <h1>[TÍTULO COMPLETO DEL ARTÍCULO]</h1>

    <!-- Autor y fecha -->
    <div class="article-meta">
      <img src="/assets/img/perfil.jpg" alt="Simón Diaz" class="author-avatar" />
      <div>
        <strong>Simón Diaz</strong>
        <p>Publicado en [Mes] [Año]</p>
      </div>
    </div>

    <!-- ===== CUERPO DEL ARTÍCULO ===== -->

    <!-- INTRODUCCIÓN -->
    <p>[Párrafo introductorio que contextualiza el trabajo: qué materia, qué actividad, qué objetivo tuvo.]</p>

    <!-- SECCIONES con h2 / h3 según jerarquía -->
    <h2>[Título de sección principal]</h2>
    <p>[Desarrollo del contenido académico.]</p>

    <!-- Subsección opcional -->
    <h3>[Subtítulo]</h3>
    <p>[Contenido de la subsección.]</p>

    <!-- Lista ordenada — usar cuando el contenido es secuencial o enumerativo -->
    <ol>
      <li>[Elemento 1]</li>
      <li>[Elemento 2]</li>
    </ol>

    <!-- Lista desordenada — usar para características, ejemplos, rasgos -->
    <ul>
      <li>[Elemento A]</li>
      <li>[Elemento B]</li>
    </ul>

    <!-- Cita destacada / blockquote — usar para citas textuales o ideas clave -->
    <blockquote>
      "[Texto de la cita]"
    </blockquote>

    <!-- Tabla — usar para comparativas, definiciones, datos -->
    <table>
      <thead>
        <tr>
          <th>[Columna 1]</th>
          <th>[Columna 2]</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>[Dato]</td>
          <td>[Dato]</td>
        </tr>
      </tbody>
    </table>

    <!-- Embed de Canva (solo si hay presentación asociada) -->
    <h2>[Título de sección con presentación]</h2>
    <p>[Texto introductorio antes del embed.]</p>
    <div class="embed-container">
      <iframe
        src="https://www.canva.com/design/[ID]/view?embed"
        allowfullscreen
        loading="lazy"
        title="[Descripción del embed]">
      </iframe>
    </div>
    <p class="embed-caption">
      Presentación: <a href="[URL pública de Canva]" target="_blank" rel="noopener">[Nombre de la presentación]</a> de Simón Diaz.
    </p>

    <!-- Reflexión / cierre — siempre incluirlo al final -->
    <h2>[Reflexión final / Conclusión]</h2>
    <p>[Párrafo de cierre con reflexión personal o síntesis del aprendizaje.]</p>

  </main>

  <!-- ===== FOOTER ===== -->
  <footer class="site-footer">
    <p>Contacto: <a href="mailto:Simondiaz.contacto@gmail.com">Simondiaz.contacto@gmail.com</a></p>
    <p>© 2026 Simón Diaz. Todos los derechos reservados.</p>
  </footer>

</body>
</html>
```

---

## 4. Fragmento de tarjeta para el `index.html` de la materia

Cuando se crea un artículo nuevo, también hay que agregar su tarjeta al listado de la materia. El fragmento va dentro del contenedor de artículos del `index.html` de la carpeta de la materia.

```html
<a href="[slug-articulo].html" class="article-card">
  <span class="card-category">[Subcategoría breve — ej: "Unidad I", "Trabajo Práctico", "Reflexión"]</span>
  <h3>[Título del artículo]</h3>
  <p>[Descripción de 1-2 oraciones. Sin spoilers del desarrollo, solo contexto de qué es y para qué sirvió.]</p>
  <span class="card-link">Leer artículo →</span>
</a>
```

---

## 5. Rutas relativas según ubicación del archivo

Los artículos siempre están en `trayectoria/[materia]/[slug].html`, es decir, **3 niveles desde la raíz**. Las rutas deben ser:

| Recurso | Ruta a usar |
|---|---|
| CSS principal | `../../assets/css/style.css` |  
| Imagen de perfil | `/assets/img/perfil.jpg` (absoluta) |
| Volver a materia | `../index.html` |
| Links del nav | `/index.html`, `/sobre-mi.html`, etc. (absolutas) |

> ⚠️ En Antigravity IDE: verificar siempre que las rutas relativas al CSS resuelvan correctamente al hacer preview local. Si el IDE tiene un servidor local en la raíz del repo, `/assets/css/style.css` (ruta absoluta) también es válida.

---

## 6. Reglas de redacción y estilo

**Tono:** Académico formal pero accesible. Primera persona cuando se reflexiona sobre el propio aprendizaje. Tercera persona o impersonal cuando se desarrolla teoría o se describe una actividad.

**Extensión mínima por artículo:**
- Introducción: 1 párrafo (3-5 oraciones)
- Mínimo 3 secciones con `h2`
- Cierre reflexivo: 1 párrafo

**Nunca usar:**
- `<font>`, `<center>`, `<b>` (usar `<strong>`) ni `<i>` (usar `<em>`)
- Clases CSS inventadas que no estén en el sistema de diseño del sitio
- IDs en el HTML del artículo salvo que el JS del sitio lo requiera
- Comentarios de marcado que expongan estructura interna del sitio

**Siempre usar:**
- `<strong>` para énfasis importantes dentro del texto
- `<em>` para términos técnicos en su primera aparición, o en inglés
- `<blockquote>` para citas textuales de autores o de la propia actividad
- `alt` descriptivo en toda `<img>`
- `title` descriptivo en todo `<iframe>`

**Títulos:**
- `<h1>`: único por página, es el título del artículo
- `<h2>`: secciones principales del artículo
- `<h3>`: subsecciones (no ir más profundo que h3)

---

## 7. Checklist antes de entregar

Antes de presentar el HTML final a Simón, verificar mentalmente:

- [ ] `<title>` sigue el patrón: `[Artículo] | [Materia] | Simón Diaz`
- [ ] `<meta name="description">` tiene menos de 150 caracteres y describe el artículo específico
- [ ] El `<link rel="stylesheet">` tiene la ruta correcta (`../../assets/css/style.css`)
- [ ] El breadcrumb `← Volver a [Materia]` apunta a `../index.html`
- [ ] El badge corresponde al mapeo de la Sección 2
- [ ] El footer es exactamente igual al de las páginas existentes
- [ ] No hay clases CSS inventadas
- [ ] Se entregó también el fragmento de tarjeta para el `index.html` de la materia
- [ ] Se indicó en qué ruta guardar el archivo (`trayectoria/[carpeta]/[slug].html`)

---

## 8. Flujo de trabajo con Antigravity IDE y GitHub

Al presentar el entregable, siempre incluir estas instrucciones al final:

```
📁 GUARDAR COMO:
   trayectoria/[carpeta-materia]/[slug-articulo].html

📋 AGREGAR TARJETA EN:
   trayectoria/[carpeta-materia]/index.html
   → Insertar el fragmento de tarjeta dentro del contenedor de artículos

🚀 PUBLICAR:
   1. Guardar el archivo en Antigravity IDE
   2. Hacer commit con el mensaje: "feat: agregar artículo [nombre] en [materia]"
   3. Push a la rama main → Cloudflare Pages despliega automáticamente
```

---

## 9. Ejemplo de ejecución completa

**Input de Simón:** "Escribime un artículo para Arquitectura sobre la arquitectura Von Neumann."

**Output esperado:**

1. Archivo HTML completo con ruta: `trayectoria/arquitectura/arquitectura-von-neumann.html`
2. Fragmento de tarjeta para insertar en `trayectoria/arquitectura/index.html`
3. Instrucciones de guardado y commit (Sección 8)

---

*Skill creada el 5 de junio de 2026. Basada en el análisis del sitio simondiaz.pages.dev y su estructura de carpetas real.*
