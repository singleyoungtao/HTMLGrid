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
        var dataIndex = element.getAttribute('data-index');
        if (dataIndex) {
            return element.getAttribute('data-index').split('-').map(Number);
        }
        return;
    },

    deleteInstance: function (instance) {
        instance.destroy();
        var instanceKeys = Object.keys(instance);
        instanceKeys.forEach(function (item) {
            delete instance[item];
        });
    },

    isNumber: function (obj) {
        return obj === +obj && obj >= 0;
    },

    contains: function (childEle, parentEle) {
        return parentEle.contains(childEle);
    },
    
    errorAlert: function (type, data) {
        var isCorrect = true;
        switch (type) {
            case 'deleteRow':
                isCorrect = !!(data.length - 1);
                break;
            case 'deleteCol':
                isCorrect = !!(data[0].length - 1);
                break;
            default:
                break;
        }
        if (!isCorrect) {
            alert('This is last row or column');
        }
        return isCorrect;
    },
};
