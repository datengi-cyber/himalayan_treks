
// 'use client';
// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAuth } from '@/context/AuthContext';
// import api from '@/lib/api';

// export default function BookingWidget({ trek }) {
//   const { user } = useAuth();
//   const router = useRouter();
//   const [form, setForm] = useState({
//     booking_date: '',
//     num_travelers: 1,
//     special_requests: '',
//     emergency_contact: ''
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   const price = trek.discount_price || trek.price;
//   const total = price * form.num_travelers;

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!user) return router.push('/login');
//     setLoading(true);
//     setError('');
//     try {
//       await api.post('/bookings', { trek_id: trek.id, ...form });
//       setSuccess('Booking confirmed!');
//     } catch (err) {
//       setError(err.response?.data?.message || 'Booking failed. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

//         .bw-root { font-family: 'DM Sans', sans-serif; }

//         .bw-card {
//           background: #fff;
//           border-radius: 24px;
//           box-shadow:
//             0 0 0 1px rgba(0,0,0,0.06),
//             0 4px 6px -1px rgba(0,0,0,0.04),
//             0 20px 48px -8px rgba(16,100,60,0.12);
//           overflow: hidden;
//           position: sticky;
//           top: 80px;
//         }

//         /* ── Header ── */
//         .bw-header {
//           background: linear-gradient(135deg, #064e2e 0%, #0d7a48 60%, #16a05f 100%);
//           padding: 28px 28px 24px;
//           position: relative;
//           overflow: hidden;
//         }
//         .bw-header::before {
//           content:''; position:absolute; top:-40px; right:-40px;
//           width:160px; height:160px; border-radius:50%;
//           background:rgba(255,255,255,0.06);
//         }
//         .bw-header::after {
//           content:''; position:absolute; bottom:-20px; left:20px;
//           width:80px; height:80px; border-radius:50%;
//           background:rgba(255,255,255,0.04);
//         }

//         .bw-badge {
//           display:inline-flex; align-items:center; gap:6px;
//           background:rgba(255,255,255,0.15); backdrop-filter:blur(8px);
//           border:1px solid rgba(255,255,255,0.2);
//           color:#d1fae5; font-size:11px; font-weight:600;
//           letter-spacing:.08em; text-transform:uppercase;
//           padding:4px 10px; border-radius:99px; margin-bottom:14px;
//         }
//         .bw-badge-dot {
//           width:6px; height:6px; background:#6ee7b7; border-radius:50%;
//           animation: blink 2s ease-in-out infinite;
//         }
//         @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }

//         .bw-price-strike {
//           color:rgba(255,255,255,.45); font-size:15px;
//           text-decoration:line-through; font-weight:400;
//         }
//         .bw-price-main {
//           font-family:'DM Serif Display',serif; font-size:48px;
//           color:#fff; line-height:1;
//           display:flex; align-items:baseline; gap:6px; margin:4px 0;
//         }
//         .bw-price-currency { font-size:24px; font-family:'DM Sans',sans-serif; font-weight:300; opacity:.8; }
//         .bw-price-per { font-size:13px; font-family:'DM Sans',sans-serif; font-weight:400; color:rgba(255,255,255,.6); margin-left:2px; }
//         .bw-savings {
//           display:inline-block; background:#f0fdf4; color:#15803d;
//           font-size:11px; font-weight:600; padding:2px 8px; border-radius:99px; margin-top:6px;
//         }

//         /* ── Body ── */
//         .bw-body { padding:24px 28px 28px; }

//         /* Trust row */
//         .bw-trust-row { display:flex; gap:8px; margin-bottom:20px; }
//         .bw-trust-item {
//           flex:1; display:flex; flex-direction:column; align-items:center; gap:4px;
//           background:#f9fafb; border-radius:10px; padding:10px 6px;
//           font-size:10px; font-weight:600; color:#4b5563;
//           letter-spacing:.03em; text-transform:uppercase; text-align:center;
//         }
//         .bw-trust-item span:first-child { font-size:16px; }

