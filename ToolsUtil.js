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

    convert10DTo26D: function (num) {
        var code = '';
        var temp;
        for (num; num > 0; num = (num - temp) / 26) {
            temp = num % 26;
            if (temp === 0) {
                temp = 26;
            }
            code = String.fromCharCode(64 + parseInt(temp)) + code;
        }
        return code;
    },

    convert26DTo10D: function (code) {
        var num = 0;
        var reg = /^[A-Z]+$/g;
        if (!reg.test(code)) {
            return "Input 26 Decimal Number";
        }
        for (var i = code.length - 1, j = 1; i >= 0; i--, j *= 26) {
            num += (code[i].charCodeAt() - 64) * j;
        }
        return num;
    }
};
