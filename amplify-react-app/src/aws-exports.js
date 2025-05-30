const awsconfig = {
  aws_project_region: "us-east-1",
  aws_cognito_identity_pool_id: "<output-from-tf>",
  aws_cognito_region: "us-east-1",
  aws_user_pools_id: "<output-from-tf>",
  aws_user_pools_web_client_id: "<output-from-tf>",
  oauth: {},
  aws_user_files_s3_bucket: "<output-from-tf>",
  aws_user_files_s3_bucket_region: "us-east-1",
  aws_appsync_graphqlEndpoint: "<output-from-tf>",
  aws_appsync_region: "us-east-1",
  aws_appsync_authenticationType: "AMAZON_COGNITO_USER_POOLS"
};

export default awsconfig;