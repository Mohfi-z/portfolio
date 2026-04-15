// =========================================
//
// SCRIPT PRINCIPAL D'ANIMATION ET INTERACTIONS
//
// =========================================

// =========================================
// Lettres runes
// =========================================
document.addEventListener("DOMContentLoaded", function () {
  const letters = document.querySelectorAll(".hero-container h1 span");
  const particlesContainer = document.querySelector(".particles");

  const runes = [
    "ᚠ", "ᚢ", "ᚦ", "ᚨ", "ᛁ", "ᛃ", "ᛇ", "ᛈ", "ᛉ", "ᛋ",
    "ᛏ", "ᛒ", "ᛖ", "ᛗ", "ᛚ", "ᛜ", "ᛞ", "ᛟ", "ᚱ", "ᚺ",
    "ᚾ", "ᚴ", "ᚷ", "ᚹ", "ᛅ", "ᛏ", "ᛣ", "ᛥ", "ᚼ", "ᛃ"
  ];

  letters.forEach(letter => {
    let interval = null;
    let timeout = null;
    const originalLetter = letter.textContent;

    letter.addEventListener("mouseover", () => {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
      clearTimeout(timeout);

      // Amélioration de l'impact avec deux effets : impact et pulsation
      letter.classList.add("impact");
      letter.classList.add("pulse");
      setTimeout(() => {
        letter.classList.remove("pulse");
      }, 500);

      let count = 0;
      let runeIndex = 0;
      letter.style.transition = "text-shadow 0.2s ease, color 0.2s ease";

      interval = setInterval(() => {
        if (count < runes.length) {
          const randomHue = Math.random() * 360;
          letter.textContent = runes[runeIndex];
          letter.style.color = `hsl(${randomHue}, 100%, 50%)`;
          letter.style.textShadow = `0 0 10px hsl(${randomHue}, 100%, 50%)`;
          runeIndex = (runeIndex + 1) % runes.length;
          count++;
        } else {
          clearInterval(interval);
          interval = null;
        }
      }, 50);

      // Création de particules avec effet de rotation pour renforcer l'impact
      for (let i = 0; i < 10; i++) {
        const particle = document.createElement("div");
        particle.className = "particle";
        particle.style.left = `${letter.offsetLeft + Math.random() * letter.offsetWidth}px`;
        particle.style.top = `${letter.offsetTop + Math.random() * letter.offsetHeight}px`;
        particle.style.animationDelay = `${Math.random() * 0.5}s`;
        particlesContainer.appendChild(particle);

        particle.addEventListener("animationend", () => {
          particle.remove();
        });
      }
    });

    letter.addEventListener("mouseout", () => {
      timeout = setTimeout(() => {
        clearInterval(interval);
        interval = null;
        letter.textContent = originalLetter;
      }, 150);
    });
  });
});

// =========================================
// ✨ Particules dynamiques
// =========================================
document.addEventListener("DOMContentLoaded", function () {
  const particlesContainer = document.querySelector(".particles-background");
  if (!particlesContainer) {
      console.error("Conteneur des particules introuvable !");
      return;
  }

  console.log("Conteneur des particules trouvé, génération des particules...");

  const maxParticles = 10; // Limite stricte du nombre de particules
  let activeParticles = 0;
  let lockedParticles = new Set();

  function generateParticles(numParticles) {
      for (let i = 0; i < numParticles; i++) {
          if (activeParticles >= maxParticles) return; // Ne dépasse jamais la limite

          const particle = document.createElement("div");
          particle.className = "particle-exp";

          // Position initiale aléatoire
          const startX = Math.random() * window.innerWidth;
          const startY = Math.random() * window.innerHeight;

          particle.style.left = `${startX}px`;
          particle.style.top = `${startY}px`;

          // Ajoute une traînée lumineuse
          const trail = document.createElement("div");
          trail.className = "particle-trail";
          particle.appendChild(trail);

          particlesContainer.appendChild(particle);
          activeParticles++;
      }
  }

  generateParticles(maxParticles);

  document.addEventListener("mousemove", function (event) {
      const cursorX = event.clientX;
      const cursorY = event.clientY;

      document.querySelectorAll(".particle-exp").forEach((particle) => {
          if (lockedParticles.has(particle)) return;

          const rect = particle.getBoundingClientRect();
          const particleX = rect.left + rect.width / 2;
          const particleY = rect.top + rect.height / 2;
          const distance = Math.sqrt((cursorX - particleX) ** 2 + (cursorY - particleY) ** 2);

          if (distance < 150) {
              lockedParticles.add(particle);
              particle.classList.add("locked-on");
          }
      });
  });

  function updateParticles() {
      const particlesToRemove = [];

      document.querySelectorAll(".particle-exp").forEach((particle) => {
          if (lockedParticles.has(particle)) {
              let particleX = parseFloat(particle.style.left) || 0;
              let particleY = parseFloat(particle.style.top) || 0;

              const cursorX = window.cursorX || window.innerWidth / 2;
              const cursorY = window.cursorY || window.innerHeight / 2;

              // Calcul de direction vers le curseur
              const dx = cursorX - particleX;
              const dy = cursorY - particleY;
              const distance = Math.sqrt(dx * dx + dy * dy);

              // ⚡ Nouvelle vitesse dynamique : Très rapide quand éloignée, ralentit mais fluide quand proche
              let speed = Math.max(5, Math.min(14, distance / 10)); 

              let moveX = (dx / distance) * speed;
              let moveY = (dy / distance) * speed;

              // 🌀 Effet de vortex : Rotation et légère instabilité proche du curseur
              if (distance < 60) {
                  const angle = Math.atan2(dy, dx) + Math.PI / 4;
                  moveX = Math.cos(angle) * speed;
                  moveY = Math.sin(angle) * speed;
              }

              // 🔄 Effet de rebond dynamique
              if (distance < 30) {
                  moveX += Math.sin(Date.now() * 0.005) * 3;
                  moveY += Math.cos(Date.now() * 0.005) * 3;
              }

              // Mise à jour de la position
              particleX += moveX;
              particleY += moveY;

              particle.style.left = `${particleX}px`;
              particle.style.top = `${particleY}px`;

              // Absorption finale
              if (distance < 10) {
                  particle.style.transition = "transform 0.2s ease-in-out, opacity 0.2s ease-in-out";
                  particle.style.transform = `scale(0)`;
                  particle.style.opacity = "0";

                  particlesToRemove.push(particle);
              }
          }
      });

      // Suppression des particules absorbées
      particlesToRemove.forEach((particle) => {
          setTimeout(() => {
              particle.remove();
              lockedParticles.delete(particle);
              activeParticles--;

              // 🔥 Nouveau système : Moins de particules qui réapparaissent (1/3 chance)
              if (activeParticles < maxParticles && Math.random() > 0.99) {
                  generateParticles(1);
              }
          }, 200);
      });

      requestAnimationFrame(updateParticles);
  }

  updateParticles();

  document.addEventListener("mousemove", function (event) {
      window.cursorX = event.clientX;
      window.cursorY = event.clientY;
  });
});

