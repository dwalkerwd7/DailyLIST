export default function Footer() {
    const currentYear = new Date().getFullYear();

    const socialLinks = [
        { label: 'GitHub', href: 'https://github.com/dwalkerwd7' },
        { label: 'LinkedIn', href: 'https://www.linkedin.com/in/derek-walker-a288663a7/' },
        { label: 'UpWork', href: 'https://www.upwork.com/freelancers/dwalkerwd7' },
    ];

    return (
        <footer className="border-t border-primary-border bg-primary-bg mt-8">
            <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center gap-6">
                    <ul className="flex gap-6">
                        {socialLinks.map((link) => (
                            <li key={link.label}>
                                <a
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-link hover:text-link-hover transition-colors"
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                    <div className="text-center text-sm text-primary-text">
                        <p>&copy; {currentYear} DailyLIST v0.7. MIT License.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
