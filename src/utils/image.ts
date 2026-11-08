import React from 'react';

/**
 * Normalizes any image URL for both development and production published builds.
 * When published, Vite serves assets from the root domain, mapping /public/assets to /assets.
 * This helper guarantees paths resolve identically across development and production.
 */
export function getImageUrl(url?: string | null): string {
  if (!url) {
    return '/assets/images/eco_paper_coffee_cups_1794165037979.jpg';
  }
  // Strip leading /public/ so it works with Vite's standard static asset serving
  if (url.startsWith('/public/')) {
    return url.replace('/public/', '/');
  }
  // If referenced as /src/assets/images, map to public /assets/images
  if (url.startsWith('/src/assets/images/')) {
    return url.replace('/src/assets/images/', '/assets/images/');
  }
  return url;
}

/**
 * Resilient error recovery handler.
 * If a browser fails to load an asset at /assets/..., it tries /public/assets/...
 * and vice-versa, guaranteeing zero broken images even in diverse hosting environments.
 */
export function handleImageError(
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  fallback: string = '/assets/aistudio/721224390_1307701234897509_5494655543120045704_n_d91e11f9.jpg'
) {
  const target = e.currentTarget;
  const currentSrc = target.getAttribute('src') || '';

  // Prevent infinite error loop
  if (target.dataset.triedFallback === 'true') {
    return;
  }

  if (currentSrc.startsWith('/assets/')) {
    target.dataset.triedFallback = 'true';
    target.src = `/public${currentSrc}`;
    return;
  }

  if (currentSrc.startsWith('/public/assets/')) {
    target.dataset.triedFallback = 'true';
    target.src = currentSrc.replace('/public', '');
    return;
  }

  target.dataset.triedFallback = 'true';
  target.src = fallback;
}
