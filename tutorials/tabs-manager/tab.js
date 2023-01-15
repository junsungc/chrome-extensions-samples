const tabBody = document.querySelector("#tabs");
const tabsBtns = tabBody.querySelectorAll(".tabs__btn");
const tabsContents = tabBody.querySelectorAll(".tabs__content");


const startButton = document.querySelector("#start");
const setStartBtn = document.querySelector("#setStart");


const template = document.getElementById("start_li_template");

function setUrlElement(url) {
  const element = template.content.firstElementChild.cloneNode(true);
  element.querySelector(".url").textContent = url;
  element.querySelector("a").addEventListener("click", (event) => {
    chrome.storage.local.get(['urls'], async function (result) {
      let removedResult = []
      for (let i = 0; i < result.urls.length; i++) {
        if (result.urls[i] !== event.target.innerText)
          removedResult.push(result.urls[i])
      }
      await chrome.storage.local.set({ urls: removedResult });
      window.location.reload();
    });
  });
  document.querySelector("#start_li_item").append(element);
}

setStartBtn.addEventListener("click", async () => {
  let inputValue = document.getElementById('startUrl').value

  chrome.storage.local.get(['urls'], function (result) {
    let urlList = []
    if (result.urls) {
      urlList = result.urls
    }
    urlList.push(inputValue)
    setUrlElement(inputValue)
    chrome.storage.local.set({ urls: urlList });
  });
  document.getElementById('startUrl').value = ''
});

startButton.addEventListener("click", async () => {
  chrome.storage.local.get(['urls'], function (result) {
    chrome.windows.create({ "focused": true, "url": result.urls })
  });
});

function displayCurrentTab(current) {
  for (let i = 0; i < tabsContents.length; i++) {
    tabsContents[i].style.display = (current === i) ? "block" : "none";
  }
}

for (let i = 0; i < tabsBtns.length; i++) {
  tabsBtns[i].addEventListener("click", event => {
    if (event.target.className === "tabs__btn") {
      for (let i = 0; i < tabsBtns.length; i++) {
        if (event.target === tabsBtns[i]) {
          displayCurrentTab(i);
          break;
        }
      }
    }
    for (let i = 0; i < tabsBtns.length; i++) {
      tabsBtns[i].classList.remove("clicked");
    }
    event.target.classList.add("clicked");
  });
}

function init() {
  displayCurrentTab(0);
  tabsBtns[0].classList.add("clicked");

  chrome.storage.local.get(['urls'], function (result) {
    let urlList = []
    if (result.urls) {
      urlList = result.urls
    }
    for (let i = 0; i < urlList.length; i++)
      setUrlElement(urlList[i])
  });
}

init()