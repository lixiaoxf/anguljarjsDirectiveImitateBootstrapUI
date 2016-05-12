# anguljarjsDirectiveImitateBootstrapUI
angular指令实现bootstrap插件效果

githubpages: http://lixiaoxf.github.io/anguljarjsDirectiveImitateBootstrapUI

## xiaoAlert
/*
 * 引用boostrap alert 样式
 * 使用方法：
 *    <div ng-controller="alertDemoController">
 *       <div class="alert alert-block alert-error fade in" xiao-alert>
 *          <button type="button" class="close" miss-data="alert">×</button>
 *          <h4 class="alert-heading">Oh snap! You got an error!</h4>
 *          <p>Change this and that and try again. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Cras mattis consectetur purus sit amet fermentum.</p>
 *        </div>
 *    </div>
 *
 *    如果想在控制器中控制 需要在当前作用域设置一个变量 并且把变量名传给指令 变量类型为布尔类型
 *    true 代表关闭弹窗 false 代表弹出弹窗
 *
 *    例：
 *
 *        html:
 *
 *           <div class="alert alert-block alert-error fade in" xiao-alert = "isclose">
 *
 *        controller：
 *
 *           app.cuntroller("test",function($scope){
 *               $scope.isclose = false
 *           })
 *
 *    也可以设置弹出前后的函数调用。给指令所在元素增加 xiaoAlertBeforeClose 或者 xiaoAlertAfterClose，
 *    xiaoAlertBeforeClose 代表弹窗关闭前调用的函数，
 *    xiaoAlertAfterClose  代表弹窗关闭后调用的函数
 *
 *    例：
 *       html:
 *
 *          <div class="alert alert-block alert-error fade in" xiao-alert = "isclose" xiao-alert-before-close="before()" xiao-alert-after-close = "after()" >
 *
 *       controller:
 *
 *           app.cuntroller("test",function($scope){
 *              $scope.isclose = false；
 *              //关闭前调用
 *              $scope.before = function(){
 *                  do something......
 *              }
 *              //关闭后调用
 *              $scope.after = function(){
 *                  do something......
 *              }
 *           })
 *
 *
 * */

## xiaoPopover
/*
 * 引用boostrap alert 样式
 *
 * 指令实现bootstrap popover效果 而且可以直接指定模板地址 来替换默认显示的样式
 *
 * @param      data-title      标题
 * @param      data-content    主题内容
 * @param      data-placement  显示的方位
 * @param      popover-templateurl  模板地址
 *
 * 使用方法：
 *
 *   <div class="btn" xiao-popover data-title="demo" data-content="i am demo">demo1 left</div>
 *
 *   <div class="btn" xiao-popover data-title="demo" data-content="i am demo" data-placement="top" popover-templateurl="template/popver_template.html">demo1 top</div>
 *
 *
 * */
