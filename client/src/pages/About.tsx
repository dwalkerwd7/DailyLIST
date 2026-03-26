export default function About() {
  return (
    <main className="mx-auto max-w-4xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-10">
        <h1 className="text-4xl font-bold text-primary-text text-center">
          About DailyLIST
        </h1>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-primary-text">The App</h2>
          <div className="space-y-3 text-primary-text">
            <p>
              DailyLIST is a minimal todo app built around one idea: your list
              resets every 24 hours. No carrying over yesterday's tasks, no
              infinite backlog. Just what matters today.
            </p>
            <p>
              The 24-hour countdown starts the moment you add your first item.
              When it hits zero, the list is gone — so use it or lose it. This
              constraint is intentional: it keeps you focused on what's actually
              achievable in a day, not what you wish you could do someday.
            </p>
            <p>
              Features are kept deliberately minimal. You can reorder tasks,
              add notes, toggle auto-delete on completion, and switch between
              light and dark mode. That's it — no accounts, no sync, no
              notifications. Just a list.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-primary-text">The Stack</h2>
          <ul className="list-disc list-inside space-y-1 text-primary-text">
            <li>React + TypeScript (client)</li>
            <li>Tailwind CSS v4</li>
            <li>Express + Node.js (server)</li>
            <li>HTTPOnly cookies for state persistence</li>
            <li>No database, no accounts</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-primary-text">The Developer</h2>
          <div className="space-y-3 text-primary-text">
            <p>
              Built by <strong>Derek Walker</strong>, a full-stack JavaScript
              engineer. DailyLIST is a portfolio project — an exercise in
              intentional design and shipping something clean rather than
              something sprawling.
            </p>
            <p>
              The source code is open and available on GitHub under the MIT
              license.
            </p>
            <a
              href="https://github.com/dwalkerwd7/DailyLIST"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-link hover:text-link-hover transition-colors font-medium"
            >
              GitHub Source Code →
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
