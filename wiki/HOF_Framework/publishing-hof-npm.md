---
title: Publishing a HOF package
---

```toc
# This code block gets replaced with the Table Of Contents
```
## Publishing a HOF beta version

Sometimes a developer may need to upgrade the HOF framework as an improvement or to patch security issues by upgrading dependencies. Upgrades to dependencies that are major (e.g. redis v3.2.1 to redis v4.6.6) should be tested on a few HOF services before releasing a new version of HOF.

For the correct permissions ensure you are a member of hof organisation on https://www.npmjs.com/.
You may also need to login to the terminal with your npm credentials before being able to publish.


## Tagging a HOF release

By default when ```npm publish``` is run it will tag the package and publish as latest. 

To a tag and publish a beta upgrade for redis this could be entered as: ```npm publish --tag upgrade-redis-beta``` at the root directory of the HOF repo.

Once published it should look like this:

![](../images/wiki_how_tos/published-hof-beta.png)

## Using beta version in a service

Open package.json and paste the version: ```"hof": "20.2.11-upgrade-redis-beta"``` and then run yarn to install beta.

