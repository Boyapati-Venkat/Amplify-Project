# Insight Builder App

A React application with AWS Amplify integration for authentication, storage, and API functionality.

## Features

- User authentication with Amazon Cognito
- File uploads to Amazon S3
- Data management with AppSync GraphQL API and DynamoDB

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

## AWS Amplify Integration

This project uses AWS Amplify for backend functionality:

- **Authentication**: Amazon Cognito for user sign-up, sign-in, and user management
- **Storage**: Amazon S3 for file uploads
- **API**: AppSync GraphQL API for data operations

See [AMPLIFY_INTEGRATION.md](./AMPLIFY_INTEGRATION.md) for detailed information on the AWS Amplify integration.

## Project Structure

- `src/components/AmplifyFileUpload.tsx`: S3 file upload component
- `src/components/AmplifyDataViewer.tsx`: DynamoDB data viewer component
- `src/contexts/AuthContext.tsx`: Authentication context using Amplify Auth
- `src/aws-exports.js`: AWS configuration file

## Build Optimization

The project uses Vite's chunk splitting to optimize the build:

- `vendor`: React and routing libraries
- `amplify`: AWS Amplify and AWS SDK
- `ui`: UI component libraries

## License

MIT