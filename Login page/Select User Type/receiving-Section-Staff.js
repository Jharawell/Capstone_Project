// JavaScript Document// script.js

// Function for Cell 1: Show Date
function showDate() {
    document.getElementById('date').textContent = new Date().toDateString();
}

// Function for Cell 2: Calculate Sum
function calculateSum() {
    const num1 = parseFloat(document.getElementById('num1').value);
    const num2 = parseFloat(document.getElementById('num2').value);
    const sum = num1 + num2;
    document.getElementById('result').textContent = 'Sum: ' + sum;
}

// Function for Cell 3: Change Background Color
function changeBackgroundColor() {
    const color = document.getElementById('colorPicker').value;
    document.body.style.backgroundColor = color;
}