//         /* Fields */
//         .bw-field { margin-bottom:16px; }
//         .bw-label {
//           display:flex; align-items:center; gap:6px;
//           font-size:11px; font-weight:600; letter-spacing:.07em;
//           text-transform:uppercase; color:#6b7280; margin-bottom:7px;
//         }
//         .bw-label-icon { font-size:13px; opacity:.7; }
//         .bw-input, .bw-textarea {
//           width:100%; border:1.5px solid #e5e7eb; border-radius:12px;
//           padding:11px 14px; font-size:14px; font-family:'DM Sans',sans-serif;
//           color:#111827; background:#fafafa;
//           transition:all .2s ease; box-sizing:border-box; outline:none;
//         }
//         .bw-input:focus, .bw-textarea:focus {
//           border-color:#059669; background:#fff;
//           box-shadow:0 0 0 3px rgba(5,150,105,.10);
//         }
//         .bw-input::placeholder, .bw-textarea::placeholder { color:#9ca3af; }
//         .bw-textarea { resize:none; min-height:72px; }

//         /* Traveler stepper */
//         .bw-travelers-row {
//           display:flex; align-items:center;
//           border:1.5px solid #e5e7eb; border-radius:12px;
//           background:#fafafa; overflow:hidden; transition:all .2s ease;
//         }
//         .bw-travelers-row:focus-within {
//           border-color:#059669; background:#fff;
//           box-shadow:0 0 0 3px rgba(5,150,105,.10);
//         }
//         .bw-travelers-btn {
//           width:44px; height:44px; display:flex; align-items:center; justify-content:center;
//           background:none; border:none; cursor:pointer; font-size:20px; color:#374151;
//           transition:background .15s; flex-shrink:0;
//         }
//         .bw-travelers-btn:hover:not(:disabled) { background:#f3f4f6; color:#059669; }
//         .bw-travelers-btn:disabled { opacity:.3; cursor:not-allowed; }
//         .bw-travelers-count { flex:1; text-align:center; font-size:15px; font-weight:600; color:#111827; }
//         .bw-travelers-max { font-size:11px; color:#9ca3af; margin-right:10px; }

//         /* Breakdown */
//         .bw-breakdown {
//           background:linear-gradient(135deg,#f0fdf4,#ecfdf5);
//           border:1px solid #d1fae5; border-radius:14px;
//           padding:16px; margin-bottom:18px;
//         }
//         .bw-breakdown-row {
//           display:flex; justify-content:space-between; align-items:center;
//           font-size:13px; color:#6b7280; padding:2px 0;
//         }
//         .bw-breakdown-total {
//           display:flex; justify-content:space-between; align-items:center;
//           padding-top:10px; margin-top:8px; border-top:1px dashed #a7f3d0;
//         }
//         .bw-breakdown-total-label { font-size:14px; font-weight:600; color:#065f46; }
//         .bw-breakdown-total-amount { font-family:'DM Serif Display',serif; font-size:22px; color:#065f46; }

//         /* Error */
//         .bw-error {
//           background:#fff1f2; border:1px solid #fecdd3; color:#be123c;
//           font-size:13px; padding:10px 14px; border-radius:10px;
//           margin-bottom:14px; display:flex; align-items:center; gap:6px;
//         }

//         /* CTA */
//         .bw-btn {
//           width:100%;
//           background:linear-gradient(135deg,#059669 0%,#047857 100%);
//           color:#fff; font-family:'DM Sans',sans-serif;
//           font-size:15px; font-weight:600; padding:15px 24px;
//           border:none; border-radius:14px; cursor:pointer;
//           transition:all .25s ease; position:relative; overflow:hidden;
//           letter-spacing:.01em;
//           box-shadow:0 4px 14px rgba(5,150,105,.35);
//         }
//         .bw-btn::before {
//           content:''; position:absolute; inset:0;
//           background:linear-gradient(135deg,rgba(255,255,255,.15) 0%,transparent 60%);
//           pointer-events:none;
//         }
//         .bw-btn:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 6px 20px rgba(5,150,105,.45); }
//         .bw-btn:active:not(:disabled) { transform:translateY(0); }
//         .bw-btn:disabled { background:linear-gradient(135deg,#9ca3af,#6b7280); box-shadow:none; cursor:not-allowed; transform:none; }

//         .bw-btn-loading { display:flex; align-items:center; justify-content:center; gap:8px; }
//         .bw-spinner {
//           width:16px; height:16px; border:2px solid rgba(255,255,255,.3);
//           border-top-color:#fff; border-radius:50%;
//           animation:spin .7s linear infinite;
//         }
//         @keyframes spin { to { transform:rotate(360deg); } }

