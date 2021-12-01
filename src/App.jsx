import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [alphabet, setAlphabet] = useState([
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ]);

  let gridSize = 10;
  const [gridArray, setGridArray] = useState(
    Array.from({ length: gridSize }, () =>
      Array.from({ length: gridSize }, () => " ")
    )
  );
  const [globalMouseDown, setGlobablMouseDown] = useState(null);
  const [allValues, setAllValues] = useState({ letters: [], coordinates: [] });
  const [currentValues, setCurrentValues] = useState({
    letters: [],
    coordinates: [],
  });

  useEffect(() => {
    console.log(currentValues.coordinates);
  }, [currentValues]);

  useEffect(() => {
    addWords();
    fillGrid();
  }, []);
  useEffect(() => {
    const onMouseDown = (event) => setGlobablMouseDown(true);
    window.addEventListener("mousedown", onMouseDown);
    return () => {
      window.removeEventListener("mousedown", onMouseDown);
    };
  }, []);

  useEffect(() => {
    const onMouseUp = (event) => {
      setGlobablMouseDown(false);
      setCurrentValues((prevState) => ({
        ...prevState,
        coordinates: [],
      }));
    };
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mouseup", onMouseUp);
    };
  });

  function setArrays(column, row) {
    setAllValues((prevState) => ({
      ...prevState,
      coordinates: [...prevState.coordinates, [column, row]],
    }));
    setCurrentValues((prevState) => ({
      ...prevState,
      coordinates: [...prevState.coordinates, [column, row]],
    }));
  }
  function isAround(column, row, arr) {
    let positions = [
      [0, 1],
      [1, 0],
      [1, 1],
      [-1, -1],
      [0, -1],
      [-1, 0],
      [-1, 1],
      [1, -1],
    ];
    let columnTest = column - arr[arr.length - 1][0];
    let rowTest = row - arr[arr.length - 1][1];
    let tester = [columnTest, rowTest];
    return positions.some((a) => tester.every((v, i) => v === a[i]));
  }

  function compare(column, row) {
    var arrayLength = currentValues.coordinates.length;
    let requiredDirection = [
      currentValues.coordinates[1][0] - currentValues.coordinates[0][0],
      currentValues.coordinates[1][1] - currentValues.coordinates[0][1],
    ];
    let nextDirection = [
      column - currentValues.coordinates[arrayLength - 1][0],
      row - currentValues.coordinates[arrayLength - 1][1],
    ];
    return (
      nextDirection[0] === requiredDirection[0] &&
      nextDirection[1] === requiredDirection[1]
    );
  }

  function fillGrid() {
    //On load fill grid with random letters
    const newArr = [...gridArray];
    newArr.map((item, column) =>
      item.map((box, row) => {
        if (newArr[column][row] === " ") {
          newArr[column][row] = alphabet[Math.floor(Math.random() * 25)];
          setGridArray(newArr);
        }
      })
    );
  }

  function addWords() {
    let words = [
      "potato",
      "cat",
      "house",
      "mail",
      "hunter",
      "ape",
      "orange",
      "pear",
    ];

    words.map((word) => {
      let cells = setSuitableWordPlacement(word);
      const newArr = [...gridArray];
      cells.map((cell, i) => {
        newArr[cell[0]][cell[1]] = word[i].toUpperCase();
        setGridArray(newArr);
      });
    });
  }

  function setSuitableWordPlacement(word) {
    let positions = [
      [0, 1],
      [1, 0],
      [1, 1],
      [-1, -1],
      [0, -1],
      [-1, 0],
      [-1, 1],
      [1, -1],
    ];
    let choosenDirection =
      positions[Math.floor(Math.random() * positions.length)];
    let startingPosition = [
      calculateStartPoint(choosenDirection[0], word.length),
      calculateStartPoint(choosenDirection[1], word.length),
    ];
    let lengthMatches = 0;
    let currentPosition = startingPosition;
    let availableCells = [];

    for (let i = 0; i < word.length; i++) {
      if (
        gridArray[currentPosition[0]][currentPosition[1]] === " " ||
        gridArray[currentPosition[0]][currentPosition[1]] === word[i]
      ) {
        lengthMatches++;
        console.log();
        availableCells.push(currentPosition);
        currentPosition = [
          choosenDirection[0] + currentPosition[0],
          choosenDirection[1] + currentPosition[1],
        ];
      } else {
        break;
      }
    }
    if (lengthMatches === word.length) {
      return availableCells;
    } else {
      return setSuitableWordPlacement(word);
    }
  }
  function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  function calculateStartPoint(value, wordLength) {
    let highestValue = 9 - wordLength;
    switch (value) {
      case 0:
        return randomIntFromInterval(0, 9);
      case 1:
        return randomIntFromInterval(0, highestValue);
      case -1:
        return randomIntFromInterval(wordLength, 9);
    }
  }

  return (
    <>
      <button onClick={() => addWords()}>test</button>
      <div className="grid">
        {gridArray.map((item, row) =>
          item.map((box, column) => (
            <div
              style={{
                backgroundColor: currentValues.coordinates.some((a) =>
                  [column, row].every((v, i) => v === a[i])
                )
                  ? "red"
                  : "blue",
              }}
              className="box unselectable"
              onMouseDown={() => {
                setArrays(column, row);
              }}
              onMouseEnter={() => {
                var arrayLength = currentValues.coordinates.length;
                if (currentValues.coordinates < 1 && globalMouseDown === true) {
                  //Stops the website erroring if the user starts there click outside of the grid
                  setArrays(column, row);
                } else if (globalMouseDown === true) {
                  if (isAround(column, row, currentValues.coordinates))
                    if (currentValues.coordinates.length > 1) {
                      if (
                        column ===
                          currentValues.coordinates[arrayLength - 2][0] &&
                        row === currentValues.coordinates[arrayLength - 2][1]
                      ) {
                        //delete the previous input
                        let arrLastRemoved = [...currentValues.coordinates];
                        arrLastRemoved.pop();
                        setCurrentValues((prevState) => ({
                          ...prevState,
                          coordinates: [...arrLastRemoved],
                        }));
                      } else {
                        if (compare(column, row)) {
                          setArrays(column, row);
                        }
                      }
                    } else {
                      setArrays(column, row);
                    }
                }
              }}
            >
              {box}
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default App;
