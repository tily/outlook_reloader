chrome.storage.sync.get({"interval": 10}, function(result) {
  document.querySelector("#interval").value = result.interval;
});

chrome.storage.sync.get({"logs": [], "enabled": true}, function(result) {
  document.querySelector("#logs").innerHTML = result.logs.join("<br>");
  document.querySelector("#enabled").checked = result.enabled;
});

document.querySelector("#update-interval").onclick = function(event) {
  let interval = parseInt(document.querySelector("#interval").value);
  if(!isNaN(interval)) {
    chrome.storage.sync.set({"interval": interval});
  }
};

document.querySelector("#enabled").onchange = function(event) {
  enabled = document.querySelector("#enabled").checked;
  chrome.storage.sync.set({"enabled": enabled});
};