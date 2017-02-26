$(function() {
    var Scanner = {
        init: function() {
            Scanner.attachListeners();
        },
        attachListeners: function() {
            var self = this;

            $("input[type=file]").on("change", function(e) {
                if (e.target.files && e.target.files.length) {
                    Scanner.decode(URL.createObjectURL(e.target.files[0]));
                }
            });
        },
        decode: function(src) {
            var self = this,
                config = $.extend({}, self.state, {src: src});

            Quagga.decodeSingle(config, function(result) {});
        },
        state: {
            inputStream: {
                size: 800,
                singleChannel: false
            },
            locator: {
                patchSize: "medium",
                halfSample: true
            },
            decoder: {
                readers: [{
                    format: "ean_reader",
                    config: {}
                }]
            },
            locate: true,
            src: null
        }
    };

    Scanner.init();

    function calculateRectFromArea(canvas, area) {
        var canvasWidth = canvas.width,
            canvasHeight = canvas.height,
            top = parseInt(area.top)/100,
            right = parseInt(area.right)/100,
            bottom = parseInt(area.bottom)/100,
            left = parseInt(area.left)/100;

        top *= canvasHeight;
        right = canvasWidth - canvasWidth*right;
        bottom = canvasHeight - canvasHeight*bottom;
        left *= canvasWidth;

        return {
            x: left,
            y: top,
            width: right - left,
            height: bottom - top
        };
    }

    Quagga.onDetected(function(result) {
        var code = result.codeResult.code,
            canvas = Quagga.canvas.dom.image;

        $("#scan-modal img").attr("src", canvas.toDataURL());
        $("#scan-modal #code").html(code);
    });
});