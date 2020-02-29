const button = document.getElementById("copy");
button.addEventListener("click", function() {
  chrome.tabs.query({active: true, currentWindow: true}, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, { type: 'CLICK_COPY' });
  });
})
