
/* global.requestAnimationFrame = global.requestAnimationFrame || function requestAnimationFrame(cb) {
  return setTimeout(cb, 0);
};

const Enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');

Enzyme.configure({ adapter: new Adapter() });

Object.assign(Enzyme.ReactWrapper.prototype, {
  openSelect() {
    this.find('.jz-bizTable').simulate('click');
    jest.runAllTimers();
    this.update();
  },
  selectNode(index) {
    this.find('.jz-bizTable-bizTable-node-content-wrapper').at(index).simulate('click');
  },
}); */
