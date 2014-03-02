## Basic Install ##
This is **Parametric RC Parts**. Install by running `npm install`, this will install dependencies in folder `node_module`. Use `npm start` to run using `package.json` `start` property, which is set to use the package `always` to run `app.js`, it restarts the process automatically and listens for file changes.

*Docco* is used for generating documentation, it simply uses the comments in the code. It can be installed using `npm install -g docco` and used like `docco file.js`.

*JSlint* can be used to regularly check code quality, either on `www.jslint.com` or by `npm install -g jslint` and subsequently `jslint file.js`, though I'm not sure how useful this is.

## Ubuntu install ##
When installing on Ubuntu, two things need to be installed: *Node.js* and *MongoDB*. Install *Node.js* (and implicitly *npm*) using [these instructions](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager#wiki-ubuntu-mint-elementary-os) (official). Then install *MongoDB* using [these](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-ubuntu/#install-mongodb) (official) installation instructions.

### Backups and FTP ###
For making backups, it might be useful to use LVM ([mongodb instructions](http://docs.mongodb.org/manual/tutorial/back-up-databases-with-filesystem-snapshots/#lvm-backup-and-restore)) to make a snapshot and then download that using FTP. For FTP on Ubuntu, *vsftpd* can be used.

## Behaviour Driven Development ##
Fancy term, but it works great. If you first specify behaviour and then implement it, it's much easier to see what you've done and to fix stuff. I use *Jasmine* for this. The tests can be found in the folder `/spec`. I use dummy data objects to test the database. Frontend testing can be done with *Casper*, but I think that just browser-testing the front-end will work just fine. For the backend however, it's damn handy.

## CSS preprocessor ##
I started using Stylus as CSS preprocessor. Its syntax is similar to *Jade*, and those are both similar to *Python*. It is integrated into the *Node* app and re-compiles the `.styl` file on each first request, or on each request (using the `forced` option).

## CADview ##
The 'CADview' class in `CADview.js` contains all functionality for retrieving and rendering a part from `part/PARTID/threejson`. It uses *Three.js* to do this. Packaging this functionality in a module enables easy re-use and eventually open-sourcing. Future features can include: toggling wireframe view, a model composition tree with checkboxes to turn parts of the model on/off, reflective shading, and other stuff. Maybe the best philosophy is to try and come close to a CAD view. That means **enabling the user to have the most accurate interpretation of the object's geometry and size**.