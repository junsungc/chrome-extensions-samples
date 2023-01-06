const tabBody = document.querySelector("#tabs");
const tabsBtns = tabBody.querySelectorAll(".tabs__btn");
const tabsContents = tabBody.querySelectorAll(".tabs__content");

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
}

init()