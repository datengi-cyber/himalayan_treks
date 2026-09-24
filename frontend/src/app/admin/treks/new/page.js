

// 'use client';
// import { useState, useEffect, useRef } from 'react';
// import { useRouter } from 'next/navigation';
// import api from '@/lib/api';

// const difficulties = ['easy', 'moderate', 'challenging', 'extreme'];
// const regions = ['Everest', 'Annapurna', 'Langtang', 'Manaslu', 'Mustang', 'Other'];

// let uidCounter = 0;
// const nextId = () => `img-${Date.now()}-${uidCounter++}`;

// export default function NewTrekPage() {
//   const router = useRouter();
//   const [form, setForm] = useState({
//     title: '', slug: '', description: '', region: '',
//     difficulty: 'moderate', duration_days: '', max_altitude: '',
//     price: '', discount_price: '', max_group_size: 12,
//     is_featured: false, meta_title: '', meta_description: '',
//     highlights: ''
//   });

//   // ── Cover image state (single, required) ──────────────
//   const [coverFile, setCoverFile] = useState(null);
//   const [coverPreview, setCoverPreview] = useState(null);
//   const coverInputRef = useRef(null);

//   // ── Gallery images state (multiple, optional) ──────────
//   // Each item: { id, file, preview }
//   const [galleryImages, setGalleryImages] = useState([]);
//   const galleryInputRef = useRef(null);

//   // Drag-and-drop reorder refs
//   const dragItemIndex = useRef(null);
//   const dragOverIndex = useRef(null);
//   const [draggingId, setDraggingId] = useState(null);

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   // Auto-generate slug from title
//   const handleTitleChange = (e) => {
//     const title = e.target.value;
//     const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
//     setForm(f => ({ ...f, title, slug }));
//   };

//   // ── Cover image handlers ────────────────────────────────
//   const handleCoverChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     if (coverPreview) URL.revokeObjectURL(coverPreview);
//     setCoverFile(file);
//     setCoverPreview(URL.createObjectURL(file));
//     e.target.value = ''; // allow reselecting the same file later
//   };

//   const removeCover = () => {
//     if (coverPreview) URL.revokeObjectURL(coverPreview);
//     setCoverFile(null);
//     setCoverPreview(null);
//   };

//   // ── Gallery handlers ────────────────────────────────────
//   // IMPORTANT: append to previous state, never overwrite
//   const handleGalleryChange = (e) => {
//     const files = Array.from(e.target.files);
//     if (files.length === 0) return;

//     const newItems = files.map(file => ({
//       id: nextId(),
//       file,
//       preview: URL.createObjectURL(file),
//     }));

//     setGalleryImages(prev => [...prev, ...newItems]);
//     e.target.value = ''; // reset input so picking the same files again still fires onChange
//   };

//   const removeGalleryImage = (id) => {
//     setGalleryImages(prev => {
//       const target = prev.find(img => img.id === id);
//       if (target) URL.revokeObjectURL(target.preview);
//       return prev.filter(img => img.id !== id);
//     });
//   };

//   const moveGalleryImage = (index, direction) => {
//     setGalleryImages(prev => {
//       const newIndex = index + direction;
//       if (newIndex < 0 || newIndex >= prev.length) return prev;
//       const newArr = [...prev];
//       [newArr[index], newArr[newIndex]] = [newArr[newIndex], newArr[index]];
//       return newArr;
//     });
//   };

//   const handleDragStart = (index) => {
//     dragItemIndex.current = index;
//     setDraggingId(galleryImages[index].id);
//   };
//   const handleDragEnter = (index) => {
//     dragOverIndex.current = index;
//   };
//   const handleDragEnd = () => {
//     const from = dragItemIndex.current;
//     const to = dragOverIndex.current;
//     if (from !== null && to !== null && from !== to) {
//       setGalleryImages(prev => {
//         const newArr = [...prev];
//         const [moved] = newArr.splice(from, 1);
//         newArr.splice(to, 0, moved);
//         return newArr;
//       });
//     }
//     dragItemIndex.current = null;
//     dragOverIndex.current = null;
//     setDraggingId(null);
//   };

