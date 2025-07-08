import React, { useState, useMemo } from 'react';
import { X, Search, Filter } from 'lucide-react';
import { widgetRegistry } from '../../widgets/registry';
import type { WidgetTemplate } from '../../types/widgets';

interface WidgetSelectorProps {
  onSelect: (templateId: string) => void;
  onClose: () => void;
}

export function WidgetSelector({ onSelect, onClose }: WidgetSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Get all widget templates grouped by category
  const templatesByCategory = useMemo(() => {
    return widgetRegistry.getTemplatesByCategory();
  }, []);

  // Get all available categories
  const categories = useMemo(() => {
    const cats = Object.keys(templatesByCategory);
    return ['all', ...cats];
  }, [templatesByCategory]);

  // Filter templates based on search and category
  const filteredTemplates = useMemo(() => {
    let templates: WidgetTemplate[] = [];
    
    if (selectedCategory === 'all') {
      templates = Object.values(templatesByCategory).flat();
    } else {
      templates = templatesByCategory[selectedCategory] || [];
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      templates = templates.filter(template =>
        template.name.toLowerCase().includes(query) ||
        template.description.toLowerCase().includes(query) ||
        template.category.toLowerCase().includes(query)
      );
    }

    return templates;
  }, [templatesByCategory, selectedCategory, searchQuery]);

  const handleTemplateSelect = (templateId: string) => {
    onSelect(templateId);
  };

  const getCategoryDisplayName = (category: string) => {
    return category
      .split(/[-_]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'metrics': return '📊';
      case 'charts': return '📈';
      case 'monitoring': return '📡';
      case 'agents': return '🤖';
      case 'system': return '⚙️';
      default: return '📋';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Add Widget</h2>
              <p className="mt-1 text-sm text-gray-500">
                Choose a widget to add to your dashboard
              </p>
            </div>
            
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Search and Filter */}
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search widgets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              {/* Category Filter */}
              <div className="flex items-center space-x-2">
                <Filter size={16} className="text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 bg-white focus:ring-blue-500 focus:border-blue-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {getCategoryDisplayName(category)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Widget Grid */}
          <div className="p-6 overflow-y-auto max-h-96">
            {filteredTemplates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTemplates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => handleTemplateSelect(template.id)}
                    className="relative p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
                  >
                    {/* Widget Preview */}
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl group-hover:bg-blue-50 transition-colors">
                          {template.icon}
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {template.name}
                        </h3>
                        <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                          {template.description}
                        </p>
                        
                        {/* Category Badge */}
                        <div className="mt-2 flex items-center">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            <span className="mr-1">{getCategoryIcon(template.category)}</span>
                            {getCategoryDisplayName(template.category)}
                          </span>
                        </div>
                        
                        {/* Size Info */}
                        <div className="mt-2 text-xs text-gray-400">
                          Size: {template.defaultSize.w} × {template.defaultSize.h}
                        </div>
                      </div>
                    </div>
                    
                    {/* Hover Effect */}
                    <div className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-blue-300 transition-colors pointer-events-none" />
                  </div>
                ))}
              </div>
            ) : (
              // No results
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No widgets found
                </h3>
                <p className="text-gray-500">
                  {searchQuery.trim() 
                    ? `No widgets match "${searchQuery}"`
                    : 'No widgets available in this category'
                  }
                </p>
                {searchQuery.trim() && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Clear search
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <div className="text-sm text-gray-500">
              {filteredTemplates.length} widget{filteredTemplates.length !== 1 ? 's' : ''} available
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}