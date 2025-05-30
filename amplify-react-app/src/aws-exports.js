/* eslint-disable */
// WARNING: This file is manually created to work with Terraform-managed resources.

const awsconfig = {
  aws_project_region: "us-east-1",

  // Cognito
  aws_cognito_identity_pool_id: "us-east-1:37e188c7-2911-41de-b8a0-c81330069628",
  aws_cognito_region: "us-east-1",
  aws_user_pools_id: "us-east-1_pMJOxMpv4",
  aws_user_pools_web_client_id: "2jqokqi8to9m2nlpub2g8b7tjh",
  oauth: {},

  // AppSync
  aws_appsync_graphqlEndpoint: "https://ujomo3kkkvelblwouziiefuz4m.appsync-api.us-east-1.amazonaws.com/graphql",
  aws_appsync_region: "us-east-1",
  aws_appsync_authenticationType: "AMAZON_COGNITO_USER_POOLS",

  // S3 Storage
  aws_user_files_s3_bucket: "migrationplan-bucket-dev",
  aws_user_files_s3_bucket_region: "us-east-1",
};

export default awsconfig;