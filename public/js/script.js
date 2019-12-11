$(document).ready(function () {
    let canvas = $('#canvas').get(0);
    let ctx = canvas.getContext('2d');
    let drawing = false;
    let brush_color, radius;
    let socket = io.connect();

    canvas.width = window.innerWidth - 320;
    canvas.height = window.innerHeight - 50;

    canvas.addEventListener('mousedown', function () {
        drawing = true;
        socket.emit('mouse_down');
    });

    canvas.addEventListener('mouseup', function () {
        drawing = false;
        ctx.beginPath();
        socket.emit('mouse_up');
    });

    canvas.addEventListener('mousemove', function (e) {
        const x = e.clientX - 24;
        const y = e.clientY - 24;

        if (drawing) {
            socket.emit('draw', {
                x: x,
                y: y,
                brush_color: brush_color,
                rad: radius
            });
            draw(ctx, x, y, brush_color, radius);
        }
    });

    $('#clear').click(function () {
        clear();
        socket.emit('clear');
    });

    $('#radius').change(function () {
        radius = this.value;
        ctx.lineWidth = radius * 2;
    });

    $('#brush_color').change(function () {
        brush_color = this.value;
        ctx.fillStyle = brush_color;
        ctx.strokeStyle = brush_color;
    });

    socket.on('connect', function () {
        brush_color = '#000000';
        radius = 10;

        $('#radius').val(radius);
        $('#brush_color').val(brush_color);

        socket.emit('message', 'User connected!');
    });

    socket.on('draw', function (data) {
        draw(ctx, data.x, data.y, data.brush_color, data.rad);
    });

    socket.on('clear', function () {
        clear();
    });

    socket.on('mouse_up', function () {
        drawing = false;
        ctx.beginPath();
    });

    socket.on('mouse_down', function () {
        drawing = true;
    });

    socket.on('message', function (data) {
        console.log(data);
    });

    socket.on('disconnect', function () {
        socket.emit('message', 'User disconnected!')
    });

    function draw(ctx, x, y, color, rad) {
        ctx.strokeStyle = color;
        ctx.lineWidth = rad * 2;

        ctx.lineTo(x, y);
        ctx.stroke();

        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(x, y, rad, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.moveTo(x, y);
    }

    function clear() {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.beginPath();
        ctx.fillStyle = brush_color;
    }
});