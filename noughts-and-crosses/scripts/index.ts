const getSpaceState = (id: `${number}${number}`) => {
    const box: HTMLDivElement = document.querySelector(`[data-index="${id}"]`)!;

    if (box.innerText === 'o') return 'nought';
    if (box.innerText === '×') return 'cross';
    return 'empty';
};

const getBoard = (): ('nought' | 'cross' | 'empty')[][] => [
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

const win = (winner: 'nought' | 'cross' | 'draw') => {
    const boxes: NodeListOf<HTMLDivElement> = document.querySelectorAll('.box');

    boxes.forEach(box => {
        box.removeEventListener('click', boxClickEventListener);
    });

    const messageElement = document.querySelector<HTMLParagraphElement>('#message')!;
    const additionalInfoElement = document.querySelector<HTMLParagraphElement>('#additional-info')!;

    if (winner === 'draw') {
        messageElement.innerText = "It's a draw";
        additionalInfoElement.innerText = "At least I didn't lose";
    } else if (winner === 'nought') {
        messageElement.innerText = 'Yay I win';
    } else {
        messageElement.innerText = 'Well done you won!';
        additionalInfoElement.innerText = "wait isn't that meant to be impossible";
    }
    return;
};

const checkForWin = (board = getBoard()) => {
    for (const player of (<['nought', 'cross']>['nought', 'cross'])) {
        if (
            (board[0][0] === player && board[0][1] === player && board[0][2] === player) ||
            (board[1][0] === player && board[1][1] === player && board[1][2] === player) ||
            (board[2][0] === player && board[2][1] === player && board[2][2] === player) ||
            (board[0][0] === player && board[1][0] === player && board[2][0] === player) ||
            (board[0][1] === player && board[1][1] === player && board[2][1] === player) ||
            (board[0][2] === player && board[1][2] === player && board[2][2] === player) ||
            (board[0][0] === player && board[1][1] === player && board[2][2] === player) ||
            (board[2][0] === player && board[1][1] === player && board[0][2] === player)
        ) return player;
    }

    if (board.map(column => column.filter(box => box === 'empty').length).every(length => length === 0)) {
        return 'draw';
    }

    return null;
};

const boxClickEventListener = async (e: MouseEvent) => {
    const box = <HTMLDivElement>e.target!;
    box.innerText = '×';

    let winner: 'nought' | 'cross' | 'draw' | null = checkForWin();

    if (winner) {
        win(winner);
        return;
    }

    const boxes: NodeListOf<HTMLDivElement> = document.querySelectorAll('.box');

    for (const box of boxes) {
        box.removeEventListener('click', boxClickEventListener);
    }

    await playComputer();

    const messageElement = document.querySelector<HTMLParagraphElement>('#message')!;
    const additionalInfoElement = document.querySelector<HTMLParagraphElement>('#additional-info')!;

    messageElement.innerText = 'Your go';
    additionalInfoElement.innerText = '';
    

    winner = checkForWin();

    if (winner) {
        win(winner);
        return;
    }

    box.removeEventListener('click', boxClickEventListener);
    
    const board = getBoard();

    boxes.forEach(box => {
        const boxId = box.dataset.index!;

        if (board[parseInt(boxId[0])][parseInt(boxId[1])] === 'empty') {
            box.addEventListener('click', boxClickEventListener);
        }
    });
};

const wait = (ms: number): Promise<void> => new Promise(resolve => {
    setTimeout(resolve, ms);
});

const atLeastTwoOf = (arr: unknown[], value: unknown) => {
    let numberOfOccurrences = 0;

    arr.forEach(item => {
        if (item === value) numberOfOccurrences++;
    });

    return numberOfOccurrences >= 2;
};

const checkForPossibleWin = async (player: 'nought' | 'cross', board = getBoard()): Promise<`${number}${number}` | null> => {
    const otherPlayer = player === 'nought' ? 'cross' : 'nought';

    const columns: ['nought' | 'cross' | 'empty', 'nought' | 'cross' | 'empty', 'nought' | 'cross' | 'empty', number][] = [
        [board[0][0], board[0][1], board[0][2], 0],
        [board[1][0], board[1][1], board[1][2], 1],
        [board[2][0], board[2][1], board[2][2], 2]
    ];
    for (const column of columns) {
        if (atLeastTwoOf(column, player) && !column.includes(otherPlayer)) {
            const indexOfEmptySpace = column.indexOf('empty');

            if (indexOfEmptySpace !== -1) return `${column[3]}${indexOfEmptySpace}`;
        }
    }

    const rows: ['nought' | 'cross' | 'empty', 'nought' | 'cross' | 'empty', 'nought' | 'cross' | 'empty', number][] = [
        [board[0][0], board[1][0], board[2][0], 0],
        [board[0][1], board[1][1], board[2][1], 1],
        [board[0][2], board[1][2], board[2][2], 2]
    ];
    for (const row of rows) {
        if (atLeastTwoOf(row, player) && !row.includes(otherPlayer)) {
            const indexOfEmptySpace = row.indexOf('empty');

            if (indexOfEmptySpace !== -1) return `${indexOfEmptySpace}${row[3]}`;
        }
    }

    const diagonally: ['nought' | 'cross' | 'empty', 'nought' | 'cross' | 'empty', 'nought' | 'cross' | 'empty', number][] = [
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
                    } else {
                        return '20';
                    }
                } else if (indexOfEmptySpace === 2) {
                    if (diagonal[3] === 0) {
                        return '22';
                    } else {
                        return '02';
                    }
                } else {
                    return '11';
                }
            }
        }
    }

    return null;
};

