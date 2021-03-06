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
  ],
  "settings": {
		"mergebreaks": { "enabled": true, "value": "10" },
		"remshortenthan": { "enabled": true, "value": "10" },
		"split": {"enabled": true },
		"avg": {"value": "7" },
		"median": {"enabled": true }
	}
}
```

You can find additional settings by searching for 'new Setting' in this repo: [link](https://github.com/search?utf8=%E2%9C%93&q=%22new+Setting%22+repo%3Atuur29%2Ftimespandash&type=Code).

## Example input

```
start at Mon Dec 26 10:01:39 GMT+0100 2016
stop at Mon Dec 26 22:55:33 GMT+0100 2016
start at Tue Dec 27 09:26:36 GMT+0100 2016
stop at Tue Dec 27 21:30:59 GMT+0100 2016
```

There is also a complete test dataset called `/sampledata.txt`.

## Development server

Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The frontend will automatically reload if you change any of the source files.

## Build & Deploy

Run `npm run build --prod -prod --no-aot --aot=false --base-href ./` to build the project. The build artifacts will be stored in the `dist/` directory.

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
