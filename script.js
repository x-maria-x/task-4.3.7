let input = document.querySelector(".input");
let myRepositories = document.getElementsByClassName("myRepositories")[0];
let autocomplite = document.querySelector(".autocomplite");
let emptyList = document.querySelector(".empty_list");
let informationText = document.querySelector(".informationText");
let value;

const debounce = (fn, debounceTime) => {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, debounceTime);
  };
};

input.addEventListener(
  "keydown",
  debounce(() => {
    value = input.value;
    autocomplite.classList.add("hidden");
    search(value);
  }, 500)
);

function search(value) {
  autocomplite.textContent = "";

  value = value.trim();
  if (!value) return;

  fetch(`https://api.github.com/search/repositories?q=${value}`).then(
    async (response) => {
      if (!response.ok) {
        informationText.textContent = "Техническая ошибка, попробуйте позже!";
        return;
      }

      const data = await response.json();
      if (data.total_count === 0) {
        informationText.textContent = "Репозитории не найдены!";
      } else {
        informationText.textContent = "";
        arrRep = data.items.slice(0, 5);
        createAutocomplite(arrRep);
        autocomplite.classList.remove("hidden");
      }
    }
  );
}

function createAutocomplite(arrRep) {
  let fragment = document.createDocumentFragment();
  arrRep.forEach((rep) => {
    let newRep = document.createElement("li");
    newRep.classList.add("item");
    newRep.textContent = rep.name;
    fragment.append(newRep);
    newRep.addEventListener("click", () => {
      createRep(rep);
    });
  });
  autocomplite.appendChild(fragment);
}

function createElem(tag, className, text) {
  let newElem = document.createElement(tag);
  newElem.classList.add(className);
  newElem.textContent = text;
  return newElem;
}

function createRep(rep) {
  emptyList.classList.add("hidden");

  let myRepositories_item = createElem("div", "myRep_item");
  let myRepositories_text = createElem(
    "p",
    null,
    `Name: ${rep.name}\nOwner: ${rep.owner.login}\nStars: ${rep.stargazers_count}`
  );
  let myRepositories_btn = createElem("button", "myRepositories_btn");

  myRepositories_item.appendChild(myRepositories_text);
  myRepositories_item.appendChild(myRepositories_btn);
  myRepositories.appendChild(myRepositories_item);
  input.value = "";
  autocomplite.classList.add("hidden");
}

myRepositories.addEventListener("click", (event) => {
  if ([...event.target.classList].includes("myRepositories_btn")) {
    event.target.parentElement.remove();
  }
  if (!myRepositories.childElementCount) emptyList.classList.remove("hidden");
});
