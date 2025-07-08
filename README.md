# KnowYourFamilyTree

A full-stack family tree application built with Spring Boot backend and Next.js frontend.

## Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Family Tree Builder**: Interactive visual family tree with drag-and-drop functionality
- **Relationship Management**: Support for parent-child, spouse relationships
- **Public Sharing**: Share family trees with public links
- **Image Upload**: Upload and manage family member photos
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Real-time Updates**: Live updates when family members are added/edited

## Tech Stack

### Backend
- **Spring Boot 3.2.1** - Java framework
- **MongoDB Atlas** - NoSQL database
- **Spring Security** - Authentication and authorization
- **JWT** - Token-based authentication
- **Wasabi S3** - Image storage
- **Maven** - Dependency management

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Axios** - HTTP client

## Project Structure

```
family-tree/
├── family-tree-backend/     # Spring Boot API
│   ├── src/main/java/
│   │   └── com/familytree/
│   │       ├── config/      # Configuration classes
│   │       ├── controller/  # REST controllers
│   │       ├── dto/         # Data transfer objects
│   │       ├── model/       # Entity models
│   │       ├── repository/  # Data repositories
│   │       ├── security/    # Security configuration
│   │       └── service/     # Business logic
│   └── src/main/resources/
│       └── application.yml  # Application configuration
└── family-tree-frontend/   # Next.js application
    ├── app/                 # Next.js 13+ app directory
    ├── components/          # React components
    ├── contexts/            # React contexts
    ├── lib/                 # Utility libraries
    └── public/              # Static assets
```

## Getting Started

### Prerequisites

- Java 17 or higher
- Node.js 18 or higher
- MongoDB Atlas account
- Wasabi storage account (optional)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd family-tree-backend
   ```

2. Copy the example configuration:
   ```bash
   cp src/main/resources/application-example.yml src/main/resources/application-local.yml
   ```

3. Update `application-local.yml` with your configurations:
   - MongoDB connection string
   - JWT secret key
   - Wasabi credentials (if using image upload)

4. Run the application:
   ```bash
   mvn spring-boot:run -Dspring-boot.run.profiles=local
   ```

The backend will start on `http://localhost:8080`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd family-tree-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

4. Update `.env.local` if needed (default values should work for local development)

5. Run the development server:
   ```bash
   npm run dev
   ```

The frontend will start on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Family Management
- `POST /api/family/create` - Create new family
- `GET /api/family/{familyKey}` - Get family details
- `POST /api/family/{familyKey}/members` - Add family member
- `DELETE /api/family/{familyKey}/members/{userId}` - Remove member
- `PUT /api/family/{familyKey}/name` - Update family name

### Public Access
- `GET /api/public/family/{token}` - View public family tree

## Database Schema

### Collections

#### login_details
- User authentication information
- JWT tokens and expiry

#### families
- Family tree structure
- Member relationships
- Family metadata

#### users
- Family member information
- Personal details and relationships

#### relationships
- Explicit relationship mappings
- Relationship types (parent, child, spouse)

## Deployment

### Backend Deployment

1. Build the application:
   ```bash
   mvn clean package
   ```

2. Run with production profile:
   ```bash
   java -jar target/family-tree-backend-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod
   ```

### Frontend Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

### Environment Variables

Set these environment variables for production:

**Backend:**
```bash
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
WASABI_ACCESS_KEY=your-wasabi-access-key
WASABI_SECRET_KEY=your-wasabi-secret-key
WASABI_BUCKET_NAME=your-bucket-name
CORS_ORIGINS=https://your-frontend-domain.com
```

**Frontend:**
```bash
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
NEXT_PUBLIC_APP_URL=https://your-frontend-domain.com
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@knowyourfamilytree.com or create an issue in the GitHub repository.