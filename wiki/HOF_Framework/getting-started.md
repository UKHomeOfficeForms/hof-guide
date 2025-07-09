---
title: — Getting Started —
path: '/1-getting-started'
---
```toc
```
## Preamble

It is expected when following these guides that you have a basic knowledge of unix terminals and are running OSX or a Linux operating system.

It is also expected that you have a working knowledge of javascript and node.js and are comfortable installing packages from npm. You should also be comfortable working with git.

This documentation is written with the assumption that you are using the latest versions of hof modules. Not all of this documentation will be relevant if you are not using the latest versions.

## Requirements

hof is built in [node.js](https://nodejs.org/en/), and so you'll need that installed first. At present all versions 4 and above are supported, although it is recommended that you use the [latest LTS version](https://github.com/nodejs/LTS#lts-schedule).

hof also requires npm version 3 or greater, and yarn. You can check your installed versions by running `npm -v` and `yarn -v` and update to the latest versions by running `npm install -g npm@latest` and `npm install -g yarn`.

To run hof apps locally for development you will either need a local instance of redis running, or docker installed.

* How to [install redis on OSX](https://medium.com/@petehouston/install-and-config-redis-on-mac-os-x-via-homebrew-eb8df9a4f298#.jcwwhv7oz)
* How to [install docker on OSX](https://docs.docker.com/docker-for-mac/install/#install-and-run-docker-for-mac)

### Creating your first form

The fastest way to create a new hof app is to use the [hof skeleton app](https://github.com/UKHomeOfficeForms/hof-skeleton). This will provide you with a bare-bones hof form that you can build on top of.

Clone the repo into a destination folder of your chosing: 

`git clone git@github.com:UKHomeOfficeForms/hof-skeleton.git`

(full setup instructions can be found in the [hof-skeleton readme](https://github.com/UKHomeOfficeForms/hof-skeleton?tab=readme-ov-file#hof-skeleton))

Install the initial dependencies `yarn install`

You can then start your app by running `docker-compose up` or `yarn start:dev` (needs local redis instance).

If you open [http://localhost:8080](http://localhost:8080) in a browser then you should see your app.
