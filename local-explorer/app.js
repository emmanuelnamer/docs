/* ============================================================
   Local Explorer — app.js
   Google Places API v1 (Nearby Search) + Leaflet map
   ============================================================ */

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------
const state = {
  lat: null,
  lng: null,
  category: 'restaurants',
  apiKey: localStorage.getItem('localExplorer_apiKey') || '',
  radius: parseInt(localStorage.getItem('localExplorer_radius') || '1500', 10),
  maxResults: parseInt(localStorage.getItem('localExplorer_maxResults') || '20', 10),
  markers: [],
  activeCardId: null,
};

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const CATEGORY_TYPES = {
  restaurants: ['restaurant', 'cafe', 'bar'],
  hotels:      ['lodging'],
  activities:  ['tourist_attraction', 'museum', 'park', 'amusement_park'],
};

const MARKER_COLORS = {
  restaurants: '#e53e3e',
  hotels:      '#3182ce',
  activities:  '#38a169',
};

const FIELD_MASK = [
  'places.id',
  'places.displayName',
  'places.formattedAddress',
  'places.rating',
  'places.userRatingCount',
  'places.location',
  'places.regularOpeningHours',
  'places.priceLevel',
  'places.websiteUri',
].join(',');

// ---------------------------------------------------------------------------
// Map
// ---------------------------------------------------------------------------
const map = L.map('map', { zoomControl: true }).setView([46.603354, 1.888334], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  maxZoom: 19,
}).addTo(map);

// Circle showing search radius
let radiusCircle = null;

function updateRadiusCircle() {
  if (!state.lat) return;
  if (radiusCircle) map.removeLayer(radiusCircle);
  radiusCircle = L.circle([state.lat, state.lng], {
    radius: state.radius,
    color: '#0D9373',
    fillColor: '#07C983',
    fillOpacity: 0.06,
    weight: 1.5,
    dashArray: '6 4',
  }).addTo(map);
}

function createMarkerIcon(category) {
  const color = MARKER_COLORS[category] || '#0D9373';
  return L.divIcon({
    className: '',
    html: `<div class="marker-dot" style="background:${color}"></div>`,
    iconSize:   [28, 28],
    iconAnchor: [14, 28],
    popupAnchor:[0, -30],
  });
}

function clearMarkers() {
  state.markers.forEach(({ marker }) => map.removeLayer(marker));
  state.markers = [];
}

function renderMarkers(places) {
  clearMarkers();
  places.forEach(place => {
    if (!place.location) return;
    const { latitude, longitude } = place.location;
    const marker = L.marker([latitude, longitude], {
      icon: createMarkerIcon(state.category),
    }).addTo(map);

    const name    = place.displayName?.text || 'Sans nom';
    const rating  = place.rating ? `&#11088; ${place.rating.toFixed(1)}` : '';
    const address = place.formattedAddress || '';
    const link    = place.websiteUri
      ? `<a class="popup-link" href="${escapeHtml(place.websiteUri)}" target="_blank" rel="noopener">Voir le site &#8599;</a>`
      : '';

    marker.bindPopup(`
      <div class="popup-content">
        <div class="popup-name">${escapeHtml(name)}</div>
        ${rating ? `<div class="popup-rating">${rating}</div>` : ''}
        <div class="popup-address">${escapeHtml(address)}</div>
        ${link}
      </div>
    `);

    marker.on('click', () => highlightCard(place.id));

    state.markers.push({ id: place.id, marker });
  });
}

function flyToPlace(place) {
  if (!place.location) return;
  const { latitude, longitude } = place.location;
  map.flyTo([latitude, longitude], 16, { animate: true, duration: 0.7 });
  const found = state.markers.find(m => m.id === place.id);
  if (found) setTimeout(() => found.marker.openPopup(), 750);
}

