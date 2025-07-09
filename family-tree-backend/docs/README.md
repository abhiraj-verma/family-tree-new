# API Documentation

This directory contains comprehensive API documentation for the Family Tree backend application.

## Files

- **API_Documentation.md** - Complete API reference with request/response examples
- **API_Documentation.html** - HTML version for easier viewing in browser
- **generate-pdf.js** - Helper script with instructions for PDF generation

## Generating PDF

### Method 1: Using Pandoc (Recommended)

Install pandoc and run:
```bash
pandoc API_Documentation.md -o API_Documentation.pdf --pdf-engine=xelatex
```

### Method 2: Using markdown-pdf

Install and run:
```bash
npm install -g markdown-pdf
markdown-pdf API_Documentation.md
```

### Method 3: Online Converters

- [MarkdownToPDF](https://www.markdowntopdf.com/)
- [MD2PDF](https://md2pdf.netlify.app/)

### Method 4: VS Code Extensions

- Markdown PDF extension
- Markdown All in One extension

## Documentation Contents

The API documentation includes:

- **Authentication APIs** - Registration, login, logout
- **Family Management APIs** - Create, read, update family trees
- **User Management APIs** - User CRUD operations
- **Image Management APIs** - Upload and delete images
- **Public APIs** - Public family tree access
- **Relationship APIs** - Manage family relationships
- **Error Codes Reference** - Complete error handling guide
- **Data Models** - Request/response schemas
- **Security** - Authentication and authorization details

## Usage

1. **For Developers**: Use the markdown file for implementation reference
2. **For Testing**: Use the request/response examples for API testing
3. **For Documentation**: Generate PDF for formal documentation
4. **For Review**: Open HTML file in browser for easy reading

## Updates

When updating the API:

1. Update the markdown file with new endpoints
2. Add request/response examples
3. Update error codes if needed
4. Regenerate PDF documentation
5. Update version information

## API Testing

Use the provided examples with tools like:

- **Postman** - Import the examples as a collection
- **curl** - Use the command-line examples
- **Insomnia** - REST client testing
- **Thunder Client** - VS Code extension

## Support

For questions about the API documentation:

1. Check the examples in the documentation
2. Review the error codes reference
3. Test with the provided mock data
4. Contact the development team

---

*Last updated: January 15, 2024*