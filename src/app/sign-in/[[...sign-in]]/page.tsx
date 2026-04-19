import Link from 'next/link';

// Check if Clerk is configured
const isClerkConfigured = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && 
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes('pk_test_dmFsaWQ');

export default function SignInPage() {
  // If Clerk not configured, redirect to dashboard (demo mode)
  if (!isClerkConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-black font-bold mx-auto mb-6">
            N
          </div>
          <h1 className="text-2xl font-bold text-zinc-100 mb-2">Demo Mode</h1>
          <p className="text-zinc-400 mb-6">
            Authentication is not configured. You can still explore the dashboard in demo mode.
          </p>
          <Link href="/dashboard">
            <button className="w-full px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-zinc-200 transition-colors">
              Continue to Dashboard
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // Clerk is configured - use their component
  const { SignIn } = require('@clerk/nextjs');
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black font-bold">
              N
            </div>
            <span className="text-xl font-semibold text-zinc-100">NSaaS</span>
          </Link>
        </div>
        <SignIn 
          appearance={{
            elements: {
              card: 'bg-zinc-900 border border-zinc-800 shadow-xl',
              headerTitle: 'text-zinc-100',
              headerSubtitle: 'text-zinc-400',
              socialButtonsBlockButton: 'bg-zinc-800 border-zinc-700 text-zinc-100 hover:bg-zinc-700',
              formFieldLabel: 'text-zinc-300',
              formFieldInput: 'bg-zinc-800 border-zinc-700 text-zinc-100',
              footerActionLink: 'text-zinc-300 hover:text-white',
              formButtonPrimary: 'bg-white text-black hover:bg-zinc-200',
            },
          }}
        />
      </div>
    </div>
  );
}
