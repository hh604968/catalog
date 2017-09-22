/**
 * Created by huanghuang on 2017/9/22.
 * Email: 514009729@qq.com
 * describe:
 */

let util = {
    filtration( obj, parent, index ){
        for( let key in obj ){

            if( this.isEmpty( obj[key] ) ){
                delete obj[key];
            }else if( typeof obj[key] == 'object' ){
                this.filtration(obj[key], obj, key);
            }

        }
        if( typeof parent == 'object' && this.isEmpty(obj) ){
            delete parent[index];
        }
    },
    isEmpty( any ){
        if( any === 0 ){
            return false;
        }else if( typeof any == 'object' ){
            return JSON.stringify( any ) == "{}";
        }else if( !!any ){
            return false;
        }
        return true;
    },
};

module.exports = util;
