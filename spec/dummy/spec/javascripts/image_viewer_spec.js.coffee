describe "ImageViewer", ->
  viewer = $('#ImageViewer').imageViewer

  beforeEach ->
    loadFixtures 'image_viewer_index'
    $('#ImageViewer').imageViewer(["/assets/test_image_1.jpeg"])

  it "implements zoom", ->
    expect(typeof(viewer.rotate) == "function").toBe(true)

  it "implements rotate", -> 
    expect(typeof(viewer.rotate) == "function").toBe(true)

  it "implements rotate_all", -> 
    expect(typeof(viewer.rotate_all) == "function").toBe(true)

  it "implements scrollPage", ->
    expect(typeof(viewer.scrollPage) == "function").toBe(true)

  it "implements scroll", ->
    expect(typeof(viewer.scroll) == "function").toBe(true)

  it "implements print", ->
    expect(typeof(viewer.print) == "function").toBe(true)

  it "implements displayLegend()", ->
    expect(typeof(viewer.displayLegend) == "function").toBe(true)

  it "implements settings()", ->
    expect(typeof(viewer.settings) == "function").toBe(true)

  it "implements teardownKeyBindings()", -> 
    expect(typeof(viewer.teardownKeyBindings) == "function").toBe(true)

  it "implements setupKeyBindings()", ->
    expect(typeof(viewer.setupKeyBindings) == "function").toBe(true)
