const fs = require('fs');
const path = require('path');

// Simple script to help convert markdown to PDF
// You can use tools like pandoc or markdown-pdf to generate PDF

console.log('API Documentation generated at: family-tree-backend/docs/API_Documentation.md');
console.log('');
console.log('To generate PDF, you can use one of these methods:');
console.log('');
console.log('1. Using pandoc (recommended):');
console.log('   pandoc API_Documentation.md -o API_Documentation.pdf --pdf-engine=xelatex');
console.log('');
console.log('2. Using markdown-pdf (npm package):');
console.log('   npm install -g markdown-pdf');
console.log('   markdown-pdf API_Documentation.md');
console.log('');
console.log('3. Using online converters:');
console.log('   - https://www.markdowntopdf.com/');
console.log('   - https://md2pdf.netlify.app/');
console.log('');
console.log('4. Using VS Code extensions:');
console.log('   - Markdown PDF extension');
console.log('   - Markdown All in One extension');

// Create a simple HTML version for easier viewing
const markdownContent = fs.readFileSync(path.join(__dirname, 'API_Documentation.md'), 'utf8');

const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Family Tree API Documentation</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            color: #333;
        }
        h1, h2, h3 { color: #2c3e50; }
        h1 { border-bottom: 3px solid #3498db; padding-bottom: 10px; }
        h2 { border-bottom: 2px solid #ecf0f1; padding-bottom: 5px; margin-top: 30px; }
        h3 { color: #27ae60; margin-top: 25px; }
        code {
            background: #f8f9fa;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Monaco', 'Consolas', monospace;
        }
        pre {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 5px;
            padding: 15px;
            overflow-x: auto;
        }
        pre code {
            background: none;
            padding: 0;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 15px 0;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
        }
        th {
            background-color: #f8f9fa;
            font-weight: 600;
        }
        .endpoint {
            background: #e8f5e8;
            border-left: 4px solid #27ae60;
            padding: 10px;
            margin: 10px 0;
        }
        .error {
            background: #fdf2f2;
            border-left: 4px solid #e74c3c;
            padding: 10px;
            margin: 10px 0;
        }
        .success {
            background: #f0f9ff;
            border-left: 4px solid #3498db;
            padding: 10px;
            margin: 10px 0;
        }
        .toc {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 5px;
            padding: 20px;
            margin: 20px 0;
        }
        .toc ul {
            list-style-type: none;
            padding-left: 0;
        }
        .toc li {
            margin: 5px 0;
        }
        .toc a {
            text-decoration: none;
            color: #3498db;
        }
        .toc a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div id="content">
        ${markdownContent.replace(/```json/g, '<pre><code class="json">').replace(/```/g, '</code></pre>').replace(/\n/g, '<br>')}
    </div>
    
    <script>
        // Simple markdown to HTML conversion for basic formatting
        document.addEventListener('DOMContentLoaded', function() {
            const content = document.getElementById('content');
            let html = content.innerHTML;
            
            // Convert headers
            html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
            html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
            html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
            
            // Convert bold
            html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            
            // Convert inline code
            html = html.replace(/\`([^`]+)\`/g, '<code>$1</code>');
            
            // Convert links
            html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
            
            content.innerHTML = html;
        });
    </script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'API_Documentation.html'), htmlTemplate);
console.log('HTML version created at: family-tree-backend/docs/API_Documentation.html');