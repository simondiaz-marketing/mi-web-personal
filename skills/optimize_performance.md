# Skill: Performance Optimization

This skill provides a procedure for reducing load times and improving the user experience.

## Procedure

1. **Image Optimization**:
   - Identify large image files (e.g., > 500KB).
   - Suggest converting them to modern formats like WebP or Avif.
   - Ensure `width` and `height` attributes are specified to prevent layout shifts (CLS).

2. **Asset Analysis**:
   - Check if CSS and JS files are minified.
   - Identify unused CSS or JS.
   - Suggest lazy-loading for images below the fold.

3. **Resource Prioritization**:
   - Use `<link rel="preconnect">` for external domains (e.g., Google Fonts).
   - Ensure critical CSS is loaded first.

4. **Code Efficiency**:
   - Look for inefficient loops or DOM manipulations in `main.js`.

## Usage
Run this skill by listing directory contents to check file sizes and reviewing code for efficiency.
