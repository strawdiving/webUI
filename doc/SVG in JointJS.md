### link的SVG结构
```html
<path class= "connection"/>
<path class="marker-source"/>
<path class="marker-target"/>
<path class="connection-wrap"/>
<g class="labels"/>
<!-- 线上的转折点 vertices-->
<g class="marker-vertices"/>
<g class="marker-arrowheads">
  <g class="marker-arrowhead-group marker-arrowhead-group-source">
  <!-- 三角形-->
    <path class="marker-arrowhead" end="source" d="...">
    </path>
  </g>
</g>
      
```
设置link的属性:
```javascript
var link = new joint.dia.link ({
  source: {x:10, y:80},
  target: {x:350, y:80},
  vertices: [
    {x:20, y:80},
    {x:60, y:80},
    {x:120, y:80}
  ],
  attrs: {}, // 此处设为{}，后面用link.attr({...})进行设置
  labels: [
    { position:0.5, 
      attrs: { 
        text: {
          text: 'label'
        }
      }
    }
  ],
  smooth: true //曲线
});
link.attr({
  '.connection': {stroke:...,'stroke-width': ...},
  '.marker-source': {fill: ...,stroke:..., d:....},
  '.marker-target': {fill: ...,stroke:..., d:....},
});
//设置属性还有如下方式：
link.set('vertices',[......]);
link.set('smooth',true);
```
### element的SVG结构
```html
<g class="element basic Rect">
  <g class="rotatable">
    <g class="scarable">
      <rect/>
    </g>
    <text/>
  </g>
</g>
```
对element通过joint.dia.Element.rotate()旋转，通过joint.dia.Element.resize()缩放。
注：css样式具有比SVG属性更高的优先级

设置element的属性：
```javascript
rect.attr({
  rect: { fill: ..., rx:..., ry:...},
  text: { text: ..., fill: ...}
});
```
JointJS的内置elements
内置elements位于joint.shapes.basic命名空间内，包含
- basic.Rect
- basic.Circle
- basic.Text
- basic.Image

以及一些plugins，包含常用的图元，如
- ERD
- Orgchart
- FSA
- UML
- PN
- DEVS

**可根据SVG元素（rect,text,circle,ellipse,image,path）进行组合，生成任何2D shape，还可在elements中加入html或超链接**
```javascript
joint.shapes.basic.Rect = joint.shapes.basic.Generic.extend({
  markup: '<g class="rotatable"><g class="resizable">........', //参照element的SVG描述
  defaults: joint.util.defaultSupplement({
    type: 'basic.Rect',
    attrs: {
      'rect': {fill......},
      'text': {font-size:10px,
               'ref-x': .5,
               'ref-y': .5,
               ref: 'rect',
               'y-alignment': 'middle',
               'x-alignment': 'middle'
              }
    }, joint.shapes.basic.Generic.prototype.defaults)
});
```
### 带ports的elements
1. 使用joint.shapes.devs plugin,其定义了joint.shapes.devs.Model shape
```javascript
var m1 = new joint.shapes.devs.Model({
  position: ...,
  size:...,
  inports: ["in1",:in2"],
  outports: ["out"],
  ports: {
    groups: {
      'in': {
        attrs: {
          'port-body': { fill:..., magnet: 'passive'
          }
        }
      },
      'out': {
        attrs: {
          'port-body': { fill:..., magnet: 'passive'
          }
        }
      }
    }
  },
  attrs: {
    '.label': { text:...,'ref-x':...,'ref-y':...},
    rect: { fill:...}
  }
});
```
1. 可以查看两个magnet和port连接link的信息：
```javascript
graph.on('change:source change:target',function(link) {
  var sourcePort = link.get('source').port;
  var sourceId = link.get('source').id;
  ...
  var m = ['The port' + sourcePort , 'of element with ID' + sourceId + '</b>'].join(',');
})
```

2. link限制
如：不从input ports开始，不以output ports结束，标记某些magnets ‘passive’。

paper中: validateConnection()和validateMagnet()
```javascript
var paper = new joint.dia.Paper({
  ...
  validateConnection: function(cellViewS,magnetS,cellViewT,magentT,end,linkView) {
    // 防止从同一个元素的outports到inputs
  },
  validMagnet: function(cellView,magnet){
    ...
    return magnet.getAttribute('magnet')!=='passive'; // magnets标记为passive，disable link交互
  }
})
```

3. link snapping
当用户拖拽一个link时，自动搜寻给定半径内最近的port，如果合适，自动连接。
在paper的snapeLinks属性设置:
```javascript
snapLinks: { radius:75 }
```

4. Marking available magnets
当拖拽一个link时，突出显示可连接的magnets
1）将paper的markAvailable属性设为true
2）添加一些css属性，标记可连接的magnets
