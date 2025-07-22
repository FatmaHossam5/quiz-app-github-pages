/**
 * Performance monitoring utilities for the Quiz App
 */

import React from 'react';

// Type definitions for performance metrics
export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  bundleSize?: number;
  memoryUsage?: number;
  cacheHitRate?: number;
}

export interface ComponentPerformance {
  name: string;
  renderTime: number;
  rerenderCount: number;
  timestamp: number;
}

// Performance monitoring class
class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private componentMetrics: Map<string, ComponentPerformance> = new Map();
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.setupPerformanceObservers();
  }

  // Setup performance observers
  private setupPerformanceObservers(): void {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      // Observe navigation timing
      try {
        const navigationObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (entry.entryType === 'navigation') {
              this.recordNavigationMetrics(entry as PerformanceNavigationTiming);
            }
          });
        });
        navigationObserver.observe({ entryTypes: ['navigation'] });
        this.observers.push(navigationObserver);
              } catch (error) {
          // Navigation timing observer not supported
        }

      // Observe resource timing
      try {
        const resourceObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (entry.entryType === 'resource') {
              this.recordResourceMetrics(entry as PerformanceResourceTiming);
            }
          });
        });
        resourceObserver.observe({ entryTypes: ['resource'] });
        this.observers.push(resourceObserver);
              } catch (error) {
          // Resource timing observer not supported
        }

      // Observe paint timing
      try {
        const paintObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (entry.entryType === 'paint') {
              this.recordPaintMetrics(entry);
            }
          });
        });
        paintObserver.observe({ entryTypes: ['paint'] });
        this.observers.push(paintObserver);
              } catch (error) {
          // Paint timing observer not supported
        }
    }
  }

  // Record navigation metrics
  private recordNavigationMetrics(entry: PerformanceNavigationTiming): void {
    const loadTime = entry.loadEventEnd - (entry as PerformanceNavigationTiming & { navigationStart: number }).navigationStart;
    const renderTime = entry.domContentLoadedEventEnd - (entry as PerformanceNavigationTiming & { navigationStart: number }).navigationStart;
    
    this.metrics.push({
      loadTime,
      renderTime,
      memoryUsage: this.getMemoryUsage(),
    });
  }

  // Record resource metrics
  private recordResourceMetrics(entry: PerformanceResourceTiming): void {
    // Track large resources that might affect performance
    if (entry.transferSize > 100000) { // 100KB threshold
      // Large resource detected
    }
  }

  // Record paint metrics
  private recordPaintMetrics(entry: PerformanceEntry): void {
    if (entry.name === 'first-contentful-paint') {
      // First Contentful Paint recorded
    } else if (entry.name === 'first-paint') {
      // First Paint recorded
    }
  }

  // Get memory usage (if available)
  private getMemoryUsage(): number | undefined {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const memory = (performance as Performance & { memory?: { usedJSHeapSize: number } }).memory;
      if (memory) {
        return memory.usedJSHeapSize;
      }
    }
    return undefined;
  }

  // Track component render performance
  public trackComponentRender(componentName: string, renderTime: number): void {
    const existing = this.componentMetrics.get(componentName);
    if (existing) {
      existing.rerenderCount++;
      existing.renderTime = renderTime;
      existing.timestamp = Date.now();
    } else {
      this.componentMetrics.set(componentName, {
        name: componentName,
        renderTime,
        rerenderCount: 1,
        timestamp: Date.now(),
      });
    }
  }

  // Get component performance metrics
  public getComponentMetrics(): ComponentPerformance[] {
    return Array.from(this.componentMetrics.values());
  }

  // Get overall performance metrics
  public getMetrics(): PerformanceMetrics[] {
    return this.metrics;
  }

  // Measure function execution time
  public measureFunction<T>(fn: () => T, label: string): T {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    // Function execution time measured
    return result;
  }

  // Measure async function execution time
  public async measureAsyncFunction<T>(fn: () => Promise<T>, label: string): Promise<T> {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    // Async function execution time measured
    return result;
  }

  // Get Web Vitals metrics
  public getWebVitals(): Promise<Record<string, number>> {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
        const vitals: Record<string, number> = {};
        
        // Largest Contentful Paint
        try {
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lcp = entries[entries.length - 1];
            vitals.lcp = lcp.startTime;
            lcpObserver.disconnect();
          });
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (error) {
          // LCP observer not supported
        }

        // First Input Delay
        try {
          const fidObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
              vitals.fid = (entry as PerformanceEntry & { processingStart: number }).processingStart - entry.startTime;
            });
            fidObserver.disconnect();
          });
          fidObserver.observe({ entryTypes: ['first-input'] });
        } catch (error) {
          // FID observer not supported
        }

        // Cumulative Layout Shift
        try {
          const clsObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            let clsValue = 0;
            entries.forEach((entry) => {
              const layoutShiftEntry = entry as PerformanceEntry & { hadRecentInput: boolean; value: number };
              if (!layoutShiftEntry.hadRecentInput) {
                clsValue += layoutShiftEntry.value;
              }
            });
            vitals.cls = clsValue;
          });
          clsObserver.observe({ entryTypes: ['layout-shift'] });
        } catch (error) {
          // CLS observer not supported
        }

        setTimeout(() => resolve(vitals), 5000); // Wait 5 seconds to collect metrics
      } else {
        resolve({});
      }
    });
  }

  // Bundle size analysis
  public analyzeBundleSize(): void {
    if (typeof window !== 'undefined') {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      const jsResources = resources.filter(resource => 
        resource.name.endsWith('.js') || resource.name.includes('.js?')
      );
      
      const totalJSSize = jsResources.reduce((total, resource) => 
        total + (resource.transferSize || 0), 0
      );
      
      // Bundle Analysis completed
    }
  }

  // Generate performance report
  public generateReport(): string {
    const componentMetrics = this.getComponentMetrics();
    const overallMetrics = this.getMetrics();
    
    let report = '=== Performance Report ===\n\n';
    
    // Overall metrics
    if (overallMetrics.length > 0) {
      const avgLoadTime = overallMetrics.reduce((sum, m) => sum + m.loadTime, 0) / overallMetrics.length;
      const avgRenderTime = overallMetrics.reduce((sum, m) => sum + m.renderTime, 0) / overallMetrics.length;
      
      report += `Overall Performance:\n`;
      report += `- Average Load Time: ${avgLoadTime.toFixed(2)}ms\n`;
      report += `- Average Render Time: ${avgRenderTime.toFixed(2)}ms\n\n`;
    }
    
    // Component metrics
    if (componentMetrics.length > 0) {
      report += 'Component Performance:\n';
      componentMetrics
        .sort((a, b) => b.renderTime - a.renderTime)
        .forEach(metric => {
          report += `- ${metric.name}: ${metric.renderTime.toFixed(2)}ms (${metric.rerenderCount} renders)\n`;
        });
    }
    
    return report;
  }

  // Cleanup observers
  public cleanup(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// React component performance tracking hook
export const usePerformanceTracker = (componentName: string) => {
  const startTime = performance.now();
  
  return {
    endMeasurement: () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      performanceMonitor.trackComponentRender(componentName, renderTime);
    }
  };
};