//         .bw-footer-note {
//           display:flex; align-items:center; justify-content:center; gap:6px;
//           margin-top:12px; font-size:12px; color:#9ca3af;
//         }

//         /* Success */
//         .bw-success { padding:32px 24px; text-align:center; }
//         .bw-success-icon {
//           width:64px; height:64px;
//           background:linear-gradient(135deg,#d1fae5,#a7f3d0);
//           border-radius:50%; display:flex; align-items:center; justify-content:center;
//           margin:0 auto 16px; font-size:28px;
//         }
//         .bw-success-title { font-family:'DM Serif Display',serif; font-size:22px; color:#065f46; margin-bottom:8px; }
//         .bw-success-sub { font-size:13px; color:#6b7280; line-height:1.5; }
//       `}</style>

//       <div className="bw-root">
//         <div className="bw-card">

//           {/* ── Header ── */}
//           <div className="bw-header">
//             <div className="bw-badge">
//               <div className="bw-badge-dot" />
//               Available Now
//             </div>

//             {trek.discount_price && (
//               <div className="bw-price-strike">${trek.price} /person</div>
//             )}

//             <div className="bw-price-main">
//               <span className="bw-price-currency">$</span>
//               {price}
//               <span className="bw-price-per">/person</span>
//             </div>

//             {trek.discount_price && (
//               <div className="bw-savings">
//                 Save ${((trek.price - trek.discount_price) * form.num_travelers).toFixed(0)} on this booking
//               </div>
//             )}
//           </div>

//           {/* ── Body ── */}
//           <div className="bw-body">
//             {success ? (
//               <div className="bw-success">
//                 <div className="bw-success-icon">✓</div>
//                 <div className="bw-success-title">You're all set!</div>
//                 <p className="bw-success-sub">
//                   Your trek is booked. Check <strong>My Bookings</strong> for details — we'll reach out to confirm soon.
//                 </p>
//               </div>
//             ) : (
//               <>
//                 {/* Trust badges */}
//                 <div className="bw-trust-row">
//                   <div className="bw-trust-item"><span>🔒</span><span>Secure</span></div>
//                   <div className="bw-trust-item"><span>💳</span><span>Pay Later</span></div>
//                   <div className="bw-trust-item"><span>✅</span><span>Free Cancel</span></div>
//                 </div>

//                 <form onSubmit={handleSubmit}>
//                   {/* Date */}
//                   <div className="bw-field">
//                     <div className="bw-label"><span className="bw-label-icon">📅</span> Trek Start Date</div>
//                     <input
//                       type="date" required
//                       min={new Date().toISOString().split('T')[0]}
//                       className="bw-input"
//                       value={form.booking_date}
//                       onChange={e => setForm(f => ({ ...f, booking_date: e.target.value }))}
//                     />
//                   </div>

//                   {/* Travelers stepper */}
//                   <div className="bw-field">
//                     <div className="bw-label"><span className="bw-label-icon">👥</span> Travelers</div>
//                     <div className="bw-travelers-row">
//                       <button type="button" className="bw-travelers-btn"
//                         disabled={form.num_travelers <= 1}
//                         onClick={() => setForm(f => ({ ...f, num_travelers: Math.max(1, f.num_travelers - 1) }))}>
//                         −
//                       </button>
//                       <div className="bw-travelers-count">{form.num_travelers}</div>
//                       <span className="bw-travelers-max">max {trek.max_group_size}</span>
//                       <button type="button" className="bw-travelers-btn"
//                         disabled={form.num_travelers >= trek.max_group_size}
//                         onClick={() => setForm(f => ({ ...f, num_travelers: Math.min(trek.max_group_size, f.num_travelers + 1) }))}>
//                         +
//                       </button>
//                     </div>
//                   </div>

//                   {/* Emergency Contact */}
//                   <div className="bw-field">
//                     <div className="bw-label"><span className="bw-label-icon">🆘</span> Emergency Contact</div>
//                     <input type="text" placeholder="Name & phone number" className="bw-input"
//                       value={form.emergency_contact}
//                       onChange={e => setForm(f => ({ ...f, emergency_contact: e.target.value }))} />
//                   </div>

