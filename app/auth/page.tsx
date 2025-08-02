"use client"

import { useState } from "react"
import { Sword, Shield, Sparkles, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { signInWithGoogle, isFirebaseConfigured } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const firebaseConfigured = isFirebaseConfigured()

  const handleGoogleSignIn = async () => {
    if (!firebaseConfigured) {
      setError("Firebase is not properly configured. Please use Free Mode instead.")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      await signInWithGoogle()
      router.push("/creator")
    } catch (error: any) {
      console.error("Sign in failed:", error)
      setError(error.message || "Failed to sign in. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sword className="h-10 w-10 text-amber-600" />
            <h1 className="text-3xl font-bold text-gray-900">RPG Shop Creator</h1>
          </div>
          <p className="text-gray-600">Sign in to start creating amazing fantasy shop menus</p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {/* Configuration Warning */}
        {!firebaseConfigured && (
          <Alert className="mb-6 border-yellow-200 bg-yellow-50">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              Firebase is not configured. You can still use the app in free mode without saving your work.
              <br />
              <small className="text-yellow-700 mt-1 block">
                To enable sign-in, please set up your Firebase environment variables.
              </small>
            </AlertDescription>
          </Alert>
        )}

        {/* Sign In Card */}
        <Card className="border-amber-200 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>Continue your journey as a master merchant</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {firebaseConfigured && (
              <Button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 shadow-sm"
                size="lg"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </div>
                )}
              </Button>
            )}

            {/* Free Mode Button */}
            <div className="text-center">
              {firebaseConfigured && <div className="text-sm text-gray-500 mb-2">or</div>}
              <Link href="/creator">
                <Button variant="outline" className="w-full bg-transparent">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="h-4 w-4" />
                    <span>Free Mode</span>
                  </div>
                </Button>
              </Link>
              <p className="text-xs text-gray-500 mt-2">Use the app without signing in. Your work won't be saved.</p>
            </div>

            <div className="text-center text-sm text-gray-500">
              By using this app, you agree to our terms of service and privacy policy
            </div>
          </CardContent>
        </Card>

        {/* Setup Instructions for Developers */}
        {!firebaseConfigured && (
          <Card className="mt-6 border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg">For Developers</CardTitle>
              <CardDescription>To enable authentication, set up Firebase:</CardDescription>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p>
                1. Create a Firebase project at{" "}
                <code className="bg-gray-100 px-1 rounded">console.firebase.google.com</code>
              </p>
              <p>2. Enable Authentication → Google sign-in method</p>
              <p>3. Add your domain to authorized domains</p>
              <p>
                4. Copy your config to <code className="bg-gray-100 px-1 rounded">.env.local</code>:
              </p>
              <div className="bg-gray-50 p-2 rounded text-xs font-mono">
                <div>NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key</div>
                <div>NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain</div>
                <div>NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id</div>
                <div>NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket</div>
                <div>NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id</div>
                <div>NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id</div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Features Preview */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="flex flex-col items-center space-y-2">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-amber-600" />
            </div>
            <span className="text-xs text-gray-600">Secure</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-emerald-600" />
            </div>
            <span className="text-xs text-gray-600">Easy to Use</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Sword className="h-5 w-5 text-purple-600" />
            </div>
            <span className="text-xs text-gray-600">Fantasy Ready</span>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Link href="/home" className="text-sm text-gray-500 hover:text-gray-700">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