//   // Clean up object URLs on unmount
//   useEffect(() => {
//     return () => {
//       if (coverPreview) URL.revokeObjectURL(coverPreview);
//       galleryImages.forEach(img => URL.revokeObjectURL(img.preview));
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');

//     if (!coverFile) {
//       setError('Please select a cover image.');
//       return;
//     }

//     setLoading(true);
//     try {
//       // Step 1: Create the trek
//       const trekRes = await api.post('/treks', {
//         ...form,
//         duration_days: parseInt(form.duration_days),
//         max_altitude: form.max_altitude ? parseInt(form.max_altitude) : null,
//         price: parseFloat(form.price),
//         discount_price: form.discount_price ? parseFloat(form.discount_price) : null,
//         highlights: form.highlights
//           ? form.highlights.split('\n').filter(Boolean)
//           : null,
//       });

//       const trekId = trekRes.data.data.id;

//       // Step 2: Upload cover image first (sort_order 0, is_cover true)
//       const coverFormData = new FormData();
//       coverFormData.append('image', coverFile);
//       coverFormData.append('is_cover', 'true');
//       coverFormData.append('sort_order', '0');
//       coverFormData.append('caption', coverFile.name);
//       await api.post(`/images/trek/${trekId}`, coverFormData);

//       // Step 3: Upload gallery images (sort_order starting at 1)
//       for (let i = 0; i < galleryImages.length; i++) {
//         const formData = new FormData();
//         formData.append('image', galleryImages[i].file);
//         formData.append('is_cover', 'false');
//         formData.append('sort_order', String(i + 1));
//         formData.append('caption', galleryImages[i].file.name);
//         await api.post(`/images/trek/${trekId}`, formData);
//       }

//       router.push('/admin/treks');
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to create trek.');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-4xl">
//       <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Add New Trek</h1>

//       {error && (
//         <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-6">{error}</div>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-8">

//         {/* Basic Info */}
//         <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
//           <h2 className="text-lg font-bold text-gray-900 border-b pb-3">Basic Information</h2>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//             <div className="md:col-span-2">
//               <label className="block text-sm font-semibold text-gray-700 mb-1">Trek Title *</label>
//               <input
//                 type="text" required
//                 className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
//                 value={form.title}
//                 onChange={handleTitleChange}
//                 placeholder="e.g. Everest Base Camp Trek"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-1">URL Slug *</label>
//               <input
//                 type="text" required
//                 className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-gray-50"
//                 value={form.slug}
//                 onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
//                 placeholder="auto-generated from title"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-1">Region *</label>
//               <select
//                 required
//                 className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
//                 value={form.region}
//                 onChange={e => setForm(f => ({ ...f, region: e.target.value }))}
//               >
//                 <option value="">Select Region</option>
//                 {regions.map(r => <option key={r} value={r}>{r}</option>)}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-1">Difficulty *</label>
//               <select
//                 className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
//                 value={form.difficulty}
//                 onChange={e => setForm(f => ({ ...f, difficulty: e.target.value }))}
//               >
//                 {difficulties.map(d => (
//                   <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-1">Duration (days) *</label>
//               <input
//                 type="number" required min="1"
//                 className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
//                 value={form.duration_days}
//                 onChange={e => setForm(f => ({ ...f, duration_days: e.target.value }))}
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-1">Max Altitude (m)</label>
//               <input
//                 type="number"
//                 className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
//                 value={form.max_altitude}
//                 onChange={e => setForm(f => ({ ...f, max_altitude: e.target.value }))}
//                 placeholder="e.g. 5364"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-1">Price (USD) *</label>
//               <input
//                 type="number" required min="0" step="0.01"
//                 className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
//                 value={form.price}
//                 onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-1">Discounted Price (optional)</label>
//               <input
//                 type="number" min="0" step="0.01"
//                 className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
//                 value={form.discount_price}
//                 onChange={e => setForm(f => ({ ...f, discount_price: e.target.value }))}
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-1">Max Group Size</label>
//               <input
//                 type="number" min="1"
//                 className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
//                 value={form.max_group_size}
//                 onChange={e => setForm(f => ({ ...f, max_group_size: e.target.value }))}
//               />
//             </div>

