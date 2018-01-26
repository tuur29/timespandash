# Timespan Dashboard

A small tool to generate statistics and graphs form a list of timestamps.

## Configuration

You can edit all the settings in `/config.json`, these are all possible options:

```
{
  "url": "https://<URL>:<SERVER_PORT>/<PATH>?keywords=",
  "defaultKeywords": "sleep,wake",
  "allPossibleKeywords": [
    { "keywords": "boot,shut", "description": "PC" },
    { "keywords": "sleep,wake", "description": "Sleep" }
  ]
}
```

## Example input

```
start at Mon Dec 26 10:01:39 GMT+0100 2016
stop at Mon Dec 26 22:55:33 GMT+0100 2016
start at Tue Dec 27 09:26:36 GMT+0100 2016
stop at Tue Dec 27 21:30:59 GMT+0100 2016
```

There is also a complete test dataset calles `/sampledata.txt`.

## Development server

Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The frontend will automatically reload if you change any of the source files.

## Build & Deploy

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build. Add `--base-href="./"` when you are deploying to a subdirectory.

### Local

You can also run this app locally by opening the generated `dist/index.html` file. Alternatively you can also download the latest release on [Github](https://github.com/tuur29/timespandash/releases).

### Github Pages

When building for Github Pages you should build with add: `--base-href "https://USERNAME.github.io/REPOSITORY_NAME/"`. Next, duplicate the `index.html` file and name it `404.html `.

To publish it, remove `/dist` from `.gitignore`, make a local commit and push to the gh-pages branch with:

```
$ git push origin `git subtree split --prefix dist master`:gh-pages --force
```

Lastly undo the edit in `.gitignore` and reset your master branch with `git reset HEAD~`.
Don't forget to re-enable your custom domain if you are using one.

[More Info](http://clontz.org/blog/2014/05/08/git-subtree-push-for-deployment/)

### Automated deploy

The script `deploy.sh` should do all the above actions automatically. You should have completed the process manually first before you use the script.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
