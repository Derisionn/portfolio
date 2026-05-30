import React, { useState, useEffect } from 'react';
import './Hero.css';

const ROLES = [
  "Architecting Agentic RAG Systems.",
  "Training Machine Learning Models.",
  "Building Scalable Backends.",
  "Crafting Premium Web Apps."
];

const Hero: React.FC = () => {
  const [text, setText] = useState('');
  const [roleIndex, setRoleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentRole = ROLES[roleIndex];
    const typingSpeed = isDeleting ? 30 : 60;
    
    if (!isDeleting && text === currentRole) {
      const timer = setTimeout(() => setIsDeleting(true), 2500);
      return () => clearTimeout(timer);
    }

    if (isDeleting && text === '') {
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % ROLES.length);
      return;
    }

    const timer = setTimeout(() => {
      setText(currentRole.substring(0, text.length + (isDeleting ? -1 : 1)));
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [text, isDeleting, roleIndex]);

  return (
    <section id="hero" className="hero-section">
      <div className="hero-content">
        <h2 className="greeting">Hello, I'm</h2>
        <h1 className="name">Harsh Vardhan</h1>
        <p className="subtitle">
          <span className="static-text">A Full-Stack ML Engineer passionate about </span>
          <br className="mobile-break" />
          <span className="dynamic-text">{text}</span><span className="typing-cursor">|</span>
        </p>
        <div className="cta-group">
          <a href="#projects" className="btn btn-primary">View Projects</a>
          <a href="/resume.pdf" className="btn btn-download" target="_blank" rel="noopener noreferrer" download>
            <span>Download Resume</span>
            <span style={{ fontSize: '1.2em' }}>↓</span>
          </a>
        </div>

        {/* Hero Stats */}
        <div className="hero-stats">
          <div className="stat-item">
            <span className="stat-num">2+</span>
            <span className="stat-label">INTERNSHIPS</span>
          </div>
          <div className="stat-item">
            <span className="stat-num">500+</span>
            <span className="stat-label">DSA PROBLEMS</span>
          </div>
          <div className="stat-item">
            <span className="stat-num">6+</span>
            <span className="stat-label">APPS SHIPPED</span>
          </div>
          <div className="stat-item">
            <span className="stat-num">1464</span>
            <span className="stat-label">CF RATING</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
