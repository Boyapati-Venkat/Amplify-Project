/**
 * Utility functions for working with AWS Amplify
 */

/**
 * Validates that required parameters are present before calling Amplify functions
 * @param params Object containing parameters to validate
 * @param requiredKeys Array of keys that must be present and non-null
 * @returns The original params object if valid
 * @throws Error if any required parameter is missing
 */
export const validateAmplifyParams = <T extends Record<string, any>>(
  params: T,
  requiredKeys: (keyof T)[]
): T => {
  for (const key of requiredKeys) {
    if (params[key] === undefined || params[key] === null) {
      throw new Error(`Required parameter '${String(key)}' is missing or null`);
    }
  }
  return params;
};

/**
 * Safely executes an Amplify function with proper error handling
 * @param fn The Amplify function to execute
 * @param params Parameters to pass to the function
 * @param requiredKeys Keys that must be present in params
 * @returns Result of the function call
 */
export const safeAmplifyCall = async <T, P extends Record<string, any>>(
  fn: (params: P) => Promise<T>,
  params: P,
  requiredKeys: (keyof P)[] = []
): Promise<T> => {
  try {
    const validatedParams = validateAmplifyParams(params, requiredKeys);
    return await fn(validatedParams);
  } catch (error: any) {
    console.error(`Amplify operation failed: ${error.message}`, error);
    throw error;
  }
};