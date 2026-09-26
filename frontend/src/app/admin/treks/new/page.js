
// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import { useRouter } from 'next/navigation';
// import api from '@/lib/api';

// const difficulties = ['easy', 'moderate', 'challenging', 'extreme'];
// const regions = [
//   'Everest',
//   'Annapurna',
//   'Langtang',
//   'Manaslu',
//   'Mustang',
//   'Other',
// ];

// let uidCounter = 0;

// const nextId = () => `img-${Date.now()}-${uidCounter++}`;
// const nextDayId = () => `day-${Date.now()}-${uidCounter++}`;

// // Blank itinerary day template
// const emptyDay = (dayNumber) => ({
//   id: nextDayId(),
//   day: dayNumber,
//   title: '',
//   description: '',
//   altitude: '',
//   accommodation: '',
//   meals: '',
//   distance_km: '',
//   duration_hours: '',
// });

// export default function NewTrekPage() {
//   const router = useRouter();

//   const [form, setForm] = useState({
//     title: '',
//     slug: '',
//     description: '',
//     region: '',
//     difficulty: 'moderate',
//     duration_days: '',
//     max_altitude: '',
//     price: '',
//     discount_price: '',
//     max_group_size: 12,
//     is_featured: false,
//     is_expedition: false,
//     meta_title: '',
//     meta_description: '',
//     highlights: '',
//   });

//   // Itinerary
//   const [itinerary, setItinerary] = useState([emptyDay(1)]);

//   // Cover image
//   const [coverFile, setCoverFile] = useState(null);
//   const [coverPreview, setCoverPreview] = useState(null);
//   const coverInputRef = useRef(null);

//   // Gallery images
//   const [galleryImages, setGalleryImages] = useState([]);
//   const galleryInputRef = useRef(null);

//   // Drag/drop
//   const dragItemIndex = useRef(null);
//   const dragOverIndex = useRef(null);
//   const [draggingId, setDraggingId] = useState(null);

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   // Auto-generate slug
//   const handleTitleChange = (e) => {
//     const title = e.target.value;

//     const slug = title
//       .toLowerCase()
//       .replace(/[^a-z0-9]+/g, '-')
//       .replace(/(^-|-$)/g, '');

//     setForm((f) => ({
//       ...f,
//       title,
//       slug,
//     }));
//   };

//   // =========================================================
//   // ITINERARY
//   // =========================================================

//   const addItineraryDay = () => {
//     setItinerary((prev) => [
//       ...prev,
//       emptyDay(prev.length + 1),
//     ]);
//   };

//   const removeItineraryDay = (id) => {
//     setItinerary((prev) => {
//       const filtered = prev.filter((d) => d.id !== id);

//       return filtered.map((d, idx) => ({
//         ...d,
//         day: idx + 1,
//       }));
//     });
//   };

//   const updateItineraryDay = (id, field, value) => {
//     setItinerary((prev) =>
//       prev.map((d) =>
//         d.id === id
//           ? {
//               ...d,
//               [field]: value,
//             }
//           : d
//       )
//     );
//   };

//   const moveItineraryDay = (index, direction) => {
//     setItinerary((prev) => {
//       const newIndex = index + direction;

//       if (
//         newIndex < 0 ||
//         newIndex >= prev.length
//       ) {
//         return prev;
//       }

//       const newArr = [...prev];

//       [newArr[index], newArr[newIndex]] = [
//         newArr[newIndex],
//         newArr[index],
//       ];

//       return newArr.map((d, idx) => ({
//         ...d,
//         day: idx + 1,
//       }));
//     });
//   };

//   // =========================================================
//   // COVER IMAGE
//   // =========================================================

//   const handleCoverChange = (e) => {
//     const file = e.target.files?.[0];

//     if (!file) return;

//     if (coverPreview) {
//       URL.revokeObjectURL(coverPreview);
//     }

//     setCoverFile(file);
//     setCoverPreview(URL.createObjectURL(file));

//     e.target.value = '';
//   };

//   const removeCover = () => {
//     if (coverPreview) {
//       URL.revokeObjectURL(coverPreview);
//     }

//     setCoverFile(null);
//     setCoverPreview(null);
//   };

//   // =========================================================
//   // GALLERY
//   // =========================================================

//   const handleGalleryChange = (e) => {
//     const files = Array.from(e.target.files || []);

//     if (files.length === 0) return;

//     const newItems = files.map((file) => ({
//       id: nextId(),
//       file,
//       preview: URL.createObjectURL(file),
//     }));

//     setGalleryImages((prev) => [
//       ...prev,
//       ...newItems,
//     ]);

//     e.target.value = '';
//   };

//   const removeGalleryImage = (id) => {
//     setGalleryImages((prev) => {
//       const target = prev.find(
//         (img) => img.id === id
//       );

//       if (target) {
//         URL.revokeObjectURL(target.preview);
//       }

//       return prev.filter(
//         (img) => img.id !== id
//       );
//     });
//   };

//   const moveGalleryImage = (
//     index,
//     direction
//   ) => {
//     setGalleryImages((prev) => {
//       const newIndex = index + direction;

//       if (
//         newIndex < 0 ||
//         newIndex >= prev.length
//       ) {
//         return prev;
//       }

//       const newArr = [...prev];

//       [newArr[index], newArr[newIndex]] = [
//         newArr[newIndex],
//         newArr[index],
//       ];

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

//     if (
//       from !== null &&
//       to !== null &&
//       from !== to
//     ) {
//       setGalleryImages((prev) => {
//         const newArr = [...prev];

//         const [moved] = newArr.splice(
//           from,
//           1
//         );

//         newArr.splice(to, 0, moved);

//         return newArr;
//       });
//     }

//     dragItemIndex.current = null;
//     dragOverIndex.current = null;
//     setDraggingId(null);
//   };

//   // =========================================================
//   // CLEANUP
//   // =========================================================

//   useEffect(() => {
//     return () => {
//       if (coverPreview) {
//         URL.revokeObjectURL(coverPreview);
//       }

//       galleryImages.forEach((img) => {
//         URL.revokeObjectURL(img.preview);
//       });
//     };

//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // =========================================================
//   // SUBMIT
//   // =========================================================

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');

//     if (!coverFile) {
//       setError(
//         'Please select a cover image.'
//       );
//       return;
//     }

//     const cleanedItinerary = itinerary
//       .filter(
//         (d) =>
//           d.title.trim() ||
//           d.description.trim()
//       )
//       .map(
//         ({
//           id,
//           distance_km,
//           duration_hours,
//           ...rest
//         }) => ({
//           ...rest,
//           distance_km: distance_km
//             ? parseFloat(distance_km)
//             : undefined,
//           duration_hours: duration_hours
//             ? parseFloat(duration_hours)
//             : undefined,
//         })
//       );

//     setLoading(true);

//     try {
//       // Step 1: Create trek
//       const trekRes = await api.post(
//         '/treks',
//         {
//           ...form,

//           duration_days: parseInt(
//             form.duration_days
//           ),

//           max_altitude: form.max_altitude
//             ? parseInt(form.max_altitude)
//             : null,

//           price: parseFloat(form.price),

//           discount_price:
//             form.discount_price
//               ? parseFloat(
//                   form.discount_price
//                 )
//               : null,

//           highlights: form.highlights
//             ? form.highlights
//                 .split('\n')
//                 .filter(Boolean)
//             : null,

//           itinerary:
//             cleanedItinerary.length
//               ? cleanedItinerary
//               : null,
//         }
//       );

//       const trekId =
//         trekRes.data.data.id;

//       // Step 2: Cover image
//       const coverFormData =
//         new FormData();

//       coverFormData.append(
//         'image',
//         coverFile
//       );

//       coverFormData.append(
//         'is_cover',
//         'true'
//       );

//       coverFormData.append(
//         'sort_order',
//         '0'
//       );

//       coverFormData.append(
//         'caption',
//         coverFile.name
//       );

//       await api.post(
//         `/images/trek/${trekId}`,
//         coverFormData
//       );

//       // Step 3: Gallery
//       for (
//         let i = 0;
//         i < galleryImages.length;
//         i++
//       ) {
//         const formData =
//           new FormData();

//         formData.append(
//           'image',
//           galleryImages[i].file
//         );

//         formData.append(
//           'is_cover',
//           'false'
//         );

//         formData.append(
//           'sort_order',
//           String(i + 1)
//         );

//         formData.append(
//           'caption',
//           galleryImages[i].file.name
//         );

//         await api.post(
//           `/images/trek/${trekId}`,
//           formData
//         );
//       }

//       router.push('/admin/treks');
//     } catch (err) {
//       setError(
//         err.response?.data?.message ||
//           'Failed to create trek.'
//       );

//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // =========================================================
//   // UI
//   // =========================================================

//   return (
//     <div className="min-h-screen bg-slate-50">
//       <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

//         {/* Header */}
//         <div className="mb-8">
//           <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
//             <div>
//               <div className="mb-2 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-emerald-700">
//                 Trek Management
//               </div>

//               <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
//                 Add New Trek
//               </h1>

//               <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
//                 Create a detailed trek package with
//                 itinerary, pricing, images, SEO
//                 information and expedition settings.
//               </p>
//             </div>

//             <button
//               type="button"
//               onClick={() =>
//                 router.push('/admin/treks')
//               }
//               className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
//             >
//               ← Back to Treks
//             </button>
//           </div>
//         </div>

//         {/* Error */}
//         {error && (
//           <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700 shadow-sm">
//             <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 font-bold">
//               !
//             </div>

//             <div>
//               <p className="font-bold">
//                 Something went wrong
//               </p>

//               <p className="mt-1 text-sm">
//                 {error}
//               </p>
//             </div>
//           </div>
//         )}

//         <form
//           onSubmit={handleSubmit}
//           className="space-y-6"
//         >

//           {/* ================================================= */}
//           {/* BASIC INFORMATION */}
//           {/* ================================================= */}

//           <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
//             <div className="border-b border-slate-100 bg-gradient-to-r from-white to-slate-50 px-6 py-5 sm:px-8">
//               <div className="flex items-center gap-4">
//                 <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-lg">
//                   🏔️
//                 </div>

//                 <div>
//                   <h2 className="text-lg font-extrabold text-slate-900">
//                     Basic Information
//                   </h2>

//                   <p className="text-sm text-slate-500">
//                     Essential information about your trek.
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="p-6 sm:p-8">
//               <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

//                 {/* Title */}
//                 <div className="md:col-span-2">
//                   <label className="mb-2 block text-sm font-bold text-slate-700">
//                     Trek Title *
//                   </label>

//                   <input
//                     type="text"
//                     required
//                     value={form.title}
//                     onChange={handleTitleChange}
//                     placeholder="e.g. Everest Base Camp Trek"
//                     className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
//                   />
//                 </div>

//                 {/* Slug */}
//                 <div>
//                   <label className="mb-2 block text-sm font-bold text-slate-700">
//                     URL Slug *
//                   </label>

//                   <input
//                     type="text"
//                     required
//                     value={form.slug}
//                     onChange={(e) =>
//                       setForm((f) => ({
//                         ...f,
//                         slug: e.target.value,
//                       }))
//                     }
//                     placeholder="auto-generated-from-title"
//                     className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
//                   />
//                 </div>

//                 {/* Region */}
//                 <div>
//                   <label className="mb-2 block text-sm font-bold text-slate-700">
//                     Region *
//                   </label>

//                   <select
//                     required
//                     value={form.region}
//                     onChange={(e) =>
//                       setForm((f) => ({
//                         ...f,
//                         region: e.target.value,
//                       }))
//                     }
//                     className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
//                   >
//                     <option value="">
//                       Select Region
//                     </option>

