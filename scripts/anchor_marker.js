/*
on page load select all anchor tags that have the itunes protocol 
append a check mark to the link
*/
var markAttribute = "data-plist-marked";
var markAttributeValue = "marked";

$(function () {
    markLinks($);
});

function isMarked(currentTag) {
    return currentTag.attr(markAttribute) == "marked";
}

function markTag(currentTag) {
    currentTag.attr(markAttribute, markAttributeValue);
}

function appendMaker($, currentTag) {
    var img = $("<img />");
    img.attr("src", chrome.runtime.getURL("icons/download-mark.png"));
    img.attr("alt", "Download App");
    img.addClass("plist-marker");

    img.click(currentTag, postFileLink);
    currentTag.after(img);
}

function postFileLink(currentTag) {
    var messsage = {
        "source" : "download-marker",
        "url" : currentTag.data.attr("href")
    }
    chrome.runtime.sendMessage(messsage, function(response) {
        console.log(response);
    });
}

function markLinks($) {
    $("a[href^='itms-services://'").each(function () {
        var element = $(this);

        if (isMarked(element))
            return;

        markTag(element);
        appendMaker($, element);
    });
}

chrome.runtime.onMessage.addListener(function (message, sender, reply) {
    console.log("called");
    if (message.source == "page-activated") {
        console.log('message received');
        markLinks($);
        reply({"page-check" : "started"});
    }
});
