export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <h1 className="text-4xl font-bold text-gray-900">404</h1>
      <p className="text-gray-500 mt-2">Page not found</p>

      <a
        href="/"
        className="mt-6 bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700"
      >
        Go Home
      </a>
    </div>
  );
}