# Skill: Content Update

This skill provides a procedure for keeping the website's marketing content and blog posts fresh and aligned with the brand.

## Procedure

1. **Brand Voice Audit**:
   - Review existing text in `index.html` and `bio` sections.
   - Ensure it sounds professional yet accessible (aligned with Simón Díaz's marketing profile).

2. **Blog Integration**:
   - Use NotebookLM MCP tools to query latest notebooks for new insights.
   - Create new `blog-X.html` pages based on these insights.
   - Update `blogs.json` or `index.html` to link to the new posts.

3. **Media Refresh**:
   - Check if profile pictures or project screenshots need updating.
   - Use `generate_image` to create consistent visual assets for new blog posts.

4. **CTA & Contact Optimization**:
   - Ensure "Call to Action" buttons are clear and lead to the desired conversion point.
   - Verify that the contact email (`simondiaz.contacto@gmail.com`) is present and clickable in the footer and main contact section.

## Usage
Invoke this skill when new information is available or on a periodic basis to keep the site "alive".
