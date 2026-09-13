/* =========================================================
   HEADER AL HACER SCROLL
========================================================= */

const header = document.querySelector(".header");

if (header) {

    function updateHeaderOnScroll() {

        if (window.scrollY > 60) {

            header.classList.add("header--scrolled");

        } else {

            header.classList.remove("header--scrolled");

        }

    }

    updateHeaderOnScroll();

    window.addEventListener("scroll", updateHeaderOnScroll, { passive: true });

}


/* =========================================================
   SLIDER
========================================================= */

const slider = document.querySelector(".slider");

const nextButton = document.querySelector(".next");

const prevButton = document.querySelector(".prev");


function moveNext() {

    const items =
        document.querySelectorAll(".item");

    slider.appendChild(items[0]);

    resetSliderAnimation();
}


function movePrev() {

    const items =
        document.querySelectorAll(".item");

    slider.prepend(
        items[items.length - 1]
    );

    resetSliderAnimation();
}


function resetSliderAnimation() {

    const contents =
        document.querySelectorAll(".content");

    contents.forEach((content) => {

        content.style.animation = "none";

    });


    setTimeout(() => {

        const activeContent =
            document.querySelector(".item:nth-child(2) .content");

        if (activeContent) {

            activeContent.style.animation =
                "show .8s ease-in-out .15s forwards";

        }

    }, 50);

}


/* BOTONES */

if (nextButton) {

    nextButton.addEventListener(
        "click",
        moveNext
    );

}


if (prevButton) {

    prevButton.addEventListener(
        "click",
        movePrev
    );

}



/* =========================================================
   AUTOPLAY
========================================================= */

let sliderInterval =
    setInterval(moveNext, 7000);


/* Reiniciar autoplay al interactuar */

function restartSlider() {

    clearInterval(sliderInterval);

    sliderInterval =
        setInterval(moveNext, 7000);

}


if (nextButton) {

    nextButton.addEventListener(
        "click",
        restartSlider
    );

}


if (prevButton) {

    prevButton.addEventListener(
        "click",
        restartSlider
    );

}



/* =========================================================
   ANIMACIÓN TERAPIAS
========================================================= */

const therapyCards =
    document.querySelectorAll(
        ".therapy-card"
    );


const therapyObserver =
    new IntersectionObserver(

        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    entry.target.classList.add(
                        "therapy-visible"
                    );

                    therapyObserver.unobserve(
                        entry.target
                    );

                }

            });

        },

        {
            threshold: 0.15
        }

    );


therapyCards.forEach((card) => {

    therapyObserver.observe(card);

});



/* =========================================================
   ANIMACIÓN SECCIÓN 15 AÑOS
========================================================= */

const legacy =
    document.querySelector(".legacy");


if (legacy) {

    const prefersReducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    /* Dividir el título en palabras para el
       efecto de entrada palabra por palabra */

    const legacyHeading =
        legacy.querySelector(".legacy__copy h2");

    if (legacyHeading && !prefersReducedMotion) {

        const words =
            legacyHeading.textContent
                .trim()
                .split(/\s+/);

        legacyHeading.innerHTML = words
            .map((word, i) =>
                `<span class="legacy__word" style="transition-delay:${i * 45}ms">${word}</span>`
            )
            .join(" ");

    }


    /* Conteo del número de la insignia (1 → 15) */

    const legacyBadgeNum =
        legacy.querySelector(".legacy__badge-num");

    const legacyTarget =
        legacyBadgeNum
            ? parseInt(legacyBadgeNum.textContent, 10)
            : 0;


    function animateLegacyCount(el, endValue, duration) {

        const startTime = performance.now();

        function step(now) {

            const progress =
                Math.min((now - startTime) / duration, 1);

            el.textContent =
                Math.round(1 + progress * (endValue - 1));

            if (progress < 1) {

                requestAnimationFrame(step);

            }

        }

        requestAnimationFrame(step);

    }


    const legacyObserver =
        new IntersectionObserver(

            (entries) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        legacy.classList.add(
                            "is-visible"
                        );


                        if (legacyBadgeNum && legacyTarget > 0) {

                            if (prefersReducedMotion) {

                                legacyBadgeNum.textContent =
                                    legacyTarget;

                            } else {

                                animateLegacyCount(
                                    legacyBadgeNum,
                                    legacyTarget,
                                    1200
                                );

                            }

                        }


                        legacyObserver.unobserve(
                            legacy
                        );

                    }

                });

            },

            {
                threshold: 0.15
            }

        );


    legacyObserver.observe(legacy);


    /* Inclinación 3D de la foto al mover el mouse */

    const legacyFigure =
        legacy.querySelector(".legacy__figure");

    if (legacyFigure && !prefersReducedMotion) {

        const legacyImg =
            legacyFigure.querySelector("img");

        legacyFigure.addEventListener(
            "mousemove",
            (e) => {

                const rect =
                    legacyFigure.getBoundingClientRect();

                const x =
                    (e.clientX - rect.left) / rect.width - 0.5;

                const y =
                    (e.clientY - rect.top) / rect.height - 0.5;

                legacyImg.style.transform =
                    `rotateY(${x * 8}deg) rotateX(${y * -8}deg) scale(1.02)`;

            }

        );

        legacyFigure.addEventListener(
            "mouseleave",
            () => {

                legacyImg.style.transform = "";

            }

        );

    }

}