//                     {regions.map((r) => (
//                       <option
//                         key={r}
//                         value={r}
//                       >
//                         {r}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 {/* Difficulty */}
//                 <div>
//                   <label className="mb-2 block text-sm font-bold text-slate-700">
//                     Difficulty *
//                   </label>

//                   <select
//                     value={form.difficulty}
//                     onChange={(e) =>
//                       setForm((f) => ({
//                         ...f,
//                         difficulty:
//                           e.target.value,
//                       }))
//                     }
//                     className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm capitalize text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
//                   >
//                     {difficulties.map((d) => (
//                       <option
//                         key={d}
//                         value={d}
//                       >
//                         {d.charAt(0).toUpperCase() +
//                           d.slice(1)}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 {/* Duration */}
//                 <div>
//                   <label className="mb-2 block text-sm font-bold text-slate-700">
//                     Duration (days) *
//                   </label>

//                   <input
//                     type="number"
//                     required
//                     min="1"
//                     value={form.duration_days}
//                     onChange={(e) =>
//                       setForm((f) => ({
//                         ...f,
//                         duration_days:
//                           e.target.value,
//                       }))
//                     }
//                     placeholder="e.g. 14"
//                     className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
//                   />
//                 </div>

//                 {/* Altitude */}
//                 <div>
//                   <label className="mb-2 block text-sm font-bold text-slate-700">
//                     Max Altitude (m)
//                   </label>

//                   <input
//                     type="number"
//                     value={form.max_altitude}
//                     onChange={(e) =>
//                       setForm((f) => ({
//                         ...f,
//                         max_altitude:
//                           e.target.value,
//                       }))
//                     }
//                     placeholder="e.g. 5364"
//                     className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
//                   />
//                 </div>

//                 {/* Price */}
//                 <div>
//                   <label className="mb-2 block text-sm font-bold text-slate-700">
//                     Price (USD) *
//                   </label>

//                   <div className="relative">
//                     <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
//                       $
//                     </span>

//                     <input
//                       type="number"
//                       required
//                       min="0"
//                       step="0.01"
//                       value={form.price}
//                       onChange={(e) =>
//                         setForm((f) => ({
//                           ...f,
//                           price: e.target.value,
//                         }))
//                       }
//                       placeholder="0.00"
//                       className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-9 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
//                     />
//                   </div>
//                 </div>

//                 {/* Discount */}
//                 <div>
//                   <label className="mb-2 block text-sm font-bold text-slate-700">
//                     Discounted Price
//                     <span className="ml-1 font-normal text-slate-400">
//                       (optional)
//                     </span>
//                   </label>

//                   <div className="relative">
//                     <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
//                       $
//                     </span>

//                     <input
//                       type="number"
//                       min="0"
//                       step="0.01"
//                       value={form.discount_price}
//                       onChange={(e) =>
//                         setForm((f) => ({
//                           ...f,
//                           discount_price:
//                             e.target.value,
//                         }))
//                       }
//                       placeholder="0.00"
//                       className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-9 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
//                     />
//                   </div>
//                 </div>

//                 {/* Group Size */}
//                 <div>
//                   <label className="mb-2 block text-sm font-bold text-slate-700">
//                     Max Group Size
//                   </label>

//                   <input
//                     type="number"
//                     min="1"
//                     value={form.max_group_size}
//                     onChange={(e) =>
//                       setForm((f) => ({
//                         ...f,
//                         max_group_size:
//                           e.target.value,
//                       }))
//                     }
//                     className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
//                   />
//                 </div>
//               </div>

//               {/* Toggles */}
//               <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">

//                 {/* Featured */}
//                 <label
//                   htmlFor="featured"
//                   className={`group flex cursor-pointer items-center gap-4 rounded-2xl border p-5 transition ${
//                     form.is_featured
//                       ? 'border-amber-200 bg-amber-50'
//                       : 'border-slate-200 bg-slate-50 hover:border-slate-300'
//                   }`}
//                 >
//                   <input
//                     type="checkbox"
//                     id="featured"
//                     checked={form.is_featured}
//                     onChange={(e) =>
//                       setForm((f) => ({
//                         ...f,
//                         is_featured:
//                           e.target.checked,
//                       }))
//                     }
//                     className="h-5 w-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
//                   />

//                   <div>
//                     <div className="font-bold text-slate-800">
//                       Feature this trek
//                     </div>

//                     <p className="mt-1 text-xs leading-5 text-slate-500">
//                       Display this trek prominently
//                       on the homepage.
//                     </p>
//                   </div>

//                   <span className="ml-auto rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-400 shadow-sm">
//                     Featured
//                   </span>
//                 </label>

//                 {/* Expedition */}
//                 <label
//                   htmlFor="expedition"
//                   className={`group flex cursor-pointer items-center gap-4 rounded-2xl border p-5 transition ${
//                     form.is_expedition
//                       ? 'border-purple-200 bg-purple-50'
//                       : 'border-slate-200 bg-slate-50 hover:border-slate-300'
//                   }`}
//                 >
//                   <input
//                     type="checkbox"
//                     id="expedition"
//                     checked={form.is_expedition}
//                     onChange={(e) =>
//                       setForm((f) => ({
//                         ...f,
//                         is_expedition:
//                           e.target.checked,
//                       }))
//                     }
//                     className="h-5 w-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
//                   />

//                   <div>
//                     <div className="font-bold text-slate-800">
//                       Is Expedition
//                     </div>

//                     <p className="mt-1 text-xs leading-5 text-slate-500">
//                       Mark this trek as a mountaineering
//                       or expedition package.
//                     </p>
//                   </div>

//                   <span className="ml-auto rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-400 shadow-sm">
//                     Expedition
//                   </span>
//                 </label>
//               </div>

//               {/* Description */}
//               <div className="mt-8">
//                 <label className="mb-2 block text-sm font-bold text-slate-700">
//                   Description *
//                 </label>

//                 <textarea
//                   required
//                   rows={6}
//                   value={form.description}
//                   onChange={(e) =>
//                     setForm((f) => ({
//                       ...f,
//                       description:
//                         e.target.value,
//                     }))
//                   }
//                   placeholder="Write a detailed description of the trek..."
//                   className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
//                 />
//               </div>

//               {/* Highlights */}
//               <div className="mt-6">
//                 <label className="mb-2 block text-sm font-bold text-slate-700">
//                   Highlights
//                   <span className="ml-2 font-normal text-slate-400">
//                     One per line
//                   </span>
//                 </label>

//                 <textarea
//                   rows={5}
//                   value={form.highlights}
//                   onChange={(e) =>
//                     setForm((f) => ({
//                       ...f,
//                       highlights:
//                         e.target.value,
//                     }))
//                   }
//                   placeholder={
//                     'Stand at Everest Base Camp 5,364m\nVisit Tengboche Monastery\nCross Cho La Pass'
//                   }
//                   className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
//                 />
//               </div>
//             </div>
//           </section>

//           {/* ================================================= */}
//           {/* ITINERARY */}
//           {/* ================================================= */}

//           <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
//             <div className="flex flex-col gap-4 border-b border-slate-100 bg-gradient-to-r from-white to-slate-50 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
//               <div className="flex items-center gap-4">
//                 <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-lg">
//                   🗺️
//                 </div>

//                 <div>
//                   <h2 className="text-lg font-extrabold text-slate-900">
//                     Day-by-Day Itinerary
//                   </h2>

//                   <p className="text-sm text-slate-500">
//                     Build the complete trek itinerary.
//                   </p>
//                 </div>
//               </div>

//               <button
//                 type="button"
//                 onClick={addItineraryDay}
//                 className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 hover:shadow-md"
//               >
//                 + Add Day
//               </button>
//             </div>

//             <div className="space-y-5 p-6 sm:p-8">
//               {itinerary.map((d, i) => (
//                 <div
//                   key={d.id}
//                   className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
//                 >
//                   {/* Day header */}
//                   <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
//                     <div className="flex items-center gap-3">
//                       <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-sm font-black text-white shadow-sm">
//                         {d.day}
//                       </span>

//                       <div>
//                         <p className="text-sm font-extrabold text-slate-800">
//                           Day {d.day}
//                         </p>

//                         <p className="text-xs text-slate-400">
//                           Itinerary details
//                         </p>
//                       </div>
//                     </div>

//                     <div className="flex items-center gap-1.5">
//                       <button
//                         type="button"
//                         onClick={() =>
//                           moveItineraryDay(
//                             i,
//                             -1
//                           )
//                         }
//                         disabled={i === 0}
//                         className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30"
//                         title="Move up"
//                       >
//                         ↑
//                       </button>

//                       <button
//                         type="button"
//                         onClick={() =>
//                           moveItineraryDay(
//                             i,
//                             1
//                           )
//                         }
//                         disabled={
//                           i ===
//                           itinerary.length - 1
//                         }
//                         className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30"
//                         title="Move down"
//                       >
//                         ↓
//                       </button>

//                       <button
//                         type="button"
//                         onClick={() =>
//                           removeItineraryDay(
//                             d.id
//                           )
//                         }
//                         disabled={
//                           itinerary.length ===
//                           1
//                         }
//                         className="ml-1 flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-500 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-30"
//                         title="Remove day"
//                       >
//                         ×
//                       </button>
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2">

//                     {/* Day title */}
//                     <div className="md:col-span-2">
//                       <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
//                         Day Title *
//                       </label>

//                       <input
//                         type="text"
//                         value={d.title}
//                         onChange={(e) =>
//                           updateItineraryDay(
//                             d.id,
//                             'title',
//                             e.target.value
//                           )
//                         }
//                         placeholder="e.g. Fly to Lukla, trek to Phakding"
//                         className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
//                       />
//                     </div>

//                     {/* Description */}
//                     <div className="md:col-span-2">
//                       <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
//                         Description
//                       </label>

//                       <textarea
//                         rows={4}
//                         value={d.description}
//                         onChange={(e) =>
//                           updateItineraryDay(
//                             d.id,
//                             'description',
//                             e.target.value
//                           )
//                         }
//                         placeholder="Details about today's trek..."
//                         className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
//                       />
//                     </div>

//                     {/* Altitude */}
//                     <div>
//                       <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
//                         Altitude
//                       </label>

//                       <input
//                         type="text"
//                         value={d.altitude}
//                         onChange={(e) =>
//                           updateItineraryDay(
//                             d.id,
//                             'altitude',
//                             e.target.value
//                           )
//                         }
//                         placeholder="e.g. 2,610m"
//                         className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
//                       />
//                     </div>

//                     {/* Accommodation */}
//                     <div>
//                       <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
//                         Accommodation
//                       </label>

//                       <input
//                         type="text"
//                         value={d.accommodation}
//                         onChange={(e) =>
//                           updateItineraryDay(
//                             d.id,
//                             'accommodation',
//                             e.target.value
//                           )
//                         }
//                         placeholder="e.g. Teahouse"
//                         className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
//                       />
//                     </div>

//                     {/* Meals */}
//                     <div>
//                       <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
//                         Meals
//                       </label>

//                       <input
//                         type="text"
//                         value={d.meals}
//                         onChange={(e) =>
//                           updateItineraryDay(
//                             d.id,
//                             'meals',
//                             e.target.value
//                           )
//                         }
//                         placeholder="e.g. B, L, D"
//                         className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
//                       />
//                     </div>

//                     {/* Distance */}
//                     <div>
//                       <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
//                         Distance (km)
//                       </label>

