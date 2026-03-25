import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Feedback from './pages/Feedback';

type Theme = 'light' | 'dark';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-primary-bg">
      <Header />
        {children}
      <Footer />
    </div>
  );
}

function App() {

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    document.title = `DailyLIST - ${formattedDate}`;
  }, []);

  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/about"
          element={
            <Layout>
              <About />
            </Layout>
          }
        />
        <Route
          path="/feedback"
          element={
            <Layout>
              <Feedback />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
export type { Theme };