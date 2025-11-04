let data; // Variabile globale che conterrà i dati letti dal file CSV

function preload() {
  // preload() serve per caricare file o risorse prima che lo sketch inizi.
  // Qui carichiamo una tabella CSV che si trova nella cartella "assets".
  // L’opzione "header" indica che la prima riga del file contiene i nomi delle colonne.
  data = loadTable("assets/data.csv", "csv", "header");
}

function setup() {
  // Impostiamo la dimensione della tela in base alla finestra del browser
  createCanvas(windowWidth, windowHeight);
  background(10); // Colore di sfondo scuro

  // Legge i parametri passati nell’URL (es. ?country=Burkina_Faso)
  let params = getURLParams();

  // Cerca nella tabella la riga in cui la colonna "country" corrisponde al parametro passato
  // e prende la prima corrispondenza trovata
  let selected = data.findRows(params.country, "country")[0];

  // Elenco delle dimensioni (colonne) che vogliamo visualizzare come raggi nel grafico circolare
  // deve corrispondere esattamente ai nomi delle colonne nel file CSV
  let dimensions = [
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
    "Workplace rights",
  ];

  // Distanza massima dal centro per il valore massimo (100)
  let maxRadius = 200;

  // Imposta il sistema angolare in gradi invece che in radianti
  angleMode(DEGREES);

  // --- CICLO PRINCIPALE: disegna un raggio per ogni dimensione ---
  for (let i = 0; i < dimensions.length; i++) {
    let dim = dimensions[i]; // Nome della dimensione
    let value = selected.get(dim); // Valore associato (come stringa dal CSV)
    console.log(dimensions[i], value); // Stampa su console per controllo

    // Calcola l’angolo di ciascun raggio: li distribuisce uniformemente su 360°
    let angle = map(i, 0, dimensions.length, 0, 360);

    // Converte il valore (da 0 a 100) in una lunghezza (da 20 a maxRadius)
    let dimLength = map(value, 0, 100, 20, maxRadius);

    push(); // Salva il sistema di coordinate corrente
    translate(width / 2, height / 2); // Sposta l’origine al centro del canvas
    rotate(angle); // Ruota il sistema di riferimento di “angle” gradi

    // Disegna la linea del raggio
    stroke("yellow");
    strokeWeight(2);
    line(20, 0, dimLength, 0);

    // Disegna un piccolo cerchio alla fine del raggio
    noStroke();
    // Imposta il colore di riempimento
    fill("yellow");
    // Solo se il valore è vuoto (mancante), colora il punto in grigio
    if (value === "") {
      fill("gray");
    }
    //disegna il pallino
    ellipse(dimLength, 0, 5, 5);

    // Scrive il nome e il valore della dimensione accanto al raggio
    // Imposta il colore del testo
    fill("white");
    // Solo se il valore è vuoto (mancante), colora il testo in grigio
    if (value === "") {
      fill("gray");
    }

    // Se il testo si trova nella metà sinistra del cerchio,
    // viene ruotato di 180° per rimanere leggibile
    if (angle > 90 && angle < 270) {
      // Ruota il testo di 180 gradi
      rotate(180);
      // Allinea il testo a destra
      textAlign(RIGHT, CENTER);
      // Disegna il testo dalla parte opposta del raggio,
      // con un piccolo margine di 10 pixel
      text(dim + ": " + value, -dimLength - 10, 0);
    } else {
      textAlign(LEFT, CENTER);
      text(dim + ": " + value, dimLength + 10, 0);
    }

    pop(); // Ripristina il sistema di coordinate originale
  }

  // Mostra nella console l’intera riga selezionata (oggetto p5.TableRow)
  console.log(selected);
}