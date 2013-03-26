describe "Up Down Left Right", ->
  viewer = $('#ImageViewer').imageViewer

  beforeEach -> 
    loadFixtures 'image_viewer_index'
    $('#ImageViewer').imageViewer(["http://localhost:3000/assets/test_image_1.jpeg"])

  it "moves the current image down", ->
    increment = 50
    initial_top = viewer.settings("currentImageDiv").scrollTop()
    viewer.scroll(0, increment) # Left:0 / Top:increment 
    after_top = viewer.settings("currentImageDiv").scrollTop()
    expect(after_top).toEqual(initial_top + increment)