//                   {/* Special Requests */}
//                   <div className="bw-field">
//                     <div className="bw-label">
//                       <span className="bw-label-icon">✏️</span> Special Requests
//                       <span style={{ textTransform:'none', fontWeight:400, color:'#9ca3af', marginLeft:4 }}>— optional</span>
//                     </div>
//                     <textarea placeholder="Dietary needs, accessibility, gear preferences…" className="bw-textarea"
//                       value={form.special_requests}
//                       onChange={e => setForm(f => ({ ...f, special_requests: e.target.value }))} />
//                   </div>

//                   {/* Price breakdown */}
//                   <div className="bw-breakdown">
//                     <div className="bw-breakdown-row">
//                       <span>${price} × {form.num_travelers} person{form.num_travelers > 1 ? 's' : ''}</span>
//                       <span>${(price * form.num_travelers).toFixed(2)}</span>
//                     </div>
//                     {trek.discount_price && (
//                       <div className="bw-breakdown-row" style={{ color:'#059669' }}>
//                         <span>Discount applied</span>
//                         <span>−${((trek.price - trek.discount_price) * form.num_travelers).toFixed(2)}</span>
//                       </div>
//                     )}
//                     <div className="bw-breakdown-total">
//                       <span className="bw-breakdown-total-label">Total Due</span>
//                       <span className="bw-breakdown-total-amount">${total.toFixed(2)}</span>
//                     </div>
//                   </div>

//                   {error && <div className="bw-error"><span>⚠️</span> {error}</div>}

//                   <button type="submit" disabled={loading} className="bw-btn">
//                     {loading ? (
//                       <span className="bw-btn-loading">
//                         <span className="bw-spinner" />
//                         Confirming your booking…
//                       </span>
//                     ) : user ? `Reserve for $${total.toFixed(2)}` : 'Log in to Book'}
//                   </button>

//                   <div className="bw-footer-note">
//                     <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                       <circle cx="12" cy="12" r="10"/>
//                       <line x1="12" y1="8" x2="12" y2="12"/>
//                       <line x1="12" y1="16" x2="12.01" y2="16"/>
//                     </svg>
//                     No payment now · We'll contact you to confirm
//                   </div>
//                 </form>
//               </>
//             )}
//           </div>

//         </div>
//       </div>
//     </>
//   );
// }

'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

