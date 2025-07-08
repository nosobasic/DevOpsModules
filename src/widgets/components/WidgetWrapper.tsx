import React, { useState, useRef, useEffect } from 'react';
import { 
  Settings, 
  RefreshCw, 
  Maximize2, 
  Minimize2, 
  MoreVertical, 
  Trash2,
  Edit3,
  Copy,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { Widget, WidgetProps } from '../../types/widgets';

interface WidgetWrapperProps extends WidgetProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  isFullscreen?: boolean;
  onFullscreenToggle?: () => void;
  className?: string;
}

interface ContextMenuAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  action: () => void;
  divider?: boolean;
  danger?: boolean;
}

export function WidgetWrapper({
  widget,
  data,
  isLoading = false,
  error,
  onConfigChange,
  onDataRefresh,
  onRemove,
  children,
  showHeader = true,
  showFooter = true,
  isFullscreen = false,
  onFullscreenToggle,
  className = ''
}: WidgetWrapperProps) {
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Close context menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        contextMenuRef.current && 
        !contextMenuRef.current.contains(event.target as Node) &&
        !menuButtonRef.current?.contains(event.target as Node)
      ) {
        setShowContextMenu(false);
      }
    }

    if (showContextMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showContextMenu]);

  const contextMenuActions: ContextMenuAction[] = [
    {
      id: 'refresh',
      label: 'Refresh Data',
      icon: RefreshCw,
      action: onDataRefresh
    },
    {
      id: 'configure',
      label: 'Configure',
      icon: Settings,
      action: () => {
        // TODO: Open configuration modal
        console.log('Configure widget:', widget.id);
      }
    },
    {
      id: 'edit',
      label: 'Edit Title',
      icon: Edit3,
      action: () => {
        // TODO: Edit widget title inline
        console.log('Edit widget title:', widget.id);
      }
    },
    {
      id: 'duplicate',
      label: 'Duplicate',
      icon: Copy,
      action: () => {
        // TODO: Duplicate widget
        console.log('Duplicate widget:', widget.id);
      },
      divider: true
    },
    {
      id: 'remove',
      label: 'Remove',
      icon: Trash2,
      action: onRemove,
      danger: true
    }
  ];

  const handleContextMenuAction = (action: ContextMenuAction) => {
    setShowContextMenu(false);
    action.action();
  };

  const getErrorDisplay = () => {
    if (!error) return null;
    
    return (
      <div className="flex items-center justify-center h-32 text-red-600">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-2" size={24} />
          <p className="text-sm font-medium">Error loading widget</p>
          <p className="text-xs text-muted-foreground mt-1">{error}</p>
          <button
            onClick={onDataRefresh}
            className="mt-2 text-xs text-blue-600 hover:text-blue-700 underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  };

  const getLoadingDisplay = () => {
    if (!isLoading) return null;
    
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-center">
          <Loader2 className="mx-auto mb-2 animate-spin" size={24} />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  };

  const shouldShowContent = !isLoading && !error;

  return (
    <div
      className={`widget-wrapper bg-card rounded-lg border shadow-sm transition-all duration-200 ${
        isHovered ? 'shadow-md border-primary/20' : ''
      } ${isFullscreen ? 'fixed inset-4 z-50 shadow-2xl' : ''} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Widget Header */}
      {showHeader && (
        <div className="widget-header flex items-center justify-between p-4 border-b border-border/50">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">
              {widget.config.title || widget.title}
            </h3>
            {widget.config.description && (
              <p className="text-xs text-muted-foreground mt-1 truncate">
                {widget.config.description}
              </p>
            )}
          </div>
          
          <div className="flex items-center space-x-1 ml-2">
            {/* Loading indicator in header */}
            {isLoading && (
              <Loader2 className="text-muted-foreground animate-spin" size={16} />
            )}
            
            {/* Error indicator in header */}
            {error && (
              <AlertCircle className="text-red-500" size={16} />
            )}
            
            {/* Fullscreen toggle */}
            {onFullscreenToggle && (
              <button
                onClick={onFullscreenToggle}
                className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
                title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              >
                {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
            )}
            
            {/* Refresh button */}
            <button
              onClick={onDataRefresh}
              className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
              title="Refresh data"
            >
              <RefreshCw size={16} />
            </button>
            
            {/* Context menu */}
            <div className="relative">
              <button
                ref={menuButtonRef}
                onClick={() => setShowContextMenu(!showContextMenu)}
                className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
                title="More options"
              >
                <MoreVertical size={16} />
              </button>
              
              {showContextMenu && (
                <div
                  ref={contextMenuRef}
                  className="absolute right-0 top-full mt-1 w-48 bg-popover border border-border rounded-md shadow-lg z-50"
                >
                  <div className="py-1">
                    {contextMenuActions.map((action, index) => (
                      <React.Fragment key={action.id}>
                        {action.divider && index > 0 && (
                          <div className="border-t border-border my-1" />
                        )}
                        <button
                          onClick={() => handleContextMenuAction(action)}
                          className={`w-full flex items-center px-3 py-2 text-sm text-left hover:bg-muted transition-colors ${
                            action.danger ? 'text-red-600 hover:text-red-700' : 'text-foreground'
                          }`}
                        >
                          <action.icon size={16} className="mr-2" />
                          {action.label}
                        </button>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Widget Content */}
      <div className="widget-content flex-1">
        {error && getErrorDisplay()}
        {isLoading && getLoadingDisplay()}
        {shouldShowContent && children}
      </div>

      {/* Widget Footer */}
      {showFooter && shouldShowContent && (
        <div className="widget-footer px-4 py-2 border-t border-border/50 bg-muted/30">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center space-x-2">
              {widget.config.dataSources?.length > 0 && (
                <span>
                  {widget.config.dataSources.length} source{widget.config.dataSources.length !== 1 ? 's' : ''}
                </span>
              )}
              {widget.config.refreshInterval && (
                <span>
                  • Updates every {Math.round(widget.config.refreshInterval / 1000)}s
                </span>
              )}
            </div>
            
            {widget.lastUpdate && (
              <span title={widget.lastUpdate.toLocaleString()}>
                Updated {formatDistanceToNow(widget.lastUpdate, { addSuffix: true })}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}