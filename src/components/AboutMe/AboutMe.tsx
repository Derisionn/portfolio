import React, { useState, useEffect } from 'react';
import './AboutMe.css';
import skills from '../../data/skills.json';

const AboutMe: React.FC = () => {
  const [activeFile, setActiveFile] = useState('bio.ts');
  const [typing, setTyping] = useState(true);

  // Re-trigger typing animation when tab changes
  useEffect(() => {
    setTyping(false);
    const timer = setTimeout(() => setTyping(true), 50);
    return () => clearTimeout(timer);
  }, [activeFile]);

  const renderContent = () => {
    if (!typing) return null;

    if (activeFile === 'bio.ts') {
      return (
        <div className="code-content type-animation">
          <div className="code-line"><span className="token-comment">// A brief introduction</span></div>
          <div className="code-line"><span className="token-keyword">const</span> <span className="token-variable">developer</span> <span className="token-operator">=</span> {'{'}</div>
          <div className="code-line indent-1">name: <span className="token-string">'Harsh Vardhan'</span>,</div>
          <div className="code-line indent-1">role: <span className="token-string">'Full-Stack ML & Web Engineer'</span>,</div>
          <div className="code-line indent-1">status: <span className="token-string">'Available for new opportunities'</span>,</div>
          <div className="code-line indent-1">focus: [</div>
          <div className="code-line indent-2"><span className="token-string">'Agentic AI Systems'</span>,</div>
          <div className="code-line indent-2"><span className="token-string">'Scalable Backend Architecture'</span>,</div>
          <div className="code-line indent-2"><span className="token-string">'Interactive Frontend UIs'</span></div>
          <div className="code-line indent-1">],</div>
          <div className="code-line indent-1">bio: <span className="token-keyword">function</span>() {'{'}</div>
          <div className="code-line indent-2"><span className="token-keyword">return</span> <span className="token-string">`I bridge the gap between complex machine learning models and high-performance, user-centric web applications.`</span>;</div>
          <div className="code-line indent-1">{'}'}</div>
          <div className="code-line">{'}'};</div>
          <br/>
          <div className="code-line"><span className="token-keyword">export default</span> developer;</div>
        </div>
      );
    } else if (activeFile === 'skills.json') {
      return (
        <div className="code-content type-animation">
          <div className="code-line">{'{'}</div>
          <div className="code-line indent-1"><span className="token-property">"core_technologies"</span>: [</div>
          {skills.map((skill, index) => (
            <div key={skill.name} className="code-line indent-2">
              <span className="token-string">"{skill.name}"</span>{index < skills.length - 1 ? ',' : ''}
            </div>
          ))}
          <div className="code-line indent-1">]</div>
          <div className="code-line">{'}'}</div>
        </div>
      );
    } else if (activeFile === 'education.md') {
      return (
        <div className="code-content type-animation markdown-view">
          <h1 className="md-h1"># Education</h1>
          <br/>
          <h2 className="md-h2">## Academic Background</h2>
          <p className="md-p">Continuously learning and expanding my knowledge in computer science and software engineering.</p>
          <br/>
          <ul className="md-ul">
            <li><span className="md-bold">**University:**</span> JSS Academy of Technical Education Noida</li>
            <li><span className="md-bold">**Degree:**</span> Bachelor of Technology</li>
            <li><span className="md-bold">**Major:**</span> Computer Science & Engineering (Data Science)</li>
            <li><span className="md-bold">**Timeline:**</span> 2022 - 2026</li>
          </ul>
        </div>
      );
    } else if (activeFile === 'achievements.md') {
      return (
        <div className="code-content type-animation markdown-view">
          <h1 className="md-h1"># Achievements & Awards</h1>
          <br/>
          <ul className="md-ul">
            <li><span className="md-bold">🏆 Hackathon Winner:</span> 1st Place at [Hackathon Name] (2024)</li>
            <li><span className="md-bold">⭐ Top Performer:</span> Recognized for outstanding academic excellence in Data Science.</li>
            <li><span className="md-bold">🚀 Open Source:</span> Contributed to [Project Name] with over 500+ stars on GitHub.</li>
          </ul>
          <br/>
          <p className="md-p">*(More milestones currently in progress!)*</p>
        </div>
      );
    }
  };

  return (
    <section className="about-me section" id="about">
      <div className="section-header">
        <h2 className="title">System.<span className="token-function">getInfo</span>()</h2>
        <p className="subtitle">Let's look under the hood.</p>
      </div>

      <div className="ide-window glassmorphism">
        {/* Window Controls */}
        <div className="ide-header">
          <div className="window-controls">
            <span className="control close"></span>
            <span className="control minimize"></span>
            <span className="control maximize"></span>
          </div>
          <div className="ide-title">harsh-portfolio — VS Code</div>
        </div>

        <div className="ide-body">
          {/* Sidebar */}
          <div className="ide-sidebar">
            <div className="sidebar-header">EXPLORER</div>
            <div className="sidebar-folder">
              <span className="folder-icon">📂</span> src
            </div>
            <ul className="file-tree">
              <li 
                className={`file-item ${activeFile === 'bio.ts' ? 'active' : ''}`}
                onClick={() => setActiveFile('bio.ts')}
              >
                <span className="file-icon ts">TS</span> bio.ts
              </li>
              <li 
                className={`file-item ${activeFile === 'skills.json' ? 'active' : ''}`}
                onClick={() => setActiveFile('skills.json')}
              >
                <span className="file-icon json">{'{ }'}</span> skills.json
              </li>
              <li 
                className={`file-item ${activeFile === 'education.md' ? 'active' : ''}`}
                onClick={() => setActiveFile('education.md')}
              >
                <span className="file-icon md">↓</span> education.md
              </li>
              <li 
                className={`file-item ${activeFile === 'achievements.md' ? 'active' : ''}`}
                onClick={() => setActiveFile('achievements.md')}
              >
                <span className="file-icon md">↓</span> achievements.md
              </li>
            </ul>
          </div>

          {/* Editor Area */}
          <div className="ide-editor">
            {/* Tabs */}
            <div className="editor-tabs">
              <div 
                className={`editor-tab ${activeFile === 'bio.ts' ? 'active' : ''}`}
                onClick={() => setActiveFile('bio.ts')}
              >
                <span className="file-icon ts">TS</span> bio.ts
              </div>
              <div 
                className={`editor-tab ${activeFile === 'skills.json' ? 'active' : ''}`}
                onClick={() => setActiveFile('skills.json')}
              >
                <span className="file-icon json">{'{ }'}</span> skills.json
              </div>
              <div 
                className={`editor-tab ${activeFile === 'education.md' ? 'active' : ''}`}
                onClick={() => setActiveFile('education.md')}
              >
                <span className="file-icon md">↓</span> education.md
              </div>
              <div 
                className={`editor-tab ${activeFile === 'achievements.md' ? 'active' : ''}`}
                onClick={() => setActiveFile('achievements.md')}
              >
                <span className="file-icon md">↓</span> achievements.md
              </div>
            </div>

            {/* Code View */}
            <div className="editor-viewport">
              <div className="line-numbers">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} className="line-num">{i + 1}</div>
                ))}
              </div>
              <div className="code-area">
                {renderContent()}
                <div className="blinking-cursor"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