// =========================================
// * Activation/Désactivation de la Sidebar
// =========================================
document.addEventListener("DOMContentLoaded", function () {
    const sidebar = document.querySelector(".sidebar");
    const toggleButton = document.getElementById("toggle-sidebar");
    const mainContent = document.querySelector("main");
    sidebar.classList.toggle("active");
    toggleButton.addEventListener("click", function () {
        // Afficher/Cacher la sidebar
        sidebar.classList.toggle("active");

        // Ajuster la marge du contenu principal en fonction de l'état de la sidebar
        if (sidebar.classList.contains("active")) {
            mainContent.style.marginLeft = "250px"; // Quand la sidebar est visible
        } else {
            mainContent.style.marginLeft = "0"; // Quand elle est cachée
        }
    });
});

// =========================================
// * Animation Skills
// =========================================
document.addEventListener("DOMContentLoaded", function () {
  const skillCards = document.querySelectorAll(".skill-card-container");

  skillCards.forEach((card) => {
      card.addEventListener("click", function () {
          const skillCard = this.querySelector(".skill-card");
          skillCard.classList.toggle("flipped");

          // Réinitialiser l'animation avant de la rejouer
          const skillBars = skillCard.querySelectorAll(".skill-fill");
          skillBars.forEach((bar) => {
              bar.style.transition = "none"; // Supprime la transition pour reset
              bar.style.width = "0%"; // Réinitialisation
              setTimeout(() => {
                  bar.style.transition = "width 1.5s ease-in-out"; // Réactive la transition
                  const skillLevel = bar.getAttribute("data-skill") || bar.getAttribute("data-percent");
                  bar.style.width = skillLevel + "%"; // Anime la barre
              }, 50); // Petit délai pour forcer la réinitialisation
          });
      });
  });
});

// =========================================
// * NAVIGATION SIDEBAR
// =========================================
document.addEventListener('DOMContentLoaded', function() {
    // Sélectionner tous les liens de la sidebar qui pointent vers des sections
    const links = document.querySelectorAll('.sidebar a');

    // Ajouter un événement 'click' à chaque lien
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            // Empêcher le comportement par défaut du lien (qui rechargerait la page)
            e.preventDefault();

            // Récupérer l'ID de la section à partir de l'attribut 'href'
            const targetId = link.getAttribute('href').substring(1); // Supprime le '#'

            // Sélectionner la section cible
            const targetSection = document.getElementById(targetId);

            // Faire défiler la page vers la section cible
            targetSection.scrollIntoView({
                behavior: 'smooth' // Défilement fluide
            });
        });
    });
});

// =========================================
// * PARTICULE 
// =========================================
document.addEventListener("DOMContentLoaded", function () {
    function createParticles(containerSelector, particleClass, numParticles, sizeRange = [4, 10], animationDurationRange = [1, 3]) {
        const container = document.createElement("div");
        container.classList.add(`${particleClass}-container`);

        document.querySelector(containerSelector).appendChild(container);

        for (let i = 0; i < numParticles; i++) {
            let particle = document.createElement("div");
            particle.classList.add(particleClass);

            // Positionnement aléatoire
            particle.style.left = Math.random() * 100 + "%";
            particle.style.top = Math.random() * 100 + "%";

            // Taille aléatoire
            let size = Math.random() * (sizeRange[1] - sizeRange[0]) + sizeRange[0] + "px";
            particle.style.width = size;
            particle.style.height = size;

            // Animation aléatoire
            particle.style.animationDuration = Math.random() * (animationDurationRange[1] - animationDurationRange[0]) + animationDurationRange[0] + "s";

            container.appendChild(particle);
        }
    }

    // Création des particules pour différents contextes
    createParticles(".projects", "particle-valorant", 30, [4, 10], [1, 2]);  // Projet Valorant
    createParticles("#skills", "nen-particle", 50, [4, 10], [2, 3]);         // Projet HxH
});

