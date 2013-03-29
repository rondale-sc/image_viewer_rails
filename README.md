# ImageViewerRails

This project rocks and uses MIT-LICENSE.

#[View Live Demo](http://jonathan-jackson.net/image_viewer_rails/)

A rails engine to serve imageviewer js files easily and ubiquitiously

ImageViewerRails is simply a wrapper for a javascript library that will load an array of images to your screen and offer controls for manipulating those images.  It was designed to be used with forms on pages for quick and efficient data entry.  It provides a nav bar that allows for rotation, zooming, and more.   Most of the allowable manipulations have corrolary key listeners which we'll cover a little more below. 

Once you've run through the installation (see below) you can run something like the following:

```html
<script type="text/javascript">
  $(document).ready(function(){
    $('#ImageViewer').imageViewer(["/assets/test_image_1.jpeg", "/assets/test_image_2.jpeg"]);
  });
</script>
```

Which will render something like:

![example_screenshot_1](https://raw.github.com/rondale-sc/image_viewer_rails/master/public/example_screenshot_1.png)

The current image will by default be loaded to fit the width of the image container (which is not shown in the screenshot above).  If you'd like to over-ride that default you can pass the option `zoomDirection` like so:

```javascript
settings = {zoomDirection: 'height'}
$('#ImageViewer').imageViewer(['/images.png'], settings)
```

Once you have the image viewer initialized you can start using it.  The functions in the nav links area are mapped to the following keys:

![keyboard_screenshot](https://raw.github.com/rondale-sc/image_viewer_rails/master/public/keyboard.png)

Clicking the info link in the nav section will display a modal legend with all of the hotkeys listed.

## Command Mode

Image Viewer Rails supports what we call 'command mode'.  The image viewer is designed to be used closely with forms (for example, demographic entry) because of this intent we needed a way to minimize users' need to use the mouse.  So we added keyboard shortcuts for all of the actions.  The happy path allows our users to stay on the home row.   When a user is entering data in the form and needs to see the next page (for example) we didn't want them to have to tab out of the input.  Enter [Keymaster](https://github.com/madrobby/keymaster) by Thomas Fuchs.  Keymaster allowed us to set a mode.  We always trap `\`, which toggles keymaster trapping in input, select, and textarea  fields.  

1. Press `\` once to enter command mode
2. Image Viewer keybinds are obliged even while in field inputs until...
3. Press `\` again to leave command mode 

To alert a user that they are in command mode we have an overlay in the center of the nav links bar that displays the letters `CM` when in command mode.  This alert looks like:

![example_screenshot_2](https://raw.github.com/rondale-sc/image_viewer_rails/master/public/example_screenshot_2.png)

## Installation

Since this mostly just serves up commonly used js files for internal use all you need to do is add the following lines to your `Gemfile`

```ruby
gem "image_viewer_rails", "~> 0.1.0"
```

In your `app/assets/javascripts/application.js` (manifest file) add the following:

```
//= require jquery
//= require image_viewer_rails
```

In your `app/assets/stylesheets/application.css.scss` (manifest file) add the following:

```
//= require image_viewer_rails
```

Doing so will tell rails to load the following files

- image_viewer.js
- [jquery.rotate.js](https://code.google.com/p/jquery-rotate/)
- [keymaster.js](https://github.com/madrobby/keymaster)
- keymaster_filter.js
- jquery-rails (if it isn't already loaded)

## Contributing

Thanks for your interest in contributing to image_viewer_rails.  ImageViewerRails is tested using jasmine and jasminerice.  Since it's a rails engine there are some interesting testing patterns that we must use to get everything working as we expect.  We have a dummy app that lives inside the `spec` directory.  This enables us to run our tests in the context of an actual rails application.  To that end, our tests are located in `spec/dummy/spec/javascripts` directory.  They've been loosely separated by their function so jumping in shouldn't be too hard.

### Testing 

[jasminerice](https://github.com/bradphelan/jasminerice) is also a rails engine that mounts to our dummy app at `/jasmine`.  To fire up the test suite run `rails s` inside the `spec/dummy` directory and head over to `http://localhost:3000/jasmine`.

[guard-jasmine](https://github.com/netzpirat/guard-jasmine) allows us to leverage phantom.js (headless browser) and create a better environment.  

- Install Phantom Js
  - Best way on a mac is `brew install phantom`
- `cd spec/dummy`
- guard

Tests are written in CoffeeScript

### Tips and Tricks

Guard Jasmine provides a rudimentary console logger.  Most typical way to use it is to call `console.log`.  But you can also use `warn`, `debug`, `info` and a few others.

If that isn't enough you can boot up a `rails s` inside the `spec/dummy` directory and point your browser to the root url at `localhost:3000/` and you'll be able to debug the image viewer on the page.

Once you've gotten the testing underway just follow the standard:

1. Fork it
2. Create your feature branch (git checkout -b my-new-feature)
3. Commit your changes (git commit -am 'Added some feature')
4. Push to the branch (git push origin my-new-feature)
5. Create new Pull Request 
