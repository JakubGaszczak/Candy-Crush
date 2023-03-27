import "./css/App.css"
import { useEffect, useState } from "react"
import ScoreBoard from "./components/ScoreBoard"

import candy1 from "./assets/candy1.jpg"
import candy2 from "./assets/candy2.jpg"
import candy3 from "./assets/candy3.png"
import candy4 from "./assets/candy4.jpg"
import candy5 from "./assets/candy5.avif"
import candy6 from "./assets/candy6.png"
import blank from "./assets/blank.png"

const width = 8
const candyColors = [
  candy1,
  candy2,
  candy3,
  candy4,
  candy5,
  candy6
]

function App() {
  const [currentColorArrangement, setCurrentColorArrangement] = useState([]) 
  const [squareBeeingDragged, setSquareBeeingDragged] = useState(null)
  const [squareBeeingReplaced, setSquareBeeingReplaced] = useState(null)
  const [scoreDisplay, setScoreDisplay] = useState(0)

  const checkForColumnOfFour = () => {
    for (let i = 0; i < 39; i++) {
      const columnOfFour = [i, i + width, i + 2 * width, i + 3 * width]
      const decidedColor = currentColorArrangement[i] 
      const isBlank = currentColorArrangement[i] === blank

      if (columnOfFour.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
        setScoreDisplay((score) => score + 4)
        columnOfFour.forEach(square => currentColorArrangement[square] = blank)
        return true
      }
    }
  }

  const checkForRowOfFour = () => {
    for (let i = 0; i < 64; i++) {
      const rowOfFour = [i, i + 1, i + 2, i + 3]
      const decidedColor = currentColorArrangement[i] 
      const isBlank = currentColorArrangement[i] === blank
      const notValid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55, 62, 63, 64]

      if (notValid.includes(i)) continue 

      if (rowOfFour.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
        setScoreDisplay((score) => score + 4)
        rowOfFour.forEach(square => currentColorArrangement[square] = blank)
        return true
      }
    }
  }

  const checkForColumnOfThree = () => {
    for (let i = 0; i <= 47; i++) {
      const columnOfThree = [i, i + width, i + 2 * width]
      const decidedColor = currentColorArrangement[i] 
      const isBlank = currentColorArrangement[i] === blank

      if (columnOfThree.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
        setScoreDisplay((score) => score + 3)
        columnOfThree.forEach(square => currentColorArrangement[square] = blank)
        return true
      }
    }
  }


  const checkForRowOfThree = () => {
    for (let i = 0; i < 64; i++) {
      const rowOfThree = [i, i + 1, i + 2]
      const decidedColor = currentColorArrangement[i] 
      const isBlank = currentColorArrangement[i] === blank
      const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64]

      if (notValid.includes(i)) continue 

      if (rowOfThree.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
        setScoreDisplay((score) => score + 3)
        rowOfThree.forEach(square => currentColorArrangement[square] = blank)
        return true
      }
    }
  }

  const moveIntoSquareBelow = () => {
    for (let i = 0; i < 64 - width; i++) {
      const firstRow = [0, 1, 2, 3, 4, 5, 6, 7]
      const isFirstRow = firstRow.includes(i)

      if (isFirstRow && currentColorArrangement[i] === blank) {
        currentColorArrangement[i] = candyColors[Math.floor(Math.random() * candyColors.length)]
      }

      if (currentColorArrangement[i + width] === blank) {
        currentColorArrangement[i + width] = currentColorArrangement[i]
        currentColorArrangement[i] = blank
      }
    }
  }

  const dragStart = (e) => {
    setSquareBeeingDragged(e.target)
  }

  const dragDrop= (e) => {
    setSquareBeeingReplaced(e.target)
  }

  const dragEnd = (e) => {
    const squareBeeingDraggedId = parseInt(squareBeeingDragged.getAttribute("data-id"))
    const squareBeeingReplacedId = parseInt(squareBeeingReplaced.getAttribute("data-id"))

    currentColorArrangement[squareBeeingReplacedId] = squareBeeingDragged.getAttribute('src')
    currentColorArrangement[squareBeeingDraggedId] = squareBeeingReplaced.getAttribute('src')

    const validMoves = [
      squareBeeingDraggedId - 1,
      squareBeeingDraggedId - width,
      squareBeeingDraggedId + 1,
      squareBeeingDraggedId + width,
    ]

    const validMove = validMoves.includes(squareBeeingReplaced)

    const isAColumnOfFour = checkForColumnOfFour()
    const isARowOfFour = checkForRowOfFour()
    const isAColumnOfThree = checkForColumnOfThree()
    const isARowOfThree = checkForRowOfThree()

    if (squareBeeingReplacedId && 
      validMove && 
      (isARowOfFour || isAColumnOfFour || isAColumnOfThree || isARowOfThree)) {
        setSquareBeeingDragged(null)
        setSquareBeeingReplaced(null)
    } else {
        currentColorArrangement[squareBeeingReplacedId] = squareBeeingReplaced.getAttribute('src')
        currentColorArrangement[squareBeeingDraggedId] = squareBeeingDragged.getAttribute('src')
        setCurrentColorArrangement([...currentColorArrangement])
    }
  }

  const createBoard = () => {
    const randomColorArrangment = []
    for (let i = 0; i < width * width; i++) {
      let randomColor = candyColors[Math.floor(Math.random() * candyColors.length)]
      randomColorArrangment.push(randomColor)
  }
  setCurrentColorArrangement(randomColorArrangment)
} 

useEffect(() => {
  createBoard()
}, [])

useEffect(() => {
  const timer = setInterval(() => {
    checkForColumnOfFour()
    checkForColumnOfThree()
    checkForRowOfFour()
    checkForRowOfThree()
    moveIntoSquareBelow()
    setCurrentColorArrangement([...currentColorArrangement])
  }, 100)
  return () => clearInterval(timer)

}, [checkForColumnOfFour, checkForRowOfFour, checkForRowOfThree, checkForColumnOfThree, moveIntoSquareBelow, currentColorArrangement])



  return (
    <div className="app">
      <div className="game">
        {currentColorArrangement.map((candyColor, index) => (
          <img
            key={index}
            src={candyColor}
            alt={candyColor}
            data-id={index}
            draggable={true}
            onDragStart={dragStart}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={(e) => e.preventDefault()}
            onDragLeave={(e) => e.preventDefault()}
            onDrop={dragDrop}
            onDragEnd={dragEnd}
          ></img>
        ))}
      </div>
      <ScoreBoard score={scoreDisplay} />
    </div>
  );
}

export default App;
