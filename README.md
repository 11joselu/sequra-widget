# SeQura Custom Element Widget

A lightweight and framework-agnostic custom element (`<sequra-instalment-widget>`) that displays installment options for products using SeQura. This widget is designed for seamless integration into any merchant website with minimal impact on performance, SEO, or existing front-end code.

---


## Table of Contents
- [Usage](#usage)
- [Installation](#installation)
- [Development](#development)
- [Testing](#testing)
  - [Unit Tests](#unit-tests)
  - [End-to-End Tests](#end-to-end-tests)
    - [🔥 Smoke Test](#smoke-test)
- [Usage in Merchant Website](#usage-in-merchant-website)
  - [Quick Start (Recommended)](#quick-start-recommended)
  - [Manual Integration (Advanced)](#manual-integration-advanced)
    - [Refreshing the Widget](#refreshing-the-widget)
- [Technical Choices, Tradeoffs & Assumptions](#technical-choices-tradeoffs--assumptions)
  - [Web Component](#web-component)
  - [Vite + TypeScript](#vite--typescript)
  - [Mocked API](#mocked-api)
  - [Code Quality: Husky + Prettier + ESLint](#️-code-quality-husky--prettier--eslint)
  - [Assumptions & Improvements](#️-assumptions--improvements)

---

## Usage
`<sequra-instalment-widget>` attributes

The custom element accepts the following attributes:

- `value` (**required**) – Product price in **cents** (e.g., 12999 for €129.99). This determines the installment plan.
- `id` (*optional*) – An optional DOM `id` to identify the widget instance. This is only required if you want to refresh it dynamically using JavaScript.

Example:

```html
<sequra-instalment-widget 
  id="product-sequra-widget" 
  value="12999">
</sequra-instalment-widget>
```

This renders the widget for a product priced at €129.99 and allows for future dynamic updates using:

```javascript
window.seQura.refresh('product-sequra-widget', 14999); // Update to €149.99
```

---

## Installation

> Requires Node.js and npm installed. Node 22.15 or later is recommended

Clone the repository and install dependencies:

```bash
git clone https://github.com/11joselu/sequra-widget.git
cd <project-directory>
npm install
cp .env.example .env # Copy the example environment file
````

## Development
To run the development environment:

```bash
npm run dev
```
This will start:

- The Vite dev server for live reloading
- A mock API server (api/) that simulates backend responses


## Testing
### Unit Tests

```bash
npm run test
```

Unit tests are written using Vitest and use nock to mock external HTTP requests. This allows the tests to run in isolation without depending on the actual backend.

> Nock intercepts the API calls and returns predefined responses to simulate different scenarios and verify the widget's behavior accordingly.

### End-to-End Tests
Start the dev server first:

```bash
npm run dev
```

In a separate terminal:

```bash
npm run e2e
```

E2E tests are written using Playwright and simulate real user interactions inside a Chromium browser.

#### 🔥 Smoke Test
This project includes a smoke test, which is a lightweight end-to-end test that verifies the most basic and critical functionality (the “happy path”). It checks that:
- The widget is loaded correctly in the browser
- It displays the expected financing information
- API integration works under ideal conditions

> Note: This test only covers the happy path, meaning it doesn't test edge cases, error handling, or network failures. That validation was made in unit tests.

## Usage in Merchant Website

### Quick Start (Recommended)
To see the widget running inside a simulated merchant site with full integration:

```bash
npm run merchant:preview
```

This command:

- Builds the widget
- Copies the output into the merchant-site folder
- Starts the mock API server

Launches a local server at: http://localhost:3000/product-page.html

> ✅ No need to manually inject the script or add the tag — it’s already configured for you.
To use the widget on a merchant site:


### Manual Integration (Advanced)
If you want to integrate the widget manually:


1. Inject the script:

```html
<script src="<url>/seQueraInstalmentWidget.js"></script>
```

2. Add the widget tag in the desired location:
```html
<sequra-instalment-widget value="<product_price_in_cents>"></sequra-instalment-widget>
```

#### Refreshing the Widget

If the product price changes dynamically and you need to update the widget, assign it an **id** and call:

```html
<sequra-instalment-widget id="product-sequra-widget" value="12999"></sequra-instalment-widget>
```

```javascript
window.seQura.refresh('product-sequra-widget', 14999); // New value in cents
```

## Technical Choices, Tradeoffs & Assumptions

### Web Component
**Why**: Chose to implement the widget as a [Custom Element](https://developer.mozilla.org/en-US/docs/Web/Web_Components) to ensure:
- ✅ Framework-agnostic integration with any merchant site
- ✅ Minimal footprint with no external dependencies
- ✅ Encapsulation of logic and style

### Why Use a Custom Element?

- **No Framework Required** – Works in any web environment
- **Fast & Lightweight** – Minimal JavaScript and zero dependencies
- **Isolated** – Prevents conflicts with merchant site styles or scripts
- ‍️**SEO Friendly** – Content remains crawlable and non-intrusive
- **Easy to Integrate** – Simple script injection and usage


**Tradeoff**: 
- Lack of built-in state management and templating found in modern frameworks like React/Vue. Resolved using native APIs and simple rendering logic.
- Testing custom elements can be more complex than testing components in frameworks, but this was mitigated by using custom renderings accessing directly to jsdom document.

---

### ⚡ Vite + TypeScript
**Why**:
- Fast local development with hot module reloading
- Native support for ES modules
- Type safety and editor tooling via TypeScript

---

### 📡 Mocked API
**Why**: Local development and testing needed to simulate real-world conditions without relying on the actual SeQura API.

**Implementation**:
- API requests intercepted in unit tests using [`nock`](https://github.com/nock/nock). No setup required for developers to run tests.

---

### 🛡️ Code Quality: Husky + Prettier + ESLint

To ensure consistent code style and prevent broken code from being committed:

- **Husky** is used to run Git hooks
- **Prettier** formats code automatically
- **ESLint** catches common code issues and enforces best practices
- **Vitest** runs unit tests before each commit

✅ A pre-commit hook is set up to:
1. Lint and auto-fix code using ESLint
2. Format files with Prettier
3. Run all related unit tests to catch regressions early

✅ A pre-push hook is set up to:
3. Run all unit tests to catch regressions early

This workflow helps maintain high-quality, clean, and reliable code throughout development.

### Assumptions & Improvements

- **Resilient Event Handling**: Currently, the app assumes that if sending analytics or tracking events fails (e.g., network error or endpoint unavailable), it should **fail silently** to avoid disrupting the user experience. This is intentional to keep the widget running smoothly.  

- **Installments Always Returned**: The implementation assumes the SeQura API always returns valid installment data for a given price.  
  ✅ *Improvement*: Introduce fallback UI states for edge cases (e.g., empty response, unsupported amount) to improve robustness and clarity for users.

- **Show error message**: The implementation assumes that we show an error message if the API call fails.  
  ✅ *Improvement*: Add a retry mechanism to handle transient network issues and improve user experience.

