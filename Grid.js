function Grid(data, dom) {
    this.isFirstRender = true;
    this.resizable = false;
    this.isResizing = false;
    this.isSwapping = false;
    // this.mouseX = 0;
    // this.mouseY = 0;

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

        this.changeCursor = _changeCursor.bind(this);
        this.resizeMouseDown = _resizeMouseDown.bind(this);
        this.resizeMouseUp = _resizeMouseUp.bind(this);
        this.resizeColAnimation = _resizeColAnimation.bind(this);
        this.changeCellValue = _changeCellValue.bind(this);
    },

    bindTableEvents: function () {
        // chagne cursor
        this.wrapper.addEventListener('mousemove', this.changeCursor);
        this.wrapper.addEventListener('mousedown', this.resizeMouseDown);
        document.addEventListener('mouseup', this.resizeMouseUp);
        this.wrapper.addEventListener('mousemove', this.resizeColAnimation);
        this.wrapper.addEventListener('change', this.changeCellValue);
    },

    removeTableEvents: function () {
        this.wrapper.removeEventListener('mousemove', this.changeCursor);
        this.wrapper.removeEventListener('mousedown', this.resizeMouseDown);
        document.removeEventListener('mouseup', this.resizeMouseUp);
        this.wrapper.removeEventListener('mousemove', this.resizeColAnimation);
        this.wrapper.removeEventListener('change', this.changeCellValue);
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