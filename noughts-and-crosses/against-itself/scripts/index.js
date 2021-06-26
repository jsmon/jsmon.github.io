"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const getSpaceState = (id) => {
    const box = document.querySelector(`[data-index="${id}"]`);
    if (box.innerText === 'o')
        return 'nought';
    if (box.innerText === '×')
        return 'cross';
    return 'empty';
};
const getBoard = () => [
    [
        getSpaceState('00'),
        getSpaceState('01'),
        getSpaceState('02')
    ],
    [
        getSpaceState('10'),
        getSpaceState('11'),
        getSpaceState('12')
    ],
    [
        getSpaceState('20'),
        getSpaceState('21'),
        getSpaceState('22')
    ]
];
const win = (winner) => {
    const messageElement = document.querySelector('#message');
    const additionalInfoElement = document.querySelector('#additional-info');
    if (winner === 'draw') {
        messageElement.innerText = "It's a draw";
        additionalInfoElement.innerText = "At least I didn't lose";
    }
    else {
        messageElement.innerText = `Wow ${winner} won`;
        additionalInfoElement.innerText = 'aka me';
    }
};
const checkForWin = (board = getBoard()) => {
    for (const player of ['nought', 'cross']) {
        if ((board[0][0] === player && board[0][1] === player && board[0][2] === player) ||
            (board[1][0] === player && board[1][1] === player && board[1][2] === player) ||
            (board[2][0] === player && board[2][1] === player && board[2][2] === player) ||
            (board[0][0] === player && board[1][0] === player && board[2][0] === player) ||
            (board[0][1] === player && board[1][1] === player && board[2][1] === player) ||
            (board[0][2] === player && board[1][2] === player && board[2][2] === player) ||
            (board[0][0] === player && board[1][1] === player && board[2][2] === player) ||
            (board[2][0] === player && board[1][1] === player && board[0][2] === player))
            return player;
    }
    if (board.map(column => column.filter(box => box === 'empty').length).every(length => length === 0)) {
        return 'draw';
    }
    return null;
};
const wait = (ms) => new Promise(resolve => {
    setTimeout(resolve, ms);
});
const atLeastTwoOf = (arr, value) => {
    let numberOfOccurrences = 0;
    arr.forEach(item => {
        if (item === value)
            numberOfOccurrences++;
    });
    return numberOfOccurrences >= 2;
};
const checkForPossibleWin = (player, board = getBoard()) => __awaiter(void 0, void 0, void 0, function* () {
    const otherPlayer = player === 'nought' ? 'cross' : 'nought';
    const columns = [
        [board[0][0], board[0][1], board[0][2], 0],
        [board[1][0], board[1][1], board[1][2], 1],
        [board[2][0], board[2][1], board[2][2], 2]
    ];
    for (const column of columns) {
        if (atLeastTwoOf(column, player) && !column.includes(otherPlayer)) {
            const indexOfEmptySpace = column.indexOf('empty');
            if (indexOfEmptySpace !== -1)
                return `${column[3]}${indexOfEmptySpace}`;
        }
    }
    const rows = [
        [board[0][0], board[1][0], board[2][0], 0],
        [board[0][1], board[1][1], board[2][1], 1],
        [board[0][2], board[1][2], board[2][2], 2]
    ];
    for (const row of rows) {
        if (atLeastTwoOf(row, player) && !row.includes(otherPlayer)) {
            const indexOfEmptySpace = row.indexOf('empty');
            if (indexOfEmptySpace !== -1)
                return `${indexOfEmptySpace}${row[3]}`;
        }
    }
    const diagonally = [
        [board[0][0], board[1][1], board[2][2], 0],
        [board[2][0], board[1][1], board[0][2], 1]
    ];
    for (const diagonal of diagonally) {
        if (atLeastTwoOf(diagonal, player) && !diagonal.includes(otherPlayer)) {
            const indexOfEmptySpace = diagonal.indexOf('empty');
            if (indexOfEmptySpace !== -1) {
                if (indexOfEmptySpace === 0) {
                    if (diagonal[3] === 0) {
                        return '00';
                    }
                    else {
                        return '20';
                    }
                }
                else if (indexOfEmptySpace === 2) {
                    if (diagonal[3] === 0) {
                        return '22';
                    }
                    else {
                        return '02';
                    }
                }
                else {
                    return '11';
                }
            }
        }
    }
    return null;
});
const checkForFork = (player, board = getBoard()) => __awaiter(void 0, void 0, void 0, function* () {
    const oneWinningSpace = yield checkForPossibleWin(player, board);
    const otherPlayer = player === 'nought' ? 'cross' : 'nought';
    if (oneWinningSpace) {
        board[parseInt(oneWinningSpace[0])][parseInt(oneWinningSpace[1])] = otherPlayer;
        return Boolean(yield checkForPossibleWin(player, board));
    }
    return false;
});
const getAmountOfForks = (player, board = getBoard()) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield checkForFork(player, board)) {
        let amountOfForks = 1;
        const otherPlayer = player === 'nought' ? 'cross' : 'nought';
        const oneWinningSpace = yield checkForPossibleWin(player, board);
        if (oneWinningSpace) {
            amountOfForks++;
            board[parseInt(oneWinningSpace[0])][parseInt(oneWinningSpace[1])] = otherPlayer;
            return amountOfForks + (yield getAmountOfForks(player, board));
        }
        else
            return 1;
    }
    else
        return 0;
});
const randomise = (values) => {
    let currentIndex = values.length;
    let randomIndex, temporaryValue;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        temporaryValue = values[currentIndex];
        values[currentIndex] = values[randomIndex];
        values[randomIndex] = temporaryValue;
    }
    return values;
};
const playComputer = (player, timeout, board = getBoard()) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const messageElement = document.querySelector('#message');
    const additionalInfoElement = document.querySelector('#additional-info');
    const otherPlayer = player === 'nought' ? 'cross' : 'nought';
    const symbol = player === 'nought' ? 'o' : '×';
    messageElement.innerText = `${player === 'nought' ? 'noughts' : 'crosses'} go`;
    additionalInfoElement.innerText = `Actually I already knew where I was going to go as soon as ${otherPlayer} put their ${otherPlayer} wherever but I have a ${timeout}ms timeout to make this look more realistic`;
    const move = (_a = yield checkForPossibleWin(player)) !== null && _a !== void 0 ? _a : yield checkForPossibleWin(otherPlayer);
    if (move) {
        const box = document.querySelector(`[data-index="${move}"]`);
        ;
        yield wait(timeout);
        box.textContent = symbol;
        return;
    }
    const possibleForks = [];
    for (const [columnNumber, column] of board.entries()) {
        for (const [boxNumber, boxState] of column.entries()) {
            if (boxState !== 'empty')
                continue;
            const newBoard = getBoard();
            newBoard[columnNumber][boxNumber] = player;
            if (yield checkForFork(player, newBoard)) {
                possibleForks.push({
                    columnNumber,
                    boxNumber,
                    forkDepth: yield getAmountOfForks(player, newBoard)
                });
            }
        }
    }
    if (possibleForks.length > 0) {
        const bestFork = possibleForks.sort((a, b) => {
            // Return `-1` to put `a` first, `1` to put `b` first, or `0` if they're the same
            if (a.forkDepth > b.forkDepth)
                return -1;
            if (b.forkDepth > a.forkDepth)
                return 1;
            return 0;
        })[0];
        const box = document.querySelector(`[data-index="${bestFork.columnNumber}${bestFork.boxNumber}"]`);
        yield wait(timeout);
        box.textContent = symbol;
        return;
    }
    const possibleOpponentForks = [];
    for (const [columnNumber, column] of board.entries()) {
        for (const [boxNumber, boxState] of column.entries()) {
            if (boxState !== 'empty')
                continue;
            const newBoard = getBoard();
            newBoard[columnNumber][boxNumber] = player;
            if (yield checkForFork(otherPlayer, newBoard)) {
                possibleOpponentForks.push({
                    columnNumber,
                    boxNumber,
                    forkDepth: yield getAmountOfForks(otherPlayer, newBoard)
                });
            }
        }
    }
    if (possibleOpponentForks.length > 0) {
        const bestFork = possibleOpponentForks.sort((a, b) => {
            // Return `-1` to put `a` first, `1` to put `b` first, or `0` if they're the same
            if (a.forkDepth > b.forkDepth)
                return -1;
            if (b.forkDepth > a.forkDepth)
                return 1;
            return 0;
        })[0];
        const box = document.querySelector(`[data-index="${bestFork.columnNumber}${bestFork.boxNumber}"]`);
        yield wait(timeout);
        box.textContent = symbol;
        return;
    }
    for (const [columnNumber, column] of board.entries()) {
        for (const [boxNumber, boxState] of column.entries()) {
            if (boxState !== 'empty')
                continue;
            const newBoard = getBoard();
            newBoard[columnNumber][boxNumber] = player;
            const possibleWin = yield checkForPossibleWin(player, newBoard);
            if (possibleWin) {
                const possibleOpponentForks = yield getAmountOfForks(otherPlayer, newBoard);
                if (possibleOpponentForks === 0) {
                    const box = document.querySelector(`[data-index="${columnNumber}${boxNumber}"]`);
                    yield wait(timeout);
                    box.textContent = symbol;
                    return;
                }
            }
        }
    }
    if (board[1][1] === 'empty') {
        const box = document.querySelector(`[data-index="11"]`);
        yield wait(timeout);
        box.textContent = symbol;
        return;
    }
    if (board[0][0] === otherPlayer && board[2][2] === 'empty') {
        const box = document.querySelector(`[data-index="22"]`);
        yield wait(timeout);
        box.textContent = symbol;
        return;
    }
    else if (board[2][0] === otherPlayer && board[0][2] === 'empty') {
        const box = document.querySelector(`[data-index="02"]`);
        yield wait(timeout);
        box.textContent = symbol;
        return;
    }
    else if (board[0][2] === otherPlayer && board[2][0] === 'empty') {
        const box = document.querySelector(`[data-index="20"]`);
        yield wait(timeout);
        box.textContent = symbol;
        return;
    }
    else if (board[2][2] === otherPlayer && board[0][0] === 'empty') {
        const box = document.querySelector(`[data-index="00"]`);
        yield wait(timeout);
        box.textContent = symbol;
        return;
    }
    const corners = randomise([
        '00',
        '20',
        '02',
        '22'
    ]);
    if (board[parseInt(corners[0][0])][parseInt(corners[0][1])] === 'empty') {
        const box = document.querySelector(`[data-index="${corners[0]}"]`);
        yield wait(timeout);
        box.textContent = symbol;
        return;
    }
    else if (board[parseInt(corners[1][0])][parseInt(corners[1][1])] === 'empty') {
        const box = document.querySelector(`[data-index="${corners[1]}"]`);
        yield wait(timeout);
        box.textContent = symbol;
        return;
    }
    else if (board[parseInt(corners[2][0])][parseInt(corners[2][1])] === 'empty') {
        const box = document.querySelector(`[data-index="${corners[2]}"]`);
        yield wait(timeout);
        box.textContent = symbol;
        return;
    }
    else if (board[parseInt(corners[3][0])][parseInt(corners[3][1])] === 'empty') {
        const box = document.querySelector(`[data-index="${corners[3]}"]`);
        yield wait(timeout);
        box.textContent = symbol;
        return;
    }
    const middleSides = randomise([
        '01',
        '12',
        '21',
        '10'
    ]);
    if (board[parseInt(middleSides[0][0])][parseInt(middleSides[0][1])] === 'empty') {
        const box = document.querySelector(`[data-index="${middleSides[0]}"]`);
        yield wait(timeout);
        box.textContent = symbol;
        return;
    }
    else if (board[parseInt(middleSides[1][0])][parseInt(middleSides[1][1])] === 'empty') {
        const box = document.querySelector(`[data-index="${middleSides[1]}"]`);
        yield wait(timeout);
        box.textContent = symbol;
        return;
    }
    else if (board[parseInt(middleSides[2][0])][parseInt(middleSides[2][1])] === 'empty') {
        const box = document.querySelector(`[data-index="${middleSides[2]}"]`);
        yield wait(timeout);
        box.textContent = symbol;
        return;
    }
    else if (board[parseInt(middleSides[3][0])][parseInt(middleSides[3][1])] === 'empty') {
        const box = document.querySelector(`[data-index="${middleSides[3]}"]`);
        yield wait(timeout);
        box.textContent = symbol;
        return;
    }
});
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    let winner = checkForWin();
    if (winner) {
        win(winner);
        return;
    }
    yield playComputer('cross', document.querySelector('#speed-slider').valueAsNumber);
    winner = checkForWin();
    if (winner) {
        win(winner);
        return;
    }
    yield playComputer('nought', document.querySelector('#speed-slider').valueAsNumber);
    yield main();
});
window.onload = () => {
    var _a;
    (_a = document.querySelector('#speed-slider')) === null || _a === void 0 ? void 0 : _a.addEventListener('input', () => {
        var _a, _b;
        document.querySelector('#speed-info').innerText = `${((_b = (_a = document.querySelector('#speed-slider')) === null || _a === void 0 ? void 0 : _a.valueAsNumber) !== null && _b !== void 0 ? _b : 0) / 1000} seconds`;
    });
    main();
};
//# sourceMappingURL=index.js.map