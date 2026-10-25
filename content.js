(function () {
  function createToast(message) {
    const existing = document.getElementById("dtl-toast");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.id = "dtl-toast";
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add("dtl-toast-show"));

    setTimeout(() => {
      toast.classList.remove("dtl-toast-show");
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  }

  function getToken() {
    try {
      const raw = window.localStorage.getItem("token");
      if (!raw) return null;
      return raw.replace(/^"|"$/g, "");
    } catch (e) {
      return null;
    }
  }

  function copyToken() {
    const token = getToken();
    if (!token) {
      createToast("No token found!");
      return;
    }
    navigator.clipboard
      .writeText(token)
      .then(() => createToast("Token copied to clipboard!"))
      .catch(() => createToast("Failed to copy token."));
  }

  function injectButton() {
    if (document.getElementById("dtl-copy-token-btn")) return;
    const btn = document.createElement("button");
    btn.id = "dtl-copy-token-btn";
    btn.textContent = "Copy Token";
    btn.addEventListener("click", copyToken);
    document.body.appendChild(btn);
  }

  const observer = new MutationObserver(() => injectButton());
  observer.observe(document.documentElement, { childList: true, subtree: true });

  injectButton();
})();