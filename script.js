    const panels = Object.fromEntries([...document.querySelectorAll("[data-panel]")].map(panel => [panel.dataset.panel, panel]));
    function openPanel(name) {
      if (name === "terminal") {
        window.alert("Terminal ready — type 'help' to explore Pixel Meadow.");
        return;
      }
      if (panels[name]) panels[name].classList.remove("hidden", "minimized");
    }
    document.querySelectorAll("[data-window]").forEach(button => button.addEventListener("click", () => openPanel(button.dataset.window)));
    document.querySelectorAll(".window").forEach(windowElement => {
      windowElement.querySelector(".dot.yellow")?.addEventListener("click", () => {
        windowElement.classList.remove("maximized");
        windowElement.classList.add("minimized");
      });
      windowElement.querySelector(".dot.green")?.addEventListener("click", () => {
        windowElement.classList.toggle("maximized");
        windowElement.classList.remove("minimized");
      });
      windowElement.querySelector(".dot.red.close")?.addEventListener("click", () => {
        windowElement.classList.remove("maximized", "minimized");
        windowElement.classList.add("hidden");
      });
    });
    document.querySelector(".toast button").addEventListener("click", event => event.currentTarget.closest(".toast").remove());
    document.querySelector(".play").addEventListener("click", event => {
      event.currentTarget.textContent = event.currentTarget.textContent === "▶" ? "Ⅱ" : "▶";
    });
    const browserForm = document.querySelector("#browser-form");
    const urlInput = document.querySelector("#url-input");
    const siteFrame = document.querySelector("#site-frame");
    const browserWelcome = document.querySelector("#browser-welcome");
    const history = [];
    let historyIndex = -1;

    function loadWebsite(value, saveToHistory = true) {
      const typedValue = value.trim();
      const url = new URL(/^https?:\/\//i.test(typedValue) ? typedValue : `https://${typedValue}`);
      if (!["http:", "https:"].includes(url.protocol)) throw new Error("Only web URLs are supported.");
      const normalizedUrl = url.href;
      urlInput.value = normalizedUrl;
      siteFrame.src = normalizedUrl;
      siteFrame.hidden = false;
      browserWelcome.hidden = true;
      if (saveToHistory) {
        history.splice(historyIndex + 1);
        history.push(normalizedUrl);
        historyIndex = history.length - 1;
      }
    }

    browserForm.addEventListener("submit", event => {
      event.preventDefault();
      try {
        loadWebsite(urlInput.value);
      } catch {
        urlInput.setCustomValidity("Enter a valid website URL.");
        urlInput.reportValidity();
      }
    });
    urlInput.addEventListener("input", () => urlInput.setCustomValidity(""));
    document.querySelectorAll(".browser-links [data-url]").forEach(button => button.addEventListener("click", () => {
      loadWebsite(button.dataset.url);
    }));
    document.querySelector("#browser-reload").addEventListener("click", () => {
      if (siteFrame.src) siteFrame.src = siteFrame.src;
    });
    document.querySelector("#browser-back").addEventListener("click", () => {
      if (historyIndex > 0) {
        historyIndex -= 1;
        loadWebsite(history[historyIndex], false);
      }
    });
    document.querySelector("#browser-forward").addEventListener("click", () => {
      if (historyIndex < history.length - 1) {
        historyIndex += 1;
        loadWebsite(history[historyIndex], false);
      }
    });
    function updateClock() {
      const now = new Date();
      document.querySelector("#clock").textContent = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
      document.querySelector("#date").textContent = now.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric", year: "numeric" });
    }
    updateClock(); setInterval(updateClock, 30000);
