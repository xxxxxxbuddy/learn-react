import React from 'react';
import './App.css';

/** 类组件 */
// class Square extends React.Component {
//   render () {
//       return (
//           <button 
//             className="square"
//             onClick={() => this.props.onClick()}
//           >
//             {this.props.value}
//           </button>
//       )
//   }
// }

/**当组件中只包含一个render方法，并且不包含state，那么使用函数组件会更简单 */
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {

  renderSquare(i) {
      return ( 
      <Square 
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
      );
  }
  
  render () {
    
      return (
          Array(3).fill(null).map((itemx, x) => (
            <div className="board-row" key={x}>
              {Array(3).fill(null).map((itemy, y) => (
                this.renderSquare(3 * x + y)
              ))}
            </div>
          ))
      )
  }
}

class Game extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        curPos: {
          x: null,
          y: null
        }
      }],
      stepNumber: 0,
      xIsNext: true
    };
  }
  
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if(calculateWinner(squares) || squares[i]) return;
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        curPos: {
          x: Math.floor(i / 3) + 1,
          y: i % 3 + 1
        }
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
    
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        `Go to move #${move} (${step.curPos.x}行，${step.curPos.y}列)`:
        'Go to game start';
      return (
        <li key={move}>
          <button className={this.state.stepNumber === move ? 'cur-step' : ''} onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
    
    let status;
    if(winner) {
      status = 'Winner: ' + winner;
    } else {
      status = "Next Player: " + (this.state.xIsNext ? 'X' : 'O');
    }

      return (
      <div className="game">
          <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={i => this.handleClick(i)}
          />
          </div>
          <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
          </div>
      </div>
      );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default Game;
