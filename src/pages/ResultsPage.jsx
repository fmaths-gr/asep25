import React from 'react';

// === ResultsPage component: Εμφάνιση αποτελεσμάτων και ανάλυση λανθασμένων ===
function ResultsPage({ questions, userAnswers, onRestart }) {
  // --- Συνολικός αριθμός ερωτήσεων ---
  const totalQuestions = questions.length;

  // --- Υπολογισμός σωστών απαντήσεων ---
  const correctCount = userAnswers.reduce((count, answer, i) => {
    return questions[i].answer === answer ? count + 1 : count;
  }, 0);

  // --- Ποσοστό επιτυχίας σε ποσοστό επί τοις εκατό ---
  const successRate = Math.round((correctCount / totalQuestions) * 100);

  // --- Φιλτράρισμα των λανθασμένων ερωτήσεων για εμφάνιση ---
  const wrongAnswers = questions
    .map((q, i) => ({ ...q, userAnswer: userAnswers[i] }))
    .filter((q) => q.answer !== q.userAnswer);

  return (
    <div className="start-container">
      {/* Τίτλος */}
      <h2 className="title">🎯 Αποτελέσματα</h2>

      {/* Ποσοστό επιτυχίας */}
      <p className="results-summary">
        Ποσοστό Επιτυχίας: <strong>&nbsp;{successRate}%</strong>
      </p>

      {/* Ανάλυση λανθασμένων απαντήσεων */}
      {wrongAnswers.length > 0 && (
        <>
          <h3 className="wrong-title">
            💣 {wrongAnswers.length} Λανθασμένες Απαντήσεις
          </h3>

          {wrongAnswers.map((q, index) => (
            <div key={index} className="wrong-block">
              {/* Πληροφορίες ενότητας */}
              <p className="question-meta">
                {q.section}, ερώτ. {q.question_no}
              </p>

              {/* Εκφώνηση */}
              <p className="results-question">{q.question}</p>

              {/* Πίνακας (αν υπάρχει) */}
              {q.table && (
                <table className="question-table">
                  <tbody>
                    {q.table.map((row, rowIndex) => (
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
              {q.table && q.sub_question && (
                <p className="results-question">{q.sub_question}</p>
              )}

              {/* Επιλογές απάντησης */}
              <ul>
                {q.options.map((opt, i) => (
                  <li
                    key={i}
                    className={
                      opt === q.answer
                        ? 'answer-correct'
                        : opt === q.userAnswer && opt !== q.answer
                        ? 'answer-wrong'
                        : ''
                    }
                  >
                    {opt}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </>
      )}

      {/* Κουμπί επανεκκίνησης */}
      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <button onClick={onRestart}>Επανεκκίνηση</button>
      </div>

      {/* Ενημερωτικό disclaimer */}
      <p className="asep-disclaimer">
        Οι ερωτήσεις που περιλαμβάνονται σε αυτή την εφαρμογή προέρχονται από το Μητρώο Θεμάτων του ΑΣΕΠ,
        όπως δημοσιεύθηκαν στο πλαίσιο της προκήρυξης 1Γ/2025. Η παρούσα εφαρμογή είναι ανεπίσημη και προορίζεται
        αποκλειστικά για εκπαιδευτική χρήση, χωρίς εμπορικό σκοπό.<br /><br /><br />
        Copyright © 2025 fMaths
        <span style={{ margin: '0 4px' }}>•</span>
        <span style={{ display: 'inline-block', marginBottom: '4px' }}>
          Εκπαιδευτική εφαρμογή
        </span><br />
        <a
          href="https://fmaths.gr/terms-of-use"
          target="_blank"
          rel="noopener"
          style={{ marginRight: '4px', textDecoration: 'none', color: '#0000EE' }}
        >
          Όροι Χρήσης
        </a>
        •
        <a
          href="https://fmaths.gr/privacy-policy"
          target="_blank"
          rel="noopener"
          style={{ marginLeft: '4px', textDecoration: 'none', color: '#0000EE' }}
        >
          Πολιτική Απορρήτου
        </a>
      </p>
    </div>
  );
}

export default ResultsPage;
