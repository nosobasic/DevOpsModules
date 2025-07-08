import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { widgetRegistry } from '../widgets/registry';
import { useWebSocket } from '../hooks/useWebSocket';
import type { 
  DashboardState, 
  Widget, 
  WidgetPosition, 
  DashboardLayout,
  WidgetDataRequest,
  WidgetDataResponse,
  WidgetSubscription
} from '../types/widgets';

interface DashboardContextType {
  state: DashboardState;
  actions: {
    // Layout management
    setCurrentLayout: (layoutId: string) => void;
    createLayout: (name: string, description?: string) => void;
    updateLayout: (layoutId: string, updates: Partial<DashboardLayout>) => void;
    deleteLayout: (layoutId: string) => void;
    duplicateLayout: (layoutId: string, newName: string) => void;
    
    // Widget management
    addWidget: (templateId: string, position?: Partial<WidgetPosition>) => void;
    removeWidget: (widgetId: string) => void;
    updateWidget: (widgetId: string, updates: Partial<Widget>) => void;
    updateWidgetPosition: (widgetId: string, position: WidgetPosition) => void;
    updateWidgetConfig: (widgetId: string, config: Partial<Widget['config']>) => void;
    
    // Widget data
    refreshWidgetData: (widgetId: string) => void;
    refreshAllWidgets: () => void;
    subscribeToWidget: (widgetId: string) => void;
    unsubscribeFromWidget: (widgetId: string) => void;
    
    // Edit mode
    setEditMode: (enabled: boolean) => void;
    setSelectedWidget: (widgetId?: string) => void;
    
    // Data management
    updateWidgetData: (widgetId: string, data: any) => void;
    setWidgetLoading: (widgetId: string, loading: boolean) => void;
    setWidgetError: (widgetId: string, error: string | undefined) => void;
  };
}

type DashboardAction = 
  | { type: 'SET_CURRENT_LAYOUT'; payload: string }
  | { type: 'CREATE_LAYOUT'; payload: { name: string; description?: string } }
  | { type: 'UPDATE_LAYOUT'; payload: { layoutId: string; updates: Partial<DashboardLayout> } }
  | { type: 'DELETE_LAYOUT'; payload: string }
  | { type: 'ADD_WIDGET'; payload: Widget }
  | { type: 'REMOVE_WIDGET'; payload: string }
  | { type: 'UPDATE_WIDGET'; payload: { widgetId: string; updates: Partial<Widget> } }
  | { type: 'UPDATE_WIDGET_POSITION'; payload: { widgetId: string; position: WidgetPosition } }
  | { type: 'UPDATE_WIDGET_CONFIG'; payload: { widgetId: string; config: Partial<Widget['config']> } }
  | { type: 'UPDATE_WIDGET_DATA'; payload: { widgetId: string; data: any } }
  | { type: 'SET_WIDGET_LOADING'; payload: { widgetId: string; loading: boolean } }
  | { type: 'SET_WIDGET_ERROR'; payload: { widgetId: string; error: string | undefined } }
  | { type: 'SET_EDIT_MODE'; payload: boolean }
  | { type: 'SET_SELECTED_WIDGET'; payload: string | undefined }
  | { type: 'ADD_SUBSCRIPTION'; payload: WidgetSubscription }
  | { type: 'REMOVE_SUBSCRIPTION'; payload: string }
  | { type: 'INIT_DASHBOARD'; payload: DashboardState };

const initialState: DashboardState = {
  layouts: [],
  currentLayoutId: '',
  widgets: {},
  subscriptions: {},
  isEditMode: false,
  selectedWidgetId: undefined
};

