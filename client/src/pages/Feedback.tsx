import { useEffect, useState } from 'react';
import Alert, { type AlertProps } from '../components/utils/Alert';

export default function Feedback() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const successAlert: AlertProps = {
    title: 'Feedback Submitted!',
    msg: 'Thank you for your feedback!',
    type: 'success'
  };

  const [alertMessage, setAlertMessage] = useState<AlertProps>({ msg: '', type: 'success' });
  let hasSubmittedFeedback = false;

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAlertMessage(successAlert);

    // TODO: send the form data through backend api

    setFormData({ name: '', email: '', message: '' });
  };

  useEffect(() => {
    // TODO: check if IP already has submitted feedback using backend api
    hasSubmittedFeedback = false; // Placeholder until backend is implemented
  }, []);

  return (
    <main className="mx-auto max-w-4xl flex-1 px-4 py-8 sm:px-6 lg:px-8 text-center">
      <h1 className="text-4xl font-bold mb-4">We'd love to hear from you!</h1>
      <p className="text-lg text-gray-700 mb-8">Your feedback helps us improve DailyList. Please share your thoughts, suggestions, or report any issues you encounter.</p>
      { !hasSubmittedFeedback ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 justify-center">
        <Alert 
          title={alertMessage.title} 
          msg={alertMessage.msg} 
          type={alertMessage.type} 
          closable
        />
        <div className="flex flex-col">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            className="border border-form-input rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Your name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="border border-form-input rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Your email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Message
          </label>
          <textarea
            id="message"
            rows={4}
            className="border border-form-input rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Your message"
            required
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          />
        </div>
        <button
          type="submit"
          className="bg-button-primary hover:bg-button-primary-hover text-white font-bold py-2 px-4 rounded-md transition duration=150 ease-in-out"
        >
          Submit Feedback
        </button>
      </form>
      ) : (
        <Alert 
          msg={successAlert.msg} 
          type={successAlert.type} 
        />
      )}
    </main>
  );
}
