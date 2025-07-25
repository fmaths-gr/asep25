import { useEffect, useState } from 'react';

// === Τυχαιοποίηση τύπου Fisher–Yates ===
function fisherYatesShuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

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
  // --- Βασικές επιλογές ---
  const collections = ['1', '2', '3'];

  // --- Καταστάσεις επιλογών χρήστη ---
  const [selectedCollection, setSelectedCollection] = useState('1');
  const [questionCount, setQuestionCount] = useState('');
  const [allQuestionsChecked, setAllQuestionsChecked] = useState(false);
  const [selectedSections, setSelectedSections] = useState([]);
  const [selectAllSections, setSelectAllSections] = useState(false);

  // === Ερωτήσεις της επιλεγμένης φάσης ===
  const filteredQuestions = questions.filter(
    (q) => q.collection === parseInt(selectedCollection)
  );

  const sections = [...new Set(filteredQuestions.map((q) => q.section))];

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

  // Όταν αλλάζει η φάση, καθαρίζονται οι επιλογές
  useEffect(() => {
    setSelectedSections([]);
    setSelectAllSections(false);
    setAllQuestionsChecked(false);
    setQuestionCount('');
  }, [selectedCollection]);

  // === Υπολογισμός ενεργοποίησης input/κουμπιού ===
  const disableQuestionInput = allQuestionsChecked;
  const disableStartButton = noSectionsSelected || (!questionCount && !allQuestionsChecked);

  // === Διαχείριση εκκίνησης του quiz ===
  const handleStart = () => {
    if (noSectionsSelected) return;

    const collectionValue = parseInt(selectedCollection, 10);
    const availableQuestions = questions.filter((q) => {
      const phaseMatch = q.collection === collectionValue;
      const sectionMatch = selectAllSections || selectedSections.includes(q.section);
      return phaseMatch && sectionMatch;
    });

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
        collection: selectedCollection,
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

    const collectionValue = parseInt(selectedCollection, 10);
    const availableQuestions = questions.filter((q) => {
      const phaseMatch = q.collection === collectionValue;
      const sectionMatch = selectAllSections || selectedSections.includes(q.section);
      return phaseMatch && sectionMatch;
    });

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
        collection: selectedCollection,
        selectedSections,
        allSectionsSelected: selectAllSections,
        numberOfQuestions: parsedCount,
        practiceMode: true,
      },
      randomizedOptions
    );
  };

  // === Βοηθητικές τιμές ===
  const availableQuestions = filteredQuestions.filter((q) =>
    selectAllSections ? true : selectedSections.includes(q.section)
  );
  const availableCount = availableQuestions.length;

  // === Απόδοση στοιχείων UI ===
  return (
    <div className="start-container">
      <h2 className="title">✅ Επιλέξτε!</h2>

      {/* Επιλογή φάσης */}
      <div className="start-field">
        <label htmlFor="collection">Φάση</label>
        <div className="box">
          <select
            id="collection"
            value={selectedCollection}
            onChange={(e) => setSelectedCollection(e.target.value)}
            className="narrow-input"
          >
            {collections.map((col, i) => {
              const isDisabled = false; // = col === '0'
              return (
                <option
                  key={i}
                  value={col}
                  disabled={isDisabled}
                  className={isDisabled ? 'disabled-option' : ''}
                >
                  {col}
                </option>
              );
            })}
          </select>
          <span className="asep">ΑΣΕΠ 1Γ/2025</span>
        </div>
      </div>

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

export default StartPage;
