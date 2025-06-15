import { useState } from 'react';
import './AppStyles.css';
import questions from './data/questions_2025.json';
import StartPage from './pages/StartPage';
import TestRunPage from './pages/TestRunPage';
import PracticePage from './pages/PracticePage';
import ResultsPage from './pages/ResultsPage';

// === Κύριο component της εφαρμογής ===
function App() {
  // --- Καταστάσεις (states) ---
  const [started, setStarted] = useState(false);
  const [userChoices, setUserChoices] = useState(null);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);

  // --- Εκκίνηση quiz ---
  const handleStart = (choices, selectedQuestions) => {
    // Scroll στην κορυφή
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setUserChoices(choices);
    setQuizQuestions(selectedQuestions);
    setStarted(true);
  };

  // --- Τερματισμός quiz και εμφάνιση αποτελεσμάτων ---
  const handleFinish = (answers) => {
    // Scroll στην κορυφή
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setUserAnswers(answers);
    setShowResults(true);
  };

  // --- Επανεκκίνηση εφαρμογής ---
  const handleRestart = () => {
    // Scroll στην κορυφή
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setStarted(false);
    setUserChoices(null);
    setQuizQuestions([]);
    setUserAnswers([]);
    setShowResults(false);
  };

  // --- Αντιγραφή του συνδέσμου της εφαρμογής στο πρόχειρο ---
  const handleCopyLink = () => {
    const url = 'https://asep25.fmaths.gr';

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url)
        .then(() => {
          alert('📋 Ο σύνδεσμος αντιγράφηκε!');
        })
        .catch(() => {
          fallbackCopy(url);
        });
    } else {
      fallbackCopy(url);
    }
  };

  const fallbackCopy = (text) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();

    try {
      const success = document.execCommand('copy');
      alert(success ? '📋 Ο σύνδεσμος αντιγράφηκε!' : '⚠️ Δεν ήταν δυνατή η αντιγραφή.');
    } catch (err) {
      alert('⚠️ Δεν ήταν δυνατή η αντιγραφή.');
    }

    document.body.removeChild(textarea);
  };

  // === Απόδοση περιεχομένου ανά στάδιο ===
  return (
    <div>
      <h1 className="luck-title">🍀 Καλή Επιτυχία!</h1>
      <p className="creator">
        <strong>Δημιουργός εφαρμογής</strong><br />
        Φώτης Χ. Κουτσουμπίδης
      </p>

      {/* Αρχική σελίδα επιλογών */}
      {!started && !showResults && (
        <StartPage
          onStart={handleStart}
          questions={questions}
        />
      )}

      {/* Σελίδα διεξαγωγής του quiz ή της εξάσκησης */}
      {started && !showResults && (
        userChoices?.practiceMode ? (
          <PracticePage
            questions={quizQuestions}
            userChoices={userChoices}
            onFinish={handleFinish}
            onRestart={handleRestart}
          />
        ) : (
          <TestRunPage
            questions={quizQuestions}
            userChoices={userChoices}
            onFinish={handleFinish}
            onRestart={handleRestart}
          />
        )
      )}

      {/* Σελίδα αποτελεσμάτων */}
      {showResults && (
        <ResultsPage
          questions={quizQuestions}
          userAnswers={userAnswers}
          onRestart={handleRestart}
        />
      )}

      {/* Footer με σύνδεσμο και κουμπί κοινοποίησης */}
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <a
          className="footer"
          href="https://fmaths.gr"
          target="_blank"
          rel="noopener noreferrer"
          style={{ marginRight: '2rem' }}
          title='Go to 👉 https://fmaths.gr'
        >
          🌐 fMaths
        </a>
        <button
          className="footer"
          onClick={handleCopyLink}
          title='Copy link 👉 https://asep25.fmaths.gr'
        >
          📤 Share
        </button>
      </div>
    </div>
  );
}

export default App;
