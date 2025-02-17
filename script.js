// =========================================
//
// 🔥 SCRIPT PRINCIPAL D'ANIMATION ET INTERACTIONS
//
// =========================================


// =========================================
// 🚀 Chargement 
// =========================================
document.addEventListener("DOMContentLoaded", function () {
  const loader = document.querySelector(".loader-wrapper");

  // Ajoute la classe pour l'effet d'apparition
  setTimeout(() => {
      loader.classList.add("show");
  }, 100);

  function hideLoader() {
      loader.classList.add("hidden");
      document.body.style.overflow = "auto"; 

      setTimeout(() => {
          loader.remove();
      }, 1000); // Correspond au temps de l'animation CSS
  }

  // Simulation d'un chargement de 2 secondes
  setTimeout(() => {
      hideLoader();
  }, 1500);
});

  
// =========================================
// 🔤 Lettres runes
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

  const maxParticles = 50; // Limite stricte du nombre de particules
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
    const skillBars = document.querySelectorAll(".skill-fill");

    // Fonction pour charger les barres de progression lors du scroll
    function checkScroll() {
        skillBars.forEach((bar) => {
            const rect = bar.getBoundingClientRect();
            if (rect.top < window.innerHeight - 50) {
                const skillLevel = bar.getAttribute("data-skill");
                bar.style.width = skillLevel + "%";
            }
        });
    }

    window.addEventListener("scroll", checkScroll);
    checkScroll(); // Vérifier au chargement

    // Gestion des particules Nen
    let particleTimeout;

    document.addEventListener("mousemove", (e) => {
        if (particleTimeout) return;

        const particle = document.createElement("div");
        particle.className = "nen-particle";
        document.body.appendChild(particle);

        // Position des particules
        particle.style.left = `${e.clientX}px`;
        particle.style.top = `${e.clientY}px`;

        // Supprimer après animation
        setTimeout(() => {
            particle.remove();
        }, 800);

        // Limiter la fréquence des particules
        particleTimeout = setTimeout(() => {
            particleTimeout = null;
        }, 100);
    });

    // Ajout de l'effet de flip au clic sur les cartes
    const skillCards = document.querySelectorAll(".skill-card-container");

    skillCards.forEach((card) => {
        card.addEventListener("click", function () {
            const skillCard = this.querySelector(".skill-card");
            skillCard.classList.toggle("flipped");
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
// * Bouton info sidebar
// =========================================
document.addEventListener("DOMContentLoaded", function () {
  const profileName = document.getElementById("profile-name");

  profileName.addEventListener("click", function () {
        // Créer une boîte de dialogue personnalisée
        const modal = document.createElement("div");
        modal.classList.add("profile-modal");
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h2>Mehdi El MENSI</h2>
                <p><strong>Formation :</strong> BTS SIO - SISR</p>
                <p><strong>Email :</strong> mehdi.elmensi.pro@gmail.com</p>
                <p><strong>Compétences :</strong> Réseaux, Sécurité, Développement</p>
                <button id="download-cv">📄 Télécharger CV</button>
            </div>
        `;

        document.body.appendChild(modal);

        // Gérer la fermeture de la boîte de dialogue
        document.querySelector(".close-modal").addEventListener("click", function () {
            modal.remove();
        });

        // Télécharger le CV au clic
        document.getElementById("download-cv").addEventListener("click", function () {
            window.open("https://drive.google.com/file/d/1mCH4F_32gosdeWtPYyvaDiibQk-hniSu/view?usp=sharing", "_blank");
        });

        // Fermer la boîte si l'utilisateur clique en dehors du contenu
        modal.addEventListener("click", function (event) {
            if (event.target === modal) {
                modal.remove();
            }
        });
    });
});

// =========================================
// * Mini jeu
// =========================================
document.addEventListener("DOMContentLoaded", function () {
  /* ========= VARIABLES GLOBALES ========= */
  const profileImage = document.getElementById("profile-image");
  const virusGame = document.getElementById("virus-game");
  const gameArea = document.getElementById("game-area");
  const restartGame = document.getElementById("restart-game");
  const quitGame = document.getElementById("quit-game");

  let gameMessage, timerDisplay;
  let gameActive = false;
  let timeLeft;
  let viruses = [];
  let countdown;
  let gameInterval;
  let mousePos = { x: 0, y: 0 };

  // Mode infini
  let currentMode = "";
  let infiniteSpawnInterval, infiniteMovementInterval, infiniteDifficultyInterval;
  let infiniteCoinSpawnInterval, infiniteCoinCheckInterval;
  let coins = [];
  let infiniteTime = 0;
  let infiniteDifficulty = 5;
  let difficultyMultiplier = 2;

  // Pour éviter des fins multiples
  let gameEnded = false;

  const difficulties = {
    facile: { count: 12, speed: 9, time: 6 },
    moyen: { count: 14, speed: 11, time: 5 },
    difficile: { count: 16, speed: 20, time: 4 },
    personnaliser: { count: 16, speed: 13, time: 4 }
  };

  virusGame.style.display = "none";

  /* ========= GESTION DE LA SOURIS ========= */
  document.addEventListener("mousemove", (e) => {
    mousePos.x = e.clientX;
    mousePos.y = e.clientY;
  });

  /* ========= FONCTIONS DE VÉRIFICATION ========= */
  function verifyPreVirusCollision(virus) {
    if (!virus) {
      console.warn("Pré-vérification virus : virus non défini");
      return false;
    }
    if (!document.body.contains(virus)) {
      console.warn("Pré-vérification virus : virus absent du DOM");
      return false;
    }
    if (!mousePos || typeof mousePos.x !== "number" || typeof mousePos.y !== "number") {
      console.warn("Pré-vérification virus : position de la souris invalide");
      return false;
    }
    return true;
  }

  function verifyPostVirusCollision(virus) {
    if (!document.body.contains(virus)) {
      console.warn("Post-vérification virus : virus supprimé durant la vérification");
      return false;
    }
    return true;
  }

  function verifyPreCoinCheck(coin) {
    if (!coin) {
      console.warn("Pré-vérification pièce : pièce non définie");
      return false;
    }
    if (!document.body.contains(coin)) {
      console.warn("Pré-vérification pièce : pièce absente du DOM");
      return false;
    }
    if (!coin.spawnTime || typeof coin.spawnTime !== "number") {
      console.warn("Pré-vérification pièce : spawnTime invalide");
      return false;
    }
    return true;
  }

  function verifyPostCoinCheck(coin) {
    if (!document.body.contains(coin)) {
      console.warn("Post-vérification pièce : pièce supprimée durant la vérification");
      return false;
    }
    return true;
  }

  /* ========= FONCTIONS DE DÉTECTION ========= */
  function checkVirusCollision(virus) {
    if (!verifyPreVirusCollision(virus)) return false;
    const rect = virus.getBoundingClientRect();
    const radius = rect.width / 2;
    const currentCenter = { x: rect.left + radius, y: rect.top + radius };

    // Initialiser la position précédente
    if (!virus.lastCenter) virus.lastCenter = currentCenter;

    // Calcul du segment parcouru par le virus
    const start = virus.lastCenter;
    const end = currentCenter;
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const segLengthSq = dx * dx + dy * dy;
    let t = segLengthSq > 0 ? ((mousePos.x - start.x) * dx + (mousePos.y - start.y) * dy) / segLengthSq : 0;
    t = Math.max(0, Math.min(1, t));
    const closest = { x: start.x + t * dx, y: start.y + t * dy };

    const diffX = mousePos.x - closest.x;
    const diffY = mousePos.y - closest.y;
    const distanceSq = diffX * diffX + diffY * diffY;

    // Ajout d'une marge pour compenser les mouvements rapides
    const toleranceFactor = 1.3;
    const collision = distanceSq < Math.pow(radius * toleranceFactor, 2);

    virus.lastCenter = currentCenter;
    if (collision && !verifyPostVirusCollision(virus)) return false;
    return collision;
  }

  function checkCoinCollection(coin) {
    if (!verifyPreCoinCheck(coin)) return false;
    const rect = coin.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = mousePos.x - centerX;
    const dy = mousePos.y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    // Zone de collecte élargie pour éviter les pertes involontaires
    const collectionThreshold = (rect.width / 2) * 1.5;
    const collected = distance < collectionThreshold;
    if (collected && !verifyPostCoinCheck(coin)) return false;
    return collected;
  }

  /* ========= MENU DE DIFFICULTÉ ========= */
  profileImage.addEventListener("click", showDifficultyMenu);

  function showDifficultyMenu() {
    virusGame.style.display = "block";
    clearCoins();

    gameArea.innerHTML = `
      <div id="difficulty-menu" style="text-align:center; margin-top:50px;">
        <h2>Choisissez la difficulté</h2>
        <label for="difficulty-select">Difficulté : </label>
        <select id="difficulty-select">
          <option value="facile">Facile</option>
          <option value="moyen">Moyen</option>
          <option value="difficile">Difficile</option>
          <option value="personnaliser">Personnalisé</option>
          <option value="infini">Infini</option>
        </select>
        <div id="custom-options" style="display:none; margin-top:20px;">
          <label>Nombre de virus : <input type="number" id="custom-count" value="12" min="1"></label><br>
          <label>Vitesse : <input type="number" id="custom-speed" value="9" min="1" step="0.5"></label><br>
          <label>Temps (sec) : <input type="number" id="custom-time" value="4" min="1"></label>
        </div>
        <br>
        <button id="start-game-button" style="margin-top:20px; padding:10px 20px;">Commencer</button>
        <button id="quit-menu-button" style="margin-top:20px; padding:10px 20px;">Quitter</button>
      </div>
    `;

    const difficultySelect = document.getElementById("difficulty-select");
    const customOptions = document.getElementById("custom-options");

    difficultySelect.addEventListener("change", function () {
      customOptions.style.display = this.value === "personnaliser" ? "block" : "none";
    });

    document.getElementById("start-game-button").addEventListener("click", () => {
      let selected = difficultySelect.value;
      if (selected === "personnaliser") {
        let customCount = parseInt(document.getElementById("custom-count").value) || difficulties.personnaliser.count;
        let customSpeed = parseFloat(document.getElementById("custom-speed").value) || difficulties.personnaliser.speed;
        let customTime = parseInt(document.getElementById("custom-time").value) || difficulties.personnaliser.time;
        difficulties.personnaliser = { count: customCount, speed: customSpeed, time: customTime };
        startGameWithDifficulty("personnaliser");
      } else {
        startGameWithDifficulty(selected);
      }
    });

    document.getElementById("quit-menu-button").addEventListener("click", () => {
      virusGame.style.display = "none";
    });
  }

  /* ========= DÉMARRAGE DU JEU ========= */
  function startGameWithDifficulty(mode) {
    // Réinitialiser le flag de fin de partie
    gameEnded = false;
    currentMode = mode;
    if (mode === "infini") {
      startInfiniteMode();
      return;
    }

    const params = difficulties[mode];
    gameActive = true;
    timeLeft = params.time;

    gameArea.innerHTML = `
      <p id="game-timer">Temps : <span id="timer">${params.time}</span> sec</p>
      <p id="game-message"></p>
    `;
    timerDisplay = document.getElementById("timer");
    gameMessage = document.getElementById("game-message");
    gameMessage.style = "";

    restartGame.style.display = "none";
    quitGame.style.display = "inline-block";

    spawnViruses(params.count, params.speed);
    startTimer();
  }

  /* ========= MODE CLASSIQUE ========= */
  function spawnViruses(count, speed) {
    viruses.forEach(v => v.remove());
    viruses = [];
    for (let i = 0; i < count; i++) {
      let virus = document.createElement("div");
      virus.classList.add("virus");
      virus.style.position = "absolute";
      virus.style.top = `${Math.random() * 80}vh`;
      virus.style.left = `${Math.random() * 90}vw`;
      virus.style.width = "30px";
      virus.style.height = "30px";
      virus.velocity = { x: 0, y: 0 };
      gameArea.appendChild(virus);
      viruses.push(virus);
    }
    startVirusMovement(difficulties[currentMode].speed);
  }

  function startVirusMovement(maxSpeed) {
    const acceleration = 0.5;
    const separationDistance = 30;
    const separationStrength = 0.3;
    gameInterval = setInterval(() => {
      viruses.forEach((virus, index) => {
        let rect = virus.getBoundingClientRect();
        let virusX = rect.left + rect.width / 2;
        let virusY = rect.top + rect.height / 2;
        let angle = Math.atan2(mousePos.y - virusY, mousePos.x - virusX);
        virus.velocity.x += Math.cos(angle) * acceleration;
        virus.velocity.y += Math.sin(angle) * acceleration;

        let repulsion = { x: 0, y: 0 };
        viruses.forEach((otherVirus, otherIndex) => {
          if (otherIndex === index) return;
          let otherRect = otherVirus.getBoundingClientRect();
          let otherX = otherRect.left + otherRect.width / 2;
          let otherY = otherRect.top + otherRect.height / 2;
          let diffX = virusX - otherX;
          let diffY = virusY - otherY;
          let distance = Math.sqrt(diffX * diffX + diffY * diffY);
          if (distance < separationDistance && distance > 0) {
            repulsion.x += diffX / distance;
            repulsion.y += diffY / distance;
          }
        });
        virus.velocity.x += repulsion.x * separationStrength;
        virus.velocity.y += repulsion.y * separationStrength;

        let currentSpeed = Math.sqrt(virus.velocity.x ** 2 + virus.velocity.y ** 2);
        if (currentSpeed > maxSpeed) {
          virus.velocity.x = (virus.velocity.x / currentSpeed) * maxSpeed;
          virus.velocity.y = (virus.velocity.y / currentSpeed) * maxSpeed;
        }

        let newLeft = virus.offsetLeft + virus.velocity.x;
        let newTop = virus.offsetTop + virus.velocity.y;
        virus.style.left = `${newLeft}px`;
        virus.style.top = `${newTop}px`;

        if (checkVirusCollision(virus)) {
          if (!virus.collisionStart) {
            virus.collisionStart = Date.now();
          } else if (Date.now() - virus.collisionStart > 100) {
            if (checkVirusCollision(virus)) {
              endGame(false, virus);
            }
          }
        } else {
          virus.collisionStart = null;
        }
      });
    }, 50);
  }

  function startTimer() {
    countdown = setInterval(() => {
      timeLeft--;
      timerDisplay.textContent = timeLeft;
      if (timeLeft <= 0) {
        clearInterval(countdown);
        endGame(true);
      }
    }, 1000);
  }

  /* ========= MODE INFINI ========= */
  function startInfiniteMode() {
    gameEnded = false;
    gameActive = true;
    infiniteTime = 0;
    infiniteDifficulty = 1; // Départ plus simple
    difficultyMultiplier = 2;
    clearViruses();
    clearCoins();

    gameArea.innerHTML = `
      <p id="game-timer">Temps : <span id="timer">0</span> sec</p>
      <p id="game-message"></p>
    `;
    timerDisplay = document.getElementById("timer");
    gameMessage = document.getElementById("game-message");
    gameMessage.style = "";

    restartGame.style.display = "none";
    quitGame.style.display = "inline-block";

    infiniteSpawnInterval = setInterval(spawnInfiniteVirus, 100);
    infiniteMovementInterval = setInterval(updateInfiniteVirusMovement, 50);
    // Augmentation progressive avec intensification accélérée
    infiniteDifficultyInterval = setInterval(() => {
      infiniteTime++;
      timerDisplay.textContent = infiniteTime;
      infiniteDifficulty += 0.05 * (1 + infiniteTime / 10);
    }, 1000);
    infiniteCoinSpawnInterval = setInterval(spawnInfiniteCoin, 3000);
    infiniteCoinCheckInterval = setInterval(checkInfiniteCoinCollision, 50);
  }

  function updateInfiniteVirusMovement() {
    const maxInfiniteSpeed = 50; // Vitesse max autorisée
    viruses.forEach((virus, index) => {
      let dx = virus.baseVelocity.x * infiniteDifficulty * difficultyMultiplier;
      let dy = virus.baseVelocity.y * infiniteDifficulty * difficultyMultiplier;
      let effectiveSpeed = dx * dx + dy * dy;
      if (effectiveSpeed > maxInfiniteSpeed * maxInfiniteSpeed) {
        const factor = maxInfiniteSpeed / Math.sqrt(effectiveSpeed);
        dx *= factor;
        dy *= factor;
      }
      let newLeft = virus.offsetLeft + dx;
      let newTop = virus.offsetTop + dy;
      virus.style.left = `${newLeft}px`;
      virus.style.top = `${newTop}px`;

      if (checkVirusCollision(virus)) {
        if (!virus.collisionStart) {
          virus.collisionStart = Date.now();
        } else if (Date.now() - virus.collisionStart > 100) {
          if (checkVirusCollision(virus)) {
            endGame(false, virus);
          }
        }
      } else {
        virus.collisionStart = null;
      }

      if (
        virus.offsetLeft < -100 ||
        virus.offsetLeft > window.innerWidth + 100 ||
        virus.offsetTop < -100 ||
        virus.offsetTop > window.innerHeight + 100
      ) {
        virus.remove();
        viruses.splice(index, 1);
      }
    });
  }

  function spawnInfiniteVirus() {
    let edge = Math.floor(Math.random() * 4);
    let x, y, angle;
    const baseSpeed = 3;
    const variationAngle = Math.PI / 6;
    switch (edge) {
      case 0:
        x = -50;
        y = Math.random() * window.innerHeight;
        angle = 0 + (Math.random() * variationAngle - variationAngle / 2);
        break;
      case 1:
        x = Math.random() * window.innerWidth;
        y = -50;
        angle = Math.PI / 2 + (Math.random() * variationAngle - variationAngle / 2);
        break;
      case 2:
        x = window.innerWidth + 50;
        y = Math.random() * window.innerHeight;
        angle = Math.PI + (Math.random() * variationAngle - variationAngle / 2);
        break;
      case 3:
        x = Math.random() * window.innerWidth;
        y = window.innerHeight + 50;
        angle = (3 * Math.PI) / 2 + (Math.random() * variationAngle - variationAngle / 2);
        break;
    }
    let virus = document.createElement("div");
    virus.classList.add("virus");
    virus.style.position = "absolute";
    virus.style.left = `${x}px`;
    virus.style.top = `${y}px`;
    virus.style.width = "30px";
    virus.style.height = "30px";
    virus.baseVelocity = {
      x: Math.cos(angle) * baseSpeed,
      y: Math.sin(angle) * baseSpeed
    };
    gameArea.appendChild(virus);
    viruses.push(virus);
  }

  function spawnInfiniteCoin() {
    let coin = document.createElement("div");
    coin.classList.add("coin");
    coin.style.position = "absolute";
    coin.style.left = `${Math.random() * (window.innerWidth - 20)}px`;
    coin.style.top = `${Math.random() * (window.innerHeight - 20)}px`;
    coin.style.width = "20px";
    coin.style.height = "20px";
    coin.style.borderRadius = "50%";
    coin.style.zIndex = "1000";
    coin.spawnTime = Date.now();

    let coinTypes = ["normal", "slow", "clear"];
    let chosenType = coinTypes[Math.floor(Math.random() * coinTypes.length)];
    coin.dataset.type = chosenType;

    switch (chosenType) {
      case "normal":
        coin.style.background = "gold";
        break;
      case "slow":
        coin.style.background = "blue";
        break;
      case "clear":
        coin.style.background = "purple";
        break;
    }

    gameArea.appendChild(coin);
    coins.push(coin);
  }

  function checkInfiniteCoinCollision() {
    const now = Date.now();
    coins.forEach((coin, index) => {
      if (!verifyPreCoinCheck(coin)) return;
      
      if (coin.dataset.type === "normal" && now - coin.spawnTime >= 10000) {
        if (checkCoinCollection(coin)) {
          handleCoinCollection(coin);
          coin.remove();
          coins.splice(index, 1);
          return;
        } else {
          console.warn("Pièce normale expirée et non collectée malgré la zone élargie");
          endGame(false);
          return;
        }
      }

      if (checkCoinCollection(coin)) {
        handleCoinCollection(coin);
        coin.remove();
        coins.splice(index, 1);
      }
    });
  }

  function handleCoinCollection(coin) {
    let type = coin.dataset.type;
    switch (type) {
      case "slow":
        difficultyMultiplier = 0.5;
        setTimeout(() => { difficultyMultiplier = 1; }, 5000);
        break;
      case "clear":
        let removeCount = Math.floor(viruses.length * 0.3);
        for (let i = 0; i < removeCount; i++) {
          let virus = viruses.shift();
          if (virus) virus.remove();
        }
        break;
      case "normal":
      default:
        break;
    }
  }

  /* ========= FONCTIONS DE NETTOYAGE ========= */
  function clearCoins() {
    coins.forEach(c => {
      if (c.timeoutID) clearTimeout(c.timeoutID);
      c.remove();
    });
    coins = [];
  }

  function clearViruses() {
    viruses.forEach(v => v.remove());
    viruses = [];
  }

  function stopAllIntervals() {
    const intervals = [
      gameInterval,
      countdown,
      infiniteSpawnInterval,
      infiniteMovementInterval,
      infiniteDifficultyInterval,
      infiniteCoinSpawnInterval,
      infiniteCoinCheckInterval
    ];
    intervals.forEach(interval => {
      if (interval) clearInterval(interval);
    });
  }

  /* ========= FIN DE PARTIE ========= */
  function endGame(win, killerVirus) {
    if (gameEnded) return;
    gameEnded = true;
    gameActive = false;
    stopAllIntervals();
    clearCoins();

    if (!win && killerVirus) {
      killerVirus.style.zIndex = "10001";
      killerVirus.style.boxShadow = "0 0 30px 10px red";
      viruses = viruses.filter(v => {
        if (v !== killerVirus) {
          v.remove();
          return false;
        }
        return true;
      });
    } else {
      clearViruses();
    }

    gameMessage.textContent = win ? "🎉 Bravo, tu as survécu !" : "💀 Game Over !";
    Object.assign(gameMessage.style, {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      fontSize: "3rem",
      fontWeight: "bold",
      padding: "20px 40px",
      background: "rgba(0, 0, 0, 0.8)",
      border: win ? "5px solid lime" : "5px solid red",
      borderRadius: "10px",
      zIndex: "10000",
      boxShadow: win ? "0 0 20px lime" : "0 0 20px red",
      textAlign: "center"
    });
    restartGame.style.display = "block";
    quitGame.style.display = "none";
    showEndParticles(win);
  }

  function showEndParticles(win) {
    const particleCount = 10;
    if (!document.getElementById("end-particle-style")) {
      let style = document.createElement("style");
      style.id = "end-particle-style";
      style.innerHTML = `
        @keyframes endParticleAnimation {
          0% { transform: translate(0, 0); opacity: 1; }
          100% { transform: translate(calc(var(--x, 0) * 100px), calc(var(--y, 0) * 100px)); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
    let particleColor = win ? "#00ff00" : "#ff0000";
    for (let i = 0; i < particleCount; i++) {
      let particle = document.createElement("div");
      particle.classList.add("end-particle");
      particle.style.background = particleColor;
      let angle = Math.random() * 2 * Math.PI;
      let distanceFactor = Math.random() * 1 + 0.5;
      let offsetX = Math.cos(angle) * distanceFactor;
      let offsetY = Math.sin(angle) * distanceFactor;
      particle.style.setProperty("--x", offsetX);
      particle.style.setProperty("--y", offsetY);
      Object.assign(particle.style, {
        position: "fixed",
        left: "50%",
        top: "50%",
        width: "8px",
        height: "8px",
        borderRadius: "50%",
        opacity: "1",
        zIndex: "10000",
        pointerEvents: "none",
        animation: "endParticleAnimation 1s forwards"
      });
      document.body.appendChild(particle);
      setTimeout(() => { particle.remove(); }, 1000);
    }
  }

  /* ========= BOUTONS REJOUER & QUITTER ========= */
  restartGame.addEventListener("click", () => {
    // Lorsqu'on clique sur "Rejouer", on affiche le menu de difficulté pour démarrer une nouvelle partie
    showDifficultyMenu();
  });

  quitGame.addEventListener("click", () => {
    virusGame.style.display = "none";
    gameActive = false;
    stopAllIntervals();
    if (currentMode === "infini") {
      clearCoins();
    }
  });
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

    // Générer les dots dynamiquement
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
                slide.style.display = "block";
            } else {
                slide.classList.remove("active");
                slide.style.display = "none";
            }
            dots[i].classList.toggle("active", i === index);
        });
    }

    function moveSlide(step) {
        slideIndex += step;
        if (slideIndex >= slides.length) slideIndex = 0;
        if (slideIndex < 0) slideIndex = slides.length - 1;
        showSlide(slideIndex);
    }

    // Ajout des events sur les boutons
    prevButton.addEventListener("click", () => moveSlide(-1));
    nextButton.addEventListener("click", () => moveSlide(1));

    // Initialisation
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