//                       <input
//                         type="number"
//                         step="0.1"
//                         min="0"
//                         value={d.distance_km}
//                         onChange={(e) =>
//                           updateItineraryDay(
//                             d.id,
//                             'distance_km',
//                             e.target.value
//                           )
//                         }
//                         placeholder="e.g. 8.5"
//                         className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
//                       />
//                     </div>

//                     {/* Duration */}
//                     <div>
//                       <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
//                         Duration (hours)
//                       </label>

//                       <input
//                         type="number"
//                         step="0.5"
//                         min="0"
//                         value={d.duration_hours}
//                         onChange={(e) =>
//                           updateItineraryDay(
//                             d.id,
//                             'duration_hours',
//                             e.target.value
//                           )
//                         }
//                         placeholder="e.g. 5"
//                         className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </section>

//           {/* ================================================= */}
//           {/* COVER IMAGE */}
//           {/* ================================================= */}

//           <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
//             <div className="border-b border-slate-100 bg-gradient-to-r from-white to-slate-50 px-6 py-5 sm:px-8">
//               <div className="flex items-center gap-4">
//                 <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 text-lg">
//                   🖼️
//                 </div>

//                 <div>
//                   <h2 className="text-lg font-extrabold text-slate-900">
//                     Cover Image
//                     <span className="ml-2 text-red-500">
//                       *
//                     </span>
//                   </h2>

//                   <p className="text-sm text-slate-500">
//                     Used for the trek card, hero banner
//                     and SEO/OpenGraph image.
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="p-6 sm:p-8">
//               {!coverPreview ? (
//                 <div
//                   onClick={() =>
//                     coverInputRef.current?.click()
//                   }
//                   className="group cursor-pointer rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center transition hover:border-emerald-400 hover:bg-emerald-50/30"
//                 >
//                   <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
//                     📷
//                   </div>

//                   <p className="font-bold text-slate-700">
//                     Click to select a cover image
//                   </p>

//                   <p className="mt-2 text-sm text-slate-400">
//                     JPG, PNG, WEBP and other image
//                     formats
//                   </p>

//                   <input
//                     ref={coverInputRef}
//                     type="file"
//                     accept="image/*"
//                     className="hidden"
//                     onChange={
//                       handleCoverChange
//                     }
//                   />
//                 </div>
//               ) : (
//                 <div className="flex flex-col gap-5 sm:flex-row">
//                   <div className="relative overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
//                     <img
//                       src={coverPreview}
//                       alt="Cover preview"
//                       className="h-56 w-full object-cover sm:w-96"
//                     />

//                     <span className="absolute left-3 top-3 rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white shadow">
//                       Cover Image
//                     </span>
//                   </div>

//                   <div className="flex items-center gap-3 sm:flex-col sm:items-start sm:justify-center">
//                     <button
//                       type="button"
//                       onClick={() =>
//                         coverInputRef.current?.click()
//                       }
//                       className="rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100"
//                     >
//                       Replace
//                     </button>

//                     <input
//                       ref={coverInputRef}
//                       type="file"
//                       accept="image/*"
//                       className="hidden"
//                       onChange={
//                         handleCoverChange
//                       }
//                     />

//                     <button
//                       type="button"
//                       onClick={removeCover}
//                       className="rounded-xl bg-red-50 px-4 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-100"
//                     >
//                       Remove
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </section>

//           {/* ================================================= */}
//           {/* GALLERY */}
//           {/* ================================================= */}

//           <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
//             <div className="border-b border-slate-100 bg-gradient-to-r from-white to-slate-50 px-6 py-5 sm:px-8">
//               <div className="flex items-center gap-4">
//                 <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pink-100 text-lg">
//                   🏞️
//                 </div>

//                 <div>
//                   <h2 className="text-lg font-extrabold text-slate-900">
//                     Gallery Images
//                     <span className="ml-2 text-sm font-normal text-slate-400">
//                       Optional
//                     </span>
//                   </h2>

//                   <p className="text-sm text-slate-500">
//                     Add additional images to showcase
//                     the trek.
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="p-6 sm:p-8">
//               <div
//                 onClick={() =>
//                   galleryInputRef.current?.click()
//                 }
//                 className="cursor-pointer rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center transition hover:border-emerald-400 hover:bg-emerald-50/30"
//               >
//                 <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-xl shadow-sm">
//                   📸
//                 </div>

//                 <p className="font-bold text-slate-700">
//                   Click to add gallery images
//                 </p>

//                 <p className="mt-1 text-sm text-slate-400">
//                   You can select more images later.
//                 </p>

//                 <input
//                   ref={galleryInputRef}
//                   type="file"
//                   accept="image/*"
//                   multiple
//                   className="hidden"
//                   onChange={
//                     handleGalleryChange
//                   }
//                 />
//               </div>

//               {galleryImages.length > 0 && (
//                 <>
//                   <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
//                     {galleryImages.map(
//                       (img, i) => (
//                         <div
//                           key={img.id}
//                           draggable
//                           onDragStart={() =>
//                             handleDragStart(i)
//                           }
//                           onDragEnter={() =>
//                             handleDragEnter(i)
//                           }
//                           onDragOver={(e) =>
//                             e.preventDefault()
//                           }
//                           onDragEnd={
//                             handleDragEnd
//                           }
//                           className={`group relative overflow-hidden rounded-2xl border-2 border-slate-200 bg-white shadow-sm transition ${
//                             draggingId ===
//                             img.id
//                               ? 'scale-95 opacity-40'
//                               : 'hover:-translate-y-1 hover:shadow-md'
//                           }`}
//                         >
//                           <img
//                             src={img.preview}
//                             alt={img.file.name}
//                             className="h-36 w-full object-cover"
//                           />

//                           <span className="absolute left-2 top-2 rounded-lg bg-slate-900/80 px-2 py-1 text-xs font-bold text-white">
//                             #{i + 1}
//                           </span>

//                           <button
//                             type="button"
//                             onClick={() =>
//                               removeGalleryImage(
//                                 img.id
//                               )
//                             }
//                             className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-sm font-bold text-white shadow transition hover:bg-red-600"
//                             title="Remove"
//                           >
//                             ×
//                           </button>

//                           <div className="absolute bottom-2 right-2 flex gap-1">
//                             <button
//                               type="button"
//                               onClick={() =>
//                                 moveGalleryImage(
//                                   i,
//                                   -1
//                                 )
//                               }
//                               disabled={i === 0}
//                               className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/95 text-slate-700 shadow transition hover:bg-white disabled:opacity-30"
//                               title="Move left"
//                             >
//                               ‹
//                             </button>

//                             <button
//                               type="button"
//                               onClick={() =>
//                                 moveGalleryImage(
//                                   i,
//                                   1
//                                 )
//                               }
//                               disabled={
//                                 i ===
//                                 galleryImages.length -
//                                   1
//                               }
//                               className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/95 text-slate-700 shadow transition hover:bg-white disabled:opacity-30"
//                               title="Move right"
//                             >
//                               ›
//                             </button>
//                           </div>
//                         </div>
//                       )
//                     )}
//                   </div>

//                   <p className="mt-4 text-xs text-slate-400">
//                     Drag images to reorder them, or
//                     use the arrow buttons.
//                   </p>
//                 </>
//               )}
//             </div>
//           </section>

//           {/* ================================================= */}
//           {/* SEO */}
//           {/* ================================================= */}

//           <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
//             <div className="border-b border-slate-100 bg-gradient-to-r from-white to-slate-50 px-6 py-5 sm:px-8">
//               <div className="flex items-center gap-4">
//                 <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-lg">
//                   🔎
//                 </div>

//                 <div>
//                   <h2 className="text-lg font-extrabold text-slate-900">
//                     SEO Settings
//                   </h2>

//                   <p className="text-sm text-slate-500">
//                     Optimize this trek for search engines.
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="space-y-6 p-6 sm:p-8">

//               {/* Meta title */}
//               <div>
//                 <div className="mb-2 flex items-center justify-between">
//                   <label className="text-sm font-bold text-slate-700">
//                     Meta Title
//                   </label>

//                   <span className="text-xs font-medium text-slate-400">
//                     {form.meta_title.length}/70
//                   </span>
//                 </div>

//                 <input
//                   type="text"
//                   maxLength={70}
//                   value={form.meta_title}
//                   onChange={(e) =>
//                     setForm((f) => ({
//                       ...f,
//                       meta_title:
//                         e.target.value,
//                     }))
//                   }
//                   placeholder={`${form.title || 'Trek title'} | Himalaya Treks`}
//                   className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
//                 />
//               </div>

//               {/* Meta description */}
//               <div>
//                 <div className="mb-2 flex items-center justify-between">
//                   <label className="text-sm font-bold text-slate-700">
//                     Meta Description
//                   </label>

//                   <span className="text-xs font-medium text-slate-400">
//                     {form.meta_description.length}/170
//                   </span>
//                 </div>

//                 <textarea
//                   rows={4}
//                   maxLength={170}
//                   value={form.meta_description}
//                   onChange={(e) =>
//                     setForm((f) => ({
//                       ...f,
//                       meta_description:
//                         e.target.value,
//                     }))
//                   }
//                   placeholder="Compelling description that appears in Google search results..."
//                   className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
//                 />
//               </div>
//             </div>
//           </section>

//           {/* ================================================= */}
//           {/* ACTIONS */}
//           {/* ================================================= */}

//           <div className="sticky bottom-4 z-20">
//             <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur sm:flex-row sm:items-center sm:justify-between">

//               <div className="hidden sm:block">
//                 <p className="text-sm font-bold text-slate-800">
//                   Ready to publish?
//                 </p>

//                 <p className="text-xs text-slate-400">
//                   Review the information before creating
//                   the trek.
//                 </p>
//               </div>

//               <div className="flex w-full gap-3 sm:w-auto">
//                 <button
//                   type="button"
//                   onClick={() =>
//                     router.push(
//                       '/admin/treks'
//                     )
//                   }
//                   className="flex-1 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50 sm:flex-none"
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="flex-1 rounded-xl bg-emerald-600 px-8 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 hover:shadow-xl disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none sm:flex-none"
//                 >
//                   {loading
//                     ? 'Creating & Uploading...'
//                     : 'Create Trek'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }


// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import { useRouter } from 'next/navigation';
// import api from '@/lib/api';

// const difficulties = ['easy', 'moderate', 'challenging', 'extreme'];

// let uidCounter = 0;

// const nextId = () => `img-${Date.now()}-${uidCounter++}`;
// const nextDayId = () => `day-${Date.now()}-${uidCounter++}`;

// // Blank itinerary day template
// const emptyDay = (dayNumber) => ({
//   id: nextDayId(),
//   day: dayNumber,
//   title: '',
//   description: '',
//   altitude: '',
//   accommodation: '',
//   meals: '',
//   distance_km: '',
//   duration_hours: '',
// });

// export default function NewTrekPage() {
//   const router = useRouter();

//   const [form, setForm] = useState({
//     title: '',
//     slug: '',
//     description: '',
//     region_id: '',
//     difficulty: 'moderate',
//     duration_days: '',
//     max_altitude: '',
//     price: '',
//     discount_price: '',
//     max_group_size: 12,
//     // These two are collected here for convenience, but the backend only
//     // accepts them via Update Trek — see handleSubmit's follow-up PUT call.
//     is_featured: false,
//     is_expedition: false,
//     meta_title: '',
//     meta_description: '',
//     highlights: '',
//   });

//   // Regions — fetched from the API (treks.region_id -> regions.id), not hardcoded.
//   const [regions, setRegions] = useState([]);
//   const [regionsLoading, setRegionsLoading] = useState(true);

//   useEffect(() => {
//     let isMounted = true;

