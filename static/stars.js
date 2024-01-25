document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('starfield');
    const ctx = canvas.getContext('2d');

    // Set canvas size to match the viewport
    canvas.width = screen.availWidth;
    canvas.height = screen.availHeight;

    // Create a radial gradient
    const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height, 0,
        canvas.width / 2, canvas.height, canvas.height
    );

    // Define gradient colors
    gradient.addColorStop(0, 'transparent');
    gradient.addColorStop(0.8, 'rgba(255, 255, 255, 0.2)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    // Fill the canvas with the gradient
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let stars = [];
    let comets = [];

    function initializeStars() {
        // star's
        for (let i = 0; i < 500; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.floor(Math.random() * 3),
                speed: Math.random() * 2 + 1,  // Random speed between 1 and 3
                alpha: Math.random(),
                delta_alpha: (Math.random()* 2 - 1)*0.02
            });
        }
        // comet's 
        for (let i = 0; i < 3; i++) {
            comets.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: 2,
                angle: Math.random() * 2 * Math.PI,
                tail: []
            })
        }
    }

    function drawStar(x, y, size, a) {
        // ctx.fillStyle = 'rgba(255, 0, 0, ${a})';
        ctx.fillStyle = 'rgba(255, 255, 255, ' + a + ')';
        ctx.fillRect(x, y, size, size);
    }

    function drawTail(comet) {

        if (comet.tail.length > 1) {
            ctx.beginPath();
            ctx.moveTo(comet.tail[0][0], comet.tail[0][1])
            for (let i = 0; i < comet.tail.length; i++) {
                ctx.lineTo(comet.tail[i][0], comet.tail[i][1])
            }
            ctx.lineTo(comet.x, comet.y)
            ctx.strokeStyle = '#fff';
            ctx.stroke();
        }
    }

    function moveStars() {
        for (let i = 0; i < stars.length; i++) {
            stars[i].y += stars[i].speed;
            stars[i].alpha += stars[i].delta_alpha

            // If a star goes offscreen, reset its position to the top
            if (stars[i].y > canvas.height) {
                stars[i].y = 0;
                stars[i].x = Math.random() * canvas.width;
            }
            // Check alpha value
            if (stars[i].alpha > 1 || stars[i].alpha < 0) {
                stars[i].delta_alpha = -stars[i].delta_alpha;
            }
        }
    }

    function moveComets() {
        for (let i = 0; i < comets.length; i++) {
            comet = comets[i]
            // Case: Out Of Bound
            if (comet.x < 0 || comet.x > canvas.width || comet.y < 0 || comet.y > canvas.height) {
                if (comet.tail.length > 0) {
                    comet.tail.shift();
                    break;
                }
                comet.x = Math.random() * canvas.width;
                comet.y = Math.random() * canvas.height;
                comet.angle = Math.random() * 2 * Math.PI;
                break;
            }
            // update next position
            if (comet.tail.length > 2) {
                comet.tail.shift()
            }
            comet.tail.push([comet.x, comet.y])
            comet.x += Math.cos(comet.angle) * 30;
            comet.y += Math.sin(comet.angle) * 30;
        }
    }

    function draw() {

        // Create a radial gradient
        const yoffset = window.innerWidth / 2
        const gradient = ctx.createRadialGradient(
            window.innerWidth / 2, window.innerHeight + yoffset, 0,
            window.innerWidth / 2, window.innerHeight + yoffset, window.innerWidth * 3
        );
        gradient.addColorStop(0, 'grey');
        gradient.addColorStop(0.3, 'black');
        // Fill Background
        ctx.fillStyle = gradient; // Set the background color
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Stars
        for (let i = 0; i < stars.length; i++) {
            drawStar(stars[i].x, stars[i].y, stars[i].size, stars[i].alpha);
        }
        // Comets
        for (let i = 0; i < comets.length; i++) {
            drawStar(comets[i].x, comets[i].y, comets[i].size);
            drawTail(comets[i])
        }

        moveStars();
        moveComets();
        requestAnimationFrame(draw);

    }

    // Initialize stars and start the animation
    initializeStars();
    draw();

    // Resize canvas when the window is resized
    window.addEventListener('resize', function () {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
});