document.addEventListener("DOMContentLoaded", () => {
    const year = String(new Date().getFullYear());
    document.querySelectorAll("[data-year]").forEach((element) => {
        element.textContent = year;
    });

    const themeToggle = document.querySelector(".theme-toggle");
    const themeColor = document.querySelector('meta[name="theme-color"]');
    const setTheme = (theme, persist = false) => {
        const isDark = theme === "dark";
        document.documentElement.dataset.theme = isDark ? "dark" : "light";
        if (themeColor) themeColor.content = isDark ? "#101b29" : "#ffffff";
        if (themeToggle) {
            const label = isDark ? "Switch to light mode" : "Switch to dark mode";
            themeToggle.setAttribute("aria-label", label);
            themeToggle.setAttribute("title", label);
            themeToggle.setAttribute("aria-pressed", String(isDark));
        }
        if (persist) {
            try {
                localStorage.setItem("jec-theme", isDark ? "dark" : "light");
            } catch (error) {
                console.warn("Unable to save the theme preference.", error);
            }
        }
    };

    setTheme(document.documentElement.dataset.theme);
    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
            setTheme(nextTheme, true);
        });
    }

    const menuButton = document.querySelector(".menu-toggle");
    const navigation = document.querySelector(".primary-nav");
    if (menuButton && navigation) {
        menuButton.addEventListener("click", () => {
            const isOpen = menuButton.getAttribute("aria-expanded") === "true";
            menuButton.setAttribute("aria-expanded", String(!isOpen));
            menuButton.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
            navigation.classList.toggle("is-open", !isOpen);
        });
        navigation.addEventListener("click", (event) => {
            if (event.target instanceof HTMLAnchorElement && window.matchMedia("(max-width: 900px)").matches) {
                menuButton.setAttribute("aria-expanded", "false");
                menuButton.setAttribute("aria-label", "Open navigation");
                navigation.classList.remove("is-open");
            }
        });
        window.addEventListener("resize", () => {
            if (!window.matchMedia("(max-width: 900px)").matches) {
                menuButton.setAttribute("aria-expanded", "false");
                menuButton.setAttribute("aria-label", "Open navigation");
                navigation.classList.remove("is-open");
            }
        });
    }

    const cards = Array.from(document.querySelectorAll(".course-card"));
    if (cards.length) {
        const search = document.querySelector("#course-search");
        const filters = Array.from(document.querySelectorAll(".filter-button"));
        const emptyState = document.querySelector("#course-empty");
        let activeFilter = "all";

        const updateCourses = () => {
            const term = search.value.trim().toLowerCase();
            let visibleCount = 0;
            cards.forEach((card) => {
                const matchesFilter = activeFilter === "all" || card.dataset.category === activeFilter;
                const matchesSearch = card.dataset.search.includes(term) || card.textContent.toLowerCase().includes(term);
                const isVisible = matchesFilter && matchesSearch;
                card.hidden = !isVisible;
                if (isVisible) visibleCount += 1;
            });
            emptyState.hidden = visibleCount > 0;
        };

        search.addEventListener("input", updateCourses);
        filters.forEach((button) => {
            button.addEventListener("click", () => {
                activeFilter = button.dataset.filter;
                filters.forEach((filter) => {
                    const isActive = filter === button;
                    filter.classList.toggle("is-active", isActive);
                    filter.setAttribute("aria-pressed", String(isActive));
                });
                updateCourses();
            });
        });
    }

    const form = document.querySelector("#contact-form");
    if (form) {
        const feedback = document.querySelector("#form-feedback");
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            const fields = Array.from(form.querySelectorAll("input[required], textarea[required], input[type='tel']"));
            let firstInvalid = null;
            fields.forEach((field) => {
                const invalid = !field.checkValidity();
                field.setAttribute("aria-invalid", String(invalid));
                if (invalid && !firstInvalid) firstInvalid = field;
            });

            if (firstInvalid) {
                feedback.textContent = "Please check the highlighted fields and enter valid information.";
                feedback.classList.add("is-error");
                firstInvalid.focus();
                return;
            }

            feedback.textContent = "Your details pass validation, but this demo form cannot send messages. Please contact the college through a verified channel.";
            feedback.classList.remove("is-error");
        });

        form.addEventListener("input", (event) => {
            if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
                event.target.removeAttribute("aria-invalid");
                feedback.textContent = "";
                feedback.classList.remove("is-error");
            }
        });
    }
});
