let fase = 0;            // 0 = puntino | 1 = testo | 2 = visualizzazione dati
let scrollValue = 0;
let transition = 1.0;

const sogliaUp = -300;      // scroll in alto
const sogliaDown = 300;     // scroll in basso

function mouseWheel(ev) {
  scrollValue += ev.delta;

  // Vai avanti
  if (scrollValue > sogliaDown) {
    scrollValue = 0;
    fase = min(2, fase + 1);
  }

  // Torna indietro
  if (scrollValue < sogliaUp) {
    scrollValue = 0;
    fase = max(0, fase - 1);
  }
}

function draw() {
  if (fase === 0) drawPuntino();
  else if (fase === 1) drawIntro();
  else if (fase === 2) drawMappamondo();
}

//FASE 0 - Puntino pulsante

function drawPuntino() {
  background(250);

let x = width / 2;
  let y = height / 2;
  let radius = 52;        // raggio iniziale più piccolo
  let baseColor = "pink"; // colore che preferisci

  drawLuce(x, y, radius, baseColor);

  noStroke();
fill("red");
  textAlign(LEFT,TOP);
  textSize(76);
  textStyle(BOLD);
  textLeading(70);
  text("WOMEN'S \nRIGHTS \nWORLDWIDE", 40, 40);

  fill("red");
  textAlign(CENTER);
  textSize(14);
  textStyle(NORMAL);
  text("scroll down for more", width/2, windowHeight-40);
}

//FASE 1 _ Testo introduttivo

function drawIntro() {
  background(250);
noStroke();
  fill("pink");
  textAlign(LEFT, CENTER);
  textSize(30);
  textLeading(35);
  textStyle(BOLD);
 text("Analysis of women's rights worldwide\n" +
     "examined through several indicators.\n\n" +
     "Each pink dot in the next page represents\n" +
     "a different country; click it to access\n" +
     "more information about rights there.",
     width/3, height/2);

  fill("red");
  textAlign(CENTER);
  textSize(14);
  textStyle(NORMAL);
  text("scroll down for more", width/2, windowHeight-40);
}

//FASE 2 - MAPPAMONDO

let outerMargin = 50;

// Variabile che conterrà i dati caricati dal CSV
let data;

// variabile che conterrà i dati del glifo selezionato
let hovered;

// Variabili globali per i limiti delle scale
let minLon, maxLon, minLat, maxLat, maxValue;

function preload() {
  data = loadTable("assets/data.csv", "csv", "header");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Scala per la longitudine → asse X
  let allLon = data.getColumn("longitude");
  minLon = min(allLon);
  maxLon = max(allLon);

  // Scala per la latitudine → asse Y
  let allLat = data.getColumn("latitude");
  minLat = min(allLat);
  maxLat = max(allLat);

  // Scala per il raggio → dipende dal valore numerico
  let allValues = data.getColumn("total");
  maxValue = max(allValues);
}

function drawMappamondo() {
  background(250);

  hovered = null;

  for (let rowNumber = 0; rowNumber < data.getRowCount(); rowNumber++) {
    let country = data.getString(rowNumber, "country");
    let value = data.getNum(rowNumber, "total");
    let lat = data.getNum(rowNumber, "latitude");
    let lon = data.getNum(rowNumber, "longitude");

    let x = map(lon, minLon, maxLon, outerMargin, width - outerMargin);
    let y = map(lat, minLat, maxLat, height - outerMargin, outerMargin);

    let radius = map(value, 0, maxValue, 2, 10);
    let d = dist(mouseX, mouseY, x, y);

    if (d < radius ) {
      hovered = { x: x, y: y, country: country, value: value };
      drawLuce(x, y, radius, "red");
    } else {
      drawLuce(x, y, radius, "pink");
    }
  }

  if (hovered) {
    cursor("pointer");
    let tooltipText = hovered.country;
    drawTooltip(hovered.x, hovered.y, tooltipText);
  } else {
    cursor("default");
  }
}

// Funzione per disegnare un luce rosa
function drawLuce(x, y, radius, baseColor) {
  push();
  noStroke();

  let col = color(baseColor);

  // Pulsazioni
  let pulse = sin(frameCount * 0.15) * 6;
  let pulse2 = sin(frameCount * 0.1) * 3;

  // Alone esterno
  for (let i = 0; i < 25; i++) {
    let alpha = map(i, 0, 25, 20, 0);
    fill(red(col), green(col), blue(col), alpha);
    let r = (radius * 1.8 + i * 4) + pulse;
    ellipse(x, y, r, r);
  }

  // Corona
  for (let i = 0; i < 10; i++) {
    let alpha = map(i, 0, 10, 180, 40);
    fill(red(col) + 40, green(col) + 40, blue(col) + 40, alpha);
    let r = (radius * 1.1 + i * 2) + pulse2;
    ellipse(x, y, r, r);
  }

  // Nucleo
  fill(red(col) + 80, green(col) + 80, blue(col) + 80, 255);
  ellipse(x, y, radius * 0.7 + pulse2 * 0.8);

  // Glow interno
  fill(red(col) + 120, green(col) + 120, blue(col) + 120, 220);
  ellipse(x, y, radius * 0.4 + pulse);

  pop();
}

// Tooltip
function drawTooltip(px, py, textString) {
  textSize(14);
  textAlign(LEFT, CENTER);
  fill("red");
  text(textString, px + 19, py);
}

// Click su punto
function mousePressed() {
  if (fase === 2 && hovered) {
    let newURL = "page.html?country=" + hovered.country;
    window.location.href = newURL;
  }
}
