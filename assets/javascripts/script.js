// Script for Locomotive
const locomotive = () => {
  gsap.registerPlugin(ScrollTrigger);
  const locoScroll = new LocomotiveScroll({
    el: document.querySelector("main"),
    smooth: true,
  });
  locoScroll.on("scroll", ScrollTrigger.update);
  ScrollTrigger.scrollerProxy("main", {
    scrollTop(value) {
      return arguments.length
        ? locoScroll.scrollTo(value, 0, 0)
        : locoScroll.scroll.instance.scroll.y;
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
    pinType: document.querySelector("main").style.transform
      ? "transform"
      : "fixed",
  });
  ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
  ScrollTrigger.refresh();
};
locomotive();

// Script for Home
const canvasDrawing = () => {
  const canvas = document.querySelector("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.lineWidth = 100;

  ctx.globalCompositeOperation = "destination-out";

  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;

  function draw(e) {
    if (!isDrawing) return;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    [lastX, lastY] = [e.offsetX, e.offsetY];
  }

  canvas.addEventListener("mouseenter", (e) => {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
  });

  canvas.addEventListener("mouseleave", () => {
    isDrawing = false;
  });

  canvas.addEventListener("mousemove", draw);
};
canvasDrawing();

// Script for Services
const servicesAnimation = () => {
  gsap.to(".services", {
    transform: "translateX(-100vw)",
    scrollTrigger: {
      trigger: ".services",
      scroller: "main",
      start: "top 0",
      end: "top -100%",
      scrub: 2,
      pin: true,
    },
  });

  document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(CustomEase);
    CustomEase.create(
      "hop",
      "M0,0 C0.488, 0.02 0.467, 0.286 0.5, 0.5 0.532, 0.712 0.58, 1 1, 1"
    );

    const slider = document.querySelector(".slider");
    const sliderTitle = document.querySelector(".slider-title");
    const sliderCounter = document.querySelector(
      ".slider-counter p span:first-child"
    );
    const sliderPreview = document.querySelector(".slider-preview");
    const totalSlides = 6;
    let activeSlideIndex = 1;
    let isAnimating = false;

    const sliderContent = [
      {
        name: "SMM",
        img: "/Bena-Social/assets/images/services/service_01.jpg",
      },
      {
        name: "Editing",
        img: "/Bena-Social/assets/images/services/service_02.jpg",
      },
      {
        name: "SEO",
        img: "/Bena-Social/assets/images/services/service_03.jpg",
      },
      {
        name: "Branding",
        img: "/Bena-Social/assets/images/services/service_04.jpg",
      },
      {
        name: "Designing",
        img: "/Bena-Social/assets/images/services/service_05.jpg",
      },
      {
        name: "Scripting",
        img: "/Bena-Social/assets/images/services/service_06.jpg",
      },
    ];

    const clipPath = {
      closed: "polygon(25% 30%, 75% 30%, 75% 70%, 25% 70%)",
      open: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    };

    const slidePositions = {
      prev: { left: "30%", rotation: -90 },
      active: { left: "65%", rotation: 0 },
      next: { left: "100%", rotation: 90 },
    };

    const splitTextIntoSpans = (element) => {
      element.innerHTML = element.innerText
        .split("")
        .map((char) => `<span>${char === " " ? "&nbsp;&nbsp" : char}</span>`)
        .join("");
    };

    const createAndAnimateTitle = (content, direction) => {
      const newTitle = document.createElement("h1");
      newTitle.innerText = content.name;
      sliderTitle.appendChild(newTitle);
      splitTextIntoSpans(newTitle);

      const yOffset = direction === "next" ? 70 : -70;
      gsap.set(newTitle.querySelectorAll("span"), { y: yOffset });
      gsap.to(newTitle.querySelectorAll("span"), {
        y: 0,
        duration: 1.25,
        stagger: 0.02,
        ease: "hop",
        delay: 0.25,
      });

      const currentTitle = sliderTitle.querySelector("h1:not(:last-child)");
      if (currentTitle) {
        gsap.to(currentTitle.querySelectorAll("span"), {
          y: -yOffset,
          duration: 1.25,
          stagger: 0.02,
          ease: "hop",
          delay: 0.25,
          onComplete: () => currentTitle.remove(),
        });
      }
    };

    const createSlide = (content, className) => {
      const slide = document.createElement("div");
      slide.className = `slider-container ${className}`;
      slide.innerHTML = `<div class="slide-img"><img src="${content.img}" alt="${content.name}"/></div>`;
      return slide;
    };

    const getSlideIndex = (increment) => {
      return (
        ((activeSlideIndex + increment - 1 + totalSlides) % totalSlides) + 1
      );
    };

    const updateCounter = (index) => {
      sliderCounter.textContent = `0${index}`;
    };

    const updatePreviewImage = (content) => {
      const newImage = document.createElement("img");
      newImage.src = content.img;
      newImage.alt = content.name;
      sliderPreview.appendChild(newImage);

      gsap.fromTo(
        newImage,
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: 1,
          ease: "power2.inOut",
          delay: 0.5,
          onComplete: () =>
            sliderPreview.querySelector("img:not(:last-child)")?.remove(),
        }
      );
    };

    const animateSlide = (slide, props) => {
      gsap.to(slide, { ...props, duration: 2, ease: "hop" });
      gsap.to(slide.querySelector(".slide-img"), {
        rotation: -props.rotation,
        duration: 2,
        ease: "hop",
      });
    };

    const transitionSlides = (direction) => {
      if (isAnimating) return;
      isAnimating = true;

      const [outgoingPos, incomingPos] =
        direction === "next" ? ["prev", "next"] : ["next", "prev"];

      const outgoingSlide = slider.querySelector(`.${outgoingPos}`);
      const activeSlide = slider.querySelector(`.active`);
      const incomingSlide = slider.querySelector(`.${incomingPos}`);

      animateSlide(incomingSlide, {
        ...slidePositions.active,
        clipPath: clipPath.open,
      });
      animateSlide(activeSlide, {
        ...slidePositions[outgoingPos],
        clipPath: clipPath.closed,
      });
      gsap.to(outgoingSlide, {
        scale: 0,
        opacity: 0,
        duration: 2,
        ease: "hop",
      });

      const newSlideIndex = getSlideIndex(direction === "next" ? 2 : -2);
      const newSlide = createSlide(
        sliderContent[newSlideIndex - 1],
        incomingPos
      );
      slider.appendChild(newSlide);
      gsap.set(newSlide, {
        ...slidePositions[incomingPos],
        xPercent: -50,
        yPercent: -50,
        scale: 0,
        opacity: 0,
        clipPath: clipPath.closed,
      });
      gsap.to(newSlide, { scale: 1, opacity: 1, duration: 2, ease: "hop" });

      const newActiveIndex = getSlideIndex(direction === "next" ? 1 : -1);
      createAndAnimateTitle(sliderContent[newActiveIndex - 1], direction);
      updatePreviewImage(sliderContent[newActiveIndex - 1]);

      setTimeout(() => updateCounter(newActiveIndex), 1000);

      setTimeout(() => {
        outgoingSlide.remove();
        activeSlide.className = `slider-container ${outgoingPos}`;
        incomingSlide.className = `slider-container active`;
        newSlide.className = `slider-container ${incomingPos}`;
        activeSlideIndex = newActiveIndex;
        isAnimating = false;
      }, 2000);
    };

    slider.addEventListener("click", (e) => {
      const clickedSlide = e.target.closest(".slider-container");
      if (clickedSlide && !isAnimating) {
        transitionSlides(
          clickedSlide.classList.contains("next") ? "next" : "prev"
        );
      }
    });

    Object.entries(slidePositions).forEach(([key, value]) => {
      gsap.set(`.slider-container.${key}`, {
        ...value,
        xPercent: -50,
        yPercent: -50,
        clipPath: key === "active" ? clipPath.open : clipPath.closed,
      });
      if (key !== "active") {
        gsap.set(`.slider-container.${key} .slide-img`, {
          rotation: -value.rotation,
        });
      }
    });

    const initialTitle = sliderTitle.querySelector("h1");
    splitTextIntoSpans(initialTitle);
    gsap.fromTo(
      initialTitle.querySelectorAll("span"),
      {
        y: 60,
      },
      {
        y: 0,
        duration: 1,
        stagger: 0.02,
        ease: "hop",
      }
    );

    updateCounter(activeSlideIndex);
  });
};
servicesAnimation();
