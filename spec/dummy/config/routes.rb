Rails.application.routes.draw do
  mount ImageViewerRails::Engine => "/image_viewer_rails"

  if Rails.env.test? || Rails.env.development?
    mount Jasminerice::Engine => "/jasmine"
    get "/jasmine/:suite" => "jasminerice/spec#index"
  end
end
