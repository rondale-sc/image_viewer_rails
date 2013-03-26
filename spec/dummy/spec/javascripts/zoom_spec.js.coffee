describe "Zoom in/out", -> 
  viewer = $('#ImageViewer').imageViewer

  percentageIncrease = (initial_value, new_value, scale_factor)->
    scale_factor ?= 100
    Math.round((new_value - initial_value) / initial_value * 100 * (scale_factor / 100))


  beforeEach -> 
    loadFixtures 'image_viewer_index'
    $('#ImageViewer').imageViewer(["/assets/test_image_1.jpeg"]);

  it "zooms in to the current image given a positive integer", ->
    zoom_increment              = 50
    initial_zoom_level          = viewer.settings("zoomLevel")
    initial_width               = $('img').first().width().toFixed(2)
    viewer.zoom(zoom_increment)
    after_zoom                  = $('img').first().width().toFixed(2)
    percentage_increase         = percentageIncrease(initial_width, after_zoom, initial_zoom_level)
    expect(percentage_increase).toEqual(zoom_increment)
    expect(viewer.settings("zoomLevel")).toEqual(initial_zoom_level + zoom_increment)

  it "zooms out of the current image given a negative integer", ->
    zoom_increment              = -50
    initial_zoom_level          = viewer.settings("zoomLevel")
    initial_width               = $('img').first().width().toFixed(2)
    viewer.zoom(zoom_increment)
    after_zoom                  = $('img').first().width().toFixed(2)
    percentage_increase         = percentageIncrease(initial_width, after_zoom, initial_zoom_level)
    expect(percentage_increase).toEqual(zoom_increment)
    expect(viewer.settings("zoomLevel")).toEqual(initial_zoom_level + zoom_increment)

  it "prevents zooming past reasonable levels", -> 
    zoom_increment     = 10
    initial_zoom_level = viewer.settings("zoomLevel")
    viewer.zoom(-1 * initial_zoom_level) # set zoomLevel to 0 
    viewer.zoom(-1 * zoom_increment)

    # Don't continue to reduce size after you reach 0
    expect(viewer.settings("zoomLevel")).toEqual(0) 

