import { useState } from 'react';

// === TestRunPage component: Σελίδα εκτέλεσης του quiz ===
function TestRunPage({ questions = [], userChoices, onRestart, onFinish }) {
  // --- Καταστάσεις ---
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);

  // --- Τρέχουσα ερώτηση ---
  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIndex];

  // --- Επόμενη ερώτηση ή Τέλος ---
  const handleNext = () => {
    const updatedAnswers = [...userAnswers, selectedAnswer];
    setUserAnswers(updatedAnswers);
    setSelectedAnswer(null);

    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onFinish(updatedAnswers);
    }
  };

  // === Έλεγχος για κενή λίστα ερωτήσεων ===
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

  // === Κανονική ροή ===
  return (
    <div className="start-container">
      {/* Τίτλος ερώτησης */}
      <h2 className="title">
        📋 Ερώτηση {currentIndex + 1} / {totalQuestions}
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

        {/* Υποερώτηση κάτω από τον πίνακα (αν υπάρχει) */}
        {currentQuestion.table && currentQuestion.sub_question && (
          <p className="trp-question">{currentQuestion.sub_question}</p>
        )}
      </div>

      {/* Επιλογές απάντησης */}
      <div className="start-field">
        {currentQuestion.options.map((option, i) => (
          <label key={i} className="trp-option-label">
            <div className="trp-option-wrapper">
              <input
                type="radio"
                name="answer"
                value={option}
                checked={selectedAnswer === option}
                onChange={() => setSelectedAnswer(option)}
              />
              <span>{option}</span>
            </div>
          </label>
        ))}
      </div>

      {/* Κουμπί επόμενης ή ολοκλήρωσης */}
      <div style={{ marginTop: '1rem', textAlign: 'center' }}>
        <button onClick={handleNext} disabled={!selectedAnswer}>
          {currentIndex < totalQuestions - 1 ? 'Επόμενη' : 'Ολοκλήρωση'}
        </button>
      </div>

      {/* Κουμπί επανεκκίνησης */}
      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <button onClick={onRestart}>Επανεκκίνηση</button>
      </div>
    </div>
  );
}

export default TestRunPage;
