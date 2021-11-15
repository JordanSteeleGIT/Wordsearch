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
  const [gridArray, setGridArray] = useState(
    Array.from({ length: 10 }, () => Array.from({ length: 10 }, () => 0))
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
    //On load fill grid with random letters
    const newArr = [...gridArray];
    newArr.map((item, column) =>
      item.map((box, row) => {
        newArr[column][row] = alphabet[Math.floor(Math.random() * 25)];
        setGridArray(newArr);
      })
    );
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

  return (
    <>
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
                if (globalMouseDown === true) {
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
                      let requiredDirection = [
                        currentValues.coordinates[1][0] -
                          currentValues.coordinates[0][0],
                        currentValues.coordinates[1][1] -
                          currentValues.coordinates[0][1],
                      ];
                      let nextDirection = [
                        column - currentValues.coordinates[arrayLength - 1][0],
                        row - currentValues.coordinates[arrayLength - 1][1],
                      ];
                      if (
                        nextDirection[0] === requiredDirection[0] &&
                        nextDirection[1] === requiredDirection[1]
                      ) {
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
