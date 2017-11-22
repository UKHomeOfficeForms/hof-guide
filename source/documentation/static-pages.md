# Static Pages

Pages define the static pages for your app such as, `/cookies` or `/terms-and-conditions`.
They can be defined in an existing app adjacent to `steps` or in an app of their own, without `steps`.

## Adding pages

Open the index.js file in a text editor. You will see a configuration that looks like this.

```js
steps: {
  ...
  '/confirm': {
    behaviours: ['complete', require('hof-behaviour-summary-page')],
    next: '/complete'
  },
  ...
}
```

Now define the `pages`, where a key (`'/cookies'`) is the path to the page and a value (`'cookies'`) is the name of the view used to render the page.

```js
steps: {
  ...
  '/confirm': {
    behaviours: ['complete', require('hof-behaviour-summary-page')],
    next: '/complete'
  },
  ...
},
pages: {
  '/cookies': 'cookies',
  '/privacy-policy': 'privacy',
}
```


### Custom view location

By default views are loaded from the views directory in the current working directory. If necessary, views can be loaded from a custom location, set by adding a `views` option to the configuration for the route, e.g;

```js
views: './my/custom/views',
pages: {
  '/cookies': 'cookies',
  '/privacy-policy': 'privacy',
}
```


Make sure you have a view with the appropriate name in the apps\` views directory, or the custom views location if it's set, one called `cookies.html` and another called `privacy.html`.

Now if you restart your server and go to `http://localhost:8080/my-hof-form/cookies` in the browser you should see the content of the cookies view rendered to the browser. Visit `http://localhost:8080/my-hof-form/privacy-policy` and you will see the content of the privacy view rendered to the browser.
