import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="ft-footer">
      <style>{`
        .ft-footer {
          --ft-navy:       #192851;
          --ft-navy-deep:  #10193a;
          --ft-gold:       #D4A373;
          --ft-gold-light: #E9C9A3;
          --ft-snow:       #F8FAFC;
          --ft-mist:       #A9B4CC;
          --ft-mist-dim:   #7B87A6;
          --ft-font-display: 'Fraunces', Georgia, serif;
          --ft-font-body: 'Inter', system-ui, sans-serif;

          position: relative;
          background: var(--ft-navy);
          color: var(--ft-mist);
          font-family: var(--ft-font-body);
          padding: 5rem 4rem 0;
          overflow: hidden;
        }

        /* thin gold hairline across the very top edge */
        .ft-footer::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, rgba(212,163,115,0.5) 50%, transparent 100%);
        }

        .ft-inner {
          max-width: 1280px;
          margin: 0 auto;
          position: relative;
        }

        .ft-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr 1fr 1.1fr;
          gap: 3rem;
          padding-bottom: 3.5rem;
        }

        /* ── Brand column ── */
        .ft-brand-name {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-family: var(--ft-font-display);
          font-size: 1.4rem;
          font-weight: 600;
          color: var(--ft-snow);
          margin-bottom: 1.1rem;
        }
        .ft-brand-icon { font-size: 1.3rem; line-height: 1; }
        .ft-brand-desc {
          font-size: 0.85rem;
          line-height: 1.8;
          color: var(--ft-mist-dim);
          max-width: 300px;
          margin-bottom: 1.75rem;
        }
        .ft-socials { display: flex; gap: 0.7rem; }
        .ft-social-link {
          display: flex; align-items: center; justify-content: center;
          width: 36px; height: 36px; border-radius: 50%;
          border: 1px solid rgba(212,163,115,0.3);
          color: var(--ft-gold-light);
          transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        .ft-social-link:hover {
          background: var(--ft-gold);
          border-color: var(--ft-gold);
          color: var(--ft-navy-deep);
          transform: translateY(-3px);
        }

        /* ── Link columns ── */
        .ft-col-title {
          font-family: var(--ft-font-body);
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--ft-snow);
          margin-bottom: 1.4rem;
          position: relative;
          padding-bottom: 0.85rem;
        }
        .ft-col-title::after {
          content: '';
          position: absolute; left: 0; bottom: 0;
          width: 28px; height: 2px;
          background: var(--ft-gold);
        }
        .ft-list { list-style: none; display: flex; flex-direction: column; gap: 0.85rem; }
        .ft-link {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.85rem;
          color: var(--ft-mist);
          text-decoration: none;
          transition: color 0.25s ease, gap 0.25s ease;
          width: fit-content;
        }
        .ft-link::before {
          content: '';
          width: 0px;
          height: 1px;
          background: var(--ft-gold);
          transition: width 0.25s ease;
        }
        .ft-link:hover {
          color: var(--ft-gold-light);
        }
        .ft-link:hover::before {
          width: 12px;
        }

        /* ── Contact column ── */
        .ft-contact-item {
          display: flex;
          align-items: flex-start;
          gap: 0.65rem;
          font-size: 0.85rem;
          color: var(--ft-mist);
          line-height: 1.5;
        }
        .ft-contact-item:not(:last-child) { margin-bottom: 1rem; }
        .ft-contact-icon {
          flex-shrink: 0;
          color: var(--ft-gold);
          margin-top: 0.15rem;
        }
        .ft-contact-item a {
          color: var(--ft-mist);
          text-decoration: none;
          transition: color 0.25s ease;
        }
        .ft-contact-item a:hover { color: var(--ft-gold-light); }

        /* ── Bottom bar ── */
        .ft-bottom {
          border-top: 1px solid rgba(248,250,252,0.08);
          padding: 1.6rem 0 1.75rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .ft-copyright {
          font-size: 0.78rem;
          color: var(--ft-mist-dim);
        }
        .ft-legal {
          display: flex;
          gap: 1.75rem;
        }
        .ft-legal a {
          font-size: 0.78rem;
          color: var(--ft-mist-dim);
          text-decoration: none;
          transition: color 0.25s ease;
        }
        .ft-legal a:hover { color: var(--ft-gold-light); }

        /* ═══ RESPONSIVE ═══ */
        @media (max-width: 1024px) {
          .ft-footer { padding: 4rem 2.5rem 0; }
          .ft-grid {
            grid-template-columns: 1fr 1fr;
            row-gap: 2.75rem;
          }
        }

        @media (max-width: 640px) {
          .ft-footer { padding: 3rem 1.25rem 0; }
          .ft-grid {
            grid-template-columns: 1fr;
            gap: 2.5rem;
            padding-bottom: 2.5rem;
          }
          .ft-brand-desc { max-width: 100%; }
          .ft-bottom {
            flex-direction: column;
            align-items: flex-start;
            padding: 1.5rem 0 2rem;
          }
          .ft-legal { gap: 1.25rem; }
        }
      `}</style>

      <div className="ft-inner">
        <div className="ft-grid">

          <div>
            <div className="ft-brand-name">
              <span className="ft-brand-icon">🏔️</span>
              Himalaya Treks
            </div>
            <p className="ft-brand-desc">
              Your trusted partner for world-class trekking adventures in Nepal.
              Safe, sustainable, and unforgettable.
            </p>
            <div className="ft-socials">
              <a href="#" className="ft-social-link" aria-label="Facebook">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22 12.06C22 6.51 17.52 2 12 2S2 6.51 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94Z"/>
                </svg>
              </a>
              <a href="#" className="ft-social-link" aria-label="Instagram">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
                  <circle cx="12" cy="12" r="4.4" />
                  <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a href="#" className="ft-social-link" aria-label="YouTube">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.5 6.2a3.02 3.02 0 0 0-2.13-2.14C19.4 3.5 12 3.5 12 3.5s-7.4 0-9.37.56A3.02 3.02 0 0 0 .5 6.2 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.8 3.02 3.02 0 0 0 2.13 2.14C4.6 20.5 12 20.5 12 20.5s7.4 0 9.37-.56a3.02 3.02 0 0 0 2.13-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.8ZM9.6 15.6V8.4L15.8 12Z"/>
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="ft-col-title">Popular Treks</h4>
            <ul className="ft-list">
              <li><Link href="/treks/everest-base-camp" className="ft-link">Everest Base Camp</Link></li>
              <li><Link href="/treks/annapurna-circuit" className="ft-link">Annapurna Circuit</Link></li>
              <li><Link href="/treks/langtang-valley" className="ft-link">Langtang Valley</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="ft-col-title">Company</h4>
            <ul className="ft-list">
              <li><Link href="/about" className="ft-link">About Us</Link></li>
              <li><Link href="/blog" className="ft-link">Blog</Link></li>
              <li><Link href="/contact" className="ft-link">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="ft-col-title">Contact</h4>
            <div className="ft-contact-item">
              <svg className="ft-contact-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>Thamel, Kathmandu, Nepal</span>
               <span>Nganag pasnag Sherpa</span>
            </div>
            <div className="ft-contact-item">
              <svg className="ft-contact-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z"/></svg>
              <a href="tel:+9779800000000">9841077436</a>
            </div>
            <div className="ft-contact-item">
              <svg className="ft-contact-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 6 10-6"/></svg>
              <a href="mailto:info@himalayatreks.com">info@himalayatreks.com</a>
            </div>
          </div>

        </div>

        <div className="ft-bottom">
          <span className="ft-copyright">
            © {new Date().getFullYear()} Himalaya Treks. All rights reserved.
          </span>
          <div className="ft-legal">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}