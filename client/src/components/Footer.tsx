export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-primary-border bg-primary-bg mt-8">
            <div className="mx-auto max-w-4xl py-2 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center gap-6">
                    <div className="text-center text-sm text-primary-text">
                        <p>&copy; {currentYear} <a href="https://derekwalker.tech" target="_blank" className="text-sm text-indigo-500 hover:text-indigo-300">DTS</a>. MIT License.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
