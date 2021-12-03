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

  let words = [
    "CARROT",
    "POTATO",
    "LEMON",
    "BANANA",
    "CHICKEN",
    "BEEF",
    "TOMATO",
    "PEAR",
  ];
  let colors = [
    "#FF6633",
    "#FFB399",
    "#FF33FF",
    "#FFFF99",
    "#00B3E6",
    "#E6B333",
    "#3366E6",
    "#999966",
    "#99FF99",
    "#B34D4D",
    "#80B300",
    "#809900",
    "#E6B3B3",
    "#6680B3",
    "#66991A",
    "#FF99E6",
    "#CCFF1A",
    "#FF1A66",
    "#E6331A",
    "#33FFCC",
    "#66994D",
    "#B366CC",
    "#4D8000",
    "#B33300",
    "#CC80CC",
    "#66664D",
    "#991AFF",
    "#E666FF",
    "#4DB3FF",
    "#1AB399",
    "#E666B3",
    "#33991A",
    "#CC9999",
    "#B3B31A",
    "#00E680",
    "#4D8066",
    "#809980",
    "#E6FF80",
    "#1AFF33",
    "#999933",
    "#FF3380",
    "#CCCC00",
    "#66E64D",
    "#4D80CC",
    "#9900B3",
    "#E64D66",
    "#4DB380",
    "#FF4D4D",
    "#99E6E6",
    "#6666FF",
  ];

  let gridSize = 10;
  const [gridArray, setGridArray] = useState(
    Array.from({ length: gridSize }, () =>
      Array.from({ length: gridSize }, () => [" ", "red"])
    )
  );
  const [globalMouseDown, setGlobablMouseDown] = useState(null);
  const [allValues, setAllValues] = useState({
    letters: [],
    coordinates: [],
  });
  const [currentValues, setCurrentValues] = useState({
    letters: [],
    coordinates: [],
  });
  const [color, setColor] = useState("red");

  useEffect(() => {
    addWords();
    fillGrid();
  }, []);
  useEffect(() => {
    const onMouseDown = (event) => {
      setGlobablMouseDown(true);
    };
    window.addEventListener("mousedown", onMouseDown);
    return () => {
      window.removeEventListener("mousedown", onMouseDown);
    };
  }, []);

  useEffect(() => {
    const onMouseUp = (event) => {
      setColor(colors[randomIntFromInterval(0, colors.length)]);
      setGlobablMouseDown(false);
      setCurrentValues((prevState) => ({
        letters: [],
        coordinates: [],
      }));
    };
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mouseup", onMouseUp);
    };
  });

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
    let newColumn = column - arr[arr.length - 1][0];
    let newRow = row - arr[arr.length - 1][1];
    let newCoordinates = [newColumn, newRow];
    return positions.some((a) => newCoordinates.every((v, i) => v === a[i]));
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
        if (newArr[column][row][0] === " ") {
          newArr[column][row][0] = alphabet[Math.floor(Math.random() * 25)];
          setGridArray(newArr);
        }
      })
    );
  }

  function addWords() {
    words.map((word) => {
      let cells = setSuitableWordPlacement(word);
      const newArr = [...gridArray];
      cells.map((cell, i) => {
        newArr[cell[0]][cell[1]][0] = word[i];
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
        gridArray[currentPosition[0]][currentPosition[1]][0] === " " ||
        gridArray[currentPosition[0]][currentPosition[1]][0] === word[i]
      ) {
        lengthMatches++;

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

  function setCurrentValuesArray(column, row, letter) {
    changeColor(column, row);
    setCurrentValues((prevState) => ({
      letters: [...prevState.letters, [letter]],
      coordinates: [...prevState.coordinates, [column, row]],
    }));
    console.log(column, row);
  }

  function setAllValuesArray(letter, coordinates) {
    setAllValues((prevState) => ({
      letters: [...prevState.letters, [letter]],
      coordinates: [...prevState.coordinates, coordinates],
    }));
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

  function changeColor(col, row) {
    const newArr = [...gridArray];
    newArr[col][row][1] = color;
    setGridArray(newArr);
  }
  useEffect(() => {
    let arrJoined = currentValues.letters.join("");
    const test = words.find((e) => e === arrJoined);
    if (test !== undefined) {
      setAllValuesArray(arrJoined, currentValues.coordinates);
    }
  }, [currentValues.letters]);

  return (
    <>
      <div className="grid">
        {gridArray.map((item, column) =>
          item.map((box, row) => (
            <div
              style={{
                backgroundColor:
                  currentValues.coordinates.some((a) =>
                    [column, row].every((v, i) => v === a[i])
                  ) ||
                  allValues.coordinates
                    .flat(1)
                    .some((a) => [column, row].every((v, i) => v === a[i]))
                    ? `${box[1]}`
                    : "blue",
              }}
              className="box unselectable"
              onMouseDown={() => {
                setCurrentValuesArray(column, row, box[0]);
              }}
              onMouseEnter={() => {
                var arrayLength = currentValues.coordinates.length;
                if (currentValues.coordinates < 1 && globalMouseDown === true) {
                  //Stops the website erroring if the user starts there click outside of the grid
                  setCurrentValuesArray(column, row, box[0]);
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
                          setCurrentValuesArray(column, row, box[0]);
                        }
                      }
                    } else {
                      setCurrentValuesArray(column, row, box[0]);
                    }
                }
              }}
            >
              {box[0]}
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default App;
