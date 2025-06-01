import { useState, useCallback, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, CheckCircle, AlertCircle, X } from 'lucide-react';
import { uploadData } from 'aws-amplify/storage';
import { FILE_UPLOAD_COMPLETE_EVENT } from './DataViewer';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  status: 'selected' | 'uploading' | 'success' | 'error';
  progress: number;
  file: File;
  error?: string;
}

const FileUpload = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      handleFiles(selectedFiles);
    }
  };

  const handleFiles = (fileList: File[]) => {
    // Check for browser environment
    if (typeof window === 'undefined') return;
    
    const csvFiles = fileList.filter(file => file.type === 'text/csv' || file.name.endsWith('.csv'));
    
    if (csvFiles.length !== fileList.length) {
      toast({
        title: "Invalid file type",
        description: "Please upload only CSV files.",
        variant: "destructive",
      });
    }

    csvFiles.forEach(file => {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "File too large",
          description: `${file.name} exceeds the 10MB limit.`,
          variant: "destructive",
        });
        return;
      }

      const newFile: UploadedFile = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        status: 'selected',
        progress: 0,
        file: file
      };

      setFiles(prev => [...prev, newFile]);
    });
  };

  const uploadFile = async (fileId: string) => {
    const fileToUpload = files.find(f => f.id === fileId);
    if (!fileToUpload) return;

    try {
      // Update status to uploading
      setFiles(prev => prev.map(file => 
        file.id === fileId ? { ...file, status: 'uploading' } : file
      ));

      // Upload to S3
      const result = await uploadData({
        key: `public/uploads/${fileToUpload.name}`,
        data: fileToUpload.file,
        options: {
          onProgress: (progress) => {
            const percentage = Math.round((progress.loaded / progress.total) * 100);
            setFiles(prev => prev.map(file => 
              file.id === fileId ? { ...file, progress: percentage } : file
            ));
          }
        }
      });

      console.log('Upload successful:', result);
      
      // Update status to success
      setFiles(prev => prev.map(file => 
        file.id === fileId ? { ...file, status: 'success', progress: 100 } : file
      ));
      
      toast({
        title: "Upload complete",
        description: `${fileToUpload.name} has been uploaded successfully.`,
      });

      // Dispatch event to notify DataViewer to refresh
      window.dispatchEvent(new Event(FILE_UPLOAD_COMPLETE_EVENT));
    } catch (error: any) {
      console.error('Upload error:', error);
      
      // Update status to error
      setFiles(prev => prev.map(file => 
        file.id === fileId ? { ...file, status: 'error', error: error.message } : file
      ));
      
      toast({
        title: "Upload failed",
        description: `Failed to upload ${fileToUpload.name}: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const uploadAllFiles = async () => {
    const selectedFiles = files.filter(file => file.status === 'selected');
    if (selectedFiles.length === 0) return;
    
    toast({
      title: "Upload started",
      description: `Uploading ${selectedFiles.length} file(s)...`,
    });
    
    // Upload each file sequentially
    for (const file of selectedFiles) {
      await uploadFile(file.id);
    }
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Function to trigger file input click
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Check if there are any selected files
  const hasSelectedFiles = files.some(file => file.status === 'selected');

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Upload className="w-5 h-5 mr-2 text-blue-600" />
            Upload CSV Files
          </CardTitle>
          <CardDescription>
            Drag and drop your CSV files here, or click to browse. Maximum file size: 10MB.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 cursor-pointer ${
              isDragOver 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onClick={triggerFileInput}
          >
            <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragOver ? 'text-blue-500' : 'text-gray-400'}`} />
            <p className="text-lg font-medium mb-2">
              {isDragOver ? 'Drop your files here' : 'Drag & drop CSV files here'}
            </p>
            <p className="text-gray-600 mb-4">or</p>
            <Button variant="outline">
              Browse Files
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
          
          {/* Upload button - only show when files are selected */}
          {hasSelectedFiles && (
            <div className="mt-4 flex justify-end">
              <Button 
                onClick={uploadAllFiles}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Upload Files
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {files.length > 0 && (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Files</CardTitle>
            <CardDescription>
              {files.filter(f => f.status === 'success').length} of {files.length} files uploaded
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {files.map(file => (
                <div key={file.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    {file.status === 'selected' && (
                      <FileText className="w-5 h-5 text-gray-600" />
                    )}
                    {file.status === 'uploading' && (
                      <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    )}
                    {file.status === 'success' && (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                    {file.status === 'error' && (
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <button
                        onClick={() => removeFile(file.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">
                      {formatFileSize(file.size)}
                      {file.status === 'selected' && ' - Ready to upload'}
                      {file.status === 'uploading' && ' - Uploading...'}
                      {file.status === 'success' && ' - Upload complete'}
                      {file.status === 'error' && ` - ${file.error || 'Upload failed'}`}
                    </p>
                    {file.status === 'uploading' && (
                      <Progress value={file.progress} className="h-2" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FileUpload;