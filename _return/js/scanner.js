var resultCollector = Quagga.ResultCollector.create({
    capture: true,
    capacity: 20,
    blacklist: [{ code: "2167361334", format: "i2of5" }],
    filter: function (codeResult) {
        // only store results which match this constraint
        // e.g.: codeResult
        return true;
    }
});
var scanner = {
    init: function () {
        var self = this;

        Quagga.init(this.state, function (err) {
            if (err) {
                return self.handleError(err);
            }
            //Quagga.registerResultCollector(resultCollector);
            Quagga.start();
        });
    },
    handleError: function (err) {
        console.log(err);
    },
    state: {
        inputStream: {
            type: "LiveStream",
            constraints: {
                width: { min: 640 },
                height: { min: 480 },
                facingMode: "environment",
                aspectRatio: { min: 1, max: 2 }
            }
        },
        locator: {
            patchSize: "large",
            halfSample: true
        },
        numOfWorkers: 1,
        decoder: {
            readers: [{
                format: "ean_reader",
                config: {}
            }]
        },
        locate: true
    }
};

scanner.init();

Quagga.onProcessed(function (result) {
    var drawingCtx = Quagga.canvas.ctx.overlay,
        drawingCanvas = Quagga.canvas.dom.overlay;

    if (result) {
        if (result.boxes) {
            drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
            result.boxes.filter(function (box) {
                return box !== result.box;
            }).forEach(function (box) {
                Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: "green", lineWidth: 2 });
            });
        }

        if (result.box) {
            Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: "#00F", lineWidth: 2 });
        }

        if (result.codeResult && result.codeResult.code) {
            Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: 'red', lineWidth: 3 });
        }
    }
});

Quagga.onDetected(function (result) {
    var code = result.codeResult.code;

    if (code.substr(0, 3) != "978") {
        return;
    }
    $("#result").html(code);
    Quagga.stop();
    app.scanner.onDetected(code);
});
