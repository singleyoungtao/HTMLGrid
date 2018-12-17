function Grid(data, dom) {
    this.isFirstRender = true;
    this.resizable = false;
    this.isResizing = false;
    this.isSwapping = false;
    this.moveEle = null;
    this.currentMoveEleStartIndexX = null;
    this.currentMoveEleStartIndexY = null;
    this.swapType = '';
    this.preSwapEle = null;
    this.startSwapEle = null;
    this.preCellBoxX = 1;
    this.preCellBoxY = 1;

    this.init(data, dom);
}

Grid.prototype = {
    init: function (data, container) {
        this.model = new Model(data);
        this.container = container;
        this.render();
        this.wrapper = container.querySelector('.table-container');
        this.initBind();
        this.bindTableEvents();
        this.isFirstRender = false;
    },

    render: function () {
        Render.render(this.model.data, this.container, this.model.rowHeights, this.model.colWidths, this.model.cellBoxX, this.model.cellBoxY, this.isFirstRender);
    },

    initBind: function () {
        var _changeCursor = function (e) {
            if (this.isResizing || this.isSwapping) return;
            var eleIndex = ToolsUtil.getCellIndex(e.target);
            if (!eleIndex) {
                return;
            }

            if (eleIndex[0] === 0) {
                if (e.offsetY < e.target.offsetHeight - this.model.cellPadding && e.offsetX > e.target.offsetWidth - this.model.cellPadding) {
                    this.wrapper.style.cursor = "col-resize";
                    this.resizable = true;
                    return;
                } else {
                    this.wrapper.style.cursor = "auto";
                    this.resizable = false;
                }
            } else if (eleIndex[1] === 0) {
                if (e.offsetX < e.target.offsetWidth - this.model.cellPadding && e.offsetY > e.target.offsetHeight - this.model.cellPadding) {
                    this.wrapper.style.cursor = "row-resize";
                    this.resizable = true;
                    return;
                } else {
                    this.wrapper.style.cursor = "auto";
                    this.resizable = false;
                }
            } else {
                this.wrapper.style.cursor = "auto";
                this.resizable = false;
            }
        };

        var _resizeMouseDown = function (e) {
            if (this.resizable) {
                this.isResizing = true;
                e.preventDefault();
                this.mouseX = e.pageX;
                this.mouseY = e.pageY;
                this.moveEle = e.target;
            }
        };

        var _resizeMouseUp = function () {
            if (this.isResizing) {
                var resizeIndex;
                if (this.wrapper.style.cursor === "col-resize") {
                    var width = parseInt(this.moveEle.style.minWidth, 10) >= this.model.minWidth
                        ? parseInt(this.moveEle.style.minWidth, 10)
                        : this.model.minWidth;
                    resizeIndex = ToolsUtil.getCellIndex(this.moveEle);
                    if (resizeIndex) {
                        this.model.resize('width', resizeIndex[1], width);
                    } else {
                        return;
                    }
                } else if (this.wrapper.style.cursor === "row-resize") {
                    var height = parseInt(this.moveEle.style.height, 10) >= this.model.minHeight
                        ? parseInt(this.moveEle.style.height, 10)
                        : this.model.minHeight;
                    resizeIndex = ToolsUtil.getCellIndex(this.moveEle);
                    if (resizeIndex) {
                        this.model.resize('height', resizeIndex[0], height);
                    } else {
                        return;
                    }
                }
            }
            this.isResizing = false;
        };

        var _resizeColAnimation = function (e) {
            if (this.isResizing) {
                var deltX = e.pageX - this.mouseX;
                var deltY = e.pageY - this.mouseY;
                if (this.wrapper.style.cursor === "col-resize") {
                    this.moveEle.style.minWidth = parseInt(this.moveEle.style.minWidth, 10) + deltX + 'px';
                } else if (this.wrapper.style.cursor === "row-resize") {
                    this.moveEle.style.height = parseInt(this.moveEle.style.height, 10) + deltY + 'px';
                }
                this.mouseX = e.pageX;
                this.mouseY = e.pageY;
            }
        };

        var _changeCellValue = function (e) {
            // input -> div -> td
            var index = ToolsUtil.getCellIndex(e.target.parentElement.parentElement);
            if (index) {
                var indexX = index[1] - 1;
                var indexY = index[0] - 1;
                this.model.updateCellData(indexX, indexY, e.target.value);
            } else {
                return;
            }
        };

        var _swapPositionMouseDown = function (e) {
            if (this.resizable) {
                return;
            }

            var k;
            var eleIndex = ToolsUtil.getCellIndex(e.target);
            if (!eleIndex) {
                return;
            }
            this.table = this.container.querySelector('table');

            if (eleIndex[0] === 0 && eleIndex[1] !== 0) {
                if (e.offsetY < e.target.offsetHeight - this.model.cellPadding && e.offsetX < e.target.offsetWidth - this.model.cellPadding) {
                    this.isSwapping = true;
                    this.currentMoveEleStartIndexX = eleIndex[1] - 1;
                    for (k = 1; k < this.table.rows.length; k++) {
                        this.table.rows[k].cells[this.currentMoveEleStartIndexX + 1].style.backgroundColor = "#009a61";
                    }
                    this.preSwapEle = e.target;
                    this.startSwapEle = e.target;
                    this.swapType = 'col';
                    return;
                }
            } else if (eleIndex[1] === 0 && eleIndex[0] !== 0) {
                if (e.offsetX < e.target.offsetWidth - this.model.cellPadding && e.offsetY < e.target.offsetHeight - this.model.cellPadding) {
                    this.isSwapping = true;
                    this.currentMoveEleStartIndexY = eleIndex[0] - 1;
                    for (k = 1; k < this.table.rows[0].cells.length; k++) {
                        this.table.rows[this.currentMoveEleStartIndexY + 1].cells[k].style.backgroundColor = "#009a61";
                    }
                    this.preSwapEle = e.target;
                    this.startSwapEle = e.target;
                    this.swapType = 'row';
                    return;
                }
            }
        };

        var _swapPositionMouseUp = function (e) {
            if (this.isSwapping) {
                var currentMoveEleEndIndex;
                if (this.swapType === 'col') {
                    currentMoveEleEndIndex = ToolsUtil.getCellIndex(e.target);
                    if (currentMoveEleEndIndex) {
                        this.currentMoveEleEndIndexX = currentMoveEleEndIndex[1] - 1;
                    } else {
                        return;
                    }
                    this.swapPosition('col', this.currentMoveEleStartIndexX, this.currentMoveEleEndIndexX);
                } else if (this.swapType === 'row') {
                    currentMoveEleEndIndex = ToolsUtil.getCellIndex(e.target);
                    if (currentMoveEleEndIndex) {
                        this.currentMoveEleEndIndexY =currentMoveEleEndIndex[0] - 1;
                    } else {
                        return;
                    }
                    this.swapPosition('row', this.currentMoveEleStartIndexY, this.currentMoveEleEndIndexY);
                }
                this.render();
            }
            this.isSwapping = false;
        };

        var _swapPositionMouseMove = function (e) {
            if (this.isSwapping) {
                e.preventDefault();
                var currentProcessEleIndex = ToolsUtil.getCellIndex(e.target);
                var preSwapEleIndex = ToolsUtil.getCellIndex(this.preSwapEle);
                var k;
                if (! (currentProcessEleIndex && preSwapEleIndex)) {
                    this.isSwapping = false;
                    return;
                }
                if (this.swapType === 'col') {
                    if (e.target !== this.preSwapEle && e.target !== this.startSwapEle) {
                        if (currentProcessEleIndex[0] !== 0) {
                            this.isSwapping = false;
                            this.render();
                            return;
                        }
                        for (k = 1; k < this.table.rows.length; k++) {
                            this.table.rows[k].cells[currentProcessEleIndex[1]].style.backgroundColor = "#83d0f2";
                        }
                        if (this.preSwapEle !== this.startSwapEle) {
                            for (k = 1; k < this.table.rows.length; k++) {
                                this.table.rows[k].cells[preSwapEleIndex[1]].style.backgroundColor = "white";
                            }
                        }
                        this.preSwapEle = e.target;
                    }
                } else if (this.swapType === 'row') {
                    if (e.target !== this.preSwapEle && e.target !== this.startSwapEle) {
                        if (currentProcessEleIndex[1] !== 0) {
                            this.isSwapping = false;
                            this.render();
                            return;
                        }
                        for (k = 1; k < this.table.rows[0].cells.length; k++) {
                            this.table.rows[currentProcessEleIndex[0]].cells[k].style.backgroundColor = "#83d0f2";
                        }
                        if (this.preSwapEle !== this.startSwapEle) {
                            for (k = 1; k < this.table.rows[0].cells.length; k++) {
                                this.table.rows[preSwapEleIndex[0]].cells[k].style.backgroundColor = "white";
                            }
                        }
                        this.preSwapEle = e.target;
                    }
                }
            }
        };

        var _moveCellFocus = function (e) {
            switch (e.keyCode) {
                case 37:
                    // left
                    if (this.model.cellBoxX - 1 > 0) {
                        this.updateCellBox('left')
                    }
                    break;
                case 38:
                    // up
                    if (this.model.cellBoxY - 1 > 0) {
                        this.updateCellBox('up')
                    }
                    break;
                case 9:
                    if (e.preventDefault) {
                        e.preventDefault();
                    }
                    if (e.shiftKey) {
                        if (this.model.cellBoxX - 1 > 0) {
                            this.updateCellBox('left')
                        }
                    } else {
                        if (this.model.cellBoxX + 1 < this.model.data[0].length) {
                            this.updateCellBox('right')
                        }
                    }
                    break;
                case 39:
                    // right
                    if (this.model.cellBoxX + 1 <= this.model.data[0].length) {
                        if (e.preventDefault) {
                            e.preventDefault();
                        }
                        this.updateCellBox('right')
                    }
                    break;
                case 40:
                    // down
                    if (this.model.cellBoxY + 1 <= this.model.data.length) {
                        this.updateCellBox('down')
                    }
                    break;
                default:
                    break;
            }
        };

        var _focuseCell = function (e) {
            var eleIndex = ToolsUtil.getCellIndex(e.target.parentElement.parentElement);
            if (!eleIndex) {
                return;
            }

            if (eleIndex[0] > 0 && eleIndex[1] > 0) {
                this.model.cellBoxX = eleIndex[1];
                this.model.cellBoxY = eleIndex[0];
                if (this.preCellBoxX === this.model.cellBoxX && this.preCellBoxY === this.model.cellBoxY) {
                    return;
                }
                Render.moveFocusedCellBox(this.wrapper, this.model.cellBoxX, this.model.cellBoxY, this.preCellBoxX, this.preCellBoxY);
                this.preCellBoxX = this.model.cellBoxX;
                this.preCellBoxY = this.model.cellBoxY;
            }
        };

        var _swapPositionMouseLeave = function () {
            this.isSwapping = false;
            this.isResizing = false;
            this.render();
        };

        this.changeCursor = _changeCursor.bind(this);
        this.resizeMouseDown = _resizeMouseDown.bind(this);
        this.resizeMouseUp = _resizeMouseUp.bind(this);
        this.resizeColAnimation = _resizeColAnimation.bind(this);
        this.changeCellValue = _changeCellValue.bind(this);
        this.swapPositionMouseDown = _swapPositionMouseDown.bind(this);
        this.swapPositionMouseUp = _swapPositionMouseUp.bind(this);
        this.swapPositionMouseMove = _swapPositionMouseMove.bind(this);
        this.moveCellFocus = _moveCellFocus.bind(this);
        this.focuseCell = _focuseCell.bind(this);
        this.swapPositionMouseLeave = _swapPositionMouseLeave.bind(this);
    },

    bindTableEvents: function () {
        // chagne cursor
        this.wrapper.addEventListener('mousemove', this.changeCursor);
        this.wrapper.addEventListener('mousedown', this.resizeMouseDown);
        document.addEventListener('mouseup', this.resizeMouseUp);
        this.wrapper.addEventListener('mousemove', this.resizeColAnimation);
        this.wrapper.addEventListener('change', this.changeCellValue);
        this.wrapper.addEventListener('mousedown', this.swapPositionMouseDown);
        document.addEventListener('mouseup', this.swapPositionMouseUp);
        this.wrapper.addEventListener('mousemove', this.swapPositionMouseMove);
        this.wrapper.addEventListener('keydown', this.moveCellFocus);
        this.wrapper.addEventListener('click', this.focuseCell);
        this.wrapper.addEventListener('mouseleave', this.swapPositionMouseLeave);
    },

    removeTableEvents: function () {
        this.wrapper.removeEventListener('mousemove', this.changeCursor);
        this.wrapper.removeEventListener('mousedown', this.resizeMouseDown);
        document.removeEventListener('mouseup', this.resizeMouseUp);
        this.wrapper.removeEventListener('mousemove', this.resizeColAnimation);
        this.wrapper.removeEventListener('change', this.changeCellValue);
        this.wrapper.removeEventListener('mousedown', this.swapPositionMouseDown);
        document.removeEventListener('mouseup', this.swapPositionMouseUp);
        this.wrapper.removeEventListener('mousemove', this.swapPositionMouseMove);
        this.wrapper.removeEventListener('keydown', this.moveCellFocus);
        this.wrapper.removeEventListener('click', this.focuseCell);
    },

    insertRow: function (index) {
        if (!ToolsUtil.isNumber(index)) {
            return;
        }
        this.model.insertRow(index);
        this.render();
    },

    insertCol: function (index) {
        if (!ToolsUtil.isNumber(index)) {
            return;
        }
        this.model.insertCol(index);
        this.render();
    },

    deleteRow: function (index) {
        if (!ToolsUtil.isNumber(index)) {
            return;
        }
        this.model.deleteRow(index);
        this.render();
    },

    deleteCol: function (index) {
        if (!ToolsUtil.isNumber(index)) {
            return;
        }
        this.model.deleteCol(index);
        this.render();
    },

    swapPosition: function (type, indexA, indexB) {
        if (!ToolsUtil.isNumber(indexA) && !ToolsUtil.isNumber(indexB)) {
            return;
        }
        this.model.swapPosition(type, indexA, indexB);
        this.render();
    },

    transInputIndex: function (index) {
        if (ToolsUtil.isNumber(index)) {
            return index > 0 ? index -1 : index;
        }
        return;
    },

    moveCell: function (type) {
        var e = {};
        switch (type) {
            case 'left':
                e.keyCode = 37;
                break;
            case 'up':
                e.keyCode = 38;
                break;
            case 'right':
                e.keyCode = 39;
                break;
            case 'down':
                e.keyCode = 40;
                break;
        }
        this.moveCellFocus(e);
    },

    updateCellBox: function (type) {
        this.model.updateFocusedCellCoordinates(type);
        Render.moveFocusedCellBox(this.wrapper, this.model.cellBoxX, this.model.cellBoxY, this.preCellBoxX, this.preCellBoxY);
        this.preCellBoxX = this.model.cellBoxX;
        this.preCellBoxY = this.model.cellBoxY;
    },

    destory: function () {
        this.removeTableEvents();
        this.model = null;
        Render.removeDOM(this.container);
    }
};