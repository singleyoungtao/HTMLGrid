var Render = {
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

    _generateThead: function (data, rowHeights, colWidths) {
        var theadNum = data[0].length;
        var i;
        var theadHTMLString = '<thead class="grid-thead"><tr><th data-index="0-0" style="height: ' + rowHeights[0] +
            'px; min-width: ' + colWidths[0] + 'px"></th>';
        for (i = 0; i < theadNum; i++) {
            theadHTMLString += '<th data-index="0-' + (i + 1) + '"  style="min-width: ' + colWidths[i + 1] + 'px;">' + (i+1) + '</th>';
        }
        theadHTMLString += '</tr></thead>';
        return theadHTMLString;
    },

    _generateTbody: function (data, rowHeights) {
        var trNum = data.length;
        var tdNum = data[0].length;
        var i, j;
        var trHTMLString = "";
        for (i = 0; i < trNum; i++) {
            trHTMLString += '<tr><td data-index="' + (i + 1) + '-0" style="background-color: #aaaaaa; height:' + rowHeights[i + 1] + 'px;">' + (i+1);
            for (j = 0; j < tdNum; j++) {
                trHTMLString += '<td data-index="' + (i + 1) + '-' + (j + 1) + '"><div><input value="' + data[i][j] + '"></div></td>';
            }
            trHTMLString += '</tr>';
        }
        return trHTMLString;
    },

    _generateContextMenu: function () {
        return '<div class="context-menu"><ul><li data-type="insert-row" class="row">插入行</li><li data-type="insert-col" class="col">插入列</li>' +
            '<li data-type="delete-row" class="row">删除行</li><li data-type="delete-col" class="col">删除列</li></ul></div>';
    },

    _initCellBox: function (container, cellBoxY, cellBoxX) {
        var table = container.querySelector('table');
        var firstTableCell = table.rows[cellBoxY].cells[cellBoxX];
        firstTableCell.style.border = '4px solid #009a61';
    },

    moveFocusedCellBox: function (wrapper, cellIndexX, cellIndexY, precellX, precellY) {
        var table = wrapper.querySelector('table');
        var focusedTableCell = table.rows[cellIndexY].cells[cellIndexX];
        focusedTableCell.style.border = '4px solid #009a61';
        focusedTableCell.querySelector('input').focus();
        var preFocusedTableCell = table.rows[precellY].cells[precellX];
        preFocusedTableCell.removeAttribute('style');
    },
    
    removeDOM: function (container) {
        container.innerHTML = '';
    }
};
