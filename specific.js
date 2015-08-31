/**
 * specific.js
 *
 * This JavaScript code is called when specific website is opened.
 */

//
console.log("specific script is triggered");


//
if (!chrome.cookies) {
    chrome.cookies = chrome.experimental.cookies;
}

function Timer() {

    this.start_ = new Date();

    this.elapsed = function(){
        return (new Date()) - this.start_;
    }

    this.reset = function() {
        this.start_ = new Date()
    }

}

// Compares cookies for "key" (name, domain, etc.) equality, but not "value"
// equality.
function cookieMatch(c1, c2) {
    return (c1.name == c2.name) && (c1.domain == c2.domain) &&
    (c1.hostOnly == c2.hostOnly) && (c1.path == c2.path) &&
    (c1.secure == c2.secure) && (c1.httpOnly == c2.httpOnly) &&
    (c1.session == c2.session) && (c1.storeId == c2.storeId);
}

// An object used for caching data about the browser's cookies, which we update
// as notifications come in.
function CookieCache() {
    this.cookies_ = {};

    this.reset = function() {
        this.cookies_ = {};
    }

    this.add = function(cookie) {
        var domain = cookie.domain;
        if (!this.cookies_[domain]) {
            this.cookies_[domain] = [];
        }
        this.cookies_[domain].push(cookie);
    };

    this.remove = function(cookie) {
        var domain = cookie.domain;
        if (this.cookies_[domain]) {
            var i = 0;
            while (i < this.cookies_[domain].length) {
                if (cookieMatch(this.cookies_[domain][i], cookie)) {
                    this.cookies_[domain].splice(i, 1);
                } else {
                    i++;
                }
            }
            if (this.cookies_[domain].length == 0) {
                delete this.cookies_[domain];
            }
        }
    };

    // Returns a sorted list of cookie domains that match |filter|. If |filter| is
    //  null, returns all domains.
    this.getDomains = function(filter) {
        var result = [];
        sortedKeys(this.cookies_).forEach(function(domain) {
            if (!filter || domain.indexOf(filter) != -1) {
                result.push(domain);
            }
        });
        return result;
    }

    this.getCookies = function(domain) {
        return this.cookies_[domain];
    };
}

var cache = new CookieCache();

function removeAll() {
    var all_cookies = [];
    cache.getDomains().forEach(function(domain) {
        cache.getCookies(domain).forEach(function(cookie) {
            all_cookies.push(cookie);
        });
    });
    cache.reset();
    var count = all_cookies.length;
    var timer = new Timer();
    for (var i = 0; i < count; i++) {
        removeCookie(all_cookies[i]);
    }
    timer.reset();
    chrome.cookies.getAll({}, function(cookies) {
        for (var i in cookies) {
            cache.add(cookies[i]);
            removeCookie(cookies[i]);
        }
    });
}

function removeCookie(cookie) {
    var url = "http" + (cookie.secure ? "s" : "") + "://" + cookie.domain +
        cookie.path;
    chrome.cookies.remove({"url": url, "name": cookie.name});
}


// JQuery is enabled, done in manifest.json
function getCookies(domain, name, callback) {
    chrome.cookies.get({"url": domain, "name": name}, function(cookie) {
        if(callback) {
            callback(cookie.value);
        }
    });
}

//usage:
/*
getCookies("http://www.economist.com", "_polar_tu", function(id) {
    alert(id);
});
*/
removeAll();
