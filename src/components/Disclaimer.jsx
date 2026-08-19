// === Disclaimer component: Ενημερωτικό κείμενο εφαρμογής ===
function Disclaimer() {
  return (
    <p className="asep-disclaimer">
      Οι ερωτήσεις που περιλαμβάνονται σε αυτή την εφαρμογή προέρχονται από το
      Μητρώο Θεμάτων Γνώσεων του ΑΣΕΠ. Η παρούσα εφαρμογή είναι ανεπίσημη και
      προορίζεται αποκλειστικά για εκπαιδευτική χρήση, χωρίς εμπορικό σκοπό.
      <br /><br /><br />
      Copyright © {new Date().getFullYear()} fMaths
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
  );
}

export default Disclaimer;