//     const fetchRegions = async () => {
//       try {
//         const res = await api.get('/regions');
//         const data = res.data?.data || [];
//         const sorted = [...data].sort(
//           (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)
//         );
//         if (isMounted) setRegions(sorted);
//       } catch (err) {
//         console.error('Failed to load regions', err);
//       } finally {
//         if (isMounted) setRegionsLoading(false);
//       }
//     };

//     fetchRegions();

//     return () => {
//       isMounted = false;
//     };
//   }, []);

//   // Itinerary
//   const [itinerary, setItinerary] = useState([emptyDay(1)]);

//   // Cover image
//   const [coverFile, setCoverFile] = useState(null);
//   const [coverPreview, setCoverPreview] = useState(null);
//   const coverInputRef = useRef(null);

//   // Gallery images
//   const [galleryImages, setGalleryImages] = useState([]);
//   const galleryInputRef = useRef(null);

//   // Drag/drop
//   const dragItemIndex = useRef(null);
//   const dragOverIndex = useRef(null);
//   const [draggingId, setDraggingId] = useState(null);

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   // Auto-generate slug
//   const handleTitleChange = (e) => {
//     const title = e.target.value;

//     const slug = title
//       .toLowerCase()
//       .replace(/[^a-z0-9]+/g, '-')
//       .replace(/(^-|-$)/g, '');

//     setForm((f) => ({
//       ...f,
//       title,
//       slug,
//     }));
//   };

//   // =========================================================
//   // ITINERARY
//   // =========================================================

//   const addItineraryDay = () => {
//     setItinerary((prev) => [
//       ...prev,
//       emptyDay(prev.length + 1),
//     ]);
//   };

//   const removeItineraryDay = (id) => {
//     setItinerary((prev) => {
//       const filtered = prev.filter((d) => d.id !== id);

//       return filtered.map((d, idx) => ({
//         ...d,
//         day: idx + 1,
//       }));
//     });
//   };

//   const updateItineraryDay = (id, field, value) => {
//     setItinerary((prev) =>
//       prev.map((d) =>
//         d.id === id
//           ? {
//               ...d,
//               [field]: value,
//             }
//           : d
//       )
//     );
//   };

//   const moveItineraryDay = (index, direction) => {
//     setItinerary((prev) => {
//       const newIndex = index + direction;

//       if (
//         newIndex < 0 ||
//         newIndex >= prev.length
//       ) {
//         return prev;
//       }

//       const newArr = [...prev];

//       [newArr[index], newArr[newIndex]] = [
//         newArr[newIndex],
//         newArr[index],
//       ];

//       return newArr.map((d, idx) => ({
//         ...d,
//         day: idx + 1,
//       }));
//     });
//   };

//   // =========================================================
//   // COVER IMAGE
//   // =========================================================

//   const handleCoverChange = (e) => {
//     const file = e.target.files?.[0];

//     if (!file) return;

//     if (coverPreview) {
//       URL.revokeObjectURL(coverPreview);
//     }

//     setCoverFile(file);
//     setCoverPreview(URL.createObjectURL(file));

//     e.target.value = '';
//   };

//   const removeCover = () => {
//     if (coverPreview) {
//       URL.revokeObjectURL(coverPreview);
//     }

//     setCoverFile(null);
//     setCoverPreview(null);
//   };

//   // =========================================================
//   // GALLERY
//   // =========================================================

//   const handleGalleryChange = (e) => {
//     const files = Array.from(e.target.files || []);

//     if (files.length === 0) return;

//     const newItems = files.map((file) => ({
//       id: nextId(),
//       file,
//       preview: URL.createObjectURL(file),
//     }));

//     setGalleryImages((prev) => [
//       ...prev,
//       ...newItems,
//     ]);

//     e.target.value = '';
//   };

//   const removeGalleryImage = (id) => {
//     setGalleryImages((prev) => {
//       const target = prev.find(
//         (img) => img.id === id
//       );

//       if (target) {
//         URL.revokeObjectURL(target.preview);
//       }

//       return prev.filter(
//         (img) => img.id !== id
//       );
//     });
//   };

//   const moveGalleryImage = (
//     index,
//     direction
//   ) => {
//     setGalleryImages((prev) => {
//       const newIndex = index + direction;

//       if (
//         newIndex < 0 ||
//         newIndex >= prev.length
//       ) {
//         return prev;
//       }

//       const newArr = [...prev];

//       [newArr[index], newArr[newIndex]] = [
//         newArr[newIndex],
//         newArr[index],
//       ];

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

//     if (
//       from !== null &&
//       to !== null &&
//       from !== to
//     ) {
//       setGalleryImages((prev) => {
//         const newArr = [...prev];

//         const [moved] = newArr.splice(
//           from,
//           1
//         );

//         newArr.splice(to, 0, moved);

//         return newArr;
//       });
//     }

//     dragItemIndex.current = null;
//     dragOverIndex.current = null;
//     setDraggingId(null);
//   };

//   // =========================================================
//   // CLEANUP
//   // =========================================================

//   useEffect(() => {
//     return () => {
//       if (coverPreview) {
//         URL.revokeObjectURL(coverPreview);
//       }

//       galleryImages.forEach((img) => {
//         URL.revokeObjectURL(img.preview);
//       });
//     };

//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // =========================================================
//   // IMAGE UPLOAD HELPER
//   // =========================================================
//   // createTrek expects already-hosted URLs (cover_image / gallery_images),
//   // not raw files — there's no trek row yet to attach files to. So each
//   // file is uploaded to a generic endpoint first, and only the resulting
//   // URL is sent along with the rest of the trek payload.
//   //
//   // NOTE: this assumes a generic `POST /upload` endpoint (multipart field
//   // "image") that returns { success: true, data: { url } }. If that route
//   // doesn't exist yet on the backend, it needs to be added — this page
//   // can't create the trek's images any other way given how createTrek
//   // is written.
//   const uploadImage = async (file) => {
//     const formData = new FormData();
//     formData.append('image', file);

//     const res = await api.post('/upload', formData);
//     const url = res.data?.data?.url || res.data?.url;

//     if (!url) {
//       throw new Error(`Upload succeeded but no URL was returned for "${file.name}".`);
//     }

//     return url;
//   };

//   // =========================================================
//   // SUBMIT
//   // =========================================================

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');

//     if (!coverFile) {
//       setError(
//         'Please select a cover image.'
//       );
//       return;
//     }

//     if (!form.region_id) {
//       setError('Please select a region.');
//       return;
//     }

//     const cleanedItinerary = itinerary
//       .filter(
//         (d) =>
//           d.title.trim() ||
//           d.description.trim()
//       )
//       .map(
//         ({
//           id,
//           distance_km,
//           duration_hours,
//           ...rest
//         }) => ({
//           ...rest,
//           distance_km: distance_km
//             ? parseFloat(distance_km)
//             : undefined,
//           duration_hours: duration_hours
//             ? parseFloat(duration_hours)
//             : undefined,
//         })
//       );

//     setLoading(true);

//     try {
//       // Step 1: Upload the cover image, then every gallery image, to get
//       // back hosted URLs. These go into the create payload below.
//       const coverUrl = await uploadImage(coverFile);

//       const uploadedGallery = [];
//       for (let i = 0; i < galleryImages.length; i++) {
//         const url = await uploadImage(galleryImages[i].file);
//         uploadedGallery.push({
//           image_url: url,
//           caption: galleryImages[i].file.name,
//           sort_order: i + 1,
//         });
//       }

//       // Step 2: Create the trek — core info + cover + gallery, all in the
//       // one transactional call the backend expects. Visibility/marketing
//       // flags are deliberately NOT included here; createTrek rejects them.
//       const trekRes = await api.post(
//         '/treks',
//         {
//           title: form.title,
//           slug: form.slug,
//           description: form.description,
//           region_id: form.region_id,
//           difficulty: form.difficulty,

//           duration_days: parseInt(
//             form.duration_days
//           ),

//           max_altitude: form.max_altitude
//             ? parseInt(form.max_altitude)
//             : null,

//           price: parseFloat(form.price),

//           discount_price:
//             form.discount_price
//               ? parseFloat(
//                   form.discount_price
//                 )
//               : null,

//           max_group_size: form.max_group_size,

//           meta_title: form.meta_title,
//           meta_description: form.meta_description,

//           highlights: form.highlights
//             ? form.highlights
//                 .split('\n')
//                 .filter(Boolean)
//             : null,

//           itinerary:
//             cleanedItinerary.length
//               ? cleanedItinerary
//               : null,

//           cover_image: {
//             image_url: coverUrl,
//             caption: coverFile.name,
//           },
//           gallery_images: uploadedGallery,
//         }
//       );

//       const trekId = trekRes.data.data.id;

//       // Step 3: Apply visibility/marketing settings via Update Trek.
//       // Only fire this if the admin actually checked one of the boxes,
//       // so a plain create doesn't trigger an unnecessary second request.
//       if (form.is_featured || form.is_expedition) {
//         await api.put(`/treks/${trekId}`, {
//           is_featured: form.is_featured,
//           is_expedition: form.is_expedition,
//         });
//       }

//       router.push('/admin/treks');
//     } catch (err) {
//       setError(
//         err.response?.data?.message ||
//           err.message ||
//           'Failed to create trek.'
//       );

//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // =========================================================
//   // UI
//   // =========================================================

//   return (
//     <div className="min-h-screen bg-slate-50">
//       <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

//         {/* Header */}
//         <div className="mb-8">
//           <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
//             <div>
//               <div className="mb-2 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-emerald-700">
//                 Trek Management
//               </div>

//               <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
//                 Add New Trek
//               </h1>

//               <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
//                 Create a detailed trek package with
//                 itinerary, pricing, images, SEO
//                 information and expedition settings.
//               </p>
//             </div>

//             <button
//               type="button"
//               onClick={() =>
//                 router.push('/admin/treks')
//               }
//               className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
//             >
//               ← Back to Treks
//             </button>
//           </div>
//         </div>

//         {/* Error */}
//         {error && (
//           <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700 shadow-sm">
//             <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 font-bold">
//               !
//             </div>

//             <div>
//               <p className="font-bold">
//                 Something went wrong
//               </p>

//               <p className="mt-1 text-sm">
//                 {error}
//               </p>
//             </div>
//           </div>
//         )}

//         <form
//           onSubmit={handleSubmit}
//           className="space-y-6"
//         >

//           {/* ================================================= */}
//           {/* BASIC INFORMATION */}
//           {/* ================================================= */}

//           <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
//             <div className="border-b border-slate-100 bg-gradient-to-r from-white to-slate-50 px-6 py-5 sm:px-8">
//               <div className="flex items-center gap-4">
//                 <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-lg">
//                   🏔️
//                 </div>

//                 <div>
//                   <h2 className="text-lg font-extrabold text-slate-900">
//                     Basic Information
//                   </h2>

//                   <p className="text-sm text-slate-500">
//                     Essential information about your trek.
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="p-6 sm:p-8">
//               <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

//                 {/* Title */}
//                 <div className="md:col-span-2">
//                   <label className="mb-2 block text-sm font-bold text-slate-700">
//                     Trek Title *
//                   </label>

//                   <input
//                     type="text"
//                     required
//                     value={form.title}
//                     onChange={handleTitleChange}
//                     placeholder="e.g. Everest Base Camp Trek"
//                     className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
//                   />
//                 </div>

//                 {/* Slug */}
//                 <div>
//                   <label className="mb-2 block text-sm font-bold text-slate-700">
//                     URL Slug *
//                   </label>

