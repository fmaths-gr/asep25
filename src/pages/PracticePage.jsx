import { useState } from 'react';
import Disclaimer from '../components/Disclaimer';

// === PracticePage component: Σελίδα εξάσκησης με έλεγχο απάντησης ===
function PracticePage({ questions = [], onRestart, onRetryWrongAnswers }) {
  // --- Καταστάσεις ---
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finished, setFinished] = useState(false);

  // --- Τρέχουσα ερώτηση ---
  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIndex];
  const isLast = currentIndex === totalQuestions - 1;

  // --- Διαχείριση "Έλεγχος" ---
  const handleCheck = () => {
    setUserAnswers([...userAnswers, selectedAnswer]);
    setShowResult(true);
  };

  // --- Διαχείριση "Επόμενη" ---
  const handleNext = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    setCurrentIndex(currentIndex + 1);
  };

  // --- Διαχείριση "Ολοκλήρωση Εξάσκησης" ---
  const handleFinish = () => {
    setFinished(true);
  };

  // --- Διαχείριση επανάληψης λαθών ---
  const handleRetryWrongAnswers = (wrongAnswers) => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setUserAnswers([]);
    setShowResult(false);
    setFinished(false);

    onRetryWrongAnswers(wrongAnswers);
  };

  // === Αν δεν υπάρχουν διαθέσιμες ερωτήσεις ===
  if (!Array.isArray(questions) || totalQuestions === 0) {
    return (
      <div className="start-container">
        <h2 className="title">⚠️ Δεν υπάρχουν διαθέσιμες ερωτήσεις.</h2>
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <button onClick={onRestart}>Επανεκκίνηση</button>
        </div>
      </div>
    );
  }

  // === Τέλος εξάσκησης ===
  if (finished) {
    // Scroll στην κορυφή
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Λανθασμένες απαντήσεις
    const wrongAnswers = questions.filter(
      (q, i) => q.answer !== userAnswers[i]
    );

    return (
      <div className="start-container">
        <h2 className="title">👏 Τέλος εξάσκησης!</h2>
        {wrongAnswers.length === 0 && (
          <p className="practice-complete-text">🚀 Πάμε ξανά!</p>
        )}

        {/* Κουμπί επανάληψης λαθών */}
        {wrongAnswers.length > 0 && (
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <button onClick={() => handleRetryWrongAnswers(wrongAnswers)}>
              Επανάληψη λαθών
            </button>
          </div>
        )}

        {/* Κουμπί επανεκκίνησης */}
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <button onClick={onRestart}>Επανεκκίνηση</button>
        </div>

        {/* Ενημερωτικό disclaimer */}
        <Disclaimer />
      </div>
    );
  }

  // === Κανονική ροή ===
  return (
    <div className="start-container">
      {/* Τίτλος ερώτησης */}
      <h2 className="title">
        📚 Εξάσκηση {currentIndex + 1} / {totalQuestions}
      </h2>

      {/* Εκφώνηση */}
      <div className="trp-question-block">
        <p className="trp-question">{currentQuestion.question}</p>

        {/* Πίνακας (αν υπάρχει) */}
        {currentQuestion.table && (
          <table className="question-table">
            <tbody>
              {currentQuestion.table.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) =>
                    rowIndex === 0 ? (
                      <th key={cellIndex}>{cell}</th>
                    ) : (
                      <td key={cellIndex}>{cell}</td>
                    )
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Επιπλέον φράση κάτω από τον πίνακα (αν υπάρχει) */}
        {currentQuestion.table && currentQuestion.sub_question && (
          <p className="trp-question">{currentQuestion.sub_question}</p>
        )}
      </div>

      {/* Επιλογές απάντησης */}
      <div className="start-field">
        {currentQuestion.options.map((option, i) => {
          const isCorrect = option === currentQuestion.answer;
          const isUserAnswer = option === selectedAnswer;
          const isWrong = isUserAnswer && !isCorrect;

          return (
            <label key={i} className="trp-option-label">
              <div className="trp-option-wrapper">
                <input
                  type="radio"
                  name="answer"
                  value={option}
                  checked={selectedAnswer === option}
                  onChange={() => setSelectedAnswer(option)}
                  disabled={showResult}
                />
                <span
                  className={
                    showResult
                      ? isCorrect
                        ? 'answer-correct'
                        : isWrong
                        ? 'answer-wrong'
                        : ''
                      : ''
                  }
                >
                  {option}
                </span>
              </div>
            </label>
          );
        })}
      </div>

      {/* Κουμπί Ελέγχου / Επόμενης / Ολοκλήρωσης */}
      <div style={{ marginTop: '1rem', textAlign: 'center' }}>
        {!showResult ? (
          <button onClick={handleCheck} disabled={!selectedAnswer}>
            Έλεγχος
          </button>
        ) : isLast ? (
          <button onClick={handleFinish}>Ολοκλήρωση</button>
        ) : (
          <button onClick={handleNext}>Επόμενη</button>
        )}
      </div>

      {/* Κουμπί επανεκκίνησης */}
      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <button onClick={onRestart}>Επανεκκίνηση</button>
      </div>
    </div>
  );
}

export default PracticePage;
