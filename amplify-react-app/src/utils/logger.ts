// Logger utility for debugging authentication issues

/**
 * Log authentication attempts with detailed information
 */
export const logAuthAttempt = (action: string, params: any) => {
  console.group(`🔐 Auth Attempt: ${action}`);
  console.log('Parameters:', { ...params, password: params.password ? '******' : undefined });
  console.log('Timestamp:', new Date().toISOString());
  console.groupEnd();
};

/**
 * Log authentication success with user information
 */
export const logAuthSuccess = (action: string, user: any) => {
  console.group(`✅ Auth Success: ${action}`);
  console.log('User:', user);
  console.log('Timestamp:', new Date().toISOString());
  console.groupEnd();
};

/**
 * Log authentication errors with detailed information
 */
export const logAuthError = (action: string, error: any) => {
  console.group(`❌ Auth Error: ${action}`);
  console.error('Error object:', error);
  console.error('Error message:', error.message);
  console.error('Error code:', error.code);
  console.error('Stack trace:', error.stack);
  console.log('Timestamp:', new Date().toISOString());
  console.groupEnd();
};

export default {
  logAuthAttempt,
  logAuthSuccess,
  logAuthError
};