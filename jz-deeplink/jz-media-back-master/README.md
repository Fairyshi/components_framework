## description
some ad channels require the recall media app for the involved dsp vendor. Here is the frontend support of Bailing for the collaberate biz party.

## usage
- install the package
```
tnpm install @alipay/jz-media-back --save
```
- import and init
```
import dspMediaBack from '@alipay/jz-media-back';

class DemoPage extends Component {
  componentDidMount() {
    if (dspMediaBack && typeof dspMediaBack === 'function') {
      dspMediaBack();  // 需要访问全局对象 window，因而初始化调用至于 componentDidMount中
    }
    ...
  }
  ...
}
```
- url with specific param
```
http://foo.alipay.net/index?bailing_media=oppo
```