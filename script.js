      // CURSOR
      const cursor = document.getElementById("cursor");
      const ring = document.getElementById("cursorRing");

      let mouseX = 0,
        mouseY = 0;
      let ringX = 0,
        ringY = 0;

      window.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        cursor.style.left = mouseX + "px";
        cursor.style.top = mouseY + "px";
      });

      function animateCursor() {
        ringX += (mouseX - ringX) * 0.12;
        ringY += (mouseY - ringY) * 0.12;

        ring.style.left = ringX + "px";
        ring.style.top = ringY + "px";

        requestAnimationFrame(animateCursor);
      }
      animateCursor();

      document
        .querySelectorAll("a, .gallery-item, .round-arrow")
        .forEach((el) => {
          el.addEventListener("mouseenter", () =>
            document.body.classList.add("hovering"),
          );
          el.addEventListener("mouseleave", () =>
            document.body.classList.remove("hovering"),
          );
        });

      // SCROLL PROGRESS
      window.addEventListener("scroll", () => {
        const max = document.documentElement.scrollHeight - innerHeight;
        document.getElementById("progress").style.width =
          (scrollY / max) * 100 + "%";
      });

      // REVEAL ANIMATION
      const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("show");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 },
      );

      document.querySelectorAll(".reveal").forEach((el) => {
        revealObserver.observe(el);
      });

      // BOOK SCROLL ANIMATION
      const bookSection = document.getElementById("bookSection");
      const bookCover = document.getElementById("bookCover");
      const leaves = [
        document.getElementById("leaf1"),
        document.getElementById("leaf2"),
        document.getElementById("leaf3"),
      ];
      const bookCaption = document.getElementById("bookCaption");

      function updateBook() {
        const rect = bookSection.getBoundingClientRect();
        const total = rect.height - innerHeight;

        const progress = Math.max(0, Math.min(1, -rect.top / total));

        // 표지 열기: 0~25%
        const coverProgress = Math.min(1, progress / 0.25);
        const coverAngle = -180 * coverProgress;

        bookCover.style.transform = `rotateY(${coverAngle}deg)`;

        // 페이지 넘기기: 나머지 스크롤 구간
        leaves.forEach((leaf, index) => {
          const start = 0.25 + index * 0.19;
          const end = start + 0.19;

          const pageProgress = Math.max(
            0,
            Math.min(1, (progress - start) / (end - start)),
          );

          const angle = -180 * pageProgress;

          leaf.style.transform = `rotateY(${angle}deg)`;
          leaf.style.zIndex = 10 + index;
        });

        bookCaption.textContent = `TURNING THE PAGES — ${Math.round(progress * 100)}%`;
      }

      window.addEventListener("scroll", updateBook, { passive: true });
      window.addEventListener("resize", updateBook);
      updateBook();

      // GALLERY PARALLAX
      document.querySelectorAll(".gallery-item").forEach((item) => {
        item.addEventListener("mousemove", (e) => {
          const rect = item.getBoundingClientRect();

          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;

          const art = item.querySelector(".art-inner");

          art.style.transform = `scale(1.08) translate(${x * 15}px, ${y * 15}px)`;
        });

        item.addEventListener("mouseleave", () => {
          item.querySelector(".art-inner").style.transform = "";
        });
      });

      
/* =====================================
   01. TEXT DECODING
===================================== */

const decodeElements = document.querySelectorAll(".decode-text");

const decodeCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";

decodeElements.forEach((element) => {
  const originalText = element.dataset.text;
  let animationFrame;

  const decodeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      let iteration = 0;

      cancelAnimationFrame(animationFrame);

     function animateDecode() {
        element.textContent = originalText
            .split("")
            .map((char, index) => {
            if (char === " ") return " ";
            if (index < iteration) return originalText[index];

            return decodeCharacters[
                Math.floor(Math.random() * decodeCharacters.length)
            ];
            })
            .join("");

        iteration += 0.2;

        if (iteration <= originalText.length) {
            setTimeout(() => {
            animationFrame = requestAnimationFrame(animateDecode);
            }, 35);
        } else {
            element.textContent = originalText;
        }
    }

      animateDecode();
      decodeObserver.unobserve(element);
    });
  }, { threshold: 0.3 });

  decodeObserver.observe(element);
});


/* =====================================
   02. MOUSE SPOTLIGHT
===================================== */

const heroSpotlight = document.querySelector(".spotlight--hero");
const endingSpotlight = document.querySelector(".spotlight--ending");

const heroSection = document.querySelector(".hero");
const endingSection = document.querySelector(".cinematic-ending");

window.addEventListener("mousemove", (e) => {
  [heroSpotlight, endingSpotlight].forEach((spotlight) => {
    if (!spotlight) return;

    spotlight.style.setProperty("--mouse-x", `${e.clientX}px`);
    spotlight.style.setProperty("--mouse-y", `${e.clientY}px`);
  });
});

function updateSpotlight() {
  if (!heroSection || !endingSection) return;

  const heroRect = heroSection.getBoundingClientRect();
  const endingRect = endingSection.getBoundingClientRect();

  const heroVisible =
    heroRect.top < window.innerHeight * 0.5 &&
    heroRect.bottom > window.innerHeight * 0.5;

  const endingVisible =
    endingRect.top < window.innerHeight * 0.5 &&
    endingRect.bottom > window.innerHeight * 0.5;

  heroSpotlight?.classList.toggle("is-active", heroVisible);
  endingSpotlight?.classList.toggle("is-active", endingVisible);
}

window.addEventListener("scroll", updateSpotlight, { passive: true });
window.addEventListener("resize", updateSpotlight);
window.addEventListener("load", updateSpotlight);

/* =====================================
   03. HORIZONTAL SCROLL
===================================== */

const horizontalSection = document.getElementById("horizontalGallery");
const horizontalTrack = document.querySelector(".horizontal-track");

function updateHorizontalScroll() {
  if (!horizontalSection || !horizontalTrack) return;

  const rect = horizontalSection.getBoundingClientRect();

  const sectionScrollHeight =
    horizontalSection.offsetHeight - window.innerHeight;

  const maxTranslate =
    horizontalTrack.scrollWidth - window.innerWidth;

  if (sectionScrollHeight <= 0 || maxTranslate <= 0) return;

  const progress = Math.max(
    0,
    Math.min(1, -rect.top / sectionScrollHeight)
  );

  horizontalTrack.style.transform =
    `translate3d(${-maxTranslate * progress}px, 0, 0)`;
}

window.addEventListener("scroll", updateHorizontalScroll, {
  passive: true
});

window.addEventListener("resize", updateHorizontalScroll);

window.addEventListener("load", updateHorizontalScroll);


/* =====================================
   04. CINEMATIC ENDING
===================================== */

const cinematicEnding = document.querySelector(".cinematic-ending");

if (cinematicEnding) {
  const endingObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          cinematicEnding.classList.add("ending-visible");
          endingObserver.unobserve(cinematicEnding);
        }
      });
    },
    { threshold: 0.4 }
  );

  endingObserver.observe(cinematicEnding);
}
