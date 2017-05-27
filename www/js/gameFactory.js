angular.module('pokemon.services')

    .factory('GameFactory', ['CompassFactory', 'ShareFactory', function (CompassFactory, ShareFactory) {
        var notSoRandomArray = [];
        var canvas;
        var ctx;
        var pokeImg;
        var poke;
        var exitImage;
        var reset;
        var caught;
        var headingStart;
        var lastHeading;
        var headings = [];
        var stopRunning = false;
        var headingChanged = 0;
        var endingCycles = 60;
        var pokeCaptured = false;
        var pokeballRadius = 80;
        var shareImg;
        var sharing = false;

        function init() {
            var pokes = [];
            for (var i = 1; i < 152; i++) {
                pokes.push(i);
            }
            // list of each pokemon with amount of spawns (in 1 million)
            var chances = [6900, 420, 170, 2530, 120, 31, 5800, 340, 67, 25000, 1870, 220, 60000, 4400, 510, 121767, 10200, 1300, 100000, 4100, 42000, 1500, 22700, 720, 2100, 76, 11100, 370, 13800, 880, 120, 13100, 830, 170, 9200, 120, 2200, 77, 3900, 180, 55000, 4200, 10200, 640, 97, 23600, 740, 22800, 720, 4000, 140, 8600, 220, 25400, 870, 9200, 310, 9200, 170, 21900, 1300, 110, 4200, 270, 73, 4900, 340, 68, 11500, 720, 59, 8100, 820, 11900, 710, 47, 5100, 110, 10500, 360, 7100, 230, 212, 5200, 2200, 2800, 130, 520, 31, 5200, 150, 7900, 520, 67, 1000, 32100, 1000, 21200, 620, 6500, 200, 7800, 140, 6100, 200, 200, 220, 110, 2000, 160, 6300, 220, 130, 2280, 86, 11300, 340, 21800, 800, 19500, 340, 31, 1400, 3500, 740, 1000, 9900, 1200, 43000, 32, 60, 50, 27500, 140, 120, 170, 120, 1400, 61, 1000, 32, 180, 160, 1, 1, 1, 3000, 200, 11, 1, 1];
            //creating an array with 1 million entries of each pokemon E.G. first 6900 entries will be 1 (first pokemon, bulbasaur)
            for (var i = 0; i < pokes.length; i++) {
                for (var j = 0; j < chances[i]; j++) {
                    notSoRandomArray.push(pokes[i]);
                }
            }
            // finish the exit image
            exitImage = new Image(48, 48);
            exitImage.isLoaded = false;
            exitImage.onload = function () {
                exitImage.isLoaded = true;
                startAnimation();
            }
            exitImage.src = 'img/exit.png';
            shareImg = new Image(48, 48);
            shareImg.isLoaded = false;
            shareImg.onload = function () {
                shareImg.isLoaded = true;
                startAnimation();
            }
            shareImg.src = 'img/share.png';
            canvas = document.getElementById('canvas');
            ctx = canvas.getContext("2d");


            canvas.onclick = function (event) {
                canvasClick(event);
            }
        }

        var spawnPoke = function () {
            var idx = Math.floor(Math.random() * notSoRandomArray.length);
            return notSoRandomArray[idx];

            // start creating the canvas and draw spawning etc on it.
        }

        function canvasClick(event) {
            if (event.layerX >= 10 && event.layerX <= 45 && event.layerY >= 10 && event.layerY <= 45) {
                stopRunning = true;
            } else if (event.layerX >= canvas.width - 45 && event.layerX <= canvas.width - 10 && event.layerY >= 10 && event.layerY <= 45) {
                share();
            }
            event.preventDefault();
        }

        function share() {
            var message;
            var name;
            if (!pokeCaptured) {
                message = 'I have encountered ' + poke.name + ' in the wild!';
                name = 'encountered_' + poke.name;
            } else {
                message = 'I have caught a ' + poke.name + '!';
                name = 'caught_' + poke.name;
            }
            ShareFactory.share(message, null, canvas.toDataURL());

        }


        var doGamePlay = function (pokemon, resetPoke, caughtPoke) {
            poke = pokemon;
            reset = resetPoke;
            caught = caughtPoke;
            pokeCaptured = false;
            CompassFactory.startWatching(updateHeading);
            stopRunning = false;
            canvas.height = canvas.parentElement.scrollHeight;
            canvas.width = canvas.parentElement.scrollWidth;
            pokeImg = new Image(96, 96);
            pokeImg.onload = function () {
                pokeImg.isLoaded = true;
                startAnimation();
            }
            pokeImg.isLoaded = false;
            pokeImg.src = 'img/pokemon/' + poke.id + '.png';
        }

        function updateHeading(heading) {
            heading = heading.magneticHeading;
            if (headingStart === undefined || headingStart === null) {
                headingStart = heading;
                headingChanged = 0;
                headings = [];
                headings.push(heading);
            } else {
                var angle_delta = (((heading - headings[headings.length - 1]) + 180) - Math.floor(((heading - headings[headings.length - 1]) + 180) / 360) * 360) - 180;
                headingChanged += angle_delta;
                if (Math.abs(headingChanged) > 360) {
                    if (typeof caught === 'function') {
                        caught();
                    }
                    CompassFactory.stopWatching();
                    pokeCaptured = true;

                }
                headings.push(heading);
            }
        }

        function draw() {
            if (!stopRunning) {
                setTimeout(function () {

                    requestAnimationFrame(draw);

                    render();

                }, 1000 / 30);
            } else {
                endAnimation();
            }
        }

        function degreesToRadian(degrees) {
            return degrees * Math.PI / 180;
        }


        function render() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "#AFFFA0";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "#000000";
            ctx.font = "15px Hevetica";
            ctx.textAlign = "center";
            ctx.drawImage(exitImage, 10, 10, 35, 35);
            ctx.drawImage(shareImg, canvas.width - 45, 10, 35, 35);
            ctx.drawImage(pokeImg, canvas.width / 2 - pokeImg.width, canvas.height / 2 - pokeImg.height, pokeImg.width * 2, pokeImg.height * 2);
            if (!pokeCaptured) {
                ctx.fillText("A wild " + poke.name + " appeared", canvas.width / 2, 30);
                ctx.fillText("Start catching " + poke.name + " by turning your phone", canvas.width / 2, canvas.height - 30);

                // drawing capture circle in parts
                ctx.lineWidth = 5;
                var start = Math.PI;
                if (headingChanged > 0) { // clockwise
                    // first part
                    var p1 = headingChanged;
                    var p2 = headingChanged - 90;
                    var p3 = headingChanged - 270;
                    if (headingChanged > 90) {
                        p1 = 90;
                        if (headingChanged > 270) {
                            p2 = 180;
                            ctx.beginPath()
                            ctx.strokeStyle = "#f2020e";
                            ctx.arc(canvas.width / 2, canvas.height / 2, pokeballRadius, start, start + degreesToRadian(p3));
                            ctx.stroke();
                        }

                        start = 0;
                        ctx.beginPath()
                        ctx.strokeStyle = "#FFFFFF";
                        ctx.arc(canvas.width / 2, canvas.height / 2, pokeballRadius, start, start + degreesToRadian(p2));
                        ctx.stroke();

                    }
                    start = 1.5 * Math.PI;
                    ctx.beginPath()
                    ctx.strokeStyle = "#f2020e";
                    ctx.arc(canvas.width / 2, canvas.height / 2, pokeballRadius, start, start + degreesToRadian(p1));
                    ctx.stroke();
                } else { // anticlockwise
                    // first part
                    start = 0
                    var p1 = headingChanged;
                    var p2 = headingChanged + 90;
                    var p3 = headingChanged + 270;
                    if (headingChanged < -90) {
                        p1 = -90;
                        if (headingChanged < -270) {
                            p2 = -180;
                            ctx.beginPath()
                            ctx.strokeStyle = "#f2020e";
                            ctx.arc(canvas.width / 2, canvas.height / 2, pokeballRadius, start + degreesToRadian(p3), start);
                            ctx.stroke();
                        }


                        start = Math.PI;
                        ctx.beginPath()
                        ctx.strokeStyle = "#FFFFFF";
                        ctx.arc(canvas.width / 2, canvas.height / 2, pokeballRadius, start + degreesToRadian(p2), start);
                        ctx.stroke();

                    }
                    start = 1.5 * Math.PI;
                    ctx.beginPath()
                    ctx.strokeStyle = "#f2020e";
                    ctx.arc(canvas.width / 2, canvas.height / 2, pokeballRadius, start + degreesToRadian(p1), start);
                    ctx.stroke();
                }



            } else {
                ctx.fillText("You captured " + poke.name + "!", canvas.width / 2, 30);
            }
        }

        function startAnimation() {
            if (pokeImg !== undefined && pokeImg.isLoaded && exitImage !== undefined && exitImage.isLoaded && shareImg !== undefined && shareImg.isLoaded) {
                canvas.style.display = "block";
                draw();
            }
        }

        function endAnimation() {
            CompassFactory.stopWatching();
            headingStart = null;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            canvas.style.display = "none";
            if (reset !== undefined && typeof reset === 'function') {
                reset();
            }

        }

        init();
        return {
            spawnPoke: spawnPoke,
            doGamePlay: doGamePlay
        };
    }]);