(function() {
    'use strict';

    var sequence, copy, round;
    var active = true;
    var mode = 'normal';

    $(document).ready(function() {
        initSimon();
    });
    
    function initSimon() {
        $('[data-action=start]').on('click', startGame);
        
    }

    function startGame() {
        sequence = [];
        copy = [];
        round = 0;
        $('p[data-action="lose"]').hide();
        newRound();
    }

function newRound() {
    $('[data-round]').text(++round);
        sequence.push(randomNumber());
        copy = sequence.slice(0);
        animate(sequence);
    }

    function activateSimonBoard(){
        $('.simon')
            .on('click', '[data-tile]', registerClick)

            .on('mousedown', '[data-tile]', function(){
                $(this).addClass('active');
                playSound($(this).data('tile'));
            })

            .on('mouseup', '[data-tile]', function(){
                $(this).removeClass('active');
            });

        $('[data-tile]').addClass('hoverable');
    }

    function deactivateSimonBoard() {
        if (mode !== 'free-board') {
            $('.simon')
                .off('click', '[data-tile]')
                .off('mousedown', '[data-tile]')
                .off('mouseup', '[data-tile]');

            $('[data-tile]').removeClass('hoverable');
        }
    }

    function registerClick(e) {
        var desiredResponse = copy.shift();
        var actualResponse = $(e.target).data('tile');
        active = (desiredResponse === actualResponse);
        checkLose();
    }

    function checkLose() {
        // copy array will be empty when user has successfully completed sequence
        if (copy.length === 0 && active) {
            deactivateSimonBoard();
            newRound();

        } else if (!active) { // user lost
            deactivateSimonBoard();
            endGame();
        }
    }

    function endGame() {
        // notify the user that they lost
        $('p[data-action=lose]').show();
        $($('[data-round]')[0]).text('0');
    }



    /*----------------- Helper functions -------------------*/

    function animate(sequence) {
        var i = 0;
        var interval = setInterval(function() {
            playSound(sequence[i]);
            lightUp(sequence[i]);

            i++;
            if (i >= sequence.length) {
                clearInterval(interval);
                activateSimonBoard();
            }
       }, 600);
    }

    function lightUp(tile) {
        if (mode !== 'sound-only') {
            $('[data-tile=' + tile + ']').animate({
                opacity: 1
            }, 250, function() {
                setTimeout(function() {
                    $('[data-tile=' + tile + ']').css('opacity', 0.6);
                }, 250);
            });
        }
    }

    function playSound(tile) {
        if (mode !== 'light-only') {
            var audio = $('<audio autoplay></audio>');
            audio.append('<source src="sounds/' + tile + '.wav" type="audio/wav" />');
            $('[data-action=sound]').html(audio);
        }
    }

    function randomNumber() {
        // between 1 and 4
        return Math.floor((Math.random()*4)+1);
    }

})();