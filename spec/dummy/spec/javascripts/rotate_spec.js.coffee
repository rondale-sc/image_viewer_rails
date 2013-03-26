describe "Rotate Page / Rotate All Pages", -> 
  randomAngle = ->
    Math.floor(Math.random() * 360) + 1;

  verifyAngle = (angle)->
    $('img').each (index)->
      expect($(this).getRotateAngle()[0]).toBe(angle)

  viewer = $('#ImageViewer').imageViewer

  beforeEach -> 
    loadFixtures 'image_viewer_index'
    $('#ImageViewer').imageViewer(["/assets/test_image_1.jpeg", "/assets/test_image_2.jpeg"]);

  describe "Rotate Page", ->
    it "rotates the current image by the degrees given", ->
      image = $('img').first()
      angle = randomAngle()

      expect(image.getRotateAngle()[0]).toBeUndefined()
      viewer.rotate(angle)
      expect(image.getRotateAngle()[0]).toBe(angle)

  describe 'Rotate All', ->
    it "rotates all pages by the degrees given", ->
      angle  = randomAngle()

      verifyAngle(undefined)
      viewer.rotate_all(angle)
      verifyAngle(angle)


    it "maintains the current page after rotating", ->
      currentPage = ->
        viewer.settings('imageIndex')

      expect(currentPage()).toBe(0)
      viewer.scrollPage(1)
      expect(currentPage()).toBe(1)
      viewer.rotate_all(90)
      expect(currentPage()).toBe(1)

