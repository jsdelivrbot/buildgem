---
title: "Contributing"
description: How to contribute to BuildGem, a free and open source software project.
canonical: /contributing/
template: article
status: published
---


BuildGem is a free and open source project made possible by generous contributions from software engineers, both expert and novice, from around the world.

There are three ways that you can contribute to this project:

* Report bugs
* Suggest improvements
* Write plugins


## Report bugs

Bugs should be logged in the issue tracker that is attached to the relevant source code repository. Here are the links to the issue trackers for BuildGem and its plugins:

* [buildgem](https://github.com/buildgem/buildgem/issues)
* [buildgem-copy](https://github.com/buildgem/copy/issues)
* [buildgem-md](https://github.com/buildgem/md/issues)
* [buildgem-sass](https://github.com/buildgem/sass/issues)

Before reporting a bug, please check that it has not been fixed already. Download the latest stable build from the ``master`` branch and try to reproduce the error. Also review the package's issue tracker to check that the bug has not been reported previously.

Follow these guidelines when reporting an issue:

* Provide clear step-by-step instructions to reproduce the error.
* State the expected behaviour and the actual behaviour.
* Describe the host environment in which you encountered the error: operating system, Node.js version, etc.
* Include a reduced test case that fails, if possible.
* Collect and attach any relevant logs.
* Provide screenshots or a video, if applicable.
* File one issue at a time.

Please do not use the issue trackers for support requests. There are [better channels](/support/) for those.


## Suggest improvements

If you have an idea for a new feature of another way to improve BuildGem, please submit your idea to the relevant issue tracker (see above) and tag it as an "enhancement".

Take a moment to consider if your idea fits within the scope of the BuildGem project. Take your time to develop a strong case for the feature, providing as much detail and context as possible.

If your idea is approved, the project maintainers may ask if you would be willing to contribute the necessary source code changes to implement the feature. If you are willing to do this, please use the following "fork-and-branch" workflow.


### Workflow

From the project's GitHub page, click "Fork" to add a copy of the repository to your own GitHub account.

``git clone`` your origin repository to your local development environment.

From the ``master`` branch, create a temporary feature branch, where you will do your work. We ask that you use the following naming convention for feature branches:

```
issue/<no>-<description>
```

Where ``<no>`` is the issue number in the issue tracking system, and ``<description>`` is a short summary of the fix or the desired state of the system. Example: ``issue/18-add-minify-option``. Linking your feature to the original issue will help the project maintainers to review and integrate your work later.

```
git checkout master
git pull origin master
git checkout -b issue/<no>-<description>
```

Make your changes and stage and commit them to your local development repository. Commit early and often. Each commit, as much as possible, should be a single logical change. Include any tests and documentation that is relevant to the work you've done.

```
git add .
git commit -m "<message>"
```

Before pushing your work to your origin repository on GitHub, be sure to keep your branch bang up-to-date with the project's mainline. First, you will need to add another remote that points to the original project repository. The convention is to name this the "upstream" repository.

```
git remote add upstream https://github.com/buildgem/<repo-name>.git
```

Use ``rebase`` to pull down the latest commits from the upstream master branch into your local feature branch. You should do this regularly, and always immediately before pushing your work to your origin repository on GitHub. Rebasing rewrites the history of the branch you're working on. It replays your commits on top of the changes that you pull in. This preserves the order of the changes, keeping your work at the tip. The effect is that when you push your work to your origin repository, it will produce a fast-forward and a nice clean history.

```
git pull --rebase upstream master
```

Sort out any merge conflicts and re-run your tests. If everything is OK, push your commits to the same-named branch in your origin repository.

```bash
git push -u origin issue/<no>-<description>
```

When you have pushed all of the work that you want to contribute, you are ready to submit a pull request. A pull request notifies the maintainers of the upstream repository, who will review your changes and, if the changes are approved, merge them into the main project.

Go to the GitHub page for your forked upstream repository. Go to the "Pull requests" section and click the "New pull request" button. Click "Compare across forks". Set the base fork to the upstream repository that you would like your work merged into. Choose ``master`` for the base branch. The head fork and branch should be set to your own GitHub repository and your ``issue/*`` branch.

Write a meaningful title and a complete description of all your changes. Be sure to unselect the checkbox "Allow edits from maintainers". Finally, click "Create pull request".

After your pull request is approved, you can remove the ``issue/*`` branch from your local and origin repositories:

```
git checkout master
git branch -d issue/<no>-<description>
git push --delete origin issue/<no>-<description>
```

**Please do not submit unsolicited pull requests.** First pitch your contribution to the project's maintainers, by opening an issue. This is for your benefit. We don't want people spending hours of their spare time working on something that ultimately has to be rejected because the feature is already in the pipeline or does not fit the project roadmap.


## Write plugins

For BuildGem to be useful to as many people as possible, we need an extensive ecosystem of community plugins. If you write your own BuildGem plugins, please consider open sourcing them. We recommend publishing your plugin to the NPM registry, prefixing the package name "buildgem-" so that it will be easy to discover.

You should also tell us about your plugin by [opening an issue here](https://github.com/buildgem/plugins/issues). We will link to your plugin from the buildgem.com website.

It is easy to write your own BuildGem plugins. Use this as a template:

```javascript
module.exports = plugin

function plugin (options) {
  options = options || {}

  return function (source, destination, next) {
    // ...

    next()
  }
}
```

``options`` is a configuration object. The inner function is the plugin proper, which gets called when a build is triggered. The plugin is given three parameters: the paths to the ``source`` and ``destination`` directories, and a reference to the ``next`` plugin in the chain. The only requirement of a BuildGem plugin is that is **always** executes the ``next`` function.

