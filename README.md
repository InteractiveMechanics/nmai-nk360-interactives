# NMAI NK360 Interactives

### TODO
* Add in details on project structure.
* Set up a distribution process for production
* Set up a system for data files for interactives that have multiple versions
* Set up a system for theme switching between modules for interactives that have multiple versions


### Getting started
* Clone the repository
* Run `npm install` in the project directory


### Project structure
Coming soon!

##### Shared assets
In the root project directory is a shared folder containing assets we can use for multiple interactives. Each directory has a symlink to the shared directory to reference these files during development. This may include Sass files, images/assets, written content, or JavaScript files.

##### Grunt
Each interactive has a Gruntfile that will run a local webserver with watch command `grunt dev`. If you want to run JSHint to lint all of your custom JavaScript files, you can run `grunt jshint`.

##### Commenting
As you go, be sure to comment your code to make sure it's clear. Write a short description of all functions (even if they seem obvious) and define each Sass file at the top of the file with a short description of what you might find in that folder. Use the following comment format where possible (include a short description of the function/file, and where appropriate, define the arguments and returned values):

```
/**
 * A short description of what this function/file does
 * @param {string|int|array} [argument] Description
 * @return {string|int|array} Description
```

##### Refactoring
This project will be delivered to the web development team at NMAI for integration, so refactor often to clean out code cruft and improve code. Add comments in, clean up file structure. There should be no JavaScript or CSS in HTML files!


### Unit testing
We'll be setting up unit tests using [QUnit](http://qunitjs.com/) to confirm functionality continues to work as the interactives are built and changes are made. For an introduction to unit testing, please read QUnit's [Intro to Unit Testing](http://qunitjs.com/intro/) and the QUnit [Cookbook](http://qunitjs.com/cookbook/).

##### Setting up tests
In each interactive's project folder, there is a `test` directory. For each function/method, there should be a test HTML file that runs through each aspect of that function to ensure that any data or DOM manipulation still runs successfully. As you build project features, be sure to write your tests as you go.