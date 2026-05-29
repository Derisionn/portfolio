import React, { useEffect, useRef, useState } from 'react';
import './Skills.css';

type Category = 'ml' | 'web' | 'backend' | 'tools';

interface Skill {
  text: string;
  category: Category;
}

const allSkills: Skill[] = [
  // Machine Learning
  { text: "Python", category: "ml" },
  { text: "TensorFlow", category: "ml" },
  { text: "Scikit-Learn", category: "ml" },
  { text: "Pandas", category: "ml" },
  { text: "CNNs", category: "ml" },
  { text: "Forecasting", category: "ml" },
  
  // Web Engineering
  { text: "React", category: "web" },
  { text: "TypeScript", category: "web" },
  { text: "Next.js", category: "web" },
  { text: "Tailwind", category: "web" },
  { text: "HTML/CSS", category: "web" },
  
  // Backend & DB
  { text: "Node.js", category: "backend" },
  { text: "Express.js", category: "backend" },
  { text: "SQL", category: "backend" },
  { text: "PostgreSQL", category: "backend" },
  { text: "MongoDB", category: "backend" },
  { text: "REST APIs", category: "backend" },

  // Tools & Cloud
  { text: "AWS", category: "tools" },
  { text: "Docker", category: "tools" },
  { text: "Git", category: "tools" },
  { text: "Linux", category: "tools" },
  { text: "Vite", category: "tools" }
];

const categoryColors = {
  ml: '#b19cd9',
  web: '#77dd77',
  backend: '#ff6961', // Soft red/coral for backend
  tools: '#ffb347'
};

