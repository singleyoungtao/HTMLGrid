function Model(data) {
    this.data = data;
    this.defaultHeight = 25;
    this.defaultWidth = 80;
    this.cellPadding = '10';
    this.cellBoxX = 1;
    this.cellBoxY = 1;
    this.preCellBoxX = 1;
    this.preCellBoxY = 1;

    this.colWidths = initEmptyArr(this.data[0].length +1).map(function () {
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


};