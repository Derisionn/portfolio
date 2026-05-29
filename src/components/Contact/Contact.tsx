import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import './Contact.css';

// ─────────────────────────────────────────────
//  EmailJS credentials
//  1. Sign up free at https://www.emailjs.com
//  2. Create an Email Service (e.g. Gmail) → copy the Service ID
//  3. Create an Email Template            → copy the Template ID
//  4. Go to Account → API Keys           → copy the Public Key
//  Then replace the three placeholders below.
// ─────────────────────────────────────────────
const EMAILJS_SERVICE_ID  = 'service_ln49wyp';
const EMAILJS_TEMPLATE_ID = 'template_arsshqc';
const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';

type Status = 'idle' | 'sending' | 'success' | 'error';

const Contact: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<Status>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    setStatus('sending');

    try {
      await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        formRef.current,
        { publicKey: EMAILJS_PUBLIC_KEY }
      );
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      console.error('EmailJS error:', err);
      setStatus('error');
    }
  };

  return (
    <section className="contact section" id="contact">
      <h2 className="title">Get In Touch</h2>
      <div className="contact-container">
        <div className="contact-info">
          <h3>Ready to build something extraordinary? 🚀</h3>
          <p>My inbox is always open. Whether you have an exciting project in mind, need a passionate developer to join your mission, or just want to talk code over a virtual coffee—let's connect!</p>
          <div className="info-items">
            <div className="info-item">
              <span className="icon">✉</span>
              <p>harshvardhan8630466531@gmail.com</p>
            </div>
            <div className="info-item">
              <span className="icon">📞</span>
              <p>+91 8630466531</p>
            </div>
            <div className="info-item">
              <span className="icon">📍</span>
              <p>Delhi, India</p>
            </div>
          </div>
        </div>

        <form ref={formRef} className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={status === 'sending'}
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={status === 'sending'}
            />
          </div>
          <div className="form-group">
            <textarea
              name="message"
              placeholder="Your Message"
              rows={5}
              value={formData.message}
              onChange={handleChange}
              required
              disabled={status === 'sending'}
            ></textarea>
          </div>

          <button
            type="submit"
            className={`btn btn-primary submit-btn ${status === 'sending' ? 'sending' : ''}`}
            disabled={status === 'sending'}
          >
            {status === 'sending' ? (
              <><span className="spinner"></span> Sending…</>
            ) : (
              'Send Message ✈'
            )}
          </button>

          {status === 'success' && (
            <div className="form-feedback success">
              ✅ Message sent! I'll get back to you shortly.
            </div>
          )}
          {status === 'error' && (
            <div className="form-feedback error">
              ❌ Something went wrong. Please try again or email me directly.
            </div>
          )}
        </form>
      </div>
    </section>
  );
};

export default Contact;
