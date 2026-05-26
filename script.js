// ============================================================
//  SAMARINDA FLOOD & EMERGENCY WEBGIS — script.js
// ============================================================

// ── PASTEL BUFFER COLORS ─────────────────────────────────────
const COLORS = {
  bufHigh:    '#f87171',   // pastel red
  bufMed:     '#fb923c',   // pastel orange
  bufLow:     '#fbbf24',   // pastel yellow
  waterway:   '#00d4ff',
  hospital:   '#ec4899',   // pink
  fire:       '#f97316',   // orange
  ambulance:  '#38bdf8'    // sky blue
};

// ── DEFAULT OPACITY (low) ────────────────────────────────────
let bufferOpacity = 0.25;

// ── EMBEDDED FACILITY DATA ───────────────────────────────────
const HOSPITALS = [
  { name:"Rumah Sakit Dirgahayu Samarinda",      lat:-0.4984591504956496,  lon:117.13682093558181,
    link:"https://maps.google.com/?q=-0.4984591504956496,117.13682093558181", services:[] },
  { name:"RS Haji Darjad Samarinda",              lat:-0.49507767891171806, lon:117.14880437790892,
    link:"https://maps.google.com/?q=-0.49507767891171806,117.14880437790892", services:[] },
  { name:"Rumah Sakit Hermina Samarinda",         lat:-0.507274578961652,   lon:117.10932487790893,
    link:"https://maps.google.com/?q=-0.507274578961652,117.10932487790893",
    services:["IGD 24 Jam","Kamar Bersalin","Kamar Operasi","Laboratorium",
              "Poliklinik Spesialis","Radiologi","Ruang Perawatan Ibu","Ruang Perawatan Umum"] },
  { name:"RSUD Abdoel Wahab Sjahranie",           lat:-0.47897255038672015, lon:117.14428149325464,
    link:"https://maps.google.com/?q=-0.47897255038672015,117.14428149325464", services:[] },
  { name:"Rumah Sakit Samarinda Medika Citra",    lat:-0.4724714357644596,  lon:117.12455039325464,
    link:"https://maps.google.com/?q=-0.4724714357644596,117.12455039325464",
    services:["Endoscopy","Fisioterapi","Hemodialisa","ICU","IGD",
              "Laboratorium","Medical Check Up","NICU","PICU","Radiologi"] },
  { name:"RSIA Jimmy Medika Borneo",              lat:-0.5016142799662544,  lon:117.15469322023611,
    link:"https://maps.google.com/?q=-0.5016142799662544,117.15469322023611", services:[] },
  { name:"Rumah Sakit Mulya Medika",              lat:-0.514079008566649,   lon:117.13183530690482,
    link:"https://maps.google.com/?q=-0.514079008566649,117.13183530690482", services:[] },
  { name:"RS Siaga Al Munawwarah Ramania",        lat:-0.4740793788285711,  lon:117.14201533574125,
    link:"https://maps.google.com/?q=-0.4740793788285711,117.14201533574125", services:[] },
  { name:"RS. Bhakti Nugraha",                    lat:-0.49592947891515476, lon:117.14711024923201,
    link:"https://maps.google.com/?q=-0.49592947891515476,117.14711024923201", services:[] },
  { name:"RSUD Inche Abdoel Moeis",               lat:-0.5588095924883961,  lon:117.11036090690486,
    link:"https://maps.google.com/?q=-0.5588095924883961,117.11036090690486", services:[] },
  { name:"Rumah Sakit Ibu dan Anak Qurrata A'yun",lat:-0.46227563575667097, lon:117.18324123574126,
    link:"https://maps.google.com/?q=-0.46227563575667097,117.18324123574126", services:[] },
  { name:"Rumah Sakit Tk.IV Samarinda",           lat:-0.5244627506477894,  lon:117.12499900690487,
    link:"https://maps.google.com/?q=-0.5244627506477894,117.12499900690487", services:[] },
  { name:"RS Ibu Dan Anak 'Aisyiyah Samarinda",   lat:-0.5018201789391666,  lon:117.15382960690486,
    link:"https://maps.google.com/?q=-0.5018201789391666,117.15382960690486", services:[] },
  { name:"Rumah Sakit Primecare Samarinda",       lat:-0.5018485368182163,  lon:117.15845230690485,
    link:"https://maps.google.com/?q=-0.5018485368182163,117.15845230690485", services:[] }
];

const FIRESTATIONS = [
  { name:"Dinas Pemadam Kebakaran Kota Samarinda",
    lat:-0.5047336474212247, lon:117.15558085831078,
    address:"Jl. Mulawarman, Pelabuhan, Samarinda Kota",
    phone:"0812-5552-5133", hours:"Buka 24 Jam",
    link:"https://maps.google.com/?q=-0.5047336474212247,117.15558085831078" },
  { name:"Pemadam Kebakaran Posko III",
    lat:-0.48608384651503805, lon:117.12259208158237,
    address:"Air Putih, Samarinda Ulu",
    phone:"(0541) 742492", hours:"Buka 24 Jam",
    link:"https://maps.google.com/?q=-0.48608384651503805,117.12259208158237" },
  { name:"Damkar Posko V – Samarinda Seberang",
    lat:-0.5104149158995503, lon:117.13842822761941,
    address:"Jl. Sultan Hasanuddin, Baqa, Samarinda Seberang",
    phone:"0541262150", hours:"",
    link:"https://maps.google.com/?q=-0.5104149158995503,117.13842822761941" }
];

