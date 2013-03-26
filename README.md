# ImageViewerRails

This project rocks and uses MIT-LICENSE.

A rails engine to serve imageviewer js files easily and ubiquitiously

## Installation

Since this mostly just serves up commonly used js files for internal use all you need to do is add the following lines to your `Gemfile`

```ruby
gem "image_viewer_rails", "~> 0.0.1"
```

Then in your `app/assets/javascripts/application.js` (manifest file):

```
//= require 'image_viewer_rails'
```

Doing so will tell rails to laod the following files

- image_viewer.js
- [jquery.rotate.js](https://code.google.com/p/jquery-rotate/)
- [keymaster.js](https://github.com/madrobby/keymaster)
- keymaster_filter.js
- jquery-rails (if it isn't already loaded)
