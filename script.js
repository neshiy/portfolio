
document.addEventListener("DOMContentLoaded", () => {
	const contactForm = document.getElementById("contact-form");
	if (contactForm) {
		contactForm.addEventListener("submit", (event) => {
			event.preventDefault();

			const formData = new FormData(contactForm);
			const firstName = (formData.get("firstName") || "").toString().trim();
			const lastName = (formData.get("lastName") || "").toString().trim();
			const email = (formData.get("email") || "").toString().trim();
			const phone = (formData.get("phone") || "").toString().trim();
			const message = (formData.get("message") || "").toString().trim();

			if (!firstName || !lastName || !email || !phone || !message) {
				window.alert("Please fill out all fields before sending your message.");
				return;
			}

			const subject = `Portfolio Inquiry from ${firstName} ${lastName}`;
			const emailBody = [
				`Name: ${firstName} ${lastName}`,
				`Email: ${email}`,
				`Phone: ${phone}`,
				"",
				"Message:",
				message,
			].join("\n");

			const gmailUrl = new URL("https://mail.google.com/mail/");
			gmailUrl.searchParams.set("view", "cm");
			gmailUrl.searchParams.set("fs", "1");
			gmailUrl.searchParams.set("to", "dineshiperera05@gmail.com");
			gmailUrl.searchParams.set("su", subject);
			gmailUrl.searchParams.set("body", emailBody);
			window.location.href = gmailUrl.toString();
		});
	}

	let storedTheme = null;
	try {
		storedTheme = window.localStorage.getItem("preferred-theme");
	} catch (error) {
		storedTheme = null;
	}

	document.body.classList.toggle("theme-light", storedTheme === "light");

	const themeToggle = document.querySelector(".hero-nav__theme-toggle");
	if (themeToggle) {
		const applyTheme = (isLight) => {
			document.body.classList.toggle("theme-light", isLight);
			themeToggle.classList.toggle("is-active", isLight);
			themeToggle.setAttribute("aria-pressed", isLight ? "true" : "false");
		};

		applyTheme(storedTheme === "light");

		themeToggle.addEventListener("click", () => {
			const nextIsLight = !document.body.classList.contains("theme-light");
			applyTheme(nextIsLight);
			try {
				window.localStorage.setItem("preferred-theme", nextIsLight ? "light" : "dark");
			} catch (error) {
				/* ignore storage errors */
			}
		});
	}

	const heroNav = document.querySelector(".hero-nav");
	const burgerToggle = document.querySelector(".hero-nav__burger");
	const heroNavLinks = Array.from(document.querySelectorAll(".hero-nav__link"));
	const connectCta = document.querySelector(".hero-nav__connect");
	const navMenu = document.getElementById("hero-nav-menu");
	const profileToggle = document.querySelector(".hero-nav__profile-toggle");
	const profileCardShell = document.getElementById("profile-card");
	const profileCard = profileCardShell ? profileCardShell.querySelector(".profile-card") : null;

	let closeNavMenu = null;

	const syncProfileCardState = () => {
		if (!profileCardShell) {
			return;
		}

		if (window.innerWidth > 1024) {
			profileCardShell.classList.remove("profile-card--open");
			profileCardShell.setAttribute("aria-hidden", "false");
			document.body.classList.remove("profile-card-open");
			if (profileToggle) {
				profileToggle.setAttribute("aria-expanded", "false");
			}
			return;
		}

		const isOpen = profileCardShell.classList.contains("profile-card--open");
		profileCardShell.setAttribute("aria-hidden", isOpen ? "false" : "true");
		if (profileToggle) {
			profileToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
		}
		if (isOpen) {
			document.body.classList.add("profile-card-open");
		} else {
			document.body.classList.remove("profile-card-open");
		}
	};

	const closeProfileCard = () => {
		if (!profileCardShell) {
			return;
		}
		profileCardShell.classList.remove("profile-card--open");
		syncProfileCardState();
	};

	const openProfileCard = () => {
		if (!profileCardShell) {
			return;
		}
		if (typeof closeNavMenu === "function") {
			closeNavMenu();
		}
		profileCardShell.classList.add("profile-card--open");
		if (profileCard) {
			profileCard.classList.add("is-visible");
		}
		syncProfileCardState();
		if (window.innerWidth <= 1024) {
			const focusable = profileCardShell.querySelector(
				'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
			);
			if (focusable && focusable instanceof HTMLElement) {
				window.requestAnimationFrame(() => {
					focusable.focus({ preventScroll: true });
				});
			}
		}
	};

	if (heroNav && burgerToggle) {
		const closeMenu = () => {
			heroNav.classList.remove("hero-nav--open");
			burgerToggle.setAttribute("aria-expanded", "false");
			document.body.classList.remove("nav-open");
			if (navMenu) {
				navMenu.setAttribute("aria-hidden", window.innerWidth <= 1024 ? "true" : "false");
			}
		};
		closeNavMenu = closeMenu;

		if (navMenu) {
			navMenu.setAttribute("aria-hidden", window.innerWidth <= 1024 ? "true" : "false");
		}

		burgerToggle.addEventListener("click", () => {
			const willOpen = !heroNav.classList.contains("hero-nav--open");
			if (willOpen) {
				if (profileCardShell?.classList.contains("profile-card--open")) {
					closeProfileCard();
				}
				heroNav.classList.add("hero-nav--open");
				burgerToggle.setAttribute("aria-expanded", "true");
				document.body.classList.add("nav-open");
				if (navMenu) {
					navMenu.setAttribute("aria-hidden", "false");
				}
			} else {
				closeMenu();
			}
		});

		const interactiveItems = connectCta ? [...heroNavLinks, connectCta] : heroNavLinks;
		interactiveItems.forEach((element) => {
			element.addEventListener("click", () => {
				if (window.innerWidth <= 1024) {
					closeMenu();
				}
			});
		});

		window.addEventListener("resize", () => {
			if (window.innerWidth > 1024 && heroNav.classList.contains("hero-nav--open")) {
				closeMenu();
			}
			if (window.innerWidth > 1024) {
				document.body.classList.remove("nav-open");
			}
			if (navMenu) {
				navMenu.setAttribute("aria-hidden", window.innerWidth <= 1024 && !heroNav.classList.contains("hero-nav--open") ? "true" : "false");
			}
		});

		document.addEventListener("keyup", (event) => {
			if (event.key === "Escape" && window.innerWidth <= 1024 && heroNav.classList.contains("hero-nav--open")) {
				closeMenu();
			}
		});

		document.addEventListener("click", (event) => {
			const target = event.target;
			if (
				window.innerWidth <= 1024 &&
				target instanceof Node &&
				!heroNav.contains(target) &&
				heroNav.classList.contains("hero-nav--open")
			) {
				closeMenu();
			}
		});
	}

	syncProfileCardState();

	if (profileToggle && profileCardShell) {
		profileToggle.addEventListener("click", () => {
			const isOpen = profileCardShell.classList.contains("profile-card--open");
			if (isOpen) {
				closeProfileCard();
			} else {
				openProfileCard();
			}
		});
	}

	window.addEventListener("resize", () => {
		syncProfileCardState();
	});

	document.addEventListener("keyup", (event) => {
		if (event.key === "Escape" && window.innerWidth <= 1024 && profileCardShell?.classList.contains("profile-card--open")) {
			closeProfileCard();
		}
	});

	document.addEventListener("click", (event) => {
		if (window.innerWidth > 1024 || !profileCardShell?.classList.contains("profile-card--open")) {
			return;
		}
		const target = event.target;
		if (!(target instanceof Node)) {
			return;
		}
		if ((profileToggle && profileToggle.contains(target)) || profileCardShell.contains(target)) {
			return;
		}
		closeProfileCard();
	});

	const attachHorizontalScroller = (container, prevButton, nextButton, dots) => {
		if (!container || !prevButton || !nextButton) {
			return;
		}

		const getStep = () => {
			const items = Array.from(container.children).filter((child) => child instanceof HTMLElement);
			if (items.length >= 2) {
				const firstRect = items[0].getBoundingClientRect();
				const secondRect = items[1].getBoundingClientRect();
				const delta = Math.abs(secondRect.left - firstRect.left);
				if (delta > 0) {
					return delta;
				}
			}
			if (items.length === 1) {
				return items[0].getBoundingClientRect().width;
			}
			return container.clientWidth;
		};

		const updateDots = (index) => {
			if (!Array.isArray(dots) || dots.length === 0) {
				return;
			}
			const clampedIndex = Math.max(0, Math.min(dots.length - 1, index));
			dots.forEach((dot, dotIndex) => {
				dot.setAttribute("aria-selected", dotIndex === clampedIndex ? "true" : "false");
			});
		};

		const updateButtonState = () => {
			const items = Array.from(container.children).filter((child) => child instanceof HTMLElement);
			if (items.length <= 1) {
				prevButton.disabled = true;
				nextButton.disabled = true;
				updateDots(0);
				return;
			}

			const step = getStep();
			const rawIndex = step > 0 ? container.scrollLeft / step : 0;
			const currentIndex = Math.max(0, Math.min(items.length - 1, Math.round(rawIndex)));

			prevButton.disabled = currentIndex <= 0;
			nextButton.disabled = currentIndex >= items.length - 1;
			updateDots(currentIndex);
		};

		const scrollByStep = (direction) => {
			const items = Array.from(container.children).filter((child) => child instanceof HTMLElement);
			if (items.length <= 1) {
				return;
			}
			const step = getStep();
			if (step <= 0) {
				return;
			}
			const rawIndex = container.scrollLeft / step;
			const targetIndex = Math.max(0, Math.min(items.length - 1, Math.round(rawIndex + direction)));
			container.scrollTo({ left: targetIndex * step, behavior: "smooth" });
		};

		prevButton.addEventListener("click", () => {
			scrollByStep(-1);
		});

		nextButton.addEventListener("click", () => {
			scrollByStep(1);
		});

		if (Array.isArray(dots) && dots.length > 0) {
			dots.forEach((dot, index) => {
				dot.addEventListener("click", () => {
					const step = getStep();
					if (step <= 0) {
						return;
					}
					container.scrollTo({ left: index * step, behavior: "smooth" });
				});
			});
		}

		container.addEventListener("scroll", () => {
			updateButtonState();
		});

		window.addEventListener("resize", updateButtonState);

		updateButtonState();
	};

	const projectsGrid = document.querySelector(".projects__grid");
	const projectsPrevButton = document.querySelector(".projects__control--prev");
	const projectsNextButton = document.querySelector(".projects__control--next");
	attachHorizontalScroller(projectsGrid, projectsPrevButton, projectsNextButton, null);

	const resumeGrid = document.querySelector(".resume__cards");
	const resumePrevButton = document.querySelector(".resume__control--prev");
	const resumeNextButton = document.querySelector(".resume__control--next");
	const resumeDots = Array.from(document.querySelectorAll(".resume__dot"));
	attachHorizontalScroller(resumeGrid, resumePrevButton, resumeNextButton, resumeDots);

	const revealSelectors = [
		".profile-card",
		".hero-copy",
		".about__description",
		".about__card",
		".project-card",
		".projects__more",
		".resume-card",
		".tool-card",
		".contact__card",
	];
	const revealElements = revealSelectors
		.map((selector) => Array.from(document.querySelectorAll(selector)))
		.flat();

	revealElements.forEach((element) => {
		element.classList.add("reveal");
	});

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add("is-visible");
				} else {
					entry.target.classList.remove("is-visible");
				}
			});
		},
		{
			threshold: 0.15,
			rootMargin: "0px 0px -40px 0px",
		}
	);

	revealElements.forEach((element) => {
		observer.observe(element);
	});
});
