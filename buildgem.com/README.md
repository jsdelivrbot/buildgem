
# [![BuildGem](https://cdn.rawgit.com/buildgem/logo/2.1.0/dist/png/buildgem-logo-240x60.png)](https://github.com/buildgem)


## Build

To rebuild the website, run the following command from the project's root directory. The website files are rebuilt in the ``build`` directory.

```
node lib/build
```


## Deploy

This website is hosted by GitHub Pages. To deploy, use the ``git subtree`` command to separately push the contents of the ``build`` directory to the ``gh-pages`` (GitHub Pages) branch in the origin repository. 

First, with ``master`` checked out, add and commit the contents of the ``build`` directory to the staging area. Use the ``-f`` (force) flag when adding the build files to the staging area. Without this flag, the ``add`` command will fail because the ``build`` directory is excluded from version control via the ``.gitignore`` file.

```
git add -f build
git commit -m "Rebuild"
```

Split off the ``build`` directory and set this as the root for a temporary local branch called ``temp``.

```
git subtree split --prefix build -b temp
```

Push the changes in the local ``temp`` branch to the ``gh-pages`` branch in the remote origin repository. If you do not force this you may get an "Updates were rejected" error, because git will think that the remote branch contains work that your local branch does not. The ``-f`` flag forces local changes to overwrite everything on the server.

```
git push -f origin temp:gh-pages
```

You no longer need the local ``temp`` branch so you can delete it.

```
git branch -D temp
```

GitHub Pages are cached, and our domain is behind the Cloudflare reverse proxy, so it can take several minutes for deployed changes to appear online.


## Save

Changes to the source files can now be committed and pushed to ``master``. The ``build`` directory is excluded by ``.gitignore``, so it's contents should not get added to the ``master`` mainline.

```
git add .
git commit -m "<message>"
git push origin master
```


## Scripts

The build and deployment steps above are automated via the following commands:

```
npm run build
npm run deploy
npm run save
```
