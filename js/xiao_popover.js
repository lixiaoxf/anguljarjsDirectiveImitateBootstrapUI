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

angular.module('xiao_popover',[]).
    factory('$position', ['$document', '$window', function ($document, $window) {

        function getStyle(el, cssprop) {
            if (el.currentStyle) { //IE
                return el.currentStyle[cssprop];
            } else if ($window.getComputedStyle) {
                return $window.getComputedStyle(el)[cssprop];
            }
            // finally try and get inline style
            return el.style[cssprop];
        }

        /**
         * Checks if a given element is statically positioned
         * @param element - raw DOM element
         */
        function isStaticPositioned(element) {
            return (getStyle(element, 'position') || 'static' ) === 'static';
        }

        /**
         * returns the closest, non-statically positioned parentOffset of a given element
         * @param element
         */
        var parentOffsetEl = function (element) {
            var docDomEl = $document[0];
            var offsetParent = element.offsetParent || docDomEl;
            while (offsetParent && offsetParent !== docDomEl && isStaticPositioned(offsetParent) ) {
                offsetParent = offsetParent.offsetParent;
            }
            return offsetParent || docDomEl;
        };

        return {
            /**
             * Provides read-only equivalent of jQuery's position function:
             * http://api.jquery.com/position/
             */
            position: function (element) {
                var elBCR = this.offset(element);
                var offsetParentBCR = { top: 0, left: 0 };
                var offsetParentEl = parentOffsetEl(element[0]);
                if (offsetParentEl != $document[0]) {
                    offsetParentBCR = this.offset(angular.element(offsetParentEl));
                    offsetParentBCR.top += offsetParentEl.clientTop - offsetParentEl.scrollTop;
                    offsetParentBCR.left += offsetParentEl.clientLeft - offsetParentEl.scrollLeft;
                }

                var boundingClientRect = element[0].getBoundingClientRect();
                return {
                    width: boundingClientRect.width || element.prop('offsetWidth'),
                    height: boundingClientRect.height || element.prop('offsetHeight'),
                    top: elBCR.top - offsetParentBCR.top,
                    left: elBCR.left - offsetParentBCR.left
                };
            },

            /**
             * Provides read-only equivalent of jQuery's offset function:
             * http://api.jquery.com/offset/
             */
            offset: function (element) {
                var boundingClientRect = element[0].getBoundingClientRect();
                return {
                    width: boundingClientRect.width || element.prop('offsetWidth'),
                    height: boundingClientRect.height || element.prop('offsetHeight'),
                    top: boundingClientRect.top + ($window.pageYOffset || $document[0].documentElement.scrollTop),
                    left: boundingClientRect.left + ($window.pageXOffset || $document[0].documentElement.scrollLeft)
                };
            },

            /**
             * Provides coordinates for the targetEl in relation to hostEl
             */
            positionElements: function (hostEl, targetEl, positionStr, appendToBody) {

                var positionStrParts = positionStr.split('-');
                var pos0 = positionStrParts[0], pos1 = positionStrParts[1] || 'center';

                var hostElPos,
                    targetElWidth,
                    targetElHeight,
                    targetElPos;

                hostElPos = appendToBody ? this.offset(hostEl) : this.position(hostEl);

                targetElWidth = targetEl.prop('offsetWidth');
                targetElHeight = targetEl.prop('offsetHeight');

                var shiftWidth = {
                    center: function () {
                        return hostElPos.left + hostElPos.width / 2 - targetElWidth / 2;
                    },
                    left: function () {
                        return hostElPos.left;
                    },
                    right: function () {
                        return hostElPos.left + hostElPos.width;
                    }
                };

                var shiftHeight = {
                    center: function () {
                        return hostElPos.top + hostElPos.height / 2 - targetElHeight / 2;
                    },
                    top: function () {
                        return hostElPos.top;
                    },
                    bottom: function () {
                        return hostElPos.top + hostElPos.height;
                    }
                };

                switch (pos0) {
                    case 'right':
                        targetElPos = {
                            top: shiftHeight[pos1](),
                            left: shiftWidth[pos0]()
                        };
                        break;
                    case 'left':
                        targetElPos = {
                            top: shiftHeight[pos1](),
                            left: hostElPos.left-targetElWidth
                        };
                        break;
                    case 'bottom':
                        targetElPos = {
                            top: shiftHeight[pos0](),
                            left: shiftWidth[pos1]()
                        };
                        break;
                    default:
                        targetElPos = {
                            top: hostElPos.top - targetElHeight,
                            left: shiftWidth[pos1]()
                        };
                        break;
                }

                return targetElPos;
            }
        };
    }]).
    directive('xiaoPopover',function($templateRequest,$compile,$document,$position,$sce){
        return {
            restrict : 'A',
            scope:true,
            compile : function(eElement,attr){
                var default_template=
                    '<div class="popover fade">'+
                    '<div class="arrow"></div>'+
                    '<h3 class="popover-title">'+
                    attr['title']+
                    '</h3>'+
                    '<div class="popover-content" ng-bind-html="content">'+
                    '</div>'+
                    '</div>'
                var src = attr.popoverTemplateurl;
                //var bravo_template = attr.bravoPopverTemplate;
                var template;
                //if(!bravo_template){
                    if(src){
                        $templateRequest(src,true).then(function(response){
                            template = response
                        });
                    }else{
                        template = default_template;
                    }
                //}
                return {
                    post : function (scope,element,attr){
                        scope.show = '';
                        scope.placement = attr.placement || 'left';
                        scope.title = attr.title;
                        scope.content = $sce.trustAsHtml(attr.content) ;
                        scope.trigger = attr.trigger || 'click';
                        var tooltip;
                        tooltip = $compile(angular.element(template).addClass('{{show}} {{placement}}'))(scope,function(clone){
                            element.after(clone)
                        });
                        var showPopver_dom = function(){
                            if(src){
                                tooltip = $compile(angular.element(template).addClass('{{show}} {{placement}}'))(scope,function(clone){
                                    element.after(clone)
                                });
                            }
                            tooltip.css({ top: 0, left: 0,display:'block'});
                            var ttPosition = $position.positionElements(element, tooltip, scope.placement, false);
                            ttPosition.top += 'px';
                            ttPosition.left+= 'px';
                            tooltip.css( ttPosition );

                        }
                        var removePopver_dom = function(){
                            tooltip.remove();
                        }
                        var show = function(){
                            scope.show ='in '
                            showPopver_dom()
                            tooltip.on('click',function(e){
                                if(angular.element(e.toElement).attr('data-miss')=="popover"){
                                    hide();
                                };
                            })
                        }
                        var hide = function(){
                            scope.show = ''
                            removePopver_dom()
                        }
                        element.on(scope.trigger,function(){
                            if(scope.show == ''){
                                show();
                                scope.$apply()
                            }else{
                                hide();
                                scope.$apply()
                            }
                        })
                    }
                }
            }
        }
    })