//             <div className="flex items-center gap-3 pt-6">
//               <input
//                 type="checkbox" id="featured"
//                 className="w-4 h-4 text-emerald-600"
//                 checked={form.is_featured}
//                 onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))}
//               />
//               <label htmlFor="featured" className="text-sm font-semibold text-gray-700">
//                 Feature this trek on homepage
//               </label>
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-1">Description *</label>
//             <textarea
//               required rows={5}
//               className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
//               value={form.description}
//               onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
//               placeholder="Full description of the trek..."
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-1">
//               Highlights <span className="text-gray-400 font-normal">(one per line)</span>
//             </label>
//             <textarea
//               rows={4}
//               className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
//               value={form.highlights}
//               onChange={e => setForm(f => ({ ...f, highlights: e.target.value }))}
//               placeholder={"Stand at Everest Base Camp 5,364m\nVisit Tengboche Monastery\nCross Cho La Pass"}
//             />
//           </div>
//         </div>

//         {/* Cover Image */}
//         <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
//           <h2 className="text-lg font-bold text-gray-900 border-b pb-3">
//             Cover Image <span className="text-red-500">*</span>
//           </h2>
//           <p className="text-xs text-gray-400 -mt-2">
//             Used for the trek listing card, hero banner, and SEO/OpenGraph image.
//           </p>

//           {!coverPreview ? (
//             <div
//               className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center text-gray-500 cursor-pointer hover:border-emerald-400 transition"
//               onClick={() => coverInputRef.current?.click()}
//             >
//               Click to select a cover image
//               <input
//                 ref={coverInputRef}
//                 type="file"
//                 accept="image/*"
//                 className="hidden"
//                 onChange={handleCoverChange}
//               />
//             </div>
//           ) : (
//             <div className="relative w-64">
//               <img
//                 src={coverPreview}
//                 alt="Cover preview"
//                 className="w-64 h-40 object-cover rounded-xl border-2 border-emerald-500"
//               />
//               <span className="absolute top-2 left-2 bg-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
//                 Cover
//               </span>
//               <div className="flex gap-2 mt-2">
//                 <button
//                   type="button"
//                   onClick={() => coverInputRef.current?.click()}
//                   className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
//                 >
//                   Replace
//                 </button>
//                 <input
//                   ref={coverInputRef}
//                   type="file"
//                   accept="image/*"
//                   className="hidden"
//                   onChange={handleCoverChange}
//                 />
//                 <button
//                   type="button"
//                   onClick={removeCover}
//                   className="text-sm font-semibold text-red-500 hover:text-red-600"
//                 >
//                   Remove
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Gallery Images */}
//         <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
//           <h2 className="text-lg font-bold text-gray-900 border-b pb-3">
//             Gallery Images <span className="text-gray-400 font-normal text-sm">(optional, uploaded to Cloudinary)</span>
//           </h2>

//           <div
//             className="w-full border-2 border-dashed border-gray-300 rounded-xl p-6 text-center text-gray-500 cursor-pointer hover:border-emerald-400 transition"
//             onClick={() => galleryInputRef.current?.click()}
//           >
//             Click to add gallery images — you can select more later without losing what you've already added.
//             <input
//               ref={galleryInputRef}
//               type="file"
//               accept="image/*"
//               multiple
//               className="hidden"
//               onChange={handleGalleryChange}
//             />
//           </div>

