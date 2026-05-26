import React, { useState } from 'react';
import ShinyText from './reactbits/ShinyText';
import DecryptedText from './reactbits/DecryptedText';
import SplitText from './reactbits/SplitText';
import SpotlightCard from './reactbits/SpotlightCard';
import Squares from './reactbits/Squares';

export default function SandboxScreen({ onBack }) {
  const [activeTab, setActiveTab] = useState('shiny');
  
  // States for live tweaking
  const [shinySpeed, setShinySpeed] = useState(5);
  const [scrambleSpeed, setScrambleSpeed] = useState(40);
  const [splitDelay, setSplitDelay] = useState(0.05);
  const [glowSize, setGlowSize] = useState(350);
  const [squareSize, setSquareSize] = useState(45);

  const tabs = [
    { id: 'shiny', name: '1. Shiny Text', icon: '✨' },
    { id: 'decrypted', name: '2. Decrypted Text', icon: '🕵️' },
    { id: 'split', name: '3. Split Text', icon: '🎬' },
    { id: 'spotlight', name: '4. Spotlight Card', icon: '🔦' },
    { id: 'squares', name: '5. Squares Background', icon: '🏁' },
  ];

  return (
    <main className="screen active sandbox-screen" style={{ minHeight: '100vh', color: '#fff', padding: '100px 24px 60px' }}>
      <div className="form-wrapper" style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Header */}
        <div className="form-header" style={{ marginBottom: '2.5rem' }}>
          <div className="badge-pulse">
            <span className="pulse-dot"></span>
            <span>ReactBits Animation Laboratory</span>
          </div>
          <h1 className="form-title">
            <span className="text-white-gradient">LABO D'EFFETS </span>
            <span className="text-gold-gradient">PREMIUM</span>
          </h1>
          <p className="form-subtitle">
            Teste les 5 animations ci-dessous pour choisir celles que nous allons garder pour Posing Empire.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="sandbox-tabs" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`selector-btn selector-btn-sm ${activeTab === tab.id ? 'selected' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Live Lab Card */}
        <div className="form-card" style={{ padding: '32px', position: 'relative', overflow: 'hidden', minHeight: '380px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div className="form-gold-line"></div>

          {/* BACKGROUND ANIMATION DEMO CONTAINER */}
          {activeTab === 'squares' && (
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, opacity: 0.85 }}>
              <Squares squareSize={squareSize} />
            </div>
          )}

          {/* Interactive Screen Content */}
          <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            
            {activeTab === 'shiny' && (
              <div style={{ padding: '40px 20px' }}>
                <h2 style={{ fontSize: '2.8rem', fontWeight: 800, letterSpacing: '0.02em', margin: '0 0 16px 0' }}>
                  <ShinyText text="POSING EMPIRE" speed={shinySpeed} />
                </h2>
                <p style={{ color: '#aaa', maxWidth: '600px', fontSize: '0.95rem' }}>
                  Un reflet métallique doré balaye élégamment le titre. Très discret, fluide et sophistiqué.
                </p>
              </div>
            )}

            {activeTab === 'decrypted' && (
              <div style={{ padding: '40px 20px' }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0 0 16px 0', minHeight: '60px' }}>
                  <span className="text-gold-gradient">
                    <DecryptedText text="ROADMAP ACCÈS AUTORISÉ" speed={scrambleSpeed} useHover={false} />
                  </span>
                </h2>
                <p style={{ color: '#aaa', margin: '10px 0 25px 0' }}>
                  Effet de décryptage matriciel instantané au chargement. Survole le texte ci-dessous pour tester le déclenchement au survol :
                </p>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 24px', borderRadius: '8px', border: '1px dashed rgba(212,168,67,0.3)', display: 'inline-block' }}>
                  <DecryptedText text="SURVOLE-MOI POUR DECRYPTER" speed={scrambleSpeed} useHover={true} className="text-gold-gradient" />
                </div>
              </div>
            )}

            {activeTab === 'split' && (
              <div style={{ padding: '40px 20px' }}>
                <h2 style={{ fontSize: '2.4rem', fontWeight: 800, margin: '0 0 16px 0', minHeight: '60px', color: '#fff' }}>
                  <SplitText key={splitDelay} text="Génération de ta roadmap sur-mesure..." delay={splitDelay} />
                </h2>
                <p style={{ color: '#aaa', maxWidth: '600px', fontSize: '0.95rem' }}>
                  Chaque lettre apparaît de manière désynchronisée avec un glissement vertical amorti. Idéal pour l'écran de chargement ou les titres de transition.
                </p>
              </div>
            )}

            {activeTab === 'spotlight' && (
              <div style={{ width: '100%', maxWidth: '500px', padding: '10px' }}>
                <SpotlightCard glowSize={glowSize}>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <span style={{ background: 'rgba(212,168,67,0.15)', color: '#D4A843', padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                        Carte Interactive
                      </span>
                      <span>💡 Bouge ton curseur</span>
                    </div>
                    <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '8px' }}>Posing Pro Coaching</h3>
                    <p style={{ color: '#aaa', fontSize: '0.875rem', lineHeight: 1.5, margin: 0 }}>
                      Survole cette carte : un halo de lumière doré suivra ton pointeur précisément à travers la vitre givrée.
                    </p>
                  </div>
                </SpotlightCard>
              </div>
            )}

            {activeTab === 'squares' && (
              <div style={{ padding: '40px 20px', background: 'rgba(10,10,10,0.85)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', maxWidth: '600px' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#D4A843', margin: '0 0 10px 0' }}>Grille de Fonds Interactive</h2>
                <p style={{ color: '#ccc', fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>
                  Bouge ton curseur sur la carte : les lignes de la grille s'illuminent sous le pointeur, complétées par des micro-scintillements aléatoires de type étoiles.
                </p>
              </div>
            )}

          </div>

          {/* Control parameters panel */}
          <div style={{ position: 'relative', zIndex: 1, marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
            
            {/* Tweaker controls */}
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', flex: 1, textAlign: 'left' }}>
              {activeTab === 'shiny' && (
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <label style={{ fontSize: '0.8rem', color: '#888', display: 'block', marginBottom: '6px' }}>
                    Vitesse du balayage : {shinySpeed}s (plus petit = plus rapide)
                  </label>
                  <input 
                    type="range" min="1" max="15" value={shinySpeed} 
                    onChange={(e) => setShinySpeed(Number(e.target.value))} 
                    style={{ width: '100%', accentColor: '#D4A843' }} 
                  />
                </div>
              )}
              {activeTab === 'decrypted' && (
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <label style={{ fontSize: '0.8rem', color: '#888', display: 'block', marginBottom: '6px' }}>
                    Intervalle de décryptage : {scrambleSpeed}ms (plus petit = plus rapide)
                  </label>
                  <input 
                    type="range" min="10" max="150" value={scrambleSpeed} 
                    onChange={(e) => setScrambleSpeed(Number(e.target.value))} 
                    style={{ width: '100%', accentColor: '#D4A843' }} 
                  />
                </div>
              )}
              {activeTab === 'split' && (
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <label style={{ fontSize: '0.8rem', color: '#888', display: 'block', marginBottom: '6px' }}>
                    Délai entre chaque lettre : {splitDelay}s
                  </label>
                  <input 
                    type="range" min="0.01" max="0.2" step="0.01" value={splitDelay} 
                    onChange={(e) => setSplitDelay(Number(e.target.value))} 
                    style={{ width: '100%', accentColor: '#D4A843' }} 
                  />
                </div>
              )}
              {activeTab === 'spotlight' && (
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <label style={{ fontSize: '0.8rem', color: '#888', display: 'block', marginBottom: '6px' }}>
                    Diamètre du halo : {glowSize}px
                  </label>
                  <input 
                    type="range" min="150" max="600" value={glowSize} 
                    onChange={(e) => setGlowSize(Number(e.target.value))} 
                    style={{ width: '100%', accentColor: '#D4A843' }} 
                  />
                </div>
              )}
              {activeTab === 'squares' && (
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <label style={{ fontSize: '0.8rem', color: '#888', display: 'block', marginBottom: '6px' }}>
                    Taille des carrés : {squareSize}px
                  </label>
                  <input 
                    type="range" min="20" max="100" value={squareSize} 
                    onChange={(e) => setSquareSize(Number(e.target.value))} 
                    style={{ width: '100%', accentColor: '#D4A843' }} 
                  />
                </div>
              )}
            </div>

            {/* Back action */}
            <div>
              <button
                type="button"
                className="btn-secondary-gold"
                onClick={onBack}
                style={{ padding: '10px 24px' }}
              >
                <span>Retour au questionnaire</span>
              </button>
            </div>
          </div>

        </div>

        {/* Suggestion context */}
        <div style={{ marginTop: '1.5rem', background: 'rgba(212,168,67,0.04)', border: '1px solid rgba(212,168,67,0.12)', borderRadius: '12px', padding: '20px', textAlign: 'left' }}>
          <h4 style={{ color: '#D4A843', margin: '0 0 8px 0', fontSize: '0.95rem' }}>💡 Où pouvons-nous utiliser ces effets ?</h4>
          <ul style={{ color: '#aaa', margin: 0, paddingLeft: '20px', fontSize: '0.875rem', lineHeight: '1.6' }}>
            {activeTab === 'shiny' && (
              <>
                <li>Sur le titre principal « TA ROADMAP PERSONNALISÉE » pour le faire scintiller discrètement.</li>
                <li>Sur le texte intérieur du bouton d'action principal de soumission pour le rendre encore plus attractif.</li>
              </>
            )}
            {activeTab === 'decrypted' && (
              <>
                <li>Lors de la révélation du titre de la roadmap sur l'écran final, pour donner un effet « Calcul en cours... Accès débloqué ».</li>
                <li>Au survol des mois verrouillés sur la roadmap.</li>
              </>
            )}
            {activeTab === 'split' && (
              <>
                <li>Pour l'apparition du titre principal lors du premier chargement de la page.</li>
                <li>Sur le titre de l'écran d'attente/loading pour créer une attente premium animée.</li>
              </>
            )}
            {activeTab === 'spotlight' && (
              <>
                <li>Pour les cartes d'objectifs, de difficultés physiques ou de zones de mobilité.</li>
                <li>Pour donner un effet premium futuriste à la carte principale de formulaire (`.form-card`).</li>
              </>
            )}
            {activeTab === 'squares' && (
              <>
                <li>Comme arrière-plan global de l'application à la place de la grille simple actuelle.</li>
                <li>Derrière l'écran d'attente (loading) ou de sélection de mode.</li>
              </>
            )}
          </ul>
        </div>

      </div>
    </main>
  );
}
