import React, { useState, useRef } from 'react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { Card, CardContent } from '@/Components/ui/card';
import { Progress } from '@/Components/ui/progress';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { UploadIcon, XIcon } from 'lucide-react';
import axios from 'axios';

interface FileUploadProps {
  uploadUrl: string;
  onUploadComplete?: (attachment: any) => void;
  maxFiles?: number;
  maxSize?: number; // in MB
  allowedTypes?: string[];
}

export default function FileUpload({
  uploadUrl,
  onUploadComplete,
  maxFiles = 5,
  maxSize = 10, // 10MB default
  allowedTypes = ['*/*'],
}: FileUploadProps) {
  const { t } = useTranslation();
  const [files, setFiles] = useState<File[]>([]);
  const [descriptions, setDescriptions] = useState<{ [key: string]: string }>({});
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    // Check if adding these files would exceed the max files limit
    if (files.length + selectedFiles.length > maxFiles) {
      toast.error(t('attachments.max_files_error', { max: maxFiles }));
      return;
    }
    
    // Validate file size and type
    const validFiles = selectedFiles.filter(file => {
      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        toast.error(t('attachments.file_too_large', { filename: file.name, maxSize }));
        return false;
      }
      
      // Check file type if specific types are provided
      if (allowedTypes[0] !== '*/*') {
        const fileType = file.type;
        const isAllowed = allowedTypes.some(type => {
          // Handle wildcards like image/*
          if (type.endsWith('/*')) {
            const category = type.split('/')[0];
            return fileType.startsWith(category + '/');
          }
          return type === fileType;
        });
        
        if (!isAllowed) {
          toast.error(t('attachments.invalid_file_type', { filename: file.name }));
          return false;
        }
      }
      
      return true;
    });
    
    setFiles(prevFiles => [...prevFiles, ...validFiles]);
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDescriptionChange = (index: number, value: string) => {
    setDescriptions(prev => ({
      ...prev,
      [index]: value,
    }));
  };

  const removeFile = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    setDescriptions(prev => {
      const newDescriptions = { ...prev };
      delete newDescriptions[index];
      return newDescriptions;
    });
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;
    
    setUploading(true);
    setProgress(0);
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const description = descriptions[i] || '';
        
        const formData = new FormData();
        formData.append('file', file);
        formData.append('description', description);
        
        await axios.post(uploadUrl, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setProgress(percentCompleted);
            }
          },
        });
        
        // Update progress for multiple files
        setProgress(((i + 1) / files.length) * 100);
      }
      
      toast.success(t('attachments.upload_success'));
      
      // Reset state after successful upload
      setFiles([]);
      setDescriptions({});
      setProgress(0);
      
      // Call the callback if provided
      if (onUploadComplete) {
        onUploadComplete(null);
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(t('attachments.upload_error'));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || files.length >= maxFiles}
        >
          <UploadIcon className="mr-2 h-4 w-4" />
          {t('attachments.select_files')}
        </Button>
        <Input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileChange}
          accept={allowedTypes.join(',')}
          disabled={uploading}
        />
        <span className="text-sm text-gray-500">
          {t('attachments.max_files', { max: maxFiles })}
        </span>
      </div>
      
      {files.length > 0 && (
        <div className="space-y-4">
          {files.map((file, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-medium">{file.name}</div>
                    <div className="text-sm text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                    <div className="mt-2">
                      <Label htmlFor={`description-${index}`} className="text-sm">
                        {t('attachments.description')}
                      </Label>
                      <Textarea
                        id={`description-${index}`}
                        value={descriptions[index] || ''}
                        onChange={(e) => handleDescriptionChange(index, e.target.value)}
                        placeholder={t('attachments.description_placeholder')}
                        className="mt-1"
                        rows={2}
                        disabled={uploading}
                      />
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFile(index)}
                    disabled={uploading}
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {uploading && (
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <div className="text-sm text-center">{progress}%</div>
            </div>
          )}
          
          <div className="flex justify-end">
            <Button
              onClick={uploadFiles}
              disabled={uploading || files.length === 0}
            >
              {uploading
                ? t('attachments.uploading')
                : t('attachments.upload_files', { count: files.length })}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
