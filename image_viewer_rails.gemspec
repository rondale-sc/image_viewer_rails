$:.push File.expand_path("../lib", __FILE__)

# Maintain your gem's version:
require "image_viewer_rails/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name        = "image_viewer_rails"
  s.version     = ImageViewerRails::VERSION
  s.authors     = ["Jonathan Jackson", "Robert Jackson"]
  s.email       = ["jonathan.jackson1@me.com"]
  s.homepage    = "http://jonathan-jackson.net"
  s.summary     = "A rails engine to serve imageviewer js files easily and ubiquitiously"
  s.description = "A rails engine to serve imageviewer js files easily and ubiquitiously"

  s.files = Dir["{app,config,db,lib}/**/*"] + ["MIT-LICENSE", "Rakefile", "README.md"]
  s.test_files = Dir["spec/**/*"]

  s.add_dependency "rails", "~> 3.2.13"
  s.add_dependency "sass-rails"
  s.add_dependency "jquery-rails"

  s.add_development_dependency "jasminerice"
  s.add_development_dependency "rspec-rails"
  s.add_development_dependency "factory_girl_rails"
  s.add_development_dependency "sqlite3"
  s.add_development_dependency "guard-jasmine"
  s.add_development_dependency "rb-fsevent"
  s.add_development_dependency "terminal-notifier-guard"
end
