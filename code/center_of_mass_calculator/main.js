import {items, calculateItemsCenterOfMass} from './center_of_mass_calc.js';

let scale = 0.5; 
const canvasOffset = {
    x: 0,
    y: 0
}
let isMouseDown = false;

function resizeCanvas() {
    canvas.width = window.innerWidth / scale;
    canvas.height = window.innerHeight / scale;
    drawCanvas();
}

function getRealCoords(x=0, y=0) {
    return {x: (canvas.width /2) + x + canvasOffset.x, y: (canvas.height / 2) - y - canvasOffset.y}
}

function drawCenterOfMass(_items) {
    let circle_radius = 30
    ctx.beginPath();
    let center = calculateItemsCenterOfMass(_items);
    let coords = getRealCoords(center.x, center.y);
    ctx.arc(coords.x, coords.y, circle_radius * 1.5, 0, Math.PI*15);
    ctx.fillStyle = '#eaeaea'
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.arc(coords.x, coords.y, circle_radius, 0, Math.PI*10);
    ctx.fillStyle = '#eb7734'
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.rect(coords.x-(circle_radius * 0.13/2), coords.y-(circle_radius * 1.33/2), circle_radius * 0.13, circle_radius * 1.33)
    ctx.rect(coords.x-(circle_radius * 1.33/2), coords.y-(circle_radius * 0.13/2), circle_radius * 1.33, circle_radius * 0.13)
    ctx.fillStyle = '#000000'
    ctx.fill();
    ctx.closePath();

    let yOffset = -300;
    let measureCoords = getRealCoords(0, yOffset)
    ctx.beginPath();
    ctx.rect(measureCoords.x, measureCoords.y, center.x, circle_radius*0.4 )
    ctx.fillStyle = '#ccc'
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.rect(measureCoords.x, measureCoords.y-circle_radius+circle_radius*0.2, circle_radius*0.4, circle_radius*2)
    ctx.fillStyle = '#ccc'
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.rect(measureCoords.x + center.x, measureCoords.y-circle_radius+circle_radius*0.2, circle_radius*0.4, circle_radius*2)
    ctx.fillStyle = '#ccc'
    ctx.fill();
    ctx.closePath();

    ctx.font="40px Times new roman";
    ctx.textBaseline = "top";
    ctx.textAlign="center"; 
    ctx.fillText(`${Math.round(center.x)}mm`, measureCoords.x + (center.x/2), measureCoords.y+circle_radius*2)

    let xOffset = -300;
    let measureCoords2 = getRealCoords(xOffset, 0)

    ctx.rect(measureCoords2.x, measureCoords2.y-center.y, circle_radius*0.4, center.y)
    ctx.fillStyle = '#ccc'
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.rect(measureCoords2.x-circle_radius+circle_radius*0.2, measureCoords2.y, circle_radius*2, circle_radius*0.4)
    ctx.fillStyle = '#ccc'
    ctx.fill();
    ctx.closePath();

    
    ctx.beginPath();
    ctx.rect(measureCoords2.x-circle_radius+circle_radius*0.2 , measureCoords2.y-center.y, circle_radius*2, circle_radius*0.4)
    ctx.fillStyle = '#ccc'
    ctx.fill();
    ctx.closePath();

    ctx.font="40px Times new roman";
    ctx.textBaseline = "top";
    ctx.textAlign="center"; 
    ctx.fillText(`${Math.round(center.y)}mm`, measureCoords2.x, measureCoords2.y + (center.x/2.5) )


}

function drawCanvas() {
    ctx.clearRect(0,0, canvas.width, canvas.height)
    
    items.forEach(item => {
        ctx.beginPath();
        let coords = getRealCoords(item.x, item.y);
        ctx.rect(coords.x, coords.y, item.width, item.height);
        ctx.lineWidth = 10;
        ctx.stroke();
        ctx.closePath();
    })

    drawCenterOfMass(items);
}

function moveCanvas(e) {
    if (isMouseDown) {
        canvasOffset.x += e.movementX / scale;
        canvasOffset.y -= e.movementY / scale;
        drawCanvas();
    }
}

function handleZoom(e) {
    if (e.deltaY > 0) {
        scale -= 0.1;
    } else {
        scale += 0.1;
    }
    if (scale < 0.3) {
        scale = 0.3;
    }
    resizeCanvas();
}


const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

resizeCanvas();

window.addEventListener('mousedown', () => isMouseDown = true);
window.addEventListener('mouseup', () => isMouseDown = false);
window.addEventListener('mouseleave', () => isMouseDown = false);
window.addEventListener('mouseout', () => isMouseDown = false);
window.addEventListener('wheel', handleZoom, false);
window.addEventListener('mousemove', moveCanvas);
window.addEventListener('resize', resizeCanvas);


