import dynamic from 'next/dynamic'

// Loading component for better UX
const LoadingSkeleton = ({ className = "h-64" }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg ${className}`}>
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
    </div>
  </div>
)

// Heavy UI Components - Code Split These
export const LazyShopDisplay = dynamic(() => 
  import('@/components/shop-display').then(mod => ({ default: mod.ShopDisplay })), 
  {
    loading: () => <LoadingSkeleton className="h-96" />,
    ssr: true
  }
)

export const LazyNPCDisplay = dynamic(() =>
  import('@/components/npc-display').then(mod => ({ default: mod.NPCDisplay })),
  {
    loading: () => <LoadingSkeleton className="h-96" />,
    ssr: true
  }
)

// Print functionality - lazy load since it's not always used
export const LazyPrintButton = dynamic(() =>
  import('@/components/print-button').then(mod => ({ default: mod.PrintButton })),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded w-24 h-10"></div>
    ),
    ssr: false // Print functionality doesn't need SSR
  }
)

// Data loaders for heavy static content
export const loadCommonItems = () => import('@/app/shopkeeper/commonItems')
export const loadInsultsData = () => import('@/app/mockery/insults.repo')

// Route-based code splitting
export const LazyShopkeeperPage = dynamic(() =>
  import('@/app/shopkeeper/page'),
  {
    loading: () => (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    ),
    ssr: true
  }
)

export const LazyStatGeneratorPage = dynamic(() =>
  import('@/app/stat-generator/page'),
  {
    loading: () => (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    ),
    ssr: true
  }
)

export const LazyMockeryPage = dynamic(() =>
  import('@/app/mockery/page'),
  {
    loading: () => (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    ),
    ssr: true
  }
)
