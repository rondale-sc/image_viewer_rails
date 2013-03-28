describe "Zoom in/out", -> 
  images = ['/assets/test_image_1.jpeg']
  viewer = $('#ImageViewer').imageViewer

  percentageIncrease = (initial_value, new_value, scale_factor)->
    scale_factor ?= 100
    Math.round((new_value - initial_value) / initial_value * 100 * (scale_factor / 100))


  beforeEach -> 
    loadFixtures 'image_viewer_index'
    $('#ImageViewer').imageViewer(images)

  it 'defaults to zooming by width', ->
    expect(viewer.settings('zoomDirection')).toBe('width')

  it 'uses zoomDirection and zoomLevel to set image element style attributes', ->
    settings = {'zoomDirection': 'blah', 'zoomLevel': 73}
    $('#ImageViewer').imageViewer(images, settings)
    style = $('img').attr('style')
    expect(viewer.settings('zoomDirection')).toBe(settings['zoomDirection'])
    expect(viewer.settings('zoomLevel')).toBe(settings['zoomLevel'])
    expect(style).toContain(settings['zoomDirection'] + ':' + settings['zoomLevel'])

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
    initial_zoom_level = viewer.settings("zoomLevel")
    viewer.zoom(-1 * initial_zoom_level) # set zoomLevel to 0 
    expect(viewer.settings("zoomLevel")).toEqual(viewer.settings('increment'))

  it "accepts zoom direction as second parameter", ->
    viewer.zoom(0,'height')
    console.log $('img').attr('style')
    expect($('img').attr('style')).toContain('height: 100%')

  it "allows zooming to specific percentage", ->
    viewer.zoom('150%')
    expect($('img').attr('style')).toContain('width: 150%')

  it "allows zooming to specific percentage by height", ->
    viewer.zoom('172%','height')
    expect($('img').attr('style')).toContain('height: 172%')

