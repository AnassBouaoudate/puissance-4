class P4 {
    constructor(selector) {
        this.COL = 7;
        this.LGN = 6;
        this.selector = selector;
        this.player = 'red';
        this.gameOver = false;

        this.drawGame();
        this.ecoute();
    }

    drawGame() {

        //plateau de jeu
        const $jeu = $(this.selector);

        for (let lgn = 0; lgn < this.LGN; lgn++) {
            const $lgn = $('<div>').addClass('lgn');
            for (let col = 0; col < this.COL; col++) {
                const $col = $('<div>').addClass('col empty').attr("data-col", col).attr("data-lgn", lgn);
                $lgn.append($col);
            }
            $jeu.append($lgn);
        }

    //affiche btn restart ->fin du jeu

    const $restartBtn = $('<button>').text('Restart').addClass('restart-btn');
    $restartBtn.on('click', () => this.restartGame());
    $jeu.after($restartBtn);

    //cache bouton depart
    $('.restart-btn').hide();
}

    ecoute() {

        //événement svl, clic clnns jeu
        const $jeu = $(this.selector);
        const that = this;

        function lastCase(col) {
            const $cells = $(`.col[data-col='${col}']`);
            for (let i = $cells.length - 1; i >= 0; i--) {
                const $cell = $($cells[i]);
                if ($cell.hasClass('empty')) {
                    return $cell;
                }
            }
            return null;
        }

        //visuel->dernr case vide
        $jeu.on('mouseenter', '.col.empty', function () {
            const $col = $(this).data('col');
            const $last = lastCase($col);
            if ($last != null) {
                $last.addClass(`p${that.player}`);
            }
        });

        //quitte srvl
        $jeu.on('mouseleave', '.col', function () {
            $('.col').removeClass(`p${that.player}`);
        });

        //gere clic pl plateau -> maj jeu ->check win/affiche gagnant
        $jeu.on('click', '.col.empty', function () {
            if (that.gameOver) {
                return;
            }

            const col = $(this).data('col');
            const $last = lastCase(col);
            $last.addClass(`${that.player}`).removeClass(`empty p${that.player}`).data('player', `${that.player}`);

            const winner = that.checkWin($last.data('lgn'), $last.data('col'));

            that.player = (that.player === 'red') ? 'yellow' : 'red';

            if (winner) {
                $('#result').text(`Les ${winner} ont gagné la partie`);
                that.gameOver = true;

                // afficher btn restart
                $('.restart-btn').show();
                return;
            }

            const isDraw = $('.col.empty').length === 0;
            if (isDraw) {
                $('#result').text("Match nul !");
                that.gameOver = true;

                // afficher btn restart
                $('.restart-btn').show();
                return;
            }
        });
    }

    //verif ggnt ->exm jeu diff dirr.
    checkWin(lgn, col) {
        const that = this;

        function $getCell(i, j) {
            return $(`.col[data-lgn='${i}'][data-col='${j}']`);
        }

        function checkDirection(direction) {
            let total = 0;
            let i = lgn + direction.i;
            let j = col + direction.j;
            let $next = $getCell(i, j);
            while (i >= 0 && i < that.LGN && j >= 0 && j < that.COL && $next.data('player') === that.player) {
                total++;
                i += direction.i;
                j += direction.j;
                $next = $getCell(i, j);
            }
            return total;
        }

        function checkWin(directionA, directionB) {
            const total = 1 + checkDirection(directionA) + checkDirection(directionB);
            if (total >= 4) {
                return that.player;
            } else {
                return null;
            }
        }

        function checkHori() {
            return checkWin({ i: 0, j: -1 }, { i: 0, j: 1 });
        }

        function checkVerti() {
            return checkWin({ i: -1, j: 0 }, { i: 1, j: 0 });
        }

        function checkDiag1() {
            return checkWin({ i: 1, j: 1 }, { i: -1, j: -1 });
        }

        function checkDiag2() {
            return checkWin({ i: 1, j: -1 }, { i: -1, j: 1 });
        }

        return checkHori() || checkVerti() || checkDiag1() || checkDiag2();
        //exm dir jeu
    }

    restartGame() {
        const $jeu = $(this.selector);

        //vd jeu
        $jeu.empty();
        this.drawGame();

        //Rnt le jeu
        this.player = 'red';
        this.gameOver = false;
        $('#result').text('');

        //cch btn rstrt 
        $('.restart-btn').hide();
    }
}


