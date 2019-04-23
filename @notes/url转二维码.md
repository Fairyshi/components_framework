# url转二维码

```
// 引入外部库
import qr from 'qr-encode';

var dataURI = qr("https://ant.design/components/table-cn", {type: 6, size: 6, level: 'Q'});

// '#main' or '#root' is the target container of the generated qr img
var targetContainer = '#main'; 

```
  componentDidMount() {
    var img = new Image();
    img.src = dataURI;
    
    document
      .querySelector(targetContainer)
      .appendChild(img);
  }
```
```

