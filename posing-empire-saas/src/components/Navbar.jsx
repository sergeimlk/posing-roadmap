import useMagnetic from '../hooks/useMagnetic';
import Dock from './reactbits/Dock';
import ShinyText from './reactbits/ShinyText';

export default function Navbar() {
  // Add premium magnetic effect to navbar items on desktop
  const link1Ref = useMagnetic({ strength: 0.25, radius: 40 });
  const link2Ref = useMagnetic({ strength: 0.25, radius: 40 });
  const ctaRef = useMagnetic({ strength: 0.25, radius: 40 });

  const dockItems = [
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="url(#gold-grad-nav-roadmap)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 4px rgba(212, 168, 67, 0.45))' }}>
          <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
          <line x1="9" y1="3" x2="9" y2="18" />
          <line x1="15" y1="6" x2="15" y2="21" />
        </svg>
      ),
      label: "Roadmap d'Onboarding",
      onClick: () => { window.location.href = '/'; }
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="url(#gold-grad-nav-bilan)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 4px rgba(212, 168, 67, 0.45))' }}>
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
          <polyline points="17 6 23 6 23 12" />
        </svg>
      ),
      label: 'Bilan Hebdo',
      onClick: () => { window.location.href = '/?mode=bilan'; }
    }
  ];

  return (
    <nav id="navbar" className="navbar">
      {/* Global SVG Gradients Definition for the Navbar */}
      <svg style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }} aria-hidden="true">
        <defs>
          <linearGradient id="gold-grad-nav-roadmap" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFD54F" />
            <stop offset="30%" stopColor="#D4A843" />
            <stop offset="70%" stopColor="#B8942D" />
            <stop offset="100%" stopColor="#FFD54F" />
          </linearGradient>
          <linearGradient id="gold-grad-nav-bilan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFD54F" />
            <stop offset="30%" stopColor="#D4A843" />
            <stop offset="70%" stopColor="#B8942D" />
            <stop offset="100%" stopColor="#FFD54F" />
          </linearGradient>
        </defs>
      </svg>

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
            <ShinyText
              text="POSING EMPIRE"
              speed={3}
              delay={0.5}
              color="#a5a5a5"
              shineColor="#ffffff"
              spread={120}
              className="nav-brand-text"
            />
          </div>
        </a>
        
        <div className="nav-right">
          {/* Roadmap Personnalisée (Mobile Only) */}
          <a
            ref={link1Ref}
            href="/"
            className="nav-circle-link nav-link-roadmap mobile-only-link"
            title="Roadmap d'Onboarding"
          >
            <span className="nav-link-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="url(#gold-grad-nav-roadmap)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 4px rgba(212, 168, 67, 0.45))' }}>
                <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                <line x1="9" y1="3" x2="9" y2="18" />
                <line x1="15" y1="6" x2="15" y2="21" />
              </svg>
            </span>
            <span className="nav-link-text">Roadmap d'Onboarding</span>
          </a>

          {/* Bilan Hebdomadaire (Mobile Only) */}
          <a
            ref={link2Ref}
            href="/?mode=bilan"
            className="nav-circle-link nav-link-bilan mobile-only-link"
            title="Bilan Hebdomadaire"
          >
            <span className="nav-link-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="url(#gold-grad-nav-bilan)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 4px rgba(212, 168, 67, 0.45))' }}>
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                <polyline points="17 6 23 6 23 12" />
              </svg>
            </span>
            <span className="nav-link-text">Bilan Hebdomadaire</span>
          </a>

          {/* Desktop navbar dock */}
          <div className="nav-dock-container">
            <Dock 
              items={dockItems}
              panelHeight={52}
              baseItemSize={40}
              magnification={44}
              distance={120}
              className="navbar-dock"
              fixedHeight={true}
            />
          </div>

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
