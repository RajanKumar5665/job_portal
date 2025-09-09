# Job Portal Frontend

A modern, responsive job portal frontend built with React, Vite, and Tailwind CSS. This application provides a comprehensive platform for job seekers and recruiters to connect and manage job opportunities.

## Features

### For Job Seekers (Students)
- **User Registration & Authentication**: Secure signup and login with role-based access
- **Job Search & Discovery**: Advanced search and filtering capabilities
- **Job Applications**: Easy application process with status tracking
- **Profile Management**: Complete profile setup with skills, resume upload, and bio
- **Application Tracking**: View and track all submitted applications

### For Recruiters
- **Company Management**: Create and manage company profiles
- **Job Posting**: Create detailed job listings with requirements and descriptions
- **Application Management**: Review and manage job applications
- **Candidate Tracking**: Track application status and communicate with candidates
- **Analytics Dashboard**: View job statistics and application metrics

### General Features
- **Responsive Design**: Mobile-first design that works on all devices
- **Modern UI/UX**: Clean, intuitive interface with smooth animations
- **Real-time Updates**: Live status updates and notifications
- **Search & Filter**: Advanced job search with multiple filter options
- **Secure Authentication**: JWT-based authentication with protected routes

## Technology Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React Query for server state
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Date Handling**: date-fns
- **Form Handling**: React Hook Form
- **File Upload**: React Dropzone

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Auth/           # Authentication components
│   ├── Jobs/           # Job-related components
│   ├── Company/        # Company management components
│   ├── Applications/   # Application management components
│   ├── Profile/        # User profile components
│   └── Layout/         # Layout components (Header, Layout)
├── contexts/           # React contexts (AuthContext)
├── pages/              # Page components
├── services/           # API services and utilities
└── App.jsx            # Main application component
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running on `http://localhost:4000`

### Installation

1. Clone the repository
2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

### Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_BASE_URL=http://localhost:4000/api/v1
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Integration

The frontend integrates with the following backend endpoints:

### Authentication
- `POST /api/v1/user/register` - User registration
- `POST /api/v1/user/login` - User login
- `GET /api/v1/user/logout` - User logout
- `POST /api/v1/user/me` - Update user profile

### Jobs
- `GET /api/v1/job/get` - Get all jobs (with search)
- `GET /api/v1/job/get/:id` - Get job by ID
- `POST /api/v1/job/create` - Create new job
- `GET /api/v1/job/status/:id/update` - Get jobs by admin

### Companies
- `POST /api/v1/company/register` - Register company
- `GET /api/v1/company/get` - Get user's companies
- `GET /api/v1/company/get/:id` - Get company by ID
- `PUT /api/v1/company/update/:id` - Update company

### Applications
- `GET /api/v1/application/apply/:id` - Apply for job
- `GET /api/v1/application/get` - Get user's applications
- `GET /api/v1/application/:id/applicants` - Get job applicants
- `POST /api/v1/application/status/:id/update` - Update application status

## Key Components

### Authentication System
- JWT-based authentication with HTTP-only cookies
- Role-based access control (student/recruiter)
- Protected routes and automatic redirects
- Persistent login state

### Job Management
- Advanced search and filtering
- Real-time job listings
- Detailed job view with company information
- Application tracking and status updates

### User Experience
- Responsive design for all screen sizes
- Loading states and error handling
- Toast notifications for user feedback
- Smooth animations and transitions

## Deployment

### Build for Production

```bash
npm run build
```

The build files will be generated in the `dist` directory.

### Deploy to Vercel

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

### Deploy to Netlify

1. Build the project:
   ```bash
   npm run build
   ```

2. Upload the `dist` folder to Netlify

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.