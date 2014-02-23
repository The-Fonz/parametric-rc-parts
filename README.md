This is Parametric RC Parts. Install by running `npm install`, this will install dependencies in folder `node_module`. Use `npm start` to run using `package.json` `start` property, which is set to use the package `always` to run `app.js`, it restarts the process automatically and listens for file changes.

Docco is used for generating documentation, it simply uses the comments in the code. It can be installed using `npm install -g docco` and used like `docco file.js`.

JSlint can be used to regularly check code quality, either on `www.jslint.com` or by `npm install -g jslint` and subsequently `jslint file.js`, though I'm not sure how useful this is.