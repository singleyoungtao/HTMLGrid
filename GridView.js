var Render = {
    /**
     * Private Function - Accept the needed params and render the table.
     * @param data
     * @param container
     * @param rowHeights
     * @param colWidths
     * @param cellBoxX
     * @param cellBoxY
     * @param isFirstRender
     */
    render: function (data, container, rowHeights, colWidths, cellBoxX, cellBoxY, isFirstRender) {
        var tableOuterHTML = '<table class="grid-table">';
        tableOuterHTML += this._generateThead(data, rowHeights, colWidths);
        tableOuterHTML += this._generateTbody(data, rowHeights);
        tableOuterHTML += '</table>';
        var wrapperOuterHTML = '<div class="table-container">' + tableOuterHTML + '</div>';
        if (isFirstRender) {
            container.setAttribute('class', container.getAttribute('class') + ' grid-container');
            container.innerHTML = wrapperOuterHTML + this._generateContextMenu();
        } else {
            container.querySelector('.table-container').innerHTML = tableOuterHTML;
        }
        this._initCellBox(container, cellBoxY, cellBoxX);
    },

    /**
     * Private Function - Generate the table thead html string.
     * @param data
     * @param rowHeights
     * @param colWidths
     * @returns {string}
     * @private
     */
    _generateThead: function (data, rowHeights, colWidths) {
        var theadNum = data[0].length;
        var i;
        var theadHTMLString = '<thead class="grid-thead"><tr><th data-index="0-0" style="height: ' + rowHeights[0] +
            'px; min-width: ' + colWidths[0] + 'px"></th>';
        for (i = 0; i < theadNum; i++) {
            theadHTMLString += '<th data-index="0-' + (i + 1) + '"  style="min-width: ' + colWidths[i + 1] + 'px;">' + ToolsUtil.convert10DTo26D(i + 1) + '</th>';
        }
        theadHTMLString += '</tr></thead>';
        return theadHTMLString;
    },

    /**
     * Private Function - Generate the table content html string
     * @param data
     * @param rowHeights
     * @returns {string}
     * @private
     */
    _generateTbody: function (data, rowHeights) {
        var trNum = data.length;
        var tdNum = data[0].length;
        var i, j;
        var trHTMLString = "";
        for (i = 0; i < trNum; i++) {
            trHTMLString += '<tr><td data-index="' + (i + 1) + '-0" class="table-col" style=" height:' + rowHeights[i + 1] + 'px;">' + (i + 1);
            for (j = 0; j < tdNum; j++) {
                trHTMLString += '<td data-index="' + (i + 1) + '-' + (j + 1) + '"><div><input value="' + data[i][j] + '"></div></td>';
            }
            trHTMLString += '</tr>';
        }
        return trHTMLString;
    },

    /**
     * Private
     * @returns {string}
     * @private
     */
    _generateContextMenu: function () {
        return '<div class="context-menu"><ul><li data-type="insert-row" class="row">插入行</li><li data-type="insert-col" class="col">插入列</li>' +
            '<li data-type="delete-row" class="row">删除行</li><li data-type="delete-col" class="col">删除列</li></ul></div>';
    },

    /**
     * Private Function - Generate the focused cell box.
     * @param container
     * @param cellBoxY
     * @param cellBoxX
     * @private
     */
    _initCellBox: function (container, cellBoxY, cellBoxX) {
        var table = container.querySelector('table');
        var firstTableCell;
        if (table.rows[cellBoxY] && table.rows[cellBoxY].cells[cellBoxX]) {
            firstTableCell = table.rows[cellBoxY].cells[cellBoxX];
            firstTableCell.style.border = '3px solid #4CAF50';
        }
    },

    /**
     * Private Function - Re-render the focused cell box.
     * @param wrapper
     * @param cellIndexX
     * @param cellIndexY
     * @param precellX
     * @param precellY
     */
    moveFocusedCellBox: function (wrapper, cellIndexX, cellIndexY, precellX, precellY) {
        if (precellX === cellIndexX && precellY === cellIndexY) {
            return;
        }
        var table = wrapper.querySelector('table');
        var focusedTableCell = table.rows[cellIndexY].cells[cellIndexX];
        focusedTableCell.style.border = '3px solid #4CAF50';
        focusedTableCell.querySelector('input').focus();
        var preFocusedTableCell;
        if (table.rows[precellY] && table.rows[precellY].cells[precellX]) {
            preFocusedTableCell = table.rows[precellY].cells[precellX];
            preFocusedTableCell.removeAttribute('style');
        }
    },

    /**
     * Private Function - Remove the dom of table container.
     * @param container
     */
    removeDOM: function (container) {
        container.innerHTML = '';
    }
};