// Higher-order component for performance tracking
export const withPerformanceTracking = <P extends object>(
  Component: React.ComponentType<P>,
  displayName?: string
) => {
  const WrappedComponent = (props: P) => {
    const componentName = displayName || Component.displayName || Component.name;
    const { endMeasurement } = usePerformanceTracker(componentName);
    
    React.useEffect(() => {
      endMeasurement();
    });
    
    return React.createElement(Component, props);
  };
  
  WrappedComponent.displayName = `withPerformanceTracking(${displayName || Component.displayName || Component.name})`;
  return WrappedComponent;
};

// Create global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// Export utilities
export const measureComponentRender = (componentName: string, renderTime: number) => {
  performanceMonitor.trackComponentRender(componentName, renderTime);
};

export const getPerformanceReport = () => {
  return performanceMonitor.generateReport();
};

export const analyzeBundle = () => {
  performanceMonitor.analyzeBundleSize();
};

// Performance best practices recommendations
export const PERFORMANCE_RECOMMENDATIONS = {
  BUNDLE_SIZE: {
    MAX_JS_SIZE: 200 * 1024, // 200KB
    MAX_CSS_SIZE: 50 * 1024,  // 50KB
    MAX_CHUNKS: 10,
  },
  RENDER_PERFORMANCE: {
    MAX_RENDER_TIME: 16, // 16ms for 60fps
    MAX_RERENDER_COUNT: 5,
  },
  LOADING_PERFORMANCE: {
    MAX_LOAD_TIME: 3000, // 3 seconds
    MAX_FCP: 1800, // 1.8 seconds
    MAX_LCP: 2500, // 2.5 seconds
  },
  MEMORY: {
    MAX_MEMORY_USAGE: 50 * 1024 * 1024, // 50MB
  }
};

export default performanceMonitor; 
