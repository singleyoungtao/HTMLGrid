/**
 * API Function - Represents the constructor of Grid. <br>
 * Usage Example: var grid = new Grid(data, dom); <br>
 * @param {Two-dimensional-array} data - The data of the table content.
 * @param {Dom} dom - The container dom that customer passed to wrap the table.
 * @constructor
 */
function Grid(data, dom) {
    this.isFirstRender = true;
    this.resizable = false;
    this.isResizing = false;
    this.isSwapping = false;
    this.isInputing = false;
    this.moveEle = null;
    this.currentMoveEleStartIndexX = null;
    this.currentMoveEleStartIndexY = null;
    this.swapType = '';
    this.preSwapEle = null;
    this.startSwapEle = null;
    this.preCellBoxX = 1;
    this.preCellBoxY = 1;
    this.clickEle = null;

    this.init(data, dom);
}

Grid.prototype = {
    /**
     * Private Function - To initialize the start state for grid instance. <br>
     * Usage: It is called in Grid constructor. <br>
     * @param {Two-dimensional-array} data - The data of the table content.
     * @param {Dom} container - The container dom that customer passed to wrap the table.
     */
    init: function (data, container) {
        this.model = new Model(data);
        this.container = container;
        this.render();
        this.wrapper = container.querySelector('.table-container');
        this.contextMenuEle = container.querySelector('.context-menu');
        this.initBind();
        this.bindTableEvents();
        this.isFirstRender = false;
    },

    /**
     * Private Function - Call the render method of Render ( view ) for updating table. <br>
     * Usage: It is called in Grid where needs to trigger the rerender. <br>
     */
    render: function () {
        Render.render(this.model.data, this.container, this.model.rowHeights, this.model.colWidths, this.model.cellBoxX, this.model.cellBoxY, this.isFirstRender);
    },

    /**
     * Private Function - Generate the dom relevant operation functions. <br>
     * Usage: It is called in Grid init function. <br>
     */
    initBind: function () {

        /**
         * Private Function - Change cursor shape when user hovers the cursor to the table thread or first column. <br>
         * Usage: It is called in Grid init function. <br>
         * @param {event} e - Dom event.
         * @private
         */
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
                    var resizeWidth = Math.max(parseInt(this.moveEle.style.minWidth, 10) + deltX, this.model.defaultWidth);
                    this.moveEle.style.minWidth = resizeWidth + 'px';
                } else if (this.wrapper.style.cursor === "row-resize") {
                    var resizeHeight = Math.max(parseInt(this.moveEle.style.height, 10) + deltY, this.model.defaultHeight);
                    this.moveEle.style.height = resizeHeight + 'px';
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
                        this.table.rows[k].cells[this.currentMoveEleStartIndexX + 1].style.backgroundColor = "#ebf7f3";
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
                        this.table.rows[this.currentMoveEleStartIndexY + 1].cells[k].style.backgroundColor = "#ebf7f3";
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
                        this.currentMoveEleEndIndexY = currentMoveEleEndIndex[0] - 1;
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
                if (!(currentProcessEleIndex && preSwapEleIndex)) {
                    return;
                }
                if (this.swapType === 'col') {
                    if (e.target !== this.preSwapEle && e.target !== this.startSwapEle) {
                        if (currentProcessEleIndex[0] !== 0) {
                            this.render();
                            return;
                        }
                        for (k = 1; k < this.table.rows.length; k++) {
                            this.table.rows[k].cells[currentProcessEleIndex[1]].style.backgroundColor = "#ecf3ff";
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
                            this.render();
                            return;
                        }
                        for (k = 1; k < this.table.rows[0].cells.length; k++) {
                            this.table.rows[currentProcessEleIndex[0]].cells[k].style.backgroundColor = "#ecf3ff";
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
            if (this.isInputing) {
                if (e.keyCode === 9) {
                    e.preventDefault();
                }
                return;
            }
            switch (e.keyCode) {
                case 37:
                    // left
                    this.updateCellBox('left');
                    break;
                case 38:
                    // up
                    if (this.model.cellBoxY - 1 > 0) {
                        this.updateCellBox('up');
                    }
                    break;
                case 9:
                    if (e.preventDefault) {
                        e.preventDefault();
                    }
                    if (e.shiftKey) {
                        this.updateCellBox('left')
                    } else {
                        this.updateCellBox('right')
                    }
                    break;
                case 39:
                    // right
                    this.updateCellBox('right');
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
            this.isInputing = false;
            var eleIndex = ToolsUtil.getCellIndex(e.target.parentElement.parentElement);
            if (!eleIndex) {
                return;
            }

            if (eleIndex[0] > 0 && eleIndex[1] > 0) {
                this.model.cellBoxX = eleIndex[1];
                this.model.cellBoxY = eleIndex[0];
                if (this.preCellBoxX === this.model.cellBoxX && this.preCellBoxY === this.model.cellBoxY) {
                    this.isInputing = true;
                    e.target.style.color = 'black';
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

        var _showContextMenu = function (e) {
            var eleIndex = ToolsUtil.getCellIndex(e.target);
            if (!eleIndex || (eleIndex[0] !== 0 && eleIndex [1] !== 0) || (eleIndex[0] === 0 && eleIndex[1] === 0)) {
                return;
            }
            e.preventDefault();
            e.stopPropagation();
            var contextMenu = this.container.querySelector('.context-menu');
            contextMenu.style.top = e.clientY + 'px';
            contextMenu.style.left = e.clientX + 'px';
            contextMenu.style.visibility = "visible";
            this.clickEle = e.target;
            if (eleIndex[0] === 0) {
                contextMenu.querySelectorAll('.col').forEach(function (item) {
                    item.style.display = 'block';
                });
                contextMenu.querySelectorAll('.row').forEach(function (item) {
                    item.style.display = 'none';
                });
            } else if (eleIndex[1] === 0) {
                contextMenu.querySelectorAll('.row').forEach(function (item) {
                    item.style.display = 'block';
                });
                contextMenu.querySelectorAll('.col').forEach(function (item) {
                    item.style.display = 'none';
                });
            }
        };

        var _closeContextMenu = function (e) {
            if (this.contextMenuEle.contains(e.target)) {
                return;
            }
            this.contextMenuEle.style.visibility = "hidden";
        };

        var _contextMenuOperate = function (e) {
            var eleIndex = ToolsUtil.getCellIndex(this.clickEle);
            var type = e.target.getAttribute('data-type');
            if (eleIndex) {
                switch (type) {
                    case "insert-row":
                        this.insertRow(eleIndex[0] - 1);
                        break;
                    case "insert-col":
                        this.insertCol(eleIndex[1] - 1);
                        break;
                    case "delete-row":
                        this.deleteRow(eleIndex[0] - 1);
                        break;
                    case "delete-col":
                        this.deleteCol(eleIndex[1] - 1);
                        break;
                    default:
                        break;
                }
            }
            this.contextMenuEle.style.visibility = "hidden";
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
        this.showContextMenu = _showContextMenu.bind(this);
        this.closeContextMenu = _closeContextMenu.bind(this);
        this.contextMenuOperate = _contextMenuOperate.bind(this);
    },

    /**
     * Private Function - Bind the relevant table event functions after table generated. <br>
     * Usage: It is called in Grid init function. <br>
     */
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
        this.wrapper.addEventListener('contextmenu', this.showContextMenu);
        document.addEventListener('click', this.closeContextMenu);
        this.contextMenuEle.addEventListener('click', this.contextMenuOperate);
    },

    /**
     * Private Function - Remove the relevant table event functions before destroy the table. <br>
     * Usage: It is called in Grid destroy method. <br>
     */
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
        this.wrapper.removeEventListener('contextmenu', this.showContextMenu);
        document.removeEventListener('click', this.closeContextMenu);
        this.contextMenuEle.removeEventListener('click', this.contextMenuOperate);
    },

    /**
     * API Function - Customer can call it to insert a row. <br>
     * Usage Example: gridInstance.insertRow(index);
     * @param {number} index - The index of row where you want to insert a now row.
     */
    insertRow: function (index) {
        if (!ToolsUtil.isNumber(index)) {
            return;
        }
        this.model.insertRow(index);
        this.render();
    },

    /**
     * API Function - Customer can call it to insert a column. <br>
     * @param {number} index - The index of col where you want to insert a now col.
     */
    insertCol: function (index) {
        if (!ToolsUtil.isNumber(index)) {
            return;
        }
        this.model.insertCol(index);
        this.render();
    },

    /**
     * API Function - Customer can call it to delete a row. <br>
     * Usage Example: gridInstance.deleteRow(index);
     * @param {number} index - The index of row where you want to delete a now row.
     */
    deleteRow: function (index) {
        if (!ToolsUtil.isNumber(index)) {
            return;
        }
        if (!ToolsUtil.errorAlert('deleteRow', this.model.data)) {
            return;
        }
        this.model.deleteRow(index);
        this.render();
    },

    /**
     * API Function - Customer can call it to delete a column. <br>
     * @param {number} index - The index of col where you want to delete a now col.
     */
    deleteCol: function (index) {
        if (!ToolsUtil.isNumber(index)) {
            return;
        }
        if (!ToolsUtil.errorAlert('deleteCol', this.model.data)) {
            return;
        }
        this.model.deleteCol(index);
        this.render();
    },

    /**
     * API Function - Customer can call it to swap two row or col position.
     * @param type
     * @param indexA
     * @param indexB
     */
    swapPosition: function (type, indexA, indexB) {
        if (!ToolsUtil.isNumber(indexA) && !ToolsUtil.isNumber(indexB)) {
            return;
        }
        this.model.swapPosition(type, indexA, indexB);
        this.render();
    },

    transInputIndex: function (index) {
        if (ToolsUtil.isNumber(index)) {
            return index > 0 ? index - 1 : index;
        }
        return;
    },

    /**
     * API Function - Customer can call it to move the focused cell.
     * @param type
     */
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

    /**
     * API Function - Customer can call it to destroy the instance of Grid.
     */
    destroy: function () {
        this.removeTableEvents();
        this.model = null;
        Render.removeDOM(this.container);
    }
};