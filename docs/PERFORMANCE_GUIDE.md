# Performance Optimization Implementation Guide

## 🎯 Quick Wins (Immediate Impact)

### 1. Remove Unused Radix Packages (30-60% bundle reduction)
```bash
# First, run the analysis script
node scripts/find-unused-radix.js

# Remove unused packages (example)
npm uninstall @radix-ui/react-accordion @radix-ui/react-alert-dialog @radix-ui/react-aspect-ratio @radix-ui/react-breadcrumb @radix-ui/react-calendar @radix-ui/react-carousel @radix-ui/react-chart @radix-ui/react-checkbox @radix-ui/react-collapsible @radix-ui/react-command @radix-ui/react-context-menu @radix-ui/react-drawer @radix-ui/react-hover-card @radix-ui/react-input-otp @radix-ui/react-menubar @radix-ui/react-navigation-menu @radix-ui/react-pagination @radix-ui/react-progress @radix-ui/react-radio-group @radix-ui/react-resizable @radix-ui/react-scroll-area @radix-ui/react-slider @radix-ui/react-toggle @radix-ui/react-toggle-group @radix-ui/react-tooltip
```

### 2. Enable Bundle Analysis
```bash
# Add webpack-bundle-analyzer
npm install --save-dev webpack-bundle-analyzer

# Analyze your bundle
npm run build
npx webpack-bundle-analyzer .next/static/chunks/*.js
```

### 3. Implement Code Splitting
Replace direct imports with lazy loading:

```typescript
// Before: Heavy import
import { ShopDisplay } from '@/components/shop-display'

// After: Lazy loading
import { LazyShopDisplay } from '@/lib/lazy-components'
```

## 🚀 Medium Impact Changes

### 4. Optimize Theme System
Replace large theme objects with CSS custom properties:

```typescript
// Use the optimized theme system
import { applyTheme } from '@/lib/optimized-themes'

// Apply theme
applyTheme('parchment', document.documentElement)
```

### 5. Move Large Data External
Convert commonItems.tsx to JSON:

```bash
# Move data to public folder for caching
mv app/shopkeeper/commonItems.tsx public/data/common-items.json
```

## 📈 Long-term Improvements

### 6. Implement Route Preloading
Add to your main layout:

```typescript
import { preloadRoutes } from '@/lib/performance'

useEffect(() => {
  preloadRoutes()
}, [])
```

### 7. Add Web Vitals Monitoring
```typescript
import { reportWebVitals } from '@/lib/performance'

export function reportWebVitals(metric) {
  reportWebVitals(metric)
}
```

## 🎯 Expected Results

| Optimization | Bundle Size Reduction | Load Time Improvement |
|--------------|----------------------|----------------------|
| Remove unused Radix | 30-60% | 1-3 seconds |
| Code splitting | 15-25% | 0.5-1 second |
| Theme optimization | 5-10% | 0.2-0.5 seconds |
| Data externalization | 10-15% | 0.3-0.8 seconds |
| **Total Expected** | **60-85%** | **2-5 seconds** |

## 🔍 Monitoring Commands

```bash
# Build and analyze
npm run build
npm run analyze

# Check bundle sizes
npx next build --profile
npx @next/bundle-analyzer

# Performance audit
npx lighthouse https://your-app.com --view
```

## ⚠️ Important Notes

1. **Test thoroughly** after removing packages
2. **Monitor Core Web Vitals** using the performance utilities
3. **Enable bundle analysis** only during optimization (not in production)
4. **Implement changes incrementally** to isolate impact
5. **Consider CDN caching** for static assets

## 🎉 Next Steps

1. Run the unused package analysis
2. Remove identified unused packages  
3. Test application functionality
4. Implement code splitting for heavy components
5. Monitor performance improvements
6. Iterate based on results