//           {galleryImages.length > 0 && (
//             <>
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
//                 {galleryImages.map((img, i) => (
//                   <div
//                     key={img.id}
//                     draggable
//                     onDragStart={() => handleDragStart(i)}
//                     onDragEnter={() => handleDragEnter(i)}
//                     onDragOver={(e) => e.preventDefault()}
//                     onDragEnd={handleDragEnd}
//                     className={`relative rounded-xl overflow-hidden border-2 border-gray-200 transition cursor-move ${
//                       draggingId === img.id ? 'opacity-40' : ''
//                     }`}
//                   >
//                     <img
//                       src={img.preview}
//                       alt={img.file.name}
//                       className="w-full h-28 object-cover"
//                     />
//                     <span className="absolute top-1 left-1 bg-gray-900/70 text-white text-xs font-bold px-1.5 py-0.5 rounded">
//                       #{i + 1}
//                     </span>
//                     <button
//                       type="button"
//                       onClick={() => removeGalleryImage(img.id)}
//                       className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
//                       title="Remove"
//                     >
//                       ×
//                     </button>
//                     <div className="absolute bottom-1 right-1 flex gap-1">
//                       <button
//                         type="button"
//                         onClick={() => moveGalleryImage(i, -1)}
//                         disabled={i === 0}
//                         className="bg-white/90 disabled:opacity-30 text-gray-700 text-xs w-5 h-5 rounded flex items-center justify-center"
//                         title="Move left"
//                       >
//                         ‹
//                       </button>
//                       <button
//                         type="button"
//                         onClick={() => moveGalleryImage(i, 1)}
//                         disabled={i === galleryImages.length - 1}
//                         className="bg-white/90 disabled:opacity-30 text-gray-700 text-xs w-5 h-5 rounded flex items-center justify-center"
//                         title="Move right"
//                       >
//                         ›
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               <p className="text-xs text-gray-400">
//                 Drag to reorder, or use the ‹ › buttons. Click × to remove an image.
//               </p>
//             </>
//           )}
//         </div>

//         {/* SEO */}
//         <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
//           <h2 className="text-lg font-bold text-gray-900 border-b pb-3">SEO Settings</h2>
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-1">
//               Meta Title <span className="text-gray-400 font-normal">(60 chars ideal)</span>
//             </label>
//             <input
//               type="text" maxLength={70}
//               className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
//               value={form.meta_title}
//               onChange={e => setForm(f => ({ ...f, meta_title: e.target.value }))}
//               placeholder={`${form.title} | Himalaya Treks`}
//             />
//             <p className="text-xs text-gray-400 mt-1">{form.meta_title.length}/70 characters</p>
//           </div>
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-1">
//               Meta Description <span className="text-gray-400 font-normal">(160 chars ideal)</span>
//             </label>
//             <textarea
//               rows={3} maxLength={170}
//               className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
//               value={form.meta_description}
//               onChange={e => setForm(f => ({ ...f, meta_description: e.target.value }))}
//               placeholder="Compelling description that appears in Google search results..."
//             />
//             <p className="text-xs text-gray-400 mt-1">{form.meta_description.length}/170 characters</p>
//           </div>
//         </div>

//         {/* Submit */}
//         <div className="flex items-center gap-4">
//           <button
//             type="submit" disabled={loading}
//             className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-bold px-10 py-4 rounded-xl transition text-lg"
//           >
//             {loading ? 'Creating & Uploading...' : 'Create Trek'}
//           </button>
//           <button
//             type="button"
//             onClick={() => router.push('/admin/treks')}
//             className="text-gray-500 hover:text-gray-700 font-medium px-6 py-4"
//           >
//             Cancel
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }



'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

const difficulties = ['easy', 'moderate', 'challenging', 'extreme'];
const regions = ['Everest', 'Annapurna', 'Langtang', 'Manaslu', 'Mustang', 'Other'];

let uidCounter = 0;
const nextId = () => `img-${Date.now()}-${uidCounter++}`;
const nextDayId = () => `day-${Date.now()}-${uidCounter++}`;

