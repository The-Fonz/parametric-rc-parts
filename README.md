## Basic Install ##
This is **Parametric RC Parts**. Install by running `npm install`, this will install dependencies in folder `node_module`. Use `npm start` to run using `package.json` `start` property, which is set to use the package `always` to run `app.js`, it restarts the process automatically and listens for file changes.

*Docco* is used for generating documentation, it simply uses the comments in the code. It can be installed using `npm install -g docco` and used like `docco file.js`.

*JSlint* can be used to regularly check code quality, either on `www.jslint.com` or by `npm install -g jslint` and subsequently `jslint file.js`, though I'm not sure how useful this is.

## Ubuntu install ##
When installing on Ubuntu, two things need to be installed: *Node.js* and *MongoDB*. Install *Node.js* (and implicitly *npm*) using [these instructions](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager#wiki-ubuntu-mint-elementary-os) (official). Then install *MongoDB* using [these](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-ubuntu/#install-mongodb) (official) installation instructions.

### Backups and FTP ###
For making backups, it might be useful to use LVM ([mongodb instructions](http://docs.mongodb.org/manual/tutorial/back-up-databases-with-filesystem-snapshots/#lvm-backup-and-restore)) to make a snapshot and then download that using FTP. For FTP on Ubuntu, *vsftpd* can be used.