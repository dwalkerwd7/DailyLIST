import TodoApp from '../components/TodoApp';

export default function Home() {
  return (
    <main className="mx-auto max-w-4xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <h1 className="text-4xl font-bold text-primary-text text-center">
          Daily Todo List
        </h1>
        <p className="text-lg text-center text-muted">
          Your todo list resets in: 00:00:00
        </p>

        <TodoApp />

      </div>
    </main>
  );
}
