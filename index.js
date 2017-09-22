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
    
    let def = {
        path : '',
        dest: '',
        names: []
    };
    Object.assign( def, option );

    this.catalogName = {};
    this.dest = path.join( process.cwd(), def.dest );

    this.init(def);
}

/**
 * 初始化函数
 *
 * @param {Object}
 */
Catalog.prototype.init = function( config ){
    this.getCatalogName( config.path, config.names, this.catalogName );
    $util.filtration( this.catalogName );
    this.production( config.path );
}

/**
 * 异步读取目录的内容
 *
 * @param {String}
 * @param {Array}
 * @param {Object}
 */
Catalog.prototype.getCatalogName = function( dir, names, tree ){
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
                for( let i = 0 ; i < names.length; i++ ){
                    if( fileName == names[i] ){
                        tree[fileName] = path.relative( path.join( this.dest, '../' ), directory );
                    }
                }

            }
        }else if( stats.isDirectory() ){
            tree[file] = {};

            this.getCatalogName( directory, names, tree[file] );
        }

    });
}

/**
 * 生成json文件
 *
 * @param {String}
 * @param {Object}
 */
Catalog.prototype.production = function( pathName ){
    //创建目录
    fs.mkdir( this.dest, ()=>{
        //文件写入
        fs.writeFile(
            path.relative( pathName, path.join( this.dest, path.basename( pathName ) +'.json' ) ), JSON.stringify(this.catalogName), err => !!err? console.log( err ) : console.log( '成功写入！' )
        );
    } );
}

module.exports = Catalog;
