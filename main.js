const main = function() {
  if(window.location.href.match(/^https:\/\/outlook\.office\.com\/mail\//) ||
     window.location.href.match(/^https:\/\/outlook\.office365\.com\/calendar\//)) {
    chrome.storage.sync.get({"interval": 10, "enabled" : true}, function(result) {
      if(!result.enabled) {
        console.log("[Outlook Reloader] Disabled, will not reload.");
        return;
      }
      console.log("[Outlook Reloader] Will reload after " + result.interval + " minutes.");
      let timeout = 1000 * 60 * result.interval;
      let timerId = setTimeout(reload, timeout);
      ["keydown", "mousedown"].forEach(function(event) {
        document.addEventListener(event, function() {
          console.log("[Outlook Reloader] Timeout reset");
          clearTimeout(timerId);
          console.log("[Outlook Reloader] Will reload after " + result.interval + " minutes.");
          timerId = setTimeout(reload, timeout);
        }, false);
      });
    });
  }
};

const reload = function() {
  if(navigator.onLine) {
    window.location.reload(true);
  } else {
    console.log("[Outlook Reloader] Is not online. Will retry after 5 seconds ...");
    let timerId = setInterval(function() {
      if(navigator.onLine) {
        clearInterval(timerId);
        window.location.reload(true);
      } else {
        console.log("[Outlook Reloader] Is not online. Will retry after 5 seconds ...");
      }
    }, 5000);
  }
};

const log = function(text) {
  chrome.storage.sync.get({"logs": []}, function(result) {
    let logs = result.logs;
    logs.unshift(formatDate(new Date()) + " " + text);
    chrome.storage.sync.set({"logs": logs.slice(0, 10)});
  });
};

// https://qiita.com/osakanafish/items/c64fe8a34e7221e811d0
const formatDate = function (date, format) {
  if (!format) format = 'YYYY-MM-DD hh:mm:ss.SSS';
  format = format.replace(/YYYY/g, date.getFullYear());
  format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
  format = format.replace(/DD/g, ('0' + date.getDate()).slice(-2));
  format = format.replace(/hh/g, ('0' + date.getHours()).slice(-2));
  format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
  format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
  if (format.match(/S/g)) {
    var milliSeconds = ('00' + date.getMilliseconds()).slice(-3);
    var length = format.match(/S/g).length;
    for (var i = 0; i < length; i++) format = format.replace(/S/, milliSeconds.substring(i, i + 1));
  }
  return format;
};

main();
