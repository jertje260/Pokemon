angular.module('pokemon.services')

    .factory('GameFactory', ['CompassFactory',function (CompassFactory) {
        var notSoRandomArray = [];
        var canvas;
        var ctx;
        var pokeImg;
        var poke;
        var exitImage;
        var callback;
        var headingStart;
        var lastHeading;
        var headings = [];
        var checkHeadings = {};
        var stopRunning = false;
        var headingChanged = 0;

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
            }
            event.preventDefault();
        }

        var doGamePlay = function (pokemon, returnFunc) {
            poke = pokemon;
            callback = returnFunc;

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
                checkHeadings.north = false;
                checkHeadings.east = false;
                checkHeadings.south = false;
                checkHeadings.west = false;
                headings = [];
                headings.push(heading);
            } else {
                headingChanged += (heading - headings[headings.length - 1]);
                if (heading > 90 && headings[headings.length - 1] < 90 || heading < 90 && headings[headings.length - 1] > 90) {
                    checkHeadings.east = true;
                } else if (heading > 180 && headings[headings.length - 1] < 180 || heading < 180 && headings[headings.length - 1] > 180) {
                    checkHeadings.south = true;
                } else if (heading > 270 && headings[headings.length - 1] < 270 || heading < 270 && headings[headings.length - 1] > 270) {
                    checkHeadings.west = true;
                } else if (heading > 0 && headings[headings.length - 1] < 360 && (heading +360) > headings[headings.length - 1]|| heading < 360 && headings[headings.length - 1] > 0 && (headings[headings.length - 1] +360) > heading) {
                    checkHeadings.east = true;
                }
                headings.push(heading);
            }
        }

        function done(){
            return(checkHeadings.east && checkHeadings.south && checkHeadings.west && checkHeadings.north || stopRunning);
        }        

        function draw() {
            if(!done()){
            setTimeout(function () {

                requestAnimationFrame(draw);

                render();

            }, 1000 / 30);
            } else {
                endAnimation();
            }
        }

        function render() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "#AFFFA0";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "#000000";
            ctx.font = "15px Hevetica";
            ctx.textAlign = "center";
            ctx.fillText("A wild " + poke.name + " appeared", canvas.width / 2, 30);
            ctx.fillText("You have changed " + headingChanged + " degrees", canvas.width/2, canvas.height - 60);
            ctx.fillText("Start catching " + poke.name + " by turning your phone", canvas.width / 2, canvas.height - 30);

            ctx.drawImage(pokeImg, canvas.width / 2 - pokeImg.width, canvas.height / 2 - pokeImg.height, pokeImg.width * 2, pokeImg.height * 2);
            ctx.drawImage(exitImage, 10, 10, 35, 35);
        }

        function startAnimation() {
            if (pokeImg !== undefined && pokeImg.isLoaded && exitImage !== undefined && exitImage.isLoaded) {
                canvas.style.display = "block";
                draw();
            }
        }

        function endAnimation() {
            CompassFactory.stopWatching();
            headingStart = null;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            canvas.style.display = "none";
            if (callback !== undefined && typeof callback === 'function') {
                callback();
            }

        }

        init();
        return {
            spawnPoke: spawnPoke,
            doGamePlay: doGamePlay
        };
    }]);