/**
 * Created by huanghuang on 2017/9/22.
 * Email: 514009729@qq.com
 * describe:
 */

let util = {
    /**
     * 过滤空属性
     * @param obj | Object | 必选 | 需要过滤的对象或数组
     */
    filterEmptyNode( obj ){
        let $util = this;
        function recursion( child, parent, childName  ){
            for( let key in child ){
                if( $util.isEmpty( child[key] ) ){
                    //清理子节点空属性
                    delete child[key];
                }else if( typeof child[key] == 'object' ){
                    //该子节点非空，并且是object时，递归遍历
                    recursion(child[key], child, key);
                }
            }
            //判断子节点是否已全部清空，是则把该节点完全删除
            if( $util.isEmpty(child) && !!childName ){
                delete parent[childName];
            }
        }
        recursion( obj );
    },

    /**
     * 空判断
     * @param any | any | 必选 | 任何值
     * @returns {boolean}
     */
    isEmpty( any ){
        if( any === 0 ){
            return false;
        }else if( typeof any == 'object' ){
            return JSON.stringify( any ) == "{}";
        }else {
            return !any;
        }
    },
};

module.exports = util;