// Blank itinerary day template
const emptyDay = (dayNumber) => ({
  id: nextDayId(),
  day: dayNumber,
  title: '',
  description: '',
  altitude: '',
  accommodation: '',
  meals: '',
  distance_km: '',
  duration_hours: '',
});

export default function NewTrekPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '', slug: '', description: '', region: '',
    difficulty: 'moderate', duration_days: '', max_altitude: '',
    price: '', discount_price: '', max_group_size: 12,
    is_featured: false, meta_title: '', meta_description: '',
    highlights: ''
  });

  // ── Itinerary state (day-by-day plan → maps to `itinerary` JSONB column) ──
  const [itinerary, setItinerary] = useState([emptyDay(1)]);

  // ── Cover image state (single, required) ──────────────
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const coverInputRef = useRef(null);

  // ── Gallery images state (multiple, optional) ──────────
  // Each item: { id, file, preview }
  const [galleryImages, setGalleryImages] = useState([]);
  const galleryInputRef = useRef(null);

  // Drag-and-drop reorder refs
  const dragItemIndex = useRef(null);
  const dragOverIndex = useRef(null);
  const [draggingId, setDraggingId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Auto-generate slug from title
  const handleTitleChange = (e) => {
    const title = e.target.value;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setForm(f => ({ ...f, title, slug }));
  };

  // ── Itinerary handlers ──────────────────────────────────
  const addItineraryDay = () => {
    setItinerary(prev => [...prev, emptyDay(prev.length + 1)]);
  };

  const removeItineraryDay = (id) => {
    setItinerary(prev => {
      const filtered = prev.filter(d => d.id !== id);
      // renumber sequentially after removal
      return filtered.map((d, idx) => ({ ...d, day: idx + 1 }));
    });
  };

  const updateItineraryDay = (id, field, value) => {
    setItinerary(prev => prev.map(d => (d.id === id ? { ...d, [field]: value } : d)));
  };

  const moveItineraryDay = (index, direction) => {
    setItinerary(prev => {
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= prev.length) return prev;
      const newArr = [...prev];
      [newArr[index], newArr[newIndex]] = [newArr[newIndex], newArr[index]];
      // renumber to keep `day` sequential after reorder
      return newArr.map((d, idx) => ({ ...d, day: idx + 1 }));
    });
  };

  // ── Cover image handlers ────────────────────────────────
  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (coverPreview) URL.revokeObjectURL(coverPreview);
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
    e.target.value = ''; // allow reselecting the same file later
  };

  const removeCover = () => {
    if (coverPreview) URL.revokeObjectURL(coverPreview);
    setCoverFile(null);
    setCoverPreview(null);
  };

  // ── Gallery handlers ────────────────────────────────────
  // IMPORTANT: append to previous state, never overwrite
  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const newItems = files.map(file => ({
      id: nextId(),
      file,
      preview: URL.createObjectURL(file),
    }));

    setGalleryImages(prev => [...prev, ...newItems]);
    e.target.value = ''; // reset input so picking the same files again still fires onChange
  };

  const removeGalleryImage = (id) => {
    setGalleryImages(prev => {
      const target = prev.find(img => img.id === id);
      if (target) URL.revokeObjectURL(target.preview);
      return prev.filter(img => img.id !== id);
    });
  };

  const moveGalleryImage = (index, direction) => {
    setGalleryImages(prev => {
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= prev.length) return prev;
      const newArr = [...prev];
      [newArr[index], newArr[newIndex]] = [newArr[newIndex], newArr[index]];
      return newArr;
    });
  };

  const handleDragStart = (index) => {
    dragItemIndex.current = index;
    setDraggingId(galleryImages[index].id);
  };
  const handleDragEnter = (index) => {
    dragOverIndex.current = index;
  };
  const handleDragEnd = () => {
    const from = dragItemIndex.current;
    const to = dragOverIndex.current;
    if (from !== null && to !== null && from !== to) {
      setGalleryImages(prev => {
        const newArr = [...prev];
        const [moved] = newArr.splice(from, 1);
        newArr.splice(to, 0, moved);
        return newArr;
      });
    }
    dragItemIndex.current = null;
    dragOverIndex.current = null;
    setDraggingId(null);
  };

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      if (coverPreview) URL.revokeObjectURL(coverPreview);
      galleryImages.forEach(img => URL.revokeObjectURL(img.preview));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!coverFile) {
      setError('Please select a cover image.');
      return;
    }

    // Clean itinerary: drop the client-only `id`, drop fully-empty days,
    // and only include numeric fields when actually filled in.
    const cleanedItinerary = itinerary
      .filter(d => d.title.trim() || d.description.trim())
      .map(({ id, distance_km, duration_hours, ...rest }) => ({
        ...rest,
        distance_km: distance_km ? parseFloat(distance_km) : undefined,
        duration_hours: duration_hours ? parseFloat(duration_hours) : undefined,
      }));

    setLoading(true);
    try {
      // Step 1: Create the trek
      const trekRes = await api.post('/treks', {
        ...form,
        duration_days: parseInt(form.duration_days),
        max_altitude: form.max_altitude ? parseInt(form.max_altitude) : null,
        price: parseFloat(form.price),
        discount_price: form.discount_price ? parseFloat(form.discount_price) : null,
        highlights: form.highlights
          ? form.highlights.split('\n').filter(Boolean)
          : null,
        itinerary: cleanedItinerary.length ? cleanedItinerary : null,
      });

      const trekId = trekRes.data.data.id;

      // Step 2: Upload cover image first (sort_order 0, is_cover true)
      const coverFormData = new FormData();
      coverFormData.append('image', coverFile);
      coverFormData.append('is_cover', 'true');
      coverFormData.append('sort_order', '0');
      coverFormData.append('caption', coverFile.name);
      await api.post(`/images/trek/${trekId}`, coverFormData);

      // Step 3: Upload gallery images (sort_order starting at 1)
      for (let i = 0; i < galleryImages.length; i++) {
        const formData = new FormData();
        formData.append('image', galleryImages[i].file);
        formData.append('is_cover', 'false');
        formData.append('sort_order', String(i + 1));
        formData.append('caption', galleryImages[i].file.name);
        await api.post(`/images/trek/${trekId}`, formData);
      }

      router.push('/admin/treks');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create trek.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Add New Trek</h1>

      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-6">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* Basic Info */}
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
          <h2 className="text-lg font-bold text-gray-900 border-b pb-3">Basic Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Trek Title *</label>
              <input
                type="text" required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                value={form.title}
                onChange={handleTitleChange}
                placeholder="e.g. Everest Base Camp Trek"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">URL Slug *</label>
              <input
                type="text" required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-gray-50"
                value={form.slug}
                onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                placeholder="auto-generated from title"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Region *</label>
              <select
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                value={form.region}
                onChange={e => setForm(f => ({ ...f, region: e.target.value }))}
              >
                <option value="">Select Region</option>
                {regions.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Difficulty *</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                value={form.difficulty}
                onChange={e => setForm(f => ({ ...f, difficulty: e.target.value }))}
              >
                {difficulties.map(d => (
                  <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Duration (days) *</label>
              <input
                type="number" required min="1"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                value={form.duration_days}
                onChange={e => setForm(f => ({ ...f, duration_days: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Max Altitude (m)</label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                value={form.max_altitude}
                onChange={e => setForm(f => ({ ...f, max_altitude: e.target.value }))}
                placeholder="e.g. 5364"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Price (USD) *</label>
              <input
                type="number" required min="0" step="0.01"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                value={form.price}
                onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Discounted Price (optional)</label>
              <input
                type="number" min="0" step="0.01"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                value={form.discount_price}
                onChange={e => setForm(f => ({ ...f, discount_price: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Max Group Size</label>
              <input
                type="number" min="1"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                value={form.max_group_size}
                onChange={e => setForm(f => ({ ...f, max_group_size: e.target.value }))}
              />
            </div>

            <div className="flex items-center gap-3 pt-6">
              <input
                type="checkbox" id="featured"
                className="w-4 h-4 text-emerald-600"
                checked={form.is_featured}
                onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))}
              />
              <label htmlFor="featured" className="text-sm font-semibold text-gray-700">
                Feature this trek on homepage
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Description *</label>
            <textarea
              required rows={5}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Full description of the trek..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Highlights <span className="text-gray-400 font-normal">(one per line)</span>
            </label>
            <textarea
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              value={form.highlights}
              onChange={e => setForm(f => ({ ...f, highlights: e.target.value }))}
              placeholder={"Stand at Everest Base Camp 5,364m\nVisit Tengboche Monastery\nCross Cho La Pass"}
            />
          </div>
        </div>

        {/* Itinerary */}
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Day-by-Day Itinerary</h2>
              <p className="text-xs text-gray-400 mt-1">Saved to the trek's `itinerary` JSON field.</p>
            </div>
            <button
              type="button"
              onClick={addItineraryDay}
              className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-lg transition"
            >
              + Add Day
            </button>
          </div>

          <div className="space-y-4">
            {itinerary.map((d, i) => (
              <div key={d.id} className="border border-gray-200 rounded-xl p-4 relative">
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-600 text-white text-sm font-bold">
                    {d.day}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveItineraryDay(i, -1)}
                      disabled={i === 0}
                      className="bg-gray-100 disabled:opacity-30 text-gray-700 text-xs w-6 h-6 rounded flex items-center justify-center hover:bg-gray-200"
                      title="Move up"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      onClick={() => moveItineraryDay(i, 1)}
                      disabled={i === itinerary.length - 1}
                      className="bg-gray-100 disabled:opacity-30 text-gray-700 text-xs w-6 h-6 rounded flex items-center justify-center hover:bg-gray-200"
                      title="Move down"
                    >
                      ›
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItineraryDay(d.id)}
                      disabled={itinerary.length === 1}
                      className="bg-red-500 disabled:opacity-30 hover:bg-red-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ml-1"
                      title="Remove day"
                    >
                      ×
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Day Title *</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      value={d.title}
                      onChange={e => updateItineraryDay(d.id, 'title', e.target.value)}
                      placeholder="e.g. Fly to Lukla, trek to Phakding"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
                    <textarea
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      value={d.description}
                      onChange={e => updateItineraryDay(d.id, 'description', e.target.value)}
                      placeholder="Details about today's trek..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Altitude</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      value={d.altitude}
                      onChange={e => updateItineraryDay(d.id, 'altitude', e.target.value)}
                      placeholder="e.g. 2,610m"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Accommodation</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      value={d.accommodation}
                      onChange={e => updateItineraryDay(d.id, 'accommodation', e.target.value)}
                      placeholder="e.g. Teahouse"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Meals</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      value={d.meals}
                      onChange={e => updateItineraryDay(d.id, 'meals', e.target.value)}
                      placeholder="e.g. B, L, D"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Distance (km)</label>
                    <input
                      type="number" step="0.1" min="0"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      value={d.distance_km}
                      onChange={e => updateItineraryDay(d.id, 'distance_km', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Duration (hours)</label>
                    <input
                      type="number" step="0.5" min="0"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      value={d.duration_hours}
                      onChange={e => updateItineraryDay(d.id, 'duration_hours', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cover Image */}
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-bold text-gray-900 border-b pb-3">
            Cover Image <span className="text-red-500">*</span>
          </h2>
          <p className="text-xs text-gray-400 -mt-2">
            Used for the trek listing card, hero banner, and SEO/OpenGraph image.
          </p>

          {!coverPreview ? (
            <div
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center text-gray-500 cursor-pointer hover:border-emerald-400 transition"
              onClick={() => coverInputRef.current?.click()}
            >
              Click to select a cover image
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCoverChange}
              />
            </div>
          ) : (
            <div className="relative w-64">
              <img
                src={coverPreview}
                alt="Cover preview"
                className="w-64 h-40 object-cover rounded-xl border-2 border-emerald-500"
              />
              <span className="absolute top-2 left-2 bg-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                Cover
              </span>
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => coverInputRef.current?.click()}
                  className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
                >
                  Replace
                </button>
                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleCoverChange}
                />
                <button
                  type="button"
                  onClick={removeCover}
                  className="text-sm font-semibold text-red-500 hover:text-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Gallery Images */}
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-bold text-gray-900 border-b pb-3">
            Gallery Images <span className="text-gray-400 font-normal text-sm">(optional, uploaded to Cloudinary)</span>
          </h2>

          <div
            className="w-full border-2 border-dashed border-gray-300 rounded-xl p-6 text-center text-gray-500 cursor-pointer hover:border-emerald-400 transition"
            onClick={() => galleryInputRef.current?.click()}
          >
            Click to add gallery images — you can select more later without losing what you've already added.
            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleGalleryChange}
            />
          </div>

          {galleryImages.length > 0 && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {galleryImages.map((img, i) => (
                  <div
                    key={img.id}
                    draggable
                    onDragStart={() => handleDragStart(i)}
                    onDragEnter={() => handleDragEnter(i)}
                    onDragOver={(e) => e.preventDefault()}
                    onDragEnd={handleDragEnd}
                    className={`relative rounded-xl overflow-hidden border-2 border-gray-200 transition cursor-move ${
                      draggingId === img.id ? 'opacity-40' : ''
                    }`}
                  >
                    <img
                      src={img.preview}
                      alt={img.file.name}
                      className="w-full h-28 object-cover"
                    />
                    <span className="absolute top-1 left-1 bg-gray-900/70 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                      #{i + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(img.id)}
                      className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
                      title="Remove"
                    >
                      ×
                    </button>
                    <div className="absolute bottom-1 right-1 flex gap-1">
                      <button
                        type="button"
                        onClick={() => moveGalleryImage(i, -1)}
                        disabled={i === 0}
                        className="bg-white/90 disabled:opacity-30 text-gray-700 text-xs w-5 h-5 rounded flex items-center justify-center"
                        title="Move left"
                      >
                        ‹
                      </button>
                      <button
                        type="button"
                        onClick={() => moveGalleryImage(i, 1)}
                        disabled={i === galleryImages.length - 1}
                        className="bg-white/90 disabled:opacity-30 text-gray-700 text-xs w-5 h-5 rounded flex items-center justify-center"
                        title="Move right"
                      >
                        ›
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400">
                Drag to reorder, or use the ‹ › buttons. Click × to remove an image.
              </p>
            </>
          )}
        </div>

        {/* SEO */}
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-bold text-gray-900 border-b pb-3">SEO Settings</h2>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Meta Title <span className="text-gray-400 font-normal">(60 chars ideal)</span>
            </label>
            <input
              type="text" maxLength={70}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              value={form.meta_title}
              onChange={e => setForm(f => ({ ...f, meta_title: e.target.value }))}
              placeholder={`${form.title} | Himalaya Treks`}
            />
            <p className="text-xs text-gray-400 mt-1">{form.meta_title.length}/70 characters</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Meta Description <span className="text-gray-400 font-normal">(160 chars ideal)</span>
            </label>
            <textarea
              rows={3} maxLength={170}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              value={form.meta_description}
              onChange={e => setForm(f => ({ ...f, meta_description: e.target.value }))}
              placeholder="Compelling description that appears in Google search results..."
            />
            <p className="text-xs text-gray-400 mt-1">{form.meta_description.length}/170 characters</p>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-4">
          <button
            type="submit" disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-bold px-10 py-4 rounded-xl transition text-lg"
          >
            {loading ? 'Creating & Uploading...' : 'Create Trek'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/treks')}
            className="text-gray-500 hover:text-gray-700 font-medium px-6 py-4"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}