describe "Next / Previous Page", -> 
  viewer = $('#ImageViewer').imageViewer

  beforeEach ->
    loadFixtures 'image_viewer_index'
    $('#ImageViewer').imageViewer(["/assets/test_image_1.jpeg", "/assets/test_image_2.jpeg"])

  it "cycles to the next page when prompted", ->
    current_page = viewer.settings("imageIndex")
    viewer.scrollPage(1)
    expect(viewer.settings("imageIndex")).toEqual(current_page + 1)

  it "cycles to the previous page when prompted", ->
    current_page = viewer.settings("imageIndex")
    viewer.scrollPage(-1)
    expect(viewer.settings("imageIndex")).toEqual(current_page + 1)

