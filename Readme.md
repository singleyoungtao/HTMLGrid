# HTMLGrid

>Web & JavaScript 实践练习
使用HTML Table实现Grid功能
添加/删除行、列
编辑、大小调整
行、列位置调换
其他

>仅使用原生方法，不使用第三方Lib
代码规范
OOP
控件思想
		
		使用HTML table 实现一个Grid：
        1.	添加删除行列
        2.	编辑调整大小
        3.	行列位置调换
        4.	Enter输入编辑，tab 切换选中单元格
        
        要求不允许使用任何第三方插件，支持到IE9 ;
        界面上所有操作的应给与相应的API可以通过代码完成 （动画除外）,使用控件的思想实现

### 操作说明：
#### 添加删除行列
1. 在表格列号行或者行号行右键，并选择对应操作点击即可

2. 在对应的输入框输入要添加或删除行列的序号，然后点击对应button。如果未输入则默认为0；
输入非数字则无效

#### 编辑调整大小
- 在表格列号行或者行号行放置鼠标并移动，若鼠标变为resize模式则摁下鼠标进行拖动
拖动时鼠标不可离开对应列号行或者行号行，拖动到目标尺寸后松开鼠标

#### 行列位置交换
1. 在表格列号行或者行号行放置鼠标并摁下后移动，拖动时鼠标不可离开对应列号行或者行号行，
拖动到目标行/列后松开鼠标

2. 在对应的输入框中输入要交换的行列号，然后点击button，输入非数字无效

#### Enter输入编辑，tab 切换选中单元格
- 点击单元格进行编辑

1. 点击表格，然后移动鼠标的上下左右键对选中单元格的坐标进行移动
2. 点击表格，然后使用tab 和 shift tab 对单元格坐标进行前后移动
3. 点击界面的上下左右移动按钮进行选中单元格的移动

#### destory
- 点击destory按钮对表格进行移除。