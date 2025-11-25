
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

			const subject = encodeURIComponent(`Portfolio Inquiry from ${firstName} ${lastName}`);
			const emailBody = [
				`Name: ${firstName} ${lastName}`,
				`Email: ${email}`,
				`Phone: ${phone}`,
				"",
				"Message:",
				message,
			].join("\n");

			const mailtoLink = `mailto:dineshiperera05@gmail.com?subject=${subject}&body=${encodeURIComponent(emailBody)}`;
			window.location.href = mailtoLink;
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
