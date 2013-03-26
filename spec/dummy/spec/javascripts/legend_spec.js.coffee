describe "Legend", ->
  viewer = $('#ImageViewer').imageViewer

  beforeEach ->
    loadFixtures 'image_viewer_index'
    $('#ImageViewer').imageViewer(["/assets/test_image_1.jpeg"])

  afterEach ->
    viewer.hideLegend()

  it "toggles its own visibility", ->
    start = Date.now();
    expect($('#dialog').is(':visible')).toBe(false)
    viewer.displayLegend()
    expect($('#dialog').is(':visible')).toBe(true)

  it "not be visible after hideLegend() is called", ->
    expect($('#dialog').is(':visible')).toBe(false)
    viewer.displayLegend(true)
    expect($('#dialog').is(':visible')).toBe(true)
    viewer.hideLegend()
    expect($('#dialog').is(':visible')).toBe(false)
