/*
 Copyright (c) 2024 zorozo.com

 Permission is hereby granted, free of charge, to any person obtaining a copy of
 this software and associated documentation files (the "Software"), to deal in
 the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

$(document).ready(function() {
    // Getting references to the elements
    const canvas = document.getElementById('whiteboard');
    const ctx = canvas.getContext('2d');
    const colorPicker = document.getElementById('colorPicker');
    const brushSize = document.getElementById('brushSize');
    const brushTool = document.getElementById('brushTool');
    const eraserTool = document.getElementById('eraserTool');
    const sprayTool = document.getElementById('sprayTool');
    const clearTool = document.getElementById('clearTool');
    const saveTool = document.getElementById('saveTool');

    // Set canvas dimensions
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;

    // Variables for drawing
    let drawing = false;
    let currentColor = colorPicker.value;
    let currentBrushSize = brushSize.value;
    let sprayMode = false;

    // Function to disable scrolling
    function disableScroll() {
        document.body.style.overflow = 'hidden';
        document.addEventListener('touchmove', preventDefault, { passive: false });
    }

    // Function to enable scrolling
    function enableScroll() {
        document.body.style.overflow = '';
        document.removeEventListener('touchmove', preventDefault, { passive: false });
    }

    // Prevent default touch behavior
    function preventDefault(e) {
        e.preventDefault();
    }

    // Functions to start and stop drawing
    function startDrawing(event) {
        drawing = true;
        disableScroll();
        draw(event);
    }

    function stopDrawing() {
        drawing = false;
        enableScroll();
        ctx.beginPath();
    }

    // Function to draw on the canvas
    function draw(e) {
        if (!drawing) return;
        let poniter = {clientX: e.clientX || e.touches[0].clientX,clientY:e.clientY || e.touches[0].clientY};

        if (sprayMode) {
            sprayPaintEffect(poniter.clientX - canvas.offsetLeft, poniter.clientY - canvas.offsetTop);
        } else {
            ctx.lineWidth = currentBrushSize;
            ctx.lineCap = 'round';
            ctx.strokeStyle = currentColor;

            ctx.lineTo(poniter.clientX - canvas.offsetLeft, poniter.clientY - canvas.offsetTop);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(poniter.clientX - canvas.offsetLeft, poniter.clientY - canvas.offsetTop);
        }
    }

    // Spray paint effect function
    function sprayPaintEffect(x, y) {
        let density = 10*currentBrushSize; // Number of spray particles per draw call

        console.log(currentBrushSize)
        for (let i = 0; i < density; i++) {
            const offsetX = Math.random() * currentBrushSize * 2 - currentBrushSize;
            const offsetY = Math.random() * currentBrushSize * 2 - currentBrushSize;
            const distance = Math.sqrt(offsetX * offsetX + offsetY * offsetY);

            if (distance <= currentBrushSize) {
                ctx.fillStyle = currentColor;
                ctx.fillRect(x + offsetX, y + offsetY, 1, 1);
            }
        }
    }

    // Event listeners for drawing
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mousemove', draw);

    canvas.addEventListener('touchstart', startDrawing);
    canvas.addEventListener('touchend', stopDrawing);
    canvas.addEventListener('touchcancel', stopDrawing);
    canvas.addEventListener('touchmove', draw);

    // Changing brush color and size
    colorPicker.addEventListener('input', () => {
        currentColor = colorPicker.value;
    });

    brushSize.addEventListener('input', () => {
        currentBrushSize = brushSize.value;
    });

    // Tool functionality
    brushTool.addEventListener('click', () => {
        sprayMode = false;
        currentColor = colorPicker.value;
    });

    eraserTool.addEventListener('click', () => {
        currentColor = '#FFFFFF'; // Set to white (canvas background color)
        sprayMode = false; // Turn off spray mode if eraser is selected
    });

    sprayTool.addEventListener('click', () => {
        sprayMode = true;
        currentColor = colorPicker.value;
    });

    clearTool.addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    saveTool.addEventListener('click', () => {
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = 'whiteboard.png';
        link.click();
    });
});
