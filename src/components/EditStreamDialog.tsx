
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
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';

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
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (streamingUrl) {
      setTitle(streamingUrl.title);
      setDescription(streamingUrl.description || '');
      setCustomThumbnail(streamingUrl.customThumbnail || '');
      setTags(streamingUrl.tags || []);
    }
  }, [streamingUrl]);

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSave = () => {
    if (!streamingUrl) return;
    
    onUpdate({
      title: title.trim() || streamingUrl.url,
      description: description.trim(),
      customThumbnail: customThumbnail.trim(),
      tags
    });
    onOpenChange(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.currentTarget === document.activeElement) {
      e.preventDefault();
      if (e.currentTarget.id === 'newTag') {
        handleAddTag();
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Stream</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
              placeholder="Enter stream title..."
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
              placeholder="Enter description..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="thumbnail">Custom Thumbnail URL</Label>
            <Input
              id="thumbnail"
              value={customThumbnail}
              onChange={(e) => setCustomThumbnail(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <Label>Categories/Tags</Label>
            <div className="flex gap-2 mb-2 flex-wrap">
              {tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-blue-600 text-white"
                >
                  {tag}
                  <X
                    className="w-3 h-3 ml-1 cursor-pointer"
                    onClick={() => handleRemoveTag(tag)}
                  />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                id="newTag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={handleKeyPress}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="Add tag..."
              />
              <Button
                onClick={handleAddTag}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="text-xs text-slate-400">
            <p><strong>URL:</strong> {streamingUrl?.url}</p>
            <p><strong>Added:</strong> {streamingUrl ? new Date(streamingUrl.addedAt).toLocaleString() : ''}</p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            onClick={() => onOpenChange(false)}
            variant="outline"
            className="bg-slate-700 border-slate-600 hover:bg-slate-600"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
