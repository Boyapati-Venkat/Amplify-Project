/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const listTransformedRecords = /* GraphQL */ `
  query ListTransformedRecords(
    $filter: ModelTransformedRecordFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTransformedRecords(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        name
        email
        score
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;