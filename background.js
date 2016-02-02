function setMuted(id, muted) {
    chrome.tabs.update(id, {muted});
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tab.active)
        return;

    if (changeInfo.audible)
        setMuted(tabId, true);
})

function updateInactive() {
    chrome.tabs.query({active: false, audible: true}, tabs => {
        tabs.forEach(tab => setMuted(tab.id, true));
    });
}

chrome.tabs.onActivated.addListener(({tabId}) => {
    setMuted(tabId, false);
    updateInactive();
})

updateInactive();
