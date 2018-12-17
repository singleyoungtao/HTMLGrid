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

        deleteInstance: function (instance, container) {
            instance.removeTableEvents();
            Render.removeDOM(container);
            var instanceKeys = Object.keys(instance);
            instanceKeys.forEach(function (item) {
                delete instance[item];
            });
        },

        isNumber: function (obj) {
            return obj === +obj
        }
    }
;
