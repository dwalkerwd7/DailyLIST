import { useEffect, useState } from 'react';
import PageAlert, { type PageAlertProps } from '../components/utils/alerts/PageAlert';
import { APIPaths } from '../app-constants';

const successSubmitAlert: PageAlertProps = {
    title: 'Feedback Submitted!',
    msg: 'Thank you for your feedback!',
    type: 'success'
};

const errorSubmitAlert: PageAlertProps = {
    title: 'Submission Failed',
    msg: 'There was an issue submitting your feedback. Please try again later.',
    type: 'error'
};

const alreadySubmittedAlert: PageAlertProps = {
    title: 'Feedback Submitted',
    msg: 'Thank you for your feedback! We appreciate your input.',
    type: 'info',
    closable: false
};

export default function Feedback() {
    const [formData, setFormData] = useState({
        category: '',
        name: '',
        email: '',
        message: '',
    });

    const [alertMessage, setAlertMessage] = useState<PageAlertProps>({ title: '', msg: '', type: 'success' });
    const [hasLoaded, setHasLoaded] = useState(false);
    const [hasSubmittedFeedback, setHasSubmittedFeedback] = useState(false);

    const submitFeedback = async () => {
        try {
            const response = await fetch(APIPaths.feedback, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setHasSubmittedFeedback(true);
                setAlertMessage(successSubmitAlert);
            } else {
                setHasSubmittedFeedback(false);
                setAlertMessage(errorSubmitAlert);
            }

        } catch (error) {
            console.error('Error submitting feedback:', error);
            setAlertMessage(errorSubmitAlert);
        }
    };

    useEffect(() => {
        const checkSubmissionStatus = async () => {
            try {
                const response = await fetch(APIPaths.feedback, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });
                const data = await response.json();
                setHasSubmittedFeedback(data.hasSubmitted);
                if (data.hasSubmitted) {
                    setAlertMessage(alreadySubmittedAlert);
                }
                setHasLoaded(true);
            } catch (error) {
                console.error('Error checking feedback submission status:', error);
            }
        };
        void checkSubmissionStatus();
    }, []);

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        submitFeedback();
    };

    return (
        <main className="mx-auto max-w-4xl flex-1 px-4 py-8 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold mb-4">We'd love to hear from you!</h1>
            <p className="text-lg text-primary-text mb-8">Your feedback helps us improve DailyLIST. Please share your thoughts, suggestions, or report any issues you encounter.</p>
            <PageAlert
                {...alertMessage}
            />
            {!hasLoaded && (
                <p className="text-primary-text">Loading...</p>
            )}
            {!hasSubmittedFeedback && hasLoaded && (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 justify-center">
                    <div className="flex flex-col">
                        <label htmlFor="category" className="block text-sm font-medium text-primary-text mb-1">
                            Type
                        </label>
                        <select
                            id="category"
                            className="bg-secondary-bg border border-form-input rounded-md py-2 px-4 text-primary-text focus:outline-none focus:ring-2 focus:ring-form-input"
                            required
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                            <option value="" disabled>Select a type...</option>
                            <option value="issue">Issue</option>
                            <option value="suggestion">Suggestion</option>
                            <option value="comment">Comment</option>
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="name" className="block text-sm font-medium text-primary-text mb-1">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            className="bg-secondary-bg border border-form-input rounded-md py-2 px-4 text-primary-text focus:outline-none focus:ring-2 focus:ring-form-input"
                            placeholder="Your name"
                            required
                            maxLength={50}
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="email" className="block text-sm font-medium text-primary-text mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="bg-secondary-bg border border-form-input rounded-md py-2 px-4 text-primary-text focus:outline-none focus:ring-2 focus:ring-form-input"
                            placeholder="Your email"
                            required
                            maxLength={100}
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="message" className="block text-sm font-medium text-primary-text mb-1">
                            Message
                        </label>
                        <textarea
                            id="message"
                            rows={4}
                            className="bg-secondary-bg border border-form-input rounded-md py-2 px-4 text-primary-text focus:outline-none focus:ring-2 focus:ring-form-input"
                            placeholder="Your message"
                            required
                            maxLength={1000}
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-linear-to-r from-accent-from to-accent-to hover:from-accent-from-hover hover:to-accent-to-hover text-white font-bold py-2 px-4 rounded-md"
                    >
                        Submit Feedback
                    </button>
                </form>
            )}
        </main>
    );
}
