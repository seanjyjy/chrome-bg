function loadCSS(css) {
  var head = document.head || document.getElementsByTagName("head")[0];
  const style = document.createElement("style");
  style.id = "extension";
  style.textContent = css;
  head.appendChild(style);
}

function unloadCSS() {
  var cssNode = document.getElementById("extension");
  cssNode?.parentNode?.removeChild(cssNode);
}

function setBg(css) {
  unloadCSS();
  setTimeout(() => loadCSS(css));
}

chrome.runtime.onMessage.addListener((req, p1, p2) => {
  if (req.cmd === "setBg") {
    setBg(req.css);
  } else if (req.cmd === "clearBg") {
    unloadCSS();
  } else if (req.cmd === "fetchBg") {
    chrome.storage.sync.get("image", (url) => {
      if (url.image) {
        setBg(convertIntoCss(url.image));
      }
    });
  }
});

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
