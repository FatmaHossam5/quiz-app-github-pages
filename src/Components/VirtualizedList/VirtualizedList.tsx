import React, { memo, forwardRef, useCallback, useMemo } from 'react';
import { FixedSizeList as List, ListChildComponentProps } from 'react-window';
import { User, Quiz, Question } from '../../types';

interface VirtualizedListProps<T> {
  items: T[];
  height: number;
  itemHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  onItemClick?: (item: T, index: number) => void;
  className?: string;
  overscan?: number;
  loading?: boolean;
  error?: string;
  emptyMessage?: string;
  onScroll?: (scrollTop: number) => void;
}

// Memoized list item component
const ListItem = memo<ListChildComponentProps>(({ index, style, data }) => {
  const { items, renderItem, onItemClick } = data;
  const item = items[index];

  const handleClick = useCallback(() => {
    if (onItemClick) {
      onItemClick(item, index);
    }
  }, [item, index, onItemClick]);

  return (
    <div 
      style={style}
      className={`${onItemClick ? 'cursor-pointer hover:bg-gray-50' : ''} transition-colors duration-150`}
      onClick={handleClick}
    >
      {renderItem(item, index)}
    </div>
  );
});

ListItem.displayName = 'ListItem';

// Generic virtualized list component
function VirtualizedListComponent<T>({
  items,
  height,
  itemHeight,
  renderItem,
  onItemClick,
  className = '',
  overscan = 5,
  loading = false,
  error = '',
  emptyMessage = 'No items found',
  onScroll,
}: VirtualizedListProps<T>) {
  // Memoize the item data to prevent unnecessary re-renders
  const itemData = useMemo(() => ({
    items,
    renderItem,
    onItemClick,
  }), [items, renderItem, onItemClick]);

  // Handle scroll events
  const handleScroll = useCallback(({ scrollTop }: { scrollTop: number }) => {
    if (onScroll) {
      onScroll(scrollTop);
    }
  }, [onScroll]);

  // Loading state
  if (loading) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ height }}>
        <div className="flex flex-col items-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ height }}>
        <div className="flex flex-col items-center space-y-2">
          <div className="text-red-500">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-sm text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (items.length === 0) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ height }}>
        <div className="flex flex-col items-center space-y-2">
          <div className="text-gray-400">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <p className="text-sm text-gray-600">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <List
        height={height}
        itemCount={items.length}
        itemSize={itemHeight}
        itemData={itemData}
        overscanCount={overscan}
        onScroll={handleScroll}
      >
        {ListItem}
      </List>
    </div>
  );
}

// Export the component with proper TypeScript generics
export const VirtualizedList = memo(VirtualizedListComponent) as <T>(
  props: VirtualizedListProps<T>
) => JSX.Element;

// Specific virtualized list components for different data types
export const VirtualizedQuizList = memo(forwardRef<unknown, VirtualizedListProps<Quiz>>((props) => (
  <VirtualizedList {...props} />
)));

export const VirtualizedStudentList = memo(forwardRef<unknown, VirtualizedListProps<User>>((props) => (
  <VirtualizedList {...props} />
)));

export const VirtualizedQuestionList = memo(forwardRef<unknown, VirtualizedListProps<Question>>((props) => (
  <VirtualizedList {...props} />
)));

VirtualizedQuizList.displayName = 'VirtualizedQuizList';
VirtualizedStudentList.displayName = 'VirtualizedStudentList';
VirtualizedQuestionList.displayName = 'VirtualizedQuestionList';

export default VirtualizedList; 
