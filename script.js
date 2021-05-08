var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");

var n = 20;

var time = 0;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const TWO_PI = Math.PI * 2;

function Epicycle(cx, cy, radius, freq = 1) {
    this.centerX = cx;
    this.centerY = cy;
    this.radius = radius;
    // this.x = this.centerX + (this.radius * Math.cos(time));
    // this.y = this.centerY - (this.radius * Math.sin(time));
    this.freq = freq;
    

    this.draw = function() {
        // CENTER CIRCLE
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.centerX, this.centerY, this.radius, 0, TWO_PI);
        ctx.stroke();

        // SMALL CIRCLE
        // ctx.beginPath();
        // ctx.arc(this.x, this.y, 5, 0, TWO_PI);
        // ctx.fill();

        // LINE
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(this.centerX, this.centerY);
        ctx.lineTo(this.x, this.y);
        ctx.stroke();

    }

    this.update = function() {
        this.x = this.centerX + (this.radius * Math.cos(time * this.freq));
        this.y = this.centerY - (this.radius * Math.sin(time * this.freq));
        // console.log(this.x, this.y);
    }
}

var fourier1;
var wave = [];
var series = [];

function drawWave(fourier) { // fourier is a fourier object 
    let offset = 600;
    const stretch = 1;
    wave.unshift(fourier.y);
    // console.log(wave);
    if (wave.length > 1000) {
        wave.pop();
    }

    for (var i = 0; i < wave.length - 1; i++) {
        // POINT
        let x = offset + (i * stretch);
        if (i == 0) {
            // LINE
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(fourier.x, fourier.y);
            ctx.lineTo(x, wave[0]);
            ctx.stroke();
        }
        ctx.beginPath();
        ctx.arc(x, wave[i], 2, 0, TWO_PI);
        ctx.fill();

    }
    
}

function init() {
    fourier1 = new Epicycle(300, 300, 150);
    series.push(fourier1);

    for (var i = 0; i < n; i++) {
        console.log(i);
        let cx = series[i].x;
        let cy = series[i].y;
        let radius = series[0].radius / ((2 * i) + 3);
        let freq = (2 * i) + 3;
        series.push(new Epicycle(cx, cy, radius, freq));
    }
}

function animate() {
    window.setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (var i = 1; i < series.length; i++) {
            series[i].centerX = series[i - 1].x;
            series[i].centerY = series[i - 1].y;   
        }
        
        for (var i = 0; i < series.length; i++) {
            series[i].draw();
        }
        for (var i = 0; i < series.length; i++) {
            series[i].update();
        }
        
        
        time += 0.005;
        
        drawWave(series[series.length - 1]);
        
    }, 1000/60)
    
}

init();
animate();