var cart = [];

window.addEventListener("message", function (event) {
  let eventData = event.data;

  if (eventData.type == "show") {
    if (eventData.enable == true) {
      $("#container").fadeIn();
    } else {
      $("#container").fadeOut();
    }
  }
});
var amount = 0;
function updateTotalPrice() {
  var totalPrice = 0;
  var payItems = document.querySelectorAll(".pay");

  payItems.forEach(function (item) {
    var itemPrice = parseFloat(
      item.querySelector("#pay-price").textContent.replace("$", "")
    );
    var itemAmount = parseInt(
      item.querySelector("#pay-amount").textContent,
      10
    );
    totalPrice += itemPrice * itemAmount;
  });

  // Toplam fiyatı güncelle
  document.getElementById("shopping-cart-price").textContent =
    "$" + totalPrice.toFixed(2);
}
function addPay(data) {
  var clickedData = data.closest(".shopping-product");
  var productId = clickedData.dataset.id;
  var allProducts = document.querySelectorAll(".pay-section");

  // Data-id'si 1 olan ürün var mı kontrol et
  var productExists = document.querySelector(
    '.pay-section [data-id="' + productId + '"]'
  );

  if (productExists) {
    var amountElement = productExists.querySelector("#pay-amount");
    var currentAmount = parseInt(amountElement.textContent, 10);
    amountElement.textContent = currentAmount + 1;
    updateTotalPrice();
  } else {
    $("#pay-empty-title").fadeOut(300);
    var productName = clickedData.querySelector("#name").textContent;
    var productPrice = clickedData
      .querySelector("#price")
      .textContent.replace("$", "");
    var iconClass = clickedData.querySelector("i").classList;
    $(".pay-section").prepend(`
        <div onclick=deletePay(this) class="pay" data-id="${productId}">
            <a id="pay-name"><i class="fa-solid ${iconClass[1]}"></i>&nbsp; ${productName}</a>
            <a id="pay-amount">1</a>
            <a id="pay-price"><i class="fa-solid fa-dollar-sign"></i>${productPrice}</a>
        </div>
        `);
    updateTotalPrice();
  }
}

function deletePay(data) {
  var amountElement = data.querySelector("#pay-amount");
  var currentAmount = parseInt(amountElement.textContent, 10);

  // Eğer sadece 1 adet varsa ürünü sil, aksi takdirde miktarı azalt
  if (currentAmount > 1) {
    amountElement.textContent = currentAmount - 1;
  } else {
    $(data).remove();
  }
}

function Exit() {
  $.post("https://by-shop/exit", JSON.stringify());
}

function Buy() {
  var payItems = document.querySelectorAll(".pay-section .pay");
  var items = [];

  payItems.forEach(function (item) {
    var id = item.dataset.id;
    var amount = item.querySelector("#pay-amount").textContent;
    var price = item.querySelector("#pay-price").textContent;
    items.push({ id: id, amount: amount, price: price });
  });
  items.forEach(function (item) {
    console.log("ID:", item.id, "Amount:", item.amount);
  });
  $.post(
    "https://by-shop/buy",
    JSON.stringify((items = items)),
    function (cdata) {
      if (!cdata) {
        console.log("paranız yeterli değil");
      } else {
        console.log("başarıyla satın alındı");

        payItems.forEach(function (item) {
          item.remove();
        });
        document.getElementById("shopping-cart-price").textContent = "$0.00";
        $("#pay-empty-title").fadeIn(1200);
      }
    }
  );
}

$(document).ready(function () {
  updateTotalPrice();
  product.forEach(function (element) {
    $(".page").append(`
        <div class="shopping-product" data-id="${element.id}">
            <img id="image" src="./img/${element.image}.png" alt="">
            <a id="name"><i id="icon" class="fa-solid ${element.icon} fa-xs"></i>&nbsp; ${element.name}</a>
            <a id="price">$${element.price}</a>
            <button onclick=addPay(this) id="btnBuy"><i class="fa-solid fa-plus"></i></button>
        </div>
    `);
  });
  var paySection = document.querySelector(".pay-section");
  var payItems = paySection.querySelectorAll(".pay");

  if (payItems.length === 0) {
    $("#pay-empty-title").fadeIn();
  }
});
