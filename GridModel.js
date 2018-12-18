/**
 * Private Function - Represent the constructor of grid model.
 * @param {Two-dimensional-array} data - The data of the table content.
 * @constructor
 */
function Model(data) {
    this.data = data;
    this.minWidth = 55;
    this.minHeight = 25;
    this.defaultHeight = 25;
    this.defaultWidth = 100;
    this.cellPadding = '10';
    this.cellBoxX = 1;
    this.cellBoxY = 1;

    this.colWidths = ToolsUtil.initEmptyArr(this.data[0].length + 1).map(function () {
        return 100;
    });

    this.colWidths[0] = 60;

    this.rowHeights = ToolsUtil.initEmptyArr(this.data.length + 1).map(function () {
        return 25;
    });

}

Model.prototype = {
    /**
     * API Function - To get the model data.
     * @returns {{data: *, defaultHeight: *, defaultWidth: *, cellPadding: *, cellBoxX: *, cellBoxY: *, preCellBoxX: *, preCellBoxY: *}}
     * @private
     */
    _getData: function () {
        return {
            data: this.data,
            defaultHeight: this.defaultHeight,
            defaultWidth: this.defaultWidth,
            cellPadding: this.cellPadding,
            cellBoxX: this.cellBoxX,
            cellBoxY: this.cellBoxY,
            preCellBoxX: this.preCellBoxX,
            preCellBoxY: this.preCellBoxY,
        };
    },

    /**
     * Private Function - To insert a row in content data array.
     * @param index
     */
    insertRow: function (index) {
        if (index > this.data.length) {
            return;
        }
        var newRow = ToolsUtil.initEmptyArr(this.data[0].length);
        this.data.splice(index, 0, newRow);
        this.rowHeights.splice(index + 1, 0, this.defaultHeight);
    },

    /**
     * Private Function - To insert a col in content data array.
     * @param index
     */
    insertCol: function (index) {
        if (index > this.data[0].length) {
            return;
        }
        var newCol = ToolsUtil.initEmptyArr(this.data.length);
        var i;
        for (i = 0; i < this.data.length; i++) {
            this.data[i].splice(index, 0, newCol[i])
        }
        this.colWidths.splice(index + 1, 0, this.defaultWidth);
    },

    /**
     * Private Function - To delete a row in content data array.
     * @param index
     */
    deleteRow: function (index) {
        if (index > this.data.length - 1) {
            return;
        }
        this.data.splice(index, 1);
        this.rowHeights.splice(index + 1, 1);
    },

    /**
     * Private Function - To delete a column in content data array.
     * @param index
     */
    deleteCol: function (index) {
        if (index > this.data[0].length - 1)
            var i;
        for (i = 0; i < this.data.length; i++) {
            this.data[i].splice(index, 1);
        }
        this.colWidths.splice(index + 1, 1);
    },

    /**
     * Private Function - To swap position in content data array.
     * @param index
     */
    swapPosition: function (type, indexA, indexB) {
        var i, temp;
        switch (type) {
            case 'col':
                if (indexA < 0 || indexB < 0 || indexA > this.data[0].length - 1 || indexB > this.data[0].length - 1) {
                    break
                }

                temp = this.colWidths[indexA + 1];
                this.colWidths[indexA + 1] = this.colWidths[indexB + 1];
                this.colWidths[indexB + 1] = temp;

                for (i = 0; i < this.data.length; i++) {
                    temp = this.data[i][indexA];
                    this.data[i][indexA] = this.data[i][indexB];
                    this.data[i][indexB] = temp;
                }
                break;
            case 'row':
                if (indexA < 0 || indexB < 0 || indexA > this.data.length - 1 || indexB > this.data.length - 1) {
                    break
                }

                temp = this.rowHeights[indexA + 1];
                this.rowHeights[indexA + 1] = this.rowHeights[indexB + 1];
                this.rowHeights[indexB + 1] = temp;

                for (i = 0; i < this.data[0].length; i++) {
                    temp = this.data[indexA][i];
                    this.data[indexA][i] = this.data[indexB][i];
                    this.data[indexB][i] = temp;
                }
                break;
            default:
                break;
        }
    },

    /**
     * Private Function - Record the width and height change to the size array.
     * @param index
     */
    resize: function (type, index, width) {
        switch (type) {
            case 'width':
                this.colWidths[index] = width;
                break;
            case 'height':
                this.rowHeights[index] = width;
                break;
            default:
                break;
        }
    },

    /**
     * Private Function - Update the focused cell value.
     * @param index
     */
    updateCellData: function (indexX, indexY, value) {
        this.data[indexY][indexX] = value;
    },

    /**
     * Private Function - Update the focused cell position.
     * @param index
     */
    updateFocusedCellCoordinates: function (type) {
        switch (type) {
            case 'left':
                this.cellBoxX -= 1;
                if (this.cellBoxX === 0) {
                    if (this.cellBoxY - 1 === 0) {
                        this.cellBoxX = this.data[0].length;
                        this.cellBoxY = this.data.length;
                    } else {
                        this.cellBoxX = this.data[0].length;
                        this.cellBoxY -= 1;
                    }
                }
                break;
            case 'up':
                this.cellBoxY -= 1;
                break;
            case 'right':
                this.cellBoxX += 1;
                if (this.cellBoxX > this.data[0].length) {
                    if (this.cellBoxY + 1 > this.data.length) {
                        this.cellBoxX = 1;
                        this.cellBoxY = 1;
                    } else {
                        this.cellBoxX = 1;
                        this.cellBoxY += 1;
                    }
                }
                break;
            case 'down':
                this.cellBoxY += 1;
                break;
            default:
                break;
        }
    }
};