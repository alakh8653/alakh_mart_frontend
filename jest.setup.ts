import '@testing-library/jest-dom'

// Provide a lightweight mock for next-auth during tests so components
// using `useSession` or `SessionProvider` render without needing the
// real auth provider. Individual tests can override this mock if needed.
jest.mock('next-auth/react', () => ({
	useSession: () => ({ data: null, status: 'unauthenticated' }),
	signIn: jest.fn(),
	signOut: jest.fn(),
	SessionProvider: ({ children }: any) => children,
}))

// Mock Next.js router used by components that call `useRouter()`.
jest.mock('next/router', () => ({
	useRouter: () => ({
		push: jest.fn(),
		replace: jest.fn(),
		pathname: '/',
		query: {},
		prefetch: jest.fn().mockResolvedValue(undefined),
	}),
}))
