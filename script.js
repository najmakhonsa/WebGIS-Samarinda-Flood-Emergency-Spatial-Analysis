// ============================================================
//  SAMARINDA FLOOD & EMERGENCY WEBGIS — script.js
// ============================================================

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

// ── MAP INIT ─────────────────────────────────────────────────
const map = L.map('map', { zoomControl:false }).setView([-0.502, 117.145], 13);
L.control.zoom({ position:'bottomright' }).addTo(map);
L.control.scale({ position:'bottomleft', metric:true, imperial:false }).addTo(map);

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
let dark = true;
document.getElementById('themeToggle').addEventListener('click', () => {
  dark = !dark;
  document.body.classList.toggle('light-mode');
  document.getElementById('themeToggle').querySelector('i').className =
    dark ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
});

// ── COORDINATES ──────────────────────────────────────────────
map.on('mousemove', e => {
  document.getElementById('coordsText').textContent =
    `Lat: ${e.latlng.lat.toFixed(5)}   Lon: ${e.latlng.lng.toFixed(5)}`;
});

// ── MODE SWITCH ──────────────────────────────────────────────
window.switchMode = function(mode) {
  document.getElementById('panelFlood').classList.toggle('hidden', mode !== 'flood');
  document.getElementById('panelEmergency').classList.toggle('hidden', mode !== 'emergency');
  document.getElementById('tabFlood').classList.toggle('active', mode === 'flood');
  document.getElementById('tabEmergency').classList.toggle('active', mode === 'emergency');
};

// ── POPUP BUILDERS ───────────────────────────────────────────
function hospitalPopup(h) {
  const lat = h.lat.toFixed(5), lon = h.lon.toFixed(5);
  const svcs = h.services.length
    ? `<div class="pc-services">${h.services.map(s=>`<span class="pc-service-tag">${s}</span>`).join('')}</div>`
    : '';
  return `
    <div class="pc-header">
      <div class="pc-icon" style="background:rgba(255,0,119,.12)">
        <i class="fa-solid fa-hospital" style="color:#ff0077"></i>
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
      <div class="pc-icon" style="background:rgba(255,98,0,.12)">
        <i class="fa-solid fa-fire-extinguisher" style="color:#ff6200"></i>
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
      <div class="pc-icon" style="background:rgba(0,212,255,.12)">
        <i class="fa-solid fa-water" style="color:#00d4ff"></i>
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
      <div class="pc-row"><i class="fa-solid fa-circle-info"></i><span>Kedekatan bangunan dan infrastruktur terhadap aliran ini meningkatkan risiko terdampak banjir. Heatmap menunjukkan intensitas kepadatan jaringan sungai.</span></div>
      <div style="margin-top:10px">
        <a href="${osmLink}" target="_blank" class="pc-link"><i class="fa-solid fa-map"></i> Lihat di OpenStreetMap</a>
      </div>
    </div>`;
}

function floodBufferPopup(riskLevel, color) {
  const osmLink = `https://www.openstreetmap.org/#map=14/-0.502/117.145`;
  const desc = riskLevel === 'Tinggi'
    ? 'Zona ini berada sangat dekat dengan aliran sungai (< 50m). Area ini memiliki probabilitas banjir tertinggi dan bangunan di sini paling rentan terdampak.'
    : riskLevel === 'Sedang'
    ? 'Zona ini berada dalam jarak menengah dari aliran sungai. Risiko banjir cukup signifikan, terutama saat curah hujan tinggi.'
    : 'Zona ini merupakan area buffer terluar yang masih memiliki potensi terdampak banjir dalam kondisi ekstrem.';
  return `
    <div class="pc-header">
      <div class="pc-icon" style="background:${color}22">
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
      <div style="margin-top:10px">
        <a href="${osmLink}" target="_blank" class="pc-link"><i class="fa-solid fa-map"></i> Lihat di OpenStreetMap</a>
      </div>
    </div>`;
}

// ── LAYER STORE ──────────────────────────────────────────────
const L_STORE = {
  heatmap:      { lyr:null, tog:'togHeatmap' },
  waterways:    { lyr:null, tog:'togWaterways' },
  highRisk:     { lyr:null, tog:'togHighRisk' },
  medRisk:      { lyr:null, tog:'togMedRisk' },
  lowRisk:      { lyr:null, tog:'togLowRisk' },
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
      fillOpacity:0.07, weight:1.5, dashArray:'6 4'
    }).addTo(grp);
  });
  return grp;
}

// ── PSEUDO-HEATMAP (Pure Leaflet, no plugin) ─────────────────
// Overlapping transparent circles along waterways create density
// effect identical to a real heatmap — guaranteed to work.
function buildPseudoHeatmap(watData) {
  const grp = L.layerGroup();
  watData.features.forEach(f => {
    const g = f.geometry;
    const lines = g.type === 'LineString'      ? [g.coordinates]
                : g.type === 'MultiLineString' ? g.coordinates : [];
    lines.forEach(line => {
      line.forEach((c, i) => {
        if (i % 3 !== 0) return; // sample every 3rd point for performance
        // Inner glow: small, high opacity
        L.circle([c[1], c[0]], {
          radius:120, fillColor:'#ff3300',
          fillOpacity:0.07, color:'none', weight:0
        }).addTo(grp);
        // Outer glow: larger, low opacity
        L.circle([c[1], c[0]], {
          radius:280, fillColor:'#ff8800',
          fillOpacity:0.025, color:'none', weight:0
        }).addTo(grp);
      });
    });
  });
  return grp;
}