//                   <input
//                     type="text"
//                     required
//                     value={form.slug}
//                     onChange={(e) =>
//                       setForm((f) => ({
//                         ...f,
//                         slug: e.target.value,
//                       }))
//                     }
//                     placeholder="auto-generated-from-title"
//                     className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
//                   />
//                 </div>

//                 {/* Region */}
//                 <div>
//                   <label className="mb-2 block text-sm font-bold text-slate-700">
//                     Region *
//                   </label>

//                   <select
//                     required
//                     value={form.region_id}
//                     onChange={(e) =>
//                       setForm((f) => ({
//                         ...f,
//                         region_id: e.target.value,
//                       }))
//                     }
//                     disabled={regionsLoading}
//                     className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 disabled:opacity-60"
//                   >
//                     <option value="">
//                       {regionsLoading
//                         ? 'Loading regions...'
//                         : 'Select Region'}
//                     </option>

//                     {regions.map((r) => (
//                       <option
//                         key={r.id}
//                         value={r.id}
//                       >
//                         {r.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 {/* Difficulty */}
//                 <div>
//                   <label className="mb-2 block text-sm font-bold text-slate-700">
//                     Difficulty *
//                   </label>

//                   <select
//                     value={form.difficulty}
//                     onChange={(e) =>
//                       setForm((f) => ({
//                         ...f,
//                         difficulty:
//                           e.target.value,
//                       }))
//                     }
//                     className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm capitalize text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
//                   >
//                     {difficulties.map((d) => (
//                       <option
//                         key={d}
//                         value={d}
//                       >
//                         {d.charAt(0).toUpperCase() +
//                           d.slice(1)}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 {/* Duration */}
//                 <div>
//                   <label className="mb-2 block text-sm font-bold text-slate-700">
//                     Duration (days) *
//                   </label>

//                   <input
//                     type="number"
//                     required
//                     min="1"
//                     value={form.duration_days}
//                     onChange={(e) =>
//                       setForm((f) => ({
//                         ...f,
//                         duration_days:
//                           e.target.value,
//                       }))
//                     }
//                     placeholder="e.g. 14"
//                     className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
//                   />
//                 </div>

//                 {/* Altitude */}
//                 <div>
//                   <label className="mb-2 block text-sm font-bold text-slate-700">
//                     Max Altitude (m)
//                   </label>

//                   <input
//                     type="number"
//                     value={form.max_altitude}
//                     onChange={(e) =>
//                       setForm((f) => ({
//                         ...f,
//                         max_altitude:
//                           e.target.value,
//                       }))
//                     }
//                     placeholder="e.g. 5364"
//                     className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
//                   />
//                 </div>

//                 {/* Price */}
//                 <div>
//                   <label className="mb-2 block text-sm font-bold text-slate-700">
//                     Price (USD) *
//                   </label>

//                   <div className="relative">
//                     <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
//                       $
//                     </span>

//                     <input
//                       type="number"
//                       required
//                       min="0"
//                       step="0.01"
//                       value={form.price}
//                       onChange={(e) =>
//                         setForm((f) => ({
//                           ...f,
//                           price: e.target.value,
//                         }))
//                       }
//                       placeholder="0.00"
//                       className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-9 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
//                     />
//                   </div>
//                 </div>

//                 {/* Discount */}
//                 <div>
//                   <label className="mb-2 block text-sm font-bold text-slate-700">
//                     Discounted Price
//                     <span className="ml-1 font-normal text-slate-400">
//                       (optional)
//                     </span>
//                   </label>

//                   <div className="relative">
//                     <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
//                       $
//                     </span>

//                     <input
//                       type="number"
//                       min="0"
//                       step="0.01"
//                       value={form.discount_price}
//                       onChange={(e) =>
//                         setForm((f) => ({
//                           ...f,
//                           discount_price:
//                             e.target.value,
//                         }))
//                       }
//                       placeholder="0.00"
//                       className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-9 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
//                     />
//                   </div>
//                 </div>

//                 {/* Group Size */}
//                 <div>
//                   <label className="mb-2 block text-sm font-bold text-slate-700">
//                     Max Group Size
//                   </label>

//                   <input
//                     type="number"
//                     min="1"
//                     value={form.max_group_size}
//                     onChange={(e) =>
//                       setForm((f) => ({
//                         ...f,
//                         max_group_size:
//                           e.target.value,
//                       }))
//                     }
//                     className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
//                   />
//                 </div>
//               </div>

//               {/* Toggles */}
//               <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">

//                 {/* Featured */}
//                 <label
//                   htmlFor="featured"
//                   className={`group flex cursor-pointer items-center gap-4 rounded-2xl border p-5 transition ${
//                     form.is_featured
//                       ? 'border-amber-200 bg-amber-50'
//                       : 'border-slate-200 bg-slate-50 hover:border-slate-300'
//                   }`}
//                 >
//                   <input
//                     type="checkbox"
//                     id="featured"
//                     checked={form.is_featured}
//                     onChange={(e) =>
//                       setForm((f) => ({
//                         ...f,
//                         is_featured:
//                           e.target.checked,
//                       }))
//                     }
//                     className="h-5 w-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
//                   />

//                   <div>
//                     <div className="font-bold text-slate-800">
//                       Feature this trek
//                     </div>

//                     <p className="mt-1 text-xs leading-5 text-slate-500">
//                       Display this trek prominently
//                       on the homepage. Applied right
//                       after the trek is created.
//                     </p>
//                   </div>

//                   <span className="ml-auto rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-400 shadow-sm">
//                     Featured
//                   </span>
//                 </label>

//                 {/* Expedition */}
//                 <label
//                   htmlFor="expedition"
//                   className={`group flex cursor-pointer items-center gap-4 rounded-2xl border p-5 transition ${
//                     form.is_expedition
//                       ? 'border-purple-200 bg-purple-50'
//                       : 'border-slate-200 bg-slate-50 hover:border-slate-300'
//                   }`}
//                 >
//                   <input
//                     type="checkbox"
//                     id="expedition"
//                     checked={form.is_expedition}
//                     onChange={(e) =>
//                       setForm((f) => ({
//                         ...f,
//                         is_expedition:
//                           e.target.checked,
//                       }))
//                     }
//                     className="h-5 w-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
//                   />

//                   <div>
//                     <div className="font-bold text-slate-800">
//                       Is Expedition
//                     </div>

//                     <p className="mt-1 text-xs leading-5 text-slate-500">
//                       Mark this trek as a mountaineering
//                       or expedition package. Applied
//                       right after the trek is created.
//                     </p>
//                   </div>

//                   <span className="ml-auto rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-400 shadow-sm">
//                     Expedition
//                   </span>
//                 </label>
//               </div>

//               {/* Description */}
//               <div className="mt-8">
//                 <label className="mb-2 block text-sm font-bold text-slate-700">
//                   Description *
//                 </label>

//                 <textarea
//                   required
//                   rows={6}
//                   value={form.description}
//                   onChange={(e) =>
//                     setForm((f) => ({
//                       ...f,
//                       description:
//                         e.target.value,
//                     }))
//                   }
//                   placeholder="Write a detailed description of the trek..."
//                   className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
//                 />
//               </div>

//               {/* Highlights */}
//               <div className="mt-6">
//                 <label className="mb-2 block text-sm font-bold text-slate-700">
//                   Highlights
//                   <span className="ml-2 font-normal text-slate-400">
//                     One per line
//                   </span>
//                 </label>

//                 <textarea
//                   rows={5}
//                   value={form.highlights}
//                   onChange={(e) =>
//                     setForm((f) => ({
//                       ...f,
//                       highlights:
//                         e.target.value,
//                     }))
//                   }
//                   placeholder={
//                     'Stand at Everest Base Camp 5,364m\nVisit Tengboche Monastery\nCross Cho La Pass'
//                   }
//                   className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
//                 />
//               </div>
//             </div>
//           </section>

//           {/* ================================================= */}
//           {/* ITINERARY */}
//           {/* ================================================= */}

//           <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
//             <div className="flex flex-col gap-4 border-b border-slate-100 bg-gradient-to-r from-white to-slate-50 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
//               <div className="flex items-center gap-4">
//                 <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-lg">
//                   🗺️
//                 </div>

//                 <div>
//                   <h2 className="text-lg font-extrabold text-slate-900">
//                     Day-by-Day Itinerary
//                   </h2>

//                   <p className="text-sm text-slate-500">
//                     Build the complete trek itinerary.
//                   </p>
//                 </div>
//               </div>

//               <button
//                 type="button"
//                 onClick={addItineraryDay}
//                 className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 hover:shadow-md"
//               >
//                 + Add Day
//               </button>
//             </div>

//             <div className="space-y-5 p-6 sm:p-8">
//               {itinerary.map((d, i) => (
//                 <div
//                   key={d.id}
//                   className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
//                 >
//                   {/* Day header */}
//                   <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
//                     <div className="flex items-center gap-3">
//                       <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-sm font-black text-white shadow-sm">
//                         {d.day}
//                       </span>

//                       <div>
//                         <p className="text-sm font-extrabold text-slate-800">
//                           Day {d.day}
//                         </p>

//                         <p className="text-xs text-slate-400">
//                           Itinerary details
//                         </p>
//                       </div>
//                     </div>

//                     <div className="flex items-center gap-1.5">
//                       <button
//                         type="button"
//                         onClick={() =>
//                           moveItineraryDay(
//                             i,
//                             -1
//                           )
//                         }
//                         disabled={i === 0}
//                         className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30"
//                         title="Move up"
//                       >
//                         ↑
//                       </button>

//                       <button
//                         type="button"
//                         onClick={() =>
//                           moveItineraryDay(
//                             i,
//                             1
//                           )
//                         }
//                         disabled={
//                           i ===
//                           itinerary.length - 1
//                         }
//                         className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30"
//                         title="Move down"
//                       >
//                         ↓
//                       </button>

//                       <button
//                         type="button"
//                         onClick={() =>
//                           removeItineraryDay(
//                             d.id
//                           )
//                         }
//                         disabled={
//                           itinerary.length ===
//                           1
//                         }
//                         className="ml-1 flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-500 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-30"
//                         title="Remove day"
//                       >
//                         ×
//                       </button>
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2">

//                     {/* Day title */}
//                     <div className="md:col-span-2">
//                       <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
//                         Day Title *
//                       </label>

//                       <input
//                         type="text"
//                         value={d.title}
//                         onChange={(e) =>
//                           updateItineraryDay(
//                             d.id,
//                             'title',
//                             e.target.value
//                           )
//                         }
//                         placeholder="e.g. Fly to Lukla, trek to Phakding"
//                         className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
//                       />
//                     </div>

//                     {/* Description */}
//                     <div className="md:col-span-2">
//                       <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
//                         Description
//                       </label>

//                       <textarea
//                         rows={4}
//                         value={d.description}
//                         onChange={(e) =>
//                           updateItineraryDay(
//                             d.id,
//                             'description',
//                             e.target.value
//                           )
//                         }
//                         placeholder="Details about today's trek..."
//                         className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
//                       />
//                     </div>

//                     {/* Altitude */}
//                     <div>
//                       <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
//                         Altitude
//                       </label>

//                       <input
//                         type="text"
//                         value={d.altitude}
//                         onChange={(e) =>
//                           updateItineraryDay(
//                             d.id,
//                             'altitude',
//                             e.target.value
//                           )
//                         }
//                         placeholder="e.g. 2,610m"
//                         className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
//                       />
//                     </div>

//                     {/* Accommodation */}
//                     <div>
//                       <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
//                         Accommodation
//                       </label>

//                       <input
//                         type="text"
//                         value={d.accommodation}
//                         onChange={(e) =>
//                           updateItineraryDay(
//                             d.id,
//                             'accommodation',
//                             e.target.value
//                           )
//                         }
//                         placeholder="e.g. Teahouse"
//                         className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
//                       />
//                     </div>

