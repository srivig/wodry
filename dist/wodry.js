(function() {
  var $,
    __hasProp = {}.hasOwnProperty;

  $ = jQuery;

  $.fn.extend({
    wodry_wikirate: function(config) {
      var animations, settings;
      if (config == null) {
        config = {};
      }
      settings = $.extend({}, config);
      if (settings.separator == null) {
        settings.separator = '|';
      }
      if (settings.delay == null) {
        settings.delay = 2000;
      }
      if (settings.animationDuration == null) {
        settings.animationDuration = 500;
      }
      if (settings.animation == null) {
        settings.animation = 'rotateY';
      }
      if (settings.fontUsed == null) {
        settings.fontUsed = '';
      }
      if (settings.spanWidthAdjust == null) {
        settings.spanWidthAdjust = 1.8;
      }
      if (settings.callback == null) {
        settings.callback = function() {};
      }
      animations = {
        rotateX: {
          front_transform: "",
          back_transform: "rotateX(180deg)",
          action: {
            transform: "translateY(2rem) rotateX(180deg)",
            transition: " " + settings.animationDuration + "ms"
          }
        }
      };
      return this.map(function() {
        var animate, array, back_style, flip, flip_container, front_style, getTextWidth, longest_word, prefixer, spanWidth, style_index;
        flip_container = $(this);
        array = [];
        $.each(flip_container.text().split(settings.separator), function(key, value) {
          return array.push(value);
        });
        style_index = 0;
        front_style = "front-face";
        back_style = "back-face";
        longest_word = array.sort(function(a, b) {
          return b.length - a.length;
        })[0];
        getTextWidth = function(text, font) {
          var canvas, context, metrics;
          canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement('canvas'));
          context = canvas.getContext('2d');
          context.font = font;
          metrics = context.measureText(text);
          return metrics.width;
        };
        spanWidth = getTextWidth(longest_word, settings.fontUsed) * settings.spanWidthAdjust;
        flip_container.html("<span style='min-width: " + spanWidth + "px'>" + array[0] + "</span>");
        prefixer = function(properties, values) {
          var i, moz, o, propHash, property, result, value, webkit, _i, _len, _ref;
          result = {};
          propHash = {};
          for (_i = 0, _len = properties.length; _i < _len; _i++) {
            property = properties[_i];
            i = properties.indexOf(property);
            propHash[property] = values[i];
          }
          if (properties.length === values.length) {
            for (property in propHash) {
              if (!__hasProp.call(propHash, property)) continue;
              value = propHash[property];
              _ref = ["-webkit-" + property, "-moz-" + property, "-o-" + property], webkit = _ref[0], moz = _ref[1], o = _ref[2];
              result[webkit] = value;
              result[moz] = value;
              result[o] = value;
              result[property] = value;
            }
            return result;
          }
        };
        animate = function(animation, container, currentText, nextText) {
          container.html("");
          $("<span class='" + front_style + "'>" + currentText + "</span>").appendTo(container);
          $("." + (container.attr("class")) + " .front-face").css(prefixer(["transform"], [animation.front_transform]));
          $("<span class='" + back_style + "'>" + nextText + "</span>").appendTo(container);
          $("." + (container.attr("class")) + " .back-face").css(prefixer(["transform"], [animation.back_transform]));
          return container.wrapInner("<span class='wodry-flipping' style='min-width: " + spanWidth + "px; top: -1.5rem;'/>").find(".wodry-flipping").hide().show().css(prefixer(["transform", "transition"], [animation.action.transform, animation.action.transition]));
        };
        flip = function() {
          var back_text_index, front_text;
          if (flip_container.find(".back-face").length > 0) {
            flip_container.html(flip_container.find(".back-face").html());
          }
          front_text = flip_container.text();
          back_text_index = $.inArray(front_text, array);
          if ((back_text_index + 1) === array.length) {
            back_text_index = -1;
          }
          return animate(animations[settings.animation], flip_container, front_text, array[back_text_index + 1]);
        };
        return setInterval(function() {
          flip();
          return settings.callback();
        }, settings.delay + settings.animationDuration);
      });
    }
  });

}).call(this);
