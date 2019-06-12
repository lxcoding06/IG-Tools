var modeFollowTrueOrFalseForUnfollow = !0, radioBoxFollow = document.getElementById("radioBoxFollow"), radioBoxUnfollow = document.getElementById("radioBoxUnfollow"), radioBoxScrape = document.getElementById("radioBoxScrape"), labelRadioBoxFollow = document.getElementById("labelRadioBoxFollow"), labelRadioBoxUnFollow = document.getElementById("labelRadioBoxUnFollow"), labelRadioBoxScrape = document.getElementById("labelRadioBoxScrape"), divStatus = document.getElementById("divStatus"), divTimer = 
document.getElementById("divTimer"), buttonStart = document.getElementById("buttonStart"), buttonStop = document.getElementById("buttonStop"), inputNumberDelaySecMin = document.getElementById("inputNumberDelaySecMin"), inputNumberDelaySecMax = document.getElementById("inputNumberDelaySecMax"), inputNumberFollowUnfollowMax = document.getElementById("inputNumberFollowUnfollowMax"), inputNumberBreakTimeInMins = document.getElementById("inputNumberBreakTimeInMins"), inputNumberBreakEveryXFollowsOrUnfollows = 
document.getElementById("inputNumberBreakEveryXFollowsOrUnfollows"), inputNumberSleepTimeScrapeSeconds = document.getElementById("inputNumberSleepTimeScrapeSeconds"), inputNumberSleepEveryXUsernamesScraped = document.getElementById("inputNumberSleepEveryXUsernamesScraped"), inputNumberUsernamesScrapedMax = document.getElementById("inputNumberUsernamesScrapedMax"), divConfigurationFollowOrUnfollow = document.getElementById("divConfigurationFollowOrUnfollow"), divConfigurationScrape = document.getElementById("divConfigurationScrape"), 
tdNbUsernamesScraped = document.getElementById("tdNbUsernamesScraped"), textAreaUsernamesList = document.getElementById("textAreaUsernamesList"), divTextAreaUsernamesList = document.getElementById("divTextAreaUsernamesList"), divNbFollows = document.getElementById("divNbFollows"), divNbUnfollows = document.getElementById("divNbUnfollows"), divLastFollowed = document.getElementById("divLastFollowed"), divLastUnFollowed = document.getElementById("divLastUnFollowed"), tdStatus = document.getElementById("tdStatus"), 
tdCopyUsernames = document.getElementById("tdCopyUsernames"), tdClear = document.getElementById("tdClear"), thNumUsername = document.getElementById("thNumUsername"), thImgSrc = document.getElementById("thImgSrc"), thUsernames = document.getElementById("thUsernames"), thIsFollowed = document.getElementById("thIsFollowed"), buttonExportCSV = document.getElementById("exportCSV"), buttonExportXLS = document.getElementById("exportXLS"), buttonExportTXT = document.getElementById("exportTXT"), buttonExportHTML = 
document.getElementById("exportHTML"), usernamesInfoContentArrayOfKeyMapArray = null;
toggleOpacityRadioBox();
toggleHideFollowsUnfollowsLastUsername();
radioBoxFollow.addEventListener("change", function() {
  stop();
  toggleOpacityRadioBox();
  toggleHideFollowsUnfollowsLastUsername();
});
radioBoxUnfollow.addEventListener("change", function() {
  stop();
  toggleOpacityRadioBox();
  toggleHideFollowsUnfollowsLastUsername();
});
radioBoxScrape.addEventListener("change", function() {
  stop();
  toggleOpacityRadioBox();
  toggleHideFollowsUnfollowsLastUsername();
});
thNumUsername.onclick = function(a) {
};
thImgSrc.onclick = function(a) {
};
thUsernames.onclick = function(a) {
  alert("copy usernames");
};
thIsFollowed.onclick = function(a) {
};
tdCopyUsernames.onclick = function(a) {
  copyUsernames();
};
tdClear.onclick = function(a) {
  clearTable();
};
buttonExportCSV.onclick = function(a) {
  saveCSVContentToFile(convertArrayOfKeyMapArrayToCSV(usernamesInfoContentArrayOfKeyMapArray, !1, null), "instagram_list_" + getDateAndTimeString() + ".csv");
};
buttonExportXLS.onclick = function(a) {
  exportTableToExcel("instagram_list_" + getDateAndTimeString() + ".xls");
};
buttonExportTXT.onclick = function(a) {
  saveToTxt(convertArrayOfKeyMapArrayToCSV(usernamesInfoContentArrayOfKeyMapArray, !1, null), "instagram_list_" + getDateAndTimeString() + ".txt");
};
buttonExportHTML.onclick = function(a) {
  saveToHTML(document.getElementById("tableUsernamesInfos").outerHTML, "instagram_list_" + getDateAndTimeString() + ".html");
};
buttonStart.onclick = function(a) {
  start();
};
buttonStop.onclick = function(a) {
  stop();
};
function toggleHideFollowsUnfollowsLastUsername() {
  radioBoxScrape.checked ? (document.getElementById("trFollows").style.display = "none", document.getElementById("trUnfollows").style.display = "none", document.getElementById("trLastUsername").style.display = "none", divConfigurationScrape.style.display = "block", divConfigurationFollowOrUnfollow.style.display = "none") : (document.getElementById("trFollows").style.display = "table-row", document.getElementById("trUnfollows").style.display = "table-row", document.getElementById("trLastUsername").style.display = 
  "table-row", divConfigurationScrape.style.display = "none", divConfigurationFollowOrUnfollow.style.display = "block");
}
function colorStatus() {
  tdStatus.style.backgroundColor = "STOPPED" == divStatus.innerHTML ? "#f44336" : "#008CBA";
}
chrome.extension.onMessage.addListener(function(a, b, c) {
  "undefined" !== typeof a && "undefined" !== typeof a && ("refresh" == a.type ? (divStatus.innerHTML = "SLEEPING" == a.status ? "Sleep started at " + a.dateStartSleep : "STARTED" == a.status ? "STARTED" : "STOPPED", colorStatus(), divNbFollows.innerText = a.follows, divNbUnfollows.innerText = a.unfollows, configuration.radioBoxFollow ? divLastFollowed.innerText = a.lastFollowedUsername : configuration.radioBoxUnfollow ? divLastFollowed.innerText = a.lastUnFollowedUsername : configuration.radioBoxScrape && 
  "undefined" !== typeof a.allUsernamesAndInfoInArray && (usernamesInfoContentArrayOfKeyMapArray = a.allUsernamesAndInfoInArray, document.getElementById("tBodyUsernamesInfoList").innerHTML = convertUsernamesInfosArrayOfHashMapToTable(usernamesInfoContentArrayOfKeyMapArray, !0), convertArrayOfKeyMapArrayToCSV(usernamesInfoContentArrayOfKeyMapArray), tdNbUsernamesScraped.innerHTML = a.nbUsernamesInfoScraped)) : "STOP" == a.type ? stop() : "refreshTime" == a.type && (divTimer = a.time));
});
var configuration = {};
loadConfiguration();
refreshDataFromContentScript();
colorStatus();
function toggleOpacityRadioBox() {
  labelRadioBoxFollow.style.opacity = radioBoxFollow.checked ? 1 : 0.6;
  labelRadioBoxUnFollow.style.opacity = radioBoxUnfollow.checked ? 1 : 0.6;
  labelRadioBoxScrape.style.opacity = radioBoxScrape.checked ? 1 : 0.6;
}
function loadConfiguration() {
  console.log("loadConfiguration()");
  getStoredVariable("config", function(a) {
    null !== a && (configuration = a, radioBoxFollow.checked = configuration.radioBoxFollow, radioBoxUnfollow.checked = configuration.radioBoxUnfollow, radioBoxScrape.checked = configuration.radioBoxScrape, toggleOpacityRadioBox(), toggleHideFollowsUnfollowsLastUsername(), applyValueIfValueExists(inputNumberDelaySecMin, configuration.inputNumberDelaySecMin), applyValueIfValueExists(inputNumberDelaySecMax, configuration.inputNumberDelaySecMax), applyValueIfValueExists(inputNumberFollowUnfollowMax, 
    configuration.inputNumberFollowUnfollowMax), applyValueIfValueExists(inputNumberBreakTimeInMins, configuration.inputNumberBreakTimeInMins), applyValueIfValueExists(inputNumberBreakEveryXFollowsOrUnfollows, configuration.inputNumberBreakEveryXFollowsOrUnfollows), applyValueIfValueExists(inputNumberSleepTimeScrapeSeconds, configuration.inputNumberSleepTimeScrapeSeconds), applyValueIfValueExists(inputNumberSleepEveryXUsernamesScraped, configuration.inputNumberSleepEveryXUsernamesScraped), applyValueIfValueExists(inputNumberUsernamesScrapedMax, 
    configuration.inputNumberUsernamesScrapedMax));
  });
}
function applyValueIfValueExists(a, b) {
  null !== a && "undefined" !== typeof a && null !== b && "undefined" !== typeof b && (a.value = b);
}
function saveConfiguration() {
  console.log("saveConfiguration()");
  setStoredVariable("config", configuration, null);
}
function getConfigurationFromInputValues() {
  console.log("getConfigurationFromInputValues()");
  configuration.radioBoxFollow = radioBoxFollow.checked;
  configuration.radioBoxUnfollow = radioBoxUnfollow.checked;
  if (configuration.radioBoxScrape = radioBoxScrape.checked) {
    if (!0 === checkIfValueIsCorrect(inputNumberSleepTimeScrapeSeconds)) {
      configuration.inputNumberSleepTimeScrapeSeconds = inputNumberSleepTimeScrapeSeconds.value;
    } else {
      return !1;
    }
    if (!0 === checkIfValueIsCorrect(inputNumberSleepEveryXUsernamesScraped, 12)) {
      configuration.inputNumberSleepEveryXUsernamesScraped = inputNumberSleepEveryXUsernamesScraped.value;
    } else {
      return !1;
    }
    if (!0 === checkIfValueIsCorrect(inputNumberUsernamesScrapedMax, 1)) {
      configuration.inputNumberUsernamesScrapedMax = inputNumberUsernamesScrapedMax.value;
    } else {
      return !1;
    }
  } else {
    if (!0 === checkIfValueIsCorrect(inputNumberDelaySecMin)) {
      configuration.inputNumberDelaySecMin = inputNumberDelaySecMin.value;
    } else {
      return !1;
    }
    if (!0 === checkIfValueIsCorrect(inputNumberDelaySecMax)) {
      configuration.inputNumberDelaySecMax = inputNumberDelaySecMax.value;
    } else {
      return !1;
    }
    if (!0 === checkIfValueIsCorrect(inputNumberFollowUnfollowMax)) {
      configuration.inputNumberFollowUnfollowMax = inputNumberFollowUnfollowMax.value;
    } else {
      return !1;
    }
    if (!0 === checkIfValueIsCorrect(inputNumberBreakTimeInMins)) {
      configuration.inputNumberBreakTimeInMins = inputNumberBreakTimeInMins.value;
    } else {
      return !1;
    }
    if (!0 === checkIfValueIsCorrect(inputNumberBreakEveryXFollowsOrUnfollows, 2)) {
      configuration.inputNumberBreakEveryXFollowsOrUnfollows = inputNumberBreakEveryXFollowsOrUnfollows.value;
    } else {
      return !1;
    }
  }
  return !0;
}
function checkIfValueIsCorrect(a, b) {
  b = void 0 === b ? 1 : b;
  console.log(a.value);
  console.log("input.value");
  console.log(b);
  if (null !== a && null !== a.value) {
    if (-1 < a.value.indexOf(".")) {
      return !1;
    }
    if (a.value >= b) {
      return !0;
    }
    alert(a.value + " is incorrect, minimum is " + b);
  }
  return !1;
}
function stop() {
  console.log("stop()");
  divStatus.innerHTML = "STOPPED";
  colorStatus();
  sendMessageToContentScript("STOP");
}
function start() {
  console.log("start()");
  !0 === getConfigurationFromInputValues() ? (saveConfiguration(), sendMessageToContentScript(configuration), sendMessageToContentScript("START"), setStoredVariable("status", "STARTED", null), divStatus.innerHTML = "STARTED", colorStatus()) : alert("Cannot start the bot because of incorrect parameter(s)");
}
function copyUsernames() {
  if (null !== usernamesInfoContentArrayOfKeyMapArray) {
    var a = "";
    for (i = 0; i < usernamesInfoContentArrayOfKeyMapArray.length; i++) {
      var b = usernamesInfoContentArrayOfKeyMapArray[i];
      a += b.username + (i == usernamesInfoContentArrayOfKeyMapArray.length - 1 ? "" : "\n");
      console.log(b);
    }
    copyTextToClipboard(a) ? (console.log(a), alert(usernamesInfoContentArrayOfKeyMapArray.length + " usernames copied!")) : alert("error copy");
  }
}
function clearTable() {
  document.getElementById("tBodyUsernamesInfoList").innerHTML = "<tr><td>-</td><td>-</td><td>-</td><td>-</td></tr>";
}
function refreshDataFromContentScript() {
  sendMessageToContentScript("refreshForPopup");
}
function exportTableToExcel(a) {
  a = void 0 === a ? "instagral_list.xls" : a;
  var b = "<table border='2px'><tr bgcolor='#87AFC6'>", c, d = document.getElementById("tableUsernamesInfos");
  for (c = 0; c < d.rows.length; c++) {
    b = b + d.rows[c].innerHTML + "</tr>";
  }
  b = (b + "</table>").replace(/<input[^>]*>|<\/input>/gi, "");
  0 < window.navigator.userAgent.indexOf("MSIE ") || navigator.userAgent.match(/Trident.*rv:11\./) ? (txtArea1.document.open("txt/html", "replace"), txtArea1.document.write(b), txtArea1.document.close(), txtArea1.focus(), sa = txtArea1.document.execCommand("SaveAs", !0, a)) : (c = document.createElement("a"), c.href = "data:application/vnd.ms-excel," + encodeURIComponent(b), c.download = a, document.body.appendChild(c), c.click(), document.body.removeChild(c));
  return sa;
}
;