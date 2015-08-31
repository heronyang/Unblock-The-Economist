/**
 * background.js
 *
 * This JavaScript code is called in background when the extension is enable.
 */

// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {

    //
    console.log("Background JS is up.");

    //Inject code from external file.
    chrome.tabs.executeScript(null, { file: "jquery.js" }, function() {
        chrome.tabs.executeScript(null, { file: "content.js" });
    });

    /*
    // Inject code directly.
    chrome.tabs.executeScript({
        code: 'document.body.style.backgroundColor="red"'
    });
    */

});
