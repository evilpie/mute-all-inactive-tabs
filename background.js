/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

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
