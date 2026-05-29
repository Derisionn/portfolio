import React, { useEffect, useRef } from 'react';
import './InteractiveBackground.css';

const InteractiveBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    type TechType = 'mongodb' | 'react' | 'js' | 'tailwind' | 'figma' | 'python' | 'nextjs';
    const techTypes: TechType[] = ['mongodb', 'react', 'js', 'tailwind', 'figma', 'python', 'nextjs'];

    class TechParticle {
      type: TechType;
      x: number;
      y: number;
      size: number;
      vx: number;
      vy: number;
      rotation: number;
      rotSpeed: number;
      opacity: number;
      color: string;
      flip: number;
      flipSpeed: number;
      
      constructor() {
        this.type = techTypes[Math.floor(Math.random() * techTypes.length)];
        this.x = Math.random() * width;
        this.y = Math.random() * height - height; // Start offscreen or onscreen
        this.size = Math.random() * 6 + 4; // Particle size
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = Math.random() * 0.5 + 0.2; // gentle falling speed
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.02; // slower rotation
        this.opacity = Math.random() * 0.5 + 0.2; // Keep opacity balanced
        
        // Assign colors based on technology branding
        if (this.type === 'mongodb') {
          this.color = 'rgba(71, 162, 72, '; // Green
        } else if (this.type === 'react') {
          this.color = 'rgba(97, 218, 251, '; // Light Blue
        } else if (this.type === 'js') {
          this.color = 'rgba(247, 223, 30, '; // Yellow
        } else if (this.type === 'tailwind') {
          this.color = 'rgba(56, 189, 248, '; // Cyan
        } else if (this.type === 'figma') {
          this.color = 'rgba(242, 78, 30, '; // Vibrant Orange/Pink
        } else if (this.type === 'python') {
          this.color = 'rgba(55, 118, 171, '; // Python Blue
        } else if (this.type === 'nextjs') {
          this.color = 'rgba(200, 200, 200, '; // White/Grey
        } else {
          this.color = 'rgba(255, 255, 255, ';
        }
        
        // 3D flipping effect variables
        this.flip = Math.random();
        this.flipSpeed = Math.random() * 0.01 + 0.005; // very slow default flip
      }

      draw(ctx: CanvasRenderingContext2D, isLightMode: boolean) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        // Simulate a 3D leaf tumbling through the air by scaling the Y axis
        ctx.scale(1, Math.sin(this.flip));
        
        // Increase opacity for light mode to make colors pop more against white
        const drawOpacity = isLightMode ? Math.min(1, this.opacity * 1.8) : this.opacity;
        let finalColor = this.color;
        
        // Darken white/gray nextjs logo in light mode
        if (isLightMode && this.type === 'nextjs') {
           finalColor = 'rgba(50, 50, 50, '; 
        }

        ctx.fillStyle = finalColor + drawOpacity + ')';
        ctx.strokeStyle = finalColor + drawOpacity + ')';
        
        if (this.type === 'mongodb') {
          // MongoDB Leaf
          ctx.beginPath();
          ctx.moveTo(0, -this.size * 1.5); 
          ctx.bezierCurveTo(this.size * 1.2, -this.size * 0.5, this.size * 0.8, this.size, 0, this.size * 1.5); 
          ctx.bezierCurveTo(-this.size * 0.8, this.size, -this.size * 1.2, -this.size * 0.5, 0, -this.size * 1.5); 
          ctx.fill();
        } else if (this.type === 'react') {
          // React Orbits
          ctx.lineWidth = this.size * 0.2;
          ctx.beginPath(); ctx.arc(0, 0, this.size * 0.35, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.ellipse(0, 0, this.size * 1.6, this.size * 0.6, 0, 0, Math.PI * 2); ctx.stroke();
          ctx.beginPath(); ctx.ellipse(0, 0, this.size * 1.6, this.size * 0.6, Math.PI / 3, 0, Math.PI * 2); ctx.stroke();
          ctx.beginPath(); ctx.ellipse(0, 0, this.size * 1.6, this.size * 0.6, (Math.PI / 3) * 2, 0, Math.PI * 2); ctx.stroke();
        } else if (this.type === 'js') {
          // JavaScript Square
          ctx.fillRect(-this.size, -this.size, this.size * 2, this.size * 2);
          ctx.fillStyle = isLightMode ? '#ffffff' : '#0b0c10'; // Cut out text color
          ctx.font = `bold ${this.size * 1.2}px Inter, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('JS', this.size * 0.2, this.size * 0.2);
        } else if (this.type === 'tailwind') {
          // Tailwind Waves
          ctx.lineWidth = this.size * 0.4;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(-this.size, 0);
          ctx.bezierCurveTo(-this.size/2, -this.size, this.size/2, this.size, this.size, 0);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(-this.size, -this.size);
          ctx.bezierCurveTo(-this.size/2, -this.size*2, this.size/2, 0, this.size, -this.size);
          ctx.stroke();
        } else if (this.type === 'figma') {
          // Figma Dots
          const r = this.size * 0.45;
          ctx.beginPath(); ctx.arc(-r, -r, r, 0, Math.PI*2); ctx.fill();
          ctx.beginPath(); ctx.arc(-r, r, r, 0, Math.PI*2); ctx.fill();
          ctx.beginPath(); ctx.arc(r, -r, r, 0, Math.PI*2); ctx.fill();
          ctx.beginPath(); ctx.arc(r, r, r, 0, Math.PI*2); ctx.fill();
        } else if (this.type === 'python') {
          // Python interlocking approximation (Cross)
          ctx.fillRect(-this.size * 1.2, -this.size * 0.4, this.size * 2.4, this.size * 0.8);
          ctx.fillRect(-this.size * 0.4, -this.size * 1.2, this.size * 0.8, this.size * 2.4);
        } else if (this.type === 'nextjs') {
          // Next.js Circle + N
          ctx.beginPath(); ctx.arc(0, 0, this.size * 1.3, 0, Math.PI*2); ctx.fill();
          ctx.fillStyle = isLightMode ? '#ffffff' : '#0b0c10';
          ctx.font = `bold ${this.size * 1.5}px Inter, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('N', 0, 0);
        }
        
        ctx.restore();
      }

      update(windX: number, windY: number) {
        // Apply ambient wind/drift
        this.vx += (Math.random() - 0.5) * 0.1;
        
        // Add interactive wind from the mouse swipe
        this.vx += windX;
        this.vy += windY;
        
        // Air friction / drag
        this.vx *= 0.96; 
        
        // Gravity bounds (slowly return to standard falling speed)
        if (this.vy < 0.2) this.vy += 0.02; 
        if (this.vy > 1.5) this.vy *= 0.95; 

        // Friction for rotation
        this.rotSpeed *= 0.95;
        this.flipSpeed = this.flipSpeed * 0.95 + 0.0005; 

        this.x += this.vx;
        this.y += this.vy;
        
        this.rotation += this.rotSpeed;
        this.flip += this.flipSpeed;

        // Wrap around logic if it falls off screen
        if (this.y > height + this.size * 2 || this.x < -this.size * 2 || this.x > width + this.size * 2) {
          this.y = -this.size * 2;
          this.x = Math.random() * width;
          this.vx = (Math.random() - 0.5) * 0.5;
          this.vy = Math.random() * 0.5 + 0.2;
        }
      }
    }

    const particles: TechParticle[] = [];
    const numParticles = width < 768 ? 80 : 150; // Less on mobile
    for (let i = 0; i < numParticles; i++) {
      particles.push(new TechParticle());
      particles[i].y = Math.random() * height; 
    }

    let mouseX = -1000;
    let mouseY = -1000;
    let lastMouseX = -1000;
    let lastMouseY = -1000;
    let mouseVelocityX = 0;
    let mouseVelocityY = 0;
    
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      if (lastMouseX !== -1000) {
        mouseVelocityX = (mouseX - lastMouseX);
        mouseVelocityY = (mouseY - lastMouseY);
      }
      
      lastMouseX = mouseX;
      lastMouseY = mouseY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', handleResize);

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      
      const isLightMode = document.documentElement.getAttribute('data-theme') === 'light';

      mouseVelocityX *= 0.85;
      mouseVelocityY *= 0.85;

      particles.forEach(particle => {
        let windX = 0;
        let windY = 0;

        const dx = mouseX - particle.x;
        const dy = mouseY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const radius = 150; 

        if (distance < radius) {
          const force = (radius - distance) / radius; 
          windX = mouseVelocityX * force * 0.03; 
          windY = mouseVelocityY * force * 0.03;
          
          if (Math.abs(mouseVelocityX) > 5 || Math.abs(mouseVelocityY) > 5) {
             windY -= force * 0.8; 
             particle.rotSpeed += force * 0.02; 
             particle.flipSpeed += force * 0.01; 
          }
        }

        particle.update(windX, windY);
      });

      // Draw detailed connecting lines (constellation/network effect)
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distSq = dx * dx + dy * dy;
          
          // If within ~120px of each other
          if (distSq < 14400) { 
            const dist = Math.sqrt(distSq);
            let opacity = (1 - dist / 120) * 0.25; 
            
            if (isLightMode) {
              // Darker, thicker lines for light mode
              opacity = (1 - dist / 120) * 0.4;
              ctx.strokeStyle = `rgba(50, 70, 120, ${opacity})`;
              ctx.lineWidth = 0.8;
            } else {
              ctx.strokeStyle = `rgba(100, 150, 255, ${opacity})`;
              ctx.lineWidth = 0.5;
            }
            
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Draw the tech logos on top of the lines
      particles.forEach(particle => {
        particle.draw(ctx, isLightMode);
      });

      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="interactive-bg-wrapper">
      <div className="tech-glow-overlay"></div>
      <canvas ref={canvasRef} className="zen-canvas" />
    </div>
  );
};

export default InteractiveBackground;
