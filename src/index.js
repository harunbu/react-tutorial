import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className={props.isWinner ? 'square winner' : 'square'} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={i}
        value={this.props.squares[i].value}
        isWinner={this.props.squares[i].isWinner}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    const board = [];
    for (let row = 0; row < 3; row ++) {
      const boardRow = [];
      for (let col = 0; col < 3; col ++) {
        boardRow.push(this.renderSquare(row * 3 + col));
      }
      board.push(<div key={row} className="board-row">{boardRow}</div>);
    }
    return board;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill({value: null, isWinner: false}),
        point: {
          col: null,
          row: null,
        },
        move: 0,
      }],
      historyOrderIsAsc: true,
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const winner = calculateWinner(squares);
    if (winner || squares[i].value) {
      return;
    }
    squares[i] = {
      value: this.state.xIsNext ? 'X' : 'O',
      isWinner: false,
    };

    const winnerAfterSet = calculateWinner(squares);
    if (winnerAfterSet) {
      for (let j = 0; j < 9; j ++) {
        squares[j] = {
          value: squares[j].value,
          isWinner: winnerAfterSet.nums.includes(j),
        };
      }
    }

    this.setState({
      history: history.concat([{
        squares: squares,
        point: {
          col: i % 3,
          row: Math.floor(i / 3),
        },
        move: history.length,
      }]),
      historyOrderIsAsc: true,
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  reverseMove() {
    this.setState({
      historyOrderIsAsc: ! this.state.historyOrderIsAsc,
    });
  }

  render() {
    const history = this.state.history.slice();
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    if (! this.state.historyOrderIsAsc) {
      history.reverse();
    }

    const moves = history.map((step, move) => {
      const desc = step.move ?
        'Go to move #' + step.move + '(' + step.point.col + ', ' + step.point.row + ')':
        'Go to game start';
      const strongText = (step.move === this.state.stepNumber) ? <b>{desc}</b> : desc;
      return (
        <li key={step.move}>
          <button onClick={() => this.jumpTo(step.move)}>
            {strongText}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner.value;
    } else if (this.state.stepNumber === 9) {
      status = 'Draw';
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.reverseMove()}>reverse</button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

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
    if (squares[a].value && squares[a].value === squares[b].value && squares[a].value === squares[c].value) {
      return {
        value: squares[a].value,
        nums: [a, b, c],
      };
    }
  }
  return null;
}
