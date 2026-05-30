import React, { useState } from 'react';
import './Projects.css';

const projectData = [
  {
    id: 6,
    title: 'Colab Code',
    category: 'Full Stack',
    image: '/colab-code.png',
    tech: 'React, Vite, Monaco Editor, Express, MongoDB, Yjs',
    description: [
      'Built a VS Code-style collaborative web IDE featuring an activity bar, file explorer, Monaco editor, and terminal panel.',
      'Implemented real-time collaboration using Yjs and Hocuspocus, rendering presence and persisting documents to MongoDB.',
      'Integrated code execution capabilities using Judge0, allowing users to run code and stream outputs directly to the terminal.'
    ],
    github: 'https://github.com/Derisionn/multiCoder',
    live: 'https://multi-coder.vercel.app/'
  },
  {
    id: 1,
    title: 'Agentic Hybrid SQL RAG System',
    category: 'AI/ML',
    image: '/sql-rag.png',
    tech: 'Python, LangGraph, Pinecone, Neo4j, Gemini, FastAPI, Azure SQL',
    description: [
      'Built a production-grade Text-to-SQL system over a 70-table Azure SQL database, converting natural language into executable SQL with live results.',
      'Designed a LangGraph-based agentic pipeline with self-correcting retries using error feedback, improving SQL execution success rate from 60% to 90%.',
      'Implemented hybrid retrieval: Pinecone vector search + Neo4j graph-based join-path discovery, reducing incorrect joins by 35% – 45%.',
      'Built a production-grade RAG system using embeddings, vector databases, and LLM orchestration.'
    ],
    github: '#',
    live: 'https://rag-system2.vercel.app/'
  },
  {
    id: 2,
    title: 'AI-Powered Financial Intelligence Platform',
    category: 'AI/ML',
    image: '/fin-intel.png',
    tech: 'PyTorch, FastAPI, Scikit-Learn, WebSockets, yfinance, Finnhub',
    description: [
      'Developed a multi-step LSTM Neural Network using PyTorch to predict 15-period forward-looking stock prices based on a 60-day historical sequence.',
      'Engineered an input pipeline featuring 7 technical & market indicators utilizing the ta library to capture momentum and trend signals.',
      'Formulated a recursive, autoregressive inference loop combined with customized volatility-based post-processing to generate realistic OHLC candle wicks.',
      'Built a high-performance FastAPI backend ensuring real-time multi-step predictions are generated and returned in under 100ms.'
    ],
    github: '#',
    live: 'https://stock-price-prediction-murex.vercel.app/dashboard'
  },
  {
    id: 3,
    title: 'FinAlogica',
    category: 'Full Stack',
    image: '/finalogica.png',
    tech: 'PyTorch, PostgreSQL, React, Node.js, Express.js, FastAPI',
    description: [
      'Built a scalable full-stack ML application enabling real-time inference with a modular, independently deployable architecture.',
      'Fine-tuned a MobileNetV3 image classification model, achieving 95% accuracy for fish species identification via low-latency REST APIs.',
      'Developed a context-aware recommendation engine integrating real-time weather data with domain rules, improving relevance by 40%.',
      'Automated species tagging and fishing recommendations, reducing manual logging effort by 30% and improving workflow efficiency.'
    ],
    github: '#',
    live: 'https://fin-alogica-main-6rka.vercel.app/'
  },
  {
    id: 4,
    title: 'WhatsApp Chat Data Analytics Dashboard',
    category: 'Data Analytics',
    image: '/whatsapp.png',
    tech: 'Python, Pandas, Seaborn, NLP',
    description: [
      'Developed an end-to-end analytics dashboard to uncover deep insights from WhatsApp group chats, rendering interactive monthly, daily, and 24-hour activity heatmaps.',
      'Cleaned and structured messy, unstructured text logs into actionable DataFrames using advanced Regex parsing and Pandas manipulation.',
      'Conducted sentiment analysis and emoji usage frequency mapping to profile user engagement and emotional polarity.'
    ],
    github: 'https://github.com/Derisionn/WhatsApp-Chat-Analyzer',
    live: 'https://whatsapp-chat-analyzer-bxnel5xhompsxcu3idvf85.streamlit.app/'
  },
  {
    id: 5,
    title: 'MoggerTech',
    category: 'Full Stack',
    image: '/mogger-tech.png',
    tech: 'Next.js, Tailwind CSS, Framer Motion, Lenis, TypeScript',
    description: [
      'Built a modern, high-performance digital presence for a tech agency featuring smooth scrolling and fluid micro-interactions.',
      'Utilized Framer Motion for scroll-triggered animations and Lenis for seamless smooth scrolling to deliver a premium user experience.',
      'Designed a modular, component-based architecture in Next.js ensuring maintainability and fast page load speeds via Server-Side Rendering (SSR) and dynamic imports.'
    ],
    github: 'https://github.com/Derisionn/MoggerTech',
    live: 'https://mogger-tech.vercel.app/'
  }
];

const categories = ['All', 'AI/ML', 'Full Stack', 'Data Analytics'];

const Projects: React.FC = () => {
  const [filter, setFilter] = useState('All');

  const filteredProjects = filter === 'All'
    ? projectData
    : projectData.filter(p => p.category === filter);

  return (
    <section id="projects" className="section projects-section">
      <h2 className="title">Featured Projects</h2>

      <div className="filter-group">
        {categories.map(cat => (
          <button
            key={cat}
            className={`filter-btn ${filter === cat ? 'active' : ''}`}
            onClick={() => setFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="projects-grid">
        {filteredProjects.map((project) => (
          /* Transparent placeholder — holds space in the grid */
          <div key={project.id} className="project-card-placeholder">

            {/* The actual visible card — absolutely positioned so it can expand freely */}
            <div className="project-card">
              {project.image && (
                <div className="project-image-container">
                  <img src={project.image} alt={project.title} className="project-image" />
                </div>
              )}
              <div className="project-top">
                <div className="project-header">
                  <div className="project-category">{project.category}</div>
                  <div className="project-links">
                    <a href={project.github} className="icon-link" aria-label="GitHub">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A4.8 4.8 0 0 0 8 18v4"/><path d="M12 18v4"/></svg>
                    </a>
                    <a href={project.live} className="icon-link" aria-label="Live Demo">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    </a>
                  </div>
                </div>

                <h3 className="project-title">{project.title}</h3>

                <div className="project-tech-list">
                  {project.tech.split(', ').map(tech => (
                    <span key={tech} className="tech-badge">{tech}</span>
                  ))}
                </div>
              </div>

              <div className="expand-hint">Hover for details ↓</div>

              {/* Hidden drawer — slides open on hover */}
              <div className="project-details">
                <ul className="project-description">
                  {project.description.map((desc, i) => (
                    <li key={i}>{desc}</li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;
