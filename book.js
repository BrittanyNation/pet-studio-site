/* Willow Creek Pet Studio — working booking form.
   Service, pet name, and add-ons update the visit summary and total
   live; submitting validates and ends in a booking-request
   confirmation. Front-end demo only: no real booking is submitted. */
(function () {
  "use strict";

  var SERVICES = {
    groom:    { name: "Full Groom", price: 68 },
    bath:     { name: "Bath & Brush", price: 42 },
    daycare:  { name: "Daycare — Full Day", price: 32 },
    boarding: { name: "Boarding — per night", price: 54 }
  };
  var ADDONS = {
    addon1: { name: "De-shedding treatment", price: 10 },
    addon2: { name: "Teeth brush", price: 6 },
    addon3: { name: "Extra boarding photo set", price: 0 }
  };
  function money(n) { return "$" + n; }

  function init() {
    var form = document.getElementById("visit-form");
    if (!form) return;
    var petName = document.getElementById("pet-name");
    var service = document.getElementById("service");
    var date = document.getElementById("date");
    var owner = document.getElementById("owner");
    var contact = document.getElementById("contact");
    var lines = document.getElementById("visit-lines");
    var totalEl = document.getElementById("visit-total");
    var btn = document.getElementById("book-btn");
    var layout = document.getElementById("visit-layout");
    var confirm = document.getElementById("visit-confirmation");

    function total() {
      var t = SERVICES[service.value].price;
      Object.keys(ADDONS).forEach(function (k) {
        var box = document.getElementById(k);
        if (box && box.checked) t += ADDONS[k].price;
      });
      return t;
    }
    function render() {
      var svc = SERVICES[service.value];
      var pet = petName.value.trim() || "your pet";
      var html = '<div class="summary-row"><span>' + svc.name + " — " + pet + "</span><strong>" + money(svc.price) + "</strong></div>";
      Object.keys(ADDONS).forEach(function (k) {
        var box = document.getElementById(k);
        if (box && box.checked) {
          html += '<div class="summary-row"><span>' + ADDONS[k].name + "</span><strong>" +
            (ADDONS[k].price === 0 ? "Free" : money(ADDONS[k].price)) + "</strong></div>";
        }
      });
      html += '<div class="summary-row"><span>Medication, if needed</span><strong>$0</strong></div>';
      html += '<div class="summary-row"><span>Report card &amp; photo</span><strong>Included</strong></div>';
      lines.innerHTML = html;
      var t = total();
      totalEl.textContent = money(t);
      btn.textContent = "Request this visit — " + money(t) + " total";
    }
    [service, petName].forEach(function (el) {
      el.addEventListener("change", render);
      el.addEventListener("input", render);
    });
    Object.keys(ADDONS).forEach(function (k) {
      var box = document.getElementById(k);
      if (box) box.addEventListener("change", render);
    });

    function setErr(input, id, bad) {
      var e = document.getElementById(id);
      if (e) e.classList.toggle("show", bad);
      input.classList.toggle("invalid", bad);
      return !bad;
    }
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var ok = true;
      ok = setErr(petName, "err-pet", petName.value.trim().length < 1) && ok;
      var today = new Date(); today.setHours(0, 0, 0, 0);
      var p = (date.value || "").split("-").map(Number);
      var chosen = p.length === 3 ? new Date(p[0], p[1] - 1, p[2]) : null;
      ok = setErr(date, "err-date", !chosen || chosen < today) && ok;
      ok = setErr(owner, "err-owner", owner.value.trim().length < 2) && ok;
      var c = contact.value.trim();
      var contactOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c) || c.replace(/\D/g, "").length >= 7;
      ok = setErr(contact, "err-contact", !contactOk) && ok;
      if (!ok) { var f = form.querySelector(".invalid"); if (f) f.focus(); return; }
      var ref = "WC-" + (1000 + Math.floor(Math.random() * 9000));
      document.getElementById("conf-ref").textContent = ref;
      document.getElementById("conf-detail").textContent =
        SERVICES[service.value].name + " for " + petName.value.trim() + " · Preferred date: " + date.value +
        " · Total due at pickup: " + money(total());
      document.getElementById("conf-contact").textContent = contact.value.trim();
      layout.hidden = true;
      confirm.hidden = false;
      confirm.setAttribute("tabindex", "-1");
      confirm.focus();
    });

    render();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
