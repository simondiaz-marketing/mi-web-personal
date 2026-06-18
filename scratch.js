const { Client } = require('@notionhq/client');
const { NotionToMarkdown } = require('notion-to-md');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const n2m = new NotionToMarkdown({ notionClient: notion });

async function test() {
    const response = await notion.databases.query({
        database_id: process.env.NOTION_DATABASE_ID,
        filter: { property: 'Estado', select: { equals: 'Publicado' } }
    });
    const pageId = response.results[0].id;
    const mdblocks = await n2m.pageToMarkdown(pageId);
    const mdString = n2m.toMarkdownString(mdblocks);
    console.log("MDBLOCKS TYPE:", typeof mdblocks);
    console.log("MDBLOCKS RAW:", JSON.stringify(mdblocks, null, 2));
    console.log("MDSTRING TYPE:", typeof mdString);
    console.log("MDSTRING PARENT TYPE:", mdString ? typeof mdString.parent : 'undefined');
    console.log("MDSTRING RAW:", JSON.stringify(mdString, null, 2));
}
test();
