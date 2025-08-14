// Performance monitoring utilities
export const measurePerformance = (name: string, fn: () => void) => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    const start = performance.now();
    fn();
    const end = performance.now();
    console.log(`${name}: ${end - start}ms`);
  } else {
    fn();
  }
};

export const reportWebVitals = (metric: any) => {
  console.log(metric);
  // Send to analytics service in production
};

export const preloadRoutes = () => {
  if (typeof window !== 'undefined') {
    const routes = ['/shopkeeper', '/stat-generator', '/mockery', '/npc-generator'];
    routes.forEach(route => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = route;
      document.head.appendChild(link);
    });
  }
};
