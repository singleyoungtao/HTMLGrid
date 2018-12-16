function Model(data) {
    this.data = data;
    this.minWidth = 55;
    this.minHeight = 25;
    this.defaultHeight = 25;
    this.defaultWidth = 80;
    this.cellPadding = '10';
    this.cellBoxX = 1;
    this.cellBoxY = 1;
    this.preCellBoxX = 1;
    this.preCellBoxY = 1;

    this.colWidths = ToolsUtil.initEmptyArr(this.data[0].length +1).map(function () {
        return 80;
    });

    this.colWidths[0] = 25;

    this.rowHeights = ToolsUtil.initEmptyArr(this.data.length + 1).map(function () {
        return 25;
    });

}

Model.prototype = {
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

    insertRow: function (index) {
        var newRow = ToolsUtil.initEmptyArr(this.data[0].length);
        this.data.splice(index, 0, newRow);
        this.rowHeights.splice(index + 1, 0, this.defaultHeight);
    },

    insertCol: function (index) {
        var newCol = ToolsUtil.initEmptyArr(this.data.length);
        var i;
        for (i = 0; i < this.data.length; i++) {
            this.data[i].splice(index, 0, newCol[i])
        }
        this.colWidths.splice(index + 1, 0, this.defaultWidth);
    },

    deleteRow: function (index) {
        this.data.splice(index, 1);
        this.rowHeights.splice(index + 1, 1);
    },

    deleteCol: function (index) {
        let i;
        for (i = 0; i < this.data.length; i++) {
            this.data[i].splice(index, 1);
        }
        this.colWidths.splice(index + 1, 1);
    },

    swapPosition: function (type, indexA, indexB) {
        let i, temp;
        switch (type) {
            case 'col':
                if (indexA < 0 || indexB < 0) {
                    break
                }
                for (i = 0; i < this.data.length; i++) {
                    temp = this.data[i][indexA];
                    this.data[i][indexA] = this.data[i][indexB];
                    this.data[i][indexB] = temp;
                }
                break;
            case 'row':
                if (indexA < 0 || indexB < 0) {
                    break
                }
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
};