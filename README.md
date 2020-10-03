# frontend-starter-kit
Minimal frontend only boilerplate with gulp, zurb panini, postcss and babel.

The following packages are required to run the project:
- node js
- npm

## Available Commands
Open command window and navigate to project's folder root(where 'gulpfile.bebel.js' and 'package.json' files are located). There we can execute the following commands:
<table width="100%">
  <tr>
    <th>Command</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>npm install</td>
    <td>This command download all gulp dependencies and store them in 'node_modules' folder. We execute this command only once, when we start new the project.</td>
  </tr>
  <tr>
    <td>npm start</td>
    <td>This command create background process that watches all source files for changes compile them in '/dist' folder. We execute this command only once before we start making changes in source files.</td>
  </tr>
  <tr>
    <td>npm run assets</td>
    <td>Clean assets folder and update the content in it.</td>
  </tr>
  <tr>
    <td>npm run build</td>
    <td>Command that build static pages, compile, copy and minify resources.</td>
  </tr>
  <tr>
    <td>npm run serve</td>
    <td>Optional simple server that is serving /dist folder on localhost:8080 by default.</td>
  </tr>
</table>

## What should I do first
- Clone the project.
```sh
$ git clone <REPO_URL>
```
- Delete .git folder.
```sh
$ rm -rf .git/
```
- Build static pages for the first time(creates 'dist' folder).
```sh
$ npm run build
```
- Start work on your project.
```sh
$ npm start
```

### Folder structure:
```
<PROJECT_ROOT>
  └─src
    └─markup    # html partials
    └─styles    # css source files
    └─scripts   # js source files
  └─dist
    └─markup    # static html
    └─styles    # compiled css
    └─scripts   # compiled js
```
