import { useEffect, useState, useRef } from 'react';
import PageAlert, { type PageAlertProps } from '../components/utils/PageAlert';
import { APIPaths } from '../app-constants';

export default function Feedback() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [alertMessage, setAlertMessage] = useState<PageAlertProps>({ title: '', msg: '', type: 'success' });
  const [hasLoaded, setHasLoaded] = useState(false);

  const hasSubmittedFeedback = useRef(false);

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

  const getHasSubmittedFeedback = async () => {
    try {
      const response = await fetch(APIPaths.feedback, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      hasSubmittedFeedback.current = data.hasSubmitted;
      if (hasSubmittedFeedback.current) {
        setAlertMessage(alreadySubmittedAlert);
      }

      setHasLoaded(true);
      
    } catch (error) {
      console.error('Error checking feedback submission status:', error);
    }
  };

  const submitFeedback = async () => {
    try {
      const response = await fetch(APIPaths.feedback, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if(response.ok) {
        hasSubmittedFeedback.current = true;
        setAlertMessage(successSubmitAlert);
      } else {
        hasSubmittedFeedback.current = false;
        setAlertMessage(errorSubmitAlert);
      }

    } catch(error) {
      console.error('Error submitting feedback:', error);
      setAlertMessage(errorSubmitAlert);
    }
  };

  useEffect(() => {
    getHasSubmittedFeedback();
  }, []);

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    submitFeedback();
  };

  return (
    <main className="mx-auto max-w-4xl flex-1 px-4 py-8 sm:px-6 lg:px-8 text-center">
      <h1 className="text-4xl font-bold mb-4 text-primary-text">We'd love to hear from you!</h1>
      <p className="text-lg text-primary-text mb-8">Your feedback helps us improve DailyLIST. Please share your thoughts, suggestions, or report any issues you encounter.</p>
      <PageAlert
        {...alertMessage}
      />
      { !hasLoaded && (
        <p className="text-primary-text">Loading...</p>
      )}
      { !hasSubmittedFeedback.current && hasLoaded && (
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 justify-center">
        <div className="flex flex-col">
          <label htmlFor="name" className="block text-sm font-medium text-primary-text mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            className="border border-form-input rounded-md py-2 px-4 text-primary-text focus:outline-none focus:ring-2 focus:ring-form-input"
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
            className="border border-form-input rounded-md py-2 px-4 text-primary-text focus:outline-none focus:ring-2 focus:ring-form-input"
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
            className="border border-form-input rounded-md py-2 px-4 text-primary-text focus:outline-none focus:ring-2 focus:ring-form-input"
            placeholder="Your message"
            required
            maxLength={1000}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          />
        </div>
        <button
          type="submit"
          className="bg-submit-primary hover:bg-submit-primary-hover text-white font-bold py-2 px-4 rounded-md transition duration=150 ease-in-out"
        >
          Submit Feedback
        </button>
      </form>
      )}
    </main>
  );
}