# goStyle

A lightweight CSS framework. All classes are prefixed with `gs-`.

## Use

```html
<link rel="stylesheet" href="dist/gostyle.min.css">
<script src="dist/gostyle.min.js"></script> <!-- only needed for modal, tabs, dropdown, navbar toggle, alert close -->
```

After publishing, replace the paths with your CDN links.

## Components

| Component | Main classes |
|---|---|
| Buttons | `gs-btn`, `gs-btn-outline`, colors (`-secondary -success -danger -info -warning -dark -light`), sizes (`-sm -lg -block`) |
| Grid (12 columns) | `gs-container`, `gs-container-fluid`, `gs-row`, `gs-col`, `gs-col-1` to `12`, `gs-col-auto`, `gs-offset-N`; responsive: `gs-col-sm/md/lg/xl-N` (576 / 768 / 992 / 1200px and up) |
| Card | `gs-card`, `gs-card-body`, `gs-card-title` |
| Forms (all fields share one look; edit `--gs-field-*` variables) | `gs-form-group`, `gs-label`, `gs-input`, `gs-select`, `gs-textarea`, `gs-check`, `gs-switch`, `gs-input-group`, `gs-input-error`, `gs-form-error` |
| Table | `gs-table`, `-striped`, `-hover`, `-bordered`, `-sm`, `gs-table-responsive` |
| Lists / menu | `gs-list`, `gs-list-inline`, `gs-list-group(-item)`, `gs-menu`, `gs-menu-item` |
| Navbar | `gs-navbar`, `-dark`, `-sticky`, `gs-navbar-brand`, `gs-navbar-menu`, `gs-nav-link`, `gs-navbar-toggle` |
| Breadcrumb / pagination | `gs-breadcrumb(-item)`, `gs-pagination`, `gs-page-item`, `gs-page-link` |
| Select / custom select | every `<select class="gs-select">` becomes the styled dropdown automatically (needs `gostyle.min.js`); or write it by hand with `gs-custom-select` (+ `data-gs-select`), `gs-custom-select-trigger`, `-value`, `-arrow`, `-menu`, `gs-option` (`gs-active`, `gs-disabled`) |
| (old) Custom select | `gs-custom-select` (+ `data-gs-select`), `gs-custom-select-trigger`, `-value`, `-arrow`, `-menu`, `gs-option` (`gs-active`, `gs-disabled`) |
| Dropdown | `gs-dropdown`, `gs-dropdown-menu`, `gs-dropdown-item` |
| Tabs | `gs-tabs`, `gs-tab-list`, `gs-tab`, `gs-tab-panel` |
| Accordion | `gs-accordion`, `gs-accordion-item` (a `<details>`), `gs-accordion-header` (a `<summary>`), `gs-accordion-body` |
| Modal | `gs-modal`, `gs-modal-dialog`, `-header`, `-body`, `-footer` |
| Alerts / badges | `gs-alert-*`, `gs-badge-*`, `gs-badge-pill` |
| Progress / spinner | `gs-progress`, `gs-progress-bar`, `gs-spinner` |
| Misc | `gs-close`, `gs-divider`, `gs-avatar`, `data-gs-tooltip="text"` |

State classes: `gs-active`, `gs-disabled`, `gs-open`.

## Design

Soft layered shadows, a violet gradient accent, pill-shaped navigation and generous round corners.
Colors, radius and shadows come from the variables in `src/_variables.css`
(`--gs-primary`, `--gs-accent`, `--gs-gradient`, `--gs-radius-lg`, `--gs-shadow-sm/md/lg`).

Checkbox, radio and switch size and color: `--gs-check-size` (default `.825rem`) and `--gs-check-color` (default dark, used when checked or on).
Tooltips: simple `data-gs-tooltip="text"`, or a rich `gs-tooltip` with a `gs-tooltip-action` button (see the comment at the bottom of `src/_misc.css`).

## More components

| Component | Main classes |
|---|---|
| Card variants | `gs-card-lift`, `-gradient`, `-dark`, `-glass`, `-outline`, `gs-card-header/footer/img`, stat: `gs-stat`, `gs-stat-label/value/trend` |
| Table variants | `gs-table-hover`, `-striped`, `-cards`, `-bordered`, `-sm` |
| Tabs | default (segmented), `gs-tabs-pills`, `gs-tabs-line` |
| Badges | `gs-badge-*` (soft), `-solid`, `-gradient`, `-square`, `-plain` |
| Chip | `gs-chip`, `gs-chip-primary/success/...` |
| Stepper / timeline | `gs-stepper` + `gs-step` (`gs-done`, `gs-active`), `gs-timeline` + `gs-timeline-item` |
| Loaders | `gs-spinner`, `gs-dots`, `gs-skeleton`, `gs-progress-animated` |
| Toast | `goStyle.toast("Saved", "success")` or `data-gs-toggle="toast" data-gs-message="..." data-gs-type="success"` |
| Other | `gs-empty`, `gs-blockquote`, `gs-kbd`, `gs-code`, `gs-pre`, `gs-lead`, `gs-eyebrow`, `gs-avatar-group`, `gs-list-check` |

## Utilities (numbered scale, 1 step = 4px)

`gs-p-3`, `gs-mt-2`, `gs-px-4`, `gs-gap-2`, `gs-b-radius-2`, `gs-b-width-1`, `gs-fs-3`, `gs-fw-5`, `gs-w-50`,
`gs-text-primary`, `gs-bg-danger`, `gs-b-color-success`, `gs-shadow-2`, `gs-text-center`, `gs-flex`, ...

## JavaScript

```html
<button data-gs-toggle="modal" data-gs-target="#myModal">Open</button>
<button data-gs-tab="#panel1">Tab</button>
<button data-gs-toggle="dropdown">Menu</button>
<button data-gs-toggle="collapse" data-gs-target="#navMenu">Toggle</button>
<button data-gs-dismiss="modal">Close</button>   <!-- or "alert" -->
```

## Build

```
npm run build
```

Edit files in `src/`, then build to regenerate `dist/`. Numbered utilities come from `generate.js`.
