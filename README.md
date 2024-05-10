# Sample vanilla JS Single Page application

This application demonstrates an implementation of a simple Single Page Application (SPA).

The main goal of this sample is to demonstrate how routing workings, by using [`history.pushState`](https://developer.mozilla.org/en-US/docs/Web/API/History/pushState) and the [`popstate` event](https://developer.mozilla.org/en-US/docs/Web/API/Window/popstate_event).

The routing allows for static "pages", with HTML as a string, or a "dynamic component" using pure JavaScript.

## Running

To run it, use an HTTP server that redirects all 404 requests to server **index.html**

With node and npx, using the [serve](https://www.npmjs.com/package/serve) package:
```bash
npx serve -s .
```