function dashboardReducer(state: DashboardState, action: DashboardAction): DashboardState {
  switch (action.type) {
    case 'INIT_DASHBOARD':
      return action.payload;
      
    case 'SET_CURRENT_LAYOUT':
      return {
        ...state,
        currentLayoutId: action.payload
      };
      
    case 'CREATE_LAYOUT': {
      const newLayout: DashboardLayout = {
        id: `layout_${Date.now()}`,
        name: action.payload.name,
        description: action.payload.description,
        widgets: [],
        layout: [],
        isDefault: state.layouts.length === 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      return {
        ...state,
        layouts: [...state.layouts, newLayout],
        currentLayoutId: state.layouts.length === 0 ? newLayout.id : state.currentLayoutId
      };
    }
    
    case 'UPDATE_LAYOUT': {
      return {
        ...state,
        layouts: state.layouts.map(layout =>
          layout.id === action.payload.layoutId
            ? { ...layout, ...action.payload.updates, updatedAt: new Date() }
            : layout
        )
      };
    }
    
    case 'DELETE_LAYOUT': {
      const filteredLayouts = state.layouts.filter(l => l.id !== action.payload);
      return {
        ...state,
        layouts: filteredLayouts,
        currentLayoutId: state.currentLayoutId === action.payload
          ? (filteredLayouts[0]?.id || '')
          : state.currentLayoutId
      };
    }
    
    case 'ADD_WIDGET': {
      const currentLayout = state.layouts.find(l => l.id === state.currentLayoutId);
      if (!currentLayout) return state;
      
      const updatedLayouts = state.layouts.map(layout =>
        layout.id === state.currentLayoutId
          ? {
              ...layout,
              widgets: [...layout.widgets, action.payload],
              layout: [...layout.layout, action.payload.position],
              updatedAt: new Date()
            }
          : layout
      );
      
      return {
        ...state,
        layouts: updatedLayouts,
        widgets: {
          ...state.widgets,
          [action.payload.id]: action.payload
        }
      };
    }
    
    case 'REMOVE_WIDGET': {
      const updatedLayouts = state.layouts.map(layout => ({
        ...layout,
        widgets: layout.widgets.filter(w => w.id !== action.payload),
        layout: layout.layout.filter(pos => pos.i !== action.payload),
        updatedAt: new Date()
      }));
      
      const { [action.payload]: removed, ...remainingWidgets } = state.widgets;
      const { [action.payload]: removedSub, ...remainingSubscriptions } = state.subscriptions;
      
      return {
        ...state,
        layouts: updatedLayouts,
        widgets: remainingWidgets,
        subscriptions: remainingSubscriptions,
        selectedWidgetId: state.selectedWidgetId === action.payload ? undefined : state.selectedWidgetId
      };
    }
    
    case 'UPDATE_WIDGET': {
      const updatedWidget = {
        ...state.widgets[action.payload.widgetId],
        ...action.payload.updates,
        lastUpdate: new Date()
      };
      
      const updatedLayouts = state.layouts.map(layout => ({
        ...layout,
        widgets: layout.widgets.map(w =>
          w.id === action.payload.widgetId ? updatedWidget : w
        ),
        updatedAt: new Date()
      }));
      
      return {
        ...state,
        layouts: updatedLayouts,
        widgets: {
          ...state.widgets,
          [action.payload.widgetId]: updatedWidget
        }
      };
    }
    
    case 'UPDATE_WIDGET_POSITION': {
      const updatedLayouts = state.layouts.map(layout => ({
        ...layout,
        layout: layout.layout.map(pos =>
          pos.i === action.payload.widgetId ? action.payload.position : pos
        ),
        updatedAt: new Date()
      }));
      
      return {
        ...state,
        layouts: updatedLayouts,
        widgets: {
          ...state.widgets,
          [action.payload.widgetId]: {
            ...state.widgets[action.payload.widgetId],
            position: action.payload.position
          }
        }
      };
    }
    
    case 'UPDATE_WIDGET_CONFIG': {
      return {
        ...state,
        widgets: {
          ...state.widgets,
          [action.payload.widgetId]: {
            ...state.widgets[action.payload.widgetId],
            config: {
              ...state.widgets[action.payload.widgetId].config,
              ...action.payload.config
            },
            lastUpdate: new Date()
          }
        }
      };
    }
    
    case 'UPDATE_WIDGET_DATA': {
      return {
        ...state,
        widgets: {
          ...state.widgets,
          [action.payload.widgetId]: {
            ...state.widgets[action.payload.widgetId],
            data: action.payload.data,
            lastUpdate: new Date(),
            isLoading: false,
            error: undefined
          }
        }
      };
    }
    
    case 'SET_WIDGET_LOADING': {
      return {
        ...state,
        widgets: {
          ...state.widgets,
          [action.payload.widgetId]: {
            ...state.widgets[action.payload.widgetId],
            isLoading: action.payload.loading
          }
        }
      };
    }
    
    case 'SET_WIDGET_ERROR': {
      return {
        ...state,
        widgets: {
          ...state.widgets,
          [action.payload.widgetId]: {
            ...state.widgets[action.payload.widgetId],
            error: action.payload.error,
            isLoading: false
          }
        }
      };
    }
    
    case 'SET_EDIT_MODE':
      return {
        ...state,
        isEditMode: action.payload,
        selectedWidgetId: action.payload ? state.selectedWidgetId : undefined
      };
      
    case 'SET_SELECTED_WIDGET':
      return {
        ...state,
        selectedWidgetId: action.payload
      };
      
    case 'ADD_SUBSCRIPTION':
      return {
        ...state,
        subscriptions: {
          ...state.subscriptions,
          [action.payload.widgetId]: action.payload
        }
      };
      
    case 'REMOVE_SUBSCRIPTION': {
      const { [action.payload]: removed, ...remaining } = state.subscriptions;
      return {
        ...state,
        subscriptions: remaining
      };
    }
    
    default:
      return state;
  }
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

interface DashboardProviderProps {
  children: React.ReactNode;
}

export function DashboardProvider({ children }: DashboardProviderProps) {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);
  const { state: wsState } = useWebSocket();

  // Initialize dashboard with default layout
  useEffect(() => {
    if (state.layouts.length === 0) {
      dispatch({
        type: 'CREATE_LAYOUT',
        payload: { name: 'Default Dashboard', description: 'Default dashboard layout' }
      });
    }
  }, [state.layouts.length]);

  // Handle real-time widget data updates via WebSocket
  useEffect(() => {
    if (!wsState.isConnected) return;

    // Listen for widget data updates
    const handleWidgetData = (data: WidgetDataResponse) => {
      dispatch({
        type: 'UPDATE_WIDGET_DATA',
        payload: { widgetId: data.widgetId, data: data.data }
      });
    };

    // Note: In a real implementation, you'd set up WebSocket event listeners here
    // For now, we'll handle this through polling in the individual widgets
    
  }, [wsState.isConnected]);

  // Actions
  const actions = {
    setCurrentLayout: useCallback((layoutId: string) => {
      dispatch({ type: 'SET_CURRENT_LAYOUT', payload: layoutId });
    }, []),

    createLayout: useCallback((name: string, description?: string) => {
      dispatch({ type: 'CREATE_LAYOUT', payload: { name, description } });
    }, []),

    updateLayout: useCallback((layoutId: string, updates: Partial<DashboardLayout>) => {
      dispatch({ type: 'UPDATE_LAYOUT', payload: { layoutId, updates } });
    }, []),

    deleteLayout: useCallback((layoutId: string) => {
      dispatch({ type: 'DELETE_LAYOUT', payload: layoutId });
    }, []),

    duplicateLayout: useCallback((layoutId: string, newName: string) => {
      const layout = state.layouts.find(l => l.id === layoutId);
      if (layout) {
        const newLayout: DashboardLayout = {
          ...layout,
          id: `layout_${Date.now()}`,
          name: newName,
          createdAt: new Date(),
          updatedAt: new Date(),
          isDefault: false
        };
        dispatch({ type: 'UPDATE_LAYOUT', payload: { layoutId: '', updates: newLayout } });
      }
    }, [state.layouts]),

    addWidget: useCallback((templateId: string, position?: Partial<WidgetPosition>) => {
      try {
        const widget = widgetRegistry.createWidget(templateId, { position });
        dispatch({ type: 'ADD_WIDGET', payload: widget });
      } catch (error) {
        console.error('Failed to create widget:', error);
      }
    }, []),

    removeWidget: useCallback((widgetId: string) => {
      dispatch({ type: 'REMOVE_WIDGET', payload: widgetId });
    }, []),

    updateWidget: useCallback((widgetId: string, updates: Partial<Widget>) => {
      dispatch({ type: 'UPDATE_WIDGET', payload: { widgetId, updates } });
    }, []),

    updateWidgetPosition: useCallback((widgetId: string, position: WidgetPosition) => {
      dispatch({ type: 'UPDATE_WIDGET_POSITION', payload: { widgetId, position } });
    }, []),

    updateWidgetConfig: useCallback((widgetId: string, config: Partial<Widget['config']>) => {
      dispatch({ type: 'UPDATE_WIDGET_CONFIG', payload: { widgetId, config } });
    }, []),

    refreshWidgetData: useCallback((widgetId: string) => {
      const widget = state.widgets[widgetId];
      if (!widget) return;

      dispatch({ type: 'SET_WIDGET_LOADING', payload: { widgetId, loading: true } });
      
      // Simulate data refresh - in real implementation, this would fetch from API
      setTimeout(() => {
        dispatch({ 
          type: 'UPDATE_WIDGET_DATA', 
          payload: { 
            widgetId, 
            data: { 
              timestamp: new Date(), 
              value: Math.random() * 100,
              trend: Math.random() > 0.5 ? 'up' : 'down'
            } 
          } 
        });
      }, 1000);
    }, [state.widgets]),

    refreshAllWidgets: useCallback(() => {
      Object.keys(state.widgets).forEach(widgetId => {
        actions.refreshWidgetData(widgetId);
      });
    }, [state.widgets]),

    subscribeToWidget: useCallback((widgetId: string) => {
      const widget = state.widgets[widgetId];
      if (!widget) return;

      const subscription: WidgetSubscription = {
        widgetId,
        dataSource: widget.config.dataSources[0], // Use first data source
        callback: (data) => {
          dispatch({ type: 'UPDATE_WIDGET_DATA', payload: { widgetId, data } });
        },
        isActive: true
      };

      dispatch({ type: 'ADD_SUBSCRIPTION', payload: subscription });
    }, [state.widgets]),

    unsubscribeFromWidget: useCallback((widgetId: string) => {
      dispatch({ type: 'REMOVE_SUBSCRIPTION', payload: widgetId });
    }, []),

    setEditMode: useCallback((enabled: boolean) => {
      dispatch({ type: 'SET_EDIT_MODE', payload: enabled });
    }, []),

    setSelectedWidget: useCallback((widgetId?: string) => {
      dispatch({ type: 'SET_SELECTED_WIDGET', payload: widgetId });
    }, []),

    updateWidgetData: useCallback((widgetId: string, data: any) => {
      dispatch({ type: 'UPDATE_WIDGET_DATA', payload: { widgetId, data } });
    }, []),

    setWidgetLoading: useCallback((widgetId: string, loading: boolean) => {
      dispatch({ type: 'SET_WIDGET_LOADING', payload: { widgetId, loading } });
    }, []),

    setWidgetError: useCallback((widgetId: string, error: string | undefined) => {
      dispatch({ type: 'SET_WIDGET_ERROR', payload: { widgetId, error } });
    }, [])
  };

  return (
    <DashboardContext.Provider value={{ state, actions }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}