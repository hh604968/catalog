/**
 * Created by huanghuang on 2017/9/21.
 * Email: 514009729@qq.com
 * describe:
 */

const path = require( 'path' );
const fs = require("fs");
const $util = require('./util/util.js');

function Catalog( option ){
    //使this正确指向当前函数
    if (!(this instanceof Catalog)) {
        return new Catalog(option);
    }
    
    var def = {
        path : '',
        dest: '',
        cite: '',
        names: []
    };
    //参数合并
    Object.assign( def, option );

    //获取命令启动目录地址
    this._dest = path.join( process.cwd(), def.dest );

    this.init( def );
}

/**
 * 初始化函数
 *
 * @param {Object}
 */
Catalog.prototype.init = function( config ){

    let catalog = {};

    //读取目录文件
    this.getCatalog( config, catalog );

    //过滤空属性
    $util.filterEmptyNode( catalog );

    //生成json文件
    this.production( path.join( process.cwd(), config.dest ), config.path );
}

/**
 * 读取目录的内容
 *
 * @param {String}
 * @param {Array}
 * @param {Object}
 */
Catalog.prototype.getCatalog = function( config, catalog ){

    function recursionReaddir( dir, tree ){
        //读取文件目录
        fs.readdirSync( dir ).forEach( ( file )=>{
            //获取子级文件目录名称
            const directory = path.join( dir, file );

            const stats = fs.statSync( directory );

            if( stats.isFile() ){
                //获取文件后缀名名称
                let extName = path.extname( directory );

                if( extName == '.html' ){

                    //加一下名称验证
                    let fileName = file.substring( 0, file.lastIndexOf('.') );
                    for( let i = 0 ; i < config.names.length; i++ ){
                        if( fileName == config.names[i] ){
                            tree[fileName] = path.relative( config.cite, directory );
                        }
                    }

                }
            }else if( stats.isDirectory() ){
                tree[file] = {};

                recursionReaddir( directory, tree[file] );
            }

        });
    }

    recursionReaddir( config.path, catalog );
}

/**
 * 生成json文件
 *
 * @param {String}
 * @param {String}
 */
Catalog.prototype.production = function( from, to ){
    //创建目录
    fs.mkdir( from, ()=>{
        //文件写入
        fs.writeFile(
            path.relative( to, path.join( from, path.basename( to ) +'.json' ) ), JSON.stringify(this._catalog), err => !!err? console.log( err ) : console.log( 'write success path: ' + from )
        );
    } );
}

module.exports = Catalog;
