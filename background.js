browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "login") {
    browser.tabs.query({ active: true, currentWindow: true }).then(tabs => {
      const tab = tabs[0];
      if (!tab) return;
      browser.scripting.executeScript({
        target: { tabId: tab.id },
        func: (token) => {
          function iframeLogin(t) {
            const iframe = document.createElement("iframe");
            document.body.appendChild(iframe);
            iframe.contentWindow.localStorage.token = `"${t}"`;
            iframe.remove();
          }
          const interval = setInterval(() => iframeLogin(token), 50);
          setTimeout(() => {
            clearInterval(interval);
            location.reload();
          }, 2500);
        },
        args: [message.token]
      });
    });
    browser.storage.local.set({ lastToken: message.token });
  }

  if (message.action === "copyToken") {
    browser.tabs.query({ active: true, currentWindow: true }).then(async tabs => {
      const tab = tabs[0];
      if (!tab) {
        sendResponse({ token: null });
        return;
      }
      try {
        const results = await browser.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => {
            try {
              const raw = window.localStorage.getItem("token");
              return raw ? raw.replace(/^"|"$/g, "") : null;
            } catch (e) {
              return null;
            }
          }
        });
        sendResponse({ token: results && results[0] ? results[0].result : null });
      } catch (e) {
        sendResponse({ token: null });
      }
    });
    return true;
  }
});