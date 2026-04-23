let move_speed = 3, grativy = 0.5;
let bird = document.querySelector('.bird');
let img = document.getElementById('bird-1');
let sound_point = new Audio('sounds effect/point.mp3');
let sound_die = new Audio('sounds effect/die.mp3');

let bird_props = bird.getBoundingClientRect();
let background = document.querySelector('.background').getBoundingClientRect();

let score_val = document.querySelector('.score_val');
let message = document.querySelector('.message');
let score_title = document.querySelector('.score_title');

let game_state = 'Start';
let bird_dy = 0;

/* Hide bird at start */
img.style.display = 'none';
message.classList.add('messageStyle');

/* Restart from message tap/click */
message.addEventListener('click', restartGame);
message.addEventListener('touchstart', restartGame);

function restartGame(e) {
    if (game_state == 'End') {
        e.preventDefault();
        window.location.reload();
    }
}

/* Start game */
function startGame() {
    document.querySelectorAll('.pipe_sprite').forEach(e => e.remove());

    bird.style.top = '40vh';
    img.style.display = 'block';
    img.src = 'images/Bird.png';

    score_val.innerHTML = '0';
    score_title.innerHTML = 'Score : ';
    message.innerHTML = '';
    message.classList.remove('messageStyle');

    bird_dy = 0;
    game_state = 'Play';

    play();
}

/* Keyboard controls */
document.addEventListener('keydown', (e) => {
    if (e.key == 'Enter' && game_state != 'Play') {
        startGame();
    }

    if ((e.key == 'ArrowUp' || e.key == ' ') && game_state == 'Play') {
        jump();
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key == 'ArrowUp' || e.key == ' ') {
        img.src = 'images/Bird.png';
    }
});

/* Mobile tap / Mouse click */
document.addEventListener('touchstart', screenAction);
document.addEventListener('click', screenAction);

function screenAction(e) {
    if (e.target === message && game_state == 'End') return;

    if (game_state == 'Play') {
        jump();
    } else if (game_state == 'Start') {
        startGame();
    }
}

function jump() {
    bird_dy = -7.6;
    img.src = 'images/Bird-2.png';
}

/* Main game */
function play() {

    function move() {
        if (game_state != 'Play') return;

        let pipes = document.querySelectorAll('.pipe_sprite');

        pipes.forEach((element) => {
            let pipe_props = element.getBoundingClientRect();
            bird_props = bird.getBoundingClientRect();

            if (pipe_props.right <= 0) {
                element.remove();
            } else {

                if (
                    bird_props.left < pipe_props.left + pipe_props.width &&
                    bird_props.left + bird_props.width > pipe_props.left &&
                    bird_props.top < pipe_props.top + pipe_props.height &&
                    bird_props.top + bird_props.height > pipe_props.top
                ) {
                    endGame();
                    return;
                }

                if (
                    pipe_props.right < bird_props.left &&
                    pipe_props.right + move_speed >= bird_props.left &&
                    element.increase_score == '1'
                ) {
                    score_val.innerHTML = +score_val.innerHTML + 1;
                    sound_point.play();
                }

                element.style.left = pipe_props.left - move_speed + 'px';
            }
        });

        requestAnimationFrame(move);
    }

    function apply_gravity() {
        if (game_state != 'Play') return;

        bird_dy += grativy;
        bird.style.top = bird_props.top + bird_dy + 'px';
        bird_props = bird.getBoundingClientRect();

        if (bird_props.top <= 0 || bird_props.bottom >= background.bottom) {
            endGame();
            return;
        }

        requestAnimationFrame(apply_gravity);
    }

    let pipe_seperation = 0;
    let pipe_gap = 35;

    function create_pipe() {
        if (game_state != 'Play') return;

        if (pipe_seperation > 115) {
            pipe_seperation = 0;

            let pipe_posi = Math.floor(Math.random() * 43) + 8;

            let pipe_top = document.createElement('div');
            pipe_top.className = 'pipe_sprite';
            pipe_top.style.top = (pipe_posi - 70) + 'vh';
            pipe_top.style.left = '100vw';

            document.body.appendChild(pipe_top);

            let pipe_bottom = document.createElement('div');
            pipe_bottom.className = 'pipe_sprite';
            pipe_bottom.style.top = (pipe_posi + pipe_gap) + 'vh';
            pipe_bottom.style.left = '100vw';
            pipe_bottom.increase_score = '1';

            document.body.appendChild(pipe_bottom);
        }

        pipe_seperation++;
        requestAnimationFrame(create_pipe);
    }

    requestAnimationFrame(move);
    requestAnimationFrame(apply_gravity);
    requestAnimationFrame(create_pipe);
}

/* End game */
function endGame() {
    if (game_state == 'End') return;

    game_state = 'End';
    img.style.display = 'none';
    sound_die.play();

    message.innerHTML = 'Game Over'.fontcolor('red') + '<br>Tap Here To Restart';
    message.classList.add('messageStyle');
}