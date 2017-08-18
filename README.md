# NMAI NK360 Interactives

### TODO
* ~~Add Slick for swiping slideshows~~
* ~~Add lightGallery for image lightboxes~~
* ~~Add WYSIWYG editor for News Article Creator~~
* Pull in shared tooltips and audio pronunciations
* Set up a distribution process for production
* Configure dev/dist process for multiple versions and themes

### Getting started
* Clone the repository
* Run `npm install` in the project directory

##### Working with this repo
There will be at least three people actively working in this repository. Keep it clean and organized for everyone's sake. If you make a change that impacts other people, please notify them via Slack and submit the change as a Pull Request with reviewers assigned so we can approve it. Pull anything that can benefit the team into the `Shared` directory where possible to save time.


### Project structure
Each project folder (see 5-news-article-creator for a sample) should follow the same structure:
- css: automatically built by grunt
- data: contains json data files
- js: contains js files
- sass: contains sass files
- shared: symlink to shared directory
- test: contains qUnit tests

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


### Google Analytics
We're using Google Analytics for this project for analytics tracking. We'll use our local GA account for development for easier testing. Here is the tracking code:

```
<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-28789452-3', 'auto');
  ga('send', 'pageview');
</script>
```

##### Common tracking functions
There is a shared function file that can be used to call a simple `sendAnalyticsEvent` function and `sendAnalyticsTiming` function. See this file for detailed use.


### Unit testing
We'll be setting up unit tests using [QUnit](http://qunitjs.com/) to confirm functionality continues to work as the interactives are built and changes are made. For an introduction to unit testing, please read QUnit's [Intro to Unit Testing](http://qunitjs.com/intro/) and the QUnit [Cookbook](http://qunitjs.com/cookbook/).

##### Setting up tests
In each interactive's project folder, there is a `test` directory. For each function/method, there should be a test HTML file that runs through each aspect of that function to ensure that any data or DOM manipulation still runs successfully. As you build project features, be sure to write your tests as you go.

### Deployment
We will use Grunt to generate the deployment/installation versions of the interactives. Each interactive will have a specific deploy script (coming soon) that will package that interactive up with its appropriate assets and data—relevant for the interactives that are built to be used as templates.

##### What to send to NMAI for final delivery
- Raw code based (repository)
- Deployment versions of all interactives (12x)
- Instructions for installation
- Administrative or other documentation
