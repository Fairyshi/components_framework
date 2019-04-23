# 基于G6的转化数据 树型(方向)可视化展现Demo

<a name="7e8b2fa2"></a>
## 效果
![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2019/png/15078/1555053847754-80bc7254-c1b8-4bef-b4c4-7443038fc617.png#align=left&display=inline&height=127&name=image.png&originHeight=193&originWidth=1136&size=23682&status=done&width=746)


<a name="eed333e9"></a>
## G6实现的代码
说明：以下并非最终实现，主要作为对交互稿中的主要功能点及效果进行调研，评估技术可行性
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>流程图</title>
    <style>::-webkit-scrollbar{display:none;}html,body{overflow:hidden;margin:0;}</style>
</head>
<body>
<div id="mountNode"></div>
<script>/*Fixing iframe window.innerHeight 0 issue in Safari*/document.body.clientHeight;</script>
<script src="https://gw.alipayobjects.com/os/antv/pkg/_antv.g6-3.0.0/build/g6.js"></script>
<script src="https://gw.alipayobjects.com/os/antv/assets/lib/jquery-3.2.1.min.js"></script>
<script src="https://gw.alipayobjects.com/os/lib/dagre/0.8.4/dist/dagre.min.js"></script>
<script>
  var data = {
    nodes: [
      {
          id: '0',
          label: '曝光',
          _row: 1,  // 第一层
          _content: '22222222,222人',
          x: 20,
          y: 50,
          anchorPoints:[
            [1, 0.5],  
          ],
          labelCfg: {
            position: 'center',
          },
      }, {
          id: '1',
          label: '点击',
          _content: '11111111,111人',
          _row: 1,
          x: 170,
          y: 50,
          anchorPoints:[
            [0, 0.5],  
            [1, 0.5],  
          ],
          labelCfg: {
            position: 'center',
          },
      }, {
          id: '1__',
          label: '80%',
          _row: 1,
          x: 170,
          y: 50,
          labelCfg: {
            position: 'center',
          },
          shape: 'nodeLabel',
      }, {
          id: '1_1',
          label: '点击到店消费',
          _row: 2,  // 第二层
          x: 170,
          y: 100,
          anchorPoints:[
            [0, 0.5],  
          ],
          labelCfg: {
            position: 'center',
          },
      }, {
          id: '1_1__',
          label: '70%',
          _row: 2,
          x: 170,
          y: 100,
          labelCfg: {
            position: 'center',
          },
          shape: 'nodeLabel',
      }, {
          id: '2',
          label: '领券',
          _row: 1,
          x: 320,
          y: 50,
          anchorPoints:[
            [0, 0.5],  
            [1, 0.5],  
          ]
      }, {
          id: '2__',
          label: '60%',
          _row: 1,
          x: 320,
          y: 50,
          labelCfg: {
            position: 'center',
          },
          shape: 'nodeLabel',
      }, {
          id: '2_1',
          label: '领券到店消费',
          _row: 2,
          x: 320,
          y: 100,
          anchorPoints:[
            [0, 0.5],  
          ]
      }, {
          id: '2_1__',
          label: '50%',
          _row: 2,
          x: 320,
          y: 100,
          labelCfg: {
            position: 'center',
          },
          shape: 'nodeLabel',
      }, {
          id: '3',
          label: '核销',
          _row: 1,
          x: 470,
          y: 50,
          anchorPoints:[
            [0, 0.5],  
            [1, 0.5],  
          ]
      }, {
          id: '3__',
          label: '40%',
          _row: 1,
          x: 470,
          y: 50,
          labelCfg: {
            position: 'center',
          },
          shape: 'nodeLabel',
      }, {
          id: '3_1',
          label: '核销到店消费',
          _row: 2,
          x: 470,
          y: 100,
          anchorPoints:[
            [0, 0.5],  
          ]
      }, {
          id: '3_1__',
          label: '30%',
          _row: 2,
          x: 470,
          y: 100,
          labelCfg: {
            position: 'center',
          },
          shape: 'nodeLabel',
      }
    ],
    edges: [
      {
          id: '0-1',
          source: '0',
          target: '1',
          sourceAnchor: 0, // 指定起始的连接点锚点
          targetAnchor: 0, // 指定终止的连接点锚点
      }, {
          id: '0-1_1',
          source: '0',
          target: '1_1',
          shape: 'hvh',
          sourceAnchor: 1,
          targetAnchor: 0,
      }, {
          id: '1-2',
          source: '1',
          target: '2',
          sourceAnchor: 1,
          targetAnchor: 0,
      }, {
          id: '1-2_1',
          source: '1',
          target: '2_1',
          shape: 'hvh',
          sourceAnchor: 1,
          targetAnchor: 0,
      }, {
          id: '2-3',
          source: '2',
          target: '3',
          sourceAnchor: 1,
          targetAnchor: 0,
      }, {
          id: '2-3_1',
          source: '2',
          target: '3_1',
          shape: 'hvh',
          sourceAnchor: 1,
          targetAnchor: 0,
      }
    ]
  };
 
  G6.registerNode('operation', {
    drawShape: function (cfg, group) {
      var otherProps = cfg._row === 1
        ? { stroke: '#13C2C2', fill: '#E6FFFB' }
        : { stroke: '#1890FF', fill: '#E6F7FF' }; 

      var rect = group.addShape('rect', {
        attrs: cfg._row === 1 
        ? {
          x: cfg.x,
          y: cfg._content ? cfg.y - 10 : cfg.y,
          width: 150,
          height: cfg._content ? 48 : 28,
          radius: cfg._content ? 4 : 12,
          stroke: '#1890FF',
          fill: '#E6F7FF',
          fillOpacity: 0.4,
          lineWidth: 2,            
        } : {
          x: cfg.x,
          y: cfg._content ? cfg.y - 10 : cfg.y,
          width: 150,
          height: cfg._content ? 48 : 28,
          radius: cfg._content ? 24 : 12,
          stroke: '#13C2C2',
          fill: '#E6FFFB',
          fillOpacity: 0.4,
          lineWidth: 2,
        }
      });
      
      var bbbox = rect.getBBox();
      return rect;
    },
    drawLabel: function (cfg, group) {
      var label = group.addShape('text', {
        position: 'center',
        attrs: {
          x: cfg.x + 75,
          y: cfg.y + 14,
          position: 'center',
          text: cfg._content ? cfg.label + cfg._content : cfg.label,
          textAlign: 'center',
          textBaseline: 'middle',
          fill: '#666',
          stroke: '#FFF',
          fontSize: 12,
        }
      });
      return label;
    },
  }, 'single-shape');

  G6.registerNode('nodeLabel', {
    drawShape: function (cfg, group) {
      var otherProps = cfg._row !== 2 
        ? { stroke: '#1890FF', fill: '#E6F7FF' } 
        : { stroke: '#13C2C2', fill: '#E6FFFB' };

      var rect = group.addShape('rect', {
        attrs: cfg._row === 1 
        ? {
          x: cfg.x - 70,
          y: cfg.y + 4,
          width: 50,
          height: 20,
          radius: 4,
          stroke: '#1890FF',
          fill: '#1890FF',
          lineWidth: 2,
        }
        : {
          x: cfg.x - 70,
          y: cfg.y + 4,
          width: 50,
          height: 20,
          radius: 4,
          stroke: '#13C2C2',
          fill: '#13C2C2',
          lineWidth: 2,            
        }
      });
      return rect;
    },
    drawLabel: function (cfg, group) {
      var label = group.addShape('text', {
        position: 'center',
        attrs: {
          x: cfg.x - 45,
          y: cfg.y + 14,
          position: 'center',
          text: cfg.label,
          textAlign: 'center',
          textBaseline: 'middle',
          fill: '#fff',
          stroke: '#fff',
          fontSize: 12,
        }
      });
      return label;
    },
  }, 'single-shape');

  G6.registerEdge('hh', {
    draw(cfg, group) {
      this.drawShape(cfg, group);
      if (cfg.label) {
        // this.drawLabel(cfg, group);
      }
    },  
    drawShape(cfg, group) {
      const startPoint = cfg.startPoint;
      const endPoint = cfg.endPoint;

      const shape = group.addShape('path', {
        attrs: {
          stroke: '#41A9FF',
          endArrow: {
            path: 'M 5,0 L -5,-5 L -5,5',
            d: 5
          },
          path: [
            ['M', startPoint.x, startPoint.y],
            ['L', endPoint.x, endPoint.y]
          ]
        }
      });

      return shape;
    },
    drawLabel: function (cfg, group) {
      const endPoint = cfg.endPoint;
      var label = group.addShape('text', {
        position: 'right',
        attrs: {
          x: endPoint.x - 20,
          y: endPoint.y,
          position: 'right',
          textAlign: 'right',
          text: cfg.label,
          textBaseline: 'middle',
          fill: '#fff',
          stroke: '#fff',
          fontSize: 12,
        }
      });
      return label;
    },
  });

  G6.registerEdge('hvh', {
    draw(cfg, group) {
      this.drawShape(cfg, group);
      if (cfg.label) {
        // this.drawLabel(cfg, group);
      }
    },  
    drawShape(cfg, group) {
      const startPoint = cfg.startPoint;
      const endPoint = cfg.endPoint;

      const shape = group.addShape('path', {
        attrs: {
          stroke: '#13C2C2',
          endArrow: {
            path: 'M 5,0 L -5,-5 L -5,5',
            d: 5
          },
          path: [
            ['M', startPoint.x, startPoint.y],
            ['L', endPoint.x / 3 + 2 / 3 * startPoint.x , startPoint.y],
            ['L', endPoint.x / 3 + 2 / 3 * startPoint.x , endPoint.y],
            ['L', endPoint.x, endPoint.y]
          ]
        }
      });

      return shape;
    },
    drawLabel: function (cfg, group) {
      const endPoint = cfg.endPoint;
      var label = group.addShape('text', {
        position: 'right',
        attrs: {
          x: endPoint.x - 20,
          y: endPoint.y,
          position: 'right',
          textAlign: 'right',
          text: cfg.label,
          textBaseline: 'middle',
          fill: '#fff',
          stroke: '#fff',
          fontSize: 12,
        }
      });
      return label;
    },
  });

  var graph = new G6.Graph({
    container: 'mountNode',
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: 2,
    modes: {
      default: []
    },
    defaultNode: {
      shape: 'operation',
      labelCfg: {
        position: 'right',
        style: {
          fill: '#666',
          stroke: '#FFF',
          fontSize: 14,
          fontWeight: 'bold'
        }
      }
    },
    defaultEdge: {
      shape: 'hh'
    },
    edgeStyle: {
      default: {
        lineWidth: 1,
        stroke: '#41A9FF',
        endArrow: {
          path: 'M 5,0 L -5,-5 L -5,5',
          d: 5
        },
        position: 'right',
      },
      labelCfg: {
        position: 'right',
        style: {
          position: 'right',
          textAlign: 'right',
          offset: -50,
          textBaseline: 'middle',
          fill: '#41A9FF',
          stroke: '#41A9FF',
          fontSize: 12,
        }
      }
    }
  });
  graph.data(data);
  graph.render();
  /* graph.fitView(); */
</script>
</body>
</html>
```

<a name="e463e18e"></a>
## 问题与解决
* 连线起止锚点的指定
  * `sourceAnchor`、 `targetAnchor` 分别指定起止节点上作为连线起点的触点（因为G6的文档及其中对涉及的相关G语法的说明文档中均未提及，后来在G6用户分享在Riddle的开源 Demo 中找到的解决方案）
* 连线上的说明文案设置，起初通过edge传值时的 `label` 字段设置，但改值对自定义折线不生效；对自定义折线的 `label` 设置通过 `drawLabel` 进行设置，但这种设置方式无法产生类似 “文字背景色”的效果，最终通过设置为终点处的普通 带文本的矩形节点进行添加（直接以线的终点作为物理位置，再对改位置添加一定的偏移量生成最终终点）即可