// ── BUILDING TYPE LABELS & ICONS ─────────────────────────────
const BLDG_LABELS = {
  yes:          { label:'Bangunan Umum',     icon:'fa-building',          color:'#8b5cf6' },
  house:        { label:'Rumah Tinggal',     icon:'fa-house',             color:'#3b82f6' },
  stilt_house:  { label:'Rumah Panggung',    icon:'fa-house-flood-water', color:'#06b6d4' },
  residential:  { label:'Residensial',       icon:'fa-house-user',        color:'#10b981' },
  hospital:     { label:'Rumah Sakit/Klinik',icon:'fa-hospital',          color:'#ef4444' },
  school:       { label:'Sekolah',           icon:'fa-school',            color:'#f59e0b' },
  commercial:   { label:'Komersial',         icon:'fa-store',             color:'#ec4899' },
  mosque:       { label:'Masjid',            icon:'fa-mosque',            color:'#14b8a6' },
  university:   { label:'Universitas',       icon:'fa-graduation-cap',    color:'#6366f1' },
  kindergarten: { label:'TK/PAUD',           icon:'fa-child',             color:'#f472b6' },
  hotel:        { label:'Hotel',             icon:'fa-hotel',             color:'#a855f7' },
  office:       { label:'Kantor',            icon:'fa-briefcase',         color:'#64748b' },
  public:       { label:'Fasilitas Publik',  icon:'fa-landmark',          color:'#0ea5e9' },
  retail:       { label:'Retail',            icon:'fa-bag-shopping',      color:'#e11d48' },
  stadium:      { label:'Stadion',           icon:'fa-futbol',            color:'#22c55e' },
  apartments:   { label:'Apartemen',         icon:'fa-city',              color:'#7c3aed' },
  healthcare:   { label:'Fasilitas Kesehatan',icon:'fa-kit-medical',      color:'#dc2626' },
  roof:         { label:'Struktur Atap',     icon:'fa-warehouse',         color:'#78716c' },
  garages:      { label:'Garasi',            icon:'fa-car',               color:'#737373' }
};

// ── MAP INIT ─────────────────────────────────────────────────
const map = L.map('map', { zoomControl:false }).setView([-0.502, 117.145], 13);
L.control.zoom({ position:'bottomright' }).addTo(map);
L.control.scale({ position:'bottomleft', metric:true, imperial:false }).addTo(map);

// ── CUSTOM PANES FOR FIXED Z-ORDER ──────────────────────────
// Pane z-indexes guarantee layer ordering regardless of toggle order
map.createPane('bufferLow');
map.getPane('bufferLow').style.zIndex = 401;
map.createPane('bufferMed');
map.getPane('bufferMed').style.zIndex = 402;
map.createPane('bufferHigh');
map.getPane('bufferHigh').style.zIndex = 403;
map.createPane('buildingPane');
map.getPane('buildingPane').style.zIndex = 404;
map.createPane('waterwayPane');
map.getPane('waterwayPane').style.zIndex = 410;
map.createPane('coveragePane');
map.getPane('coveragePane').style.zIndex = 405;
map.createPane('facilityPane');
map.getPane('facilityPane').style.zIndex = 450;

// ── BASEMAPS ─────────────────────────────────────────────────
const BM = {
  osm: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:'&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors', maxZoom:19
  }),
  satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution:'&copy; Esri', maxZoom:19
  }),
  dark: L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution:'&copy; CartoDB', maxZoom:19
  })
};
let activeBM = BM.osm;
activeBM.addTo(map);

