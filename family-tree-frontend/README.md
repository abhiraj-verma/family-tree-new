# Family Tree Frontend

A Next.js application for building and sharing family trees.

## Features

- User authentication and registration
- Interactive family tree builder
- Member relationship management
- Public family tree sharing
- Responsive design for all devices
- SEO optimized
- Image upload support
- Real-time updates

## Prerequisites

- Node.js 18 or higher
- npm or yarn

## Installation

```bash
npm install
# or
yarn install
```

## Configuration

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Running the Application

```bash
# Development
npm run dev
# or
yarn dev

# Production build
npm run build
npm start
# or
yarn build
yarn start
```

## Project Structure

```
family-tree-frontend/
├── app/                    # Next.js 13+ app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx          # Home page
│   └── family/           # Public family routes
├── components/           # React components
│   ├── auth/            # Authentication components
│   ├── tree/            # Family tree components
│   ├── public/          # Public view components
│   └── ui/              # UI components
├── contexts/            # React contexts
├── lib/                 # Utility libraries
└── public/             # Static assets
```

## Key Features

### Authentication
- Username/password registration and login
- Google OAuth integration
- JWT token management
- Secure cookie storage

### Family Tree Builder
- Add family members with detailed information
- Define relationships (parent, child, spouse)
- Visual tree representation
- Member editing and removal
- Family name customization

### Public Sharing
- Generate shareable links
- Token-based access control
- View-only public access
- SEO-friendly public pages

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimization
- Touch-friendly interactions
- Accessible design

## API Integration

The frontend communicates with the Spring Boot backend through:
- RESTful API calls
- JWT authentication headers
- File upload for images
- Error handling and validation

## SEO Optimization

- Server-side rendering with Next.js
- Meta tags and Open Graph
- Structured data (JSON-LD)
- Sitemap generation
- Robot.txt configuration

## Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Upload dist folder to Netlify
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Environment Variables

### Development
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Production
```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
NEXT_PUBLIC_APP_URL=https://your-frontend-domain.com
```

## Performance Optimization

- Image optimization with Next.js Image component
- Code splitting and lazy loading
- CSS optimization with Tailwind CSS
- Bundle analysis and optimization
- Caching strategies

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.