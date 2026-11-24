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