const checkForFork = async (player: 'nought' | 'cross', board = getBoard()) => {
    const oneWinningSpace = await checkForPossibleWin(player, board);

    const otherPlayer = player === 'nought' ? 'cross' : 'nought';

    if (oneWinningSpace) {
        board[parseInt(oneWinningSpace[0])][parseInt(oneWinningSpace[1])] = otherPlayer;
        return Boolean(await checkForPossibleWin(player, board));
    }
    return false;
};

const getAmountOfForks = async (player: 'nought' | 'cross', board = getBoard()): Promise<number> => {
    if (await checkForFork(player, board)) {
        let amountOfForks = 1;

        const otherPlayer = player === 'nought' ? 'cross' : 'nought';

        const oneWinningSpace = await checkForPossibleWin(player, board);

        if (oneWinningSpace) {
            amountOfForks++;

            board[parseInt(oneWinningSpace[0])][parseInt(oneWinningSpace[1])] = otherPlayer;

            return amountOfForks + await getAmountOfForks(player, board);
        } else return 1;
    } else return 0;
};

const randomise = <T>(values: T[]) => {
    let currentIndex = values.length;
    let randomIndex: number, temporaryValue: T;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        temporaryValue = values[currentIndex];
        values[currentIndex] = values[randomIndex];
        values[randomIndex] = temporaryValue;
    }

    return values;
};

