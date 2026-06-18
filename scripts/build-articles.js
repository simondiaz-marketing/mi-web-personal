const { Client } = require('@notionhq/client');
const { NotionToMarkdown } = require('notion-to-md');
const { marked } = require('marked');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const n2m = new NotionToMarkdown({ notionClient: notion });

const DATABASE_ID = process.env.NOTION_DATABASE_ID;
const PROJECT_ROOT = path.resolve(__dirname, '..');
const TEMPLATE_PATH = path.join(__dirname, 'template.html');

async function buildArticles() {
    if (!DATABASE_ID || !process.env.NOTION_TOKEN) {
        console.error("Faltan las credenciales de Notion en las variables de entorno.");
        process.exit(1);
    }

    console.log("Conectando a Notion...");
    const templateHtml = fs.readFileSync(TEMPLATE_PATH, 'utf-8');

    const response = await notion.databases.query({
        database_id: DATABASE_ID,
        filter: {
            property: 'Estado',
            select: {
                equals: 'Publicado'
            }
        }
    });

    console.log(`Se encontraron ${response.results.length} artículos publicados.`);

    for (const page of response.results) {
        try {
            const props = page.properties;
            
            // Extracción de propiedades
            const title = props['Título']?.title[0]?.plain_text || 'Sin Título';
            const slug = props['Slug']?.rich_text[0]?.plain_text || page.id;
            const ruta = props['Ruta']?.select?.name; // ej. "practica-1"
            const materiaName = props['Materia']?.select?.name || 'Materia Desconocida'; // ej. "Práctica Profesional"
            const resumen = props['Resumen']?.rich_text[0]?.plain_text || '';
            const fechaRaw = props['Fecha']?.date?.start || new Date().toISOString();
            
            // Formatear fecha
            const fecha = new Date(fechaRaw).toLocaleDateString('es-ES', { year: 'numeric', month: 'long' });

            if (!ruta) {
                console.warn(`Saltando "${title}" porque no tiene Ruta definida.`);
                continue;
            }

            console.log(`Procesando: ${title} (${slug})`);

            // Obtener el contenido en Markdown
            const mdblocks = await n2m.pageToMarkdown(page.id);
            const mdStringObj = n2m.toMarkdownString(mdblocks);
            let markdown = '';
            if (typeof mdStringObj === 'string') {
                markdown = mdStringObj;
            } else if (mdStringObj && mdStringObj.parent) {
                markdown = mdStringObj.parent;
            } else {
                markdown = ''; // En lugar de String(mdStringObj) que genera [object Object]
            }
            
            // Convertir a HTML
            const contentHtml = marked(markdown);

            // Reemplazar variables en la plantilla
            let finalHtml = templateHtml
                .replace(/{{TITLE}}/g, title)
                .replace(/{{MATERIA_NAME}}/g, materiaName)
                .replace(/{{RESUMEN}}/g, resumen)
                .replace(/{{FECHA}}/g, fecha)
                .replace(/{{CONTENT}}/g, contentHtml);

            // Guardar el archivo HTML
            const folderPath = path.join(PROJECT_ROOT, 'trayectoria', ruta);
            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath, { recursive: true });
            }

            const filePath = path.join(folderPath, `${slug}.html`);
            fs.writeFileSync(filePath, finalHtml);
            console.log(`Guardado: ${filePath}`);

            // Actualizar el index.html de la materia
            await updateIndexHtml(folderPath, { title, slug, materiaName, resumen, fecha });

        } catch (err) {
            console.error(`Error procesando página ${page.id}:`, err);
        }
    }
    
    console.log("¡Construcción de artículos finalizada!");
}

async function updateIndexHtml(folderPath, articleData) {
    const indexPath = path.join(folderPath, 'index.html');
    if (!fs.existsSync(indexPath)) return;

    const htmlContent = fs.readFileSync(indexPath, 'utf-8');
    const dom = new JSDOM(htmlContent);
    const document = dom.window.document;
    const grid = document.querySelector('.grid');

    if (!grid) return;

    // Verificar si el artículo ya existe para no duplicarlo
    const existingLink = grid.querySelector(`a[href="${articleData.slug}.html"]`);
    if (existingLink) {
        // Podríamos actualizar la tarjeta existente, pero por ahora solo saltamos
        return;
    }

    // Crear la nueva tarjeta
    const cardHtml = `
    <a href="${articleData.slug}.html" class="card-link">
        <div class="card blog-card">
            <div class="badge subject-badge">${articleData.materiaName}</div>
            <h3>${articleData.title}</h3>
            <p class="card-date">${articleData.fecha}</p>
            <p>${articleData.resumen}</p>
            <span class="read-more">Leer artículo completo &rarr;</span>
        </div>
    </a>`;

    // Insertarla al principio del grid (o después de las tarjetas existentes, acá la ponemos al principio)
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = cardHtml.trim();
    const newCard = tempDiv.firstChild;
    
    grid.insertBefore(newCard, grid.firstChild);

    // Escribir el nuevo HTML (JSDOM puede desordenar un poco el formateo, pero funciona bien)
    fs.writeFileSync(indexPath, dom.serialize());
    console.log(`Índice actualizado: ${indexPath}`);
}

buildArticles();