/* =========================================================
   CERRAR MENÚ AL HACER CLICK
========================================================= */

const menuToggle =
    document.querySelector("#menu-toggle");


const menuLinks =
    document.querySelectorAll(".menu a");


menuLinks.forEach((link) => {

    link.addEventListener("click", () => {

        if (menuToggle) {

            menuToggle.checked = false;

        }

    });

});



/* =========================================================
   SWIPE EN CELULAR
========================================================= */

let touchStartX = 0;

let touchEndX = 0;


slider.addEventListener(
    "touchstart",
    (event) => {

        touchStartX =
            event.changedTouches[0].screenX;

    },
    {
        passive: true
    }
);


slider.addEventListener(
    "touchend",
    (event) => {

        touchEndX =
            event.changedTouches[0].screenX;

        handleSwipe();

    },
    {
        passive: true
    }
);


function handleSwipe() {

    const difference =
        touchStartX - touchEndX;


    if (Math.abs(difference) < 50) {

        return;

    }


    if (difference > 0) {

        moveNext();

    } else {

        movePrev();

    }


    restartSlider();

}




/* =========================================================
   GALERÍA DE INSTALACIONES
========================================================= */

(function () {

    // Reemplaza estas rutas por las fotos reales de tu clínica.
    const galleryImages = [
    { src: "img/1.jpeg", alt: "Instalaciones - foto 1" },
    { src: "img/2.jpeg", alt: "Instalaciones - foto 2" },
    { src: "img/3.jpeg", alt: "Instalaciones - foto 3" },
    { src: "img/4.jpeg", alt: "Instalaciones - foto 4" },
    { src: "img/7.jpeg", alt: "Instalaciones - foto 7" },
];

    const frameImg = document.querySelector(".gallery__image");
    const dotsWrap = document.querySelector(".gallery__dots");
    const prevBtn = document.querySelector(".gallery__arrow--prev");
    const nextBtn = document.querySelector(".gallery__arrow--next");

    const lightbox = document.querySelector("#lightbox");
    const lightboxImg = document.querySelector(".lightbox__image");
    const lightboxClose = document.querySelector(".lightbox__close");
    const lightboxPrev = document.querySelector(".lightbox__nav--prev");
    const lightboxNext = document.querySelector(".lightbox__nav--next");

    if (!frameImg) return;

    let currentIndex = 0;

    function renderDots() {
        if (!dotsWrap) return;


        dotsWrap.innerHTML = galleryImages
            .map((_, i) => `<button class="gallery__dot${i === currentIndex ? " is-active" : ""}" aria-label="Ir a la foto ${i + 1}"></button>`)
            .join("");
    }

    function updateFrame() {
        const current = galleryImages[currentIndex];
        frameImg.src = current.src;
        frameImg.alt = current.alt;
        renderDots();

        if (lightbox.classList.contains("is-open")) {
            updateLightboxImage();
        }
    }

    function goTo(index) {
        currentIndex = (index + galleryImages.length) % galleryImages.length;
        updateFrame();
    }

    prevBtn && prevBtn.addEventListener("click", () => goTo(currentIndex - 1));
    nextBtn && nextBtn.addEventListener("click", () => goTo(currentIndex + 1));

    dotsWrap && dotsWrap.addEventListener("click", (e) => {
        const dot = e.target.closest(".gallery__dot");
        if (!dot) return;
        goTo([...dotsWrap.children].indexOf(dot));
    });


    /* =========================================================

       LIGHTBOX
    ========================================================= */

    function updateLightboxImage() {
        const current = galleryImages[currentIndex];
        lightboxImg.src = current.src;
        lightboxImg.alt = current.alt;
    }

    function openLightbox() {
        updateLightboxImage();
        lightbox.classList.add("is-open");
        document.body.classList.add("no-scroll");
    }

    function closeLightbox() {
        lightbox.classList.remove("is-open");
        document.body.classList.remove("no-scroll");
    }

    frameImg.addEventListener("click", openLightbox);
    lightboxClose && lightboxClose.addEventListener("click", closeLightbox);

    lightboxPrev && lightboxPrev.addEventListener("click", () => goTo(currentIndex - 1));
    lightboxNext && lightboxNext.addEventListener("click", () => goTo(currentIndex + 1));

    lightbox && lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", (e) => {
        if (!lightbox.classList.contains("is-open")) return;


        if (e.key === "Escape") closeLightbox();
        if (e.key === "ArrowRight") goTo(currentIndex + 1);
        if (e.key === "ArrowLeft") goTo(currentIndex - 1);
    });

    updateFrame();

})();



/* =========================================================
   BLOG
========================================================= */

(function () {

    const blog = document.querySelector(".blog");

    if (!blog) return;

    const prefersReducedMotion =
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;


    /* Dividir el título "Blog" en palabras para el
       efecto de entrada palabra por palabra */

    const blogTitle = blog.querySelector(".blog__title");

    if (blogTitle && !prefersReducedMotion) {

        const words = blogTitle.textContent.trim().split(/\s+/);

        blogTitle.innerHTML = words
            .map((word, i) => `<span class="blog__word" style="transition-delay:${i * 60}ms">${word}</span>`)
            .join(" ");

    }


    /* Disparar la animación cuando la sección entra en pantalla */

    const blogObserver = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    blog.classList.add("is-visible");
                    obs.unobserve(blog);
                }
            });
        },
        { threshold: 0.15 }
    );

    blogObserver.observe(blog);

})();