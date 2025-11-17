let data;
let dimensions;
let compareInput, compareButton;
let compareCountry = null;

function preload() {
  data = loadTable("assets/data.csv", "csv", "header");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(50);

  dimensions = [
    "Access to financial assets",
    "Access to justice",
    "Access to land assets",
    "Access to non-land assets",
    "Child marriage eradication",
    "Female genital mutilation eradication",
    "Freedom of movement",
    "Household responsibilities",
    "Political voice",
    "Violence against women eradication",
    "Workplace rights"
  ];

  textSize(14);
  textAlign(RIGHT, CENTER);

  // Input e datalist
  compareInput = createInput('');
  compareInput.position(width - 550, 40);
  compareInput.attribute('list', 'countryList');
  compareInput.attribute('placeholder', 'Select country to');

  let countryList = createElement('datalist');
  countryList.id('countryList');
  countryList.parent(document.body);

  let countries = data.getColumn('country');
  for (let c of countries) {
    let option = createElement('option');
    option.attribute('value', c);
    option.parent(countryList);
  }

  // Bottone confronta
  compareButton = createButton('compare');
  compareButton.position(compareInput.x + compareInput.width + 5, 40);
  compareButton.mousePressed(() => {
    compareCountry = compareInput.value();
  });
}

function draw() {
  background(250);

  let params = getURLParams();
  let selected = data.findRows(params.country, "country")[0];

  if (!selected) {
    fill(0);
    textAlign(CENTER, CENTER);
    text("Country not found!", width / 2, height / 2);
    return;
  }

  // Disegna i totem
  drawTotemAligned(selected, compareCountry ? data.findRows(compareCountry, "country")[0] : null);

  // Info aggiuntive in alto a sinistra
  drawExtraInfoTopLeft(selected, compareCountry ? data.findRows(compareCountry, "country")[0] : null);
}

// Disegna i due totem con barre centrate verticalmente
function drawTotemAligned(selected, compareSelected = null) {
  let startX1 = width - 450;
  let startX2 = width - 660;
  let startY = 140;
  let maxHeight = 80;
  let margin = 10;
  let barWidth = 200;

  let barCenters = [];
  let currentY = startY;

  for (let i = 0; i < dimensions.length; i++) {
    let dim = dimensions[i];
    let value1 = selected.get(dim);
    let numeric1 = value1 === "" ? 0 : Number(value1);
    let barHeight1 = map(numeric1, 0, 100, 5, maxHeight);

    let barHeight2 = 0;
    if (compareSelected) {
      let value2 = compareSelected.get(dim);
      let numeric2 = value2 === "" ? 0 : Number(value2);
      barHeight2 = map(numeric2, 0, 100, 5, maxHeight);
    }

    let centerY = currentY + Math.max(barHeight1, barHeight2) / 2;
    barCenters.push(centerY);

    currentY += Math.max(barHeight1, barHeight2) + margin;
  }

  for (let i = 0; i < dimensions.length; i++) {
    let dim = dimensions[i];

    let value1 = selected.get(dim);
    let numeric1 = value1 === "" ? 0 : Number(value1);
    let barHeight1 = map(numeric1, 0, 100, 5, maxHeight);
    fill(value1 === "" ? "pink" : "red");
    noStroke();
    rectMode(CENTER);
    rect(startX1, barCenters[i], barWidth, barHeight1);

    fill(value1 === "" ? "pink" : "red");
    textAlign(LEFT, CENTER);
    text(dim + ": " + (value1 === "" ? "N/A" : value1), startX1 - barWidth / 2 + 210, barCenters[i]);

    if (compareSelected) {
      let value2 = compareSelected.get(dim);
      let numeric2 = value2 === "" ? 0 : Number(value2);
      let barHeight2 = map(numeric2, 0, 100, 5, maxHeight);
      fill(value2 === "" ? "pink" : "red");
      rect(startX2, barCenters[i], barWidth, barHeight2);

      fill(value2 === "" ? "pink" : "red");
      textAlign(RIGHT, CENTER);
      text(dim + ": " + (value2 === "" ? "N/A" : value2), startX2 - barWidth / 2 - 10, barCenters[i]);
    }
  }
}

// Info aggiuntive in alto a sinistra
function drawExtraInfoTopLeft(selected, compareSelected = null) {
  let startX = width - 550;
  let startXC = width - 760;
  let startY = 90;

  let total = Number(selected.get("total")).toFixed(2);
textSize(30);
  textAlign(LEFT, CENTER);
  textStyle(BOLD);
  fill("red");
  text(selected.get("country"), startX, startY);
  textSize(14);
  textStyle(NORMAL);
  text("Total: " + total, startX, startY + 22);

  if (compareSelected) {
    let total2 = Number(compareSelected.get("total")).toFixed(2);
 
textStyle(BOLD);
    text(compareSelected.get("country"), startXC, startY );
textStyle(NORMAL);
textSize(14);
    text("Total: " + total2, startXC, startY + 22);

  }
}
