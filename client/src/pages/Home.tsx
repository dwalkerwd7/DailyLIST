import TodoApp from '../components/TodoApp';

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl sm:min-w-sm md:min-w-md flex-1 pt-8">
      <div className="space-y-6">
        <h1 className="text-4xl font-bold text-primary-text text-center">
          Daily Todo List
        </h1>

        <TodoApp />

      </div>
    </main>
  );
}
