function Grid(data, dom) {
    this.isFirstRender = true;
    this.resizable = false;
    this.isResizing = false;
    this.isSwapping = false;
    // this.mouseX = 0;
    // this.mouseY = 0;
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

    render: function() {
        Render.render(this.model.data, this.container, this.model.rowHeights, this.model.colWidths, this.model.cellBoxX, this.model.cellBoxY, this.isFirstRender);
    },

    initBind: function () {
        var  _changeCursor = function (e) {
            if (this.isResizing || this.isSwapping) return;
            var eleIndex;
            try {
                eleIndex = ToolsUtil.getCellIndex(e.target);
            } catch (e) {
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
                if (this.wrapper.style.cursor === "col-resize") {
                    var width = parseInt(this.moveEle.style.minWidth, 10) >= this.model.minWidth
                        ? parseInt(this.moveEle.style.minWidth, 10)
                        : this.model.minWidth;
                    try {
                        this.model.resize('width', ToolsUtil.getCellIndex(this.moveEle)[1], width);
                    } catch (e) { return; }
                } else if (this.wrapper.style.cursor === "row-resize") {
                    var height = parseInt(this.moveEle.style.height, 10) >= this.model.minHeight
                        ? parseInt(this.moveEle.style.height, 10)
                        : this.model.minHeight;
                    try {
                        this.model.resize('height', ToolsUtil.getCellIndex(this.moveEle)[0], height);
                    } catch (e) { return; }
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
            try {
                var indexX = ToolsUtil.getCellIndex(e.target.parentElement.parentElement)[1] - 1;
                var indexY = ToolsUtil.getCellIndex(e.target.parentElement.parentElement)[0] - 1;
                this.model.updateCellData(indexX, indexY, e.target.value);
            } catch (e) {
                return;
            }
        };

        var _swapPositionMouseDown = function (e) {
            if (this.resizable) { return; }

            var eleIndex, k;
            try {
                eleIndex = ToolsUtil.getCellIndex(e.target);
            } catch (e) {
                return;
            }

            this.table = this.container.querySelector('table');

            if (eleIndex[0] === 0 && eleIndex[1] !== 0) {
                if (e.offsetY < e.target.offsetHeight - this.model.cellPadding && e.offsetX < e.target.offsetWidth - this.model.cellPadding) {
                    this.isSwapping = true;
                    this.currentMoveEleStartIndexX = eleIndex[1] - 1;
                    for (k = 1; k < this.table.rows.length; k++) {
                        this.table.rows[k].cells[this.currentMoveEleStartIndexX + 1].style.backgroundColor = "green";
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
                        this.table.rows[this.currentMoveEleStartIndexY + 1].cells[k].style.backgroundColor = "green";
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
                if (this.swapType === 'col') {
                    try {
                        this.currentMoveEleEndIndexX = ToolsUtil.getCellIndex(e.target)[1] - 1;
                    } catch (e) {
                        return;
                    }
                    this.swapPosition('col', this.currentMoveEleStartIndexX, this.currentMoveEleEndIndexX);
                } else if (this.swapType === 'row') {
                    try {
                        this.currentMoveEleEndIndexY = ToolsUtil.getCellIndex(e.target)[0] - 1;
                    } catch (e) {
                        return;
                    }
                    this.swapPosition('row', this.currentMoveEleStartIndexY, this.currentMoveEleEndIndexY);
                }
            }
            this.isSwapping = false;
        };

        var _swapPositionMouseMove = function (e) {
            if (this.isSwapping) {
                e.preventDefault();
                var currentProcessEleIndex;
                var preSwapEleIndex;
                var k;
                if (this.swapType === 'col') {
                    if (e.target !== this.preSwapEle && e.target !== this.startSwapEle) {
                        try {
                            currentProcessEleIndex = ToolsUtil.getCellIndex(e.target)[1];
                        } catch (e) {
                            return;
                        }
                        for (k = 1; k < this.table.rows.length; k++) {
                            this.table.rows[k].cells[currentProcessEleIndex].style.backgroundColor = "blue";
                        }
                        if (this.preSwapEle !== this.startSwapEle) {
                            try {
                                preSwapEleIndex = ToolsUtil.getCellIndex(this.preSwapEle)[1];
                            } catch (e) {
                                return;
                            }
                            for (k = 1; k < this.table.rows.length; k++) {
                                this.table.rows[k].cells[preSwapEleIndex].style.backgroundColor = "white";
                            }
                        }
                        this.preSwapEle = e.target;
                    }
                } else if (this.swapType === 'row') {
                    if (e.target !== this.preSwapEle && e.target !== this.startSwapEle) {
                        try {
                            currentProcessEleIndex = ToolsUtil.getCellIndex(e.target)[0];
                        } catch (e) {
                            return;
                        }
                        for (k = 1; k < this.table.rows[0].cells.length; k++) {
                            this.table.rows[currentProcessEleIndex].cells[k].style.backgroundColor = "blue";
                        }
                        if (this.preSwapEle !== this.startSwapEle) {
                            try {
                                preSwapEleIndex = ToolsUtil.getCellIndex(this.preSwapEle)[0];
                            } catch (e) {
                                return;
                            }
                            for (k = 1; k < this.table.rows[0].cells.length; k++) {
                                this.table.rows[preSwapEleIndex].cells[k].style.backgroundColor = "white";
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
                        this.model.updateFocusedCellCoordinates('left');
                        Render.moveFocusedCellBox(this.wrapper, this.model.cellBoxX, this.model.cellBoxY, this.preCellBoxX, this.preCellBoxY);
                        this.preCellBoxX = this.model.cellBoxX;
                    }
                    break;
                case 38:
                    // up
                    if (this.model.cellBoxY - 1 > 0) {
                        this.model.updateFocusedCellCoordinates('up');
                        Render.moveFocusedCellBox(this.wrapper, this.model.cellBoxX, this.model.cellBoxY, this.preCellBoxX, this.preCellBoxY);
                        this.preCellBoxY = this.model.cellBoxY;
                    }
                    break;
                case 9:
                case 39:
                    // right
                    if (this.model.cellBoxX + 1 < this.model.data[0].length) {
                        e.preventDefault();
                        this.model.updateFocusedCellCoordinates('right');
                        Render.moveFocusedCellBox(this.wrapper, this.model.cellBoxX, this.model.cellBoxY, this.preCellBoxX, this.preCellBoxY);
                        this.preCellBoxX = this.model.cellBoxX;
                    }
                    break;
                case 40:
                    // down
                    if (this.model.cellBoxY + 1 < this.model.data.length) {
                        this.model.updateFocusedCellCoordinates('down');
                        Render.moveFocusedCellBox(this.wrapper, this.model.cellBoxX, this.model.cellBoxY, this.preCellBoxX, this.preCellBoxY);
                        this.preCellBoxY = this.model.cellBoxY;
                    }
                    break;
                default:
                    break;
            }
        };

        var _focuseCell = function (e) {
            var eleIndex;
            try {
                eleIndex = ToolsUtil.getCellIndex(e.target.parentElement.parentElement);
            } catch (e) {
                return;
            }

            if (eleIndex[0] > 0 && eleIndex[1] > 0) {
                this.model.cellBoxX = eleIndex[1];
                this.model.cellBoxY = eleIndex[0];
                Render.moveFocusedCellBox(this.wrapper, this.model.cellBoxX, this.model.cellBoxY, this.preCellBoxX, this.preCellBoxY);
                this.preCellBoxX = this.model.cellBoxX;
                this.preCellBoxY = this.model.cellBoxY;
            }
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
    },

    insertRow: function (index) {
        this.model.insertRow(index);
        this.render();
    },

    insertCol: function (index) {
        this.model.insertCol(index);
        this.render();
    },

    deleteRow: function (index) {
        this.model.deleteRow(index);
        this.render();
    },

    deleteCol: function (index) {
        this.model.deleteCol(index);
        this.render();
    },

    swapPosition: function (type, indexA, indexB) {
        this.model.swapPosition(type, indexA, indexB);
        this.render();
    },
};