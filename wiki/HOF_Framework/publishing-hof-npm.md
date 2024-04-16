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

step 1 : npm login
it will request for your username and password .
step 2 : if you have a 403 forbidden message, copy this link and replace <username> with your username https://registry.npmmirror.com/-/user/org.couchdb.user:<username>.

## How to deploy a beta version
After we have implemented our new feature the first thing we do is to bump the version as we would also do for a regular release.

It is crucial that we add <name-of-feature>-beta.0 at the end of your version. The .0 indicates which beta version it is. When we publish a new fix as beta, we will increment the .0 to .1 and so on.

So our version should, for example, look like this: 20.4.0-notify-upgrade-8.0.0-beta.0.

commit all changes and it is a good practise to always add a git tag to the beta version 
  - example: git tag 20.4.0-notify-upgrade-8.0.0-beta.0

## Tagging a HOF release

By default when ```npm publish``` is run it will tag the package and publish as latest. 

To a tag and publish a beta upgrade for redis this could be entered as: ```npm publish --tag upgrade-redis-beta``` at the root directory of the HOF repo.

Once published it should look like this:

<img src="../images/wiki_how_tos/published-hof-beta.png" alt="Image Description" width="75%">


## Using beta version in a service

Open package.json and paste the version: ```"hof": "20.2.11-upgrade-redis-beta"``` and then run yarn to install beta.

