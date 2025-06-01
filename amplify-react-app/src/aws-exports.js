/* eslint-disable */
// WARNING: This file is manually created to work with Terraform-managed resources.

const awsconfig = {
  aws_project_region: "us-east-1",

  // Cognito
  aws_cognito_identity_pool_id: "us-east-1:37e188c7-2911-41de-b8a0-c81330069628",
  aws_cognito_region: "us-east-1",
  aws_user_pools_id: "us-east-1_zj9I7C91c",
  aws_user_pools_web_client_id: "5t8ab9d4djovqnas8neaetelsd",
  oauth: {},

  // AppSync - Updated endpoint
  aws_appsync_graphqlEndpoint: "https://hieoctj5jnhgfll65rkis2ksj4.appsync-api.us-east-1.amazonaws.com/graphql",
  aws_appsync_region: "us-east-1",
  aws_appsync_authenticationType: "AMAZON_COGNITO_USER_POOLS",
  aws_appsync_apiKey: "da2-2c4mlkjj6fggnotapjzebc54ai",

  // S3 Storage
  aws_user_files_s3_bucket: "migrationplan-bucket-dev",
  aws_user_files_s3_bucket_region: "us-east-1",
  
  // Authentication configuration
  Auth: {
    // Support multiple authentication flows to ensure compatibility with Cognito app client settings
    authenticationFlowType: 'USER_PASSWORD_AUTH',
    // Enable detailed logging
    logLevel: 'DEBUG'
  },
  
  // Analytics configuration for Amplify v6
  Analytics: {
    disabled: false,
    autoSessionRecord: true,
    AWSPinpoint: {
      appId: 'b6eecfff46cc4afcb14fbef0f2dd8aec',
      region: 'us-east-1'
    }
  }
};

export default awsconfig;