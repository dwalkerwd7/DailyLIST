export default function About() {
  return (
    <main className="mx-auto max-w-4xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <h1 className="text-4xl font-bold text-primary-text text-center">
          About DailyLIST
        </h1>
        <div className="space-y-4 text-primary-text">
          <p>
            DailyLIST is a minimal todo app designed for focus and simplicity.
            Each day, your list resets, encouraging a fresh approach to what
            matters today.
          </p>
          <p>
            Built with React, TypeScript, and Tailwind CSS, DailyLIST showcases
            the power of intentional design: no unnecessary features, just what
            you need.
          </p>
        </div>
      </div>
    </main>
  );
}
