(function($) {
  $.fn.imageViewer = function(method) {
    var settings = {
      'height': '550',
      'nav_links':true,
      'zoomDirection': 'width',
      'zoomLevel': 100,
      'increment' : 50,
      'images' : null,
      'mainDivId' : this,
      'mainDiv' : null,
      'imageOverlay': null,
      'imageViewerImg': null,
      'imageIndex': null,
      'currentImageDiv': null,
      'keyBindings' : {},
      'suppressed_keys' : [],
      'calculate_height_with_header' : true,
      'calculate_height_with_footer' : false
    };
    var self = $.fn.imageViewer;

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

    $.fn.imageViewer.settings = function(str) {
      if (settings[str] !== undefined) {
        return settings[str];
      }
    };

    $.fn.imageViewer.teardownKeyBindings = function() { teardownKeyBindings(); };

    $.fn.imageViewer.setupKeyBindings = function() { setupKeyBindings(); };

    $.fn.imageViewer.displayLegend =  function(disableTransition) {
      var id = $('#dialog');
      var maskHeight = $(document).height();
      var maskWidth = $(window).width();

      $('#mask').css({'width':maskWidth,'height':maskHeight});
      $('#mask').fadeIn(600);
      $('#mask').fadeTo("slow",0.8);

      var winH = $(window).height();
      var winW = $(window).width();

      $(id).css('top',  winH/2-$(id).height()/2);
      $(id).css('left', winW/2-$(id).width()/2);

      $(id).fadeIn(2000);
    };

    $.fn.imageViewer.hideLegend =  function() {
      $('#mask, #dialog').hide();
    };

    $.fn.imageViewer.scroll =  function(left, top){
      settings["currentImageDiv"].scrollTop(settings["currentImageDiv"].scrollTop() + top);
      settings["currentImageDiv"].scrollLeft(settings["currentImageDiv"].scrollLeft() + left);
    };

    $.fn.imageViewer.zoom = function(increment){
      if(increment < 0 && settings["zoomLevel"] <= settings["increment"]) increment = 0;
      zoomAbsolute(settings["zoomLevel"] + increment);
    };

    $.fn.imageViewer.rotate_all = function(increment){
      $.each(settings["images"], function(index, image) {
        rotate(increment, index);
      });
    };

    $.fn.imageViewer.rotate = function(increment){
      rotate(increment);
    };

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


    function init(image_path_array, options){
      main_div_id = (settings["mainDivId"]).attr("id");
      if ( options )
        $.extend( settings, options );

      this.data("settings", settings);

      if (main_div_id !== undefined)
        settings["mainDivId"] = main_div_id;

      setupContainers();
      setupHeight();
      setupKeyBindings();
      if (settings['nav_links'] === true) {createNavTable();}
      setupImages(image_path_array);
      setupLegend();
      setupMaskListener();
      handleWindowResize();
    }

    function setupLegend() {
      var modal_container = "<div id='key-bindings'></div>";
      var mask_div = "<div id='mask' style='display:none;'></div>";

      var key_binding_div = "<div class='window' id='dialog'>" +
      "<a href='#' style='float:right;' class='close'>" + addGlyphIcon('icon-remove') + "</a>" +
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
      $('#key-bindings').append(key_binding_div);
      $('#key-bindings').append(mask_div);
    }
    function setupMaskListener(){
      $('.window .close').click(function (e) {
              //Cancel the link behavior
              e.preventDefault();
              $('#' + settings["mainDivId"]).imageViewer.hideLegend();
          });
      $('#mask').click(function () {
          $(this).hide();
          $('.window').hide();
      });
    }
    function reload(){
      image_array                 = settings["images"];
      settings["zoomLevel"]       = 100;
      settings["images"]          = null;
      settings["mainDiv"]         = null;
      settings["imageOverlay"]    = null;
      settings["imageViewerImg"]  = null;
      settings["imageIndex"]      = null;
      settings["currentImageDiv"] = null;

      init(image_array);
    }

    function createNavTable() {
      var id = '#navlinks-for-' + settings['mainDivId']

      table = '<table id="' + id + '" class="table center nav_links">' +
      '<tr>' +
      '<td>' + createNavLink('scrollPage(-1)', 'Previous Page', 'icon-backward') + '</td>' +
      '<td>' + createNavLink('scrollPage(1)', 'Next Page', 'icon-forward') + '</td>' +
      '<td>' + createNavLink('scroll(-1 * ' + settings["increment"] + ",0)", 'Left', 'icon-arrow-left') + '</td>' +
      '<td>' + createNavLink('scroll(' + settings["increment"] + ",0)", 'Right', 'icon-arrow-right') + '</td>' +
      '<td>' + createNavLink('scroll(0, -1 * ' + settings["increment"] + ")", 'Up', 'icon-arrow-up') + '</td>' +
      '<td>' + createNavLink('scroll(0,' + settings["increment"] + ")", 'Down', 'icon-arrow-down') + '</td>' +
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

    function addGlyphIcon(glyph) {
      return '<i class="' + glyph + '"></i>'
    }

    function createNavLink( call, name, glyph) {
      var div_id = '#' + settings["mainDivId"];

      return '<a href="#" title="' + name + '" style="display:block;text-align:center" onclick="' +
      '$(\'' + div_id + '\')' +
      '.imageViewer.' +  call + ';return false;">' +
      addGlyphIcon(glyph) +
      '</a>';
    }

    function setupContainers(){
      settings["mainDiv"] = $('#' + settings["mainDivId"]);
      settings["mainDiv"].empty();
      settings["mainDiv"].addClass('image-viewer-container');
      settings["mainDiv"].css("width", settings["width"]);
      settings["mainDiv"].append('<div id="' + settings["mainDivId"] + '-image-overlay" class="image-overlay"></div>');
      settings["imageOverlay"] = $('#' + settings["mainDivId"] + '-image-overlay');
    }

    function  setupImages(images){
      settings["images"] = images;
      var style = "";

      $.each(images, function(index, image){
        if(index !== 0)
          style += "display: none;";

        settings["mainDiv"].append('<div id="' + settings["mainDivId"] + '-image-viewer-' + index + '" ' +
        'class="image-viewer" ' +
        'style="' + style + '">' +
        '<img id="' + settings["mainDivId"] + '-full-image-' + index + '" ' +
        'src="' + image + '" ' +
        'alt="Full Image" ' +
        'style="' + settings["zoomDirection"] + ':' + settings["zoomLevel"] + '%;max-width:none;" ' +
        'angle="0"/>' +
        '</div>');

      });

      settings["currentImageDiv"] = $('#' + settings["mainDivId"] + '-image-viewer-0');
      settings["imageViewerImg"] = $('#' + settings["mainDivId"] + '-full-image-0');
      settings["imageIndex"] = 0;
      updateOverlay();
    }

    function delayedRedirect(){
      window.location = "/";
    }

    function teardownKeyBindings(){
      key.deleteScope('imageviewer');
    }

    function addKeyToKeyMaster(keyString, keyScope, func){
      var keys = typeof(keyString) === 'string' ? [keyString] : keyString
      $.each(keys, function(index, k) {
        if ($.inArray(k, settings['suppressed_keys']) === -1) {
          key(k, keyScope, func);
        }
      });
    }

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
    }

    function setupHeight(){
      var window_height = $(window).height();
      var footer        = $('#footer');
      var navlinks      = $('#navlinks-for-' + settings['mainDivId']);

      var footer_height, menu_offset;

      if (settings['calculate_height_with_header']) {
        menu_offset = settings["mainDiv"].offset().top;
      } else {
        menu_offset = 0;
      }

      if(footer && settings['calculate_height_with_footer']){
        footer_height = footer.height() + 7;
      } else {
        footer_height = 0;
      }

      var new_height = window_height - menu_offset - footer_height - 20;

      settings["mainDiv"].css('height', new_height + 'px');
      settings["mainDiv"].css('top', '0px');

      $('.image-viewer').css('height', (settings["mainDiv"].height() - navlinks.height()) + 'px');
    }

    function handleWindowResize(){
      $(window).bind('resize', setupHeight);
    }

    function zoomAbsolute(zoomLevel){
      previous_zoomLevel = settings["zoomLevel"];
      settings["zoomLevel"] = zoomLevel;
      object_to_zoom = $('#' + settings["mainDivId"] + '-full-image-' + settings["imageIndex"]);

      object_to_zoom.css('width', settings["zoomLevel"] + '%');
      self.scroll(0,0);
    }

    function showPage(page){
      settings["imageIndex"] = page;

      settings["currentImageDiv"].hide();
      settings["currentImageDiv"] = $('#' + settings["mainDivId"] + '-image-viewer-' + page);
      settings["imageViewerImg"] = $('#' + settings["mainDivId"] + '-full-image-' + page);
      settings["currentImageDiv"].show();
      updateOverlay();
    }

    function updateOverlay(commandMode){
      var s = (settings["imageIndex"] + 1) + ' / ' + settings["images"].length;

      if(commandMode === undefined)
        commandMode = settings["imageOverlay"].html().search(/CM/) !== -1;

      if(commandMode === true)
        s += ' CM';

      settings["imageOverlay"].html(s);
    }

    function rotate(increment, imageIndex){
      if (imageIndex === undefined) imageIndex = settings["imageIndex"];
      var image = $('#' + settings["mainDivId"] + '-full-image-' + imageIndex);
      var current_angle = parseInt(image.attr('angle'),10);

      zoomAbsolute(100);

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

    if ( typeof method === 'object' || ! method )
      return init.apply(this, arguments);
    else
      $.error( 'Method ' +  method + ' does not exist on jQuery.imageViewer' );

  };
  })(jQuery);
