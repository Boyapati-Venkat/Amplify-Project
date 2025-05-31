
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUp, Upload, FileText } from 'lucide-react';

interface ChatInterfaceProps {
  userId: string;
}

const ChatInterface = ({ userId }: ChatInterfaceProps) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: message }]);
    
    // Simulate AI response (replace with actual API call later)
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'I can help you analyze your data and create a migration plan. Please upload your CSV files and I\'ll provide detailed insights and recommendations.' 
      }]);
    }, 1000);

    setMessage('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileName = files[0].name;
      setMessages(prev => [...prev, { 
        role: 'user', 
        content: `Uploaded file: ${fileName}` 
      }]);
      
      // Simulate AI response for file upload
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: `I've received your file "${fileName}". Analyzing the data structure and content. I'll provide a detailed migration plan shortly.` 
        }]);
      }, 1500);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center py-6">
        <h2 className="text-2xl font-semibold mb-2">What can I help with?</h2>
        <p className="text-gray-600">Upload your data and get a detailed migration plan</p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 space-y-4 mb-4">
        {messages.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Start by uploading your data files or asking about migration planning</p>
          </div>
        )}
        
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <Card className={`max-w-[80%] ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}>
              <CardContent className="p-3">
                <p className="text-sm">{msg.content}</p>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="border-t bg-white p-4">
        <form onSubmit={handleSubmit} className="flex items-end space-x-2">
          <div className="flex-1 relative">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Upload your data with details and get a migration plan..."
              className="resize-none pr-12 min-h-[60px]"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            
            {/* File upload button */}
            <div className="absolute right-2 bottom-2">
              <label htmlFor="file-upload" className="cursor-pointer">
                <Button type="button" size="icon" variant="ghost" className="h-8 w-8">
                  <Upload className="h-4 w-4" />
                </Button>
              </label>
              <input
                id="file-upload"
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
                multiple
              />
            </div>
          </div>
          
          <Button 
            type="submit" 
            size="icon" 
            disabled={!message.trim()}
            className="bg-blue-500 hover:bg-blue-600 h-10 w-10"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        </form>
        
        <p className="text-xs text-gray-500 mt-2 text-center">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;
