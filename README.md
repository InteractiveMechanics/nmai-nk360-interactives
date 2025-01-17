# NMAI NK360 Interactives

### TODO
* ~~Add Slick for swiping slideshows~~
* ~~Add lightGallery for image lightboxes~~
* ~~Add WYSIWYG editor for News Article Creator~~
* ~~Pull in shared tooltips and audio pronunciations~~
* ~~Document all the third-party libraries being used~~
* ~~Set up a distribution process for production~~
* ~~Configure dev/dist process for multiple versions and themes~~

### Getting started
* Clone the repository
* Run `npm install` in the project directory

##### Working with this repo
There will be at least three people actively working in this repository. Keep it clean and organized for everyone's sake. If you make a change that impacts other people, please notify them via Slack and submit the change as a Pull Request with reviewers assigned so we can approve it. Pull anything that can benefit the team into the `shared/lib/im` directory where possible to save time.


### Project structure
Each project folder (see 5-news-article-creator for a sample) should follow the same structure:
- css: automatically built by grunt
- data: contains json data files
- js: contains js files
- sass: contains sass files
- test: contains qUnit tests

##### Shared assets
In the root project directory is a shared folder containing assets we can use for multiple interactives. This may include Sass files, images/assets, written content, or JavaScript files. Check the `shared/lib/im/code` directory for all shared code with sample markup.

##### Third-party libraries
We're using a number of outside libraries for different features, including:
- [Bootstrap](https://v4-alpha.getbootstrap.com) - for standard Bootstrap modules, includes Tether
- [jQuery](http://jquery.com/) - for, you know, jQuery things
- [jQuery UI](https://jqueryui.com/) - for draggable, droppable, etc.
- [jsRender](http://www.jsviews.com/#jsrender) - for templating
- [lightGallery](http://sachinchoolur.github.io/lightGallery/) - for lightbox modals
- [Quill](https://quilljs.com) - for client-side WYSIWYG editor
- [qUnit](https://qunitjs.com) - for JavaScript unit testing
- [Slick](http://kenwheeler.github.io/slick/) - for responsive slideshows

##### Grunt
Each interactive has a Gruntfile that will run a local webserver with watch command `grunt dev`. If you want to run JSHint to lint all of your custom JavaScript files, you can run `grunt jshint`.

For distribution, you can run `grunt dist` with several variables: `--json=m#a#`, `--dir=name-of-directory`, `--theme=theme-acronym`. For example, if you want to generate/build Module 1's (Pacific Northwest) Activity 1, and the directory provided by NMAI is "pnw-fishwars-markup", you can should run `grunt dist --json=m1a1 --dir=pnw-fishwars-markup --theme=pnw`. This will build a folder with the built files for that activity processed for deployment in the root of the repo. To see the full list of directory names from NMAI, go here: [https://docs.google.com/document/d/1tCZ--qR89ZD-peq41w0BEt1foUu9S7ratKCiMky3HQo/edit](https://docs.google.com/document/d/1tCZ--qR89ZD-peq41w0BEt1foUu9S7ratKCiMky3HQo/edit)

Here are all of the `grunt dist` commands you will need to run (by activity):
- Salmon Challenge: `grunt dist --dir=pnw1-salmon --theme=pnw --json=m3a1`
- Timeline: `grunt dist --dir=pnw2-timeline --theme=pnw --json=m4a1`
- Resource Annotator: `grunt dist --dir=plains1-markup1 --theme=np --json=m1a1`
- Resource Annotator: `grunt dist --dir=plains1-markup2 --theme=np --json=m1a2`
- Resource Annotator: `grunt dist --dir=plains2-markup1 --theme=np --json=m2a1`
- Resource Annotator: `grunt dist --dir=pnw1-markup1 --theme=pnw --json=m3a1`
- Resource Annotator: `grunt dist --dir=pnw2-markup1 --theme=pnw --json=m4a1`
- Resource Annotator: `grunt dist --dir=pnw2-markup2 --theme=pnw --json=m4a2`
- Puzzle: `grunt dist --dir=plains1-puzzle --theme=np --json=m1a1`
- Puzzle: `grunt dist --dir=pnw1-puzzle --theme=pnw --json=m3a1`
- News Article: `grunt dist --dir=plains2-news --theme=np --json=m2a1`
- News Article: `grunt dist --dir=pnw2-news --theme=pnw --json=m4a1`

##### Back to Lesson Paths
After running `grunt dist`, update the "Back to Lesson" paths to (not timeline):
- pnw1-salmon: `/nk360/pnw-history-culture/#sq2` // Return to Pacific Northwest History and Cultures Lesson
- plains1-markup1: `/nk360/plains-belonging-homelands/crow-nation.cshtml` // Return to Case Study
- plains1-markup2: `/nk360/plains-belonging-homelands/northern-cheyenne.cshtml` // Return to Case Study
- plains2-markup1: `/nk360/plains-treaties/index.cshtml#sq1` // Return to Northern Plains Treaties Lesson
- pnw1-markup1: `/nk360/pnw-history-culture-regions/pacific-coast.cshtml` // Return to Case Study
- pnw2-markup1: `/nk360/pnw-fish-wars/backlash.cshtml` // Return to Case Study
- pnw2-markup2: `/nk360/pnw-fish-wars/justice.cshtml` // Return to Case Study
- plains1-puzzle: `/nk360/plains-belonging/index.cshtml#summative` // Return to Northern Plains History and Cultures Lesson
- pnw1-puzzle: `/nk360/pnw-history-culture/#summative` // Return to Pacific Northwest History and Cultures Lesson
- plains2-news: `/nk360/plains-treaties/index.cshtml#summative` // Return to Northern Plains Treaties Lesson
- pnw2-news: `/nk360/pnw-fish-wars` // Return to Pacific Northwest Fish Wars Lesson

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

##### What do I track?
We'll create specific events for most interactives, but track events for the following situations as a default:
- When the screen changes
- When users start or stop something
- When users make an important action

Track timing functions once when necessary. This could be for seeing how long a user spends on a specific section that isn't automagically tracked by the page.


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
