const BASE_URL = "https://cdn.moneyconvert.net/api/latest.json";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// ✅ Populate dropdowns
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;

    if (select.name === "from" && currCode === "USD") {
      newOption.selected = true;
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = true;
    }

    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

// ✅ Update exchange rate (NEW API)
const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;

  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }

  const from = fromCurr.value;
  const to = toCurr.value;

  try {
    let response = await fetch(BASE_URL);
    let data = await response.json();

    let rates = data.rates;

    // ✅ conversion formula
    let rate = rates[to] / rates[from];

    let finalAmount = amtVal * rate;

    msg.innerText = `${amtVal} ${from} = ${finalAmount.toFixed(2)} ${to}`;
  } catch (error) {
    msg.innerText = "Error fetching exchange rate";
    console.log(error);
  }
};

// ✅ Update flag
const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];

  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

// 🔄 Swap currencies
const swapBtn = document.querySelector(".dropdown i");

swapBtn.addEventListener("click", () => {
  let temp = fromCurr.value;
  fromCurr.value = toCurr.value;
  toCurr.value = temp;

  updateFlag(fromCurr);
  updateFlag(toCurr);
  updateExchangeRate();
});

// ✅ Button click
btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

// ✅ Run on load
window.addEventListener("load", () => {
  updateExchangeRate();
});