  (function (){
  // define main vars
  const size = 4;
  const aim = 2048;
  let field = [];
  let emptyCell = ' ';
  let separator = '|';
  let firstNumber = 2;
  let secondNumber = 2;
  let combinationsFree = [];
  let combinationsUsed = [];
  let sum = 0;

  // prepare game field
  for (i = 0; i < size; i++) {
      for (j = 0; j < size; j++) {

          if (undefined === field[i]) {
              field[i] = [];
          }

          field[i][j] = emptyCell;
          combinationsFree.push(i + separator + j); // 1|3
      }
  }


  // add 2 random cells
  addNewDigit(firstNumber);
  addNewDigit(secondNumber);

  // console.log('start');
  console.log(field);

  // register events on arrows move
  document.body.addEventListener("keydown", refreshField);


  ///////////////////////////// FUNCTIONS //////////////////////////////

  function addNewDigit(number) {
      let cell1 = getRandomCell();
      // console.log(cell1);
      let coords1 = getCoordinates(cell1);
      field[parseInt(coords1[0])][parseInt(coords1[1])] = number;

      let firstCell = document.getElementById(cell1);
      firstCell.innerHTML = number;
      if (firstCell.innerHTML === "2") {
          firstCell.style.backgroundColor = "#dfc899";
      }
      refreshPicture(field);

  }

  function getRandomCell() {
      combinationsFree = getFreeCombinations(combinationsFree, combinationsUsed);

      let num = Math.floor(Math.random() * combinationsFree.length);

      while (combinationsUsed.includes(combinationsFree[num])) {
          num = Math.floor(Math.random() * combinationsFree.length);
      }

      let cell = combinationsFree[num];

      combinationsUsed.push(cell);
      combinationsFree = getFreeCombinations(combinationsFree, combinationsUsed);

      return cell;
  }

  function getCoordinates(cell) {
      return cell.split(separator);
  }

  function getFreeCombinations(allCombination, usedCombination) {
      return allCombination.filter(n => !usedCombination.includes(n));
  }

  function moveCellLeft(cellX, cellY, newField) {
      let double = false;
      let newSeqNum = null;
      let notEmptyCellCount = 0;

      for (let j = 0; j < cellY; j++) {
          // skip if cell is used
          if (newField[cellX][j] !== emptyCell) {
              // notEmptyCellCount++;

              if (newField[cellX][cellY] === newField[cellX][j]) {
                  newField[cellX][j] *= 2;
                  sum += newField[cellX][j];
                  newField[cellX][cellY] = emptyCell;
                  updateCombinations(cellX, cellY, cellX, j);
                  double = true;
                  break;
              }
              continue;

          }

          // save first good cell and skip nothing to compare
          if (newSeqNum === null || newSeqNum > j) {
              newSeqNum = j;
              continue;
          }
      }

      if (double) {
          return newField;
      }

      if (null !== newSeqNum) {
          // change places of cells
          newField[cellX][newSeqNum] = newField[cellX][cellY];

          // update free/used coordinates
          updateCombinations(cellX, cellY, cellX, newSeqNum);

          // make old place empty
          newField[cellX][cellY] = emptyCell;
      }

      return newField;
  }

  function moveCellRight(cellX, cellY, newField) {
      let double = false;
      let newSeqNum = null;
      let notEmptyCellCount = 0;

      for (let j = cellY + 1; j < size; j++) {

          // skip if cell is used
          if (newField[cellX][j] !== emptyCell) {
              notEmptyCellCount++;

              if (notEmptyCellCount < 2 && newField[cellX][cellY] === newField[cellX][j]) {
                  newField[cellX][j] *= 2;
                  sum += newField[cellX][j];
                  newField[cellX][cellY] = emptyCell;
                  updateCombinations(cellX, cellY, cellX, j);
                  double = true;
                  break;
              }
              continue;
          }

          // save first good cell and skip nothing to compare
          if (newSeqNum === null || newSeqNum < j) {
              newSeqNum = j;
              continue;
          }
      }

      if (double) {
          return newField;
      }

      if (newSeqNum !== null) {
          // change places of cells
          newField[cellX][newSeqNum] = newField[cellX][cellY];

          // update free/used coordinates
          updateCombinations(cellX, cellY, cellX, newSeqNum);

          // make old place empty
          newField[cellX][cellY] = emptyCell;
      }

      return newField;
  }

  function moveCellUp(cellX, cellY, newField) {
      let double = false;
      let newSeqNum = null;
      let notEmptyCellCount = 0;

      for (let i = cellX - 1; i >= 0; i--) {

          // skip if cell is used
          if (newField[i][cellY] !== emptyCell) {
              notEmptyCellCount++;

              if (notEmptyCellCount < 2 && newField[cellX][cellY] === newField[i][cellY]) {
                  newField[i][cellY] *= 2;
                  sum += newField[i][cellY];
                  newField[cellX][cellY] = emptyCell;
                  updateCombinations(cellX, cellY, i, cellY);
                  double = true;
                  break;
              }

              continue;
          }

          // save first good cell and skip nothing to compare
          if (newSeqNum === null || newSeqNum > i) {
              newSeqNum = i;
              continue;
          }
      }

      if (double) {
          return newField;
      }

      if (newSeqNum !== null) {
          // change places of cells
          newField[newSeqNum][cellY] = newField[cellX][cellY];

          // update free/used coordinates
          updateCombinations(cellX, cellY, newSeqNum, cellY);

          // make old place empty
          newField[cellX][cellY] = emptyCell;
      }

      return newField;
  }

  function moveCellDown(cellX, cellY, newField) {
      let double = false;
      let newSeqNum = null;
      let notEmptyCellCount = 0;

      for (let i = cellX + 1; i < size; i++) {

          // skip if cell is used
          if (newField[i][cellY] !== emptyCell) {
              notEmptyCellCount++;

              if (notEmptyCellCount < 2 && newField[cellX][cellY] === newField[i][cellY]) {
                  newField[i][cellY] *= 2;
                  sum += newField[i][cellY];
                  newField[cellX][cellY] = emptyCell;
                  updateCombinations(cellX, cellY, i, cellY);
                  double = false;
                  break;
              }

              continue;
          }

          // save first good cell and skip nothing to compare
          if (newSeqNum === null || newSeqNum < i) {
              newSeqNum = i;
              continue;
          }
      }

      if (double) {
          return newField;
      }

      if (newSeqNum !== null) {
          // change places of cells
          newField[newSeqNum][cellY] = newField[cellX][cellY];

          // update free/used coordinates
          updateCombinations(cellX, cellY, newSeqNum, cellY);

          // make old place empty
          newField[cellX][cellY] = emptyCell;
      }

      return newField;
  }

  function updateCombinations(xOld, yOld, xNew, yNew) {
      // remove from used previous values
      combinationsUsed = getFreeCombinations(combinationsUsed, [xOld + separator + yOld]);
      combinationsUsed.push(xNew + separator + yNew);

      // add to free previous values
      combinationsFree.push(xOld + separator + yOld); // 1|3
  }

  function refreshField(event) {

      if (event.code === "ArrowLeft") {

          // move cells
          let newField = field;
          for (i = 0; i < size; i++) {
              for (j = 0; j < size; j++) {

                  if (field[i][j] !== emptyCell) {
                      newField = moveCellLeft(i, j, newField);

                  }
              }
          }
          field = newField;

          refreshPicture(field);

          // create new cell
          addNewDigit(firstNumber);

      } else if (event.code === "ArrowRight") {

          // move cells
          let newField = field;
          for (i = 0; i < size; i++) {
              for (j = size - 1; j >= 0; j--) {

                  if (field[i][j] !== emptyCell) {
                      newField = moveCellRight(i, j, newField);
                  }
              }
          }
          field = newField;

          refreshPicture(field);

          // create new cell
          addNewDigit(firstNumber);

      } else if (event.code === "ArrowUp") {

          // move cells
          let newField = field;
          for (i = 1; i < size; i++) {
              for (j = 0; j < size; j++) {

                  if (field[i][j] !== emptyCell) {
                      newField = moveCellUp(i, j, newField);
                  }
              }
          }
          field = newField;

          refreshPicture(field);

          // create new cell
          addNewDigit(firstNumber);

      } else if (event.code === "ArrowDown") {

          // move cells
          let newField = field;
          for (i = 0; i < size; i++) {
              for (j = size - 1; j >= 0; j--) {

                  if (field[j][i] !== emptyCell) {
                      newField = moveCellDown(j, i, newField);
                  }
              }
          }
          field = newField;

          refreshPicture(field);

          // create new cell
          addNewDigit(firstNumber);
      }

      console.log(field);
  }

  function refreshPicture(field) {
      // let newGameField = document.querySelectorAll(".gameCell");

      for (let i = 0; i < field.length; i++) {
          for (let j = 0; j < field[i].length; j++) {

              let newCell = document.getElementById(`${i}|${j}`);
              newCell.innerHTML = field[i][j];


              if (newCell.innerHTML === "2") {
                  newCell.style.backgroundColor = "#dfc899";
              } else if (newCell.innerHTML === "4") {
                  newCell.style.backgroundColor = "#9fd59f";
              } else if (newCell.innerHTML === "8") {
                  newCell.style.backgroundColor = "#EA9998";
              } else if (newCell.innerHTML === "16") {
                  newCell.style.backgroundColor = "#7dd0e6";
              } else if (newCell.innerHTML === "32") {
                  newCell.style.backgroundColor = "#c89fe3";
              } else if (newCell.innerHTML === "64") {
                  newCell.style.backgroundColor = "#f883dc";
              } else if (newCell.innerHTML === "128") {
                  newCell.style.backgroundColor = "#f3ffcb";
              } else if (newCell.innerHTML === "256") {
                  newCell.style.backgroundColor = "#f69971";
              } else if (newCell.innerHTML === " ") {
                  newCell.style.backgroundColor = "rgb(167, 186, 221)";
              }
          }
      }

      if (combinationsFree.length == 0) {
          document.getElementById('scoreHeader').innerHTML = 'You lose! :(';
      } else {
          if (sum == aim) {
              document.getElementById('scoreHeader').innerHTML = 'You win! :)';
          } else if (sum > aim) {
              document.getElementById('scoreHeader').innerHTML = 'You lose! :(';
          }  else {
              document.getElementById('score').innerText = sum;
          }
      }
  }
})();