const playComputer = async (board = getBoard()) => {
    const messageElement = document.querySelector<HTMLParagraphElement>('#message')!;
    const additionalInfoElement = document.querySelector<HTMLParagraphElement>('#additional-info')!;

    messageElement.innerText = 'My go';
    additionalInfoElement.innerText = 'Actually I already knew where I was going to go as soon as you put your cross wherever but I have a 500ms timeout to make this look more realistic';
    
    const move = await checkForPossibleWin('nought') ?? await checkForPossibleWin('cross');

    if (move) {
        const box: HTMLDivElement = document.querySelector(`[data-index="${move}"]`)!;
        box.removeEventListener('click', boxClickEventListener);

        await wait(500);
        box.textContent = 'o';

        return;
    }

    const possibleForks: {
        columnNumber: number;
        boxNumber: number;
        forkDepth: number;
    }[] = [];

    for (const [columnNumber, column] of board.entries()) {
        for (const [boxNumber, boxState] of column.entries()) {
            if (boxState !== 'empty') continue;

            const newBoard = getBoard();
            newBoard[columnNumber][boxNumber] = 'nought';

            if (await checkForFork('nought', newBoard)) {
                possibleForks.push({
                    columnNumber,
                    boxNumber,
                    forkDepth: await getAmountOfForks('nought', newBoard)
                });
            }
        }
    }

    if (possibleForks.length > 0) {
        const bestFork = possibleForks.sort((a, b) => {
            // Return `-1` to put `a` first, `1` to put `b` first, or `0` if they're the same
            if (a.forkDepth > b.forkDepth) return -1;
            if (b.forkDepth > a.forkDepth) return 1;
            return 0;
        })[0];

        const box: HTMLDivElement = document.querySelector(`[data-index="${bestFork.columnNumber}${bestFork.boxNumber}"]`)!;
        box.removeEventListener('click', boxClickEventListener);

        await wait(500);
        box.textContent = 'o';

        return;
    }

    const possibleOpponentForks: {
        columnNumber: number;
        boxNumber: number;
        forkDepth: number;
    }[] = [];

    for (const [columnNumber, column] of board.entries()) {
        for (const [boxNumber, boxState] of column.entries()) {
            if (boxState !== 'empty') continue;

            const newBoard = getBoard();
            newBoard[columnNumber][boxNumber] = 'nought';

            if (await checkForFork('cross', newBoard)) {
                possibleOpponentForks.push({
                    columnNumber,
                    boxNumber,
                    forkDepth: await getAmountOfForks('cross', newBoard)
                });
            }
        }
    }

    if (possibleOpponentForks.length > 0) {
        const bestFork = possibleOpponentForks.sort((a, b) => {
            // Return `-1` to put `a` first, `1` to put `b` first, or `0` if they're the same
            if (a.forkDepth > b.forkDepth) return -1;
            if (b.forkDepth > a.forkDepth) return 1;
            return 0;
        })[0];

        const box: HTMLDivElement = document.querySelector(`[data-index="${bestFork.columnNumber}${bestFork.boxNumber}"]`)!;
        box.removeEventListener('click', boxClickEventListener);

        await wait(500);
        box.textContent = 'o';

        return;
    }

    for (const [columnNumber, column] of board.entries()) {
        for (const [boxNumber, boxState] of column.entries()) {
            if (boxState !== 'empty') continue;

            const newBoard = getBoard();
            newBoard[columnNumber][boxNumber] = 'nought';

            const possibleWin = await checkForPossibleWin('nought', newBoard);

            if (possibleWin) {
               const possibleOpponentForks = await getAmountOfForks('cross', newBoard);

                if (possibleOpponentForks === 0) {
                    const box: HTMLDivElement = document.querySelector(`[data-index="${columnNumber}${boxNumber}"]`)!;
                    box.removeEventListener('click', boxClickEventListener);

                    await wait(500);
                    box.textContent = 'o';

                    return;
                }
            }
        }
    }

    if (board[1][1] === 'empty') {
        const box: HTMLDivElement = document.querySelector(`[data-index="11"]`)!;
        box.removeEventListener('click', boxClickEventListener);

        await wait(500);
        box.textContent = 'o';

        return;
    }

    if (board[0][0] === 'cross' && board[2][2] === 'empty') {
        const box: HTMLDivElement = document.querySelector(`[data-index="22"]`)!;
        box.removeEventListener('click', boxClickEventListener);

        await wait(500);
        box.textContent = 'o';

        return;
    } else if (board[2][0] === 'cross' && board[0][2] === 'empty') {
        const box: HTMLDivElement = document.querySelector(`[data-index="02"]`)!;
        box.removeEventListener('click', boxClickEventListener);

        await wait(500);
        box.textContent = 'o';

        return;
    } else if (board[0][2] === 'cross' && board[2][0] === 'empty') {
        const box: HTMLDivElement = document.querySelector(`[data-index="20"]`)!;
        box.removeEventListener('click', boxClickEventListener);

        await wait(500);
        box.textContent = 'o';

        return;
    } else if (board[2][2] === 'cross' && board[0][0] === 'empty') {
        const box: HTMLDivElement = document.querySelector(`[data-index="00"]`)!;
        box.removeEventListener('click', boxClickEventListener);

        await wait(500);
        box.textContent = 'o';

        return;
    }

    const corners = randomise<`${number}${number}`>([
        '00',
        '20',
        '02',
        '22'
    ]);

    if (board[parseInt(corners[0][0])][parseInt(corners[0][1])] === 'empty') {
        const box: HTMLDivElement = document.querySelector(`[data-index="${corners[0]}"]`)!;
        box.removeEventListener('click', boxClickEventListener);

        await wait(500);
        box.textContent = 'o';

        return;
    } else if (board[parseInt(corners[1][0])][parseInt(corners[1][1])] === 'empty') {
        const box: HTMLDivElement = document.querySelector(`[data-index="${corners[1]}"]`)!;
        box.removeEventListener('click', boxClickEventListener);

        await wait(500);
        box.textContent = 'o';

        return;
    } else if (board[parseInt(corners[2][0])][parseInt(corners[2][1])] === 'empty') {
        const box: HTMLDivElement = document.querySelector(`[data-index="${corners[2]}"]`)!;
        box.removeEventListener('click', boxClickEventListener);

        await wait(500);
        box.textContent = 'o';

        return;
    } else if (board[parseInt(corners[3][0])][parseInt(corners[3][1])] === 'empty') {
        const box: HTMLDivElement = document.querySelector(`[data-index="${corners[3]}"]`)!;
        box.removeEventListener('click', boxClickEventListener);

        await wait(500);
        box.textContent = 'o';

        return;
    }

    const middleSides = randomise<`${number}${number}`>([
        '01',
        '12',
        '21',
        '10'
    ]);

    if (board[parseInt(middleSides[0][0])][parseInt(middleSides[0][1])] === 'empty') {
        const box: HTMLDivElement = document.querySelector(`[data-index="${middleSides[0]}"]`)!;
        box.removeEventListener('click', boxClickEventListener);

        await wait(500);
        box.textContent = 'o';

        return;
    } else if (board[parseInt(middleSides[1][0])][parseInt(middleSides[1][1])] === 'empty') {
        const box: HTMLDivElement = document.querySelector(`[data-index="${middleSides[1]}"]`)!;
        box.removeEventListener('click', boxClickEventListener);

        await wait(500);
        box.textContent = 'o';

        return;
    } else if (board[parseInt(middleSides[2][0])][parseInt(middleSides[2][1])] === 'empty') {
        const box: HTMLDivElement = document.querySelector(`[data-index="${middleSides[2]}"]`)!;
        box.removeEventListener('click', boxClickEventListener);

        await wait(500);
        box.textContent = 'o';

        return;
    } else if (board[parseInt(middleSides[3][0])][parseInt(middleSides[3][1])] === 'empty') {
        const box: HTMLDivElement = document.querySelector(`[data-index="${middleSides[3]}"]`)!;
        box.removeEventListener('click', boxClickEventListener);

        await wait(500);
        box.textContent = 'o';

        return;
    }
};

window.onload = () => {
    const boxes: NodeListOf<HTMLDivElement> = document.querySelectorAll('.box');

    boxes.forEach(box => {
        box.addEventListener('click', boxClickEventListener);
    });
};