// =========================================
// * Bouton Projet
// =========================================
document.addEventListener("DOMContentLoaded", function () {
  let slideIndex = 0;
  const slides = document.querySelectorAll(".slide");
  const dotsContainer = document.querySelector(".slider-pagination");
  const prevButton = document.querySelector(".prev");
  const nextButton = document.querySelector(".next");

  // Création dynamique des dots
  slides.forEach((_, index) => {
    const dot = document.createElement("div");
    dot.classList.add("dot");
    dot.addEventListener("click", () => showSlide(index));
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll(".dot");

  function showSlide(index) {
    slides.forEach((slide, i) => {
      if (i === index) {
        slide.classList.add("active");
        slide.style.opacity = "1";
        slide.style.visibility = "visible";
        slide.style.transform = "translateX(0)";
      } else {
        slide.classList.remove("active");
        slide.style.opacity = "0";
        slide.style.visibility = "hidden";
        slide.style.transform = "translateX(50px)";
      }

      // Mise à jour des dots
      dots[i].classList.toggle("active", i === index);
    });

    slideIndex = index;
  }

  function moveSlide(step) {
    slideIndex += step;
    if (slideIndex >= slides.length) slideIndex = 0;
    if (slideIndex < 0) slideIndex = slides.length - 1;
    showSlide(slideIndex);
  }

  // Ajout des événements sur les boutons
  prevButton.addEventListener("click", () => moveSlide(-1));
  nextButton.addEventListener("click", () => moveSlide(1));

  // Initialisation au chargement
  showSlide(slideIndex);
});

// =========================================
// * Curseur
// =========================================
document.addEventListener("DOMContentLoaded", function () {
    const body = document.body;
    let particles = [];

    function createParticle(x, y) {
        const particle = document.createElement("div");
        particle.classList.add("mouse-particle");
        body.appendChild(particle);

        const size = Math.random() * 8 + 5; // Taille aléatoire entre 5px et 13px
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.backgroundColor = `hsla(${Math.random() * 360}, 100%, 60%, 0.8)`;

        const duration = Math.random() * 0.5 + 0.5; // Animation entre 0.5s et 1s
        particle.style.animation = `particleFollow ${duration}s linear forwards`;

        // Suppression de la particule après animation
        setTimeout(() => {
            particle.remove();
            particles.shift(); // Nettoyage du tableau
        }, duration * 1000);
    }

    document.addEventListener("mousemove", (event) => {
        createParticle(event.clientX, event.clientY);
    });
});

// =========================================
// * Bouton 
// =========================================
document.addEventListener('DOMContentLoaded', function() {
  const btn1 = document.getElementById('btn-1');
  const btn2 = document.getElementById('btn-2');
  const btn3 = document.getElementById('btn-3');
  const contentDiv = document.getElementById('bts-content');
  const contentClassique = `
    <p>
      Le <strong>BTS SIO option SISR</strong> (Solutions d'Infrastructure, Systèmes et Réseaux) a constitué le socle technique de mon parcours, me permettant d'acquérir une rigueur opérationnelle en administration de services et sécurisation des infrastructures.
    </p>

    <h3>🎯 Objectifs de la Formation</h3>
    <ul>
      <li><strong>Expertise Technique :</strong> Maîtrise des couches réseau et des environnements systèmes complexes.</li>
      <li><strong>Ingénierie d'Infrastructure :</strong> Capacité à déployer, administrer et optimiser des parcs IT.</li>
      <li><strong>Gestion de Projets :</strong> Collaboration en mode projet sur des déploiements d'infrastructures réelles.</li>
      <li><strong>Sécurité by Design :</strong> Développement d'une approche nativement sécurisée et optimisée des systèmes.</li>
    </ul>

    <h3>📚 Domaines d'Enseignement Spécialisés</h3>
    <table class="bts-table">
      <thead>
        <tr>
          <th>Pôle Infrastructures</th>
          <th>Pôle Gouvernance & Méthodes</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>🖥️ <strong>Systèmes & Réseaux :</strong> Administration Windows Server, Distributions Linux, Équipements Cisco.</td>
          <td>🛡️ <strong>Cybersécurité :</strong> Fondamentaux de la sécurité informatique et durcissement.</td>
        </tr>
        <tr>
          <td>💻 <strong>Développement & Data :</strong> Automatisation (Python), SQL, intégration Web (HTML/JS/PHP).</td>
          <td>📊 <strong>Gestion de Projet :</strong> Pilotage via méthodologies Agiles et framework Scrum.</td>
        </tr>
        <tr>
          <td>📡 <strong>Protocoles :</strong> Configuration avancée et segmentation réseau.</td>
          <td>🌍 <strong>Communication :</strong> Anglais technique et communication professionnelle en milieu IT.</td>
        </tr>
      </tbody>
    </table>

    <p>
      Durant mon cursus SISR, j'ai consolidé des compétences critiques en <strong>administration de serveurs</strong>, <strong>gestion de la sécurité périmétrique</strong> et <strong>maintien en condition opérationnelle (MCO)</strong> via le support technique spécialisé. 
      Mes immersions professionnelles en entreprise ont été l'occasion d'éprouver ces connaissances sur des infrastructures critiques.
    </p>
  `;

  const contentBachelor = `
    <p>
      Le <strong>Bachelor Cybersécurité & Ethical Hacking</strong> à l'EFREI Bordeaux m'a permis de passer d'un profil administrateur à celui d'analyste en sécurité, avec une forte orientation <strong>sécurité offensive</strong> et <strong>protection des actifs critiques</strong>.
    </p>
    
    <h3>🔍 Expertise "Ethical Hacking" & Technique</h3>
    <ul>
      <li>🔹 <strong>Tests d'intrusion (Pentesting) :</strong> Audit de vulnérabilités, exploitation de failles et rédaction de rapports de remédiation.</li>
      <li>🔹 <strong>Hardening & Protection :</strong> Mise en œuvre de stratégies de défense des données et durcissement des systèmes d'exploitation.</li>
      <li>🔹 <strong>Sécurité Logicielle :</strong> Analyse des vecteurs d'attaque applicatifs et sécurisation du cycle de développement.</li>
      <li>🔹 <strong>Audit de Configuration :</strong> Vérification de la conformité des infrastructures réseaux et solutions Cloud.</li>
    </ul>

    <h3>🛡️ Cœur du Programme Technologique</h3>
    <table class="bts-table">
      <thead>
        <tr>
          <th>Domaine</th>
          <th>Compétences Clés</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Systèmes & Cloud</strong></td>
          <td>Virtualisation avancée, durcissement OS, solutions Cloud sécurisées.</td>
        </tr>
        <tr>
          <td><strong>Infrastructures</strong></td>
          <td>Architecture réseau sécurisée et gestion de projets systèmes complexes.</td>
        </tr>
        <tr>
          <td><strong>Stratégie Cyber</strong></td>
          <td>Protection des données, conformité RNCP Niv. 6 et gouvernance.</td>
        </tr>
      </tbody>
    </table>

    <h3>🎯 Objectifs de Spécialisation</h3>
    <ul>
      <li><strong>Anticiper :</strong> Identifier les menaces cybercriminelles émergentes.</li>
      <li><strong>Sécuriser :</strong> Maîtriser l'arsenal technique pour renforcer la résilience des organisations.</li>
      <li><strong>Éthique :</strong> Appliquer une démarche de "Hacker Éthique" dans un cadre légal et professionnel.</li>
    </ul>

<p>
      Diplômé en tant qu'<strong>>Administrateur systèmes, réseaux et cybersécurité (Titre RNCP Niveau 6)</strong>, cette année a consolidé ma capacité à intervenir sur des architectures d'entreprise tout en garantissant un niveau de sécurité maximal.
    </p>
    <p>Lien vers le titre RNCP: <a href="https://www.francecompetences.fr/recherche/rncp/39611/" target="_blank" style="color: inherit; text-decoration: underline;">RNCP39611</a></p>
  `;

const contentMaster = `
    <p>
      Actuellement en <strong>Master Informatique parcours Conception de Systèmes et Cybersécurité</strong> à l'UPEC, je me spécialise dans l'intégration de la sécurité sur l'ensemble du cycle de vie logiciel et des infrastructures connectées.
    </p>

    <h3>🔍 Expertise en Ingénierie & Cybersécurité</h3>
    <ul>
      <li>🔹 <strong>Conception Sécurisée :</strong> Élaboration d'architectures logicielles et systèmes nativement protégées (Security by Design).</li>
      <li>🔹 <strong>Sécurité IoT & Embarquée :</strong> Analyse et sécurisation des protocoles dédiés à l'Internet des Objets et aux systèmes communicants.</li>
      <li>🔹 <strong>Audit & Remédiation :</strong> Identification des cybermenaces, analyse de vulnérabilités et mise en œuvre de solutions correctives.</li>
      <li>🔹 <strong>Développement Avancé :</strong> Maîtrise des paradigmes de programmation sécurisée pour les applications Cloud et traditionnelles.</li>
    </ul>

    <h3>🛡️ Compétences Métiers Visées</h3>
    <table class="bts-table">
      <thead>
        <tr>
          <th>Axe Opérationnel</th>
          <th>Expertise Technique</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Ingénierie Cyber</strong></td>
          <td>Architecture logicielle, Pentesting et audit de sécurité applicative.</td>
        </tr>
        <tr>
          <td><strong>Gestion de Projet</strong></td>
          <td>Rédaction de cahiers des charges sécurisés et déploiement de solutions.</td>
        </tr>
        <tr>
          <td><strong>Innovation IoT</strong></td>
          <td>Conception de systèmes embarqués sécurisés et architectures Cloud.</td>
        </tr>
      </tbody>
    </table>

    <h3>🎯 Objectifs de mon Alternance</h3>
    <ul>
      <li><strong>Analyser :</strong> Évaluer les opportunités et la faisabilité technologique des projets complexes.</li>
      <li><strong>Intégrer :</strong> Déployer des solutions de sécurité dès la phase de conception du logiciel.</li>
      <li><strong>Optimiser :</strong> Réaliser des audits critiques sur des infrastructures existantes pour en durcir la résilience.</li>
    </ul>

    <p>
      Ce cursus au sein de l'<strong>UFR de Sciences et Technologie</strong> me prépare à devenir un acteur clé de la défense des SI, capable de piloter des projets d'envergure en tant qu'Ingénieur Expert en Cybersécurité.
    </p>
  `;

  // Function to update content and active button
  function setActiveContent(content, activeButton) {
    contentDiv.innerHTML = content;
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    activeButton.classList.add('active');
  }

  // Listeners for mode buttons
  btn1.addEventListener('click', function() {
    setActiveContent(contentClassique, btn1);
  });

  btn2.addEventListener('click', function() {
    setActiveContent(contentBachelor, btn2);
  });

  btn3.addEventListener('click', function() {
    setActiveContent(contentMaster, btn3);
  });
});



/**
 * ============================================================
 *  GitHubExplorer — Explorateur de repo GitHub vanilla JS
 *  Portfolio Edition — Mehdi EL MENSI
 * ============================================================
 *
 *  USAGE :
 *    const explorer = new GitHubExplorer('#mon-conteneur', {
 *      repos: ['user/repo1', 'user/repo2'],
 *      defaultRepo: 'user/repo1',  // (optionnel)
 *      token: 'ghp_...'            // (optionnel, augmente le rate limit)
 *    });
 *    explorer.init();
 * ============================================================
 */
 
class GitHubExplorer {

  //  Icônes par extension / type de fichier
  static FILE_ICONS = {
    // Langages
    js   : '🟨', ts   : '🔷', py   : '🐍', java : '☕',
    php  : '🐘', rb   : '💎', go   : '🔵', rs   : '🦀',
    cs   : '🔷', cpp  : '⚙️',  c    : '⚙️',  sh   : '🐚',
    ps1  : '💙', bat  : '🖥️',
    // Web
    html : '🌐', css  : '🎨', scss : '🎨', sass : '🎨',
    vue  : '💚', jsx  : '⚛️',  tsx  : '⚛️',
    // Data / Config
    json : '📦', yaml : '⚙️',  yml  : '⚙️',  toml : '⚙️',
    xml  : '📋', csv  : '📊', sql  : '🗃️',
    env  : '🔑', lock : '🔒',
    // Docs
    md   : '📝', txt  : '📄', pdf  : '📕', doc  : '📘',
    docx : '📘', xls  : '📗', xlsx : '📗', ppt  : '📙',
    // Media
    png  : '🖼️',  jpg  : '🖼️',  jpeg : '🖼️',  gif  : '🖼️',
    svg  : '✏️',  ico  : '🔸', mp4  : '🎬', mp3  : '🎵',
    // Divers
    zip  : '📦', tar  : '📦', gz   : '📦',
    log  : '📋', pem  : '🔐', crt  : '🔐',
  };
 
  static FOLDER_ICON = '📁';
  static DEFAULT_FILE_ICON = '📄';

  //  Constructeur

  constructor(selector, options = {}) {
    this.root = typeof selector === 'string'
      ? document.querySelector(selector)
      : selector;
 
    if (!this.root) throw new Error(`GitHubExplorer: conteneur "${selector}" introuvable.`);
 
    this.repos       = options.repos || [];
    this.token       = options.token || null;
    this.activeRepo  = options.defaultRepo || this.repos[0] || null;
 
    // Etat de navigation : pile d'historique { path, url }
    this._navStack   = [];      // historique des dossiers
    this._currentItems = [];    // items du dossier courant
    this._selectedFile = null;  // fichier actuellement sélectionné
 
    // Cache des données pour éviter des requêtes inutiles
    this._cache = {};
  }

  //  Point d'entrée

  init() {
    this._buildShell();
    if (this.activeRepo) this._switchRepo(this.activeRepo);
  }

  //  Rendu du squelette HTML

  _buildShell() {
    this.root.innerHTML = '';
    this.root.classList.add('gh-explorer-wrapper');
 
    /* ---- Onglets ---- */
    const tabsEl = document.createElement('div');
    tabsEl.className = 'gh-repo-tabs';
 
    this.repos.forEach(repo => {
      const tab = document.createElement('button');
      tab.className  = 'gh-repo-tab' + (repo === this.activeRepo ? ' active' : '');
      tab.dataset.repo = repo;
      const [, name] = repo.split('/');
      tab.innerHTML  = `<span class="tab-dot"></span>${name}`;
      tab.addEventListener('click', () => this._switchRepo(repo));
      tabsEl.appendChild(tab);
    });
 
    /* ---- Panneau principal ---- */
    const panel = document.createElement('div');
    panel.className = 'gh-panel';
 
    // Barre de titre
    panel.appendChild(this._buildTitlebar());
 
    // Sidebar
    this._sidebarEl = document.createElement('div');
    this._sidebarEl.className = 'gh-sidebar';
    this._sidebarEl.innerHTML = `
      <div class="gh-sidebar-header">
        EXPLORATEUR <span>⬡</span>
      </div>
      <div class="gh-file-tree" id="gh-tree"></div>
    `;
    panel.appendChild(this._sidebarEl);
 
    // Zone de contenu
    this._contentEl = document.createElement('div');
    this._contentEl.className = 'gh-content';
    this._contentEl.innerHTML = `
      <div class="gh-content-header">
        <span class="open-file-icon">📂</span>
        <button class="gh-content-tab active" data-view="readme">README</button>
        <button class="gh-content-tab"        data-view="info">Infos repo</button>
      </div>
      <div id="gh-readme" class="gh-readme-zone">
        <div class="gh-readme-placeholder">
          <span class="ph-icon">📂</span>
          Sélectionne un dépôt pour commencer
        </div>
      </div>
      <div id="gh-info" class="gh-info-zone" style="display:none;"></div>
    `;
    panel.appendChild(this._contentEl);
 
    // Références DOM utiles
    this._treeEl   = panel.querySelector('#gh-tree');
    this._readmeEl = panel.querySelector('#gh-readme');
    this._infoEl   = panel.querySelector('#gh-info');
 
    // Onglets README / Infos
    panel.querySelectorAll('.gh-content-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        panel.querySelectorAll('.gh-content-tab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const view = btn.dataset.view;
        this._readmeEl.style.display = view === 'readme' ? '' : 'none';
        this._infoEl.style.display   = view === 'info'   ? '' : 'none';
      });
    });
 
    this.root.appendChild(tabsEl);
    this.root.appendChild(panel);
 
    this._tabsEl   = tabsEl;
    this._panelEl  = panel;
  }
 
  _buildTitlebar() {
    const bar = document.createElement('div');
    bar.className = 'gh-titlebar';
    bar.innerHTML = `
      <div class="gh-titlebar-left">
        <div class="gh-titlebar-dots">
          <span class="gh-titlebar-dot red"></span>
          <span class="gh-titlebar-dot yellow"></span>
          <span class="gh-titlebar-dot green"></span>
        </div>
        <span class="gh-repo-name" id="gh-repo-label">—</span>
      </div>
      <div class="gh-repo-meta" id="gh-meta"></div>
    `;
    this._titlebarEl = bar;
    return bar;
  }

  //  Changement de repo actif

  async _switchRepo(repo) {
    this.activeRepo = repo;
    this._navStack  = [];
 
    // Màj onglets
    this._tabsEl.querySelectorAll('.gh-repo-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.repo === repo);
    });
 
    // Màj label barre titre
    this._panelEl.querySelector('#gh-repo-label').textContent = repo;
 
    // Réinitialisation UI
    this._treeEl.innerHTML   = this._loader();
    this._readmeEl.innerHTML = this._loader();
    this._infoEl.innerHTML   = '';
    this._panelEl.querySelector('#gh-meta').innerHTML = '';
 
    // Chargements parallèles
    await Promise.all([
      this._loadDirectory(repo, '', null),
      this._loadReadme(repo),
      this._loadRepoInfo(repo),
    ]);
  }

  //  Chargement d'un dossier

  async _loadDirectory(repo, path, parentUrl) {
    const cacheKey = `${repo}:${path}`;
    let items;
 
    if (this._cache[cacheKey]) {
      items = this._cache[cacheKey];
    } else {
      const url = path
        ? `https://api.github.com/repos/${repo}/contents/${path}`
        : `https://api.github.com/repos/${repo}/contents`;
      try {
        const data = await this._fetch(url);
        if (!Array.isArray(data)) throw new Error('Réponse inattendue de l\'API GitHub');
        items = data;
        this._cache[cacheKey] = items;
      } catch (err) {
        this._treeEl.innerHTML = this._errorHtml(err.message);
        return;
      }
    }
 
    // Tri : dossiers d'abord, puis fichiers (alpha dans chaque groupe)
    items.sort((a, b) => {
      if (a.type !== b.type) return a.type === 'dir' ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
 
    this._currentItems = items;
    this._renderTree(items, path, parentUrl);
  }
 
  //  Rendu de l'arborescence

  _renderTree(items, currentPath, parentUrl) {
    const tree = this._treeEl;
    tree.innerHTML = '';
 
    // Breadcrumb
    if (currentPath) {
      tree.appendChild(this._buildBreadcrumb(currentPath));
 
      // Bouton retour
      const backBtn = document.createElement('button');
      backBtn.className = 'gh-back-btn';
      backBtn.innerHTML = '⬅️ Retour';
      backBtn.addEventListener('click', () => {
        const prev = this._navStack.pop();
        if (prev) {
          this._loadDirectory(this.activeRepo, prev.path, prev.parentUrl);
        } else {
          this._loadDirectory(this.activeRepo, '', null);
        }
      });
      tree.appendChild(backBtn);
    }
 
    // Items
    items.forEach(item => {
      const el = document.createElement('div');
      const isDir = item.type === 'dir';
 
      el.className   = `gh-tree-item ${isDir ? 'gh-folder' : 'gh-file'}`;
      el.title       = item.name;
 
      const icon = isDir
        ? GitHubExplorer.FOLDER_ICON
        : this._getFileIcon(item.name);
 
      el.innerHTML = `
        <span class="gh-item-icon">${icon}</span>
        <span class="gh-item-name">${item.name}</span>
      `;
 
      if (isDir) {
        el.addEventListener('click', () => {
          this._navStack.push({ path: currentPath, parentUrl });
          this._loadDirectory(this.activeRepo, item.path, item.url);
        });
      } else {
        el.addEventListener('click', () => {
          // Déselectionner tous, sélectionner celui-ci
          tree.querySelectorAll('.gh-tree-item').forEach(e => e.classList.remove('selected'));
          el.classList.add('selected');
          this._selectedFile = item;
          this._showFilePreview(item);
        });
      }
 
      tree.appendChild(el);
    });
 
    if (items.length === 0) {
      tree.innerHTML += '<div class="gh-readme-placeholder" style="height:80px;font-size:11px;">Dossier vide</div>';
    }
  }

  //  Breadcrumb

  _buildBreadcrumb(path) {
    const bc  = document.createElement('div');
    bc.className = 'gh-breadcrumb';
 
    // Racine
    const root = document.createElement('span');
    root.className = 'gh-breadcrumb-item';
    root.textContent = this.activeRepo.split('/')[1];
    root.addEventListener('click', () => {
      this._navStack = [];
      this._loadDirectory(this.activeRepo, '', null);
    });
    bc.appendChild(root);
 
    // Segments
    const parts = path.split('/');
    parts.forEach((part, i) => {
      const sep = document.createElement('span');
      sep.className = 'gh-breadcrumb-sep';
      sep.textContent = '/';
      bc.appendChild(sep);
 
      const isLast = i === parts.length - 1;
      const seg = document.createElement('span');
      seg.className = isLast ? 'gh-breadcrumb-current' : 'gh-breadcrumb-item';
      seg.textContent = part;
 
      if (!isLast) {
        const targetPath = parts.slice(0, i + 1).join('/');
        seg.addEventListener('click', () => {
          // Reconstruire la pile jusqu'à ce segment
          this._navStack = this._navStack.slice(0, i + 1);
          this._loadDirectory(this.activeRepo, targetPath, null);
        });
      }
 
      bc.appendChild(seg);
    });
 
    return bc;
  }
 
  //  Aperçu d'un fichier (dans zone README)

  async _showFilePreview(item) {
    this._readmeEl.style.display = '';
    this._infoEl.style.display   = 'none';
    this._panelEl.querySelectorAll('.gh-content-tab').forEach(b => {
      b.classList.toggle('active', b.dataset.view === 'readme');
    });
 
    this._readmeEl.innerHTML = this._loader();
 
    const ext = item.name.split('.').pop().toLowerCase();
    const textExts = [
      'md','txt','js','ts','py','php','html','css','scss','json',
      'yaml','yml','toml','xml','sh','bat','ps1','sql','rb','go',
      'rs','c','cpp','cs','java','env','gitignore','conf','cfg','ini'
    ];
    const imageExts = ['png','jpg','jpeg','gif','svg','webp','ico'];
 
    if (imageExts.includes(ext)) {
      this._readmeEl.innerHTML = `
        <div style="text-align:center;padding:20px;">
          <p style="font-size:11px;color:var(--text-muted);margin-bottom:12px;">${item.name}</p>
          <img src="${item.download_url}" alt="${item.name}"
               style="max-width:100%;max-height:400px;border-radius:8px;border:1px solid rgba(255,255,255,0.07);">
          <br>
          <a href="${item.html_url}" target="_blank" class="gh-external-link" style="margin-top:14px;">
            🔗 Voir sur GitHub
          </a>
        </div>`;
      return;
    }
 
    if (textExts.includes(ext) && item.download_url) {
      try {
        const text = await this._fetchRaw(item.download_url);
        if (ext === 'md') {
          this._readmeEl.innerHTML = this._parseMarkdown(text);
        } else {
          this._readmeEl.innerHTML = `
            <p style="font-size:11px;color:var(--text-muted);margin-bottom:8px;">${item.path}</p>
            <pre><code>${this._escapeHtml(text)}</code></pre>
            <a href="${item.html_url}" target="_blank" class="gh-external-link">🔗 Voir sur GitHub</a>`;
        }
      } catch {
        this._readmeEl.innerHTML = `
          <div class="gh-readme-placeholder">
            <span class="ph-icon">⚠️</span>
            Impossible de charger le fichier.
            <a href="${item.html_url}" target="_blank" class="gh-external-link" style="margin-top:8px;">🔗 Voir sur GitHub</a>
          </div>`;
      }
    } else {
      this._readmeEl.innerHTML = `
        <div class="gh-readme-placeholder">
          <span class="ph-icon">${this._getFileIcon(item.name)}</span>
          <span style="font-size:12px;">${item.name}</span>
          <a href="${item.html_url}" target="_blank" class="gh-external-link" style="margin-top:10px;">🔗 Ouvrir sur GitHub</a>
        </div>`;
    }
  }
 
  //  Chargement du README

  async _loadReadme(repo) {
    this._readmeEl.innerHTML = this._loader();
    const url = `https://api.github.com/repos/${repo}/readme`;
 
    try {
      const data = await this._fetch(url);
      const raw  = await this._fetchRaw(data.download_url);
      this._readmeEl.innerHTML = this._parseMarkdown(raw);
    } catch {
      this._readmeEl.innerHTML = `
        <div class="gh-readme-placeholder">
          <span class="ph-icon">📭</span>
          Aucun README disponible pour ce dépôt.
        </div>`;
    }
  }
 
  //  Chargement des infos du repo

  async _loadRepoInfo(repo) {
    try {
      const [info, commits] = await Promise.all([
        this._fetch(`https://api.github.com/repos/${repo}`),
        this._fetch(`https://api.github.com/repos/${repo}/commits?per_page=5`).catch(() => [])
      ]);
 
      // Barre de titre — métadonnées
      const meta = this._panelEl.querySelector('#gh-meta');
      meta.innerHTML = `
        <span class="gh-meta-item stars">⭐ ${info.stargazers_count}</span>
        ${info.language ? `<span class="gh-meta-item lang">◉ ${info.language}</span>` : ''}
        <span class="gh-meta-item commit">↻ ${this._relativeTime(info.pushed_at)}</span>
      `;
 
      // Panel info
      const lang  = info.language || '—';
      const since = this._relativeTime(info.created_at);
      const updated = this._relativeTime(info.pushed_at);
 
      let commitsHtml = '';
      if (Array.isArray(commits) && commits.length) {
        commitsHtml = commits.map(c => `
          <div class="gh-commit-item">
            <span class="gh-commit-sha">${c.sha.slice(0, 7)}</span>
            <span class="gh-commit-msg">${this._escapeHtml(c.commit.message.split('\n')[0])}</span>
            <span class="gh-commit-date">${this._relativeTime(c.commit.author.date)}</span>
          </div>`).join('');
      }
 
      this._infoEl.innerHTML = `
        <div class="gh-info-title">${info.full_name}</div>
        <div class="gh-info-desc">${info.description ? this._escapeHtml(info.description) : '<em style="color:var(--text-muted)">Aucune description</em>'}</div>
 
        <div class="gh-info-stats">
          <span class="gh-stat-badge stars">⭐ ${info.stargazers_count} stars</span>
          <span class="gh-stat-badge forks">🍴 ${info.forks_count} forks</span>
          ${info.language ? `<span class="gh-stat-badge lang">◉ ${lang}</span>` : ''}
          <span class="gh-stat-badge issues">⚠ ${info.open_issues_count} issues</span>
        </div>
 
        <div class="gh-info-section-title">INFORMATIONS</div>
        <div style="font-size:12px;color:var(--text-secondary);display:flex;flex-direction:column;gap:5px;font-family:var(--font-body,'Poppins',sans-serif);">
          <span>📅 Créé : <strong style="color:var(--text-primary)">${since}</strong></span>
          <span>🔄 Mis à jour : <strong style="color:var(--text-primary)">${updated}</strong></span>
          <span>🌿 Branche par défaut : <strong style="color:var(--text-primary)">${info.default_branch}</strong></span>
          ${info.license ? `<span>📜 Licence : <strong style="color:var(--text-primary)">${info.license.spdx_id}</strong></span>` : ''}
          <span>📦 Taille : <strong style="color:var(--text-primary)">${this._formatSize(info.size)}</strong></span>
        </div>
 
        ${commitsHtml ? `
          <div class="gh-info-section-title">COMMITS RÉCENTS</div>
          <div class="gh-recent-commits">${commitsHtml}</div>` : ''}
 
        <div style="margin-top:18px;">
          <a href="${info.html_url}" target="_blank" class="gh-external-link">🔗 Ouvrir sur GitHub</a>
        </div>
      `;
    } catch (err) {
      this._infoEl.innerHTML = this._errorHtml(err.message);
    }
  }
 
  //  Fetch avec headers (optionnel token)
  async _fetch(url) {
    const headers = { 'Accept': 'application/vnd.github.v3+json' };
    if (this.token) headers['Authorization'] = `token ${this.token}`;
 
    const res = await fetch(url, { headers });
    if (!res.ok) {
      if (res.status === 403) throw new Error('Rate limit GitHub atteint. Réessaie dans quelques minutes.');
      if (res.status === 404) throw new Error('Ressource introuvable (404). Dépôt privé ou inexistant ?');
      throw new Error(`Erreur API GitHub : ${res.status}`);
    }
    return res.json();
  }
 
  async _fetchRaw(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Erreur lors du chargement (${res.status})`);
    return res.text();
  }

  //  Icône selon extension
  _getFileIcon(filename) {
    const parts = filename.split('.');
    if (parts.length < 2) return GitHubExplorer.DEFAULT_FILE_ICON;
    const ext = parts.pop().toLowerCase();
    return GitHubExplorer.FILE_ICONS[ext] || GitHubExplorer.DEFAULT_FILE_ICON;
  }
  //  Parser Markdown ultra-léger (sans dépendance)
  _parseMarkdown(md) {
    let html = md
      // Escaper les caractères HTML
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
 
      // Blocs de code multi-lignes
      .replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) =>
        `<pre><code class="lang-${lang}">${code.trim()}</code></pre>`)
 
      // Titres
      .replace(/^######\s(.+)$/gm, '<h6>$1</h6>')
      .replace(/^#####\s(.+)$/gm, '<h5>$1</h5>')
      .replace(/^####\s(.+)$/gm, '<h4>$1</h4>')
      .replace(/^###\s(.+)$/gm, '<h3>$1</h3>')
      .replace(/^##\s(.+)$/gm, '<h2>$1</h2>')
      .replace(/^#\s(.+)$/gm, '<h1>$1</h1>')
 
      // Ligne horizontale
      .replace(/^[-*_]{3,}$/gm, '<hr style="border-color:rgba(255,255,255,0.1);margin:14px 0;">')
 
      // Blockquote
      .replace(/^>\s(.+)$/gm, '<blockquote>$1</blockquote>')
 
      // Listes à puces
      .replace(/^\s*[-*+]\s(.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>\n?)+/g, m => `<ul>${m}</ul>`)
 
      // Listes numérotées
      .replace(/^\s*\d+\.\s(.+)$/gm, '<li>$1</li>')
 
      // Gras + italique
      .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/__(.+?)__/g, '<strong>$1</strong>')
      .replace(/_(.+?)_/g, '<em>$1</em>')
 
      // Barré
      .replace(/~~(.+?)~~/g, '<del>$1</del>')
 
      // Code inline
      .replace(/`([^`]+)`/g, '<code>$1</code>')
 
      // Images
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g,
        '<img src="$2" alt="$1" loading="lazy">')
 
      // Liens
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener">$1</a>')
 
      // Retours à la ligne → paragraphes
      .replace(/\n\n+/g, '</p><p>')
 
    return `<p>${html}</p>`
      // Nettoyage : éviter <p> autour des blocs
      .replace(/<p>(<h[1-6]>)/g, '$1')
      .replace(/(<\/h[1-6]>)<\/p>/g, '$1')
      .replace(/<p>(<ul>)/g, '$1')
      .replace(/(<\/ul>)<\/p>/g, '$1')
      .replace(/<p>(<pre>)/g, '$1')
      .replace(/(<\/pre>)<\/p>/g, '$1')
      .replace(/<p>(<blockquote>)/g, '$1')
      .replace(/(<\/blockquote>)<\/p>/g, '$1')
      .replace(/<p>(<hr[^>]*>)<\/p>/g, '$1')
      .replace(/<p><\/p>/g, '');
  }
 
  //  Utilitaires
  _relativeTime(dateStr) {
    if (!dateStr) return '—';
    const diff = Date.now() - new Date(dateStr).getTime();
    const s = Math.floor(diff / 1000);
    if (s < 60)   return 'à l\'instant';
    const m = Math.floor(s / 60);
    if (m < 60)   return `il y a ${m} min`;
    const h = Math.floor(m / 60);
    if (h < 24)   return `il y a ${h} h`;
    const d = Math.floor(h / 24);
    if (d < 30)   return `il y a ${d} j`;
    const mo = Math.floor(d / 30);
    if (mo < 12)  return `il y a ${mo} mois`;
    return `il y a ${Math.floor(mo / 12)} an(s)`;
  }
 
  _formatSize(kb) {
    if (kb < 1024) return `${kb} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  }
 
  _escapeHtml(str = '') {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
 
  _loader() {
    return `<div class="gh-loader">
      <div class="gh-spinner"></div>
      Chargement…
    </div>`;
  }
 
  _errorHtml(msg) {
    return `<div class="gh-error">
      <span class="gh-error-icon">⚠️</span>
      <div>
        <strong>Impossible de charger les données</strong><br>
        <span style="font-size:11px;opacity:0.8;">${this._escapeHtml(msg)}</span>
      </div>
    </div>`;
  }
}
 
/* ============================================================
   AUTO-INIT : intégration déclarative via data-attributes
   <div data-gh-explorer data-repos="user/repo1,user/repo2"></div>
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-gh-explorer]').forEach(el => {
    const repos = (el.dataset.repos || '').split(',').map(r => r.trim()).filter(Boolean);
    if (!repos.length) return;
    const explorer = new GitHubExplorer(el, {
      repos,
      defaultRepo: repos[0],
      token: el.dataset.token || null,
    });
    explorer.init();
  });
});