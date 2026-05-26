export default function Navbar() {
  return (
    <nav id="navbar" className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <img src="/p.png" alt="Posing Empire Logo" className="nav-logo-img" draggable="false" style={{ pointerEvents: 'none', userSelect: 'none' }} />
          <span className="nav-brand-text">POSING EMPIRE</span>
        </div>
        <div className="nav-right">
          <a
            href="/"
            className="nav-link"
          >
            Roadmap Personnalisée
          </a>
          <a
            href="/?mode=bilan"
            className="nav-link"
          >
            Bilan Hebdomadaire
          </a>
          <a
            href="https://www.skool.com/posing-empire-groupe-prive-6566"
            className="nav-cta-btn"
            target="_blank"
            rel="noopener noreferrer"
          >
            Rejoindre Skool
          </a>
        </div>
      </div>
    </nav>
  );
}
