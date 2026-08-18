import json
import sys
from pathlib import Path


# ============================================================
# Paths
# ============================================================

PROJECT_ROOT = Path(__file__).resolve().parent.parent
SOURCE_DIR = PROJECT_ROOT / "data-source"
OUTPUT_FILE = PROJECT_ROOT / "src" / "data" / "questions.json"


# ============================================================
# Sections
# ============================================================

SECTIONS = {
  1: "Συνταγματικό Δίκαιο",
  2: "Διοικητικό Δίκαιο",
  3: "Ευρωπαϊκοί Θεσμοί και Δίκαιο",
  4: "Οικονομικές Επιστήμες",
  5: "Πληροφορική και Ψηφιακή Διακυβέρνηση",
  6: "Σύγχρονη Ιστορία της Ελλάδος (1875 έως σήμερα)",
  7: "Κώδικας Κατάστασης Πολιτικών Διοικητικών Υπαλλήλων και Υπαλλήλων Ν.Π.Δ.Δ.",
  8: "Γενικός Κανονισμός Προστασίας Δεδομένων (GDPR)",
  9: "Διοίκηση Επιχειρήσεων και Οργανισμών",
  10: "Διοίκηση Ανθρώπινου Δυναμικού",
  11: "Κώδικας Συμπεριφοράς Δημοσίων Υπαλλήλων",
}


# ============================================================
# Validation helpers
# ============================================================

REQUIRED_FIELDS = {
  "section",
  "question_no",
  "id",
  "question",
  "options",
  "answer",
}


def load_json(file_path):
  """Load a JSON file and return its contents."""
  try:
    with file_path.open("r", encoding="utf-8") as file:
      return json.load(file)
  except json.JSONDecodeError as exc:
    raise ValueError(
      f"Μη έγκυρο JSON στο {file_path.name}: "
      f"γραμμή {exc.lineno}, στήλη {exc.colno}"
    ) from exc


def validate_question(question, section_number, expected_section):
  """Validate one question and return a list of errors."""
  errors = []

  if not isinstance(question, dict):
    return ["Η εγγραφή δεν είναι JSON object."]

  missing_fields = REQUIRED_FIELDS - question.keys()

  if missing_fields:
    errors.append(
      f"Λείπουν πεδία: {', '.join(sorted(missing_fields))}"
    )
    return errors

  question_no = question["question_no"]
  question_id = question["id"]

  # Section
  if question["section"] != expected_section:
    errors.append(
      "Λάθος section: "
      f'βρέθηκε "{question["section"]}", '
      f'αναμενόταν "{expected_section}"'
    )

  # question_no
  if not isinstance(question_no, int) or isinstance(question_no, bool):
    errors.append("Το question_no πρέπει να είναι ακέραιος.")
  elif question_no < 1:
    errors.append("Το question_no πρέπει να είναι >= 1.")

  # id
  if isinstance(question_no, int) and not isinstance(question_no, bool):
    expected_id = f"{section_number}-{question_no}"

    if question_id != expected_id:
      errors.append(
        f'Λάθος id: βρέθηκε "{question_id}", '
        f'αναμενόταν "{expected_id}"'
      )

  # Question text
  if not isinstance(question["question"], str) or not question["question"].strip():
    errors.append("Το question είναι κενό ή δεν είναι string.")

  # Options
  options = question["options"]

  if not isinstance(options, list):
    errors.append("Το options πρέπει να είναι λίστα.")
  else:
    if len(options) != 4:
      errors.append(
        f"Πρέπει να υπάρχουν ακριβώς 4 επιλογές "
        f"(βρέθηκαν {len(options)})."
      )

    for index, option in enumerate(options, start=1):
      if not isinstance(option, str) or not option.strip():
        errors.append(
          f"Η επιλογή {index} είναι κενή ή δεν είναι string."
        )

    if len(options) != len(set(options)):
      errors.append("Υπάρχουν διπλές επιλογές στην ίδια ερώτηση.")

  # Answer
  answer = question["answer"]

  if not isinstance(answer, str) or not answer.strip():
    errors.append("Το answer είναι κενό ή δεν είναι string.")
  elif isinstance(options, list) and answer not in options:
    errors.append("Η σωστή απάντηση δεν υπάρχει ακριβώς μέσα στα options.")

  return errors


