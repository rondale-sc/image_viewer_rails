# ImageViewerRails

This project rocks and uses MIT-LICENSE.

A rails engine to serve imageviewer js files easily and ubiquitiously

## Installation

Since this mostly just serves up commonly used js files for internal use all you need to do is add the following lines to your `Gemfile`

```ruby
gem "image_viewer_rails", "~> 0.0.1"
```

In your `app/assets/javascripts/application.js` (manifest file) add the following:

```
//= require image_viewer_rails
```

In your `app/assets/stylesheets/application.css.scss` (manifest file) add the following:

```
//= require image_viewer_rails
```

Doing so will tell rails to laod the following files

- image_viewer.js
- [jquery.rotate.js](https://code.google.com/p/jquery-rotate/)
- [keymaster.js](https://github.com/madrobby/keymaster)
- keymaster_filter.js
- jquery-rails (if it isn't already loaded)

## Contributing

Thanks for your interest in contributing to image_viewer_rails.  ImageViewerRails is tested using jasmine and jasminerice.  Since it's a rails engine there are some interesting testing patterns that we must use to get everything working as we expect.  Our tests are located in `spec/dummy/spec/javascripts` directory.  They've been loosely separated by their function.  

### Testing 

[jasminerice](https://github.com/bradphelan/jasminerice) is also a rails engine that mounts to `/jasmine`.  To fire up the test suite run `rails s` inside the `spec/dummy` directory.

[guard-jasmine](https://github.com/netzpirat/guard-jasmine) allows us to leverage phantom.js (headless browser) and create a better environment.  

- Install Phantom Js
  - Best way on a mac is `brew install phantom`
- `cd spec/dummy`
- guard

### Tips and Tricks

Guard Jasmine provides a rudimentary console logger.  Most typical way to use it is to call `console.log`.  But you can also use `warn`, `debug`, `info` and a few others.

If that isn't enough you can boot up a `rails s` inside the `spec/dummy` directory and point your browser to the root url at `localhost:3000/` and you'll be able to debug the image viewer on the page.

Once you've gotten the testing underway just follow the standard:

1. Fork it
2. Create your feature branch (git checkout -b my-new-feature)
3. Commit your changes (git commit -am 'Added some feature')
4. Push to the branch (git push origin my-new-feature)
5. Create new Pull Request 
