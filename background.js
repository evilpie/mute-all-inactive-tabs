/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var activeState = true;

function updateBrowserAction() {
    browser.browserAction.setIcon({
        path: activeState ? {
            64: "icons/icon-64.png",
        } : {
            64: "icons/icon-64-inactive.png",
        }
    });
    browser.browserAction.setTitle({
        // Screen readers can see the title
        title: `Mute all Inactive Tabs (${activeState ? 'active' : 'inactive'})`
    });
    browser.browserAction.setBadgeText(
        activeState ? 'Active' : 'Inactive'
    );
}

function toggleActiveState() {
    activeState = !activeState;
    updateInactive();
    updateBrowserAction();
}

browser.browserAction.onClicked.addListener(toggleActiveState);

function setMuted(tab, muted) {
    if (!tab.mutedInfo.muted && tab.mutedInfo.reason === "user") {
        // Never mute a tab that was manually unmuted.
        return;
    }

    if (!activeState) {
        return;
    }

    chrome.tabs.update(tab.id, {muted});
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tab.active)
        return;

    if (changeInfo.audible)
        setMuted(tab, true);
})

function updateInactive() {
    chrome.tabs.query({active: false, audible: true}, tabs => {
        tabs.forEach(tab => setMuted(tab, true));
    });
}

chrome.tabs.onActivated.addListener(({tabId}) => {
    chrome.tabs.get(tabId, tab => {
        setMuted(tab, false);
    });

    updateInactive();
})

updateInactive();
updateBrowserAction();
