var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.arrayIteratorImpl = function(a) {
  var b = 0;
  return function() {
    return b < a.length ? {done:!1, value:a[b++]} : {done:!0};
  };
};
$jscomp.arrayIterator = function(a) {
  return {next:$jscomp.arrayIteratorImpl(a)};
};
$jscomp.makeIterator = function(a) {
  var b = "undefined" != typeof Symbol && Symbol.iterator && a[Symbol.iterator];
  return b ? b.call(a) : $jscomp.arrayIterator(a);
};
$jscomp.getGlobal = function(a) {
  return "undefined" != typeof window && window === a ? a : "undefined" != typeof global && null != global ? global : a;
};
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.ASSUME_ES5 = !1;
$jscomp.ASSUME_NO_NATIVE_MAP = !1;
$jscomp.ASSUME_NO_NATIVE_SET = !1;
$jscomp.SIMPLE_FROUND_POLYFILL = !1;
$jscomp.defineProperty = $jscomp.ASSUME_ES5 || "function" == typeof Object.defineProperties ? Object.defineProperty : function(a, b, c) {
  a != Array.prototype && a != Object.prototype && (a[b] = c.value);
};
$jscomp.polyfill = function(a, b, c, e) {
  if (b) {
    c = $jscomp.global;
    a = a.split(".");
    for (e = 0; e < a.length - 1; e++) {
      var d = a[e];
      d in c || (c[d] = {});
      c = c[d];
    }
    a = a[a.length - 1];
    e = c[a];
    b = b(e);
    b != e && null != b && $jscomp.defineProperty(c, a, {configurable:!0, writable:!0, value:b});
  }
};
$jscomp.FORCE_POLYFILL_PROMISE = !1;
$jscomp.polyfill("Promise", function(a) {
  function b() {
    this.batch_ = null;
  }
  function c(a) {
    return a instanceof d ? a : new d(function(b, c) {
      b(a);
    });
  }
  if (a && !$jscomp.FORCE_POLYFILL_PROMISE) {
    return a;
  }
  b.prototype.asyncExecute = function(a) {
    null == this.batch_ && (this.batch_ = [], this.asyncExecuteBatch_());
    this.batch_.push(a);
    return this;
  };
  b.prototype.asyncExecuteBatch_ = function() {
    var a = this;
    this.asyncExecuteFunction(function() {
      a.executeBatch_();
    });
  };
  var e = $jscomp.global.setTimeout;
  b.prototype.asyncExecuteFunction = function(a) {
    e(a, 0);
  };
  b.prototype.executeBatch_ = function() {
    for (; this.batch_ && this.batch_.length;) {
      var a = this.batch_;
      this.batch_ = [];
      for (var b = 0; b < a.length; ++b) {
        var c = a[b];
        a[b] = null;
        try {
          c();
        } catch (k) {
          this.asyncThrow_(k);
        }
      }
    }
    this.batch_ = null;
  };
  b.prototype.asyncThrow_ = function(a) {
    this.asyncExecuteFunction(function() {
      throw a;
    });
  };
  var d = function(a) {
    this.state_ = 0;
    this.result_ = void 0;
    this.onSettledCallbacks_ = [];
    var b = this.createResolveAndReject_();
    try {
      a(b.resolve, b.reject);
    } catch (g) {
      b.reject(g);
    }
  };
  d.prototype.createResolveAndReject_ = function() {
    function a(a) {
      return function(d) {
        c || (c = !0, a.call(b, d));
      };
    }
    var b = this, c = !1;
    return {resolve:a(this.resolveTo_), reject:a(this.reject_)};
  };
  d.prototype.resolveTo_ = function(a) {
    if (a === this) {
      this.reject_(new TypeError("A Promise cannot resolve to itself"));
    } else {
      if (a instanceof d) {
        this.settleSameAsPromise_(a);
      } else {
        a: {
          switch(typeof a) {
            case "object":
              var b = null != a;
              break a;
            case "function":
              b = !0;
              break a;
            default:
              b = !1;
          }
        }
        b ? this.resolveToNonPromiseObj_(a) : this.fulfill_(a);
      }
    }
  };
  d.prototype.resolveToNonPromiseObj_ = function(a) {
    var b = void 0;
    try {
      b = a.then;
    } catch (g) {
      this.reject_(g);
      return;
    }
    "function" == typeof b ? this.settleSameAsThenable_(b, a) : this.fulfill_(a);
  };
  d.prototype.reject_ = function(a) {
    this.settle_(2, a);
  };
  d.prototype.fulfill_ = function(a) {
    this.settle_(1, a);
  };
  d.prototype.settle_ = function(a, b) {
    if (0 != this.state_) {
      throw Error("Cannot settle(" + a + ", " + b + "): Promise already settled in state" + this.state_);
    }
    this.state_ = a;
    this.result_ = b;
    this.executeOnSettledCallbacks_();
  };
  d.prototype.executeOnSettledCallbacks_ = function() {
    if (null != this.onSettledCallbacks_) {
      for (var a = 0; a < this.onSettledCallbacks_.length; ++a) {
        f.asyncExecute(this.onSettledCallbacks_[a]);
      }
      this.onSettledCallbacks_ = null;
    }
  };
  var f = new b;
  d.prototype.settleSameAsPromise_ = function(a) {
    var b = this.createResolveAndReject_();
    a.callWhenSettled_(b.resolve, b.reject);
  };
  d.prototype.settleSameAsThenable_ = function(a, b) {
    var c = this.createResolveAndReject_();
    try {
      a.call(b, c.resolve, c.reject);
    } catch (k) {
      c.reject(k);
    }
  };
  d.prototype.then = function(a, b) {
    function c(a, b) {
      return "function" == typeof a ? function(b) {
        try {
          e(a(b));
        } catch (l) {
          f(l);
        }
      } : b;
    }
    var e, f, h = new d(function(a, b) {
      e = a;
      f = b;
    });
    this.callWhenSettled_(c(a, e), c(b, f));
    return h;
  };
  d.prototype["catch"] = function(a) {
    return this.then(void 0, a);
  };
  d.prototype.callWhenSettled_ = function(a, b) {
    function c() {
      switch(d.state_) {
        case 1:
          a(d.result_);
          break;
        case 2:
          b(d.result_);
          break;
        default:
          throw Error("Unexpected state: " + d.state_);
      }
    }
    var d = this;
    null == this.onSettledCallbacks_ ? f.asyncExecute(c) : this.onSettledCallbacks_.push(c);
  };
  d.resolve = c;
  d.reject = function(a) {
    return new d(function(b, c) {
      c(a);
    });
  };
  d.race = function(a) {
    return new d(function(b, d) {
      for (var e = $jscomp.makeIterator(a), f = e.next(); !f.done; f = e.next()) {
        c(f.value).callWhenSettled_(b, d);
      }
    });
  };
  d.all = function(a) {
    var b = $jscomp.makeIterator(a), e = b.next();
    return e.done ? c([]) : new d(function(a, d) {
      function f(b) {
        return function(c) {
          h[b] = c;
          g--;
          0 == g && a(h);
        };
      }
      var h = [], g = 0;
      do {
        h.push(void 0), g++, c(e.value).callWhenSettled_(f(h.length - 1), d), e = b.next();
      } while (!e.done);
    });
  };
  return d;
}, "es6", "es3");
$jscomp.polyfill("Promise.prototype.finally", function(a) {
  return a ? a : function(a) {
    return this.then(function(b) {
      return Promise.resolve(a()).then(function() {
        return b;
      });
    }, function(b) {
      return Promise.resolve(a()).then(function() {
        throw b;
      });
    });
  };
}, "es9", "es3");
$jscomp.SYMBOL_PREFIX = "jscomp_symbol_";
$jscomp.initSymbol = function() {
  $jscomp.initSymbol = function() {
  };
  $jscomp.global.Symbol || ($jscomp.global.Symbol = $jscomp.Symbol);
};
$jscomp.Symbol = function() {
  var a = 0;
  return function(b) {
    return $jscomp.SYMBOL_PREFIX + (b || "") + a++;
  };
}();
$jscomp.initSymbolIterator = function() {
  $jscomp.initSymbol();
  var a = $jscomp.global.Symbol.iterator;
  a || (a = $jscomp.global.Symbol.iterator = $jscomp.global.Symbol("iterator"));
  "function" != typeof Array.prototype[a] && $jscomp.defineProperty(Array.prototype, a, {configurable:!0, writable:!0, value:function() {
    return $jscomp.iteratorPrototype($jscomp.arrayIteratorImpl(this));
  }});
  $jscomp.initSymbolIterator = function() {
  };
};
$jscomp.initSymbolAsyncIterator = function() {
  $jscomp.initSymbol();
  var a = $jscomp.global.Symbol.asyncIterator;
  a || (a = $jscomp.global.Symbol.asyncIterator = $jscomp.global.Symbol("asyncIterator"));
  $jscomp.initSymbolAsyncIterator = function() {
  };
};
$jscomp.iteratorPrototype = function(a) {
  $jscomp.initSymbolIterator();
  a = {next:a};
  a[$jscomp.global.Symbol.iterator] = function() {
    return this;
  };
  return a;
};
$jscomp.underscoreProtoCanBeSet = function() {
  var a = {a:!0}, b = {};
  try {
    return b.__proto__ = a, b.a;
  } catch (c) {
  }
  return !1;
};
$jscomp.setPrototypeOf = "function" == typeof Object.setPrototypeOf ? Object.setPrototypeOf : $jscomp.underscoreProtoCanBeSet() ? function(a, b) {
  a.__proto__ = b;
  if (a.__proto__ !== b) {
    throw new TypeError(a + " is not extensible");
  }
  return a;
} : null;
$jscomp.generator = {};
$jscomp.generator.ensureIteratorResultIsObject_ = function(a) {
  if (!(a instanceof Object)) {
    throw new TypeError("Iterator result " + a + " is not an object");
  }
};
$jscomp.generator.Context = function() {
  this.isRunning_ = !1;
  this.yieldAllIterator_ = null;
  this.yieldResult = void 0;
  this.nextAddress = 1;
  this.finallyAddress_ = this.catchAddress_ = 0;
  this.finallyContexts_ = this.abruptCompletion_ = null;
};
$jscomp.generator.Context.prototype.start_ = function() {
  if (this.isRunning_) {
    throw new TypeError("Generator is already running");
  }
  this.isRunning_ = !0;
};
$jscomp.generator.Context.prototype.stop_ = function() {
  this.isRunning_ = !1;
};
$jscomp.generator.Context.prototype.jumpToErrorHandler_ = function() {
  this.nextAddress = this.catchAddress_ || this.finallyAddress_;
};
$jscomp.generator.Context.prototype.next_ = function(a) {
  this.yieldResult = a;
};
$jscomp.generator.Context.prototype.throw_ = function(a) {
  this.abruptCompletion_ = {exception:a, isException:!0};
  this.jumpToErrorHandler_();
};
$jscomp.generator.Context.prototype["return"] = function(a) {
  this.abruptCompletion_ = {"return":a};
  this.nextAddress = this.finallyAddress_;
};
$jscomp.generator.Context.prototype.jumpThroughFinallyBlocks = function(a) {
  this.abruptCompletion_ = {jumpTo:a};
  this.nextAddress = this.finallyAddress_;
};
$jscomp.generator.Context.prototype.yield = function(a, b) {
  this.nextAddress = b;
  return {value:a};
};
$jscomp.generator.Context.prototype.yieldAll = function(a, b) {
  var c = $jscomp.makeIterator(a), e = c.next();
  $jscomp.generator.ensureIteratorResultIsObject_(e);
  if (e.done) {
    this.yieldResult = e.value, this.nextAddress = b;
  } else {
    return this.yieldAllIterator_ = c, this.yield(e.value, b);
  }
};
$jscomp.generator.Context.prototype.jumpTo = function(a) {
  this.nextAddress = a;
};
$jscomp.generator.Context.prototype.jumpToEnd = function() {
  this.nextAddress = 0;
};
$jscomp.generator.Context.prototype.setCatchFinallyBlocks = function(a, b) {
  this.catchAddress_ = a;
  void 0 != b && (this.finallyAddress_ = b);
};
$jscomp.generator.Context.prototype.setFinallyBlock = function(a) {
  this.catchAddress_ = 0;
  this.finallyAddress_ = a || 0;
};
$jscomp.generator.Context.prototype.leaveTryBlock = function(a, b) {
  this.nextAddress = a;
  this.catchAddress_ = b || 0;
};
$jscomp.generator.Context.prototype.enterCatchBlock = function(a) {
  this.catchAddress_ = a || 0;
  a = this.abruptCompletion_.exception;
  this.abruptCompletion_ = null;
  return a;
};
$jscomp.generator.Context.prototype.enterFinallyBlock = function(a, b, c) {
  c ? this.finallyContexts_[c] = this.abruptCompletion_ : this.finallyContexts_ = [this.abruptCompletion_];
  this.catchAddress_ = a || 0;
  this.finallyAddress_ = b || 0;
};
$jscomp.generator.Context.prototype.leaveFinallyBlock = function(a, b) {
  var c = this.finallyContexts_.splice(b || 0)[0];
  if (c = this.abruptCompletion_ = this.abruptCompletion_ || c) {
    if (c.isException) {
      return this.jumpToErrorHandler_();
    }
    void 0 != c.jumpTo && this.finallyAddress_ < c.jumpTo ? (this.nextAddress = c.jumpTo, this.abruptCompletion_ = null) : this.nextAddress = this.finallyAddress_;
  } else {
    this.nextAddress = a;
  }
};
$jscomp.generator.Context.prototype.forIn = function(a) {
  return new $jscomp.generator.Context.PropertyIterator(a);
};
$jscomp.generator.Context.PropertyIterator = function(a) {
  this.object_ = a;
  this.properties_ = [];
  for (var b in a) {
    this.properties_.push(b);
  }
  this.properties_.reverse();
};
$jscomp.generator.Context.PropertyIterator.prototype.getNext = function() {
  for (; 0 < this.properties_.length;) {
    var a = this.properties_.pop();
    if (a in this.object_) {
      return a;
    }
  }
  return null;
};
$jscomp.generator.Engine_ = function(a) {
  this.context_ = new $jscomp.generator.Context;
  this.program_ = a;
};
$jscomp.generator.Engine_.prototype.next_ = function(a) {
  this.context_.start_();
  if (this.context_.yieldAllIterator_) {
    return this.yieldAllStep_(this.context_.yieldAllIterator_.next, a, this.context_.next_);
  }
  this.context_.next_(a);
  return this.nextStep_();
};
$jscomp.generator.Engine_.prototype.return_ = function(a) {
  this.context_.start_();
  var b = this.context_.yieldAllIterator_;
  if (b) {
    return this.yieldAllStep_("return" in b ? b["return"] : function(a) {
      return {value:a, done:!0};
    }, a, this.context_["return"]);
  }
  this.context_["return"](a);
  return this.nextStep_();
};
$jscomp.generator.Engine_.prototype.throw_ = function(a) {
  this.context_.start_();
  if (this.context_.yieldAllIterator_) {
    return this.yieldAllStep_(this.context_.yieldAllIterator_["throw"], a, this.context_.next_);
  }
  this.context_.throw_(a);
  return this.nextStep_();
};
$jscomp.generator.Engine_.prototype.yieldAllStep_ = function(a, b, c) {
  try {
    var e = a.call(this.context_.yieldAllIterator_, b);
    $jscomp.generator.ensureIteratorResultIsObject_(e);
    if (!e.done) {
      return this.context_.stop_(), e;
    }
    var d = e.value;
  } catch (f) {
    return this.context_.yieldAllIterator_ = null, this.context_.throw_(f), this.nextStep_();
  }
  this.context_.yieldAllIterator_ = null;
  c.call(this.context_, d);
  return this.nextStep_();
};
$jscomp.generator.Engine_.prototype.nextStep_ = function() {
  for (; this.context_.nextAddress;) {
    try {
      var a = this.program_(this.context_);
      if (a) {
        return this.context_.stop_(), {value:a.value, done:!1};
      }
    } catch (b) {
      this.context_.yieldResult = void 0, this.context_.throw_(b);
    }
  }
  this.context_.stop_();
  if (this.context_.abruptCompletion_) {
    a = this.context_.abruptCompletion_;
    this.context_.abruptCompletion_ = null;
    if (a.isException) {
      throw a.exception;
    }
    return {value:a["return"], done:!0};
  }
  return {value:void 0, done:!0};
};
$jscomp.generator.Generator_ = function(a) {
  this.next = function(b) {
    return a.next_(b);
  };
  this["throw"] = function(b) {
    return a.throw_(b);
  };
  this["return"] = function(b) {
    return a.return_(b);
  };
  $jscomp.initSymbolIterator();
  this[Symbol.iterator] = function() {
    return this;
  };
};
$jscomp.generator.createGenerator = function(a, b) {
  var c = new $jscomp.generator.Generator_(new $jscomp.generator.Engine_(b));
  $jscomp.setPrototypeOf && $jscomp.setPrototypeOf(c, a.prototype);
  return c;
};
$jscomp.asyncExecutePromiseGenerator = function(a) {
  function b(b) {
    return a.next(b);
  }
  function c(b) {
    return a["throw"](b);
  }
  return new Promise(function(e, d) {
    function f(a) {
      a.done ? e(a.value) : Promise.resolve(a.value).then(b, c).then(f, d);
    }
    f(a.next());
  });
};
$jscomp.asyncExecutePromiseGeneratorFunction = function(a) {
  return $jscomp.asyncExecutePromiseGenerator(a());
};
$jscomp.asyncExecutePromiseGeneratorProgram = function(a) {
  return $jscomp.asyncExecutePromiseGenerator(new $jscomp.generator.Generator_(new $jscomp.generator.Engine_(a)));
};
var deleteElementToNotOverloadTheRAM = !1, titlePrefixWhenBotRunning = "[BOT STARTED]", titlePrefixWhenBotSleeping = "[BOT SLEEPING]", titlePrefixWhenBotStopped = "[BOT STOPPED]", mode = "FOLLOW", loopFollowRunning = !1, isSleeping = !1, isSleepingScrape = !1, dateStartSleep = null, countLi = 0, loopCount = 1, countFollowers = 0, countFollowed = 0, countUnFollowed = 0, nbUsernamesInfoScraped = 0, heightDivOfOneFollowInTheFollowerList = 46, liFollowers, allUsernamesAndInfoInArray, allUsernamesAndInfo = 
{}, buttonsFollow = [], buttonsFollowAndFollowingAndRequested = [], divFollowers, liFollowerCurrent, buttonFollowOrFollowingOrRequestedCurrent, accountNameCurrentFollowed = "-", accountNameCurrentUnFollowed = "-", configuration = {};
function sendMessageToPopup(a) {
  chrome.extension.sendMessage(a);
}
chrome.runtime.onMessage.addListener(function(a, b, c) {
  message = a.message;
  "STOP" == message ? stopScript(!1) : "START" == message ? startScript() : "refreshForPopup" == message ? refreshPopup() : configuration = message;
});
function stopScript(a) {
  a = void 0 === a ? !0 : a;
  isSleepingScrape = isSleeping = loopFollowRunning = !1;
  0 > document.title.indexOf(titlePrefixWhenBotStopped) && (document.title = document.title.replace(titlePrefixWhenBotRunning + " ", titlePrefixWhenBotStopped + " "), document.title = document.title.replace(titlePrefixWhenBotSleeping + " ", titlePrefixWhenBotStopped + " "));
  a && sendMessageToPopup({type:"STOP"});
  refreshPopup();
}
function startScript() {
  var a, b, c, e;
  return $jscomp.asyncExecutePromiseGeneratorProgram(function(d) {
    switch(d.nextAddress) {
      case 1:
        loopFollowRunning = !0, getAllDivsFollowers(), refreshLiFollowers(), refreshbuttonsFollowAndFollowingAndRequested(), document.title = document.title.replace(titlePrefixWhenBotSleeping + " ", ""), document.title = document.title.replace(titlePrefixWhenBotStopped + " ", ""), document.title = titlePrefixWhenBotRunning + " " + document.title, configuration.radioBoxFollow ? mode = "FOLLOW" : configuration.radioBoxUnfollow ? mode = "UNFOLLOW" : configuration.radioBoxScrape && (mode = "SCRAPE");
      case 2:
        if (!loopFollowRunning) {
          d.jumpTo(0);
          break;
        }
        if ("FOLLOW" == mode || "UNFOLLOW" == mode) {
          return b = followOrUnfollow(configuration.radioBoxFollow), isSleeping = !1, scrollDownOneOfUsername(), 1 == b ? (c = randomTimeBetweenFollow(), e = "+1 Unfollow!", configuration.radioBoxFollow && (e = "+1 Follow!"), console.log("%c " + e + " The Bot will now wait " + c / 1000 + " seconds.", "color: GREEN"), refreshPopup(), d.yield(sleep(c), 2)) : "LONG_SLEEP" == b ? (document.title = document.title.replace(titlePrefixWhenBotRunning + " ", titlePrefixWhenBotSleeping + " "), dateStartSleep = 
          (new Date).toLocaleTimeString(), isSleeping = !0, console.log("%c " + dateStartSleep + " - Start long sleep for " + configuration.inputNumberBreakTimeInMins + " minutes.", "color: BLUE"), refreshPopup(), d.yield(sleep(6E4 * configuration.inputNumberBreakTimeInMins), 19)) : d.yield(sleep(250), 2);
        }
        if ("SCRAPE" != mode) {
          d.jumpTo(2);
          break;
        }
        scrollDownOneOfUsername();
        scrollDownOneOfUsername();
        scrollDownOneOfUsername();
        scrollDownOneOfUsername();
        scrollDownOneOfUsername();
        return d.yield(sleep(1000), 7);
      case 7:
        refreshLiFollowers();
        a = getAllUsernamesAndInfoFromLi(liFollowers);
        arrayUsernamesWithInfo = a.allUsernamesAndInfo;
        allUsernamesAndInfoInArray = getUsernamesInfosInArray(arrayUsernamesWithInfo, !0, !0, !0);
        if ("SLEEP_FOR_SCRAPING" == a.status) {
          return isSleepingScrape = !0, refreshPopup(), console.log("%c The Bot will now wait " + 1000 * configuration.inputNumberSleepTimeScrapeSeconds + " seconds.", "color: GREEN"), d.yield(sleep(1000 * configuration.inputNumberSleepTimeScrapeSeconds), 2);
        }
        if ("STOP" == a.status) {
          refreshPopup();
          stopScript();
          d.jumpTo(2);
          break;
        }
        if ("OK" != a.status) {
          d.jumpTo(2);
          break;
        }
        isSleepingScrape = !1;
        refreshPopup();
        scrollToBottomOfList();
        return d.yield(sleep(1000), 2);
      case 19:
        document.title = document.title.replace(titlePrefixWhenBotSleeping + " ", titlePrefixWhenBotRunning + " "), d.jumpTo(2);
    }
  });
}
function getAllUsernamesAndInfoFromLi(a) {
  var b = [];
  b.allUsernamesAndInfo = null;
  b.status = "OK";
  if ("undefined" === typeof a) {
    return !1;
  }
  for (var c = 0, e = a.length; c < e; c++) {
    var d = a[c];
    if ("undefined" !== typeof d || null !== d) {
      d = getUsernameAndImgSrcAndIfFollowed(d), null !== d.username && (allUsernamesAndInfo[d.username] = d);
    }
    b.allUsernamesAndInfo = allUsernamesAndInfo;
    nbUsernamesInfoScraped = Object.keys(allUsernamesAndInfo).length;
    if (nbUsernamesInfoScraped == configuration.inputNumberUsernamesScrapedMax) {
      b.status = "STOP";
      break;
    } else {
      if (0 !== nbUsernamesInfoScraped && 0 == nbUsernamesInfoScraped % configuration.inputNumberSleepEveryXUsernamesScraped && !isSleepingScrape) {
        b.status = "SLEEP_FOR_SCRAPING";
        break;
      }
    }
  }
  return b;
}
function followOrUnfollow(a) {
  var b;
  if ("undefined" === typeof liFollowers) {
    return !1;
  }
  liFollowerCurrent = liFollowers[countLi];
  for (b = 0; null == liFollowerCurrent;) {
    if (scrollDownOneOfUsername(1500), refreshbuttonsFollowAndFollowingAndRequested(), refreshLiFollowers(), liFollowerCurrent = liFollowers[countLi], b++, 50000 == b) {
      return loopFollowRunning = !1, console.log("Problem on the page, close the tab, refresh the extension and try again."), stopScript(), !1;
    }
  }
  liFollowerCurrent = liFollowers[countLi];
  buttonFollowOrFollowingOrRequestedCurrent = liFollowerCurrent.querySelectorAll("button")[0];
  b = !1;
  if (a) {
    accountNameCurrentFollowed = getUsername(liFollowerCurrent), "undefined" !== typeof buttonFollowOrFollowingOrRequestedCurrent && "Follow" == buttonFollowOrFollowingOrRequestedCurrent.innerText && (buttonFollowOrFollowingOrRequestedCurrent.click(), countFollowed++, b = !0);
  } else {
    if (accountNameCurrentUnFollowed = getUsername(liFollowerCurrent), "undefined" !== typeof buttonFollowOrFollowingOrRequestedCurrent && ("Following" == buttonFollowOrFollowingOrRequestedCurrent.innerText || "Requested" == buttonFollowOrFollowingOrRequestedCurrent.innerText)) {
      buttonFollowOrFollowingOrRequestedCurrent.click();
      sleep(1000);
      var c = findUnfollowButton();
      "undefined" !== typeof c && (countUnFollowed++, c.click(), b = !0);
    }
  }
  countFollowers++;
  countLi++;
  a ? b && (configuration.inputNumberFollowUnfollowMax <= countFollowed ? stopScript() : 0 !== countFollowed && 0 == countFollowed % configuration.inputNumberBreakEveryXFollowsOrUnfollows && (b = "LONG_SLEEP")) : b && (configuration.inputNumberFollowUnfollowMax <= countUnFollowed ? stopScript() : 0 !== countFollowed && 0 == countUnFollowed % configuration.inputNumberBreakEveryXFollowsOrUnfollows && (b = "LONG_SLEEP"));
  deleteElementToNotOverloadTheRAM && deleteElement(liFollowerCurrent);
  refreshPopup();
  return b;
}
function scrollDownOneOfUsername(a) {
  setTimeout(function() {
    "undefined" !== typeof divFollowers && (divFollowers.scrollTop += heightDivOfOneFollowInTheFollowerList);
  }, void 0 === a ? 1 : a);
}
function scrollToBottomOfList() {
  "undefined" !== typeof divFollowers && divFollowers.scrollTo(0, divFollowers.scrollHeight);
}
function getUsername(a) {
  return getUsernameAndImgSrcAndIfFollowed(a).username;
}
function getUserImgSrc(a) {
  return getUsernameAndImgSrcAndIfFollowed(a).imgSrc;
}
function getUsernameAndImgSrcAndIfFollowed(a) {
  var b = {username:null, isFollowAlreadyAsked:null, imgSrc:null}, c = null, e = null, d = null;
  if ("undefined" !== typeof a && null !== a) {
    var f = a.querySelector("img");
    "undefined" !== typeof f && null !== f && f.hasAttribute("src") && (c = f.src);
    f = a.querySelectorAll("a");
    "undefined" !== typeof f && null !== f && (1 < f.length ? "undefined" !== typeof f[1] && null !== f[1] && f[1].hasAttribute("title") && (d = f[1].title) : "undefined" !== typeof f[0] && null !== f[0] && f[0].hasAttribute("title") && (d = f[0].title));
    a = a.querySelector("button");
    "undefined" !== typeof a && null !== a && (e = "Follow" == a.innerHTML ? !1 : !0);
  }
  b.imgSrc = c;
  b.username = d;
  b.isFollowAlreadyAsked = e;
  return b;
}
function getAllDivsFollowers() {
  for (var a = document.querySelectorAll("div"), b = 0, c = a.length; b < c; b++) {
    if ("Followers" == a[b].innerText) {
      divFollowers = a[b + 2];
      break;
    }
  }
  b = 0;
  for (c = a.length; b < c; b++) {
    if (-1 < a[b].innerText.indexOf("Likes") && -1 < a[b].innerText.indexOf("Close")) {
      divFollowers = a[b + 7];
      break;
    }
  }
  b = 0;
  for (c = a.length; b < c; b++) {
    if ("Following" == a[b].innerText) {
      divFollowers = a[b + 2];
      break;
    }
  }
}
function refreshLiFollowers() {
  countLi = 0;
  return liFollowers = "undefined" !== typeof divFollowers ? divFollowers.querySelectorAll("li") : document.querySelectorAll("li");
}
function refreshbuttonsFollowAndFollowingAndRequested() {
  var a = "undefined" !== typeof divFollowers ? divFollowers.querySelectorAll("button") : document.querySelectorAll("button");
  for (var b = 0, c = a.length; b < c; b++) {
    "Follow" == a[b].innerText ? (buttonsFollow.push(a[b]), buttonsFollowAndFollowingAndRequested.push(a[b])) : "Following" != a[b].innerText && "Requested" != a[b].innerText || buttonsFollowAndFollowingAndRequested.push(a[b]);
  }
}
function findUnfollowButton() {
  for (var a = document.querySelectorAll("button"), b = 0, c = a.length; b < c; b++) {
    if (null !== a[b].firstChild && "Unfollow" == a[b].firstChild.nodeValue) {
      return a[b];
    }
  }
}
function sleep(a) {
  return new Promise(function(b) {
    return setTimeout(b, a);
  });
}
function randomTimeBetweenFollow() {
  return 1000 * Math.floor(Math.random() * (parseInt(configuration.inputNumberDelaySecMax) - parseInt(configuration.inputNumberDelaySecMin))) + 1000 * parseInt(configuration.inputNumberDelaySecMin);
}
function refreshPopup() {
  var a = {type:"refresh"};
  a.follows = countFollowed;
  a.unfollows = countUnFollowed;
  a.lastFollowedUsername = accountNameCurrentFollowed;
  a.lastUnFollowedUsername = accountNameCurrentUnFollowed;
  a.allUsernamesAndInfoInArray = allUsernamesAndInfoInArray;
  a.nbUsernamesInfoScraped = nbUsernamesInfoScraped;
  isSleeping ? (a.status = "SLEEPING", a.dateStartSleep = dateStartSleep) : a.status = loopFollowRunning ? "STARTED" : "STOPPED";
  sendMessageToPopup(a);
}
var tableMode = !0;
function getUsernamesInfosInArray(a) {
  var b = [], c;
  for (c in a) {
    b.push(a[c]);
  }
  return b;
}
;