// ── MAIN LOAD ────────────────────────────────────────────────
async function loadData() {
  const overlay = document.getElementById('loading');
  const txt     = document.getElementById('loadingText');
  const sub     = document.getElementById('loadingSubText');

  try {
    // ── 1. FLOOD BUFFERS ──────────────────────────────────────
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

    L_STORE.highRisk.lyr = L.geoJSON(hrData, {
      style:{ color:'#ff2b2b', fillColor:'#ff2b2b', fillOpacity:.42, weight:.8 },
      onEachFeature:(f, l) => l.on('click', e => {
        L.popup({ maxWidth:300 })
          .setLatLng(e.latlng)
          .setContent(floodBufferPopup('Tinggi','#ff2b2b'))
          .openOn(map);
      })
    });
    L_STORE.medRisk.lyr = L.geoJSON(mrData, {
      style:{ color:'#ff9d00', fillColor:'#ff9d00', fillOpacity:.32, weight:.8 },
      onEachFeature:(f, l) => l.on('click', e => {
        L.popup({ maxWidth:300 })
          .setLatLng(e.latlng)
          .setContent(floodBufferPopup('Sedang','#ff9d00'))
          .openOn(map);
      })
    });
    L_STORE.lowRisk.lyr = L.geoJSON(lrData, {
      style:{ color:'#ffea00', fillColor:'#ffea00', fillOpacity:.2, weight:.8 },
      onEachFeature:(f, l) => l.on('click', e => {
        L.popup({ maxWidth:300 })
          .setLatLng(e.latlng)
          .setContent(floodBufferPopup('Rendah','#d4b800'))
          .openOn(map);
      })
    });

    // Separate instance for emergency panel ref
    L_STORE.highRiskRef.lyr = L.geoJSON(hrData, {
      style:{ color:'#ff2b2b', fillColor:'#ff2b2b', fillOpacity:.22, weight:.6 }
    });

    bindToggle('highRisk');
    bindToggle('medRisk');
    bindToggle('lowRisk');
    bindToggle('highRiskRef');

    // ── 2. WATERWAYS ──────────────────────────────────────────
    txt.textContent = 'Memuat Aliran Sungai...';
    sub.textContent = 'Generating flood proximity heatmap';

    const watRes = await fetch('data/waterwayss.geojson');
    const watData = await watRes.json();

    L_STORE.waterways.lyr = L.geoJSON(watData, {
      style:{ color:'#00d4ff', weight:2.5, opacity:.9 },
      onEachFeature:(f, l) => {
        l.on('click', e => {
          l.bindPopup(waterwayPopup(f.properties, e.latlng), { maxWidth:300 }).openPopup();
        });
      }
    });
    document.getElementById('countWaterways').textContent = watData.features.length;

    // Build pseudo-heatmap (no plugin needed!)
    L_STORE.heatmap.lyr = buildPseudoHeatmap(watData);

    bindToggle('waterways');
    bindToggle('heatmap'); // checked by default → will be added to map

    // ── 3. HOSPITALS ──────────────────────────────────────────
    txt.textContent = 'Memuat Fasilitas Darurat...';
    sub.textContent = 'Rumah Sakit & Pemadam Kebakaran';

    const hospGroup = L.layerGroup();
    HOSPITALS.forEach(h => {
      L.circleMarker([h.lat, h.lon], {
        radius:7, fillColor:'#ff0077', color:'#fff', weight:1.5, fillOpacity:1
      })
      .bindPopup(hospitalPopup(h), { maxWidth:300 })
      .addTo(hospGroup);
    });
    L_STORE.hospital.lyr     = hospGroup;
    L_STORE.hospCoverage.lyr = makeCoverageCircles(HOSPITALS, '#ff0077');
    document.getElementById('countHospital').textContent = HOSPITALS.length;

    bindToggle('hospital');
    bindToggle('hospCoverage');

    // ── 4. FIRE STATIONS ──────────────────────────────────────
    const fireGroup = L.layerGroup();
    FIRESTATIONS.forEach(f => {
      L.circleMarker([f.lat, f.lon], {
        radius:7, fillColor:'#ff6200', color:'#fff', weight:1.5, fillOpacity:1
      })
      .bindPopup(firePopup(f), { maxWidth:300 })
      .addTo(fireGroup);
    });
    L_STORE.fire.lyr         = fireGroup;
    L_STORE.fireCoverage.lyr = makeCoverageCircles(FIRESTATIONS, '#ff6200');
    document.getElementById('countFire').textContent = FIRESTATIONS.length;

    bindToggle('fire');
    bindToggle('fireCoverage');

    // ── 5. SEARCH (hospitals) ─────────────────────────────────
    const searchLayer = L.layerGroup();
    HOSPITALS.forEach(h => {
      const m = L.marker([h.lat, h.lon], { opacity:0 });
      m.feature = { properties:{ name: h.name } };
      m.bindPopup(hospitalPopup(h), { maxWidth:300 });
      searchLayer.addLayer(m);
    });
    searchLayer.addTo(map);

    map.addControl(
      new L.Control.Search({
        layer: searchLayer, propertyName:'name',
        marker:false, initial:false, zoom:16,
        moveToLocation:(ll, _, m) => m.setView(ll, 16)
      }).on('search:locationfound', e => { if (e.layer?.openPopup) e.layer.openPopup(); })
    );

    // ── 6. BUILDINGS COUNT ONLY ───────────────────────────────
    txt.textContent = 'Menghitung Bangunan Risiko Tinggi...';
    sub.textContent = 'Memuat data (20MB)...';

    const bldgRes = await fetch('data/buildinghighriskarea.geojson');
    const bldgData = await bldgRes.json();
    document.getElementById('countHighRiskBuildings').textContent =
      bldgData.features.length.toLocaleString('id-ID');

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