//                     {/* Meals */}
//                     <div>
//                       <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
//                         Meals
//                       </label>

//                       <input
//                         type="text"
//                         value={d.meals}
//                         onChange={(e) =>
//                           updateItineraryDay(
//                             d.id,
//                             'meals',
//                             e.target.value
//                           )
//                         }
//                         placeholder="e.g. B, L, D"
//                         className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
//                       />
//                     </div>

//                     {/* Distance */}
//                     <div>
//                       <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
//                         Distance (km)
//                       </label>

//                       <input
//                         type="number"
//                         step="0.1"
//                         min="0"
//                         value={d.distance_km}
//                         onChange={(e) =>
//                           updateItineraryDay(
//                             d.id,
//                             'distance_km',
//                             e.target.value
//                           )
//                         }
//                         placeholder="e.g. 8.5"
//                         className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
//                       />
//                     </div>

//                     {/* Duration */}
//                     <div>
//                       <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
//                         Duration (hours)
//                       </label>

//                       <input
//                         type="number"
//                         step="0.5"
//                         min="0"
//                         value={d.duration_hours}
//                         onChange={(e) =>
//                           updateItineraryDay(
//                             d.id,
//                             'duration_hours',
//                             e.target.value
//                           )
//                         }
//                         placeholder="e.g. 5"
//                         className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </section>

//           {/* ================================================= */}
//           {/* COVER IMAGE */}
//           {/* ================================================= */}

//           <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
//             <div className="border-b border-slate-100 bg-gradient-to-r from-white to-slate-50 px-6 py-5 sm:px-8">
//               <div className="flex items-center gap-4">
//                 <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 text-lg">
//                   🖼️
//                 </div>

//                 <div>
//                   <h2 className="text-lg font-extrabold text-slate-900">
//                     Cover Image
//                     <span className="ml-2 text-red-500">
//                       *
//                     </span>
//                   </h2>

//                   <p className="text-sm text-slate-500">
//                     Used for the trek card, hero banner
//                     and SEO/OpenGraph image.
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="p-6 sm:p-8">
//               {!coverPreview ? (
//                 <div
//                   onClick={() =>
//                     coverInputRef.current?.click()
//                   }
//                   className="group cursor-pointer rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center transition hover:border-emerald-400 hover:bg-emerald-50/30"
//                 >
//                   <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
//                     📷
//                   </div>

//                   <p className="font-bold text-slate-700">
//                     Click to select a cover image
//                   </p>

//                   <p className="mt-2 text-sm text-slate-400">
//                     JPG, PNG, WEBP and other image
//                     formats
//                   </p>

//                   <input
//                     ref={coverInputRef}
//                     type="file"
//                     accept="image/*"
//                     className="hidden"
//                     onChange={
//                       handleCoverChange
//                     }
//                   />
//                 </div>
//               ) : (
//                 <div className="flex flex-col gap-5 sm:flex-row">
//                   <div className="relative overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
//                     <img
//                       src={coverPreview}
//                       alt="Cover preview"
//                       className="h-56 w-full object-cover sm:w-96"
//                     />

//                     <span className="absolute left-3 top-3 rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white shadow">
//                       Cover Image
//                     </span>
//                   </div>

//                   <div className="flex items-center gap-3 sm:flex-col sm:items-start sm:justify-center">
//                     <button
//                       type="button"
//                       onClick={() =>
//                         coverInputRef.current?.click()
//                       }
//                       className="rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100"
//                     >
//                       Replace
//                     </button>

//                     <input
//                       ref={coverInputRef}
//                       type="file"
//                       accept="image/*"
//                       className="hidden"
//                       onChange={
//                         handleCoverChange
//                       }
//                     />

//                     <button
//                       type="button"
//                       onClick={removeCover}
//                       className="rounded-xl bg-red-50 px-4 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-100"
//                     >
//                       Remove
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </section>

//           {/* ================================================= */}
//           {/* GALLERY */}
//           {/* ================================================= */}

//           <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
//             <div className="border-b border-slate-100 bg-gradient-to-r from-white to-slate-50 px-6 py-5 sm:px-8">
//               <div className="flex items-center gap-4">
//                 <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pink-100 text-lg">
//                   🏞️
//                 </div>

//                 <div>
//                   <h2 className="text-lg font-extrabold text-slate-900">
//                     Gallery Images
//                     <span className="ml-2 text-sm font-normal text-slate-400">
//                       Optional
//                     </span>
//                   </h2>

//                   <p className="text-sm text-slate-500">
//                     Add additional images to showcase
//                     the trek.
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="p-6 sm:p-8">
//               <div
//                 onClick={() =>
//                   galleryInputRef.current?.click()
//                 }
//                 className="cursor-pointer rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center transition hover:border-emerald-400 hover:bg-emerald-50/30"
//               >
//                 <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-xl shadow-sm">
//                   📸
//                 </div>

//                 <p className="font-bold text-slate-700">
//                   Click to add gallery images
//                 </p>

//                 <p className="mt-1 text-sm text-slate-400">
//                   You can select more images later.
//                 </p>

//                 <input
//                   ref={galleryInputRef}
//                   type="file"
//                   accept="image/*"
//                   multiple
//                   className="hidden"
//                   onChange={
//                     handleGalleryChange
//                   }
//                 />
//               </div>

//               {galleryImages.length > 0 && (
//                 <>
//                   <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
//                     {galleryImages.map(
//                       (img, i) => (
//                         <div
//                           key={img.id}
//                           draggable
//                           onDragStart={() =>
//                             handleDragStart(i)
//                           }
//                           onDragEnter={() =>
//                             handleDragEnter(i)
//                           }
//                           onDragOver={(e) =>
//                             e.preventDefault()
//                           }
//                           onDragEnd={
//                             handleDragEnd
//                           }
//                           className={`group relative overflow-hidden rounded-2xl border-2 border-slate-200 bg-white shadow-sm transition ${
//                             draggingId ===
//                             img.id
//                               ? 'scale-95 opacity-40'
//                               : 'hover:-translate-y-1 hover:shadow-md'
//                           }`}
//                         >
//                           <img
//                             src={img.preview}
//                             alt={img.file.name}
//                             className="h-36 w-full object-cover"
//                           />

//                           <span className="absolute left-2 top-2 rounded-lg bg-slate-900/80 px-2 py-1 text-xs font-bold text-white">
//                             #{i + 1}
//                           </span>

//                           <button
//                             type="button"
//                             onClick={() =>
//                               removeGalleryImage(
//                                 img.id
//                               )
//                             }
//                             className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-sm font-bold text-white shadow transition hover:bg-red-600"
//                             title="Remove"
//                           >
//                             ×
//                           </button>

//                           <div className="absolute bottom-2 right-2 flex gap-1">
//                             <button
//                               type="button"
//                               onClick={() =>
//                                 moveGalleryImage(
//                                   i,
//                                   -1
//                                 )
//                               }
//                               disabled={i === 0}
//                               className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/95 text-slate-700 shadow transition hover:bg-white disabled:opacity-30"
//                               title="Move left"
//                             >
//                               ‹
//                             </button>

//                             <button
//                               type="button"
//                               onClick={() =>
//                                 moveGalleryImage(
//                                   i,
//                                   1
//                                 )
//                               }
//                               disabled={
//                                 i ===
//                                 galleryImages.length -
//                                   1
//                               }
//                               className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/95 text-slate-700 shadow transition hover:bg-white disabled:opacity-30"
//                               title="Move right"
//                             >
//                               ›
//                             </button>
//                           </div>
//                         </div>
//                       )
//                     )}
//                   </div>

//                   <p className="mt-4 text-xs text-slate-400">
//                     Drag images to reorder them, or
//                     use the arrow buttons.
//                   </p>
//                 </>
//               )}
//             </div>
//           </section>

//           {/* ================================================= */}
//           {/* SEO */}
//           {/* ================================================= */}

//           <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
//             <div className="border-b border-slate-100 bg-gradient-to-r from-white to-slate-50 px-6 py-5 sm:px-8">
//               <div className="flex items-center gap-4">
//                 <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-lg">
//                   🔎
//                 </div>

//                 <div>
//                   <h2 className="text-lg font-extrabold text-slate-900">
//                     SEO Settings
//                   </h2>

//                   <p className="text-sm text-slate-500">
//                     Optimize this trek for search engines.
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="space-y-6 p-6 sm:p-8">

//               {/* Meta title */}
//               <div>
//                 <div className="mb-2 flex items-center justify-between">
//                   <label className="text-sm font-bold text-slate-700">
//                     Meta Title
//                   </label>

//                   <span className="text-xs font-medium text-slate-400">
//                     {form.meta_title.length}/70
//                   </span>
//                 </div>

//                 <input
//                   type="text"
//                   maxLength={70}
//                   value={form.meta_title}
//                   onChange={(e) =>
//                     setForm((f) => ({
//                       ...f,
//                       meta_title:
//                         e.target.value,
//                     }))
//                   }
//                   placeholder={`${form.title || 'Trek title'} | Himalaya Treks`}
//                   className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
//                 />
//               </div>

//               {/* Meta description */}
//               <div>
//                 <div className="mb-2 flex items-center justify-between">
//                   <label className="text-sm font-bold text-slate-700">
//                     Meta Description
//                   </label>

//                   <span className="text-xs font-medium text-slate-400">
//                     {form.meta_description.length}/170
//                   </span>
//                 </div>

//                 <textarea
//                   rows={4}
//                   maxLength={170}
//                   value={form.meta_description}
//                   onChange={(e) =>
//                     setForm((f) => ({
//                       ...f,
//                       meta_description:
//                         e.target.value,
//                     }))
//                   }
//                   placeholder="Compelling description that appears in Google search results..."
//                   className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
//                 />
//               </div>
//             </div>
//           </section>

//           {/* ================================================= */}
//           {/* ACTIONS */}
//           {/* ================================================= */}

//           <div className="sticky bottom-4 z-20">
//             <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur sm:flex-row sm:items-center sm:justify-between">

//               <div className="hidden sm:block">
//                 <p className="text-sm font-bold text-slate-800">
//                   Ready to publish?
//                 </p>

//                 <p className="text-xs text-slate-400">
//                   Review the information before creating
//                   the trek.
//                 </p>
//               </div>

//               <div className="flex w-full gap-3 sm:w-auto">
//                 <button
//                   type="button"
//                   onClick={() =>
//                     router.push(
//                       '/admin/treks'
//                     )
//                   }
//                   className="flex-1 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50 sm:flex-none"
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="flex-1 rounded-xl bg-emerald-600 px-8 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 hover:shadow-xl disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none sm:flex-none"
//                 >
//                   {loading
//                     ? 'Creating & Uploading...'
//                     : 'Create Trek'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }


'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

