## 🚀 Quick start

1.  Fork/clone this repo and stick it into the relevant repo space on Github.
2.  Add a repository secret called 'DOCS_ACCESS_TOKEN' which has basic read/write access to the repo. If you are unsure on how to set this up then refer to Github's docs on [How To Setup a Personal Access Token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token). Once setup, go to your repo's 'Settings' and add the secret under the left hand side Settings navigation bar under 'Security -> Actions'.
    [Security Actions Settings](static/images/readme/where-to-add-repo-secret.png)
    [Repository Secret Example](static/images/readme/add-repo-secret.png)
3.  Setup Github Pages by going to 'Code and automation -> Pages' under the repo's Settings. Then turn on Github pages by specifying the branch to use for the static site (Default: 'gh-pages'; root '/' directory) and you should get a confirmation of the site address your static site will be deployed to.
    [Github Pages Settings](static/images/readme/where-to-setup-gh.png)
    [Default Configuration Setup for Github Page](static/images/readme/configure-gh.png)

### Local Development

1.  **Installing the Wiki**

    Start this site by ensuring at least [Node 16.15.0](https://nodejs.org/en/blog/release/v16.15.0/) is installed. You can do this using [Node Version Manager (NVM)](https://tecadmin.net/install-nvm-macos-with-homebrew/) and following the following instructions:
    ```shell
    # Use Node Version Manager to install Node v16.15.0 (latest LTS version)
    nvm install 16.15.0
    # Then use Node v16.15.0 before installing project dependencies
    nvm use 16.15.0
    # If yarn is not installed run the following to globally install it
    npm i yarn -g
    # Install project dependencies
    yarn
    ```

2.  **Run the Service**

    Run the following to start up the service on [Localhost](http://localhost:8080)
    ```shell
    yarn run develop
    ```
    Any updates will either automatically update the page or require a manual page reload.

### Deploying

1.  **Automated**

    Push or merge changes to master branch. These will trigger Git Actions that update and auto-deploy to a `gh-pages` branch. This in turn will deploy the static site to the relevant Github page link.

2.  **Manual**

    Alternatively you can run the following which is the manual approach to step 1 above.
    ```shell
    yarn run deploy
    ```
