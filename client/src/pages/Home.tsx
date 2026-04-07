import TodoApp from '../components/TodoApp';

export default function Home() {
    return (
        <main className="w-full md:max-w-2xl lg:max-w-3xl flex-1 self-center py-8">
            <div className="space-y-6">
                <h1 className="text-4xl font-bold text-primary-text text-center">
                    Daily Todo List
                </h1>

                <TodoApp />

            </div>
        </main>
    );
}
