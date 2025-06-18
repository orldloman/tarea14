class Rompecabezas {
  constructor() {
    this.board = document.getElementById("board");
    this.tiles = Array.from(this.board.children);
    this.moves = 0;
    this.time = 0;
    this.timer = null;

    this.startBtn = document.getElementById("start");
    this.movesSpan = document.getElementById("moves");
    this.timeSpan = document.getElementById("time");
    this.finalSpan = document.getElementById("final");

    this.startBtn.addEventListener("click", () => this.iniciarJuego());
    this.board.addEventListener("click", (e) => this.mover(e));
  }

  iniciarJuego() {
    this.mezclar();
    this.moves = 0;
    this.time = 0;
    this.updateUI();
    this.finalSpan.textContent = "";
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.time++;
      this.updateUI();
    }, 1000);
  }

  mezclar() {
    let valores = [...Array(15).keys()].map(n => n + 1);
    valores.push(""); // Casilla vacía

    // Mezcla segura (puede mejorarse con un algoritmo que garantice resolubilidad)
    for (let i = valores.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [valores[i], valores[j]] = [valores[j], valores[i]];
    }

    this.tiles.forEach((tile, i) => tile.textContent = valores[i]);
  }

  mover(e) {
    const clicked = e.target;
    if (!clicked.textContent) return;

    const idx = this.tiles.indexOf(clicked);
    const emptyIdx = this.tiles.findIndex(btn => btn.textContent === "");

    const validMoves = [emptyIdx - 1, emptyIdx + 1, emptyIdx - 4, emptyIdx + 4];
    if (this.esMovimientoValido(idx, emptyIdx)) {
      [this.tiles[idx].textContent, this.tiles[emptyIdx].textContent] = [this.tiles[emptyIdx].textContent, this.tiles[idx].textContent];
      this.moves++;
      this.updateUI();

      if (this.verificarGanador()) {
        clearInterval(this.timer);
        this.finalSpan.textContent = `${this.time} segundos y ${this.moves} movimientos.`;
      }
    }
  }

  esMovimientoValido(idx, emptyIdx) {
    const [r1, c1] = [Math.floor(idx / 4), idx % 4];
    const [r2, c2] = [Math.floor(emptyIdx / 4), emptyIdx % 4];
    return (Math.abs(r1 - r2) + Math.abs(c1 - c2)) === 1;
  }

  verificarGanador() {
    for (let i = 0; i < 15; i++) {
      if (this.tiles[i].textContent != i + 1) return false;
    }
    return true;
  }

  updateUI() {
    this.movesSpan.textContent = `Movimientos: ${this.moves}`;
    this.timeSpan.textContent = `Tiempo: ${this.time}`;
  }
}

window.onload = () => new Rompecabezas();
