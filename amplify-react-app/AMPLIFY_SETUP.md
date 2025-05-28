
# AWS Amplify Setup Guide

This guide will help you set up AWS Amplify with your React application to enable authentication, file storage, and GraphQL API functionality.

## Prerequisites

1. **AWS Account**: Create an AWS account at https://aws.amazon.com/
2. **Amplify CLI**: Install the Amplify CLI globally
   ```bash
   npm install -g @aws-amplify/cli
   ```
3. **AWS CLI**: Install and configure AWS CLI (optional but recommended)

## Step-by-Step Setup

### 1. Initialize Amplify Project

```bash
# Initialize Amplify in your project directory
amplify init

# Follow the prompts:
# - Project name: [your-project-name]
# - Environment name: dev
# - Default editor: Visual Studio Code (or your preference)
# - App type: javascript
# - Framework: react
# - Source directory: src
# - Build command: npm run build
# - Start command: npm start
# - AWS profile: default (or create new)
```

### 2. Add Authentication (Cognito)

```bash
amplify add auth

# Configuration options:
# - Default configuration with username
# - Username (and also allow sign in with email)
# - No advanced settings needed for basic setup
```

### 3. Add Storage (S3)

```bash
amplify add storage

# Configuration options:
# - Content (Images, audio, video, etc.)
# - Provide a friendly name: [your-bucket-name]
# - Provide bucket name: [auto-generated or custom]
# - Restrict access by: Auth users only
# - Authenticated users access: create/update, read
# - Do you want to add a Lambda Trigger: No
```

### 4. Add GraphQL API (AppSync + DynamoDB)

```bash
amplify add api

# Configuration options:
# - GraphQL
# - Provide API name: [your-api-name]
# - Authorization type: Amazon Cognito User Pool
# - Do you want to configure advanced settings: No
# - Do you have an annotated GraphQL schema: Yes
# - Provide your schema file path: src/graphql/schema.graphql
```

### 5. Deploy to AWS

```bash
# Deploy all resources to AWS
amplify push

# This will:
# - Create Cognito User Pool and Identity Pool
# - Create S3 bucket with proper permissions
# - Create AppSync GraphQL API
# - Create DynamoDB tables
# - Generate aws-exports.js configuration file
```

### 6. Generate GraphQL Code

```bash
# Generate TypeScript types and operations
amplify codegen

# This creates:
# - GraphQL queries, mutations, subscriptions
# - TypeScript type definitions
# - Updates existing GraphQL files
```

## Configuration Update

After running `amplify push`, update the configuration in `src/App.tsx`:

1. Replace the placeholder `amplifyConfig` with:
   ```typescript
   import awsExports from './aws-exports';
   Amplify.configure(awsExports);
   ```

2. Remove the placeholder configuration object.

## Testing Your Setup

1. **Authentication**: Try signing up and logging in
2. **File Upload**: Upload a CSV file to test S3 integration
3. **Data Display**: Add sample records to test GraphQL/DynamoDB

## Useful Commands

```bash
# View current status
amplify status

# Update existing resources
amplify update [category]

# Remove resources
amplify remove [category]

# View environment info
amplify env list

# Push specific categories
amplify push --environment dev

# Generate types only
amplify codegen types

# View hosted app (if using amplify hosting)
amplify console
```

## Troubleshooting

### Common Issues

1. **Module not found: aws-exports**
   - Run `amplify push` to generate the configuration file

2. **GraphQL schema errors**
   - Check `src/graphql/schema.graphql` syntax
   - Ensure proper `@model` and `@auth` directives

3. **S3 upload permissions**
   - Verify storage configuration allows authenticated user access
   - Check IAM policies in AWS Console

4. **Cognito authentication issues**
   - Verify user pool configuration
   - Check app client settings

### Getting Help

- **Amplify Documentation**: https://docs.amplify.aws/
- **AWS AppSync**: https://docs.aws.amazon.com/appsync/
- **Amazon Cognito**: https://docs.aws.amazon.com/cognito/
- **Community Support**: https://github.com/aws-amplify/amplify-js/discussions

## Next Steps

1. **Custom Business Logic**: Add Lambda functions with `amplify add function`
2. **Real-time Updates**: Implement GraphQL subscriptions
3. **File Processing**: Add Lambda triggers for S3 uploads
4. **Hosting**: Deploy with `amplify add hosting`
5. **Analytics**: Add analytics with `amplify add analytics`

Remember to regularly backup your `amplify/` directory and commit it to version control!
