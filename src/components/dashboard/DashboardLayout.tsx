import React, { useState, useCallback, useEffect } from 'react';
import { Responsive, WidthProvider, Layout } from 'react-grid-layout';
import { Plus, Edit, Save, X } from 'lucide-react';
import { useDashboard } from '../../contexts/DashboardContext';
import { getWidgetComponent } from '../../widgets/registry';
import { WidgetSelector } from './WidgetSelector';
import type { Widget, WidgetPosition } from '../../types/widgets';

// Create responsive grid layout
const ResponsiveGridLayout = WidthProvider(Responsive);

// Grid layout breakpoints
const BREAKPOINTS = {
  lg: 1200,
  md: 996,
  sm: 768,
  xs: 480,
  xxs: 0
};

const COLS = {
  lg: 12,
  md: 10,
  sm: 6,
  xs: 4,
  xxs: 2
};

export function DashboardLayout() {
  const { state, actions } = useDashboard();
  const [showWidgetSelector, setShowWidgetSelector] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const currentLayout = state.layouts.find(l => l.id === state.currentLayoutId);
  const widgets = currentLayout?.widgets || [];

  // Convert widgets to grid layout format
  const layoutItems: Layout[] = widgets.map(widget => ({
    i: widget.id,
    x: widget.position.x,
    y: widget.position.y,
    w: widget.position.w,
    h: widget.position.h,
    minW: widget.position.minW || 2,
    minH: widget.position.minH || 2,
    maxW: widget.position.maxW || 12,
    maxH: widget.position.maxH || 8
  }));

  // Handle layout changes (drag, resize)
  const handleLayoutChange = useCallback((layout: Layout[]) => {
    if (isDragging) return; // Prevent infinite loops during drag
    
    layout.forEach(item => {
      const widget = widgets.find(w => w.id === item.i);
      if (widget) {
        const newPosition: WidgetPosition = {
          x: item.x,
          y: item.y,
          w: item.w,
          h: item.h,
          i: item.i,
          minW: widget.position.minW,
          minH: widget.position.minH,
          maxW: widget.position.maxW,
          maxH: widget.position.maxH
        };
        
        actions.updateWidgetPosition(widget.id, newPosition);
      }
    });
  }, [widgets, actions, isDragging]);

  // Handle widget addition from selector
  const handleAddWidget = useCallback((templateId: string) => {
    // Find a good position for the new widget
    const newPosition = findAvailablePosition(layoutItems);
    actions.addWidget(templateId, newPosition);
    setShowWidgetSelector(false);
  }, [layoutItems, actions]);

  // Find available position for new widget
  const findAvailablePosition = (currentLayout: Layout[]): Partial<WidgetPosition> => {
    const gridWidth = COLS.lg;
    const defaultWidth = 4;
    const defaultHeight = 3;
    
    // Sort by position to find gaps
    const sortedLayout = [...currentLayout].sort((a, b) => {
      if (a.y === b.y) return a.x - b.x;
      return a.y - b.y;
    });
    
    // Try to place widget in the first available spot
    for (let y = 0; y < 100; y++) {
      for (let x = 0; x <= gridWidth - defaultWidth; x++) {
        const position = { x, y, w: defaultWidth, h: defaultHeight };
        
        // Check if this position conflicts with existing widgets
        const hasConflict = sortedLayout.some(item => 
          x < item.x + item.w &&
          x + defaultWidth > item.x &&
          y < item.y + item.h &&
          y + defaultHeight > item.y
        );
        
        if (!hasConflict) {
          return position;
        }
      }
    }
    
    // Fallback: place at the bottom
    const maxY = Math.max(0, ...sortedLayout.map(item => item.y + item.h));
    return { x: 0, y: maxY, w: defaultWidth, h: defaultHeight };
  };

  // Handle widget data refresh
  const handleRefreshWidget = useCallback((widgetId: string) => {
    actions.refreshWidgetData(widgetId);
  }, [actions]);

  // Handle widget removal
  const handleRemoveWidget = useCallback((widgetId: string) => {
    actions.removeWidget(widgetId);
  }, [actions]);

  // Handle widget configuration
  const handleConfigureWidget = useCallback((widgetId: string, config: any) => {
    actions.updateWidgetConfig(widgetId, config);
  }, [actions]);

  // Render individual widget
  const renderWidget = (widget: Widget) => {
    const WidgetComponent = getWidgetComponent(widget.type);
    
    if (!WidgetComponent) {
      return (
        <div className="p-4 border border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500">Unknown widget type: {widget.type}</p>
        </div>
      );
    }

    return (
      <WidgetComponent
        widget={widget}
        data={widget.data}
        isLoading={widget.isLoading}
        error={widget.error}
        onConfigChange={(config) => handleConfigureWidget(widget.id, config)}
        onDataRefresh={() => handleRefreshWidget(widget.id)}
        onRemove={() => handleRemoveWidget(widget.id)}
      />
    );
  };

  // Handle drag start/end for better performance
  const handleDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleDragStop = useCallback((layout: Layout[]) => {
    setIsDragging(false);
    handleLayoutChange(layout);
  }, [handleLayoutChange]);

  return (
    <div className="dashboard-layout h-full">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">
            {currentLayout?.name || 'Dashboard'}
          </h2>
          {currentLayout?.description && (
            <p className="text-sm text-muted-foreground mt-1">
              {currentLayout.description}
            </p>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Edit Mode Toggle */}
          <button
            onClick={() => actions.setEditMode(!state.isEditMode)}
            className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              state.isEditMode
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {state.isEditMode ? (
              <>
                <Save size={16} className="mr-2" />
                Save Layout
              </>
            ) : (
              <>
                <Edit size={16} className="mr-2" />
                Edit Dashboard
              </>
            )}
          </button>
          
          {/* Add Widget Button */}
          {state.isEditMode && (
            <button
              onClick={() => setShowWidgetSelector(true)}
              className="inline-flex items-center px-3 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <Plus size={16} className="mr-2" />
              Add Widget
            </button>
          )}
        </div>
      </div>

      {/* Edit Mode Notification */}
      {state.isEditMode && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Edit size={16} className="text-blue-600 mr-2" />
              <span className="text-sm font-medium text-blue-800">
                Edit Mode Active
              </span>
              <span className="ml-2 text-sm text-blue-600">
                Drag widgets to reposition, resize by dragging corners
              </span>
            </div>
            <button
              onClick={() => actions.setEditMode(false)}
              className="text-blue-600 hover:text-blue-700"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Grid Layout */}
      <div className="dashboard-grid">
        {widgets.length > 0 ? (
          <ResponsiveGridLayout
            className="layout"
            layouts={{ lg: layoutItems }}
            breakpoints={BREAKPOINTS}
            cols={COLS}
            rowHeight={60}
            margin={[16, 16]}
            containerPadding={[0, 0]}
            isDraggable={state.isEditMode}
            isResizable={state.isEditMode}
            onLayoutChange={handleLayoutChange}
            onDragStart={handleDragStart}
            onDragStop={handleDragStop}
            onResizeStart={handleDragStart}
            onResizeStop={handleDragStop}
            draggableHandle=".widget-header"
            useCSSTransforms={true}
            preventCollision={false}
            compactType="vertical"
          >
            {widgets.map(widget => (
              <div
                key={widget.id}
                className={`widget-container ${
                  state.isEditMode ? 'edit-mode' : ''
                } ${
                  state.selectedWidgetId === widget.id ? 'selected' : ''
                }`}
                onClick={() => state.isEditMode && actions.setSelectedWidget(widget.id)}
              >
                {renderWidget(widget)}
              </div>
            ))}
          </ResponsiveGridLayout>
        ) : (
          // Empty state
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-lg font-medium mb-2">No Widgets Added</h3>
              <p className="text-muted-foreground mb-4">
                Start building your dashboard by adding some widgets
              </p>
              <button
                onClick={() => setShowWidgetSelector(true)}
                className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                <Plus size={16} className="mr-2" />
                Add Your First Widget
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Widget Selector Modal */}
      {showWidgetSelector && (
        <WidgetSelector
          onSelect={handleAddWidget}
          onClose={() => setShowWidgetSelector(false)}
        />
      )}
    </div>
  );
}