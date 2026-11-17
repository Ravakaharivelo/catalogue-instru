// ======================================
// 0. GESTION DU MODAL USB & LIGHTBOX SARY
// ======================================

const openModalBtn = document.getElementById('openModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const usbModal = document.getElementById('usbModal');

openModalBtn.addEventListener('click', () => {
  usbModal.style.display = 'flex';
});

closeModalBtn.addEventListener('click', () => {
  usbModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === usbModal) {
    usbModal.style.display = 'none';
  }
});

// Lightbox (Zoom sary)
const lightboxModal = document.getElementById('lightboxModal');
const lightboxImg = document.getElementById('lightboxImg');
const closeLightboxBtn = document.getElementById('closeLightboxBtn');
const zoomableImgs = document.querySelectorAll('.zoomable-img');

zoomableImgs.forEach(img => {
  img.addEventListener('click', () => {
    lightboxImg.src = img.src;
    lightboxModal.style.display = 'flex';
  });
});

closeLightboxBtn.addEventListener('click', () => {
  lightboxModal.style.display = 'none';
});

lightboxModal.addEventListener('click', (e) => {
  if (e.target === lightboxModal) {
    lightboxModal.style.display = 'none';
  }
});


// ======================================
// 1. GESTION DU MODAL EXTRAIT (SANTIONAM-PEO)
// ======================================

const extraitModal = document.getElementById('extraitModal');
const closeExtraitModal = document.getElementById('closeExtraitModal');
const extraitPlayerContainer = document.getElementById('extraitPlayerContainer');
const extraitModalSongTitle = document.getElementById('extraitModalSongTitle');

if (closeExtraitModal) {
  closeExtraitModal.addEventListener('click', () => {
    extraitModal.style.display = 'none';
    extraitPlayerContainer.innerHTML = ''; // Mba hamonoana ilay feo rehefa mihidy
  });
}

if (extraitModal) {
  window.addEventListener('click', (e) => {
    if (e.target === extraitModal) {
      extraitModal.style.display = 'none';
      extraitPlayerContainer.innerHTML = '';
    }
  });
}


// ======================================
// 2. INITIALISATION
// ======================================

const liste = document.getElementById('liste');
const recherche = document.getElementById('search');
const counter = document.getElementById('counter');
const selectedCounter = document.getElementById('selectedCounter');
const selectionPanel = document.getElementById('selectionPanel');
const selectionList = document.getElementById('selectionList');
const sortBtn = document.getElementById('sortBtn');
const topBtn = document.getElementById('topBtn');
const filters = document.getElementById('filters');

let categorieActive = 'Toutes';
let ordreAZ = true;

const chansonsSelectionnees = new Set();

// ======================================
// 3. NORMALISATION
// ======================================