const Skills: React.FC = () => {
  const [showTutorial, setShowTutorial] = useState(true);
  const [handPos, setHandPos] = useState<{ x: number; y: number } | null>(null);
  const tutRafRef = useRef<number>(0);
  const tutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tutActiveRef = useRef<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const friction = 0.96;
    const bounce = 0.6;
    const gravity = 0.4;

    let mouse = { x: 0, y: 0, isDown: false, dx: 0, dy: 0 };
    let draggedNode: SkillNode | null = null;
    let buckets: any[] = [];
    let nodes: SkillNode[] = [];
    const updateBuckets = () => {
      buckets = ['ml', 'web', 'backend', 'tools'].map(id => {
        const el = document.getElementById(`bucket-${id}`);
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        return {
          id,
          left: rect.left + 5,
          right: rect.right - 5,
          top: rect.top + window.scrollY,
          bottom: rect.bottom + window.scrollY - 5,
        };
      }).filter(Boolean);
    };

    // Dynamically calculate radius to be a reasonable size across screen sizes
    // We use a slightly smaller ratio since we have 20 balls now
    const dynamicRadius = Math.max(22, Math.min(35, width / 35));

    class SkillNode {
      x: number; y: number;
      vx: number; vy: number;
      radius: number;
      text: string;
      color: string;

      constructor(skill: Skill) {
        this.text = skill.text;
        this.color = categoryColors[skill.category];
        this.radius = dynamicRadius;
        
        // Spawn inside their respective bucket (Absolute Doc Coordinates)
        const bucket = buckets.find(b => b.id === skill.category);
        if (bucket && bucket.right > bucket.left) {
          const bucketWidth = bucket.right - bucket.left;
          this.x = bucket.left + bucketWidth / 2 + (Math.random() - 0.5) * (bucketWidth - this.radius * 2);
          this.y = bucket.top - 200 - Math.random() * 400; // Drop from above
        } else {
          this.x = width / 2;
          this.y = window.scrollY - 200;
        }
        
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = Math.random() * 2;
      }

      update() {
        if (draggedNode === this) {
          this.vx = mouse.dx * 0.5;
          this.vy = mouse.dy * 0.5;
          this.x = mouse.x;
          this.y = mouse.y;
        } else {
          this.vy += gravity;
          this.vx *= friction;
          this.vy *= friction;
          this.x += this.vx;
          this.y += this.vy;

          // Check if we are inside a bucket horizontally
          let insideBucket = null;
          for(let b of buckets) {
            // Generous vertical catch area
            if (this.x > b.left && this.x < b.right && this.y < b.bottom && this.y > b.top - 2000) {
              insideBucket = b;
              break;
            }
          }

          if (insideBucket) {
             if (this.x - this.radius < insideBucket.left) { this.x = insideBucket.left + this.radius; this.vx *= -bounce; }
             if (this.x + this.radius > insideBucket.right) { this.x = insideBucket.right - this.radius; this.vx *= -bounce; }
             if (this.y + this.radius > insideBucket.bottom) { this.y = insideBucket.bottom - this.radius; this.vy *= -bounce; }
          } else {
             // Global constraints (Viewport left/right, Viewport bottom)
             if (this.x - this.radius < 0) { 
               this.x = this.radius; 
               this.vx *= -bounce; 
               if (Math.abs(this.vx) > 0.5) this.vy += (Math.random() - 0.5) * 4;
             }
             if (this.x + this.radius > window.innerWidth) { 
               this.x = window.innerWidth - this.radius; 
               this.vx *= -bounce; 
               if (Math.abs(this.vx) > 0.5) this.vy += (Math.random() - 0.5) * 4;
             }
             
             // The floor is always the bottom of the current visible screen
             const floor = window.scrollY + window.innerHeight - 10;
             if (this.y + this.radius > floor) { 
                this.y = floor - this.radius; 
                this.vy *= -bounce; 
                // Scatter randomly when hitting the floor
                if (Math.abs(this.vy) > 0.5) {
                  this.vx += (Math.random() - 0.5) * 8; // Random horizontal scatter
                  this.vy -= Math.random() * 3;         // Random extra vertical bounce
                }
             }
          }
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        // Convert from absolute document coordinates to fixed viewport coordinates
        const screenY = this.y - window.scrollY;
        
        // Culling: don't draw if fully off screen
        if (screenY + this.radius < 0 || screenY - this.radius > window.innerHeight) return;

        ctx.beginPath();
        ctx.arc(this.x, screenY, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();

        const fontSize = Math.max(9, Math.min(15, this.radius / 3.2));
        ctx.font = `700 ${fontSize}px Inter, sans-serif`;
        ctx.fillStyle = '#0f172a';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.text, this.x, screenY);
      }
    }

    const resolveCollisions = () => {
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - nodes[i].x;
          const dy = nodes[j].y - nodes[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const min_dist = nodes[i].radius + nodes[j].radius;

          if (dist < min_dist && dist > 0) {
            const angle = Math.atan2(dy, dx);
            const targetX = nodes[i].x + Math.cos(angle) * min_dist;
            const targetY = nodes[i].y + Math.sin(angle) * min_dist;
            const ax = (targetX - nodes[j].x) * 0.3;
            const ay = (targetY - nodes[j].y) * 0.3;
            
            if (draggedNode !== nodes[i]) {
              nodes[i].vx -= ax;
              nodes[i].vy -= ay;
            }
            if (draggedNode !== nodes[j]) {
              nodes[j].vx += ax;
              nodes[j].vy += ay;
            }
          }
        }
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      resolveCollisions();
      nodes.forEach(node => {
        node.update();
        node.draw(ctx);
      });
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    let hasSpawned = false;
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && !hasSpawned) {
        hasSpawned = true;
        setTimeout(() => {
          updateBuckets();
          nodes = allSkills.map(s => new SkillNode(s));

          // ── Tutorial: looping hand-drag until user interacts ──
          tutActiveRef.current = true;

          const runTutorialCycle = () => {
            if (!tutActiveRef.current || nodes.length === 0) return;
            // Pick a ball from the Backend bucket (3rd of 4 columns = middle)
            const tutNode = nodes.find(n => n.text === 'Node.js') ?? nodes[0];

            // Grab ball at its current (settled) position
            mouse.x = tutNode.x;
            mouse.y = tutNode.y;
            mouse.isDown = true;
            draggedNode = tutNode;

            const startX = tutNode.x;
            const startY = tutNode.y;
            const targetY = startY - 220; // lift 220px upward
            const duration = 1600;
            const startTime = performance.now();

            const animTut = (now: number) => {
              if (!tutActiveRef.current) return;
              const t = Math.min((now - startTime) / duration, 1);
              const e = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
              mouse.x = startX;
              mouse.y = startY + (targetY - startY) * e;
              setHandPos({ x: mouse.x, y: mouse.y - window.scrollY });

              if (t < 1) {
                tutRafRef.current = requestAnimationFrame(animTut);
              } else {
                // Release ball — let physics take over
                draggedNode = null;
                mouse.isDown = false;
                setHandPos(null);
                // Pause, then repeat the cycle
                tutTimerRef.current = setTimeout(() => {
                  runTutorialCycle();
                }, 1200);
              }
            };
            tutRafRef.current = requestAnimationFrame(animTut);
          };

          // First cycle starts after balls settle
          tutTimerRef.current = setTimeout(runTutorialCycle, 900);
        }, 100);
        observer.disconnect();
      }
    }, { threshold: 0.2 });

    if (section) {
      observer.observe(section);
    }

    let lastMouse = { x: 0, y: 0 };
    
    // Mouse Events
    const handleMouseMove = (e: MouseEvent) => {
      const docX = e.clientX;
      const docY = e.clientY + window.scrollY;
      mouse.dx = docX - lastMouse.x;
      mouse.dy = docY - lastMouse.y;
      mouse.x = docX;
      mouse.y = docY;
      lastMouse = { x: docX, y: docY };
    };

    const cancelTutorial = () => {
      tutActiveRef.current = false;
      cancelAnimationFrame(tutRafRef.current);
      if (tutTimerRef.current) clearTimeout(tutTimerRef.current);
      draggedNode = null;
      mouse.isDown = false;
      setShowTutorial(false);
      setHandPos(null);
    };

    const handleMouseDown = (e: MouseEvent) => {
      cancelTutorial();
      const docX = e.clientX;
      const docY = e.clientY + window.scrollY;
      for (let i = nodes.length - 1; i >= 0; i--) {
        const dx = docX - nodes[i].x;
        const dy = docY - nodes[i].y;
        if (Math.sqrt(dx * dx + dy * dy) < nodes[i].radius) {
          draggedNode = nodes[i];
          mouse.isDown = true;
          mouse.x = docX;
          mouse.y = docY;
          lastMouse = { x: docX, y: docY };
          if (e.cancelable) e.preventDefault();
          break;
        }
      }
    };

    const handleMouseUp = () => {
      mouse.isDown = false;
      draggedNode = null;
    };

    // Touch Events for Mobile
    const handleTouchMove = (e: TouchEvent) => {
      if (!mouse.isDown) return;
      const touch = e.touches[0];
      const docX = touch.clientX;
      const docY = touch.clientY + window.scrollY;
      mouse.dx = docX - lastMouse.x;
      mouse.dy = docY - lastMouse.y;
      mouse.x = docX;
      mouse.y = docY;
      lastMouse = { x: docX, y: docY };
      if (e.cancelable) e.preventDefault();
    };

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      const docX = touch.clientX;
      const docY = touch.clientY + window.scrollY;
      for (let i = nodes.length - 1; i >= 0; i--) {
        const dx = docX - nodes[i].x;
        const dy = docY - nodes[i].y;
        if (Math.sqrt(dx * dx + dy * dy) < nodes[i].radius) {
          cancelTutorial();
          draggedNode = nodes[i];
          mouse.isDown = true;
          mouse.x = docX;
          mouse.y = docY;
          lastMouse = { x: docX, y: docY };
          if (e.cancelable) e.preventDefault();
          break;
        }
      }
    };

    // Bind events to WINDOW so we can drag anywhere on the page
    window.addEventListener('mousemove', handleMouseMove, { passive: false });
    window.addEventListener('mousedown', handleMouseDown, { passive: false });
    window.addEventListener('mouseup', handleMouseUp);
    
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchend', handleMouseUp);
    
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      updateBuckets();
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', updateBuckets, { passive: true });

    return () => {
      cancelAnimationFrame(animationFrameId);
      cancelAnimationFrame(tutRafRef.current);
      if (tutTimerRef.current) clearTimeout(tutTimerRef.current);
      observer.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleMouseUp);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', updateBuckets);
    };
  }, []);

  return (
    <section className="skills section" id="skills" ref={sectionRef}>
      <canvas ref={canvasRef} className="global-physics-canvas" />

      {/* Hand emoji follows the real ball being dragged */}
      {showTutorial && handPos && (
        <div
          className="tutorial-hand"
          style={{ left: handPos.x, top: handPos.y }}
        >
          👆
        </div>
      )}
      
      <div className="section-header">
        <h2 className="title">Technical Expertise</h2>
        <p className="subtitle">Interactive skill domains. Grab the balls and throw them out of the buckets!</p>
      </div>

      <div className="buckets-container">
        <div className="bucket-wrapper">
          <div id="bucket-ml" className="bucket-card"></div>
          <div className="bucket-label">
            <span className="bucket-icon">🧠</span>
            <h3>Data & Machine Learning</h3>
          </div>
        </div>
        <div className="bucket-wrapper">
          <div id="bucket-web" className="bucket-card"></div>
          <div className="bucket-label">
            <span className="bucket-icon">💻</span>
            <h3>Web Engineering</h3>
          </div>
        </div>
        <div className="bucket-wrapper">
          <div id="bucket-backend" className="bucket-card"></div>
          <div className="bucket-label">
            <span className="bucket-icon">⚙️</span>
            <h3>Backend & DB</h3>
          </div>
        </div>
        <div className="bucket-wrapper">
          <div id="bucket-tools" className="bucket-card"></div>
          <div className="bucket-label">
            <span className="bucket-icon">☁️</span>
            <h3>Cloud & Tools</h3>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
