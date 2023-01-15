// Copyright 2022 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const tabs = await chrome.tabs.query({});

tabs.sort((a, b) => {
  if (a.index > b.index) return 1;
  if (a.index < b.index) return -1;
  return 0
});

const template = document.getElementById("group_li_template");
const elements = new Set();
for (const tab of tabs) {
  if (tab.url) {
    const element = template.content.firstElementChild.cloneNode(true);
    const tabUrl = new URL(tab.url)
    const title = tabUrl.hostname
    const pathname = tabUrl.pathname

    element.querySelector(".title").textContent = title;
    element.querySelector(".pathname").textContent = pathname;
    element.querySelector("a").addEventListener("click", async () => {
      // need to focus window as well as the active tab
      await chrome.tabs.update(tab.id, { active: true });
      await chrome.windows.update(tab.windowId, { focused: true });
    });

    elements.add(element);
    document.querySelector("#group_li_item").append(...elements);
  }
}


const tabObj = tabs.reduce((acc, cur, idx) => {
  if (cur.url) {
    const tabUrl = new URL(cur.url).hostname
    if (acc[tabUrl]) {
      acc[tabUrl].push(cur.id)
    } else {
      acc[tabUrl] = [cur.id]
    }
  }
  return acc;
}, {})


const groupButton = document.querySelector("#group");
groupButton.addEventListener("click", async () => {
  const keys = Object.keys(tabObj)
  keys.map(async key => {
    if (tabObj[key].length > 1) {
      const tabIds = tabObj[key]
      const group = await chrome.tabs.group({ tabIds });
      await chrome.tabGroups.update(group, { title: key });
    }
  })
});

const unGroupButton = document.querySelector("#ungroup");
unGroupButton.addEventListener("click", async () => {
  const keys = Object.keys(tabObj)
  keys.map(async key => {
    if (tabObj[key].length > 1) {
      const tabIds = tabObj[key]
      chrome.tabs.ungroup(tabIds);
    }
  })
});
