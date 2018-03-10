// ===================== Пример кода первой двери =======================
/**
 * @class Door0
 * @augments DoorBase
 * @param {Number} number
 * @param {Function} onUnlock
 */
function Door0(number, onUnlock) {
    DoorBase.apply(this, arguments);

    var buttons = [
        this.popup.querySelector('.door-riddle__button_0'),
        this.popup.querySelector('.door-riddle__button_1'),
        this.popup.querySelector('.door-riddle__button_2')
    ];

    buttons.forEach(function(b) {
        b.addEventListener('pointerdown', _onButtonPointerDown.bind(this));
        b.addEventListener('pointerup', _onButtonPointerUp.bind(this));
        b.addEventListener('pointercancel', _onButtonPointerUp.bind(this));
        b.addEventListener('pointerleave', _onButtonPointerUp.bind(this));
    }.bind(this));

    function _onButtonPointerDown(e) {
        e.target.classList.add('door-riddle__button_pressed');
        checkCondition.apply(this);
    }

    function _onButtonPointerUp(e) {
        e.target.classList.remove('door-riddle__button_pressed');
    }

    /**
     * Проверяем, можно ли теперь открыть дверь
     */
    function checkCondition() {
        var isOpened = true;
        buttons.forEach(function(b) {
            if (!b.classList.contains('door-riddle__button_pressed')) {
                isOpened = false;
            }
        });

        // Если все три кнопки зажаты одновременно, то откроем эту дверь
        if (isOpened) {
            this.unlock();
        }
    }
}

// Наследуемся от класса DoorBase
Door0.prototype = Object.create(DoorBase.prototype);
Door0.prototype.constructor = DoorBase;
// END ===================== Пример кода первой двери =======================

/**
 * @class Door1
 * @augments DoorBase
 * @param {Number} number
 * @param {Function} onUnlock
 */
function Door1(number, onUnlock) {
    DoorBase.apply(this, arguments);

    var leafs = [
        this.popup.querySelector('.door-lock__leaf_0'),
        this.popup.querySelector('.door-lock__leaf_1')
    ];

    var currentPosition = [];
    var startPosition = [];
    var isGestureStarted = [];

    leafs.forEach(function(l) {
        l.addEventListener('pointerdown', _onLeafPointerDown.bind(this));
        l.addEventListener('pointerup', _onLeafPointerUp.bind(this));
        l.addEventListener('pointermove', _onLeafPointerMove.bind(this));
        l.addEventListener('pointercancel', _onLeafPointerUp.bind(this));
        l.addEventListener('pointerleave', _onLeafPointerUp.bind(this));
    }.bind(this));

    function _onLeafPointerDown(e) {
        var i = leafs.indexOf(e.target);
        currentPosition[i] = startPosition[i] = e.pageY;
        isGestureStarted[i] = true;

        disableTransition(i);
    }
    
    function _onLeafPointerUp(e) {
        var i = leafs.indexOf(e.target);
    
        currentPosition[i] = e.pageX;
        isGestureStarted[i] = false;

        leafs[i].releasePointerCapture(e.pointerId);
        enableTransition(i);
        resetPosition(i);
    }

    function _onLeafPointerMove(e) {
        var i = leafs.indexOf(e.target);

        if (!isGestureStarted[i]) {
            return;
        }

        currentPosition[i] = e.pageY;
        updatePosition(i);

        checkCondition.apply(this);
    }

    function updatePosition(i) {
        requestAnimationFrame(function() {
            var diff = Math.floor(currentPosition[i] - startPosition[i]);
            var normalizer = i === 0 ? Math.min : Math.max;
            diff = normalizer(0, diff);
            leafs[i].style.transform = 'translateY(' + diff + 'px)';
        });
    }

    function resetPosition(i) {
        requestAnimationFrame(function() {
            leafs[i].style.transform = '';
        });
    }    
    
    function disableTransition(i) {
        leafs[i].style.transition = 'none';
    }

    function enableTransition(i) {
        leafs[i].style.transition = '';
    }

    function checkCondition() {
        var THRESHOLD = 40;
        var isOpened = [false, false];

        isOpened[0] = currentPosition[0] < THRESHOLD;
        isOpened[1] = currentPosition[1] > window.innerHeight - THRESHOLD;

        if (isOpened[0] && isOpened[1]) {
            leafs[0].classList.add('door-lock__leaf_0--opened');
            leafs[1].classList.add('door-lock__leaf_1--opened');
            _this = this;
            setTimeout(function() {
                if (_this.isLocked) {
                    _this.unlock();
                }
            }, 300);
        }
    }
    
}
Door1.prototype = Object.create(DoorBase.prototype);
Door1.prototype.constructor = DoorBase;

