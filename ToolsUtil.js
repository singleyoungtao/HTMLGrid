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
    },
    
    deleteInstance: function (instance, container) {
        instance.removeTableEvents();
        Render.removeDOM(container);
        var instanceKeys = Object.keys(instance);
        instanceKeys.forEach(function (item) {
            delete instance[item];
        });
    }
};
