---
title: Advanced Form Customisation
---
```toc
```
This section of will assume you already have a basic understanding of the framework, and have gone through Basic Form Customisation. 

# Configuring Steps

## Journey Forking

For each step definition can have a `next` property, the value of which is the next route in the journey. If the step in the form is successfully submitted, by default the `next` step will load. However, sometimes you will want to go to a different page depending on the users response to a quesiton in the form, this is where you can use the `forks` property. 

```js

'/my-page': {
    next: '/next-page',
    forks: [{
        target: '/fork-page',
        condition: {
            field: 'example-radio',
            value: 'superman'
        }
    }]
}
```

The `condition` property can also take a function. In the following example, if the field called 'name' is more than 30 characters in length, the page at '/fork-page' will be loaded.

```js

'/my-page': {
    next: '/next-page',
    forks: [{
        target: '/fork-page',
        condition: function (req, res) {
            return req.form.values['name'].length > 30;
        }
    }]
}
```

Forks is an array and therefore each fork is interrogated in order from top to bottom. The last fork whose condition is met will assign its target to the next page variable.

In this example, if the last condition resolves to true - even if the others also resolve to true - then the page at '/fork-page-three' will be loaded. The last condition to be met is always the fork used to determine the next step.

```js

'/my-page': {
    next: '/next-page',
    forks: [{
        target: '/fork-page-one',
        condition: function (req, res) {
            return req.form.values['name'].length > 30;
        }
    }, {
        target: '/fork-page-two',
        condition: {
            field: 'example-radio',
            value: 'superman'
        }
    }, {
        target: '/fork-page-three',
        condition: function (req, res) {
            return typeof req.form.values['email'] === 'undefined';
        }
    }]
}
```

# Configuring Fields

## Conditionally Revealling a Question

For questions using the radio or checkbox components, you can conditonally reveal a question when they select a particular option so the user will only see a question when it is relevent to them. For more details on when to use this follow the Government Design System (GDS) Guidance. 

[Radio](https://design-system.service.gov.uk/components/radios/)
[Checkboxes](https://design-system.service.gov.uk/components/checkboxes/)

To do this using the HOF framework, in the index.js file, add the step which will have the conditional reveal question and add all the fields which will be displayed on the page, including the ones which will be conditionally revealed. 

```js:title=index.js
  steps: {
    '/contact': {
      fields: [
        'contactDetails',
        'email-text',
        'phone-text'      
      ]
      next: '/address' 
    }
```
In the field.js file, for the main radio/ checkbox option, define the mixin for the field and add the values to each of the options. In the options array, where you would add the value of the options for the radio/checkbox, also add a `toggle` property to each option with the the name of the field you want to conditionally reveal.

```js:title=field.js
    'contactDetails': {
      mixin: 'radio-group',
      validate: ['required'],
      legend: {
        className: 'visuallyhidden'
      },
      options: [{
        value: 'email',
        toggle: 'email-text'
      }, {
        value: 'phone',
        toggle: 'phone-text'
      }]
    }, 
```
Once you have defined the radio/checkbox field, define your new conditionally revealed fields. With these fields you will need to add a `dependent` property to the field. This property will define when the field is revealed, so it takes an object with a value which will be the value of the option selected, and the a field property which will have a value which is the name of the radio/checkbox field. 

```js:title=field.js
    'contactDetails': {
      mixin: 'radio-group',
      validate: ['required'],
      legend: {
        className: 'visuallyhidden'
      },
      options: [{
        value: 'email',
        toggle: 'email-text'
      }, {
        value: 'phone',
        toggle: 'phone-text'
      }]
    }, 
    'email-text': {
      validate: ['required'],
      dependent: {
        value: 'email',
        field: 'contactDetails'
      }
    },
     'phone-text': {
      validate: ['required'],
      dependent: {
        value: 'phone',
        field: 'contactDetails'
      }
    },
```
At this point, when you view your page in your browser you will see the labels to all the fields and the radio/checkbox fields. When you then select one of these options, the input field will then appear. As you do not want to see the labels of the conditionally revealed steps before the user has selected one of the options, in the views folder, create a html file with the same name as the step, in this case contact.html and use the following code to render the radio/checkbox field only. Inbetween the `renderfield` tags add the name of the radio/checkbox field. 

```html:title=views/contact.html
{{<partials-page}}
  {{$page-content}}

    {{#renderField}}contactDetails{{/renderField}}

    {{#input-submit}}continue{{/input-submit}}
  {{/page-content}}
{{/partials-page}}
```
At this point, when you view the page you will now only see the radio/checkbox fields and when you select one of the options the field will not be revealed. To fix this, in your views folder, create a partials folder, and add a html file with the following code: 

```html:title=views/partials/toggle.html
<div id="{{toggle}}-panel" class="reveal" aria-hidden="false">
  <div class="panel-indent">
    {{#input-text}}{{toggle}}{{/input-text}}
  </div>
</div>
```
In the field.js file add a `child` property to the options array, which will be the path to the file just created in the partials folder. 

```js:title=field.js
  'contactDetails': {
    mixin: 'radio-group',
    validate: ['required'],
    legend: {
      className: 'visuallyhidden'
    },
    options: [{
      value: 'email',
      toggle: 'email-text',
      child: 'partial/toggle'
    }, {
      value: 'phone',
      toggle: 'phone-text',
      child: 'partial/toggle'
    }]
  },
```

You should now have a radio/checkbox question, which will reveal another question when the user selects an options, from here you can add labels and validations to the fields. 

