angular.module('pokemon.services')

    .factory('GameFactory', function () {
        var notSoRandomArray = [];
        var canvas;
        var ctx;
        var pokeImg;
        var poke;

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
        }

        var spawnPoke = function () {
            var idx = Math.floor(Math.random() * notSoRandomArray.length);
            return notSoRandomArray[idx];

            // start creating the canvas and draw spawning etc on it.
        }

        var doGamePlay = function (pokemon) {
            poke = pokemon;
            canvas = document.getElementById('canvas');
            ctx = canvas.getContext("2d");
            canvas.style.display = "block";

            pokeImg = new Image(96, 96);
            pokeImg.onload = function () {
                startAnimation();
            }
            pokeImg.src = 'img/pokemon/' + poke.id + '.png';
        }

        function startAnimation() {
            ctx.font = "15px Hevetica";
            ctx.fillText("Start catching " + poke.name + " \nby turning your phone!", 10, 30);
            ctx.drawImage(pokeImg, 50, 50, 50, 50);
        }

        init();
        return {
            spawnPoke: spawnPoke,
            doGamePlay: doGamePlay
        };
    });