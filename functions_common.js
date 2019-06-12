var useLocalStorage = !0, storageVariableIWillUse;
storageVariableIWillUse = useLocalStorage ? chrome.storage.local : chrome.storage.sync;
function sendMessageToContentScript(a) {
  chrome.tabs.query({active:!0, currentWindow:!0}, function(b) {
    null != b && null != b[0] && chrome.tabs.sendMessage(b[0].id, {message:a});
  });
}
function getCurrentTabURL(a) {
  chrome.tabs.query({active:!0, currentWindow:!0}, function(b) {
    a(b[0].url, b[0].id);
  });
}
function getStoredVariable(a, b) {
  storageVariableIWillUse.get([a], function(a) {
    if (0 < Object.keys(a).length) {
      var c = Object.keys(a)[0];
      valueStored = a[c];
      b(valueStored);
    } else {
      b(null);
    }
  });
}
function setStoredVariable(a, b, c) {
  c = {};
  storageVariableIWillUse.set((c[a] = b, c), function() {
  });
}
function convertArrayOfKeyMapArrayToCSV(a, b, c) {
  b = void 0 === b ? !1 : b;
  c = void 0 === c ? null : c;
  var d = "";
  if (null != a) {
    for (i = 0; i < a.length; i++) {
      var e = "", f = a[i];
      for (key in f) {
        if (b && 0 == i) {
          if (null !== c) {
            for (k = 0; k < c.length; k++) {
              c[k] == key && (d += key + ",");
            }
          } else {
            d += key + ",";
          }
        }
        if (null !== c) {
          for (k = 0; k < c.length; k++) {
            c[k] == key && (e += f[key] + ",");
          }
        } else {
          e += f[key] + ",";
        }
      }
      b && 0 == i && (d = removeLastCommaIfItIsInEndOfTheLine(d) + "\n");
      e = removeLastCommaIfItIsInEndOfTheLine(e);
      d = i == a.length - 1 ? d + e : d + (e + "\n");
    }
    return d;
  }
}
function setBadgeText(a) {
  chrome.browserAction.setBadgeText({text:a});
}
function setBadgeColor(a) {
  chrome.browserAction.setBadgeBackgroundColor({color:a});
}
function convertUsernamesInfosArrayOfHashMapToTable(a, b) {
  b = void 0 === b ? !1 : b;
  var c = "";
  for (i = 0; i < a.length; i++) {
    c += "<tr>";
    b && (c += "<td class='tdNumUsernameList'>" + (i + 1) + "</td>");
    var d = a[i];
    c += "<td class='tdImgSrcList'><a target=_blank href='https://www.instagram.com/" + d.username + "'><img class='imgInstagram' link='" + d.imgSrc + "' width='30px' src='" + d.imgSrc + "'/></a></td>";
    c += "<td class='tdUsernamesList'><a target=_blank href='https://www.instagram.com/" + d.username + "'>" + d.username + "</a></td>";
    c += "<td class='tdIsFollowedList'>" + d.isFollowAlreadyAsked + "</td>";
    c += "</tr>";
  }
  return c;
}
function removeLastCommaIfItIsInEndOfTheLine(a) {
  null !== a && 1 < a.length && "," == a[a.length - 1] ? a = a.substr(0, a.length - 1) : 1 == a.length && "," == a[a.length] && (a = "");
  return a;
}
function saveCSVContentToFile(a, b) {
  a = void 0 === a ? "test,caca,pipi" : a;
  b = void 0 === b ? "instagram_list.csv" : b;
  var c = document.createElement("a");
  c.href = "data:text/csv;charset=utf-8," + encodeURIComponent(a);
  c.download = b;
  document.body.appendChild(c);
  c.click();
  document.body.removeChild(c);
}
function saveToTxt(a, b) {
  b = void 0 === b ? "instagram_list.txt" : b;
  var c = document.createElement("a");
  c.href = "data:text;charset=utf-8," + encodeURIComponent(a);
  c.download = b;
  document.body.appendChild(c);
  c.click();
  document.body.removeChild(c);
}
function saveToHTML(a, b) {
  b = void 0 === b ? "instagram_list.html" : b;
  var c = document.createElement("a");
  c.href = "data:text/html;charset=utf-8," + encodeURIComponent(a);
  c.download = b;
  document.body.appendChild(c);
  c.click();
  document.body.removeChild(c);
}
function getDateAndTimeString() {
  var a = new Date, b = a.toLocaleDateString();
  b = replaceAll(b, "/", "-");
  return b + "_" + a.toLocaleTimeString().replace(":", "h").replace(":", "m").replace(" ", "");
}
function replaceAll(a, b, c) {
  return a.replace(new RegExp(b, "g"), c);
}
function fallbackCopyTextToClipboard(a) {
  var b = document.createElement("textarea");
  b.textContent = a;
  b.value = a;
  document.body.appendChild(b);
  a = document.getSelection();
  var c = document.createRange();
  c.selectNode(b);
  a.removeAllRanges();
  a.addRange(c);
  c = document.execCommand("copy");
  a.removeAllRanges();
  document.body.removeChild(b);
  return c;
}
function copyTextToClipboard(a) {
  return fallbackCopyTextToClipboard(a);
}
;