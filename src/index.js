
// 通过 js 的方式引入图片 
// import logo from './goback.png';
// let img = new Image();
// img.src = logo;
// document.body.appendChild(img);

// 引入 jquery
// import $ from "jquery";
// console.log("window.$",window.$)
// console.log("$",$)

// 引入 polyfill  es7的补丁包
// require("@babel/polyfill");

// 引入 index.css
// require('./index.css');

// 引入 a.js
// require('./a');


// console.log(1234)
// console.log('sxq')

// es6 写法
// class Amail {
//     constructor(){
//         console.log()
//     }
// }

let button = document.createElement('button');
button.innerHTML = "YES!"
button.onclick = function(){
    // stage -2 返回promise
    import('./a.js').then((data)=>{
        console.log(data)
    })
    
}
document.body.appendChild(button)