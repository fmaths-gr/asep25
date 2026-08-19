import { useEffect, useState } from 'react';
import { fisherYatesShuffle } from '../utils/shuffle';
import Disclaimer from '../components/Disclaimer';

// === Έλεγχος εγκυρότητας αριθμού ===
function validateQuestionCount(count, max) {
  const parsed = Number(count);
  if (
    isNaN(parsed) ||
    !Number.isInteger(parsed) ||
    parsed < 1 ||
    parsed > max
  ) {
    alert(`⚠️ Εισάγετε ακέραιο αριθμό από 1 έως ${max}.`);
    return null;
  }
  return parsed;
}

// === Ανώτερη βοηθητική για διαχείριση ελέγχου ===
function getValidatedQuestionCount(count, max, allChecked, onInvalid) {
  if (allChecked) return 'all';
  const parsed = validateQuestionCount(count, max);
  if (parsed === null) {
    onInvalid?.();
    return null;
  }
  return parsed;
}

// === StartPage component: Σελίδα επιλογών έναρξης του quiz ===
function StartPage({ onStart, questions }) {
  // --- Καταστάσεις επιλογών χρήστη ---
  const [questionCount, setQuestionCount] = useState('');
  const [allQuestionsChecked, setAllQuestionsChecked] = useState(false);
  const [selectedSections, setSelectedSections] = useState([]);
  const [selectAllSections, setSelectAllSections] = useState(false);

  // === Διαθέσιμες ενότητες ===
  const sections = [...new Set(questions.map((q) => q.section))];

  // === Εφέ συγχρονισμού ===

  // Αν επιλεγούν όλες οι ενότητες, καθαρίζει τις επιμέρους
  const handleSelectAllSections = (checked) => {
    setSelectAllSections(checked);
    if (checked) setSelectedSections([]);
  };

  // Εναλλαγή κατάστασης ανά ενότητα
  const handleSectionToggle = (section) => {
    setSelectedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  // Αν επιλεγούν όλες οι ενότητες, καταργεί το checkbox για όλες τις ερωτήσεις
  useEffect(() => {
    if (selectAllSections) setAllQuestionsChecked(false);
  }, [selectAllSections]);

  // Αν επιλεγούν όλες οι ερωτήσεις, καθαρίζει το input αριθμού
  useEffect(() => {
    if (allQuestionsChecked) setQuestionCount('');
  }, [allQuestionsChecked]);

  // Αν δεν έχει επιλεγεί τίποτα, καθαρίζει το πλήθος
  const noSectionsSelected = selectedSections.length === 0 && !selectAllSections;
  useEffect(() => {
    if (noSectionsSelected) setQuestionCount('');
  }, [noSectionsSelected]);

  // Αν δεν έχει επιλεγεί τίποτα, καθαρίζει και το checkbox "Όλες"
  useEffect(() => {
    if (noSectionsSelected) setAllQuestionsChecked(false);
  }, [noSectionsSelected]);

  // === Υπολογισμός ενεργοποίησης input/κουμπιού ===
  const disableQuestionInput = allQuestionsChecked;
  const disableStartButton = noSectionsSelected || (!questionCount && !allQuestionsChecked);

  // === Διαχείριση εκκίνησης του quiz ===
  const handleStart = () => {
    if (noSectionsSelected) return;

    const availableQuestions = questions.filter((q) =>
      selectAllSections || selectedSections.includes(q.section)
    );

    const parsedCount = getValidatedQuestionCount(
      questionCount,
      availableQuestions.length,
      allQuestionsChecked,
      () => setQuestionCount('')
    );

    if (parsedCount === null) return;

    // Τυχαιοποίηση σειράς ερωτήσεων και επιλογών
    const shuffled = fisherYatesShuffle(availableQuestions);
    const selected = allQuestionsChecked
      ? shuffled
      : shuffled.slice(0, parseInt(questionCount, 10));

    const randomizedOptions = selected.map((q) => ({
      ...q,
      options: fisherYatesShuffle(q.options),
    }));

    // Κλήση onStart με τις επιλογές και τις ερωτήσεις
    onStart(
      {
        selectedSections,
        allSectionsSelected: selectAllSections,
        numberOfQuestions: parsedCount,
      },
      randomizedOptions
    );
  };

  // === Διαχείριση εξάσκησης ===
  const handlePracticeStart = () => {
    if (noSectionsSelected) return;

    const availableQuestions = questions.filter((q) =>
      selectAllSections || selectedSections.includes(q.section)
    );

    const parsedCount = getValidatedQuestionCount(
      questionCount,
      availableQuestions.length,
      allQuestionsChecked,
      () => setQuestionCount('')
    );

    if (parsedCount === null) return;

    const shuffled = fisherYatesShuffle(availableQuestions);
    const selected = allQuestionsChecked
      ? shuffled
      : shuffled.slice(0, parseInt(questionCount, 10));

    const randomizedOptions = selected.map((q) => ({
      ...q,
      options: fisherYatesShuffle(q.options),
    }));

    // Κλήση onStart με τις επιλογές και τις ερωτήσεις (σε λειτουργία εξάσκησης)
    onStart(
      {
        selectedSections,
        allSectionsSelected: selectAllSections,
        numberOfQuestions: parsedCount,
        practiceMode: true,
      },
      randomizedOptions
    );
  };

  // === Βοηθητικές τιμές ===
  const availableQuestions = questions.filter((q) =>
    selectAllSections ? true : selectedSections.includes(q.section)
  );
  const availableCount = availableQuestions.length;

  // === Απόδοση στοιχείων UI ===
  return (
    <div className="start-container">
      <h2 className="title">✅ Επιλέξτε!</h2>

      {/* Επιλογή ενοτήτων */}
      <div className="start-field">
        <label>Ενότητες</label>
        <div className="section-options">
          <label>
            <input
              type="checkbox"
              checked={selectAllSections}
              onChange={(e) => handleSelectAllSections(e.target.checked)}
            />
            Όλες
          </label>
          {sections.map((sec, i) => (
            <label key={i}>
              <input
                type="checkbox"
                checked={selectedSections.includes(sec)}
                disabled={selectAllSections}
                onChange={() => handleSectionToggle(sec)}
              />
              {sec}
            </label>
          ))}
        </div>
      </div>

      {/* Επιλογή πλήθους */}
      <div className="start-field">
        <label htmlFor="questionCount">Πλήθος ερωτήσεων</label>
        <div className="question-input">
          <input
            id="questionCount"
            type="number"
            min="1"
            max={availableCount}
            disabled={disableQuestionInput || noSectionsSelected}
            value={questionCount}
            onChange={(e) => setQuestionCount(e.target.value)}
            className="narrow-input"
          />
          <label className="checkbox-inline">
            <input
              type="checkbox"
              checked={allQuestionsChecked}
              disabled={noSectionsSelected}
              onChange={(e) => setAllQuestionsChecked(e.target.checked)}
            />
            Όλες
          </label>
        </div>
        <p className="question-hint">
          Διαθέσιμες: {noSectionsSelected ? 0 : `1 έως ${availableCount}`}
        </p>
      </div>

      {/* Κουμπί έναρξης */}
      <button onClick={handleStart} disabled={disableStartButton}>
        Προσομοίωση
      </button>
      <p className="mode-description">
        Απαντήστε στις ερωτήσεις και στο τέλος<br/>
        δείτε τα λάθη και το σκορ σας.
      </p>
      {/* Κουμπί εξάσκησης */}
      <button onClick={handlePracticeStart} disabled={disableStartButton}>
        Εξάσκηση
      </button>
      <p className="mode-description">
        Μελετήστε τις ερωτήσεις και ελέγξτε άμεσα<br/>
        ποια είναι η σωστή απάντηση.
      </p>

      {/* Ενημερωτικό disclaimer */}
      <Disclaimer />
    </div>
  );
}

export default StartPage;
