(function() {
  const columnsCount = Number(document.querySelector('#columns').value);
  const rowsCount = Number(document.querySelector('#rows').value);
  const heddlesCount = Number(document.querySelector('#heddles').value);
  const pedalsCount = Number(document.querySelector('#pedals').value);

  const loomElement = document.querySelector('.loom');
  loomElement.style.setProperty('grid-template-columns', `${columnsCount}fr ${pedalsCount}fr`);

  const heddlesElement = document.querySelector('.loom__heddles');
  heddlesElement.style.setProperty('grid-template-rows', `repeat(${heddlesCount}, 1fr)`);
  heddlesElement.addEventListener('click', toggleSquare);

  const pedalsElement = document.querySelector('.loom__pedals');
  pedalsElement.style.setProperty('grid-template-columns', `repeat(${pedalsCount}, 1fr)`);
  pedalsElement.addEventListener('click', toggleSquare);

  const patternElement = document.querySelector('.loom__pattern');
  patternElement.style.setProperty('grid-template-rows', `repeat(${heddlesCount}, 1fr)`);
  patternElement.addEventListener('click', toggleSquare);

  const gridElement = document.querySelector('.loom__grid');
  gridElement.style.setProperty('grid-template-columns', `repeat(${rowsCount}, 1fr)`);

  // create squre prefab, render with squareElement.cloneNode(true)
  const squareElement = document.createElement('div');
  squareElement.classList.add('square', 'square-input', 'false');

  const gridSquareElement = document.createElement('div');
  gridSquareElement.classList.add('square', 'false');

  const pedalsArray = Array(columnsCount);
  const heddlesArray = Array(rowsCount);
  const patternArray = Array(pedalsCount);
  const gridArray = Array(rowsCount);

  function init() {
    // initialize heddles squares  
    for (let i = 0; i < rowsCount; i++) {
      heddlesArray[i] = Array(heddlesCount).fill(false);
    }
  
    for (let i = 0; i < heddlesArray.length; i++) {
      for (let j = 0; j < heddlesArray[i].length; j++) {
        const square = squareElement.cloneNode(true);
        square.dataset.x = i;
        square.dataset.y = j;
        square.dataset.grid = 'heddles';
        heddlesElement.appendChild(square);
      }
    }
  
    // initialize pattern squares
  
    for (let i = 0; i < pedalsCount; i++) {
      patternArray[i] = Array(heddlesCount).fill(false);
    }
  
    for (let i = 0; i < patternArray.length; i++) {
      for (let j = 0; j < patternArray[i].length; j++) {
        const square = squareElement.cloneNode(true);
        square.dataset.x = i;
        square.dataset.y = j;
        square.dataset.grid = 'pattern';
        patternElement.appendChild(square);
      }
    }
  
    // initialize loom grid squares  
    for (let i = 0; i < rowsCount; i++) {
      gridArray[i] = Array(columnsCount).fill(false);
    }
  
    for (let i = 0; i < gridArray.length; i++) {
      for (let j = 0; j < gridArray[i].length; j++) {
        const square = gridSquareElement.cloneNode(true);
        square.dataset.x = i;
        square.dataset.y = j;
        square.dataset.grid = 'grid';
        gridElement.appendChild(square);
      }
    }
  
    // initialize pedals squares  
    for (let i = 0; i < columnsCount; i++) {
      pedalsArray[i] = Array(pedalsCount).fill(false);
    }
  
    for (let i = 0; i < pedalsArray.length; i++) {
      for (let j = 0; j < pedalsArray[i].length; j++) {
        const square = squareElement.cloneNode(true);
        square.dataset.x = i;
        square.dataset.y = j;
        square.dataset.grid = 'pedals';
        pedalsElement.appendChild(square);
      }
    }
  }

  function setSquareClasses(square, state = null) {
    if (state !== null) {
      square.classList.remove('false');
      square.classList.remove('true');
      if (state) {
        square.classList.add('true');
      } else {
        square.classList.add('false');
      }
    } else {
      square.classList.toggle('false');
      square.classList.toggle('true');
    }
  }

  function renderSideGrid(e, array) {
    const square = e.target;
    const grid = square.dataset.grid;
    const x = square.dataset.x;
    const y = square.dataset.y;

    if (grid === 'heddles' && !array[x][y] && array[x].includes(true)) {
      activeSquareIndex = array[x].indexOf(true);
      array[x][activeSquareIndex] = false;
      const activeSquareElement = document.querySelector(`[data-grid="${grid}"][data-x="${x}"][data-y="${activeSquareIndex}"]`);
      setSquareClasses(activeSquareElement);
    }
    array[x][y] = !array[x][y];
    setSquareClasses(square);
  }

  function calculateSquare(x, y) {
    for (let i = 0; i < pedalsCount; i++) {
      for (let j = 0; j < heddlesCount; j++) {
        if (pedalsArray[x][i] && (heddlesArray[y][j] && !patternArray[i][j])) {
          return true;
        }
      }
    }
    return false;
  }

  function renderMainGrid() {
    console.log('gridArray', gridArray);
    for (let x = 0; x < rowsCount; x++) {
      for (let y = 0; y < columnsCount; y++) {
        const square = document.querySelector(`[data-grid="grid"][data-x="${x}"][data-y="${y}"]`);
        if (pedalsArray[x].includes(true) && heddlesArray[y].includes(true)) {
          squareState = calculateSquare(x, y);
          gridArray[x][y] = squareState;
          setSquareClasses(square, squareState);
        } else {
          gridArray[x][y] = false;
          setSquareClasses(square, false);
        }
      }
    }
  }

  // click event handler for heddle, pedal and pattern squares
  function toggleSquare(e) {
    if (e.target.classList.contains('square')) {
      const square = e.target;
      const grid = square.dataset.grid;
      const x = square.dataset.x;
      const y = square.dataset.y;

      // Update side grid arrays and classes
      switch (square.dataset.grid) {
        case 'heddles':
          renderSideGrid(e, heddlesArray);
          break;

        case 'pedals':
          renderSideGrid(e, pedalsArray);
          break;

        case 'pattern':
          patternArray[x][y] = !patternArray[x][y];
          setSquareClasses(square);
          break;

        default:
          break;
      }

      renderMainGrid();
    }
  }

  init();

})();