const difficulties = ['easy', 'moderate', 'challenging', 'extreme'];

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
    title: '',
    slug: '',
    description: '',
    region_id: '',
    difficulty: 'moderate',
    duration_days: '',
    max_altitude: '',
    price: '',
    discount_price: '',
    max_group_size: 12,
    // These two are collected here for convenience, but the backend only
    // accepts them via Update Trek — see handleSubmit's follow-up PUT call.
    is_featured: false,
    is_expedition: false,
    meta_title: '',
    meta_description: '',
    highlights: '',
  });

  // Regions — fetched from the API (treks.region_id -> regions.id), not hardcoded.
  const [regions, setRegions] = useState([]);
  const [regionsLoading, setRegionsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchRegions = async () => {
      try {
        const res = await api.get('/regions');
        const data = res.data?.data || [];
        const sorted = [...data].sort(
          (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)
        );
        if (isMounted) setRegions(sorted);
      } catch (err) {
        console.error('Failed to load regions', err);
      } finally {
        if (isMounted) setRegionsLoading(false);
      }
    };

    fetchRegions();

    return () => {
      isMounted = false;
    };
  }, []);

  // Itinerary
  const [itinerary, setItinerary] = useState([emptyDay(1)]);

  // Cover image
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const coverInputRef = useRef(null);

  // Gallery images
  const [galleryImages, setGalleryImages] = useState([]);
  const galleryInputRef = useRef(null);

  // Drag/drop
  const dragItemIndex = useRef(null);
  const dragOverIndex = useRef(null);
  const [draggingId, setDraggingId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Auto-generate slug
  const handleTitleChange = (e) => {
    const title = e.target.value;

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    setForm((f) => ({
      ...f,
      title,
      slug,
    }));
  };

  // =========================================================
  // ITINERARY
  // =========================================================

  const addItineraryDay = () => {
    setItinerary((prev) => [
      ...prev,
      emptyDay(prev.length + 1),
    ]);
  };

  const removeItineraryDay = (id) => {
    setItinerary((prev) => {
      const filtered = prev.filter((d) => d.id !== id);

      return filtered.map((d, idx) => ({
        ...d,
        day: idx + 1,
      }));
    });
  };

  const updateItineraryDay = (id, field, value) => {
    setItinerary((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              [field]: value,
            }
          : d
      )
    );
  };

  const moveItineraryDay = (index, direction) => {
    setItinerary((prev) => {
      const newIndex = index + direction;

      if (
        newIndex < 0 ||
        newIndex >= prev.length
      ) {
        return prev;
      }

      const newArr = [...prev];

      [newArr[index], newArr[newIndex]] = [
        newArr[newIndex],
        newArr[index],
      ];

      return newArr.map((d, idx) => ({
        ...d,
        day: idx + 1,
      }));
    });
  };

  // =========================================================
  // COVER IMAGE
  // =========================================================

  const handleCoverChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (coverPreview) {
      URL.revokeObjectURL(coverPreview);
    }

    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));

    e.target.value = '';
  };

  const removeCover = () => {
    if (coverPreview) {
      URL.revokeObjectURL(coverPreview);
    }

    setCoverFile(null);
    setCoverPreview(null);
  };

  // =========================================================
  // GALLERY
  // =========================================================

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    const newItems = files.map((file) => ({
      id: nextId(),
      file,
      preview: URL.createObjectURL(file),
    }));

    setGalleryImages((prev) => [
      ...prev,
      ...newItems,
    ]);

    e.target.value = '';
  };

  const removeGalleryImage = (id) => {
    setGalleryImages((prev) => {
      const target = prev.find(
        (img) => img.id === id
      );

      if (target) {
        URL.revokeObjectURL(target.preview);
      }

      return prev.filter(
        (img) => img.id !== id
      );
    });
  };

  const moveGalleryImage = (
    index,
    direction
  ) => {
    setGalleryImages((prev) => {
      const newIndex = index + direction;

      if (
        newIndex < 0 ||
        newIndex >= prev.length
      ) {
        return prev;
      }

      const newArr = [...prev];

      [newArr[index], newArr[newIndex]] = [
        newArr[newIndex],
        newArr[index],
      ];

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

    if (
      from !== null &&
      to !== null &&
      from !== to
    ) {
      setGalleryImages((prev) => {
        const newArr = [...prev];

        const [moved] = newArr.splice(
          from,
          1
        );

        newArr.splice(to, 0, moved);

        return newArr;
      });
    }

    dragItemIndex.current = null;
    dragOverIndex.current = null;
    setDraggingId(null);
  };

  // =========================================================
  // CLEANUP
  // =========================================================

  useEffect(() => {
    return () => {
      if (coverPreview) {
        URL.revokeObjectURL(coverPreview);
      }

      galleryImages.forEach((img) => {
        URL.revokeObjectURL(img.preview);
      });
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // =========================================================
  // IMAGE UPLOAD HELPER
  // =========================================================
  // Images are uploaded per-image straight to Cloudinary via the existing
  // imageController, scoped to a trek that must already exist — so this
  // is called AFTER createTrek returns an id, once per file (cover, then
  // each gallery image). Field names here (image, caption, is_cover,
  // sort_order) must match what uploadTrekImage reads off req.body/req.file.
  const uploadTrekImage = async (trekId, file, { isCover, sortOrder }) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('caption', file.name);
    formData.append('is_cover', String(isCover));
    formData.append('sort_order', String(sortOrder));

    const res = await api.post(`/images/trek/${trekId}`, formData);
    return res.data?.data;
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!coverFile) {
      setError(
        'Please select a cover image.'
      );
      return;
    }

    if (!form.region_id) {
      setError('Please select a region.');
      return;
    }

    const cleanedItinerary = itinerary
      .filter(
        (d) =>
          d.title.trim() ||
          d.description.trim()
      )
      .map(
        ({
          id,
          distance_km,
          duration_hours,
          ...rest
        }) => ({
          ...rest,
          distance_km: distance_km
            ? parseFloat(distance_km)
            : undefined,
          duration_hours: duration_hours
            ? parseFloat(duration_hours)
            : undefined,
        })
      );

    setLoading(true);

    try {
      // Step 1: Create the trek — core info only. Visibility/marketing
      // flags are deliberately NOT included here; createTrek rejects them.
      // No images are sent yet: uploadTrekImage needs a real trek id to
      // attach to, which doesn't exist until this call returns.
      const trekRes = await api.post(
        '/treks',
        {
          title: form.title,
          slug: form.slug,
          description: form.description,
          region_id: form.region_id,
          difficulty: form.difficulty,

          duration_days: parseInt(
            form.duration_days
          ),

          max_altitude: form.max_altitude
            ? parseInt(form.max_altitude)
            : null,

          price: parseFloat(form.price),

          discount_price:
            form.discount_price
              ? parseFloat(
                  form.discount_price
                )
              : null,

          max_group_size: form.max_group_size,

          meta_title: form.meta_title,
          meta_description: form.meta_description,

          highlights: form.highlights
            ? form.highlights
                .split('\n')
                .filter(Boolean)
            : null,

          itinerary:
            cleanedItinerary.length
              ? cleanedItinerary
              : null,
        }
      );

      const trekId = trekRes.data.data.id;

      // Step 2: Cover image — uploaded straight to Cloudinary via the
      // existing image controller, marked is_cover so it also sets
      // treks.cover_image server-side.
      await uploadTrekImage(trekId, coverFile, {
        isCover: true,
        sortOrder: 0,
      });

      // Step 3: Gallery images, in order.
      for (let i = 0; i < galleryImages.length; i++) {
        await uploadTrekImage(trekId, galleryImages[i].file, {
          isCover: false,
          sortOrder: i + 1,
        });
      }

      // Step 4: Apply visibility/marketing settings via Update Trek.
      // Only fire this if the admin actually checked one of the boxes,
      // so a plain create doesn't trigger an unnecessary second request.
      if (form.is_featured || form.is_expedition) {
        await api.put(`/treks/${trekId}`, {
          is_featured: form.is_featured,
          is_expedition: form.is_expedition,
        });
      }

      router.push('/admin/treks');
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'Failed to create trek.'
      );

      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-emerald-700">
                Trek Management
              </div>

              <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                Add New Trek
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Create a detailed trek package with
                itinerary, pricing, images, SEO
                information and expedition settings.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                router.push('/admin/treks')
              }
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
            >
              ← Back to Treks
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700 shadow-sm">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 font-bold">
              !
            </div>

            <div>
              <p className="font-bold">
                Something went wrong
              </p>

              <p className="mt-1 text-sm">
                {error}
              </p>
            </div>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* ================================================= */}
          {/* BASIC INFORMATION */}
          {/* ================================================= */}

          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 bg-gradient-to-r from-white to-slate-50 px-6 py-5 sm:px-8">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-lg">
                  🏔️
                </div>

                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">
                    Basic Information
                  </h2>

                  <p className="text-sm text-slate-500">
                    Essential information about your trek.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                {/* Title */}
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Trek Title *
                  </label>

                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={handleTitleChange}
                    placeholder="e.g. Everest Base Camp Trek"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    URL Slug *
                  </label>

                  <input
                    type="text"
                    required
                    value={form.slug}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        slug: e.target.value,
                      }))
                    }
                    placeholder="auto-generated-from-title"
                    className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                  />
                </div>

                {/* Region */}
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Region *
                  </label>

                  <select
                    required
                    value={form.region_id}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        region_id: e.target.value,
                      }))
                    }
                    disabled={regionsLoading}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 disabled:opacity-60"
                  >
                    <option value="">
                      {regionsLoading
                        ? 'Loading regions...'
                        : 'Select Region'}
                    </option>

                    {regions.map((r) => (
                      <option
                        key={r.id}
                        value={r.id}
                      >
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Difficulty */}
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Difficulty *
                  </label>

                  <select
                    value={form.difficulty}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        difficulty:
                          e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm capitalize text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                  >
                    {difficulties.map((d) => (
                      <option
                        key={d}
                        value={d}
                      >
                        {d.charAt(0).toUpperCase() +
                          d.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Duration */}
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Duration (days) *
                  </label>

                  <input
                    type="number"
                    required
                    min="1"
                    value={form.duration_days}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        duration_days:
                          e.target.value,
                      }))
                    }
                    placeholder="e.g. 14"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                  />
                </div>

                {/* Altitude */}
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Max Altitude (m)
                  </label>

                  <input
                    type="number"
                    value={form.max_altitude}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        max_altitude:
                          e.target.value,
                      }))
                    }
                    placeholder="e.g. 5364"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Price (USD) *
                  </label>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                      $
                    </span>

                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={form.price}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          price: e.target.value,
                        }))
                      }
                      placeholder="0.00"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-9 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                    />
                  </div>
                </div>

                {/* Discount */}
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Discounted Price
                    <span className="ml-1 font-normal text-slate-400">
                      (optional)
                    </span>
                  </label>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                      $
                    </span>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.discount_price}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          discount_price:
                            e.target.value,
                        }))
                      }
                      placeholder="0.00"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-9 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                    />
                  </div>
                </div>

                {/* Group Size */}
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Max Group Size
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={form.max_group_size}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        max_group_size:
                          e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">

                {/* Featured */}
                <label
                  htmlFor="featured"
                  className={`group flex cursor-pointer items-center gap-4 rounded-2xl border p-5 transition ${
                    form.is_featured
                      ? 'border-amber-200 bg-amber-50'
                      : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    id="featured"
                    checked={form.is_featured}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        is_featured:
                          e.target.checked,
                      }))
                    }
                    className="h-5 w-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />

                  <div>
                    <div className="font-bold text-slate-800">
                      Feature this trek
                    </div>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Display this trek prominently
                      on the homepage. Applied right
                      after the trek is created.
                    </p>
                  </div>

                  <span className="ml-auto rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-400 shadow-sm">
                    Featured
                  </span>
                </label>

                {/* Expedition */}
                <label
                  htmlFor="expedition"
                  className={`group flex cursor-pointer items-center gap-4 rounded-2xl border p-5 transition ${
                    form.is_expedition
                      ? 'border-purple-200 bg-purple-50'
                      : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    id="expedition"
                    checked={form.is_expedition}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        is_expedition:
                          e.target.checked,
                      }))
                    }
                    className="h-5 w-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />

                  <div>
                    <div className="font-bold text-slate-800">
                      Is Expedition
                    </div>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Mark this trek as a mountaineering
                      or expedition package. Applied
                      right after the trek is created.
                    </p>
                  </div>

                  <span className="ml-auto rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-400 shadow-sm">
                    Expedition
                  </span>
                </label>
              </div>

              {/* Description */}
              <div className="mt-8">
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Description *
                </label>

                <textarea
                  required
                  rows={6}
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      description:
                        e.target.value,
                    }))
                  }
                  placeholder="Write a detailed description of the trek..."
                  className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>

              {/* Highlights */}
              <div className="mt-6">
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Highlights
                  <span className="ml-2 font-normal text-slate-400">
                    One per line
                  </span>
                </label>

                <textarea
                  rows={5}
                  value={form.highlights}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      highlights:
                        e.target.value,
                    }))
                  }
                  placeholder={
                    'Stand at Everest Base Camp 5,364m\nVisit Tengboche Monastery\nCross Cho La Pass'
                  }
                  className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>
            </div>
          </section>

          {/* ================================================= */}
          {/* ITINERARY */}
          {/* ================================================= */}

          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-slate-100 bg-gradient-to-r from-white to-slate-50 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-lg">
                  🗺️
                </div>

                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">
                    Day-by-Day Itinerary
                  </h2>

                  <p className="text-sm text-slate-500">
                    Build the complete trek itinerary.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={addItineraryDay}
                className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 hover:shadow-md"
              >
                + Add Day
              </button>
            </div>

            <div className="space-y-5 p-6 sm:p-8">
              {itinerary.map((d, i) => (
                <div
                  key={d.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
                >
                  {/* Day header */}
                  <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-sm font-black text-white shadow-sm">
                        {d.day}
                      </span>

                      <div>
                        <p className="text-sm font-extrabold text-slate-800">
                          Day {d.day}
                        </p>

                        <p className="text-xs text-slate-400">
                          Itinerary details
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          moveItineraryDay(
                            i,
                            -1
                          )
                        }
                        disabled={i === 0}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30"
                        title="Move up"
                      >
                        ↑
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          moveItineraryDay(
                            i,
                            1
                          )
                        }
                        disabled={
                          i ===
                          itinerary.length - 1
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30"
                        title="Move down"
                      >
                        ↓
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          removeItineraryDay(
                            d.id
                          )
                        }
                        disabled={
                          itinerary.length ===
                          1
                        }
                        className="ml-1 flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-500 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-30"
                        title="Remove day"
                      >
                        ×
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2">

                    {/* Day title */}
                    <div className="md:col-span-2">
                      <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                        Day Title *
                      </label>

                      <input
                        type="text"
                        value={d.title}
                        onChange={(e) =>
                          updateItineraryDay(
                            d.id,
                            'title',
                            e.target.value
                          )
                        }
                        placeholder="e.g. Fly to Lukla, trek to Phakding"
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                      />
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                      <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                        Description
                      </label>

                      <textarea
                        rows={4}
                        value={d.description}
                        onChange={(e) =>
                          updateItineraryDay(
                            d.id,
                            'description',
                            e.target.value
                          )
                        }
                        placeholder="Details about today's trek..."
                        className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                      />
                    </div>

                    {/* Altitude */}
                    <div>
                      <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                        Altitude
                      </label>

                      <input
                        type="text"
                        value={d.altitude}
                        onChange={(e) =>
                          updateItineraryDay(
                            d.id,
                            'altitude',
                            e.target.value
                          )
                        }
                        placeholder="e.g. 2,610m"
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                      />
                    </div>

                    {/* Accommodation */}
                    <div>
                      <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                        Accommodation
                      </label>

                      <input
                        type="text"
                        value={d.accommodation}
                        onChange={(e) =>
                          updateItineraryDay(
                            d.id,
                            'accommodation',
                            e.target.value
                          )
                        }
                        placeholder="e.g. Teahouse"
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                      />
                    </div>

                    {/* Meals */}
                    <div>
                      <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                        Meals
                      </label>

                      <input
                        type="text"
                        value={d.meals}
                        onChange={(e) =>
                          updateItineraryDay(
                            d.id,
                            'meals',
                            e.target.value
                          )
                        }
                        placeholder="e.g. B, L, D"
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                      />
                    </div>

                    {/* Distance */}
                    <div>
                      <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                        Distance (km)
                      </label>

                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={d.distance_km}
                        onChange={(e) =>
                          updateItineraryDay(
                            d.id,
                            'distance_km',
                            e.target.value
                          )
                        }
                        placeholder="e.g. 8.5"
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                      />
                    </div>

                    {/* Duration */}
                    <div>
                      <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                        Duration (hours)
                      </label>

                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        value={d.duration_hours}
                        onChange={(e) =>
                          updateItineraryDay(
                            d.id,
                            'duration_hours',
                            e.target.value
                          )
                        }
                        placeholder="e.g. 5"
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ================================================= */}
          {/* COVER IMAGE */}
          {/* ================================================= */}

          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 bg-gradient-to-r from-white to-slate-50 px-6 py-5 sm:px-8">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 text-lg">
                  🖼️
                </div>

                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">
                    Cover Image
                    <span className="ml-2 text-red-500">
                      *
                    </span>
                  </h2>

                  <p className="text-sm text-slate-500">
                    Used for the trek card, hero banner
                    and SEO/OpenGraph image.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              {!coverPreview ? (
                <div
                  onClick={() =>
                    coverInputRef.current?.click()
                  }
                  className="group cursor-pointer rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center transition hover:border-emerald-400 hover:bg-emerald-50/30"
                >
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
                    📷
                  </div>

                  <p className="font-bold text-slate-700">
                    Click to select a cover image
                  </p>

                  <p className="mt-2 text-sm text-slate-400">
                    JPG, PNG, WEBP and other image
                    formats
                  </p>

                  <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={
                      handleCoverChange
                    }
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-5 sm:flex-row">
                  <div className="relative overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
                    <img
                      src={coverPreview}
                      alt="Cover preview"
                      className="h-56 w-full object-cover sm:w-96"
                    />

                    <span className="absolute left-3 top-3 rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white shadow">
                      Cover Image
                    </span>
                  </div>

                  <div className="flex items-center gap-3 sm:flex-col sm:items-start sm:justify-center">
                    <button
                      type="button"
                      onClick={() =>
                        coverInputRef.current?.click()
                      }
                      className="rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100"
                    >
                      Replace
                    </button>

                    <input
                      ref={coverInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={
                        handleCoverChange
                      }
                    />

                    <button
                      type="button"
                      onClick={removeCover}
                      className="rounded-xl bg-red-50 px-4 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-100"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* ================================================= */}
          {/* GALLERY */}
          {/* ================================================= */}

          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 bg-gradient-to-r from-white to-slate-50 px-6 py-5 sm:px-8">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pink-100 text-lg">
                  🏞️
                </div>

                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">
                    Gallery Images
                    <span className="ml-2 text-sm font-normal text-slate-400">
                      Optional
                    </span>
                  </h2>

                  <p className="text-sm text-slate-500">
                    Add additional images to showcase
                    the trek.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <div
                onClick={() =>
                  galleryInputRef.current?.click()
                }
                className="cursor-pointer rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center transition hover:border-emerald-400 hover:bg-emerald-50/30"
              >
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-xl shadow-sm">
                  📸
                </div>

                <p className="font-bold text-slate-700">
                  Click to add gallery images
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  You can select more images later.
                </p>

                <input
                  ref={galleryInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={
                    handleGalleryChange
                  }
                />
              </div>

              {galleryImages.length > 0 && (
                <>
                  <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                    {galleryImages.map(
                      (img, i) => (
                        <div
                          key={img.id}
                          draggable
                          onDragStart={() =>
                            handleDragStart(i)
                          }
                          onDragEnter={() =>
                            handleDragEnter(i)
                          }
                          onDragOver={(e) =>
                            e.preventDefault()
                          }
                          onDragEnd={
                            handleDragEnd
                          }
                          className={`group relative overflow-hidden rounded-2xl border-2 border-slate-200 bg-white shadow-sm transition ${
                            draggingId ===
                            img.id
                              ? 'scale-95 opacity-40'
                              : 'hover:-translate-y-1 hover:shadow-md'
                          }`}
                        >
                          <img
                            src={img.preview}
                            alt={img.file.name}
                            className="h-36 w-full object-cover"
                          />

                          <span className="absolute left-2 top-2 rounded-lg bg-slate-900/80 px-2 py-1 text-xs font-bold text-white">
                            #{i + 1}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              removeGalleryImage(
                                img.id
                              )
                            }
                            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-sm font-bold text-white shadow transition hover:bg-red-600"
                            title="Remove"
                          >
                            ×
                          </button>

                          <div className="absolute bottom-2 right-2 flex gap-1">
                            <button
                              type="button"
                              onClick={() =>
                                moveGalleryImage(
                                  i,
                                  -1
                                )
                              }
                              disabled={i === 0}
                              className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/95 text-slate-700 shadow transition hover:bg-white disabled:opacity-30"
                              title="Move left"
                            >
                              ‹
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                moveGalleryImage(
                                  i,
                                  1
                                )
                              }
                              disabled={
                                i ===
                                galleryImages.length -
                                  1
                              }
                              className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/95 text-slate-700 shadow transition hover:bg-white disabled:opacity-30"
                              title="Move right"
                            >
                              ›
                            </button>
                          </div>
                        </div>
                      )
                    )}
                  </div>

                  <p className="mt-4 text-xs text-slate-400">
                    Drag images to reorder them, or
                    use the arrow buttons.
                  </p>
                </>
              )}
            </div>
          </section>

          {/* ================================================= */}
          {/* SEO */}
          {/* ================================================= */}

          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 bg-gradient-to-r from-white to-slate-50 px-6 py-5 sm:px-8">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-lg">
                  🔎
                </div>

                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">
                    SEO Settings
                  </h2>

                  <p className="text-sm text-slate-500">
                    Optimize this trek for search engines.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6 p-6 sm:p-8">

              {/* Meta title */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-700">
                    Meta Title
                  </label>

                  <span className="text-xs font-medium text-slate-400">
                    {form.meta_title.length}/70
                  </span>
                </div>

                <input
                  type="text"
                  maxLength={70}
                  value={form.meta_title}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      meta_title:
                        e.target.value,
                    }))
                  }
                  placeholder={`${form.title || 'Trek title'} | Himalaya Treks`}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>

              {/* Meta description */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-700">
                    Meta Description
                  </label>

                  <span className="text-xs font-medium text-slate-400">
                    {form.meta_description.length}/170
                  </span>
                </div>

                <textarea
                  rows={4}
                  maxLength={170}
                  value={form.meta_description}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      meta_description:
                        e.target.value,
                    }))
                  }
                  placeholder="Compelling description that appears in Google search results..."
                  className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>
            </div>
          </section>

          {/* ================================================= */}
          {/* ACTIONS */}
          {/* ================================================= */}

          <div className="sticky bottom-4 z-20">
            <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur sm:flex-row sm:items-center sm:justify-between">

              <div className="hidden sm:block">
                <p className="text-sm font-bold text-slate-800">
                  Ready to publish?
                </p>

                <p className="text-xs text-slate-400">
                  Review the information before creating
                  the trek.
                </p>
              </div>

              <div className="flex w-full gap-3 sm:w-auto">
                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      '/admin/treks'
                    )
                  }
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50 sm:flex-none"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-xl bg-emerald-600 px-8 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 hover:shadow-xl disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none sm:flex-none"
                >
                  {loading
                    ? 'Creating & Uploading...'
                    : 'Create Trek'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}