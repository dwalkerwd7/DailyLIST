import TodoApp from '../components/TodoApp';

export default function Home() {
  return (
    <main className="mx-auto max-w-4xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <h1 className="text-4xl font-bold text-primary-text">
          Daily Todo List
        </h1>
        <p className="text-lg text-gray-700">
          Your daily list resets every 24 hours. Start fresh each day.
        </p>

        <TodoApp />

      </div>
    </main>
  );
}
