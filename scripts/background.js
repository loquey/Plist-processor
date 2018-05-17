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

chrome.tabs.onActivated.addListener(function (tabInfo) {
    var message = {
        "source" : "page-activated",
    }
    
    chrome.tabs.sendMessage(tabInfo.tabId, message, {}, function(response) {
        //console.log(response);
    });
});

function downloadFile(url) {
    var e = new URL(url);
    $.get(e.searchParams.get("url"), {}, downloadedData, "xml")
        .fail(function () {
            console.log("Error loading plist file");
        });
}

function downloadedData(data, textStatus, jqXHR) {
    var document = $(data);
    var fileLink = document.find("dict array dict array dict string:last-child").html();
    chromeDownload(fileLink);
}

function chromeDownload(link) {
    var item = {
        "url" : link,
        "conflictAction" : "uniquify",
    };
    chrome.downloads.download(item, function(downloadId, downloadItem){
        if (downloadId == undefined) { 
            console.log("Error downloading iOS app");
            return;
        }
        console.log("iOS app queued for downloaded successfully");
    })
}

chrome.downloads.onCreated.addListener(function(downloadItem) {
    console.log(downloadItem);
});