document.addEventListener("DOMContentLoaded", documentEvents, false);

function documentEvents() {
  const clearBtn = document.getElementById("clear");
  const submitBtn = document.getElementById("submit");
  const inputTxt = document.getElementById("imgUrlInput");

  submitBtn.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        cmd: "setBg",
        css: convertIntoCss(inputTxt.value),
      });
      chrome.storage.sync.set({ image: inputTxt.value }, () => {});
      inputTxt.value = "";
    });

    const notifOptions = {
      type: "basic",
      iconUrl: "images/background48.png",
      title: "Background notifcation",
      message: "Congrats you have added your background image!",
    };
    chrome.notifications.create("", notifOptions, function () {
      console.log("Last error:", chrome.runtime.lastError);
    });
  });

  clearBtn.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { cmd: "clearBg" });

      chrome.storage.sync.set({ image: "" }, () => {});
    });
  });
}

function convertIntoCss(url) {
  const css = `html body { 
        background: url(${url}); \n
        image-rendering: crisp-edges; \n        
        image-rendering: -webkit-optimize-contrast; \n
        background-size:     cover; \n
        background-repeat:   no-repeat; \n
        background-position: center center; \n    
      }\n`;
  return css;
}
