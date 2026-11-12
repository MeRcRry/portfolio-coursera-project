"use strict";

const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#main-navigation");

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  navigation.classList.toggle("is-open", !isExpanded);
});

navigation.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    navigation.classList.remove("is-open");
  });
});

const projectFilters = document.querySelectorAll("[data-filter]");
const projects = document.querySelectorAll("#projects article[data-category]");

projectFilters.forEach((filterButton) => {
  filterButton.addEventListener("click", () => {
    const category = filterButton.dataset.filter;

    projectFilters.forEach((button) => {
      button.setAttribute("aria-pressed", String(button === filterButton));
    });

    projects.forEach((project) => {
      project.hidden = category !== "all" && project.dataset.category !== category;
    });
  });
});

const lightbox = document.querySelector("#project-lightbox");
const lightboxHeading = document.querySelector("#lightbox-heading");
const lightboxContent = document.querySelector("#lightbox-content");
let lastPreviewButton;

document.querySelectorAll(".project-preview").forEach((previewButton) => {
  previewButton.addEventListener("click", () => {
    const project = previewButton.closest("article");
    const image = previewButton.querySelector("img").cloneNode();

    lastPreviewButton = previewButton;
    lightboxHeading.textContent = `${project.querySelector("h3").textContent} preview`;
    lightboxContent.replaceChildren(image);
    lightbox.showModal();
  });
});

document.querySelector(".lightbox-close").addEventListener("click", () => {
  lightbox.close();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightbox.open) {
    event.preventDefault();
    lightbox.close();
  }
});

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    lightbox.close();
  }
});

lightbox.addEventListener("close", () => {
  lightboxContent.replaceChildren();
  lastPreviewButton?.focus();
});

const contactForm = document.querySelector("#contact-form");
const formFields = [...contactForm.querySelectorAll("input, textarea")];
const formFeedback = document.querySelector("#form-feedback");

contactForm.noValidate = true;

function validateField(field) {
  const errorMessage = document.querySelector(`#${field.id}-error`);
  let message = "";

  if (field.validity.valueMissing) {
    message = "Please fill out this field.";
  } else if (field.validity.typeMismatch) {
    message = "Please enter a valid email address.";
  }

  field.setAttribute("aria-invalid", String(Boolean(message)));
  errorMessage.textContent = message;
  return !message;
}

formFields.forEach((field) => {
  field.addEventListener("input", () => {
    validateField(field);
    formFeedback.textContent = "";
  });
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const isFormValid = formFields.map(validateField).every(Boolean);

  if (!isFormValid) {
    formFeedback.textContent = "Please correct the highlighted fields.";
    contactForm.querySelector('[aria-invalid="true"]').focus();
    return;
  }

  formFeedback.textContent = "Thanks for your message! This demo form does not send messages yet.";
  contactForm.reset();
  formFields.forEach((field) => {
    field.removeAttribute("aria-invalid");
  });
});
