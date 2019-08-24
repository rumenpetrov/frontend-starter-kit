# frontend-starter-kit
Modern frontend only architecture with gulp, zurb panini, postcss and babel.

The following packages are required to run the project:
- node js
- npm

## Available Commands
Open command window and navigate to project's folder root(where 'gulpfile.bebel.js' and 'package.json' files are located). There we can execute the following commands:
- npm install - This command download all gulp dependencies and store them in 'node_modules' folder. We execute this command only once, when we start new the project.
- npm start - This command create background process that watches all source files for changes compile them in '/dist' folder. We execute this command only once before we start making changes in source files.
- npm run assets - Clean assets folder and update the content in it.
- npm run build - Command that build static pages, compile, copy and minify resources.
- npm run serve - Optional simple server that is serving /dist folder on localhost:8080 by default.

## What should I do first
- Clone the project.
```bash
$ git clone <REPO_URL>
```
- Delete .git folder.
```bash
$ rm -rf node_modules
```
- Build static pages for the first time(creates 'dist' folder).
```bash
$ npm run build
```
- Start work on your project.
```bash
$ npm start
```

### Source files locations:
- static html - 'src/markup'
- compiled css - 'src/styles'
- compiled js - 'src/scripts'

### Compiled files locations:
- static html - 'dist/'
- compiled css - 'dist/styles'
- compiled js - 'dist/scripts'