# ============================================================
# Main
# ============================================================

def main():
  all_questions = []
  all_ids = set()

  errors = []

  print("Έλεγχος αρχείων ερωτήσεων")
  print("=" * 60)

  for section_number, expected_section in SECTIONS.items():
    file_path = SOURCE_DIR / f"section_{section_number:02d}.json"

    if not file_path.exists():
      errors.append(f"{file_path.name}: Το αρχείο δεν βρέθηκε.")
      continue

    try:
      questions = load_json(file_path)
    except ValueError as exc:
      errors.append(str(exc))
      continue

    if not isinstance(questions, list):
      errors.append(
        f"{file_path.name}: Το ανώτερο επίπεδο του JSON "
        "πρέπει να είναι λίστα."
      )
      continue

    print(
      f"{file_path.name}: "
      f"{len(questions)} ερωτήσεις — {expected_section}"
    )

    question_numbers = []

    for position, question in enumerate(questions, start=1):
      question_errors = validate_question(
        question,
        section_number,
        expected_section,
      )

      question_id = (
        question.get("id", f"θέση {position}")
        if isinstance(question, dict)
        else f"θέση {position}"
      )

      for error in question_errors:
        errors.append(
          f"{file_path.name} | {question_id}: {error}"
        )

      if not isinstance(question, dict):
        continue

      # Global ID uniqueness
      if "id" in question:
        if question["id"] in all_ids:
          errors.append(
            f'{file_path.name} | {question["id"]}: '
            "Διπλό id."
          )
        else:
          all_ids.add(question["id"])

      # question_no sequence
      if (
        isinstance(question.get("question_no"), int)
        and not isinstance(question.get("question_no"), bool)
      ):
        question_numbers.append(question["question_no"])

    # Check continuous numbering
    expected_numbers = list(range(1, len(questions) + 1))

    if question_numbers != expected_numbers:
      errors.append(
        f"{file_path.name}: "
        "Η αρίθμηση question_no δεν είναι συνεχόμενη "
        f"από 1 έως {len(questions)}."
      )

    all_questions.extend(questions)

  print("=" * 60)

  # ==============================
  # Stop if validation failed
  # ==============================

  if errors:
    print(f"\nΑΠΟΤΥΧΙΑ VALIDATION — {len(errors)} πρόβλημα/προβλήματα:\n")

    for error in errors:
      print(f"✗ {error}")

    print(
      "\nΤο src/data/questions.json ΔΕΝ δημιουργήθηκε."
    )

    sys.exit(1)

  # ==============================
  # Generate combined JSON
  # ==============================

  OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)

  with OUTPUT_FILE.open("w", encoding="utf-8") as file:
    json.dump(
      all_questions,
      file,
      ensure_ascii=False,
      indent=2,
    )

  print("\nVALIDATION ΕΠΙΤΥΧΕΣ")
  print(f"✓ Ενότητες: {len(SECTIONS)}")
  print(f"✓ Συνολικές ερωτήσεις: {len(all_questions)}")
  print(f"✓ Μοναδικά IDs: {len(all_ids)}")
  print("✓ Κάθε ερώτηση έχει 4 επιλογές")
  print("✓ Κάθε answer υπάρχει στα options")
  print("✓ Η αρίθμηση των ενοτήτων είναι συνεπής")
  print("✓ Η αρίθμηση των ερωτήσεων είναι συνεχόμενη")
  print(f"\n✓ Δημιουργήθηκε: {OUTPUT_FILE}")


if __name__ == "__main__":
  main()
