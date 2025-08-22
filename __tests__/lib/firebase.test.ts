import { isFirebaseConfigured } from '@/lib/firebase'

// Mock environment variables for testing
const mockEnvVars: Record<string, string | undefined> = {
  NEXT_PUBLIC_FIREBASE_API_KEY: 'test-api-key',
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: 'test-project.firebaseapp.com',
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: 'test-project',
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: 'test-project.appspot.com',
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: '123456789',
  NEXT_PUBLIC_FIREBASE_APP_ID: '1:123456789:web:test123'
}

describe('Firebase Configuration', () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...originalEnv }
  })

  afterAll(() => {
    process.env = originalEnv
  })

  describe('isFirebaseConfigured', () => {

    it('returns false when API key is missing', () => {
      const incompleteEnv = { ...mockEnvVars }
      delete incompleteEnv.NEXT_PUBLIC_FIREBASE_API_KEY
      Object.assign(process.env, incompleteEnv)
      jest.isolateModules(() => {
        const firebase = require('@/lib/firebase')
        const isFirebaseConfigured = firebase.isFirebaseConfigured || firebase.default?.isFirebaseConfigured
        expect(isFirebaseConfigured()).toBe(false)
      })
    })
  })

  it('returns false when project ID is missing', () => {
    const incompleteEnv = { ...mockEnvVars }
    delete incompleteEnv.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    Object.assign(process.env, incompleteEnv)

    jest.isolateModules(() => {
      const { isFirebaseConfigured } = require('@/lib/firebase')
      expect(isFirebaseConfigured()).toBe(false)
    })
  })

  it('returns false when API key has placeholder value', () => {
    const placeholderEnv = {
      ...mockEnvVars,
      NEXT_PUBLIC_FIREBASE_API_KEY: 'your-api-key-here'
    }
    Object.assign(process.env, placeholderEnv)

    jest.isolateModules(() => {
      const { isFirebaseConfigured } = require('@/lib/firebase')
      expect(isFirebaseConfigured()).toBe(false)
    })
  })

  it('returns false when project ID has placeholder value', () => {
    const placeholderEnv = {
      ...mockEnvVars,
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: 'your-project-id'
    }
    Object.assign(process.env, placeholderEnv)

    jest.isolateModules(() => {
      const { isFirebaseConfigured } = require('@/lib/firebase')
      expect(isFirebaseConfigured()).toBe(false)
    })
  })

  it('returns false when environment variables are empty strings', () => {
    const emptyEnv = {
      ...mockEnvVars,
      NEXT_PUBLIC_FIREBASE_API_KEY: '',
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: ''
    }
    Object.assign(process.env, emptyEnv)

    jest.isolateModules(() => {
      const { isFirebaseConfigured } = require('@/lib/firebase')
      expect(isFirebaseConfigured()).toBe(false)
    })
  })

  it('returns false when environment variables are whitespace only', () => {
    const whitespaceEnv = {
      ...mockEnvVars,
      NEXT_PUBLIC_FIREBASE_API_KEY: '   ',
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: '\t\n'
    }
    Object.assign(process.env, whitespaceEnv)

    jest.isolateModules(() => {
      const { isFirebaseConfigured } = require('@/lib/firebase')
      expect(isFirebaseConfigured()).toBe(false)
    })
  })
})