/**
 * @class Door2
 * @augments DoorBase
 * @param {Number} number
 * @param {Function} onUnlock
 */
function Door2(number, onUnlock) {
    DoorBase.apply(this, arguments);

    // Cover

    var cover = this.popup.querySelector('.door-cover');

    var coverCurrentPosition;
    var coverStartPosition;
    var coverIsGestureStarted;

    cover.addEventListener('pointerdown', _onCoverPointerDown.bind(this));
    cover.addEventListener('pointerup', _onCoverPointerUp.bind(this));
    cover.addEventListener('pointermove', _onCoverPointerMove.bind(this));
    cover.addEventListener('pointercancel', _onCoverPointerUp.bind(this));
    cover.addEventListener('pointerleave', _onCoverPointerUp.bind(this));

    function _onCoverPointerDown(e) {
        coverCurrentPosition = coverStartPosition = e.pageY;
        coverIsGestureStarted = true;
        _disableCoverTransition();
    }
    
    function _onCoverPointerUp(e) {
        coverCurrentPosition = e.pageX;
        coverIsGestureStarted = false;

        cover.releasePointerCapture(e.pointerId);
        _enableCoverTransition();
        _resetCoverPosition();
    }

    function _onCoverPointerMove(e) {
        if (!coverIsGestureStarted) {
            return;
        }
        coverCurrentPosition = e.pageY;
        _updateCoverPosition();
    }

    function _updateCoverPosition() {
        requestAnimationFrame(function() {
            var diff = Math.min(0, Math.floor(coverCurrentPosition - coverStartPosition));
            cover.style.transform = 'translateY(' + diff + 'px)';
        });
    }

    function _resetCoverPosition() {
        requestAnimationFrame(function() {
            cover.style.transform = '';
        });
    }    
    
    function _disableCoverTransition() {
        cover.style.transition = 'none';
    }

    function _enableCoverTransition() {
        cover.style.transition = '';
    }
    
    // Buttons

    var digits = [
        this.popup.querySelector('.door-keypad__digit_0'),
        this.popup.querySelector('.door-keypad__digit_1')
    ];

    var buttons = [
        this.popup.querySelector('.door-keypad__button_0'),
        this.popup.querySelector('.door-keypad__button_1')
    ];

    var digitClasses = [
        'door-keypad__digit_value_0',
        'door-keypad__digit_value_1',
        'door-keypad__digit_value_2',
        'door-keypad__digit_value_3',
        'door-keypad__digit_value_4',
        'door-keypad__digit_value_5',
        'door-keypad__digit_value_6',
        'door-keypad__digit_value_7',
        'door-keypad__digit_value_8',
        'door-keypad__digit_value_9'
    ];

    var values = [0, 0];

    buttons.forEach(function(b) {
        b.addEventListener('pointerdown', _onButtonPointerDown.bind(this));
        b.addEventListener('pointerup', _onButtonPointerUp.bind(this));
        b.addEventListener('pointercancel', _onButtonPointerUp.bind(this));
        b.addEventListener('pointerleave', _onButtonPointerUp.bind(this));
    }.bind(this));

    function _onButtonPointerDown(e) {
        e.preventDefault();
        e.target.classList.add('door-riddle__button_pressed');
        var i = buttons.indexOf(e.target);
        _incrementValue(i);
        _updateValue(i);
        _checkCondition.apply(this);
    }

    function _onButtonPointerUp(e) {
        e.target.classList.remove('door-riddle__button_pressed');
    }

    function _incrementValue(i) {
        var THRESHOLD = 9;
        values[i]++;
        if (values[i] > THRESHOLD) {
            values[i] = 0;
        }
    }

    function _updateValue(i) {
        digits[i].classList.remove(...digitClasses);
        digits[i].classList.add(digitClasses[values[i]]);
    }
    
    function _checkCondition() {
        var MAGIC_NUMBER = 42;

        var isOpened = values.join('') == MAGIC_NUMBER;

        if (isOpened) {
            cover.classList.add('door-cover--opened');
            _this = this;
            setTimeout(function() {
                if (_this.isLocked) {
                    _this.unlock();
                }
            }, 10);
        }
    }
    

}
Door2.prototype = Object.create(DoorBase.prototype);
Door2.prototype.constructor = DoorBase;

