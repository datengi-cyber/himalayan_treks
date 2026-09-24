'use client';
import { useState, useEffect, useCallback } from 'react';

export default function TrekGallery({ images, trekTitle }) {
  const [activeIndex, setActiveIndex] = useState(null);

  const close = useCallback(() => setActiveIndex(null), []);
  const showPrev = useCallback(
    () => setActiveIndex(i => (i > 0 ? i - 1 : images.length - 1)),
    [images.length]
  );
  const showNext = useCallback(
    () => setActiveIndex(i => (i < images.length - 1 ? i + 1 : 0)),
    [images.length]
  );

  // Keyboard navigation for the lightbox
  useEffect(() => {
    if (activeIndex === null) return;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [activeIndex, close, showPrev, showNext]);

  if (!images || images.length === 0) return null;

  return (
    <>
      <div className="td-gallery">
        {images.map((img, i) => (
          <button
            key={img.id ?? i}
            type="button"
            className="td-gallery-item"
            onClick={() => setActiveIndex(i)}
            aria-label={`View ${trekTitle} photo ${i + 1} of ${images.length}`}
          >
            <img
              src={img.image_url}
              alt={img.caption || `${trekTitle} photo ${i + 1}`}
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {activeIndex !== null && (
        <div
          className="td-lightbox"
          role="dialog"
          aria-modal="true"
          onClick={close}
        >
          <button
            type="button"
            className="td-lightbox-close"
            onClick={close}
            aria-label="Close gallery"
          >
            ✕
          </button>

          <button
            type="button"
            className="td-lightbox-nav td-lightbox-prev"
            onClick={(e) => { e.stopPropagation(); showPrev(); }}
            aria-label="Previous photo"
          >
            ‹
          </button>

          <img
            src={images[activeIndex].image_url}
            alt={images[activeIndex].caption || `${trekTitle} photo ${activeIndex + 1}`}
            className="td-lightbox-img"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            type="button"
            className="td-lightbox-nav td-lightbox-next"
            onClick={(e) => { e.stopPropagation(); showNext(); }}
            aria-label="Next photo"
          >
            ›
          </button>

          <div className="td-lightbox-counter">
            {activeIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}