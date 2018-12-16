function Grid(data, dom) {
    this.isFirstInit = true;
    this.resizable = false;
    this.isResizing = false;
    this.isSwapping = false;
    this.mouseX = 0;
    this.mouseY = 0;

    this.init(data, dom);
}

Grid.prototype = {
    init: function (data, container) {
        this.model = new Model(data);
        this.container = container;
        Render.render(this.model.data, this.container, this.model.rowHeights, this.model.colWidths, this.model.cellBoxX, this.model.cellBoxY);
        this.bindTableEvents();
        this.isFirstInit = false;
    },

    bindTableEvents: function () {

    },

    removeTableEvents: function () {

    },

    insertRow: function (index) {
        this.model.insertRow(index);
        Render.render(this.model.data, this.container, this.model.rowHeights, this.model.colWidths, this.model.cellBoxX, this.model.cellBoxY);
    },

    insertCol: function (index) {
        this.model.insertCol(index);
        Render.render(this.model.data, this.container, this.model.rowHeights, this.model.colWidths, this.model.cellBoxX, this.model.cellBoxY);
    },

    deleteRow: function (index) {
        this.model.deleteRow(index);
        Render.render(this.model.data, this.container, this.model.rowHeights, this.model.colWidths, this.model.cellBoxX, this.model.cellBoxY);
    },

    deleteCol: function (index) {
        this.model.deleteCol(index);
        Render.render(this.model.data, this.container, this.model.rowHeights, this.model.colWidths, this.model.cellBoxX, this.model.cellBoxY);
    },

    swapPosition: function (type, indexA, indexB) {
        this.model.swapPosition(type, indexA, indexB);
        Render.render(this.model.data, this.container, this.model.rowHeights, this.model.colWidths, this.model.cellBoxX, this.model.cellBoxY);
    }
};