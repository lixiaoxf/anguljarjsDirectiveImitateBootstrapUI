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
angular.module( 'xiao_alert', [])
    .directive('xiaoAlert',function(){
        return {
            restrict : 'A',
            scope : {
                close : '&xiaoAlertBeforeClose',
                closed:'&xiaoAlertAfterClose',
                xiao_close_alert : '=?xiaoAlert'
            },
            compile : function(eElement,attr){
                return {
                    post : function (scope,element,attr){
                        if( !scope.xiao_close_alert || typeof scope.xiao_close_alert != 'boolean'){
                            scope.xiao_close_alert = false;
                        }
                        function close(){
                            scope.close();
                            element.addClass('ng-hide')
                            scope.closed();
                        }
                        function open(){
                            element.removeClass('ng-hide')
                        }
                        function find(){
                            var children = element.children();
                            var finded;
                            for(var i =0; i<children.length; i++){
                                var child = angular.element(children[i]);
                                if(child.attr('miss-data')=="alert"){
                                    finded = child
                                };

                            }
                            return finded;
                        }
                        var ele = find();
                        ele.on('click',function(){
                            scope.xiao_close_alert = true;
                            scope.$apply()
                        })
                        if(scope.xiao_close_alert){
                            close();
                        }else{
                            open();
                        }
                        scope.$watch('xiao_close_alert',function(nv,ov){
                            if(nv==ov){
                                return;
                            }
                            if(nv){
                                close();
                            }else{
                                open()
                            }
                        })
                    }
                }
            }
        }
    })