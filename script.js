const STORAGE_KEY = 'ruangtenang.journal.v1';
const PIN_KEY = 'ruangtenang.pin.v1';
const AUDIO_KEY = 'ruangtenang.audio.enabled';

const TECHNIQUES = {
  '478': {
    name: 'Napas Relaksasi 4—7—8',
    tag: '[ METODE: NAPAS RELAKSASI 4—7—8 ]',
    cadence: '± 19 DETIK / SIKLUS',
    phases: [
      { label: 'Tarik Napas', guide: 'Tarik napas perlahan lewat hidung', duration: 4, cssClass: 'phase-inhale', stepIndex: 0 },
      { label: 'Tahan Napas', guide: 'Tahan udara di dalam dada dengan santai', duration: 7, cssClass: 'phase-hold', stepIndex: 1 },
      { label: 'Hembuskan', guide: 'Hembuskan perlahan lewat mulut', duration: 8, cssClass: 'phase-exhale', stepIndex: 2 }
    ]
  },
  'box': {
    name: 'Box Breathing 4—4—4—4',
    tag: '[ METODE: BOX BREATHING 4—4—4—4 ]',
    cadence: '16 DETIK / SIKLUS',
    phases: [
      { label: 'Tarik Napas', guide: 'Tarik napas perlahan dan dalam', duration: 4, cssClass: 'phase-inhale', stepIndex: 0 },
      { label: 'Tahan Napas', guide: 'Tahan napas dengan dada relaks', duration: 4, cssClass: 'phase-hold', stepIndex: 1 },
      { label: 'Hembuskan', guide: 'Keluarkan napas perlahan', duration: 4, cssClass: 'phase-exhale-box', stepIndex: 2 },
      { label: 'Tahan Kosong', guide: 'Tahan jeda sebelum menarik napas lagi', duration: 4, cssClass: 'phase-hold', stepIndex: 3 }
    ]
  },
  'calm': {
    name: 'Napas Tenang 4—6',
    tag: '[ METODE: NAPAS TENANG 4—6 ]',
    cadence: '10 DETIK / SIKLUS',
    phases: [
      { label: 'Tarik Napas', guide: 'Tarik napas lembut lewat hidung', duration: 4, cssClass: 'phase-inhale', stepIndex: 0 },
      { label: 'Hembuskan', guide: 'Hembuskan perlahan lebih panjang', duration: 6, cssClass: 'phase-exhale-calm', stepIndex: 1 }
    ]
  }
};

let audioCtx = null;

function playCalmChime() {
  const isAudioEnabled = window.localStorage.getItem(AUDIO_KEY) === 'true';
  if (!isAudioEnabled) return;

  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    if (!audioCtx) audioCtx = new AudioContextClass();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(528, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(432, audioCtx.currentTime + 1.2);

    gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.18, audioCtx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.4);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 1.5);
  } catch {
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;
  if (page === 'home') initHomeModule();
  if (page === 'breathing') initBreathingModule();
  if (page === 'journal') initJournalModule();
  if (page === 'support') initSupportModule();
});

function initHomeModule() {
  const quickBtns = document.querySelectorAll('.quick-mood-btn');
  const feedback = document.getElementById('quickPulseFeedback');

  quickBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const mood = btn.dataset.mood;
      const entries = loadJournalEntries();
      const newEntry = {
        id: generateUniqueId(),
        mood,
        content: `Refleksi cepat: Hari ini merasa ${mood}.`,
        createdAt: new Date().toISOString()
      };
      entries.unshift(newEntry);
      if (saveJournalEntries(entries)) {
        feedback.textContent = `Suasana hati "${mood}" tersimpan ke perangkatmu. Buka menu Jurnal untuk melihat tren emosimu.`;
      }
    });
  });
}