window.switchBasemap = function(key, btn) {
  map.removeLayer(activeBM);
  activeBM = BM[key];
  activeBM.addTo(map);
  document.querySelectorAll('.bm-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
};

// ── THEME ────────────────────────────────────────────────────
let dark = false; // start in light mode
document.getElementById('themeToggle').addEventListener('click', () => {
  dark = !dark;
  document.body.classList.toggle('light-mode', !dark);
  document.getElementById('themeToggle').querySelector('i').className =
    dark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
});

// ── COORDINATES ──────────────────────────────────────────────
map.on('mousemove', e => {
  document.getElementById('coordsText').textContent =
    `Lat: ${e.latlng.lat.toFixed(5)}   Lon: ${e.latlng.lng.toFixed(5)}`;
});

// ── MODE SWITCH ──────────────────────────────────────────────
let currentMode = 'flood';
window.switchMode = function(mode) {
  currentMode = mode;
  document.getElementById('panelFlood').classList.toggle('hidden', mode !== 'flood');
  document.getElementById('panelEmergency').classList.toggle('hidden', mode !== 'emergency');
  document.getElementById('tabFlood').classList.toggle('active', mode === 'flood');
  document.getElementById('tabEmergency').classList.toggle('active', mode === 'emergency');
  updateMapLegend();
};

// ── POPUP BUILDERS ───────────────────────────────────────────
function hospitalPopup(h) {
  const lat = h.lat.toFixed(5), lon = h.lon.toFixed(5);
  const svcs = h.services.length
    ? `<div class="pc-services">${h.services.map(s=>`<span class="pc-service-tag">${s}</span>`).join('')}</div>`
    : '';
  return `
    <div class="pc-header">
      <div class="pc-icon" style="background:rgba(236,72,153,.1)">
        <i class="fa-solid fa-hospital" style="color:${COLORS.hospital}"></i>
      </div>
      <div>
        <div class="pc-name">${h.name}</div>
        <div class="pc-type">Rumah Sakit / Klinik &bull; Samarinda</div>
      </div>
    </div>
    <hr class="pc-divider">
    <div class="pc-body">
      <div class="pc-row"><i class="fa-solid fa-tag"></i><span>Fasilitas Kesehatan Darurat</span></div>
      <div class="pc-row"><i class="fa-solid fa-crosshairs"></i><span>${lat}, ${lon}</span></div>
      <div class="pc-row"><i class="fa-solid fa-circle-info"></i><span>Fasilitas ini melayani kedaruratan medis. Perlu diakses dengan cepat saat banjir terjadi.</span></div>
      ${svcs}
      <div style="margin-top:10px">
        <a href="${h.link}" target="_blank" class="pc-link"><i class="fa-solid fa-map-location-dot"></i> Lihat di Google Maps</a>
      </div>
    </div>`;
}

function firePopup(f) {
  const lat = f.lat.toFixed(5), lon = f.lon.toFixed(5);
  return `
    <div class="pc-header">
      <div class="pc-icon" style="background:rgba(249,115,22,.1)">
        <i class="fa-solid fa-fire-extinguisher" style="color:${COLORS.fire}"></i>
      </div>
      <div>
        <div class="pc-name">${f.name}</div>
        <div class="pc-type">Stasiun Pemadam Kebakaran</div>
      </div>
    </div>
    <hr class="pc-divider">
    <div class="pc-body">
      <div class="pc-row"><i class="fa-solid fa-tag"></i><span>Fasilitas Darurat Kebakaran &amp; Banjir</span></div>
      <div class="pc-row"><i class="fa-solid fa-location-dot"></i><span>${f.address}</span></div>
      <div class="pc-row"><i class="fa-solid fa-crosshairs"></i><span>${lat}, ${lon}</span></div>
      ${f.phone ? `<div class="pc-row"><i class="fa-solid fa-phone"></i><span>${f.phone}</span></div>` : ''}
      <div class="pc-row"><i class="fa-solid fa-circle-info"></i><span>Dinas pemadam kebakaran juga berperan dalam penanganan banjir dan evakuasi warga.</span></div>
      ${f.hours ? `<span class="pc-badge badge-open"><i class="fa-solid fa-clock"></i> ${f.hours}</span>` : ''}
      <div style="margin-top:10px">
        <a href="${f.link}" target="_blank" class="pc-link"><i class="fa-solid fa-map-location-dot"></i> Lihat di Google Maps</a>
      </div>
    </div>`;
}

function waterwayPopup(props, latlng) {
  const name = props.name || props.waterway || 'Aliran Sungai';
  const lat = latlng ? latlng.lat.toFixed(5) : '—';
  const lon = latlng ? latlng.lng.toFixed(5) : '—';
  const osmLink = `https://www.openstreetmap.org/#map=17/${lat}/${lon}`;
  return `
    <div class="pc-header">
      <div class="pc-icon" style="background:rgba(0,212,255,.1)">
        <i class="fa-solid fa-water" style="color:${COLORS.waterway}"></i>
      </div>
      <div>
        <div class="pc-name">${name}</div>
        <div class="pc-type">Aliran Sungai / Drainase</div>
      </div>
    </div>
    <hr class="pc-divider">
    <div class="pc-body">
      <div class="pc-row"><i class="fa-solid fa-tag"></i><span>Hidrologi — Sumber Potensi Banjir</span></div>
      <div class="pc-row"><i class="fa-solid fa-crosshairs"></i><span>${lat}, ${lon}</span></div>
      <div class="pc-row"><i class="fa-solid fa-circle-info"></i><span>Kedekatan bangunan dan infrastruktur terhadap aliran ini meningkatkan risiko terdampak banjir.</span></div>
      <div style="margin-top:10px">
        <a href="${osmLink}" target="_blank" class="pc-link"><i class="fa-solid fa-map"></i> Lihat di OpenStreetMap</a>
      </div>
    </div>`;
}

function floodBufferPopup(riskLevel, color) {
  const desc = riskLevel === 'Tinggi'
    ? 'Zona ini berada sangat dekat dengan aliran sungai (< 100m). Area ini memiliki probabilitas banjir tertinggi dan bangunan di sini paling rentan terdampak.'
    : riskLevel === 'Sedang'
    ? 'Zona ini berada dalam jarak menengah dari aliran sungai (100–250m). Risiko banjir cukup signifikan, terutama saat curah hujan tinggi.'
    : 'Zona ini merupakan area buffer terluar (250–500m) yang masih memiliki potensi terdampak banjir dalam kondisi ekstrem.';
  return `
    <div class="pc-header">
      <div class="pc-icon" style="background:${color}18">
        <i class="fa-solid fa-triangle-exclamation" style="color:${color}"></i>
      </div>
      <div>
        <div class="pc-name">Zona Risiko Banjir ${riskLevel}</div>
        <div class="pc-type">Flood Buffer Zone &bull; Samarinda</div>
      </div>
    </div>
    <hr class="pc-divider">
    <div class="pc-body">
      <div class="pc-row"><i class="fa-solid fa-tag"></i><span>Analisis Buffer Hidrologi</span></div>
      <div class="pc-row"><i class="fa-solid fa-circle-info"></i><span>${desc}</span></div>
    </div>`;
}

function buildingPopup(props) {
  const btype = (props && props.building) || 'yes';
  const info = BLDG_LABELS[btype] || { label: btype, icon: 'fa-building', color: '#64748b' };
  const name = (props && props.name) || info.label;
  return `
    <div class="pc-header">
      <div class="pc-icon" style="background:${info.color}18">
        <i class="fa-solid ${info.icon}" style="color:${info.color}"></i>
      </div>
      <div>
        <div class="pc-name">${name}</div>
        <div class="pc-type">${info.label} &bull; Zona Risiko Tinggi</div>
      </div>
    </div>
    <hr class="pc-divider">
    <div class="pc-body">
      <div class="pc-row"><i class="fa-solid fa-tag"></i><span>${info.label}</span></div>
      <div class="pc-row"><i class="fa-solid fa-triangle-exclamation"></i><span style="color:${COLORS.bufHigh};font-weight:700">Berada di Zona Risiko Tinggi (&lt;100m dari sungai)</span></div>
      <div class="pc-row"><i class="fa-solid fa-circle-info"></i><span>Bangunan ini berada dalam buffer risiko tinggi banjir. Diperlukan kewaspadaan dan rencana evakuasi.</span></div>
    </div>`;
}

function buildingTooltipContent(props) {
  const btype = (props && props.building) || 'yes';
  const info = BLDG_LABELS[btype] || { label: btype, icon: 'fa-building', color: '#64748b' };
  const name = (props && props.name) || info.label;
  return `
    <div class="bt-header">
      <div class="bt-icon"><i class="fa-solid ${info.icon}"></i></div>
      <div>
        <div class="bt-name">${name}</div>
        <div class="bt-type">${info.label}</div>
      </div>
    </div>
    <div class="bt-badge"><i class="fa-solid fa-triangle-exclamation"></i> Risiko Tinggi</div>`;
}

// ── LAYER STORE ──────────────────────────────────────────────
const L_STORE = {
  waterways:    { lyr:null, tog:'togWaterways' },
  highRisk:     { lyr:null, tog:'togHighRisk' },
  medRisk:      { lyr:null, tog:'togMedRisk' },
  lowRisk:      { lyr:null, tog:'togLowRisk' },
  buildings:    { lyr:null, tog:'togBuildings' },
  hospital:     { lyr:null, tog:'togHospital' },
  hospCoverage: { lyr:null, tog:'togHospCoverage' },
  fire:         { lyr:null, tog:'togFire' },
  fireCoverage: { lyr:null, tog:'togFireCoverage' },
  highRiskRef:  { lyr:null, tog:'togHighRiskRef' }
};

function bindToggle(key) {
  const entry = L_STORE[key];
  const el = document.getElementById(entry.tog);
  if (!el || !entry.lyr) return;
  if (el.checked) map.addLayer(entry.lyr);
  else            map.removeLayer(entry.lyr);
  if (el._bound) return;
  el._bound = true;
  el.addEventListener('change', () => {
    if (el.checked) map.addLayer(entry.lyr);
    else            map.removeLayer(entry.lyr);
  });
}

function makeCoverageCircles(dataArr, color) {
  const grp = L.layerGroup();
  dataArr.forEach(d => {
    L.circle([d.lat, d.lon], {
      radius:1000, color, fillColor:color,
      fillOpacity:0.07, weight:1.5, dashArray:'6 4',
      pane:'coveragePane'
    }).addTo(grp);
  });
  return grp;
}

// ── OPACITY SLIDER ───────────────────────────────────────────
function setupOpacitySlider() {
  const slider = document.getElementById('bufferOpacity');
  const valEl  = document.getElementById('opacityVal');
  if (!slider) return;

  function updateOpacity(val) {
    bufferOpacity = val / 100;
    valEl.textContent = val + '%';

    // Update buffer layer styles
    const opHigh = bufferOpacity * 1.4;  // high risk slightly more opaque
    const opMed  = bufferOpacity * 1.1;
    const opLow  = bufferOpacity;

    if (L_STORE.highRisk.lyr) {
      L_STORE.highRisk.lyr.setStyle({ fillOpacity: Math.min(opHigh, 1) });
    }
    if (L_STORE.medRisk.lyr) {
      L_STORE.medRisk.lyr.setStyle({ fillOpacity: Math.min(opMed, 1) });
    }
    if (L_STORE.lowRisk.lyr) {
      L_STORE.lowRisk.lyr.setStyle({ fillOpacity: Math.min(opLow, 1) });
    }
    if (L_STORE.highRiskRef.lyr) {
      L_STORE.highRiskRef.lyr.setStyle({ fillOpacity: Math.min(opHigh * 0.7, 1) });
    }
  }

  slider.addEventListener('input', (e) => updateOpacity(parseInt(e.target.value)));
  // Initial value
  updateOpacity(25);
}

// ── ON-MAP LEGEND CONTROL ────────────────────────────────────
const MapLegend = L.Control.extend({
  options: { position: 'bottomleft' },
  onAdd: function() {
    const div = L.DomUtil.create('div', 'map-legend glass');
    div.id = 'mapLegend';
    L.DomEvent.disableClickPropagation(div);
    L.DomEvent.disableScrollPropagation(div);
    return div;
  }
});
const mapLegendCtrl = new MapLegend();
mapLegendCtrl.addTo(map);

function updateMapLegend() {
  const el = document.getElementById('mapLegend');
  if (!el) return;

  if (currentMode === 'flood') {
    el.innerHTML = `
      <div class="ml-title"><i class="fa-solid fa-map"></i> Legenda</div>
      <div class="ml-row"><span class="ml-sw" style="background:${COLORS.bufHigh};opacity:.5"></span>Risiko Tinggi <span class="ml-note">&lt;100m</span></div>
      <div class="ml-row"><span class="ml-sw" style="background:${COLORS.bufMed};opacity:.5"></span>Risiko Sedang <span class="ml-note">100–250m</span></div>
      <div class="ml-row"><span class="ml-sw" style="background:${COLORS.bufLow};opacity:.5"></span>Risiko Rendah <span class="ml-note">250–500m</span></div>
      <div class="ml-row"><span class="ml-sw ml-line" style="background:${COLORS.waterway}"></span>Aliran Sungai</div>
    `;
  } else {
    el.innerHTML = `
      <div class="ml-title"><i class="fa-solid fa-map"></i> Legenda</div>
      <div class="ml-row"><span class="ml-sw ml-circ" style="background:${COLORS.hospital}"></span>Rumah Sakit / Klinik</div>
      <div class="ml-row"><span class="ml-sw ml-circ" style="background:${COLORS.fire}"></span>Stasiun Pemadam</div>
      <div class="ml-row"><span class="ml-sw ml-circ" style="background:${COLORS.ambulance}"></span>Posko Ambulans</div>
      <div class="ml-row"><span class="ml-sw" style="background:${COLORS.bufHigh};opacity:.4"></span>Zona Risiko Tinggi</div>
    `;
  }
}

// ── CHATBOT ──────────────────────────────────────────────────
let chatBldgStats = null; // will be populated after data loads

const CHAT_RESPONSES = [
  { keywords:['halo','hai','hi','hello','hey','selamat'],
    reply:'Halo! 👋 Saya asisten peta banjir Samarinda. Tanyakan tentang risiko banjir, rumah sakit, pemadam kebakaran, atau cara membaca peta ini.' },
  { keywords:['buffer','apa itu buffer'],
    reply:'**Buffer** adalah zona radius di sekitar aliran sungai. Semakin dekat ke sungai, semakin tinggi risiko banjir:\n\n🔴 **Risiko Tinggi** — <100m dari sungai\n🟠 **Risiko Sedang** — 100–250m\n🟡 **Risiko Rendah** — 250–500m\n\nArea berwarna di peta menunjukkan zona-zona ini.' },
  { keywords:['risiko tinggi','high risk','zona merah','bahaya'],
    reply:() => {
      const total = chatBldgStats ? chatBldgStats.total.toLocaleString('id-ID') : '~59.644';
      return `🔴 **Zona Risiko Tinggi** berada dalam radius <100m dari aliran sungai. Area ini paling rentan terhadap banjir.\n\nTerdapat **${total} bangunan** di zona risiko tinggi, termasuk rumah sakit, sekolah, dan rumah tinggal.`;
    }},
  { keywords:['risiko sedang','medium risk','zona orange'],
    reply:'🟠 **Zona Risiko Sedang** berada 100–250m dari aliran sungai. Risiko cukup signifikan terutama saat curah hujan tinggi atau sungai meluap.' },
  { keywords:['risiko rendah','low risk','zona kuning','aman'],
    reply:'🟡 **Zona Risiko Rendah** berada 250–500m dari aliran sungai. Potensi terdampak banjir ada pada kondisi ekstrem.' },
  { keywords:['rumah sakit','hospital','rs ','klinik','medis'],
    reply:() => {
      let list = HOSPITALS.map((h,i) => `${i+1}. **${h.name}**`).join('\n');
      return `🏥 Terdapat **${HOSPITALS.length} rumah sakit/klinik** di Samarinda:\n\n${list}\n\nGunakan fitur pencarian di peta untuk menemukan lokasi mereka.`;
    }},
  { keywords:['pemadam','damkar','fire station','kebakaran'],
    reply:() => {
      let list = FIRESTATIONS.map((f,i) => `${i+1}. **${f.name}**\n   📍 ${f.address}${f.phone ? '\n   📞 '+f.phone : ''}`).join('\n');
      return `🚒 Terdapat **${FIRESTATIONS.length} stasiun pemadam** di Samarinda:\n\n${list}`;
    }},
  { keywords:['ambulans','ambulance','posko ambulans'],
    reply:'🚑 **Data Posko Ambulans** belum tersedia dalam dataset saat ini. Silakan hubungi Dinas Kesehatan Kota Samarinda untuk informasi lokasi posko ambulans.' },
  { keywords:['bangunan','terdampak','building','gedung','berapa'],
    reply:() => {
      if (!chatBldgStats) return 'Data bangunan sedang dimuat, silakan coba lagi nanti.';
      const lines = chatBldgStats.breakdown.slice(0,8).map(b => {
        const info = BLDG_LABELS[b.type] || { label:b.type, icon:'fa-building' };
        return `• **${info.label}**: ${b.count.toLocaleString('id-ID')}`;
      });
      return `🏘️ Terdapat **${chatBldgStats.total.toLocaleString('id-ID')} bangunan** di zona risiko tinggi:\n\n${lines.join('\n')}\n\nData ini mencakup semua bangunan dalam radius <100m dari aliran sungai.`;
    }},
  { keywords:['cara','membaca','baca','peta','panduan','guide','help','bantu','tolong'],
    reply:'📖 **Cara Membaca Peta:**\n\n1️⃣ Warna di peta = zona buffer (radius dari sungai)\n2️⃣ 🔴 Merah = dekat sungai = risiko tinggi\n3️⃣ 🟠 Orange = jarak sedang\n4️⃣ 🟡 Kuning = jauh = risiko rendah\n5️⃣ Garis biru = aliran sungai\n\n**Tips:** Klik zona buffer untuk detail, gunakan tab "Emergency" untuk melihat fasilitas darurat.' },
  { keywords:['sungai','waterway','air','aliran'],
    reply:'🌊 Garis biru di peta menunjukkan **aliran sungai dan drainase** di Samarinda. Buffer zona risiko dihitung berdasarkan jarak dari aliran-aliran ini.\n\nKlik aliran sungai untuk melihat detailnya.' },
  { keywords:['cakupan','coverage','jangkauan','radius'],
    reply:'📍 Setiap fasilitas darurat (RS, Damkar) memiliki **radius cakupan 1km**. Aktifkan layer "Cakupan" di panel Emergency untuk melihatnya.\n\nArea di luar semua radius = minim akses layanan darurat saat banjir.' },
  { keywords:['terima kasih','thanks','makasih','thx'],
    reply:'Sama-sama! 😊 Jangan ragu bertanya lagi jika butuh informasi lebih lanjut tentang risiko banjir Samarinda.' }
];

function getChatResponse(msg) {
  const lower = msg.toLowerCase().trim();
  if (!lower) return 'Silakan ketik pertanyaan Anda tentang peta banjir Samarinda.';

  for (const entry of CHAT_RESPONSES) {
    if (entry.keywords.some(k => lower.includes(k))) {
      return typeof entry.reply === 'function' ? entry.reply() : entry.reply;
    }
  }
  return '🤔 Maaf, saya belum mengerti pertanyaan itu. Coba tanyakan tentang:\n\n• **Buffer / zona risiko**\n• **Rumah sakit** atau **pemadam kebakaran**\n• **Bangunan terdampak**\n• **Cara membaca peta**\n\nAtau ketik **"halo"** untuk memulai!';
}

function initChatbot() {
  const toggle = document.getElementById('chatToggle');
  const panel  = document.getElementById('chatPanel');
  const input  = document.getElementById('chatInput');
  const sendBtn= document.getElementById('chatSend');
  const msgs   = document.getElementById('chatMessages');
  const close  = document.getElementById('chatClose');

  if (!toggle || !panel) return;

  // Add welcome message
  addBotMessage('Halo! 👋 Saya asisten peta banjir Samarinda. Tanyakan apa saja tentang risiko banjir, fasilitas darurat, atau cara membaca peta ini.');

  toggle.addEventListener('click', () => {
    panel.classList.toggle('open');
    toggle.classList.toggle('active');
    if (panel.classList.contains('open')) {
      setTimeout(() => input.focus(), 300);
    }
  });

  close.addEventListener('click', () => {
    panel.classList.remove('open');
    toggle.classList.remove('active');
  });

  function sendMessage() {
    const text = input.value.trim();
    if (!text) return;
    addUserMessage(text);
    input.value = '';
    setTimeout(() => {
      const reply = getChatResponse(text);
      addBotMessage(reply);
    }, 400 + Math.random() * 400);
  }

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') sendMessage();
  });

  function addUserMessage(text) {
    const div = document.createElement('div');
    div.className = 'chat-msg user';
    div.innerHTML = `<div class="chat-bubble">${escapeHtml(text)}</div>`;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function addBotMessage(text) {
    const div = document.createElement('div');
    div.className = 'chat-msg bot';
    div.innerHTML = `<div class="chat-avatar"><i class="fa-solid fa-robot"></i></div><div class="chat-bubble">${formatMarkdown(text)}</div>`;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function escapeHtml(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function formatMarkdown(s) {
    return s
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  }
}

// ── QUICK GUIDE TOGGLE ───────────────────────────────────────
window.toggleGuide = function() {
  const el = document.getElementById('guideContent');
  const icon = document.getElementById('guideToggleIcon');
  if (el.classList.contains('hidden')) {
    el.classList.remove('hidden');
    icon.className = 'fa-solid fa-chevron-up';
  } else {
    el.classList.add('hidden');
    icon.className = 'fa-solid fa-chevron-down';
  }
};

// ── MAIN LOAD ────────────────────────────────────────────────
async function loadData() {
  const overlay = document.getElementById('loading');
  const txt     = document.getElementById('loadingText');
  const sub     = document.getElementById('loadingSubText');

  try {
    // ── 1. FLOOD BUFFERS (pastel, transparent, low opacity) ────
    txt.textContent = 'Memuat Buffer Banjir...';
    sub.textContent = 'High / Medium / Low Risk Zone';

    const [hrRes, mrRes, lrRes] = await Promise.all([
      fetch('data/highrisk.geojson'),
      fetch('data/mediumrisk.geojson'),
      fetch('data/lowrisk.geojson')
    ]);
    const [hrData, mrData, lrData] = await Promise.all([
      hrRes.json(), mrRes.json(), lrRes.json()
    ]);

    // LOW RISK first (bottom pane) — Yellow pastel
    L_STORE.lowRisk.lyr = L.geoJSON(lrData, {
      pane:'bufferLow',
      style:{ color:'transparent', fillColor:COLORS.bufLow, fillOpacity:bufferOpacity, weight:0 },
      onEachFeature:(f, l) => l.on('click', e => {
        L.popup({ maxWidth:300 })
          .setLatLng(e.latlng)
          .setContent(floodBufferPopup('Rendah', COLORS.bufLow))
          .openOn(map);
      })
    });

    // MEDIUM RISK (middle pane) — Orange pastel
    L_STORE.medRisk.lyr = L.geoJSON(mrData, {
      pane:'bufferMed',
      style:{ color:'transparent', fillColor:COLORS.bufMed, fillOpacity:bufferOpacity * 1.1, weight:0 },
      onEachFeature:(f, l) => l.on('click', e => {
        L.popup({ maxWidth:300 })
          .setLatLng(e.latlng)
          .setContent(floodBufferPopup('Sedang', COLORS.bufMed))
          .openOn(map);
      })
    });

    // HIGH RISK (top buffer pane) — Red pastel
    L_STORE.highRisk.lyr = L.geoJSON(hrData, {
      pane:'bufferHigh',
      style:{ color:'transparent', fillColor:COLORS.bufHigh, fillOpacity:bufferOpacity * 1.4, weight:0 },
      onEachFeature:(f, l) => l.on('click', e => {
        L.popup({ maxWidth:300 })
          .setLatLng(e.latlng)
          .setContent(floodBufferPopup('Tinggi', COLORS.bufHigh))
          .openOn(map);
      })
    });

    // Separate instance for emergency panel reference
    L_STORE.highRiskRef.lyr = L.geoJSON(hrData, {
      pane:'bufferHigh',
      style:{ color:'transparent', fillColor:COLORS.bufHigh, fillOpacity:bufferOpacity * 0.7, weight:0 }
    });

    // Bind toggles — order doesn't matter because panes control z-order
    bindToggle('lowRisk');
    bindToggle('medRisk');
    bindToggle('highRisk');
    bindToggle('highRiskRef');

    // ── 2. WATERWAYS ──────────────────────────────────────────
    txt.textContent = 'Memuat Aliran Sungai...';
    sub.textContent = 'Loading waterway data';

    const watRes = await fetch('data/waterwayss.geojson');
    const watData = await watRes.json();

    L_STORE.waterways.lyr = L.geoJSON(watData, {
      pane:'waterwayPane',
      style:{ color:COLORS.waterway, weight:2.5, opacity:.9 },
      onEachFeature:(f, l) => {
        l.on('click', e => {
          l.bindPopup(waterwayPopup(f.properties, e.latlng), { maxWidth:300 }).openPopup();
        });
      }
    });
    document.getElementById('countWaterways').textContent = watData.features.length;

    bindToggle('waterways');

    // ── 3. HOSPITALS — Pink markers ──────────────────────────
    txt.textContent = 'Memuat Fasilitas Darurat...';
    sub.textContent = 'Rumah Sakit & Pemadam Kebakaran';

    const hospGroup = L.layerGroup();
    HOSPITALS.forEach(h => {
      L.circleMarker([h.lat, h.lon], {
        radius:7, fillColor:COLORS.hospital, color:'#fff', weight:2, fillOpacity:1,
        pane:'facilityPane'
      })
      .bindPopup(hospitalPopup(h), { maxWidth:300 })
      .addTo(hospGroup);
    });
    L_STORE.hospital.lyr     = hospGroup;
    L_STORE.hospCoverage.lyr = makeCoverageCircles(HOSPITALS, COLORS.hospital);
    document.getElementById('countHospital').textContent = HOSPITALS.length;

    bindToggle('hospital');
    bindToggle('hospCoverage');

    // ── 4. FIRE STATIONS — Orange markers ────────────────────
    const fireGroup = L.layerGroup();
    FIRESTATIONS.forEach(f => {
      L.circleMarker([f.lat, f.lon], {
        radius:8, fillColor:COLORS.fire, color:'#fff', weight:2, fillOpacity:1,
        pane:'facilityPane'
      })
      .bindPopup(firePopup(f), { maxWidth:300 })
      .addTo(fireGroup);
    });
    L_STORE.fire.lyr         = fireGroup;
    L_STORE.fireCoverage.lyr = makeCoverageCircles(FIRESTATIONS, COLORS.fire);
    document.getElementById('countFire').textContent = FIRESTATIONS.length;

    bindToggle('fire');
    bindToggle('fireCoverage');

    // ── 5. SEARCH (hospitals + fire stations + waterways) ─────
    const searchLayer = L.layerGroup();
    
    // Hospitals
    HOSPITALS.forEach(h => {
      const m = L.marker([h.lat, h.lon], { opacity:0 });
      m.feature = { properties:{ name: h.name } };
      m.bindPopup(hospitalPopup(h), { maxWidth:300 });
      searchLayer.addLayer(m);
    });
    
    // Fire Stations
    FIRESTATIONS.forEach(f => {
      const m = L.marker([f.lat, f.lon], { opacity:0 });
      m.feature = { properties:{ name: f.name } };
      m.bindPopup(firePopup(f), { maxWidth:300 });
      searchLayer.addLayer(m);
    });

    // Waterways (add named waterways)
    watData.features.forEach(f => {
      const name = f.properties.name || f.properties.waterway;
      if (!name) return;
      const geom = f.geometry;
      const coords = geom.type === 'MultiLineString' ? geom.coordinates[0] : geom.coordinates;
      if (!coords || coords.length === 0) return;
      const mid = coords[Math.floor(coords.length / 2)];
      const m = L.marker([mid[1], mid[0]], { opacity:0 });
      m.feature = { properties:{ name: name } };
      m.bindPopup(waterwayPopup(f.properties, L.latLng(mid[1], mid[0])), { maxWidth:300 });
      searchLayer.addLayer(m);
    });

    searchLayer.addTo(map);

    map.addControl(
      new L.Control.Search({
        layer: searchLayer, propertyName:'name',
        marker:false, initial:false, zoom:16,
        textPlaceholder:'Cari sungai, RS, damkar...',
        moveToLocation:(ll, _, m) => m.setView(ll, 16)
      }).on('search:locationfound', e => { if (e.layer?.openPopup) e.layer.openPopup(); })
    );

    // ── 6. BUILDINGS HIGH RISK — on map with hover tooltip ────
    txt.textContent = 'Memuat Bangunan Risiko Tinggi...';
    sub.textContent = 'Memuat data (20MB)... Mohon tunggu';

    const bldgRes = await fetch('data/buildinghighriskarea.geojson');
    const bldgData = await bldgRes.json();
    const totalBuildings = bldgData.features.length;
    document.getElementById('countHighRiskBuildings').textContent =
      totalBuildings.toLocaleString('id-ID');

    // Create building layer on map (only visible at zoom >= 15 for performance)
    L_STORE.buildings.lyr = L.geoJSON(bldgData, {
      pane:'buildingPane',
      style: {
        color: COLORS.bufHigh,
        weight: 1,
        fillColor: COLORS.bufHigh,
        fillOpacity: 0.15,
        opacity: 0.6
      },
      onEachFeature: (feature, layer) => {
        // Hover tooltip (card)
        layer.bindTooltip(buildingTooltipContent(feature.properties), {
          className: 'building-tooltip',
          direction: 'top',
          offset: [0, -8],
          sticky: true
        });

        // Click popup
        layer.on('click', (e) => {
          L.popup({ maxWidth: 300 })
            .setLatLng(e.latlng)
            .setContent(buildingPopup(feature.properties))
            .openOn(map);
        });

        // Hover highlight
        layer.on('mouseover', () => {
          layer.setStyle({
            fillOpacity: 0.4,
            weight: 2,
            opacity: 1
          });
        });
        layer.on('mouseout', () => {
          layer.setStyle({
            fillOpacity: 0.15,
            weight: 1,
            opacity: 0.6
          });
        });
      }
    });

    // Building layer default: off (user toggles it)
    bindToggle('buildings');

    // Count building types
    const typeCounts = {};
    bldgData.features.forEach(f => {
      const t = (f.properties && f.properties.building) || 'yes';
      typeCounts[t] = (typeCounts[t] || 0) + 1;
    });

    // Sort by count descending
    const breakdown = Object.entries(typeCounts)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count);

    // Store for chatbot
    chatBldgStats = { total: totalBuildings, breakdown };

    // Render breakdown in sidebar
    const bldgEl = document.getElementById('bldgBreakdown');
    if (bldgEl) {
      let html = '<div class="section-title"><i class="fa-solid fa-chart-pie"></i> Rincian Bangunan Terdampak</div>';
      html += '<div class="bldg-list">';
      breakdown.forEach(b => {
        const info = BLDG_LABELS[b.type] || { label: b.type, icon:'fa-building', color:'#64748b' };
        const pct = ((b.count / totalBuildings) * 100).toFixed(1);
        html += `
          <div class="bldg-row">
            <div class="bldg-icon" style="color:${info.color}"><i class="fa-solid ${info.icon}"></i></div>
            <div class="bldg-info">
              <div class="bldg-name">${info.label}</div>
              <div class="bldg-bar-wrap">
                <div class="bldg-bar" style="width:${Math.min(pct * 2, 100)}%;background:${info.color}"></div>
              </div>
            </div>
            <div class="bldg-count">${b.count.toLocaleString('id-ID')}</div>
          </div>`;
      });
      html += '</div>';
      bldgEl.innerHTML = html;
    }

    // ── 7. SETUP CONTROLS ────────────────────────────────────
    setupOpacitySlider();
    updateMapLegend();
    initChatbot();

    // DONE
    overlay.classList.add('hidden');
    setTimeout(() => overlay.style.display = 'none', 600);

  } catch(err) {
    console.error('Load error:', err);
    txt.textContent = 'Gagal memuat!';
    sub.textContent = `Pastikan server berjalan (python -m http.server 8000). ${err.message}`;
  }
}

loadData();