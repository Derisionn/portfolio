import React, { useEffect, useRef, useState } from 'react';
import './Skills.css';

type Category = 'ml' | 'web' | 'backend' | 'tools';

interface Skill {
  text: string;
  category: Category;
  icon?: string;
}

const allSkills: Skill[] = [
  // Machine Learning
  { text: "Python", category: "ml", icon: "python" },
  { text: "TensorFlow", category: "ml", icon: "tensorflow" },
  { text: "Scikit-Learn", category: "ml", icon: "scikitlearn" },
  { text: "Pandas", category: "ml", icon: "pandas" },
  { text: "CNNs", category: "ml" },
  { text: "Forecasting", category: "ml" },
  
  // Web Engineering
  { text: "React", category: "web", icon: "react" },
  { text: "TypeScript", category: "web", icon: "typescript" },
  { text: "Next.js", category: "web", icon: "nextdotjs" },
  { text: "Tailwind", category: "web", icon: "tailwindcss" },
  { text: "HTML/CSS", category: "web", icon: "html5" },
  
  // Backend & DB
  { text: "Node.js", category: "backend", icon: "nodedotjs" },
  { text: "Express.js", category: "backend", icon: "express" },
  { text: "SQL", category: "backend", icon: "postgresql" },
  { text: "PostgreSQL", category: "backend", icon: "postgresql" },
  { text: "MongoDB", category: "backend", icon: "mongodb" },
  { text: "REST APIs", category: "backend" },

  // Tools & Cloud
  { text: "AWS", category: "tools", icon: "amazonwebservices" },
  { text: "Docker", category: "tools", icon: "docker" },
  { text: "Git", category: "tools", icon: "git" },
  { text: "Linux", category: "tools", icon: "linux" },
  { text: "Vite", category: "tools", icon: "vite" }
];

const categoryColors = {
  ml: '#b19cd9',
  web: '#77dd77',
  backend: '#ff6961', // Soft red/coral for backend
  tools: '#ffb347'
};

