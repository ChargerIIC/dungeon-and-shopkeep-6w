import Link from "next/link"
import { Dice6 } from "lucide-react"
import { ArrowRight } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Page() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card className="group hover:shadow-lg transition-all duration-300 card-3d">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
              {/* Shop Creator icon here */}
            </div>
            <div>
              <CardTitle className="text-lg">Shop Creator</CardTitle>
              <p className="text-sm text-muted-foreground">Create your own shop</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">Use the shop creator to design and customize your own store.</p>
          <Button asChild className="w-full">
            <Link href="/shop-creator">
              Create Shop
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
      <Card className="group hover:shadow-lg transition-all duration-300 card-3d">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
              <Dice6 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <CardTitle className="text-lg">Stat Generator</CardTitle>
              <p className="text-sm text-muted-foreground">Roll ability scores</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Generate D&D ability scores using the 4d6 drop lowest method with point allocation tracking.
          </p>
          <Button asChild className="w-full">
            <Link href="/stat-generator">
              Generate Stats
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
      {/* Other cards here */}
    </div>
  )
}
