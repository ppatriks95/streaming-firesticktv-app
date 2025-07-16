
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Filter, X } from 'lucide-react';

interface CategoryFilterProps {
  categories: string[];
  selectedCategories: string[];
  onCategoryToggle: (category: string) => void;
  onClearFilters: () => void;
}

export const CategoryFilter = ({ 
  categories, 
  selectedCategories, 
  onCategoryToggle, 
  onClearFilters 
}: CategoryFilterProps) => {
  return (
    <div className="mb-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
      <div className="flex items-center gap-2 mb-3">
        <Filter className="w-4 h-4" />
        <span className="font-medium">Kategorien filtern</span>
        {selectedCategories.length > 0 && (
          <Button
            onClick={onClearFilters}
            size="sm"
            variant="ghost"
            className="h-6 px-2 text-slate-400 hover:text-white"
          >
            <X className="w-3 h-3 mr-1" />
            Alle entfernen
          </Button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Badge
            key={category}
            variant={selectedCategories.includes(category) ? "default" : "outline"}
            className={`cursor-pointer transition-colors ${
              selectedCategories.includes(category)
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600 border-slate-600'
            }`}
            onClick={() => onCategoryToggle(category)}
          >
            {category}
          </Badge>
        ))}
      </div>
    </div>
  );
};