const Skills: React.FC = () => {
  const [showTutorial, setShowTutorial] = useState(true);
  const handRef = useRef<HTMLDivElement>(null);   // direct DOM — no re-renders
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
    let hoveredNode: SkillNode | null = null;
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
      img: HTMLImageElement | null = null;
      iconLoaded: boolean = false;
      targetBucketId: string;
      hasSettled: boolean = false;

      constructor(skill: Skill) {
        this.text = skill.text;
        this.color = categoryColors[skill.category];
        this.radius = dynamicRadius;
        this.targetBucketId = skill.category;
        
        if (skill.icon) {
          this.img = new Image();
          this.img.src = `https://cdn.simpleicons.org/${skill.icon}/0f172a`;
          this.img.onload = () => { this.iconLoaded = true; };
        }
        
        // Spawn inside their respective bucket (Absolute Doc Coordinates)
        const bucket = buckets.find(b => b.id === skill.category);
        if (bucket && bucket.right > bucket.left) {
          const bucketWidth = bucket.right - bucket.left;
          this.x = bucket.left + bucketWidth / 2 + (Math.random() - 0.5) * (bucketWidth - this.radius * 2);
          
          // To make bottom buckets fill first, we must accurately detect if this bucket is in the bottom row.
          // We do this by comparing its top coordinate to the very first bucket's top coordinate.
          const firstBucket = buckets[0];
          const isBottomRow = firstBucket && (bucket.top > firstBucket.top + 50); 
          
          if (isBottomRow) {
            this.y = window.scrollY - 50 - Math.random() * 300;  // Spawns just barely out of frame
          } else {
            this.y = window.scrollY - 1600 - Math.random() * 800; // Spawns extremely high up
          }
          
          this.vx = (Math.random() - 0.5) * 2;
          this.vy = Math.random() * 2;
        } else {
          this.x = width / 2;
          this.y = window.scrollY - 200;
          this.vx = (Math.random() - 0.5) * 2;
          this.vy = Math.random() * 2;
        }
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
              // Ignore wrong buckets while initially falling from the sky
              if (!this.hasSettled && b.id !== this.targetBucketId) continue;
              
              insideBucket = b;
              break;
            }
          }

          if (insideBucket) {
            // Walls
            if (this.x - this.radius < insideBucket.left)  { this.x = insideBucket.left  + this.radius; this.vx =  Math.abs(this.vx) * bounce; }
            if (this.x + this.radius > insideBucket.right) { this.x = insideBucket.right - this.radius; this.vx = -Math.abs(this.vx) * bounce; }
            // Floor — settle instead of micro-bounce
            if (this.y + this.radius > insideBucket.bottom) {
              this.y = insideBucket.bottom - this.radius;
              this.hasSettled = true; // Ball has safely reached a bucket
              if (Math.abs(this.vy) < 1.5) { this.vy = 0; }  // settle
              else                          { this.vy *= -bounce; }
            }
            // Velocity dead zone — kills residual micro-vibration
            if (Math.abs(this.vx) < 0.12) this.vx = 0;
            if (Math.abs(this.vy) < 0.12) this.vy = 0;
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
             // ONLY apply the viewport floor bounce if the ball has already settled.
             // This allows initially falling balls to pass through the viewport bottom to reach buckets below the fold!
             if (this.hasSettled && this.y + this.radius > floor) { 
                this.y = floor - this.radius; 
                this.vy *= -bounce; 
                // Scatter randomly when hitting the floor
                if (Math.abs(this.vy) > 0.5) {
                  this.vx += (Math.random() - 0.5) * 8; // Random horizontal scatter
                  this.vy -= Math.random() * 3;         // Random extra vertical bounce
                }
             }
             
             // Failsafe: if a ball somehow falls completely off the document, reset it to the top
             if (!this.hasSettled && this.y > window.scrollY + 3000) {
               this.y = window.scrollY - 200;
               this.vx = 0;
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

        if (this.iconLoaded && this.img) {
          // Reduced from 1.2 to 0.9 to make the logo smaller inside the ball
          const imgSize = this.radius * 0.9;
          ctx.drawImage(this.img, this.x - imgSize / 2, screenY - imgSize / 2, imgSize, imgSize);
        } else {
          const fontSize = Math.max(9, Math.min(15, this.radius / 3.2));
          ctx.font = `700 ${fontSize}px Inter, sans-serif`;
          ctx.fillStyle = '#0f172a';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(this.text, this.x, screenY);
        }
      } // <- this closing brace was missing

      drawTooltip(ctx: CanvasRenderingContext2D) {
        const screenY = this.y - window.scrollY;
        ctx.font = '600 14px Inter, sans-serif';
        const textWidth = ctx.measureText(this.text).width;
        const paddingX = 12;
        const paddingY = 6;
        const tooltipWidth = textWidth + paddingX * 2;
        const tooltipHeight = 14 + paddingY * 2;
        const tooltipY = screenY - this.radius - tooltipHeight - 10;
        
        // Tooltip background
        ctx.beginPath();
        ctx.roundRect(this.x - tooltipWidth / 2, tooltipY, tooltipWidth, tooltipHeight, 8);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)'; // Dark slate background
        ctx.fill();
        
        // Tooltip text
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.text, this.x, tooltipY + tooltipHeight / 2);
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
            // Position correction — push balls apart directly (no velocity impulse)
            // This is key: velocity impulses cause perpetual micro-vibration at rest
            const overlap = (min_dist - dist) * 0.5;
            const nx = dx / dist;
            const ny = dy / dist;

            if (draggedNode !== nodes[i]) {
              nodes[i].x -= nx * overlap;
              nodes[i].y -= ny * overlap;
            }
            if (draggedNode !== nodes[j]) {
              nodes[j].x += nx * overlap;
              nodes[j].y += ny * overlap;
            }

            // Tiny velocity exchange only when approaching fast (actual collision)
            const relV = (nodes[i].vx - nodes[j].vx) * nx + (nodes[i].vy - nodes[j].vy) * ny;
            if (relV > 1.0) {   // only react to meaningful impacts
              const impulse = relV * 0.35;
              if (draggedNode !== nodes[i]) { nodes[i].vx -= nx * impulse; nodes[i].vy -= ny * impulse; }
              if (draggedNode !== nodes[j]) { nodes[j].vx += nx * impulse; nodes[j].vy += ny * impulse; }
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

      // Draw tooltips in a second pass so they always appear ON TOP of all balls
      nodes.forEach(node => {
        if (draggedNode === node || hoveredNode === node) {
          node.drawTooltip(ctx);
        }
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
            const tutNode = nodes.find(n => n.text === 'Node.js') ?? nodes[0];

            // ── Fixed start: center of the Backend bucket ──
            const bucketEl = document.getElementById('bucket-backend');
            let startX = width / 2;
            let startY = window.scrollY + window.innerHeight * 0.6; // fallback
            if (bucketEl) {
              const rect = bucketEl.getBoundingClientRect();
              startX = rect.left + rect.width / 2;
              startY = rect.bottom + window.scrollY - 60; // 60px above bucket bottom
            }

            // Snap mouse to bucket center and grab the ball
            mouse.x = startX;
            mouse.y = startY;
            mouse.isDown = true;
            draggedNode = tutNode;

            const targetY = startY - 240; // lift 240px upward out of bucket
            const duration = 1600;
            const startTime = performance.now();

            const animTut = (now: number) => {
              if (!tutActiveRef.current) return;
              const t = Math.min((now - startTime) / duration, 1);
              const e = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
              mouse.x = startX;
              mouse.y = startY + (targetY - startY) * e;
              // Move hand directly via DOM — zero React re-renders, no flicker
              if (handRef.current) {
                handRef.current.style.left = `${mouse.x}px`;
                handRef.current.style.top  = `${mouse.y - window.scrollY}px`;
                handRef.current.style.opacity = '1';
              }

              if (t < 1) {
                tutRafRef.current = requestAnimationFrame(animTut);
              } else {
                // Release ball — let physics take over
                draggedNode = null;
                mouse.isDown = false;
                if (handRef.current) handRef.current.style.opacity = '0';
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

      // 1. Always detect hover based on real mouse coordinates (even during tutorial)
      if (!mouse.isDown) {
        hoveredNode = null;
        for (let i = nodes.length - 1; i >= 0; i--) {
          const dx = docX - nodes[i].x;
          const dy = docY - nodes[i].y;
          if (Math.sqrt(dx * dx + dy * dy) < nodes[i].radius) {
            hoveredNode = nodes[i];
            break;
          }
        }
        // Change cursor to pointer if hovering a ball
        if (canvasRef.current) {
          canvasRef.current.style.cursor = hoveredNode ? 'pointer' : 'default';
        }
      }

      // 2. If tutorial is active, it controls the dragged ball position — ignore real mouse moves
      if (tutActiveRef.current) return; 

      // 3. Otherwise, update physics engine mouse state
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
      hoveredNode = null;
      mouse.isDown = false;
      if (handRef.current) handRef.current.style.opacity = '0';
      setShowTutorial(false);
    };

    const handleMouseDown = (e: MouseEvent) => {
      cancelTutorial();
      const docX = e.clientX;
      const docY = e.clientY + window.scrollY;
      for (let i = nodes.length - 1; i >= 0; i--) {
        const dx = docX - nodes[i].x;
        const dy = docY - nodes[i].y;
        if (Math.sqrt(dx * dx + dy * dy) < nodes[i].radius) {
          nodes[i].hasSettled = true; // Allow it to interact with any bucket once grabbed
          draggedNode = nodes[i];
          hoveredNode = null; // Dragging takes precedence
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
      // Re-evaluate hover immediately after drop
      handleMouseMove({ clientX: mouse.x, clientY: mouse.y - window.scrollY } as MouseEvent);
    };

    // Touch Events for Mobile
    const handleTouchMove = (e: TouchEvent) => {
      if (!mouse.isDown || tutActiveRef.current) return; // ignore during tutorial
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
          nodes[i].hasSettled = true; // Allow it to interact with any bucket once grabbed
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

      {/* Hand emoji — moved via direct DOM style, never triggers re-render */}
      {showTutorial && (
        <div
          ref={handRef}
          className="tutorial-hand"
          style={{ opacity: 0 }}   /* starts hidden; shown once first cycle begins */
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
