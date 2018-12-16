var ToolsUtil = {
    initEmptyArr: function (length) {
        var i;
        var arr = new Array(length);
        for (i = 0; i < arr.length; i++) {
            arr[i] = "";
        }
        return arr;
    },

    getCellIndex: function (element) {
        return element.getAttribute('data-index').split('-').map(Number);
    }
};
