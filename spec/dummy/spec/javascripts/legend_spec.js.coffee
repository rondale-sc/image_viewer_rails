describe "Legend", ->
  viewer = $('#ImageViewer').imageViewer

  beforeEach -> 
    loadFixtures 'image_viewer_index'
    $('#ImageViewer').imageViewer(["/assets/test_image_1.jpeg"])

  it "toggles its own visibility", ->
    console.log $('#dialog').is(':visible')
    expect($('#dialog').is(':visible')).toBe(false) 
    viewer.displayLegend()
    expect($('#dialog').is(':visible')).toBe(true)

