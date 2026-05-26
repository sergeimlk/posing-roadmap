import { useEffect, useRef } from 'react';
import useMagnetic from '../hooks/useMagnetic';

export default function Navbar() {
  // Add premium magnetic effect to navbar items on desktop
  const link1Ref = useMagnetic({ strength: 0.25, radius: 40 });
  const link2Ref = useMagnetic({ strength: 0.25, radius: 40 });
  const link3Ref = useMagnetic({ strength: 0.25, radius: 40 });
  const ctaRef = useMagnetic({ strength: 0.25, radius: 40 });

  return (
    <nav id="navbar" className="navbar">
      <div className="nav-container">
        <a href="/" className="nav-brand-link">
          <div className="nav-brand">
            <img 
              src="/p.png" 
              alt="Posing Empire Logo" 
              className="nav-logo-img" 
              draggable="false" 
              style={{ pointerEvents: 'none', userSelect: 'none' }} 
            />
            <span className="nav-brand-text">POSING EMPIRE</span>
          </div>
        </a>
        
        <div className="nav-right">
          {/* Roadmap Personnalisée */}
          <a
            ref={link1Ref}
            href="/"
            className="nav-circle-link nav-link-roadmap"
            title="Roadmap Personnalisée"
          >
            <span className="nav-link-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="6" cy="19" r="3" />
                <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" />
                <circle cx="18" cy="5" r="3" />
              </svg>
            </span>
            <span className="nav-link-text">Roadmap Personnalisée</span>
          </a>

          {/* Bilan Hebdomadaire */}
          <a
            ref={link2Ref}
            href="/?mode=bilan"
            className="nav-circle-link nav-link-bilan"
            title="Bilan Hebdomadaire"
          >
            <span className="nav-link-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </span>
            <span className="nav-link-text">Bilan Hebdomadaire</span>
          </a>

          {/* Labo d'Effets (Sandbox) */}
          <a
            ref={link3Ref}
            href="/?mode=sandbox"
            className="nav-circle-link nav-link-sandbox"
            title="Labo d'Effets"
          >
            <span className="nav-link-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16.3 11.3L12 3H12L7.7 11.3a6 6 0 1 0 8.6 0z" />
                <path d="M9 15h6" />
                <path d="M8 3h8" />
              </svg>
            </span>
            <span className="nav-link-text">Labo d'Effets</span>
          </a>

          {/* Rejoindre Skool */}
          <a
            ref={ctaRef}
            href="https://www.skool.com/posing-empire-groupe-prive-6566"
            className="nav-cta-btn nav-skool-btn"
            target="_blank"
            rel="noopener noreferrer"
            title="Rejoindre Skool"
          >
            <span className="skool-desktop-text">Rejoindre Skool</span>
            <span className="skool-mobile-logo" aria-hidden="true">
              <span className="s">s</span>
              <span className="k">k</span>
              <span className="o1">o</span>
              <span className="o2">o</span>
              <span className="l">l</span>
            </span>
          </a>
        </div>
      </div>
    </nav>
  );
}
