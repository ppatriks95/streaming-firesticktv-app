
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { StreamingUrl } from '@/pages/Index';

interface EditStreamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  streamingUrl: StreamingUrl | null;
  onUpdate: (updates: Partial<StreamingUrl>) => void;
}

export const EditStreamDialog = ({ 
  open, 
  onOpenChange, 
  streamingUrl, 
  onUpdate 
}: EditStreamDialogProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [customThumbnail, setCustomThumbnail] = useState('');
  const [tags, setTags] = useState('');

  useEffect(() => {
    if (streamingUrl) {
      setTitle(streamingUrl.title || '');
      setDescription(streamingUrl.description || '');
      setCustomThumbnail(streamingUrl.customThumbnail || '');
      setTags(streamingUrl.tags?.join(', ') || '');
    }
  }, [streamingUrl]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!streamingUrl) return;

    const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    
    onUpdate({
      title: title.trim(),
      description: description.trim(),
      customThumbnail: customThumbnail.trim(),
      tags: tagsArray
    });
    
    onOpenChange(false);
  };

  if (!streamingUrl) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Stream</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="thumbnail">Custom Thumbnail URL</Label>
            <Input
              id="thumbnail"
              type="url"
              value={customThumbnail}
              onChange={(e) => setCustomThumbnail(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          
          <div>
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
              placeholder="Anime, Action, Series"
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="bg-slate-700 border-slate-600 hover:bg-slate-600"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
