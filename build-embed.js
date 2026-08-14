/**
 * AcademiaPro - Google Sites Single-File Embed Bundler
 * 
 * Bundles index.html, css/style.css, and js/app.js into a self-contained
 * single HTML file (`academia_pro_embed.html`) optimized for Google Sites iframe embedding.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = __dirname;
const HTML_PATH = path.join(ROOT_DIR, 'index.html');
const CSS_PATH = path.join(ROOT_DIR, 'css', 'style.css');
const JS_PATH = path.join(ROOT_DIR, 'js', 'app.js');
const OUTPUT_PATH = path.join(ROOT_DIR, 'academia_pro_embed.html');

function buildEmbed() {
  console.log('🚀 Starting AcademiaPro embed build...');

  // 1. Verify and read source files
  if (!fs.existsSync(HTML_PATH)) {
    throw new Error(`Missing HTML file at ${HTML_PATH}`);
  }
  if (!fs.existsSync(CSS_PATH)) {
    throw new Error(`Missing CSS file at ${CSS_PATH}`);
  }
  if (!fs.existsSync(JS_PATH)) {
    throw new Error(`Missing JS file at ${JS_PATH}`);
  }

  const htmlContent = fs.readFileSync(HTML_PATH, 'utf8');
  const cssContent = fs.readFileSync(CSS_PATH, 'utf8');
  const jsContent = fs.readFileSync(JS_PATH, 'utf8');

  console.log(`  📄 Read index.html: ${(Buffer.byteLength(htmlContent, 'utf8') / 1024).toFixed(2)} KB`);
  console.log(`  🎨 Read css/style.css: ${(Buffer.byteLength(cssContent, 'utf8') / 1024).toFixed(2)} KB`);
  console.log(`  ⚡ Read js/app.js: ${(Buffer.byteLength(jsContent, 'utf8') / 1024).toFixed(2)} KB`);

  let bundledHtml = htmlContent;

  // 2. Remove any references to data.js if present
  const dataScriptRegex = /<script\b[^>]*\bsrc=["'][^"']*data\.js["'][^>]*>\s*<\/script>\s*/gi;
  bundledHtml = bundledHtml.replace(dataScriptRegex, '');

  // 3. Inline CSS stylesheet into <style> block
  const cssLinkRegex = /<link\b[^>]*\brel=["']stylesheet["'][^>]*\bhref=["'][^"']*style\.css["'][^>]*\s*\/?>|<link\b[^>]*\bhref=["'][^"']*style\.css["'][^>]*\brel=["']stylesheet["'][^>]*\s*\/?>/i;
  
  if (!cssLinkRegex.test(bundledHtml)) {
    console.warn('⚠️  Warning: Could not find css/style.css <link> tag matching regex. Appending <style> to <head>.');
    bundledHtml = bundledHtml.replace('</head>', `  <style>\n${cssContent}\n  </style>\n</head>`);
  } else {
    const inlineStyle = `<!-- Inlined Design System CSS for Standalone / Google Sites Embed -->\n  <style>\n${cssContent}\n  </style>`;
    bundledHtml = bundledHtml.replace(cssLinkRegex, inlineStyle);
  }

  // 4. Inline JS application script into <script> block
  const appScriptRegex = /<script\b[^>]*\bsrc=["'][^"']*app\.js["'][^>]*>\s*<\/script>/i;

  if (!appScriptRegex.test(bundledHtml)) {
    console.warn('⚠️  Warning: Could not find js/app.js <script> tag matching regex. Appending <script> before </body>.');
    bundledHtml = bundledHtml.replace('</body>', `  <script>\n${jsContent}\n  </script>\n</body>`);
  } else {
    const inlineScript = `<!-- Inlined AcademiaPro Application Script -->\n  <script>\n${jsContent}\n  </script>`;
    bundledHtml = bundledHtml.replace(appScriptRegex, inlineScript);
  }

  // 5. Write output file
  fs.writeFileSync(OUTPUT_PATH, bundledHtml, 'utf8');

  const outputStats = fs.statSync(OUTPUT_PATH);
  const outputSizeKb = (outputStats.size / 1024).toFixed(2);

  console.log('\n✅ Build completed successfully!');
  console.log(`  📦 Output file: ${OUTPUT_PATH}`);
  console.log(`  📊 Output size: ${outputStats.size} bytes (${outputSizeKb} KB)`);

  return {
    outputPath: OUTPUT_PATH,
    sizeBytes: outputStats.size,
    sizeKb: outputSizeKb
  };
}

if (require.main === module) {
  try {
    buildEmbed();
  } catch (err) {
    console.error('❌ Build failed:', err);
    process.exit(1);
  }
}

module.exports = { buildEmbed };
