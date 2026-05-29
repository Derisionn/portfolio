import React from 'react';
import './Experience.css';

const Experience: React.FC = () => {
  const experiences = [
    {
      title: "Data & ML Engineer",
      company: "Grand India (Remote)",
      period: "June 2025 - Sept 2025",
      highlight: "Built end-to-end ML pipelines & CNN computer vision models to heavily optimize logistics and inventory management.",
      descriptions: [
        "Built and deployed end-to-end ML pipelines for logistics optimization, reducing delivery time by 35%.",
        "Built predictive forecasting models for inventory management, reducing storage cost by 20%.",
        "Implemented CNN-based computer vision system achieving 95% accuracy for automated inspection.",
        "Built time-series forecasting models using statistical techniques for inventory prediction."
      ]
    }
  ];

  return (
    <section className="experience section" id="experience">
      <h2 className="title">Experience</h2>
      <div className="timeline">
        {experiences.map((exp, index) => (
          <div className="timeline-item" key={index}>
            <div className="timeline-dot"></div>
            <div className="timeline-content glassmorphism">
              <span className="timeline-period">{exp.period}</span>
              <h3 className="timeline-title">{exp.title}</h3>
              <h4 className="timeline-company">{exp.company}</h4>
              
              <div className="timeline-highlight">
                <p>{exp.highlight}</p>
                <span className="hover-hint">Hover to see full details ↓</span>
              </div>
              
              <div className="timeline-full-details">
                <div className="timeline-full-details-inner">
                  <ul className="timeline-desc-list">
                    {exp.descriptions.map((desc, i) => (
                      <li key={i}>{desc}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Experience;