/**
 * Сундук
 * @class Box
 * @augments DoorBase
 * @param {Number} number
 * @param {Function} onUnlock
 */
function Box(number, onUnlock) {
    DoorBase.apply(this, arguments);

    var SEQUENCE_LIMIT = 3;

    var dots = [
        this.popup.querySelector('.door-twister__dot_0'),
        this.popup.querySelector('.door-twister__dot_1'),
        this.popup.querySelector('.door-twister__dot_2'),
        this.popup.querySelector('.door-twister__dot_3'),
        this.popup.querySelector('.door-twister__dot_4'),
        this.popup.querySelector('.door-twister__dot_5'),
        this.popup.querySelector('.door-twister__dot_6'),
        this.popup.querySelector('.door-twister__dot_7'),
        this.popup.querySelector('.door-twister__dot_8'),
    ];

    var twister = this.popup.querySelector('.door-twister');

    var isGestureStarted = false;

    var sequence;

    var currentSequence = [];

    dots.forEach(function(d) {
        d.addEventListener('pointerdown', _onDotPointerDown.bind(this));
        d.addEventListener('pointerup', _onDotPointerUp.bind(this));
        d.addEventListener('pointercancel', _onDotPointerUp.bind(this));
        d.addEventListener('pointerleave', _onDotPointerUp.bind(this));
    }.bind(this));

    this.door.addEventListener('click', _onDoorClick.bind(this));
    this.close.addEventListener('click', _onCloseClick.bind(this));

    function _onDotPointerDown(e) {
        e.preventDefault();
        e.target.classList.add('door-twister__dot--pressed');
        _updateCurrentSequence(dots.indexOf(e.target));
        _checkCondition.apply(this);
    }

    function _onDotPointerUp(e) {
        e.target.classList.remove('door-twister__dot--pressed');
    }
    
    function _onDoorClick(e) {
        if (!this.isLocked) {
            return;
        }
        sequence = _generateSequence();
        setTimeout(function() {
            _playSequence();
        }, 300);
    }

    function _onCloseClick(e) {
        if (!this.isLocked) {
            return;
        }
        _clearDots();
    }

    function _updateCurrentSequence(i) {
        if (currentSequence.length >= SEQUENCE_LIMIT) {
            currentSequence = currentSequence.slice(1);
        }
        currentSequence.push(i);
        console.log(currentSequence);
    }

    function _checkCondition() {
        var isOpened = true;

        sequence.forEach(function (i) {
            if (!dots[i].classList.contains('door-twister__dot--pressed')) {
                isOpened = false;
            }
        });

        for (var i = 0; i < SEQUENCE_LIMIT; i++) {
            if (currentSequence[i] !== sequence[i]) {
                isOpened = false;
            }
        }

        if (isOpened) {
            _clearDots();
            this.unlock();
        }
    }

    function _clearDots() {
        dots.forEach(function(dot) {
            dot.classList.remove('door-twister__dot--pressed');
        });
    }
    
    function _playSequence() {
        var STEP = 150;
        var delay = STEP;
        sequence.forEach(function(dotIndex) {
            setTimeout(function() {
                dots[dotIndex].classList.add('door-twister__dot--pressed');
                setTimeout(function() {
                    dots[dotIndex].classList.remove('door-twister__dot--pressed');
                }, delay / 2);
            }, delay);
            delay += STEP;
        });
    }

    function _generateSequence() {
        var sequence = [];
        while (sequence.length < SEQUENCE_LIMIT) {
            var randomDot = _randomDot();
            if (sequence.indexOf(randomDot) == -1) {
                sequence.push(randomDot);
            }
        }
        return sequence;
    }

    function _randomDot() {
        var TOTAL_DOTS = 8;
        return Math.floor(Math.random() * TOTAL_DOTS);
    }

    this.showCongratulations = function() {
        alert('Поздравляю! Игра пройдена!');
    };
}
Box.prototype = Object.create(DoorBase.prototype);
Box.prototype.constructor = DoorBase;
