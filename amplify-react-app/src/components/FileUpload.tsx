import React, { useState } from 'react';
import { uploadData } from 'aws-amplify/storage';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, CheckCircle } from 'lucide-react';

interface FileUploadProps {
  userId: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ userId }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
        console.log('File selected:', selectedFile.name);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select a CSV file.",
          variant: "destructive",
        });
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a CSV file to upload.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      console.log('Starting upload for user:', userId);
      
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      // Generate unique filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `uploads/${userId}/${timestamp}_${file.name}`;
      
      // Upload to S3 using Amplify Storage
      const result = await uploadData({
        key: fileName,
        data: file,
        options: {
          accessLevel: 'public',
          contentType: file.type,
          onProgress: ({ transferredBytes, totalBytes }) => {
            if (totalBytes) {
              const percentage = Math.round((transferredBytes / totalBytes) * 100);
              setProgress(percentage);
              console.log('Upload progress:', percentage + '%');
            }
          },
        }
      });

      clearInterval(progressInterval);
      setProgress(100);

      console.log('Upload successful:', result);
      
      toast({
        title: "Upload successful!",
        description: `${file.name} has been uploaded to S3.`,
      });

      // Reset form
      setFile(null);
      const input = document.getElementById('file-input') as HTMLInputElement;
      if (input) input.value = '';

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            Choose a CSV file to upload to your private S3 bucket
          </p>
          <Input
            id="file-input"
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className="max-w-xs mx-auto"
            disabled={uploading}
          />
        </div>
      </div>

      {file && (
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <FileText className="h-5 w-5 text-blue-600" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">{file.name}</p>
            <p className="text-xs text-gray-500">
              {(file.size / 1024).toFixed(1)} KB
            </p>
          </div>
          {!uploading && (
            <CheckCircle className="h-5 w-5 text-green-600" />
          )}
        </div>
      )}

      {uploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Uploading...</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      <Button 
        onClick={handleUpload}
        disabled={!file || uploading}
        className="w-full"
        size="lg"
      >
        {uploading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Uploading...
          </>
        ) : (
          <>
            <Upload className="h-4 w-4 mr-2" />
            Upload to S3
          </>
        )}
      </Button>

      <div className="text-xs text-gray-500 space-y-1">
        <p>• Files are stored in your S3 bucket</p>
        <p>• CSV files are automatically processed</p>
      </div>
    </div>
  );
};

export default FileUpload;