import React from 'react';
import './Hero.css';

const Hero: React.FC = () => {
  return (
    <section id="hero" className="hero-section">
      <div className="hero-content">
        <h2 className="greeting">Hello, I'm</h2>
        <h1 className="name">Harsh Vardhan</h1>
        <p className="subtitle">
          A passionate developer building premium, highly-interactive, and scalable web applications.
          Let's create something amazing together.
        </p>
        <div className="cta-group">
          <a href="#projects" className="btn btn-primary">View Projects</a>
          <a href="/resume.pdf" className="btn btn-download" target="_blank" rel="noopener noreferrer" download>
            <span>Download Resume</span>
            <span style={{ fontSize: '1.2em' }}>↓</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