function normaliser(texte) {
  return texte
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

// ======================================
// 4. CREATION DES CATEGORIES
// ======================================

const categoriesDisponibles = [
  'FFPM',
  'Fifohazana',
  'Fihirana Fanampiny',
  'Katolika',
  'Evangeliques',
  'Variétés'
];

const btnToutes = document.createElement('button');
btnToutes.className = 'filter-btn active';
btnToutes.textContent = 'Toutes';

btnToutes.addEventListener('click', () => {
  categorieActive = 'Toutes';
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btnToutes.classList.add('active');
  afficher();
});

filters.appendChild(btnToutes);

categoriesDisponibles.forEach(categorie => {
  const btn = document.createElement('button');
  btn.className = 'filter-btn';
  btn.textContent = categorie;

  btn.addEventListener('click', () => {
    categorieActive = categorie;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    afficher();
  });

  filters.appendChild(btn);
});

// ======================================
// 5. COMPTEUR ET CARNET DE SELECTION
// ======================================

function afficherSelection() {
  const nombre = chansonsSelectionnees.size;
  selectedCounter.textContent = `✓ ${nombre} hira voafidy`;
  selectionList.innerHTML = '';

  if (nombre === 0) {
    selectionPanel.style.display = 'none';
    return;
  }

  selectionPanel.style.display = 'block';

  chansons.forEach(chanson => {
    if (!chansonsSelectionnees.has(chanson.nom)) {
      return;
    }

    const item = document.createElement('div');
    item.className = 'selection-item';

    const nom = document.createElement('div');
    nom.textContent = chanson.nom;

    const categorie = document.createElement('span');
    categorie.textContent = chanson.categorie;

    item.appendChild(nom);
    item.appendChild(categorie);
    selectionList.appendChild(item);
  });
}

// ======================================
// 6. AFFICHAGE DES CHANSONS
// ======================================

function afficher() {
  const q = normaliser(recherche.value.trim());

  let resultats = chansons.filter(chanson => {
    const rechercheOK = normaliser(chanson.nom).includes(q);
    const categorieOK = categorieActive === 'Toutes' || chanson.categorie === categorieActive;
    return rechercheOK && categorieOK;
  });

  resultats.sort((a, b) =>
    a.nom.localeCompare(b.nom, 'fr', { sensitivity: 'base' })
  );

  if (!ordreAZ) {
    resultats.reverse();
  }

  liste.innerHTML = '';
  counter.textContent = `${resultats.length} chanson(s) trouvée(s) / ${chansons.length} au total`;

  if (resultats.length === 0) {
    const vide = document.createElement('div');
    vide.className = 'empty';
    vide.textContent = '🎵 Aucune chanson trouvée.';
    liste.appendChild(vide);
    return;
  }

  resultats.forEach(chanson => {
    const div = document.createElement('div');
    div.className = 'chanson';

    const icon = document.createElement('span');
    icon.className = 'music-icon';
    icon.textContent = '♫';

    const info = document.createElement('div');
    info.className = 'song-info';

    const nom = document.createElement('div');
    nom.className = 'song-name';
    nom.textContent = chanson.nom;

    const categorie = document.createElement('span');
    categorie.className = 'song-category';
    categorie.textContent = chanson.categorie;

    info.appendChild(nom);
    info.appendChild(categorie);

    // RAHA MISY EXTRAIT DIA MAMORONA BOKOTRA MANOKATRA MODAL FIHAINOANA
    if (chanson.extrait && chanson.extrait.trim() !== '') {
      const btnExtrait = document.createElement('button');
      btnExtrait.className = 'extrait-btn';
      btnExtrait.innerHTML = '▶ Henoy ny santionany';

      btnExtrait.addEventListener('click', () => {
        const match = chanson.extrait.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
        if (match && match[1]) {
          extraitModalSongTitle.textContent = chanson.nom;
          extraitPlayerContainer.innerHTML = `
            <iframe src="https://drive.google.com/file/d/${match[1]}/preview" 
                    style="width: 100%; height: 80px; border: none; border-radius: 8px;" 
                    allow="autoplay"></iframe>
          `;
          extraitModal.style.display = 'flex';
        }
      });

      info.appendChild(btnExtrait);
    }

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'song-checkbox';
    checkbox.checked = chansonsSelectionnees.has(chanson.nom);
    checkbox.setAttribute('aria-label', 'Sélectionner ' + chanson.nom);

    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        chansonsSelectionnees.add(chanson.nom);
      } else {
        chansonsSelectionnees.delete(chanson.nom);
      }
      afficherSelection();
    });

    div.appendChild(icon);
    div.appendChild(info);
    div.appendChild(checkbox);

    liste.appendChild(div);
  });
}

// ======================================
// 7. RECHERCHE INSTANTANEE
// ======================================

recherche.addEventListener('input', afficher);

// ======================================
// 8. TRI A-Z / Z-A
// ======================================

sortBtn.addEventListener('click', () => {
  ordreAZ = !ordreAZ;
  sortBtn.textContent = ordreAZ ? '↕ Tri : A – Z' : '↕ Tri : Z – A';
  afficher();
});

// ======================================
// 9. RETOUR EN HAUT
// ======================================

window.addEventListener('scroll', () => {
  topBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
});

topBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// ======================================
// 10. LANCEMENT
// ======================================

afficher();
afficherSelection();
