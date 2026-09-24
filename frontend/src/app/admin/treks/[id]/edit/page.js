'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import api from '@/lib/api';

const difficulties = ['easy', 'moderate', 'challenging', 'extreme'];
const regions = ['Everest', 'Annapurna', 'Langtang', 'Manaslu', 'Mustang', 'Other'];



// ── Reusable form field components ──────────────────────────
function FormField({ label, hint, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        {label}
        {hint && <span className="text-gray-400 font-normal ml-1">{hint}</span>}
      </label>
      {children}
    </div>
  );
}

function SectionCard({ title, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
      <h2 className="text-lg font-bold text-gray-900 border-b pb-3">{title}</h2>
      {children}
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────
export default function EditTrekPage() {
  const router = useRouter();
  const { id } = useParams();

  const [form, setForm] = useState({
    title: '', slug: '', description: '', region: '',
    difficulty: 'moderate', duration_days: '', max_altitude: '',
    distance_km: '', price: '', discount_price: '',
    max_group_size: 12, min_group_size: 1,
    start_location: '', end_location: '',
    is_featured: false, is_active: true,
    meta_title: '', meta_description: '',
    highlights: '',
  });

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages]           = useState([]);
  const [coverIndex, setCoverIndex]         = useState(null);
  const [loading, setLoading]               = useState(true);
  const [saving, setSaving]                 = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [error, setError]                   = useState('');
  const [success, setSuccess]               = useState('');

  // ── Gallery images state ───────────────────────────────────
  const [galleryImages, setGalleryImages] = useState([]); // [{ id, file, preview }]
  const [draggingId, setDraggingId]       = useState(null);
  const galleryInputRef = useRef(null);
  const dragIndexRef    = useRef(null); // tracks index currently being dragged

  // ── Load existing trek data ────────────────────────────────
  useEffect(() => {
    async function loadTrek() {
      try {
        const [trekRes, imagesRes] = await Promise.all([
          api.get(`/treks/id/${id}`),           // get by ID — we'll add this endpoint
          api.get(`/images/trek/${id}`),
        ]);

        const trek = trekRes.data.data;
        setForm({
          title:            trek.title           || '',
          slug:             trek.slug            || '',
          description:      trek.description     || '',
          region:           trek.region          || '',
          difficulty:       trek.difficulty      || 'moderate',
          duration_days:    trek.duration_days   || '',
          max_altitude:     trek.max_altitude    || '',
          distance_km:      trek.distance_km     || '',
          price:            trek.price           || '',
          discount_price:   trek.discount_price  || '',
          max_group_size:   trek.max_group_size  || 12,
          min_group_size:   trek.min_group_size  || 1,
          start_location:   trek.start_location  || '',
          end_location:     trek.end_location    || '',
          is_featured:      trek.is_featured     || false,
          is_active:        trek.is_active       !== false,
          meta_title:       trek.meta_title      || '',
          meta_description: trek.meta_description || '',
          highlights: Array.isArray(trek.highlights)
            ? trek.highlights.join('\n')
            : '',
        });

        setExistingImages(imagesRes.data.data || []);
      } catch (err) {
        setError('Failed to load trek data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (id) loadTrek();
  }, [id]);

  // ── Clean up gallery preview object URLs on unmount ────────
  useEffect(() => {
    return () => {
      galleryImages.forEach(img => URL.revokeObjectURL(img.preview));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Gallery image handlers ──────────────────────────────────
  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newItems = files.map((file, i) => ({
      id: `${Date.now()}-${i}-${Math.random().toString(36).slice(2, 8)}`,
      file,
      preview: URL.createObjectURL(file),
    }));

    setGalleryImages(prev => [...prev, ...newItems]);
    // reset input so selecting the same file again still fires onChange
    e.target.value = '';
  };

  const removeGalleryImage = (imgId) => {
    setGalleryImages(prev => {
      const target = prev.find(img => img.id === imgId);
      if (target) URL.revokeObjectURL(target.preview);
      return prev.filter(img => img.id !== imgId);
    });
  };

  const moveGalleryImage = (index, direction) => {
    setGalleryImages(prev => {
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= prev.length) return prev;
      const updated = [...prev];
      [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
      return updated;
    });
  };

  const handleDragStart = (index) => {
    dragIndexRef.current = index;
    setDraggingId(galleryImages[index]?.id ?? null);
  };

  const handleDragEnter = (index) => {
    const dragIndex = dragIndexRef.current;
    if (dragIndex === null || dragIndex === index) return;

    setGalleryImages(prev => {
      const updated = [...prev];
      const [moved] = updated.splice(dragIndex, 1);
      updated.splice(index, 0, moved);
      return updated;
    });
    dragIndexRef.current = index;
  };

  const handleDragEnd = () => {
    dragIndexRef.current = null;
    setDraggingId(null);
  };

  // ── Handle save ───────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // 1. Update trek details
      await api.put(`/treks/${id}`, {
        ...form,
        duration_days:  parseInt(form.duration_days),
        max_altitude:   form.max_altitude  ? parseInt(form.max_altitude)    : null,
        distance_km:    form.distance_km   ? parseFloat(form.distance_km)   : null,
        price:          parseFloat(form.price),
        discount_price: form.discount_price ? parseFloat(form.discount_price) : null,
        highlights:     form.highlights
          ? form.highlights.split('\n').filter(Boolean)
          : null,
      });

      // 2. Upload new (cover-eligible) images if any
      if (newImages.length > 0) {
        setUploadingImages(true);
        for (let i = 0; i < newImages.length; i++) {
          const formData = new FormData();
          formData.append('image', newImages[i]);
          formData.append('is_cover', coverIndex === i ? 'true' : 'false');
          formData.append('sort_order', existingImages.length + i);
          await api.post(`/images/trek/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
        }
      }

      // 3. Upload gallery images if any
      // NOTE: assumes the backend accepts an `is_gallery` flag on this endpoint —
      // confirm with your API before relying on this in production.
      if (galleryImages.length > 0) {
        setUploadingImages(true);
        const baseSortOrder = existingImages.length + newImages.length;
        for (let i = 0; i < galleryImages.length; i++) {
          const formData = new FormData();
          formData.append('image', galleryImages[i].file);
          formData.append('is_cover', 'false');
          formData.append('is_gallery', 'true');
          formData.append('sort_order', baseSortOrder + i);
          await api.post(`/images/trek/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
        }
      }

      setSuccess('✅ Trek updated successfully!');
      setTimeout(() => router.push('/admin/treks'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update trek.');
    } finally {
      setSaving(false);
      setUploadingImages(false);
    }
  };

  // ── Delete existing image ──────────────────────────────────
  const deleteExistingImage = async (imageId) => {
    if (!confirm('Delete this image? This cannot be undone.')) return;
    try {
      await api.delete(`/images/trek/${imageId}`);
      setExistingImages(prev => prev.filter(img => img.id !== imageId));
    } catch (err) {
      alert('Failed to delete image.');
    }
  };

  // ── Set cover image ────────────────────────────────────────
  const setAsCover = async (imageId) => {
    try {
      await api.put(`/images/${id}/cover/${imageId}`);

      setExistingImages(prev =>
        prev.map(img => ({
          ...img,
          is_cover: img.id === imageId
        }))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const set = (field) => (e) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  const setCheck = (field) => (e) =>
    setForm(f => ({ ...f, [field]: e.target.checked }));

  // ── Loading state ──────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner" />
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────
  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Edit Trek</h1>
          <p className="text-gray-500 mt-1">{form.title}</p>
        </div>
        <button
          onClick={() => router.push('/admin/treks')}
          className="text-gray-500 hover:text-gray-700 font-medium px-4 py-2 border rounded-lg transition"
        >
          ← Back to Treks
        </button>
      </div>

      {/* Alerts */}
      {error && (
        <div className="alert-error mb-6">⚠️ {error}</div>
      )}
      {success && (
        <div className="alert-success mb-6">{success}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* ── Basic Info ─────────────────────────────────── */}
        <SectionCard title="Basic Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div className="md:col-span-2">
              <FormField label="Trek Title *">
                <input
                  type="text" required
                  className="input"
                  value={form.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    const slug  = title.toLowerCase()
                      .replace(/[^a-z0-9]+/g, '-')
                      .replace(/(^-|-$)/g, '');
                    setForm(f => ({ ...f, title, slug }));
                  }}
                />
              </FormField>
            </div>

            <FormField label="URL Slug *">
              <input
                type="text" required
                className="input bg-gray-50"
                value={form.slug}
                onChange={set('slug')}
              />
            </FormField>

            <FormField label="Region *">
              <select
                required className="input"
                value={form.region}
                onChange={set('region')}
              >
                <option value="">Select Region</option>
                {regions.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </FormField>

            <FormField label="Difficulty *">
              <select
                className="input"
                value={form.difficulty}
                onChange={set('difficulty')}
              >
                {difficulties.map(d => (
                  <option key={d} value={d} className="capitalize">
                    {d.charAt(0).toUpperCase() + d.slice(1)}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Duration (days) *">
              <input
                type="number" required min="1"
                className="input"
                value={form.duration_days}
                onChange={set('duration_days')}
              />
            </FormField>

            <FormField label="Max Altitude (m)">
              <input
                type="number"
                className="input"
                value={form.max_altitude}
                onChange={set('max_altitude')}
                placeholder="e.g. 5364"
              />
            </FormField>

            <FormField label="Distance (km)">
              <input
                type="number" step="0.1"
                className="input"
                value={form.distance_km}
                onChange={set('distance_km')}
              />
            </FormField>

            <FormField label="Price (USD) *">
              <input
                type="number" required min="0" step="0.01"
                className="input"
                value={form.price}
                onChange={set('price')}
              />
            </FormField>

            <FormField label="Discounted Price (optional)">
              <input
                type="number" min="0" step="0.01"
                className="input"
                value={form.discount_price}
                onChange={set('discount_price')}
              />
            </FormField>

            <FormField label="Max Group Size">
              <input
                type="number" min="1"
                className="input"
                value={form.max_group_size}
                onChange={set('max_group_size')}
              />
            </FormField>

            <FormField label="Start Location">
              <input
                type="text"
                className="input"
                value={form.start_location}
                onChange={set('start_location')}
                placeholder="e.g. Lukla"
              />
            </FormField>

            <FormField label="End Location">
              <input
                type="text"
                className="input"
                value={form.end_location}
                onChange={set('end_location')}
                placeholder="e.g. Kathmandu"
              />
            </FormField>

            {/* Toggles */}
            <div className="md:col-span-2 flex items-center gap-8 pt-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-emerald-600 rounded"
                  checked={form.is_featured}
                  onChange={setCheck('is_featured')}
                />
                <span className="text-sm font-semibold text-gray-700">
                  Feature on homepage
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-emerald-600 rounded"
                  checked={form.is_active}
                  onChange={setCheck('is_active')}
                />
                <span className="text-sm font-semibold text-gray-700">
                  Active (visible to public)
                </span>
              </label>
            </div>
          </div>

          {/* Description */}
          <FormField label="Description *">
            <textarea
              required rows={6}
              className="input"
              value={form.description}
              onChange={set('description')}
              placeholder="Full description of the trek..."
            />
          </FormField>

          {/* Highlights */}
          <FormField label="Highlights" hint="(one per line)">
            <textarea
              rows={5}
              className="input"
              value={form.highlights}
              onChange={set('highlights')}
              placeholder={"Stand at Everest Base Camp 5,364m\nVisit Tengboche Monastery\nCross dramatic high passes"}
            />
          </FormField>
        </SectionCard>

        {/* ── Existing Images ─────────────────────────────── */}
        <SectionCard title="Current Images">
          {existingImages.length === 0 ? (
            <p className="text-gray-400 text-sm">No images uploaded yet.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {existingImages.map(img => (
                <div
                  key={img.id}
                  className={`relative rounded-xl overflow-hidden border-2 transition ${
                    img.is_cover
                      ? 'border-emerald-500'
                      : 'border-gray-200'
                  }`}
                >
                  <img
                    src={img.image_url}
                    alt={img.caption || 'Trek image'}
                    className="w-full h-28 object-cover"
                  />
                  {img.is_cover && (
                    <span className="absolute top-2 left-2 bg-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      Cover
                    </span>
                  )}
                  <div className="absolute bottom-0 inset-x-0 bg-black/50 flex">
                    {!img.is_cover && (
                      <button
                        type="button"
                        onClick={() => setAsCover(img.id)}
                        className="flex-1 text-white text-xs py-1.5 hover:bg-emerald-600 transition"
                      >
                        Set Cover
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => deleteExistingImage(img.id)}
                      className="flex-1 text-red-300 text-xs py-1.5 hover:bg-red-600 hover:text-white transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        {/* ── Upload New Images ───────────────────────────── */}
        <SectionCard title="Upload New Images">
          <input
            type="file"
            accept="image/*"
            multiple
            className="w-full border-2 border-dashed border-gray-300 rounded-xl p-6
                       text-center text-gray-500 cursor-pointer
                       hover:border-emerald-400 transition"
            onChange={e => {
              setNewImages(Array.from(e.target.files));
              setCoverIndex(null);
            }}
          />

          {newImages.length > 0 && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {newImages.map((file, i) => (
                  <div
                    key={i}
                    onClick={() => setCoverIndex(i)}
                    className={`relative rounded-xl overflow-hidden border-2
                                cursor-pointer transition ${
                      i === coverIndex
                        ? 'border-emerald-500'
                        : 'border-gray-200 hover:border-emerald-300'
                    }`}
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-full h-28 object-cover"
                    />
                    {i === coverIndex && (
                      <span className="absolute top-2 left-2 bg-emerald-500
                                       text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        Cover
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400">
                Click an image to set it as cover photo.
              </p>
            </>
          )}
        </SectionCard>


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

        {/* ── SEO ─────────────────────────────────────────── */}
        <SectionCard title="SEO Settings">
          <FormField label="Meta Title" hint="(60 chars ideal)">
            <input
              type="text" maxLength={70}
              className="input"
              value={form.meta_title}
              onChange={set('meta_title')}
              placeholder={`${form.title} | Himalaya Treks`}
            />
            <p className="text-xs text-gray-400 mt-1">
              {form.meta_title.length}/70 characters
            </p>
          </FormField>

          <FormField label="Meta Description" hint="(160 chars ideal)">
            <textarea
              rows={3} maxLength={170}
              className="input"
              value={form.meta_description}
              onChange={set('meta_description')}
              placeholder="Compelling description for Google search results..."
            />
            <p className="text-xs text-gray-400 mt-1">
              {form.meta_description.length}/170 characters
            </p>
          </FormField>
        </SectionCard>

        {/* ── Submit ──────────────────────────────────────── */}
        <div className="flex items-center gap-4 pb-10">
          <button
            type="submit"
            disabled={saving || uploadingImages}
            className="btn-primary btn-lg disabled:opacity-50"
          >
            {uploadingImages
              ? 'Uploading Images...'
              : saving
              ? 'Saving...'
              : '💾 Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/treks')}
            className="btn-secondary btn-lg"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}