function highlightCard(placeId) {
  state.activeCardId = placeId;
  document.querySelectorAll('.place-card').forEach(el => {
    el.classList.toggle('active', el.dataset.placeId === placeId);
  });
  const card = document.querySelector(`.place-card[data-place-id="${placeId}"]`);
  if (card) card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ---------------------------------------------------------------------------
// API
// ---------------------------------------------------------------------------
async function fetchNearbyPlaces() {
  if (!state.apiKey) {
    showError('Veuillez saisir votre clé API Google Places dans les paramètres (&#9881;).');
    return [];
  }

  const body = {
    includedTypes: CATEGORY_TYPES[state.category],
    maxResultCount: state.maxResults,
    locationRestriction: {
      circle: {
        center: { latitude: state.lat, longitude: state.lng },
        radius: state.radius,
      },
    },
  };

  const response = await fetch('https://places.googleapis.com/v1/places:searchNearby', {
    method: 'POST',
    headers: {
      'Content-Type':      'application/json',
      'X-Goog-Api-Key':    state.apiKey,
      'X-Goog-FieldMask':  FIELD_MASK,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let msg = `Erreur HTTP ${response.status}`;
    try {
      const err = await response.json();
      msg = err?.error?.message || msg;
    } catch (_) { /* ignore */ }
    if (response.status === 403) {
      throw new Error('Clé API invalide ou non autorisée (403). Vérifiez vos restrictions dans Google Cloud Console.');
    }
    throw new Error(msg);
  }

  const data = await response.json();
  return data.places || [];
}

// ---------------------------------------------------------------------------
// Render cards
// ---------------------------------------------------------------------------
function renderCards(places) {
  const list = document.getElementById('place-list');
  list.innerHTML = '';

  const count = document.getElementById('result-count');
  count.textContent = places.length > 0 ? `${places.length} résultat${places.length > 1 ? 's' : ''}` : '';

  if (places.length === 0) {
    document.getElementById('empty-state').classList.remove('hidden');
    return;
  }
  document.getElementById('empty-state').classList.add('hidden');

  places.forEach(place => {
    const li = document.createElement('li');
    li.className  = 'place-card';
    li.dataset.placeId = place.id || '';

    const name    = place.displayName?.text || 'Sans nom';
    const rating  = place.rating;
    const reviews = place.userRatingCount;
    const address = place.formattedAddress || '';
    const isOpen  = place.regularOpeningHours?.openNow;
    const price   = place.priceLevel ? priceLevelToSymbol(place.priceLevel) : '';

    let openBadge = '';
    if (typeof isOpen === 'boolean') {
      openBadge = `<span class="open-badge ${isOpen ? 'open' : 'closed'}">${isOpen ? 'Ouvert' : 'Fermé'}</span>`;
    }

    li.innerHTML = `
      <div class="card-top">
        <span class="place-name">${escapeHtml(name)}</span>
        ${openBadge}
      </div>
      <div class="card-meta">
        ${rating ? `<span class="rating">&#11088; ${rating.toFixed(1)} <span class="rating-count">(${reviews?.toLocaleString('fr') ?? ''})</span></span>` : ''}
        ${price ? `<span class="price-level">${price}</span>` : ''}
      </div>
      <div class="place-address">${escapeHtml(address)}</div>
    `;

    li.addEventListener('click', () => {
      highlightCard(place.id);
      flyToPlace(place);
    });

    list.appendChild(li);
  });
}

function priceLevelToSymbol(level) {
  const map = {
    PRICE_LEVEL_FREE:             '(gratuit)',
    PRICE_LEVEL_INEXPENSIVE:      '$',
    PRICE_LEVEL_MODERATE:         '$$',
    PRICE_LEVEL_EXPENSIVE:        '$$$',
    PRICE_LEVEL_VERY_EXPENSIVE:   '$$$$',
  };
  return map[level] || '';
}

// ---------------------------------------------------------------------------
// UI helpers
// ---------------------------------------------------------------------------
function showSpinner() {
  document.getElementById('sidebar-spinner').classList.remove('hidden');
  document.getElementById('place-list').classList.add('hidden');
  document.getElementById('empty-state').classList.add('hidden');
  document.getElementById('error-state').classList.add('hidden');
  document.getElementById('result-count').textContent = '';
}

function hideSpinner() {
  document.getElementById('sidebar-spinner').classList.add('hidden');
  document.getElementById('place-list').classList.remove('hidden');
}

function showError(msg) {
  hideSpinner();
  const el = document.getElementById('error-state');
  el.innerHTML = `&#9888; ${msg}`;
  el.classList.remove('hidden');
  document.getElementById('place-list').innerHTML = '';
  document.getElementById('result-count').textContent = '';
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ---------------------------------------------------------------------------
// Main search flow
// ---------------------------------------------------------------------------
async function runSearch() {
  if (!state.lat || !state.lng) {
    showError('Position inconnue. Activez la géolocalisation ou entrez vos coordonnées manuellement.');
    return;
  }

  showSpinner();
  updateRadiusCircle();

  try {
    const places = await fetchNearbyPlaces();
    renderCards(places);
    renderMarkers(places);
  } catch (err) {
    showError(escapeHtml(err.message));
  } finally {
    hideSpinner();
  }
}

// ---------------------------------------------------------------------------
// Geolocation
// ---------------------------------------------------------------------------
function initGeolocation() {
  if (!navigator.geolocation) {
    document.getElementById('location-fallback').classList.remove('hidden');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    position => {
      state.lat = position.coords.latitude;
      state.lng = position.coords.longitude;
      map.setView([state.lat, state.lng], 14);
      runSearch();
    },
    () => {
      document.getElementById('location-fallback').classList.remove('hidden');
    },
    { timeout: 8000, maximumAge: 60000 }
  );
}

// ---------------------------------------------------------------------------
// Settings drawer
// ---------------------------------------------------------------------------
function openSettings() {
  document.getElementById('settings-drawer').classList.remove('hidden');
  document.getElementById('settings-overlay').classList.remove('hidden');
  // Small delay so CSS transition plays
  requestAnimationFrame(() => {
    document.getElementById('settings-drawer').classList.add('open');
  });
  document.getElementById('api-key-input').value = state.apiKey;
  document.getElementById('radius-slider').value  = state.radius;
  document.getElementById('radius-value').textContent = state.radius;
  document.getElementById('max-results').value    = state.maxResults;
}

function closeSettings() {
  const drawer = document.getElementById('settings-drawer');
  drawer.classList.remove('open');
  drawer.addEventListener('transitionend', () => {
    drawer.classList.add('hidden');
    document.getElementById('settings-overlay').classList.add('hidden');
  }, { once: true });
}

function saveSettings() {
  state.apiKey     = document.getElementById('api-key-input').value.trim();
  state.radius     = parseInt(document.getElementById('radius-slider').value, 10);
  state.maxResults = parseInt(document.getElementById('max-results').value, 10);

  localStorage.setItem('localExplorer_apiKey',    state.apiKey);
  localStorage.setItem('localExplorer_radius',    state.radius);
  localStorage.setItem('localExplorer_maxResults', state.maxResults);

  closeSettings();
  if (state.lat) runSearch();
}

// ---------------------------------------------------------------------------
// Event listeners
// ---------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {

  // Category tabs
  document.getElementById('category-tabs').addEventListener('click', e => {
    const btn = e.target.closest('.tab');
    if (!btn) return;
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    state.category = btn.dataset.category;
    if (state.lat) runSearch();
  });

  // Settings open/close
  document.getElementById('settings-btn').addEventListener('click', openSettings);
  document.getElementById('close-settings-btn').addEventListener('click', closeSettings);
  document.getElementById('settings-overlay').addEventListener('click', closeSettings);
  document.getElementById('save-settings-btn').addEventListener('click', saveSettings);

  // Radius slider live label
  document.getElementById('radius-slider').addEventListener('input', e => {
    document.getElementById('radius-value').textContent = e.target.value;
  });

  // API key show/hide
  const keyInput  = document.getElementById('api-key-input');
  const toggleBtn = document.getElementById('toggle-key-btn');
  toggleBtn.addEventListener('click', () => {
    const isHidden = keyInput.type === 'password';
    keyInput.type  = isHidden ? 'text' : 'password';
    toggleBtn.setAttribute('aria-label', isHidden ? 'Masquer la clé' : 'Afficher la clé');
  });

  // Manual location
  document.getElementById('manual-locate-btn').addEventListener('click', () => {
    const lat = parseFloat(document.getElementById('lat-input').value);
    const lng = parseFloat(document.getElementById('lng-input').value);
    if (isNaN(lat) || isNaN(lng)) {
      alert('Veuillez entrer des coordonnées valides.');
      return;
    }
    state.lat = lat;
    state.lng = lng;
    map.setView([lat, lng], 14);
    runSearch();
  });

  // Keyboard: Enter on manual inputs
  ['lat-input', 'lng-input'].forEach(id => {
    document.getElementById(id).addEventListener('keydown', e => {
      if (e.key === 'Enter') document.getElementById('manual-locate-btn').click();
    });
  });

  // Keyboard: Escape closes settings
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeSettings();
  });

  // Start
  initGeolocation();
});
