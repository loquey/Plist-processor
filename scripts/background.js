chrome.runtime.onInstalled.addListener(function () {
    chrome.contextMenus.create({
        "id": "plist-download",
        "title": "Download iOS App",
        "contexts": [
            "link"
        ],
    });
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
    if (info.menuItemId == "plist-download") {
        downloadFile(info.linkUrl);
    }
});

chrome.runtime.onMessage.addListener(function (message, sender, reply) {
    if (message.source == "download-marker") {
        downloadFile(message.url);
        reply({ "message": message.url })
    }
});


function downloadFile(url) {
    console.log(url);
}