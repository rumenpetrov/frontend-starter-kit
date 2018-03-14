# Frontend workflow with gulp, zurb panini and postcss.

Required:
- node js + npm
- gulp js


## Commands
Open command window and navigate to project's folder root(where "gulpfile.js" and "package.json" files are located). There we can execute the following commands:
- npm install - This command download all gulp dependencies and store them in "node_modules" folder. We execute this command only once, when we start new the project.
- gulp watch - This command create background proccess that watch all source files for changes and build static pages and compile resources in "/build" folders. We execute this command only once before we start making changes in source files.
- gulp - Command that build static pages, compile and minify resources.

### Source files locations:
- static html - "/templates/source"
- compiled css - "/styles/source"
- compiled js - "/scripts/source"

### Production files locations:
- static html - "/templates/build"
- compiled css - "/styles/build"
- compiled js - "/scripts/build"