chrome.runtime.onInstalled.addListener(function () {
    chrome.contextMenus.create({
        "id" : "plist-download", 
        "title" : "Download iOS App",
        "contexts" : [
            "link"
        ]
    });
});