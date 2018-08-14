$ = jQuery

$.fn.extend
    wodry_wikirate : (config = {}) ->
        settings = $.extend({}, config)
        settings.separator ?= '|'
        settings.delay ?= 2000
        settings.animationDuration ?= 500
        settings.animation ?= 'rotateY'
        settings.fontUsed ?= ''
        settings.spanWidthAdjust ?= 1.8
        settings.callback ?= ->

        animations =
            rotateX:
                front_transform: ""
                back_transform: "rotateX(180deg)"
                action:
                    transform: "translateY(1rem) rotateX(180deg)"
                    transition:" #{settings.animationDuration}ms"

        @map ->
            flip_container = $(this)
            array = []
            $.each(flip_container.text().split(settings.separator), (key, value) -> array.push value)
            style_index = 0
            front_style = "front-face"
            back_style = "back-face"
            longest_word = array.sort((a, b) ->
              b.length - (a.length)
            )[0]

            getTextWidth = (text, font) ->
              canvas = getTextWidth.canvas or (getTextWidth.canvas = document.createElement('canvas'))
              context = canvas.getContext('2d')
              context.font = font
              metrics = context.measureText(text)
              metrics.width

            spanWidth = getTextWidth(longest_word, settings.fontUsed) * settings.spanWidthAdjust
            flip_container.html "<span style='min-width: #{spanWidth}px'>#{array[0]}</span>"

            prefixer = (properties, values) ->
                result = {}
                propHash = {}

                for property in properties
                    i = properties.indexOf property
                    propHash[property] = values[i]

                if properties.length is values.length
                    for own property, value of propHash
                        [webkit, moz, o] = ["-webkit-#{property}","-moz-#{property}","-o-#{property}"]
                        result[webkit] = value
                        result[moz] = value
                        result[o] = value
                        result[property] = value
                    result

            animate = (animation,container,currentText, nextText) ->
                container.html ""
                $ "<span class='#{front_style}'>#{currentText}</span>"
                    .appendTo container
                $ ".#{container.attr("class")} .front-face"
                    .css prefixer(["transform"],[animation.front_transform])
                $ "<span class='#{back_style}'>#{nextText}</span>"
                    .appendTo container
                $ ".#{container.attr("class")} .back-face"
                    .css prefixer(["transform"], [animation.back_transform])

                container.wrapInner "<span class='wodry-flipping' style='min-width: #{spanWidth}px; top: -0.5rem;'/>"
                    .find(".wodry-flipping").hide().show().css prefixer(["transform","transition"],[animation.action.transform,animation.action.transition])

            flip = ->
                if flip_container.find(".back-face").length > 0
                    flip_container.html do flip_container.find(".back-face").html

                front_text = do flip_container.text
                back_text_index = $.inArray front_text, array
                if (back_text_index + 1) is array.length
                    back_text_index = -1

                animate(animations[settings.animation],flip_container,front_text,array[back_text_index + 1])

            # setTimeout ->
            setInterval ->
              do flip
              do settings.callback
            , (settings.delay + settings.animationDuration)
            # , (settings.staggerInterval)
