document.addEventListener("DOMContentLoaded", () => {
  browser.storage.local.get("lastToken").then(data => {
    if (data.lastToken) {
      document.getElementById("tokenInput").value = data.lastToken;
    }
  });
});

document.getElementById("loginBtn").addEventListener("click", () => {
  const token = document.getElementById("tokenInput").value.trim();
  const status = document.getElementById("status");
  if (!token) {
    status.textContent = "Please enter a token.";
    return;
  }
  browser.runtime.sendMessage({ action: "login", token });
  status.textContent = "Logging in...";
});

document.getElementById("copyBtn").addEventListener("click", () => {
  const status = document.getElementById("status");
  browser.runtime.sendMessage({ action: "copyToken" }).then(response => {
    if (response && response.token) {
      navigator.clipboard
        .writeText(response.token)
        .then(() => (status.textContent = "Token copied to clipboard!"))
        .catch(() => (status.textContent = "Failed to copy token."));
    } else {
      status.textContent = "No token found on this page.";
    }
  });
});