
// Pagination Enhancement
export { default as PaginatedDataViewer } from './pagination/PaginatedDataViewer';

// User Display Enhancement
export { default as EnhancedUserDisplay } from './user-display/EnhancedUserDisplay';

// Upload Feedback Enhancement
export { default as FriendlyUploadFeedback } from './upload-feedback/FriendlyUploadFeedback';

// Enhanced Dashboard
export { default as EnhancedDashboard } from './dashboard/EnhancedDashboard';

// Types for reuse
export interface TransformedRecord {
  id: string;
  name: string;
  email: string;
  score: number;
  createdAt: string;
}

export interface UploadMessage {
  text: string;
  duration: number;
}
