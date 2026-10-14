/*! goStyle JS v0.1.0 | MIT License */
(function () {
  "use strict";
  var OPEN = "gs-open";
  var ACTIVE = "gs-active";
  var HIGHLIGHT = "gs-highlight";

  function find(sel, root) { return (root || document).querySelector(sel); }
  function findAll(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  /* ---------- modal ---------- */
  function openModal(modal) {
    modal.classList.add(OPEN);
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("gs-modal-open");
  }
  function closeModal(modal) {
    modal.classList.remove(OPEN);
    modal.setAttribute("aria-hidden", "true");
    if (!find(".gs-modal.gs-open")) { document.body.classList.remove("gs-modal-open"); }
  }

  /* ---------- dropdown ---------- */
  function closeDropdowns() {
    findAll(".gs-dropdown.gs-open").forEach(function (d) { d.classList.remove(OPEN); });
  }

  /* ---------- custom select ---------- */
  function optionsOf(box) { return findAll(".gs-option:not(.gs-disabled)", box); }

  function highlight(box, opt) {
    findAll(".gs-option.gs-highlight", box).forEach(function (o) { o.classList.remove(HIGHLIGHT); });
    if (!opt) { return; }
    opt.classList.add(HIGHLIGHT);
    var menu = opt.parentNode;
    if (opt.offsetTop < menu.scrollTop) {
      menu.scrollTop = opt.offsetTop;
    } else if (opt.offsetTop + opt.offsetHeight > menu.scrollTop + menu.clientHeight) {
      menu.scrollTop = opt.offsetTop + opt.offsetHeight - menu.clientHeight;
    }
  }

  function openSelect(box) {
    closeSelects(box);
    box.classList.add(OPEN);
    var trigger = find(".gs-custom-select-trigger", box);
    if (trigger) { trigger.setAttribute("aria-expanded", "true"); }
    highlight(box, find(".gs-option.gs-active", box) || optionsOf(box)[0]);
  }

  function closeSelect(box) {
    box.classList.remove(OPEN);
    var trigger = find(".gs-custom-select-trigger", box);
    if (trigger) { trigger.setAttribute("aria-expanded", "false"); }
    findAll(".gs-option.gs-highlight", box).forEach(function (o) { o.classList.remove(HIGHLIGHT); });
  }

  function closeSelects(except) {
    findAll(".gs-custom-select.gs-open").forEach(function (b) { if (b !== except) { closeSelect(b); } });
  }

  function setValue(box, opt, silent) {
    findAll(".gs-option", box).forEach(function (o) {
      o.classList.remove(ACTIVE);
      o.setAttribute("aria-selected", "false");
    });
    opt.classList.add(ACTIVE);
    opt.setAttribute("aria-selected", "true");
    var text = opt.textContent.replace(/^\s+|\s+$/g, "");
    var value = opt.hasAttribute("data-value") ? opt.getAttribute("data-value") : text;
    var label = find(".gs-custom-select-value", box);
    if (label) { label.textContent = text; }
    var input = find("input[type=hidden], select[data-gs-enhanced]", box);
    if (input) { input.value = value; }
    if (!silent) {
      box.dispatchEvent(new CustomEvent("gs-select-change", { bubbles: true, detail: { value: value, text: text } }));
      if (input) { input.dispatchEvent(new Event("change", { bubbles: true })); }
    }
  }

  /* every <select class="gs-select"> is turned into the custom dropdown automatically;
     the real <select> stays inside (hidden) so forms, names and change events keep working */
  function syncFromSelect(box, select) {
    var match = findAll(".gs-option", box).filter(function (o) { return o.getAttribute("data-value") === select.value; })[0];
    if (match) { setValue(box, match, true); }
  }

  function enhanceSelect(select) {
    if (select.hasAttribute("data-gs-enhanced") || select.multiple || select.size > 1) { return; }

    var box = document.createElement("div");
    box.className = "gs-custom-select";
    box.setAttribute("data-gs-select", "");
    ["sm", "lg"].forEach(function (z) { if (select.classList.contains("gs-input-" + z)) { box.classList.add("gs-custom-select-" + z); } });
    ["error", "success"].forEach(function (z) { if (select.classList.contains("gs-input-" + z)) { box.classList.add("gs-custom-select-" + z); } });

    var trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "gs-custom-select-trigger";
    trigger.disabled = select.disabled;
    trigger.innerHTML = '<span class="gs-custom-select-value"></span><span class="gs-custom-select-arrow"></span>';

    var menu = document.createElement("ul");
    menu.className = "gs-custom-select-menu";

    function addOption(o) {
      var li = document.createElement("li");
      li.className = "gs-option" + (o.disabled ? " gs-disabled" : "") + (o.selected ? " gs-active" : "");
      li.setAttribute("data-value", o.value);
      li.textContent = o.textContent;
      menu.appendChild(li);
    }
    Array.prototype.slice.call(select.children).forEach(function (child) {
      if (child.tagName === "OPTGROUP") {
        var g = document.createElement("li");
        g.className = "gs-option-group";
        g.textContent = child.label;
        menu.appendChild(g);
        Array.prototype.slice.call(child.children).forEach(addOption);
      } else if (child.tagName === "OPTION") {
        addOption(child);
      }
    });

    select.parentNode.insertBefore(box, select);
    box.appendChild(trigger);
    box.appendChild(menu);
    box.appendChild(select);
    select.classList.add("gs-select-native");
    select.setAttribute("data-gs-enhanced", "true");
    select.setAttribute("tabindex", "-1");
    select.setAttribute("aria-hidden", "true");

    menu.setAttribute("role", "listbox");
    trigger.setAttribute("aria-haspopup", "listbox");
    trigger.setAttribute("aria-expanded", "false");
    findAll(".gs-option", box).forEach(function (o) {
      o.setAttribute("role", "option");
      o.setAttribute("aria-selected", o.classList.contains(ACTIVE) ? "true" : "false");
    });
    var current = find(".gs-option.gs-active", box);
    if (current) { setValue(box, current, true); }

    select.addEventListener("change", function () { syncFromSelect(box, select); });
    select.addEventListener("focus", function () { trigger.focus(); });
  }

  function enhanceSelects() {
    findAll("select.gs-select:not([data-gs-enhanced])").forEach(enhanceSelect);
  }

  function initSelects() {
    findAll("[data-gs-select]").forEach(function (box) {
      var menu = find(".gs-custom-select-menu", box);
      var trigger = find(".gs-custom-select-trigger", box);
      if (menu) { menu.setAttribute("role", "listbox"); }
      if (trigger) {
        trigger.setAttribute("aria-haspopup", "listbox");
        trigger.setAttribute("aria-expanded", "false");
      }
      findAll(".gs-option", box).forEach(function (o) {
        o.setAttribute("role", "option");
        o.setAttribute("aria-selected", o.classList.contains(ACTIVE) ? "true" : "false");
      });
      var current = find(".gs-option.gs-active", box);
      if (current) { setValue(box, current, true); }
    });
  }

  function startSelects() {
    enhanceSelects();
    initSelects();
    if (window.MutationObserver) {
      new MutationObserver(enhanceSelects).observe(document.body, { childList: true, subtree: true });
    }
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startSelects);
  } else {
    startSelects();
  }

  /* form reset: put the custom dropdowns back to the native value */
  document.addEventListener("reset", function (e) {
    setTimeout(function () {
      findAll("select[data-gs-enhanced]", e.target).forEach(function (sel) {
        var b = sel.closest(".gs-custom-select");
        if (b) { syncFromSelect(b, sel); }
      });
    }, 0);
  }, true);

  /* ---------- toast ---------- */
  function toast(message, type, ms) {
    var box = find(".gs-toast-container");
    if (!box) {
      box = document.createElement("div");
      box.className = "gs-toast-container";
      box.setAttribute("aria-live", "polite");
      document.body.appendChild(box);
    }
    var el = document.createElement("div");
    el.className = "gs-toast gs-toast-" + (type || "primary");
    el.setAttribute("role", "status");
    var text = document.createElement("span");
    text.className = "gs-toast-text";
    text.textContent = message;
    var close = document.createElement("button");
    close.type = "button";
    close.className = "gs-close";
    close.setAttribute("aria-label", "Close");
    close.innerHTML = "&times;";
    function remove() {
      el.classList.add("gs-leaving");
      setTimeout(function () { if (el.parentNode) { el.parentNode.removeChild(el); } }, 260);
    }
    close.addEventListener("click", remove);
    el.appendChild(text);
    el.appendChild(close);
    box.appendChild(el);
    if (ms !== 0) { setTimeout(remove, ms || 3500); }
    return el;
  }

  /* ---------- clicks ---------- */
  document.addEventListener("click", function (e) {
    var t = e.target;
    if (!t || !t.closest) { return; }

    /* custom select: open/close, choose an option; any other click closes open ones */
    var box = t.closest(".gs-custom-select");
    closeSelects(box);
    if (box) {
      if (t.closest(".gs-custom-select-trigger")) {
        e.preventDefault();
        if (box.classList.contains(OPEN)) { closeSelect(box); } else { openSelect(box); }
        return;
      }
      var opt = t.closest(".gs-option");
      if (opt && !opt.classList.contains("gs-disabled")) {
        setValue(box, opt);
        closeSelect(box);
        var trig = find(".gs-custom-select-trigger", box);
        if (trig) { trig.focus(); }
      }
      return;
    }

    /* data-gs-toggle="modal | collapse | dropdown" */
    var toggle = t.closest("[data-gs-toggle]");
    if (toggle) {
      var type = toggle.getAttribute("data-gs-toggle");
      var target = toggle.getAttribute("data-gs-target");
      if (type === "modal") {
        e.preventDefault();
        var modal = target && find(target);
        if (modal) { openModal(modal); }
        return;
      }
      if (type === "toast") {
        e.preventDefault();
        toast(toggle.getAttribute("data-gs-message") || "", toggle.getAttribute("data-gs-type"));
        return;
      }
      if (type === "collapse") {
        e.preventDefault();
        var panelBox = target && find(target);
        if (panelBox) { toggle.setAttribute("aria-expanded", String(panelBox.classList.toggle(OPEN))); }
        return;
      }
      if (type === "dropdown") {
        e.preventDefault();
        var dd = toggle.closest(".gs-dropdown");
        if (dd) {
          var wasOpen = dd.classList.contains(OPEN);
          closeDropdowns();
          if (!wasOpen) { dd.classList.add(OPEN); }
        }
        return;
      }
    }

    /* data-gs-tab="#panelId" */
    var tab = t.closest("[data-gs-tab]");
    if (tab) {
      e.preventDefault();
      var panel = find(tab.getAttribute("data-gs-tab"));
      var list = tab.closest(".gs-tab-list");
      var wrap = tab.closest(".gs-tabs") || (list && list.parentNode);
      if (list && panel && wrap) {
        findAll(".gs-tab", list).forEach(function (b) { b.classList.remove(ACTIVE); });
        findAll(".gs-tab-panel", wrap).forEach(function (p) { p.classList.remove(ACTIVE); });
        tab.classList.add(ACTIVE);
        panel.classList.add(ACTIVE);
      }
      return;
    }

    /* data-gs-dismiss="modal | alert" */
    var dismiss = t.closest("[data-gs-dismiss]");
    if (dismiss) {
      var what = dismiss.getAttribute("data-gs-dismiss");
      if (what === "modal") {
        var m = dismiss.closest(".gs-modal");
        if (m) { closeModal(m); }
      } else if (what === "alert") {
        var a = dismiss.closest(".gs-alert");
        if (a && a.parentNode) { a.parentNode.removeChild(a); }
      }
      return;
    }

    /* click on the dark backdrop closes the modal */
    if (t.classList.contains("gs-modal")) { closeModal(t); return; }

    /* click outside (or on an item) closes dropdowns */
    if (!t.closest(".gs-dropdown") || t.closest(".gs-dropdown-item")) { closeDropdowns(); }
  });

  /* ---------- keyboard ---------- */
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      findAll(".gs-modal.gs-open").forEach(closeModal);
      closeDropdowns();
      closeSelects(null);
      return;
    }
    var t = e.target;
    var box = t && t.closest ? t.closest(".gs-custom-select") : null;
    if (!box) { return; }

    var isOpen = box.classList.contains(OPEN);
    var opts = optionsOf(box);
    var current = find(".gs-option.gs-highlight", box);
    var index = opts.indexOf(current);

    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!isOpen) { openSelect(box); return; }
      var next = e.key === "ArrowDown" ? Math.min(index + 1, opts.length - 1) : Math.max(index - 1, 0);
      highlight(box, opts[next]);
    } else if ((e.key === "Home" || e.key === "End") && isOpen) {
      e.preventDefault();
      highlight(box, e.key === "Home" ? opts[0] : opts[opts.length - 1]);
    } else if ((e.key === "Enter" || e.key === " ") && t.closest(".gs-custom-select-trigger")) {
      e.preventDefault();
      if (isOpen) {
        if (current) { setValue(box, current); }
        closeSelect(box);
      } else {
        openSelect(box);
      }
    } else if (e.key === "Tab" && isOpen) {
      closeSelect(box);
    }
  });

  /* stops the browser's "click" after a Space key press on the trigger (handled in keydown) */
  document.addEventListener("keyup", function (e) {
    if (e.key === " " && e.target && e.target.closest && e.target.closest(".gs-custom-select-trigger")) {
      e.preventDefault();
    }
  });

  /* ---------- public API ---------- */
  window.goStyle = {
    openModal: function (sel) { var m = find(sel); if (m) { openModal(m); } },
    closeModal: function (sel) { var m = find(sel); if (m) { closeModal(m); } },
    toast: toast,
    getSelectValue: function (sel) {
      var el = find(sel);
      if (!el) { return null; }
      if (el.tagName === "SELECT" || el.tagName === "INPUT") { return el.value; }
      var input = find("input[type=hidden], select[data-gs-enhanced]", el);
      return input ? input.value : null;
    },
    refreshSelects: function () {
      findAll("select[data-gs-enhanced]").forEach(function (sel) {
        var b = sel.closest(".gs-custom-select");
        if (b) { syncFromSelect(b, sel); }
      });
    }
  };
})();
