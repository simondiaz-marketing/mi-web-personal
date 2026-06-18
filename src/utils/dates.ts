import type { CollectionEntry } from 'astro:content';

export function parseSpanishDate(dateString: string): number {
    const months: Record<string, number> = {
        enero: 0, febrero: 1, marzo: 2, abril: 3, mayo: 4, junio: 5,
        julio: 6, agosto: 7, septiembre: 8, octubre: 9, noviembre: 10, diciembre: 11
    };

    const str = dateString.toLowerCase();
    
    // Extraer año (4 dígitos)
    const yearMatch = str.match(/\b(20\d{2})\b/);
    const year = yearMatch ? parseInt(yearMatch[1], 10) : new Date().getFullYear();

    // Extraer mes
    let month = 0;
    for (const [mName, mIndex] of Object.entries(months)) {
        if (str.includes(mName)) {
            month = mIndex;
            break;
        }
    }

    // Extraer día: encontrar los números de 1 o 2 dígitos
    // Ejemplo: "10 y 11 de junio" -> tomará el 11
    const dayMatches = str.match(/\b(\d{1,2})\b/g);
    let day = 1;
    if (dayMatches) {
        const daysOnly = dayMatches.filter(d => d.length <= 2);
        if (daysOnly.length > 0) {
            day = parseInt(daysOnly[daysOnly.length - 1], 10);
        }
    }

    return new Date(year, month, day).getTime();
}

export function sortArticlesByDate(articles: CollectionEntry<'trayectoria'>[]) {
    return [...articles].sort((a, b) => {
        return parseSpanishDate(b.data.date) - parseSpanishDate(a.data.date);
    });
}