function initBreathingModule() {
  const toggleBtn = document.getElementById('breathingToggleBtn');
  const toggleText = document.getElementById('breathingToggleText');
  const resetBtn = document.getElementById('breathingResetBtn');
  const circle = document.getElementById('breathingCircle');
  const phaseText = document.getElementById('phaseText');
  const timerText = document.getElementById('timerText');
  const phaseGuide = document.getElementById('phaseGuide');
  const cycleCounter = document.getElementById('cycleCounter');
  const durationCounter = document.getElementById('durationCounter');
  const exerciseStatus = document.getElementById('exerciseStatus');
  const note = document.getElementById('breathingNote');
  const audioToggleBtn = document.getElementById('audioToggleBtn');
  const audioLabel = document.getElementById('audioLabel');
  const stepperContainer = document.getElementById('stepperContainer');
  const currentTechTag = document.getElementById('currentTechTag');
  const currentTechCadence = document.getElementById('currentTechCadence');
  const techTabs = document.querySelectorAll('.technique-tab');

  let currentKey = '478';
  let isRunning = false;
  let phaseIndex = 0;
  let secondsRemaining = 0;
  let completedCycles = 0;
  let totalElapsed = 0;
  let mainInterval = null;
  let elapsedInterval = null;

  function updateAudioButtonUI() {
    const isAudioOn = window.localStorage.getItem(AUDIO_KEY) === 'true';
    audioToggleBtn.setAttribute('aria-pressed', String(isAudioOn));
    audioLabel.textContent = isAudioOn ? 'Lonceng Suara: Aktif' : 'Lonceng Suara: Mati';
  }

  updateAudioButtonUI();

  audioToggleBtn.addEventListener('click', () => {
    const isAudioOn = window.localStorage.getItem(AUDIO_KEY) === 'true';
    const nextState = !isAudioOn;
    window.localStorage.setItem(AUDIO_KEY, String(nextState));
    updateAudioButtonUI();
    if (nextState) playCalmChime();
  });

  function renderStepper(tech) {
    stepperContainer.replaceChildren();
    tech.phases.forEach((p, idx) => {
      const cell = document.createElement('div');
      cell.className = `step-cell ${idx === 0 ? 'active' : ''}`;
      cell.id = `step_${idx}`;
      cell.setAttribute('role', 'tab');
      cell.setAttribute('aria-selected', String(idx === 0));

      const num = document.createElement('span');
      num.className = 'step-index';
      num.textContent = `0${idx + 1}`;

      const name = document.createElement('span');
      name.className = 'step-name';
      name.textContent = p.label.toUpperCase();

      const time = document.createElement('span');
      time.className = 'step-time';
      time.textContent = `${p.duration} DETIK`;

      cell.append(num, name, time);
      stepperContainer.append(cell);
    });
  }

  function switchTechnique(key) {
    if (isRunning) stopBreathing();
    currentKey = key;
    const tech = TECHNIQUES[key];
    currentTechTag.textContent = tech.tag;
    currentTechCadence.textContent = tech.cadence;

    techTabs.forEach(tab => {
      const isSelected = tab.dataset.mode === key;
      tab.classList.toggle('active', isSelected);
      tab.setAttribute('aria-selected', String(isSelected));
    });

    renderStepper(tech);
    resetSession();
  }

  techTabs.forEach(tab => {
    tab.addEventListener('click', () => switchTechnique(tab.dataset.mode));
  });

  function highlightStepCell(idx) {
    const tech = TECHNIQUES[currentKey];
    tech.phases.forEach((_, i) => {
      const el = document.getElementById(`step_${i}`);
      if (!el) return;
      const isCurrent = i === idx;
      el.classList.toggle('active', isCurrent);
      el.setAttribute('aria-selected', String(isCurrent));
    });
  }

  function applyPhase(idx) {
    phaseIndex = idx;
    const tech = TECHNIQUES[currentKey];
    const phase = tech.phases[idx];
    secondsRemaining = phase.duration;

    circle.className = `breathing-circle ${phase.cssClass}`;
    phaseText.textContent = phase.label;
    timerText.textContent = String(secondsRemaining);
    phaseGuide.textContent = phase.guide;

    highlightStepCell(idx);
    playCalmChime();
  }

  function timerTick() {
    secondsRemaining -= 1;
    if (secondsRemaining > 0) {
      timerText.textContent = String(secondsRemaining);
      return;
    }

    const tech = TECHNIQUES[currentKey];
    const nextIdx = (phaseIndex + 1) % tech.phases.length;
    if (nextIdx === 0) {
      completedCycles += 1;
      cycleCounter.textContent = `${completedCycles} Siklus`;
    }
    applyPhase(nextIdx);
  }

  function formatTime(sec) {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  function startBreathing() {
    isRunning = true;
    toggleBtn.setAttribute('aria-pressed', 'true');
    toggleText.textContent = 'Hentikan Latihan';
    resetBtn.disabled = true;
    exerciseStatus.textContent = 'Berjalan';
    note.textContent = 'Fokus pada aliran napasmu. Jangan memaksakan diri bila dada terasa sesak atau pusing.';

    applyPhase(0);
    mainInterval = window.setInterval(timerTick, 1000);
    elapsedInterval = window.setInterval(() => {
      totalElapsed += 1;
      durationCounter.textContent = formatTime(totalElapsed);
    }, 1000);
  }

  function stopBreathing() {
    isRunning = false;
    window.clearInterval(mainInterval);
    window.clearInterval(elapsedInterval);
    mainInterval = null;
    elapsedInterval = null;

    toggleBtn.setAttribute('aria-pressed', 'false');
    toggleText.textContent = 'Lanjutkan Latihan';
    resetBtn.disabled = false;
    exerciseStatus.textContent = 'Dijeda';

    circle.className = 'breathing-circle';
    phaseText.textContent = 'Dijeda';
    timerText.textContent = '\u2014';
    phaseGuide.textContent = 'Klik tombol untuk melanjutkan';
  }

  function resetSession() {
    stopBreathing();
    completedCycles = 0;
    totalElapsed = 0;
    cycleCounter.textContent = '0 Siklus';
    durationCounter.textContent = '00:00';
    exerciseStatus.textContent = 'Menunggu';
    toggleText.textContent = 'Mulai Latihan';
    phaseText.textContent = 'Siap';
    phaseGuide.textContent = 'Klik tombol untuk mulai';
    resetBtn.disabled = true;
    note.textContent = 'Cari posisi duduk yang nyaman dengan bahu rileks. Kamu bebas menghentikan latihan kapan saja bila terasa pusing atau tidak nyaman. Latihan pernapasan ini adalah alat bantu relaksasi mandiri, bukan pengganti perawatan medis atau konsultasi profesional.';
    highlightStepCell(0);
  }

  toggleBtn.addEventListener('click', () => {
    if (isRunning) stopBreathing();
    else startBreathing();
  });

  resetBtn.addEventListener('click', resetSession);
  renderStepper(TECHNIQUES[currentKey]);
}

function initJournalModule() {
  const form = document.getElementById('journalForm');
  const textInput = document.getElementById('journalText');
  const moodButtons = document.querySelectorAll('.mood-button');
  const charCounter = document.getElementById('characterCount');
  const feedback = document.getElementById('formFeedback');
  const clearBtn = document.getElementById('clearFormBtn');
  const list = document.getElementById('journalList');
  const entryCount = document.getElementById('entryCount');
  const exportBtn = document.getElementById('exportDataBtn');
  const importFileInput = document.getElementById('importFileInput');
  const searchInput = document.getElementById('searchJournalInput');
  const filterPills = document.querySelectorAll('.filter-pill');
  const pinToggleBtn = document.getElementById('pinToggleBtn');
  const pinModal = document.getElementById('pinModal');
  const closePinModalBtn = document.getElementById('closePinModalBtn');
  const pinForm = document.getElementById('pinForm');
  const pinInput = document.getElementById('pinInput');
  const pinFeedback = document.getElementById('pinFeedback');
  const pinModalTitle = document.getElementById('pinModalTitle');
  const pinModalDesc = document.getElementById('pinModalDesc');
  const pinSubmitBtn = document.getElementById('pinSubmitBtn');

  let activeMood = '';
  let activeFilter = 'all';
  let searchTerm = '';
  let isUnlocked = true;

  const currentPin = window.localStorage.getItem(PIN_KEY);
  if (currentPin) {
    isUnlocked = false;
    pinToggleBtn.querySelector('#pinBtnLabel').textContent = 'Buka Kunci PIN';
  }

  pinToggleBtn.addEventListener('click', () => {
    pinModal.hidden = false;
    pinFeedback.textContent = '';
    pinInput.value = '';
    const hasPin = Boolean(window.localStorage.getItem(PIN_KEY));

    if (!hasPin) {
      pinModalTitle.textContent = 'Pasang Kunci PIN Baru';
      pinModalDesc.textContent = 'Masukkan 4 angka rahasia untuk melindungi catatanmu.';
      pinSubmitBtn.textContent = 'Simpan PIN';
    } else if (!isUnlocked) {
      pinModalTitle.textContent = 'Masukkan PIN Anda';
      pinModalDesc.textContent = 'Catatan sedang terkunci. Masukkan 4 angka PIN untuk membuka.';
      pinSubmitBtn.textContent = 'Buka Catatan';
    } else {
      pinModalTitle.textContent = 'Kelola Kunci PIN';
      pinModalDesc.textContent = 'Masukkan 4 angka PIN untuk menghapus penguncian.';
      pinSubmitBtn.textContent = 'Hapus PIN';
    }
    pinInput.focus();
  });

  closePinModalBtn.addEventListener('click', () => {
    pinModal.hidden = true;
    pinToggleBtn.focus();
  });

  document.addEventListener('keydown', evt => {
    if (evt.key === 'Escape' && !pinModal.hidden) {
      pinModal.hidden = true;
      pinToggleBtn.focus();
    }
  });

  pinForm.addEventListener('submit', evt => {
    evt.preventDefault();
    const entered = pinInput.value.trim();
    if (entered.length !== 4 || !/^\d{4}$/.test(entered)) {
      pinFeedback.textContent = 'PIN harus terdiri dari 4 angka.';
      pinFeedback.className = 'form-feedback is-error';
      return;
    }

    const savedPin = window.localStorage.getItem(PIN_KEY);
    if (!savedPin) {
      window.localStorage.setItem(PIN_KEY, entered);
      isUnlocked = true;
      pinModal.hidden = true;
      pinToggleBtn.querySelector('#pinBtnLabel').textContent = 'Kunci PIN Aktif';
      showFeedback('Kunci PIN berhasil dipasang.', 'is-success');
    } else if (!isUnlocked) {
      if (entered === savedPin) {
        isUnlocked = true;
        pinModal.hidden = true;
        pinToggleBtn.querySelector('#pinBtnLabel').textContent = 'Kunci PIN Aktif';
        showFeedback('Catatan berhasil dibuka.', 'is-success');
        renderEntriesFeed();
      } else {
        pinFeedback.textContent = 'PIN salah. Silakan coba lagi.';
        pinFeedback.className = 'form-feedback is-error';
      }
    } else {
      if (entered === savedPin) {
        window.localStorage.removeItem(PIN_KEY);
        pinModal.hidden = true;
        pinToggleBtn.querySelector('#pinBtnLabel').textContent = 'Kunci Privasi PIN';
        showFeedback('Kunci PIN dinonaktifkan.', 'is-success');
        renderEntriesFeed();
      } else {
        pinFeedback.textContent = 'PIN verifikasi salah.';
        pinFeedback.className = 'form-feedback is-error';
      }
    }
  });

  moodButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      activeMood = btn.dataset.mood;
      moodButtons.forEach(item => item.setAttribute('aria-pressed', String(item === btn)));
      clearFeedback();
    });
  });

  textInput.addEventListener('input', () => {
    const len = textInput.value.length;
    charCounter.textContent = `${len.toLocaleString('id-ID')} / 1.200`;
  });

  clearBtn.addEventListener('click', () => {
    resetComposer();
    showFeedback('Form telah dikosongkan.', 'is-success');
  });

  searchInput.addEventListener('input', () => {
    searchTerm = searchInput.value.toLowerCase().trim();
    renderEntriesFeed();
  });

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      activeFilter = pill.dataset.filter;
      filterPills.forEach(p => {
        const isMatch = p === pill;
        p.classList.toggle('active', isMatch);
        p.setAttribute('aria-pressed', String(isMatch));
      });
      renderEntriesFeed();
    });
  });

  exportBtn.addEventListener('click', () => {
    const entries = loadJournalEntries();
    if (entries.length === 0) {
      showFeedback('Belum ada catatan untuk diekspor.', 'is-error');
      return;
    }
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(entries, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `ruangtenang-catatan-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    showFeedback('Cadangan data berhasil diunduh.', 'is-success');
  });

  importFileInput.addEventListener('change', evt => {
    const file = evt.target.files && evt.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
      try {
        const imported = JSON.parse(e.target.result);
        if (!Array.isArray(imported)) throw new Error();
        const current = loadJournalEntries();
        const valid = imported.filter(isValidEntry);
        const mergedMap = new Map();
        [...valid, ...current].forEach(item => mergedMap.set(item.id, item));
        const merged = Array.from(mergedMap.values()).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        saveJournalEntries(merged);
        showFeedback(`Berhasil memulihkan ${valid.length} catatan dari file.`, 'is-success');
        renderEntriesFeed();
        renderMoodChart();
      } catch {
        showFeedback('File JSON tidak valid atau rusak.', 'is-error');
      }
    };
    reader.readAsText(file);
    evt.target.value = '';
  });

  function clearFeedback() {
    feedback.textContent = '';
    feedback.className = 'form-feedback';
  }

  function showFeedback(msg, type) {
    feedback.textContent = msg;
    feedback.className = `form-feedback ${type}`;
  }

  function resetComposer() {
    textInput.value = '';
    charCounter.textContent = '0 / 1.200';
    activeMood = '';
    moodButtons.forEach(btn => btn.setAttribute('aria-pressed', 'false'));
  }

  function formatDate(iso) {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return 'Waktu tidak tersedia';
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(d);
  }

  function renderMoodChart() {
    const svg = document.getElementById('moodChartSvg');
    const legend = document.getElementById('chartLegend');
    if (!svg || !legend) return;

    const entries = loadJournalEntries();
    const moods = ['Tenang', 'Lega', 'Cemas', 'Sedih', 'Lelah'];
    const counts = { Tenang: 0, Lega: 0, Cemas: 0, Sedih: 0, Lelah: 0 };

    entries.forEach(e => {
      if (counts[e.mood] !== undefined) counts[e.mood] += 1;
    });

    const total = entries.length;
    svg.replaceChildren();
    legend.replaceChildren();

    if (total === 0) {
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', '250');
      text.setAttribute('y', '110');
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('fill', '#87948A');
      text.setAttribute('font-family', "'IBM Plex Mono', monospace");
      text.setAttribute('font-size', '12');
      text.textContent = 'Belum ada catatan yang tersimpan untuk dihitung';
      svg.append(text);
      return;
    }

    const maxCount = Math.max(...Object.values(counts), 1);
    const colors = {
      Tenang: '#5A7D60',
      Lega: '#809F85',
      Cemas: '#C49774',
      Sedih: '#7E919C',
      Lelah: '#9E8279'
    };

    moods.forEach((m, idx) => {
      const count = counts[m];
      const percent = Math.round((count / total) * 100);
      const barHeight = Math.max(8, Math.round((count / maxCount) * 120));
      const x = 45 + idx * 90;
      const y = 160 - barHeight;

      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', String(x));
      rect.setAttribute('y', String(y));
      rect.setAttribute('width', '50');
      rect.setAttribute('height', String(barHeight));
      rect.setAttribute('fill', colors[m]);

      const valText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      valText.setAttribute('x', String(x + 25));
      valText.setAttribute('y', String(y - 6));
      valText.setAttribute('text-anchor', 'middle');
      valText.setAttribute('fill', '#2C3E30');
      valText.setAttribute('font-family', "'IBM Plex Mono', monospace");
      valText.setAttribute('font-size', '11');
      valText.setAttribute('font-weight', '700');
      valText.textContent = `${count}`;

      const labelText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      labelText.setAttribute('x', String(x + 25));
      labelText.setAttribute('y', '180');
      labelText.setAttribute('text-anchor', 'middle');
      labelText.setAttribute('fill', '#5C6E60');
      labelText.setAttribute('font-family', "'Plus Jakarta Sans', sans-serif");
      labelText.setAttribute('font-size', '11');
      labelText.textContent = m;

      const pctText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      pctText.setAttribute('x', String(x + 25));
      pctText.setAttribute('y', '196');
      pctText.setAttribute('text-anchor', 'middle');
      pctText.setAttribute('fill', '#87948A');
      pctText.setAttribute('font-family', "'IBM Plex Mono', monospace");
      pctText.setAttribute('font-size', '10');
      pctText.textContent = `${percent}%`;

      svg.append(rect, valText, labelText, pctText);

      const leg = document.createElement('div');
      leg.className = 'legend-item';
      const col = document.createElement('span');
      col.className = 'legend-color';
      col.style.backgroundColor = colors[m];
      const txt = document.createElement('span');
      txt.textContent = `${m}: ${count} (${percent}%)`;
      leg.append(col, txt);
      legend.append(leg);
    });
  }

  function renderEntriesFeed() {
    const rawEntries = loadJournalEntries();
    let filtered = rawEntries;

    if (activeFilter !== 'all') {
      filtered = filtered.filter(item => item.mood === activeFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(item => item.content.toLowerCase().includes(searchTerm) || item.mood.toLowerCase().includes(searchTerm));
    }

    entryCount.textContent = `${filtered.length} DARI ${rawEntries.length} CATATAN`;
    list.replaceChildren();

    if (!isUnlocked) {
      const lockBox = document.createElement('div');
      lockBox.className = 'empty-state';
      lockBox.textContent = 'Catatan sedang dilindungi dengan Kunci PIN. Klik tombol Buka Kunci PIN di atas untuk membaca catatanmu.';
      list.append(lockBox);
      return;
    }

    if (filtered.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'empty-state';
      empty.textContent = searchTerm || activeFilter !== 'all' ? 'Tidak ada catatan yang cocok dengan filter saat ini.' : 'Belum ada catatan yang tersimpan. Mulai kapan pun kamu siap.';
      list.append(empty);
      return;
    }

    filtered.forEach(entry => {
      const article = document.createElement('article');
      article.className = 'journal-entry';

      const header = document.createElement('div');
      header.className = 'entry-header';

      const moodBadge = document.createElement('span');
      moodBadge.className = 'entry-mood-badge';
      moodBadge.textContent = entry.mood;

      const dateEl = document.createElement('time');
      dateEl.className = 'entry-date';
      dateEl.dateTime = entry.createdAt;
      dateEl.textContent = formatDate(entry.createdAt);

      header.append(moodBadge, dateEl);

      const content = document.createElement('p');
      content.className = 'entry-content';
      content.textContent = entry.content;

      const footer = document.createElement('div');
      footer.className = 'entry-footer';

      const delBtn = document.createElement('button');
      delBtn.className = 'entry-delete-btn';
      delBtn.type = 'button';
      delBtn.textContent = 'Hapus Catatan';
      delBtn.setAttribute('aria-label', `Hapus catatan ${entry.mood} tanggal ${formatDate(entry.createdAt)}`);
      delBtn.dataset.entryId = entry.id;

      footer.append(delBtn);
      article.append(header, content, footer);
      list.append(article);
    });
  }

  form.addEventListener('submit', evt => {
    evt.preventDefault();
    const content = textInput.value.trim();

    if (!activeMood) {
      showFeedback('Pilih salah satu suasana hati terlebih dahulu.', 'is-error');
      moodButtons[0].focus();
      return;
    }

    if (!content) {
      showFeedback('Tuliskan sepatah dua patah kata pada catatanmu.', 'is-error');
      textInput.focus();
      return;
    }

    const entries = loadJournalEntries();
    entries.unshift({
      id: generateUniqueId(),
      mood: activeMood,
      content,
      createdAt: new Date().toISOString()
    });

    if (saveJournalEntries(entries)) {
      resetComposer();
      showFeedback('Catatan berhasil tersimpan di peramban.', 'is-success');
      renderEntriesFeed();
      renderMoodChart();
    }
  });

  list.addEventListener('click', evt => {
    const btn = evt.target.closest('[data-entry-id]');
    if (!btn) return;

    const entries = loadJournalEntries().filter(item => item.id !== btn.dataset.entryId);
    if (saveJournalEntries(entries)) {
      showFeedback('Catatan telah dihapus.', 'is-success');
      renderEntriesFeed();
      renderMoodChart();
    }
  });

  renderEntriesFeed();
  renderMoodChart();
}

function initSupportModule() {
  const filterPills = document.querySelectorAll('[data-support-filter]');
  const cards = document.querySelectorAll('.support-card');

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const category = pill.dataset.supportFilter;
      filterPills.forEach(p => {
        const isMatch = p === pill;
        p.classList.toggle('active', isMatch);
        p.setAttribute('aria-pressed', String(isMatch));
      });

      cards.forEach(card => {
        const cardCat = card.dataset.category;
        if (category === 'all' || cardCat === category || (card.classList.contains('support-card-warm') && category === 'psikologis')) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

function generateUniqueId() {
  return window.crypto && typeof window.crypto.randomUUID === 'function'
    ? window.crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function isValidEntry(item) {
  return (
    item &&
    typeof item.id === 'string' &&
    typeof item.mood === 'string' &&
    typeof item.content === 'string' &&
    typeof item.createdAt === 'string'
  );
}

function loadJournalEntries() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isValidEntry) : [];
  } catch {
    return [];
  }
}

function saveJournalEntries(entries) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    return true;
  } catch {
    return false;
  }
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}
