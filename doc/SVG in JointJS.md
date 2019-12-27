link的SVG结构
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
element的SVG结构
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
