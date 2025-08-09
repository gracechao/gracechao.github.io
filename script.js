// Mobile menu functionality with enhanced accessibility
document.addEventListener("DOMContentLoaded", function () {
  // Cache DOM elements
  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const navOverlay = document.querySelector(".nav-overlay");
  const navLinksItems = document.querySelectorAll(".nav-link");
  const body = document.body;

  // Check if required elements exist
  if (!mobileMenuToggle || !navLinks || !navOverlay) {
    console.warn("Required navigation elements not found");
    return;
  }

  function toggleMobileMenu() {
    const isActive = navLinks.classList.contains("active");
    const newState = !isActive;

    // Toggle menu states
    navLinks.classList.toggle("active");
    navOverlay.classList.toggle("active");

    // Update ARIA attributes for accessibility
    mobileMenuToggle.setAttribute("aria-expanded", newState.toString());
    navLinks.setAttribute("aria-hidden", (!newState).toString());

    // Animate hamburger menu
    const spans = mobileMenuToggle.querySelectorAll(".hamburger-line");
    spans.forEach((span, index) => {
      if (newState) {
        // Transform to X
        span.style.transform =
          index === 0
            ? "rotate(45deg) translate(6px, 6px)"
            : index === 1
            ? "opacity(0)"
            : "rotate(-45deg) translate(6px, -6px)";
      } else {
        // Reset to hamburger
        span.style.transform = "none";
        span.style.opacity = "1";
      }
    });

    // Manage body scroll and focus
    body.style.overflow = newState ? "hidden" : "";

    // Focus management
    if (newState) {
      // Focus first nav link when menu opens
      const firstNavLink = navLinks.querySelector(".nav-link");
      if (firstNavLink) {
        firstNavLink.focus();
      }
    }
  }

  function closeMobileMenu() {
    navLinks.classList.remove("active");
    navOverlay.classList.remove("active");

    // Update ARIA attributes
    mobileMenuToggle.setAttribute("aria-expanded", "false");
    navLinks.setAttribute("aria-hidden", "true");

    // Reset hamburger menu
    const spans = mobileMenuToggle.querySelectorAll(".hamburger-line");
    spans.forEach((span) => {
      span.style.transform = "none";
      span.style.opacity = "1";
    });

    // Restore body scroll and focus
    body.style.overflow = "";

    // Return focus to menu button
    mobileMenuToggle.focus();
  }

  // Event listeners
  mobileMenuToggle.addEventListener("click", toggleMobileMenu);
  navOverlay.addEventListener("click", closeMobileMenu);

  // Enhanced keyboard support
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && navLinks.classList.contains("active")) {
      e.preventDefault();
      closeMobileMenu();
    }
  });

  // Trap focus within mobile menu when open
  navLinks.addEventListener("keydown", function (e) {
    if (!navLinks.classList.contains("active")) return;

    if (e.key === "Tab") {
      const focusableElements = navLinks.querySelectorAll(".nav-link");
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  });

  // Close mobile menu when clicking on a nav link
  navLinksItems.forEach((link) => {
    link.addEventListener("click", function () {
      if (navLinks.classList.contains("active")) {
        closeMobileMenu();
      }
    });
  });

  // Enhanced smooth scrolling function with error handling
  function smoothScrollToSection(targetId) {
    try {
      const targetSection = document.querySelector(targetId);
      if (!targetSection) {
        console.warn(`Target section ${targetId} not found`);
        return;
      }

      const header = document.querySelector(".header");
      const headerHeight = header ? header.offsetHeight : 0;
      const targetPosition = targetSection.offsetTop - headerHeight - 20;

      // Use modern scrollTo with fallback
      if ("scrollBehavior" in document.documentElement.style) {
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      } else {
        // Fallback for older browsers
        window.scrollTo(0, targetPosition);
      }
    } catch (error) {
      console.error("Error during smooth scroll:", error);
    }
  }

  // Handle navigation links
  navLinksItems.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      smoothScrollToSection(targetId);
    });
  });

  // Remove scroll effects - keeping header consistent
  // Header now has solid background and no shadow changes

  // Add active class to current navigation item
  function updateActiveNavLink() {
    const sections = document.querySelectorAll("section[id]");

    let currentSection = "about"; // Default to about page
    const scrollPosition = window.scrollY + 200;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        currentSection = section.getAttribute("id");
      }
    });

    // Update active state for navigation links
    navLinksItems.forEach((item) => {
      item.classList.remove("active");
      const linkHref = item.getAttribute("href");
      if (linkHref === `#${currentSection}`) {
        item.classList.add("active");
      }
    });
  }

  // Handle navigation link clicks to update active state
  navLinksItems.forEach((item) => {
    item.addEventListener("click", function () {
      // Remove active class from all navigation items
      navLinksItems.forEach((navItem) => navItem.classList.remove("active"));
      // Add active class to clicked item
      this.classList.add("active");
    });
  });

  window.addEventListener("scroll", updateActiveNavLink);
  updateActiveNavLink(); // Call on load

  // Intersection Observer for fade-in animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Observe elements for animation
  const animateElements = document.querySelectorAll(
    ".press-item, .writing-item, .section-title"
  );
  animateElements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });

  // Form validation for contact (if you add a contact form later)
  const contactForm = document.querySelector("#contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Add your form submission logic here
      console.log("Form submitted");

      // Show success message
      const successMessage = document.createElement("div");
      successMessage.textContent =
        "Thank you for your message! I'll get back to you soon.";
      successMessage.style.cssText =
        "background: #2ecc71; color: white; padding: 1rem; border-radius: 5px; margin-top: 1rem;";
      contactForm.appendChild(successMessage);

      // Reset form
      contactForm.reset();

      // Remove success message after 5 seconds
      setTimeout(() => {
        if (successMessage.parentNode) {
          successMessage.parentNode.removeChild(successMessage);
        }
      }, 5000);
    });
  }

  // Lazy loading for images
  const images = document.querySelectorAll("img[data-src]");
  const imageObserver = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove("lazy");
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach((img) => imageObserver.observe(img));

  // Add loading state to external links
  const externalLinks = document.querySelectorAll('a[href^="http"]');
  externalLinks.forEach((link) => {
    link.addEventListener("click", function () {
      this.style.opacity = "0.7";
      this.style.pointerEvents = "none";

      setTimeout(() => {
        this.style.opacity = "1";
        this.style.pointerEvents = "auto";
      }, 2000);
    });
  });
});
