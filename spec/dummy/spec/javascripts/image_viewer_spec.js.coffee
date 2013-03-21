# Begin Tests
describe "Zoom in/out", -> 
  viewer = $('#ImageViewer')

  beforeEach -> 
    loadFixtures 'image_viewer_index'
    $('#ImageViewer').imageViewer(["http://localhost:3000/assets/test_image_1.jpeg"]);

  it "should contain a div with an id of ImageViewer", ->  
    expect($('#ImageViewer')).toBe('div')

  it "zooms in to the image when asked", ->
    zoom_increment = 50
    initial_width = $('img').first().width().toFixed(2)
    viewer.imageViewer.zoom(zoom_increment)
    after_zoom = $('img').first().width().toFixed(2)
    percentage_increase = Math.round((after_zoom - initial_width) / initial_width * 100)
    expect(percentage_increase + 1).toEqual(zoom_increment)

