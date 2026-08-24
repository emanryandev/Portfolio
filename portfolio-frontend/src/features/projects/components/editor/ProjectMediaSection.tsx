import { useState, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { ProjectFormValues } from '../../schemas/projectSchema';
import { useUploadMedia } from '../../api/admin';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadCloud, X, Image as ImageIcon, Loader2 } from 'lucide-react';

export function ProjectMediaSection() {
  const { register, watch, setValue, formState: { errors } } = useFormContext<ProjectFormValues>();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const imageUrl = watch('image_url');
  const uploadMutation = useUploadMedia();

  const handleFile = async (file: File) => {
    setUploadError(null);
    
    // Client Validation
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file (PNG, JPG, WebP, SVG)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setUploadError('File size must be less than 5MB');
      return;
    }

    try {
      const response = await uploadMutation.mutateAsync(file);
      // Attach URL to project form directly
      setValue('image_url', response.url, { shouldDirty: true, shouldValidate: true });
    } catch (err: any) {
      setUploadError(err.message || 'Upload failed. Please try again.');
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <Card className="border-border/40">
      <CardHeader>
        <CardTitle>Featured Image</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* URL Input Fallback */}
        <div className="space-y-2">
          <Label htmlFor="image_url">Image URL</Label>
          <Input 
            id="image_url" 
            {...register('image_url')} 
            placeholder="https://..."
            disabled={uploadMutation.isPending}
          />
          {errors.image_url && <p className="text-sm text-destructive">{errors.image_url.message}</p>}
        </div>

        {/* Drag & Drop Area */}
        <div className="space-y-2">
          <Label>Upload New Image</Label>
          <div 
            className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-colors ${isDragging ? 'border-primary bg-primary/5' : 'border-border/50 hover:bg-secondary/10'}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
          >
            {uploadMutation.isPending ? (
              <div className="flex flex-col items-center py-6">
                <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
                <p className="text-sm font-medium text-foreground">Uploading image...</p>
              </div>
            ) : imageUrl ? (
              <div className="relative group w-full flex justify-center">
                <img 
                  src={imageUrl} 
                  alt="Preview" 
                  className="max-h-64 object-contain rounded-md" 
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setValue('image_url', '', { shouldDirty: true, shouldValidate: true })}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center py-6 text-center">
                <div className="w-12 h-12 rounded-full bg-secondary/30 flex items-center justify-center mb-4">
                  <UploadCloud className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground mb-1">Drag and drop an image here</p>
                <p className="text-xs text-muted-foreground mb-4">or click to browse (Max 5MB)</p>
                <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                  Browse Files
                </Button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/png, image/jpeg, image/webp, image/svg+xml"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      handleFile(e.target.files[0]);
                    }
                  }}
                />
              </div>
            )}
          </div>
          {uploadError && <p className="text-sm text-destructive">{uploadError}</p>}
        </div>

      </CardContent>
    </Card>
  );
}
