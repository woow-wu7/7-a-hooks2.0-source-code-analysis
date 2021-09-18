import { useEffect } from 'react';

// image/vnd.microsoft.icon MIME类型只有当图像真的是ICO文件时才会起作用
// image/x-icon 会同时也适用于位图与GIF
// 主要是为了兼容扩展名为ico的非ico文件
const ImgTypeMap = {
  SVG: 'image/svg+xml',
  ICO: 'image/x-icon',
  GIF: 'image/gif',
  PNG: 'image/png',
};

type ImgTypes = keyof typeof ImgTypeMap;

// 1
// useFavicon
// 作用：用于设置和切换页面 favicon
// favicon 是图标的意思

// 2
// link 标签
// - 属性
//  - rel： 规定 ( 当前文档 ) 与 ( 被连接文档 ) 之间的关系 -> icon
//  - type：规定被链接文档的 MiME 类型

const useFavicon = (favUrl: string) => {
  useEffect(() => {
    if (!favUrl) return;

    const cutUrl = favUrl.split('.');
    const imgSuffix = cutUrl[cutUrl.length - 1].toLocaleUpperCase() as ImgTypes;
    // imgSuffix：数组最后一个元素字符串转成大写
    // suffix：后缀

    const link: HTMLLinkElement =
      document.querySelector("link[rel*='icon']") || document.createElement('link'); // 创建link标签，link标签用来加载css

    link.type = ImgTypeMap[imgSuffix];
    link.href = favUrl;
    // 大部分浏览器只会识别'icon' 只有IE会识别整个名称'shortcut icon'
    link.rel = 'shortcut icon';

    document.getElementsByTagName('head')[0].appendChild(link); // 将 link 标签添加到 head 头部
    // 1
    // document.getElementsByTagName()
    // 返回值：返回符合条件的 ( 元素节点 )，是 ( HTMLCollection类型，动态类型 )
    // 如何记忆：因为 getElementsByTagName 中 ( getElements是获取元素 )，所以是 ( 元素集合 )
    // 2
    // HTMLCollection 和 NodeList 的区别
    // - NodeList
    //    - 一个节点的集合，即可以包含 ( 元素节点 ) 和 ( 其他类型节点 )
    //    - 静态集合，不受DOM树变化的影响
    //    - 只能通过 ( index ) 来获取
    //    - 返回NodeList的查询
    //      - getElementsByName --------> 选择拥有 name 属性的HTML元素 ----> 比如form表单就可以设置name属性
    //      - querySelectionAll --------> 接受 一个css选择器作为参数，返回匹配选择器的 ( 元素节点 ) 组成的 ( NodeList对象 )
    // - HTMLCollection
    //    - 元素集合，只有 ( 元素节点 )
    //    - 动态集合，DOM树发生变化，HTMLCollection也会随之变化
    //    - 可以通过 ( name, id, index ) 等来获取
    //    - 返回HTMLCollection的查询
    //      - getElementsByTagName -----> 搜索HTML标签名(注意参数是标签字符串，HTML标签名大小写不敏感)，返回符合条件的元素，返回值类值类型是 ( HTMLCollection )，可以 ( 实时反应HTML文档的变化 )，如果没有匹配的元素，则返回一个空集
  }, [favUrl]);
};

export default useFavicon;
