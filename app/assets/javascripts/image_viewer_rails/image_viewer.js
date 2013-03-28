/** This is is a jQuery plugin and as such uses an Immediately Invoked Function Expression (IIFE) */
(function($) {
  /** Main imageViewer namespace
   * @param {object} method - Usually init options such as the initial array of images
   */
  $.fn.imageViewer = function(method) {
    var settings = {
      'navLinks':true,
      'zoomDirection': 'width',
      'zoomLevel': 100,
      'increment' : 50,
      'images' : null,
      'imageOverlay': null,
      'mainDiv' : this,
      'imageViewerImg': null,
      'imageIndex': null,
      'currentImageDiv': null,
      'keyBindings' : {},
      'suppressedKeys' : [],
      'calculateHeightWithHeader' : true,
      'calculateHeightWithFooter' : false
    };
    var self = $.fn.imageViewer;

    /** Method by which the next or previous image is retrieved and set to the current image (from the initial sequence of images)
     * @param {integer} increment - Usually 1 or -1 for next and previous page, but can be any integer.
     */
    $.fn.imageViewer.scrollPage = function(increment){
      if(settings["imageIndex"] === 0 && increment === -1) {
        settings["imageIndex"] = (settings["images"].length - 1);
      } else if(settings["imageIndex"] == (settings["images"].length - 1) && increment == 1){
        settings["imageIndex"] = 0;
      } else {
        settings["imageIndex"] += increment;
      }
      showPage(settings["imageIndex"]);
    };

    /** Essentially just an public accessor for getting information about the internal settings variable.
        @param {string} str - String of setting you'd like to view.
     */
    $.fn.imageViewer.settings = function(str) {
      if (settings[str] !== undefined) {
        return settings[str];
      }
    };

    /** Public method to remove keybindings.  Especially useful when displaying multiple image_viewers on a single page.
     */
    $.fn.imageViewer.teardownKeyBindings = function() { teardownKeyBindings(); };

    /** Public method to setup keybindings via the setupKeyBindings() method */
    $.fn.imageViewer.setupKeyBindings = function() { setupKeyBindings(); };

    /** Public method to display the legend modal dialog box as an overlay. */
    $.fn.imageViewer.displayLegend =  function(disableTransition) {
      var id = $('#dialog');
      var maskHeight = $(document).height();
      var maskWidth = $(window).width();

      $('#image-viewer-mask').css({'width':maskWidth,'height':maskHeight});
      $('#image-viewer-mask').fadeIn(600);
      $('#image-viewer-mask').fadeTo("slow",0.8);

      var winH = $(window).height();
      var winW = $(window).width();

      $(id).css('top',  winH/2-$(id).height()/2);
      $(id).css('left', winW/2-$(id).width()/2);

      $(id).fadeIn(2000);
    };

    /** Public method to hide the modal dialog box */
    $.fn.imageViewer.hideLegend =  function() {
      $('#image-viewer-mask, #dialog').hide();
    };

    /** Public method for manipulating the top and left dimensions of an image.  This is used to move the image up/left/right/down.  See tests for examples
     * @param {integer} left - Desired left position of current image.
     * @param {integer} top - Desired top position of current image.
     */
    $.fn.imageViewer.scroll =  function(left, top){
      settings["currentImageDiv"].scrollTop(settings["currentImageDiv"].scrollTop() + top);
      settings["currentImageDiv"].scrollLeft(settings["currentImageDiv"].scrollLeft() + left);
    };

    /** Public method for inreasing the width dimension of the current image.
     * @param {integer} increment - Increment you'd like to increase by.  If specified as an integer will increase current increment
     * @param {string} increment - if Increment is given as a string suffixed by the percent sign (%) will set that percentage absolutely.
     * @param {string} zoomDirection - Defaults to 'width' if specified as 'height' will change the height percentage instead of width.
     */
    $.fn.imageViewer.zoom = function(increment,zoomDirection){
      var newZoomLevel = settings['zoomLevel']

      if (typeof increment === 'string' && increment.match(/%$/))
        newZoomLevel  = parseInt(increment)
      else
        newZoomLevel  += increment

      //prevent zooming out past reasonable level
      if (newZoomLevel < settings['increment'])
        newZoomLevel = settings['increment']

      if (zoomDirection)
        settings['zoomDirection'] = zoomDirection

      zoomAbsolute(newZoomLevel);
    };

    /** Rotates all images currently in the images var
     * @param {integer} increment - Angle to be rotated by.  Given the integer 90 will rotate current image by 90 degrees to the right.
     */
    $.fn.imageViewer.rotate_all = function(increment){
      $.each(settings["images"], function(index, image) {
        rotate(increment, index);
      });
    };

    /** Rotates current image by increment to the right
     * @param {integer} increment - Angle to be rotated by.  Given the integer 90 will rotate current image by 90 degrees to the right.
     */
    $.fn.imageViewer.rotate = function(increment){
      rotate(increment);
    };

    /** Will load all images currently in the images variable and loads them in a new tab.  Once in a new tab will open the print dialog box for printing.  Images will each be printed separated by a page break.  Closes new tab when print dialog is dismissed (by printing or by cancelling)
     */
    $.fn.imageViewer.print = function() {
      var myWindow = window.open("", '_newtab');
      var image_tags = "";

      $.each(settings["images"], function(index, image) {
        image_tags += '<img style="clear:both;width:100%;page-break-after:always;max-width:none;" src="' + image + '" />';
      });

      var print_script = '<script type=\'text/javascript\'>' +
                         'function PrintWindow() {CheckWindowState(); }' +
                         'function CheckWindowState(){' +
                         'if(document.readyState=="complete")' +
                          '{ window.print();window.close();}' +
                         'else{setTimeout("CheckWindowState()", 2000)}}' +
                          'PrintWindow();' +
                         '</script>';

      myWindow.document.write(image_tags + print_script);
      myWindow.document.close();
    };


    /** initializes the image viewer's internal state.  Any settings passed to options are merged into the default settings object.  Calls a number of functions to initialize the viewer including setting up containers, listeners, et al
     * @param {array} image_path_array - Array of image paths.  These paths will be inserted as the src attribute on img tags later, so ensure that these are valid paths.
     * @param {object} options - options that will be merged into the default settings object.
     */
    function init(image_path_array, options){
      if ( options )
        $.extend( settings, options );

      this.data("settings", settings);

      setupContainers();
      setupHeight();
      setupKeyBindings();
      if (settings['navLinks'] === true) {createNavTable();}
      setupImages(image_path_array);
      setupLegend();
      setupMaskListener();
      handleWindowResize();
    }

    /** Builds and prepends the the legend dialog box to the #image-viewer-key-bindings. */
    function setupLegend() {
      var modal_container = "<div id='image-viewer-key-bindings'></div>";
      var mask_div = "<div id='image-viewer-mask'></div>";

      var key_binding_div = "<div class='window' id='dialog'>" +
      "<a href='#' class='image-viewer-close'>" + addGlyphIcon('icon-remove') + "</a>" +
          "<table>" +
          "  <thead>" +
          "    <tr>" +
          "      <th>Keystroke</th>" +
          "      <th>Description</th>" +
          "    </tr>" +
          "  </thead>" +
          "  <tbody>" +
          "    <tr><td>'\\'</td><td>Toggle Command Mode</td></tr>" +
          "    <tr><td>'i'</td><td>Zoom In</td></tr>" +
          "    <tr><td>'k', 'o'</td><td>Zoom Out</td></tr>" +
          "    <tr><td>'l', 'n'</td><td>Next</td></tr>" +
          "    <tr><td>'ctrl+l', 'h'</td><td>Fit Height</td></tr>" +
          "    <tr><td>'w'</td><td>Fit Width</td></tr>" +
          "    <tr><td>'j', 'p'</td><td>Previous</td></tr>" +
          "    <tr><td>'e', 'up arrow'</td><td>Scroll Up</td></tr>" +
          "    <tr><td>'d', 'down arrow'</td><td>Scroll Down</td></tr>" +
          "    <tr><td>'s', 'left arrow'</td><td>Scroll Left</td></tr>" +
          "    <tr><td>'f', 'right arrow'</td><td>Scroll Right</td></tr>" +
          "    <tr><td>'r'</td><td>Rotate Clockwise</td></tr>" +
          "    <tr><td>'t'</td><td>Rotate All Clockwise</td></tr>" +
          "    <tr><td>';', 'page down'</td><td>Page Down</td></tr>" +
          "    <tr><td>'a', 'page up'</td><td>Page Up</td></tr>" +
          "  </tbody>" +
          "</table>" +
      "</div>";

      $('body').prepend(modal_container);
      $('#image-viewer-key-bindings').append(key_binding_div);
      $('#image-viewer-key-bindings').append(mask_div);
    }
    function setupMaskListener(){
      $('.window .image-viewer-close').click(function (e) {
              //Cancel the link behavior
              e.preventDefault();
              settings["mainDiv"].imageViewer.hideLegend();
          });
      $('#image-viewer-mask').click(function () {
          $(this).hide();
          $('.window').hide();
      });
    }

    /** resets settings object and reinitializes the image_viewer.
     */
    function reload(){
      image_array                 = settings["images"];
      settings["zoomLevel"]       = 100;
      settings["images"]          = null;
      settings["mainDiv"]         = null;
      settings["imageViewerImg"]  = null;
      settings["imageIndex"]      = null;
      settings["currentImageDiv"] = null;

      init(image_array);
    }

    /** Builds the navLinks table.  Each call to createNavLink creates an a tag with a contained icon tag.  These link tags contain the onclick events
     */
    function createNavTable() {
      var id = '#navlinks-for-' + settings['mainDiv'].attr('id')

      table = '<table id="' + id + '" class="image-viewer-nav-links">' +
      '<tr>' +
      '<td>' + createNavLink('scrollPage(-1)', 'Previous Page', 'icon-backward') + '</td>' +
      '<td>' + createNavLink('scrollPage(1)', 'Next Page', 'icon-forward') + '</td>' +
      '<td>' + createNavLink('scroll(-1 * ' + settings["increment"] + ",0)", 'Left', 'icon-arrow-left') + '</td>' +
      '<td>' + createNavLink('scroll(' + settings["increment"] + ",0)", 'Right', 'icon-arrow-right') + '</td>' +
      '<td>' + createNavLink('scroll(0, -1 * ' + settings["increment"] + ")", 'Up', 'icon-arrow-up') + '</td>' +
      '<td>' + createNavLink('scroll(0,' + settings["increment"] + ")", 'Down', 'icon-arrow-down') + '</td>' +
      '<td id="' +settings["mainDiv"].attr('id') + '-nav-info' + '" class="image-viewer-nav-info"></td>' +
      '<td>' + createNavLink('zoom(' + settings["increment"] + ")", 'Zoom In', 'icon-plus') + '</td>' +
      '<td>' + createNavLink('zoom(-1 * ' + settings["increment"] + ")", 'Zoom Out', 'icon-minus') + '</td>' +
      '<td>' + createNavLink('rotate(90)', 'Rotate Page', 'icon-repeat') + '</td>' +
      '<td>' + createNavLink('rotate_all(90)', 'Rotate All Pages', 'icon-refresh') + '</td>' +
      '<td>' + createNavLink('print()', 'Print', 'icon-print') + '</td>' +
      '<td>' + createNavLink('displayLegend()', 'Display Legend', 'icon-info-sign') + '</td>' +
      '</tr>' +
      '</table>';

      settings["mainDiv"].prepend(table);
    }

    /**  builds an i tag with a class of glyph
     * @param {string} glyph - name of glyph class from css.  View image_viewer_rails.css.scss to see options.
     */
    function addGlyphIcon(glyph) {
      return '<i class="' + glyph + '"></i>'
    }

    /** builds link tag with title of name, and the onclick function of call
     * @param {string} call - the imageViewer call that will be assigned to the onclick even of this link.
     * @param {string} name - inserted directly into title text of link.
     * @param {string} glyph - name of css class glyphicon (see addGlyphIcon)
     */
    function createNavLink( call, name, glyph) {
      var div_id = '#' + settings["mainDiv"].attr("id");

      return '<a href="#" title="' + name + '" class="image-viewer-nav-link" onclick="' +
      '$(\'' + div_id + '\')' +
      '.imageViewer.' +  call + ';return false;">' +
      addGlyphIcon(glyph) +
      '</a>';
    }

    /** Clears mainDiv (which is _this_ upon initialization).  Assigns width to mainDiv from settings var */
    function setupContainers(){
      settings["mainDiv"].empty();
      settings["mainDiv"].addClass('image-viewer-container');
      settings["mainDiv"].css("width", settings["width"]);
    }

    /** Creates the img tags on the page and assigns them unique ids
     * @param {array} images - This function is called from init() and accepts the array of images passed there.
     */
    function  setupImages(images){
      settings["images"] = images;
      var style = "";

      $.each(images, function(index, image)  {
        if(index !== 0)
          style += "display: none;";

        settings["mainDiv"].append('<div id="' + settings["mainDiv"].attr("id") + '-image-viewer-' + index + '" ' +
        'class="image-viewer" ' +
        'style="' + style + '">' +
        '<img id="' + settings["mainDiv"].attr("id") + '-full-image-' + index + '" ' +
        'src="' + image + '" ' +
        'alt="Full Image" ' +
        'style="' + settings["zoomDirection"] + ':' + settings["zoomLevel"] + '%;max-width:none;" ' +
        'angle="0"/>' +
        '</div>');

      });

      settings["currentImageDiv"] = $('#' + settings["mainDiv"].attr("id") + '-image-viewer-0');
      settings["imageViewerImg"] = $('#' + settings["mainDiv"].attr("id") + '-full-image-0');
      settings["imageIndex"] = 0;
      updateOverlay();
    }

    /** Redirects window to root path */
    function delayedRedirect(){
      window.location = "/";
    }

    /** Removes keybindings from keymaster. */
    function teardownKeyBindings(){
      key.deleteScope('imageviewer');
    }

    /** Convenience method for adding keybindings to imageViewer through keymaster.js
     * param {string} keyString - String of the key to be bound to func.  Listing of keys can be found: https://github.com/madrobby/keymaster
     * param {string} keyScope - Scope for current keybinds.  This scope can be deleted (and is with teardownKeyBindings().
     * param {func} func - function to be bound ot the keyString.
     */
    function addKeyToKeyMaster(keyString, keyScope, func){
      var keys = typeof(keyString) === 'string' ? [keyString] : keyString
      $.each(keys, function(index, k) {
        if ($.inArray(k, settings['suppressedKeys']) === -1) {
          key(k, keyScope, func);
        }
      });
    }

    /** Assigns the various key combinations to their actual function calls.
     */
    function  setupKeyBindings(){
      teardownKeyBindings();

      key.setScope('imageviewer');

      keymasterCommandModeCallback = updateOverlay;

      // prevent alt+f4 from closing browser
      addKeyToKeyMaster('alt+f4', 'imageviewer', function(){ alert('NO WAY JOSE! (Don\'t hit Alt+F4!!!)'); return false; });
      // zoom out
      addKeyToKeyMaster(['k','shift+k','o','shift+o'], 'imageviewer', function(){ self.zoom(-1 * settings["increment"]); return false;});
      // zoom in
      addKeyToKeyMaster(['i','shift+i'], 'imageviewer', function(){ self.zoom(settings["increment"]); return false;});
      // scroll up
      addKeyToKeyMaster(['e','shift+e','up'], 'imageviewer', function(){ self.scroll(0,-1 * settings["increment"]); return false;});
      // scroll down
      addKeyToKeyMaster(['d','shift+d','down'], 'imageviewer', function(){ self.scroll(0,settings["increment"]); return false;});
      // page up
      addKeyToKeyMaster(['a','shift+a','pageup'], 'imageviewer', function(){ self.scroll(0,-1 * (settings["increment"] * 5)); return false;});
      // page down
      addKeyToKeyMaster([';','pagedown'], 'imageviewer', function(){ self.scroll(0,(settings["increment"] * 5)); return false;});
      // scroll right
      addKeyToKeyMaster(['f','shift+f','right'], 'imageviewer', function(){ self.scroll(settings["increment"],0); return false;});
      // scroll left
      addKeyToKeyMaster(['s','shift+s','left'], 'imageviewer', function(){ self.scroll((-1 * settings["increment"]),0); return false; });
      // previous page
      addKeyToKeyMaster(['j','shift+j','p','shift+p'], 'imageviewer', function(){ self.scrollPage(-1); return false; });
      // next page
      addKeyToKeyMaster(['l','shift+l','n','shift+n'], 'imageviewer', function(){ self.scrollPage(1); return false; });
      // rotate
      addKeyToKeyMaster(['r','shift+r'], 'imageviewer', function(){ self.rotate(90); return false; });
      // rotate all
      addKeyToKeyMaster(['t','shift+t'], 'imageviewer', function(){ self.rotate_all(90); return false; });
      // zoom to fit width
      addKeyToKeyMaster('w', 'imageviewer', function(){ self.zoom('100%','width'); return false; });
      // zoom to fit height
      addKeyToKeyMaster(['h','ctrl+l','ctrl+shift+l'], 'imageviewer', function(){ self.zoom('100%','height'); return false; });
    }

    /** Calculates the height of the view port and sets the main div to fit. */
    function setupHeight(){
      var window_height = $(window).height();
      var footer        = $('#footer');
      var navlinks      = $('#navlinks-for-' + settings['mainDiv'].attr("id"));

      var footer_height, menu_offset;

      if (settings['calculateHeightWithHeader']) {
        menu_offset = settings["mainDiv"].offset().top;
      } else {
        menu_offset = 0;
      }

      if(footer && settings['calculateHeightWithFooter']){
        footer_height = footer.height() + 7;
      } else {
        footer_height = 0;
      }

      var new_height = window_height - menu_offset - footer_height - 20;

      settings["mainDiv"].css('height', new_height + 'px');
      settings["mainDiv"].css('top', '0px');

      $('.image-viewer').css('height', (settings["mainDiv"].height() - navlinks.height()) + 'px');
    }

    /** call setupHeight() on resize */
    function handleWindowResize(){
      $(window).bind('resize', setupHeight);
    }

    /** Zooms image's 'height' or 'width' to a given percentage.  Height or Width is decided by setting the zoomDirection setting var.
     * param {integer} zoomLevel - Percentage you'd like the image to be sized to.
     */
    function zoomAbsolute(zoomLevel){
      previous_zoomLevel = settings["zoomLevel"];
      settings["zoomLevel"] = zoomLevel;
      object_to_zoom = $('#' + settings["mainDiv"].attr("id") + '-full-image-' + settings["imageIndex"]);

      object_to_zoom.css('width', '')
      object_to_zoom.css('height','')

      object_to_zoom.css(settings['zoomDirection'], settings["zoomLevel"] + '%');
      self.scroll(0,0);
    }

    function showPage(page){
      settings["imageIndex"] = page;

      settings["currentImageDiv"].hide();
      settings["currentImageDiv"] = $('#' + settings["mainDiv"].attr("id") + '-image-viewer-' + page);
      settings["imageViewerImg"] = $('#' + settings["mainDiv"].attr("id") + '-full-image-' + page);
      settings["currentImageDiv"].show();
      updateOverlay();
    }

    /** Updates the nav-info to display both command mode toggle and "page of pages"
     * @param {bool} commandMode - Sets comand mode to true or false.
     */
    function updateOverlay(commandMode){
      overlay = $('#' + settings["mainDiv"].attr("id") + '-nav-info');

      if (settings['images'].length === 0)
        return;

      var s = (settings["imageIndex"] + 1) + ' of ' + settings["images"].length;

      if(commandMode === undefined)
        commandMode = overlay.html().search(/CM/) !== -1;

      if(commandMode === true)
        s += ' CM';

      overlay.html(s);
    }

    /** Calls jQuery.rotate.js's rotate function.
     * @param {integer} increment - number of degrees to rotate image.
     * @param {integer} imageIndex - Set which image to rotate.  Defaults to current image based of settings["imageIndex"]
     */
    function rotate(increment, imageIndex){
      if (imageIndex === undefined) imageIndex = settings["imageIndex"];
      var image = $('#' + settings["mainDiv"].attr("id") + '-full-image-' + imageIndex);
      var current_angle = parseInt(image.attr('angle'),10);

      image.rotate(current_angle + increment);
      current_angle = parseInt(image.getRotateAngle(),10) % 360;

      if (current_angle === 90 || current_angle === 270) {
        var offset = image.height()/2 - image.width()/2;
        image.css('margin-top', -1 * offset);
        image.css('margin-left', offset);
      } else {
        image.css('margin-top', 0);
        image.css('margin-left', 0);
      }

      image.attr('angle',current_angle);
    }

    /** if argument passed to IIFE aren't a method defined on imageViewer then pass the arguments to initialize. */
    if ( typeof method === 'object' || ! method )
      return init.apply(this, arguments);
    else
      $.error( 'Method ' +  method + ' does not exist on jQuery.imageViewer' );

  };
  })(jQuery);
