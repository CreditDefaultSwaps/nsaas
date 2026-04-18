import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-6">
            NSaaS
          </h1>
          <p className="text-2xl text-gray-300 mb-8">
            Natural Language → Working Software
          </p>
          <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
            Describe features in plain English. Our AI agents build them, test them, 
            and open pull requests. You just review and merge.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/sign-up"
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
            >
              Get Started
            </Link>
            <Link
              href="/sign-in"
              className="px-8 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition"
            >
              Sign In
            </Link>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-800 p-6 rounded-xl">
            <div className="text-3xl mb-4">📝</div>
            <h3 className="text-xl font-semibold mb-2">Describe Features</h3>
            <p className="text-gray-400">
              Write feature requests in natural language. No technical specs required.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl">
            <div className="text-3xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold mb-2">AI Builds</h3>
            <p className="text-gray-400">
              Our agents analyze your codebase, implement the feature, and run tests.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl">
            <div className="text-3xl mb-4">✅</div>
            <h3 className="text-xl font-semibold mb-2">Review & Merge</h3>
            <p className="text-gray-400">
              Review the PR, request changes if needed, and merge when ready.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
