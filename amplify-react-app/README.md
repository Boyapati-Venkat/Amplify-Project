
# MAIT - Migration Assistance Tool

A React application built with AWS Amplify integration for secure data migration analysis and processing. This enterprise-grade tool helps organizations streamline their migration journey with advanced analytics and PwC's expert guidance.

## Features

- **Secure Authentication**: User authentication with Amazon Cognito
- **File Management**: Secure file uploads to Amazon S3 with enterprise-grade security
- **Data Analytics**: Real-time data analysis with AppSync GraphQL API and DynamoDB
- **Migration Insights**: Advanced analytics for migration planning and execution
- **Team Collaboration**: Multi-user support with role-based access

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Components**: Shadcn/ui + Tailwind CSS
- **Authentication**: AWS Cognito
- **Storage**: Amazon S3
- **Database**: DynamoDB via AppSync GraphQL
- **State Management**: TanStack React Query
- **Routing**: React Router v6

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- AWS Account with Amplify CLI configured
- Access to the configured AWS resources (Cognito, S3, AppSync, DynamoDB)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mait-migration-tool
```

2. Install dependencies:
```bash
npm install
```

3. Configure AWS Amplify:
   - Ensure `src/aws-exports.js` contains your AWS configuration
   - Verify Cognito User Pool and Identity Pool settings
   - Confirm S3 bucket permissions and CORS configuration

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:8080`

5. Build for production:
```bash
npm run build
```

## AWS Amplify Architecture

### Authentication (Amazon Cognito)
- **User Pool**: Manages user registration, authentication, and user attributes
- **Identity Pool**: Provides AWS credentials for authenticated users
- **Custom Attributes**: `custom:isOnboarded` for tracking user onboarding status

### Storage (Amazon S3)
- **Bucket**: `migrationplan-bucket-dev` for secure file storage
- **Access Control**: User-specific file isolation with IAM policies
- **CORS Configuration**: Enabled for web application access

### API (AWS AppSync)
- **GraphQL Endpoint**: Real-time data operations
- **Authentication**: Cognito User Pools + API Key
- **Schema**: `TransformedRecord` model for data management

### Database (Amazon DynamoDB)
- **Tables**: Auto-generated through AppSync GraphQL schema
- **Access Patterns**: Optimized for user-specific data queries
- **Security**: Row-level security with owner-based access

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Shadcn/ui components
│   ├── Navigation.tsx    # Main navigation with PwC branding
│   ├── AmplifyFileUpload.tsx   # S3 file upload component
│   └── AmplifyDataViewer.tsx   # DynamoDB data viewer
├── contexts/            # React contexts
│   └── AuthContext.tsx  # Authentication state management
├── pages/               # Route components
│   ├── LandingPage.tsx  # Public homepage
│   ├── AuthPage.tsx     # Login/Register
│   ├── Onboarding.tsx   # User onboarding flow
│   └── Dashboard.tsx    # Main application dashboard
├── aws-exports.js       # AWS Amplify configuration
└── main.tsx            # Application entry point
```

## Development Workflow

### Local Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Environment Configuration
- Development: Uses `aws-exports.js` configuration
- Production: Ensure environment variables are properly set in deployment

## Security Features

- **Data Isolation**: User-specific data access controls
- **Encryption**: Data encrypted in transit and at rest
- **Authentication**: Multi-factor authentication support
- **Authorization**: Fine-grained IAM policies
- **Audit Logging**: CloudTrail integration for compliance

## Migration Capabilities

- **Data Upload**: Secure CSV file processing
- **Data Validation**: Automatic schema validation and cleansing
- **Analytics**: Real-time insights and migration readiness scoring
- **Export**: Processed data export for migration tools
- **Reporting**: Comprehensive migration analysis reports

## Deployment

### Using AWS Amplify Console
1. Connect your Git repository to Amplify Console
2. Configure build settings (already defined in `amplify.yml`)
3. Set environment variables if needed
4. Deploy automatically on Git pushes

### Manual Deployment
```bash
npm run build
# Deploy dist/ folder to your hosting provider
```

## Troubleshooting

### Common Issues
- **Authentication Errors**: Verify Cognito configuration in `aws-exports.js`
- **File Upload Issues**: Check S3 bucket CORS and IAM permissions
- **API Errors**: Ensure AppSync endpoint and authentication are correct

### Debug Mode
```bash
# Enable debug logging
export DEBUG=aws-amplify:*
npm run dev
```

## Support

For technical support and migration consulting, contact your PwC engagement team.

## License

Proprietary - PwC 2024. All rights reserved.