export default function BookingWidget({ trek }) {
  const { user } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    booking_date: '',
    num_travelers: 1,
    special_requests: '',
    emergency_contact: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const price = trek.discount_price || trek.price;
  const total = price * form.num_travelers;
  const inclusions = trek.inclusions?.length
    ? trek.inclusions
    : [
        'Licensed trekking guide & porters',
        'Permits & conservation fees',
        'Accommodation during the trek',
        'Airport pickup & drop-off',
      ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return router.push('/login');
    setLoading(true);
    setError('');
    try {
      await api.post('/bookings', { trek_id: trek.id, ...form });
      setSuccess('Booking confirmed!');
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadItinerary = () => {
    if (trek.itinerary_pdf_url) {
      window.open(trek.itinerary_pdf_url, '_blank');
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');

        .bw-root { font-family: 'Inter', sans-serif; }

        .bw-card {
          background: #192851;
          border-radius: 18px;
          box-shadow:
            0 0 0 1px rgba(16,26,56,0.08),
            0 24px 56px -12px rgba(16,26,56,0.35);
          overflow: hidden;
          position: sticky;
          top: 32px;
        }

        /* ── Header ── */
        .bw-header {
          padding: 30px 28px 26px;
          position: relative;
          overflow: hidden;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .bw-header::before {
          content:''; position:absolute; top:-50px; right:-50px;
          width:180px; height:180px; border-radius:50%;
          background:rgba(255,255,255,0.04);
        }

        .bw-difficulty-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }

        .bw-pill {
          font-size: 10.5px; font-weight: 600;
          letter-spacing:.06em; text-transform:uppercase;
          padding: 4px 10px; border-radius: 99px;
          background: rgba(255,255,255,0.08);
          color: #cdd6ec;
          border: 1px solid rgba(255,255,255,0.1);
        }

        .bw-price-strike {
          color:rgba(255,255,255,.4); font-size:14px;
          text-decoration:line-through; font-weight:400;
        }
        .bw-price-main {
          font-family:'Playfair Display',serif; font-size:42px;
          color:#fff; line-height:1; font-weight: 600;
          display:flex; align-items:baseline; gap:5px; margin:4px 0;
        }
        .bw-price-currency { font-size:22px; font-family:'Inter',sans-serif; font-weight:300; opacity:.75; }
        .bw-price-per { font-size:13px; font-family:'Inter',sans-serif; font-weight:400; color:rgba(255,255,255,.55); margin-left:2px; }
        .bw-savings {
          display:inline-block; background:rgba(79,122,94,0.22); color:#9ed4b1;
          font-size:11px; font-weight:600; padding:3px 9px; border-radius:99px; margin-top:8px;
        }

        /* ── Body ── */
        .bw-body { padding:24px 28px 28px; background: #fff; }

        /* Trust row */
        .bw-trust-row { display:flex; gap:8px; margin-bottom:22px; }
        .bw-trust-item {
          flex:1; display:flex; flex-direction:column; align-items:center; gap:5px;
          background:#f7f6f2; border-radius:10px; padding:11px 6px;
          font-size:9.5px; font-weight:600; color:#5b6270;
          letter-spacing:.03em; text-transform:uppercase; text-align:center;
        }
        .bw-trust-item span:first-child { font-size:16px; }

        /* Fields */
        .bw-field { margin-bottom:16px; }
        .bw-label {
          display:flex; align-items:center; gap:6px;
          font-size:11px; font-weight:600; letter-spacing:.07em;
          text-transform:uppercase; color:#6b7280; margin-bottom:7px;
        }
        .bw-label-icon { font-size:13px; opacity:.7; }
        .bw-input, .bw-textarea {
          width:100%; border:1.5px solid #e6e4dd; border-radius:11px;
          padding:11px 14px; font-size:14px; font-family:'Inter',sans-serif;
          color:#2b2f36; background:#fbfaf7;
          transition:all .2s ease; box-sizing:border-box; outline:none;
        }
        .bw-input:focus, .bw-textarea:focus {
          border-color:#2f5dd0; background:#fff;
          box-shadow:0 0 0 3px rgba(47,93,208,.10);
        }
        .bw-input::placeholder, .bw-textarea::placeholder { color:#9ca3af; }
        .bw-textarea { resize:none; min-height:68px; }

        /* Traveler stepper */
        .bw-travelers-row {
          display:flex; align-items:center;
          border:1.5px solid #e6e4dd; border-radius:11px;
          background:#fbfaf7; overflow:hidden; transition:all .2s ease;
        }
        .bw-travelers-row:focus-within {
          border-color:#2f5dd0; background:#fff;
          box-shadow:0 0 0 3px rgba(47,93,208,.10);
        }
        .bw-travelers-btn {
          width:42px; height:42px; display:flex; align-items:center; justify-content:center;
          background:none; border:none; cursor:pointer; font-size:19px; color:#374151;
          transition:background .15s; flex-shrink:0;
        }
        .bw-travelers-btn:hover:not(:disabled) { background:#eef0f5; color:#2f5dd0; }
        .bw-travelers-btn:disabled { opacity:.3; cursor:not-allowed; }
        .bw-travelers-count { flex:1; text-align:center; font-size:15px; font-weight:600; color:#192851; }
        .bw-travelers-max { font-size:10.5px; color:#9ca3af; margin-right:10px; }

        /* Inclusions */
        .bw-inclusions {
          margin-bottom: 18px;
        }
        .bw-inclusions-title {
          font-size: 11px; font-weight: 700; letter-spacing: .07em;
          text-transform: uppercase; color: #4f7a5e; margin-bottom: 10px;
        }
        .bw-inclusions-list {
          list-style: none; margin: 0; padding: 0;
          display: grid; gap: 7px;
        }
        .bw-inclusions-list li {
          display: flex; align-items: flex-start; gap: 8px;
          font-size: 13px; color: #4b5160; line-height: 1.5;
        }
        .bw-inclusions-list li::before {
          content: '✓';
          color: #4f7a5e; font-weight: 700; font-size: 12px; margin-top: 1px;
        }

        /* Breakdown */
        .bw-breakdown {
          background: #f7f6f2;
          border:1px solid #ece9e1; border-radius:13px;
          padding:16px; margin-bottom:18px;
        }
        .bw-breakdown-row {
          display:flex; justify-content:space-between; align-items:center;
          font-size:13px; color:#6b7280; padding:2px 0;
        }
        .bw-breakdown-total {
          display:flex; justify-content:space-between; align-items:center;
          padding-top:10px; margin-top:8px; border-top:1px dashed #d8d4ca;
        }
        .bw-breakdown-total-label { font-size:14px; font-weight:600; color:#192851; }
        .bw-breakdown-total-amount { font-family:'Playfair Display',serif; font-size:21px; color:#192851; font-weight: 600; }

        /* Error */
        .bw-error {
          background:#fbf0f0; border:1px solid #f0d8d8; color:#9c3b3b;
          font-size:13px; padding:10px 14px; border-radius:10px;
          margin-bottom:14px; display:flex; align-items:center; gap:6px;
        }

        /* CTA */
        .bw-btn {
          width:100%;
          background: #2f5dd0;
          color:#fff; font-family:'Inter',sans-serif;
          font-size:15px; font-weight:600; padding:15px 24px;
          border:none; border-radius:12px; cursor:pointer;
          transition:all .25s ease; position:relative;
          letter-spacing:.01em;
          box-shadow:0 6px 16px rgba(47,93,208,.30);
        }
        .bw-btn:hover:not(:disabled) { background:#244ab0; transform:translateY(-1px); box-shadow:0 8px 20px rgba(47,93,208,.4); }
        .bw-btn:active:not(:disabled) { transform:translateY(0); }
        .bw-btn:disabled { background:#a8aebd; box-shadow:none; cursor:not-allowed; transform:none; }

        .bw-btn-loading { display:flex; align-items:center; justify-content:center; gap:8px; }
        .bw-spinner {
          width:16px; height:16px; border:2px solid rgba(255,255,255,.3);
          border-top-color:#fff; border-radius:50%;
          animation:spin .7s linear infinite;
        }
        @keyframes spin { to { transform:rotate(360deg); } }

        .bw-btn-secondary {
          width: 100%;
          background: transparent;
          color: #192851;
          font-family: 'Inter', sans-serif;
          font-size: 13.5px; font-weight: 600;
          padding: 12px 20px;
          border: 1.5px solid #d8d4ca;
          border-radius: 12px;
          cursor: pointer;
          margin-top: 10px;
          transition: all .2s ease;
          display: flex; align-items: center; justify-content: center; gap: 7px;
        }
        .bw-btn-secondary:hover { border-color: #192851; background: #f7f6f2; }

        .bw-footer-note {
          display:flex; align-items:center; justify-content:center; gap:6px;
          margin-top:14px; font-size:11.5px; color:#9ca3af;
        }

        /* Success */
        .bw-success { padding:32px 24px; text-align:center; }
        .bw-success-icon {
          width:64px; height:64px;
          background: #eef4ef;
          border-radius:50%; display:flex; align-items:center; justify-content:center;
          margin:0 auto 16px; font-size:28px; color: #4f7a5e;
        }
        .bw-success-title { font-family:'Playfair Display',serif; font-size:22px; color:#192851; font-weight: 600; margin-bottom:8px; }
        .bw-success-sub { font-size:13px; color:#6b7280; line-height:1.5; }
      `}</style>

      <div className="bw-root">
        <div className="bw-card">

          {/* ── Header ── */}
          <div className="bw-header">
            <div className="bw-difficulty-row">
              <span className="bw-pill">{trek.difficulty}</span>
              {trek.duration_days && <span className="bw-pill">{trek.duration_days} Days</span>}
            </div>

            {trek.discount_price && (
              <div className="bw-price-strike">${trek.price} /person</div>
            )}

            <div className="bw-price-main">
              <span className="bw-price-currency">$</span>
              {price}
              <span className="bw-price-per">/person</span>
            </div>

            {trek.discount_price && (
              <div className="bw-savings">
                Save ${((trek.price - trek.discount_price) * form.num_travelers).toFixed(0)} on this booking
              </div>
            )}
          </div>

          {/* ── Body ── */}
          <div className="bw-body">
            {success ? (
              <div className="bw-success">
                <div className="bw-success-icon">✓</div>
                <div className="bw-success-title">You're all set!</div>
                <p className="bw-success-sub">
                  Your trek is booked. Check <strong>My Bookings</strong> for details — we'll reach out to confirm soon.
                </p>
              </div>
            ) : (
              <>
                {/* Trust badges */}
                <div className="bw-trust-row">
                  <div className="bw-trust-item"><span>🔒</span><span>Secure</span></div>
                  <div className="bw-trust-item"><span>💳</span><span>Pay Later</span></div>
                  <div className="bw-trust-item"><span>✅</span><span>Free Cancel</span></div>
                </div>

                <form onSubmit={handleSubmit}>
                  {/* Date */}
                  <div className="bw-field">
                    <div className="bw-label"><span className="bw-label-icon">📅</span> Departure Date</div>
                    <input
                      type="date" required
                      min={new Date().toISOString().split('T')[0]}
                      className="bw-input"
                      value={form.booking_date}
                      onChange={e => setForm(f => ({ ...f, booking_date: e.target.value }))}
                    />
                  </div>

                  {/* Travelers stepper */}
                  <div className="bw-field">
                    <div className="bw-label"><span className="bw-label-icon">👥</span> Travelers</div>
                    <div className="bw-travelers-row">
                      <button type="button" className="bw-travelers-btn"
                        disabled={form.num_travelers <= 1}
                        onClick={() => setForm(f => ({ ...f, num_travelers: Math.max(1, f.num_travelers - 1) }))}>
                        −
                      </button>
                      <div className="bw-travelers-count">{form.num_travelers}</div>
                      <span className="bw-travelers-max">max {trek.max_group_size}</span>
                      <button type="button" className="bw-travelers-btn"
                        disabled={form.num_travelers >= trek.max_group_size}
                        onClick={() => setForm(f => ({ ...f, num_travelers: Math.min(trek.max_group_size, f.num_travelers + 1) }))}>
                        +
                      </button>
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div className="bw-field">
                    <div className="bw-label"><span className="bw-label-icon">🆘</span> Emergency Contact</div>
                    <input type="text" placeholder="Name & phone number" className="bw-input"
                      value={form.emergency_contact}
                      onChange={e => setForm(f => ({ ...f, emergency_contact: e.target.value }))} />
                  </div>

                  {/* Special Requests */}
                  <div className="bw-field">
                    <div className="bw-label">
                      <span className="bw-label-icon">✏️</span> Special Requests
                      <span style={{ textTransform:'none', fontWeight:400, color:'#9ca3af', marginLeft:4 }}>— optional</span>
                    </div>
                    <textarea placeholder="Dietary needs, accessibility, gear preferences…" className="bw-textarea"
                      value={form.special_requests}
                      onChange={e => setForm(f => ({ ...f, special_requests: e.target.value }))} />
                  </div>

                  {/* Inclusions */}
                  <div className="bw-inclusions">
                    <div className="bw-inclusions-title">Trip Inclusions</div>
                    <ul className="bw-inclusions-list">
                      {inclusions.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Price breakdown */}
                  <div className="bw-breakdown">
                    <div className="bw-breakdown-row">
                      <span>${price} × {form.num_travelers} person{form.num_travelers > 1 ? 's' : ''}</span>
                      <span>${(price * form.num_travelers).toFixed(2)}</span>
                    </div>
                    {trek.discount_price && (
                      <div className="bw-breakdown-row" style={{ color:'#4f7a5e' }}>
                        <span>Discount applied</span>
                        <span>−${((trek.price - trek.discount_price) * form.num_travelers).toFixed(2)}</span>
                      </div>
                    )}
                    <div className="bw-breakdown-total">
                      <span className="bw-breakdown-total-label">Total Due</span>
                      <span className="bw-breakdown-total-amount">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  {error && <div className="bw-error"><span>⚠️</span> {error}</div>}

                  <button type="submit" disabled={loading} className="bw-btn">
                    {loading ? (
                      <span className="bw-btn-loading">
                        <span className="bw-spinner" />
                        Confirming your booking…
                      </span>
                    ) : user ? `Book Now — $${total.toFixed(2)}` : 'Log in to Book'}
                  </button>

                  <button type="button" className="bw-btn-secondary" onClick={handleDownloadItinerary}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download Itinerary
                  </button>

                  <div className="bw-footer-note">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8" x2="12" y2="12"/>
                      <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    No payment now · We'll contact you to confirm
                  </div>
                </form>
              </>
            )}
          </div>

        </div>
      </div>
    </>
  );
}