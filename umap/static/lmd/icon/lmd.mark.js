
//定义几种标志
lmd.MARKER_WARMING = 1; //警告标志
lmd.MARKER_FORBID  = 2; //禁令标志
lmd.MARKER_INDICATION = 3;//指示标志
lmd.MARKER_ROAD = 4;//指路标志

//定义对应的class处理对象
lmd.MARKER_CLASS_RECT = 'Rect'; //矩形
lmd.MARKER_CLASS_SQUARE = 'Square'; //正方形
lmd.MARKER_CLASS_CIRCLE = 'LmdCircle'; //圆形
lmd.MARKER_CLASS_OPAQUE = 'Opaque'; //其他

lmd.marker = [null];
//警告标志数据的添加
lmd.marker.push({name: '警告标志',childs:[null]});
lmd.marker[lmd.MARKER_WARMING]['childs'].push({name:'三角形','class': lmd.MARKER_CLASS_OPAQUE, prex:'L',childs:[null],wife:[null]});
lmd.marker[lmd.MARKER_WARMING]['childs'][1]['childs'].push({speed:'100-120',size:'130'})
lmd.marker[lmd.MARKER_WARMING]['childs'][1]['childs'].push({speed:'71-99',size:'110'})
lmd.marker[lmd.MARKER_WARMING]['childs'][1]['childs'].push({speed:'40-70',size:'90'})
lmd.marker[lmd.MARKER_WARMING]['childs'][1]['childs'].push({speed:'<40',size:'70'})

//警告标志之三角形
var temp = [
	"警1 交叉路口（环形）",
	"警1 交叉路口（T右）",
	"警1 交叉路口（十字）",
	"警1 交叉路口（右上）",
	"警1 交叉路口（右下）",
	"警1 交叉路口（左上）",
	"警1 交叉路口（左下）",
	"警1 交叉路口（T）",
	"警1 交叉路口（错位）",
	"警1 交叉路口（T左）",
	"警2 急弯（左）",
	"警2 急弯（右）",
	"警7 右侧变窄",
	"警7 两侧变窄",
	"警7 左侧变窄",
	"警8 窄桥",
	"警10 注意行人",
	"警11 注意儿童",
	"警12 注意牲畜",
	"警13 注意野生动物",
	"警14 注意信号灯",
	"警15 注意落石(左)",
	"警15 注意落石(右)",
	"警16 注意横风",
	"警17 易滑",
	"警18 傍山险路（左）",
	"警18 傍山险路（右）",
	"警19 堤坝（左）",
	"警19 堤坝（右）",
	"警20 注意村庄",
	"警21 隧道",
	"警22 渡口",
	"警23 驼峰桥",
	"警24 路面不平",
	"警25 减速丘",
	"警26 路面低洼",
	"警27 过水路面",
	"警28 有人看守铁道路口",
	"警29 无人看守铁道路口",
	"警32 注意非机动车",
	"警33 注意残疾人",
	"警34 事故易发路段",
	"警35 慢行",
	"警36 绕行（两侧）",
	"警36 绕行（右）",
	"警36 绕行（左）",
	"警37 注意危险",
	"警38 施工",
	"警39 建议限速",
	"警40 隧道开车灯",
	"警41 注意潮汐车道",
	"警42 注意保持车距",
	"警43 丁字平面交叉",
	"警43 十字平面交叉",
	"警44 注意合流（左下）",
	"警44 注意合流（右下）",
	"警46 注意雨（雪）天",
	"警46 注意雾天",
	"警46 注意路面结冰",
	"警46 注意不利气象条件",
	"警47 注意前方车辆排队"
]
for(var i = 0, len = temp.length; i < len; i++){
  lmd.marker[lmd.MARKER_WARMING]['childs'][1]['wife'].push(temp[i])
}

lmd.marker[lmd.MARKER_WARMING]['childs'].push({name:'矩形','class':lmd.MARKER_CLASS_RECT,prex:'W*H',childs:[null],wife:[null]});
lmd.marker[lmd.MARKER_WARMING]['childs'][2]['childs'].push({speed:'40-70',size:'120*170'})
lmd.marker[lmd.MARKER_WARMING]['childs'][2]['childs'].push({speed:'<40',size:'90*130'})
//警告标志之矩形
temp = [
	"警45 避险车道（横）",
	"警45 避险车道（纵）",
	"警45 避险车道（进入 横）",
	"警45 避险车道（进入 纵）",
	"警45 避险车道（预告1km 横）",
	"警45 避险车道（预告1km 纵）",
	"警45 避险车道（预告2km 横）",
	"警45 避险车道（预告2km 纵）",
	"警45 避险车道（预告500m 横）",
	"警45 避险车道（预告500m 纵）"
]
for(var i = 0, len = temp.length; i < len; i++){
  lmd.marker[lmd.MARKER_WARMING]['childs'][2]['wife'].push(temp[i])
}

lmd.marker.push({name:'禁令标志', childs:[null]});
lmd.marker[lmd.MARKER_FORBID]['childs'].push({name:'圆形','class':lmd.MARKER_CLASS_CIRCLE,prex:'D', childs:[null],wife:[null]});
lmd.marker[lmd.MARKER_FORBID]['childs'][1]['childs'].push({speed:'100-120',size:'120',icon:'2-1-1.png'})
lmd.marker[lmd.MARKER_FORBID]['childs'][1]['childs'].push({speed:'71-99',size:'100',icon:'2-1-2.png'})
lmd.marker[lmd.MARKER_FORBID]['childs'][1]['childs'].push({speed:'40-70',size:'80',icon:'2-1-3.png'})
lmd.marker[lmd.MARKER_FORBID]['childs'][1]['childs'].push({speed:'<40',size:'60',icon:'2-1-4.png'})
//警告标志之三角形
var temp = [
	"禁3 会车让行",
	"禁4 禁止通行",
	"禁5 禁止驶入",
	"禁6 禁止机动车驶入",
	"禁7 禁止载货汽车驶入",
	"禁8 禁止电动三轮车驶入",
	"禁9 禁止大型客车驶入",
	"禁10 禁止小型客车驶入",
	"禁11 禁止挂车、半挂车驶入",
	"禁12 禁止拖拉机驶入",
	"禁13 禁止三轮汽车、低速货车驶入",
	"禁14 禁止摩托车驶入",
	"禁15 禁止标志上所示的两种车辆驶入",
	"禁16 禁止各类非机动车进入",
	"禁17 禁止畜力车进入",
	"禁18 禁止人力客运三轮车进入",
	"禁19 禁止人力货运三轮车进入",
	"禁20 禁止人力车进入",
	"禁21 禁止行人进入",
	"禁22 禁止向左转弯",
	"禁22 禁止载货汽车左转",
	"禁23 禁止向右转弯",
	"禁23 禁止小客车向右转弯",
	"禁24 禁止直行",
	"禁25 禁止向左向右转弯",
	"禁26 禁止直行和向左转弯",
	"禁27 禁止直行和向右转弯",
	"禁28 禁止掉头",
	"禁29 禁止超车",
	"禁30 解除禁止超车",
	"禁31 禁止停车",
	"禁32 禁止长时停车",
	"禁33 禁止鸣喇叭",
	"禁34 限制宽度",
	"禁35 限制高度",
	"禁36 限制质量",
	"禁37 限制轴重",
	"禁38 限制速度",
	"禁39 解除限制速度",
	"禁40 停车检查",
	"禁41 禁止运输危险物品车辆驶入",
	"禁42 海关"
]
for(var i = 0, len = temp.length; i < len; i++){
  lmd.marker[lmd.MARKER_FORBID]['childs'][1]['wife'].push(temp[i])
}

lmd.marker[lmd.MARKER_FORBID]['childs'].push({name:'三角形','class': lmd.MARKER_CLASS_OPAQUE, prex:'L',childs:[null],wife:[null]});
lmd.marker[lmd.MARKER_FORBID]['childs'][2]['childs'].push({speed:'40-70',size:'90',icon:'2-2-1.png'})
lmd.marker[lmd.MARKER_FORBID]['childs'][2]['childs'].push({speed:'<40',size:'70', icon:'2-2-2.png'})
var temp = [
	"禁2 减速让行"
]
for(var i = 0, len = temp.length; i < len; i++){
  lmd.marker[lmd.MARKER_FORBID]['childs'][2]['wife'].push(temp[i])
}

lmd.marker[lmd.MARKER_FORBID]['childs'].push({name:'八角形','class':lmd.MARKER_CLASS_OPAQUE, prex:'L',childs:[null],wife:[null]});
lmd.marker[lmd.MARKER_FORBID]['childs'][3]['childs'].push({speed:'40-70',size:'80',icon:'2-3-1.png'})
lmd.marker[lmd.MARKER_FORBID]['childs'][3]['childs'].push({speed:'<40',size:'60', icon:'2-3-2.png'})
var temp = [
	"禁1 停车让行"
]

for(var i = 0, len = temp.length; i < len; i++){
  lmd.marker[lmd.MARKER_FORBID]['childs'][3]['wife'].push(temp[i])
}

lmd.marker[lmd.MARKER_FORBID]['childs'].push({name:'矩形','class':lmd.MARKER_CLASS_RECT,prex:'W*H',childs:[null],wife:[null]});
lmd.marker[lmd.MARKER_FORBID]['childs'][4]['childs'].push({speed:'40-70',size:'120*170',icon:'2-4-1.png'})
lmd.marker[lmd.MARKER_FORBID]['childs'][4]['childs'].push({speed:'<40',size:'90*130', icon:'2-4-2.png'})
var temp = [
	"禁43 区域限制速度",
	"禁44 区域限制速度解除",
	"禁45 区域禁止长时停车",
	"禁46 区域禁止长时停车解除",
	"禁47 区域禁止停车",
	"禁48 区域禁止停车解除"
]
for(var i = 0, len = temp.length; i < len; i++){
  lmd.marker[lmd.MARKER_FORBID]['childs'][4]['wife'].push(temp[i])
}

lmd.marker.push({name:'指示标志', childs:[null]});
lmd.marker[lmd.MARKER_INDICATION]['childs'].push({name:'圆形','class':lmd.MARKER_CLASS_CIRCLE,prex:'D', childs:[null],wife:[null]});
lmd.marker[lmd.MARKER_INDICATION]['childs'][1]['childs'].push({speed:'100-120',size:'120',icon:'3-1-1.png'})
lmd.marker[lmd.MARKER_INDICATION]['childs'][1]['childs'].push({speed:'71-99',size:'100',icon:'3-1-2.png'})
lmd.marker[lmd.MARKER_INDICATION]['childs'][1]['childs'].push({speed:'40-70',size:'80',icon:'3-1-3.png'})
lmd.marker[lmd.MARKER_INDICATION]['childs'][1]['childs'].push({speed:'<40',size:'60',icon:'3-1-4.png'})
var temp = [
	"指示1 直行",
	"指示2 向左转弯",
	"指示3 向右转弯",
	"指示4 直行和向左转弯",
	"指示5 直行和向右转弯",
	"指示6 向左和向右转弯",
	"指示7 靠右侧道路行驶",
	"指示8 靠左侧道路行驶",
	"指示9 立体交叉直行和左转弯行驶",
	"指示10 立体交叉直行和右转弯行驶",
	"指示11 环岛行驶",
	"指示14 步行",
	"指示15 鸣喇叭",
	"指示16 最低限速",
	"指示29 机动车行驶",
	"指示31 非机动车行驶"
]
for(var i = 0, len = temp.length; i < len; i++){
  lmd.marker[lmd.MARKER_INDICATION]['childs'][1]['wife'].push(temp[i])
}

lmd.marker[lmd.MARKER_INDICATION]['childs'].push({name:'正方形','class':lmd.MARKER_CLASS_SQUARE,prex:'L', childs:[null],wife:[null]});
/*lmd.marker[lmd.MARKER_INDICATION]['childs'][2]['childs'].push({speed:'100-120',size:'120',icon:'3-2-1.png'})
lmd.marker[lmd.MARKER_INDICATION]['childs'][2]['childs'].push({speed:'71-99',size:'100',icon:'3-2-2.png'})
lmd.marker[lmd.MARKER_INDICATION]['childs'][2]['childs'].push({speed:'40-70',size:'80',icon:'3-2-3.png'})
lmd.marker[lmd.MARKER_INDICATION]['childs'][2]['childs'].push({speed:'<40',size:'60',icon:'3-2-4.png'})*/
lmd.marker[lmd.MARKER_INDICATION]['childs'][2]['childs'].push({speed:'40-70',size:'80',icon:'3-5-1.png'})
lmd.marker[lmd.MARKER_INDICATION]['childs'][2]['childs'].push({speed:'<40',size:'60',icon:'3-5-2.png'})
var temp = [
	"指示18 会车先行"
]
for(var i = 0, len = temp.length; i < len; i++){
  lmd.marker[lmd.MARKER_INDICATION]['childs'][2]['wife'].push(temp[i])
}


lmd.marker[lmd.MARKER_INDICATION]['childs'].push({name:'长方形','class':lmd.MARKER_CLASS_RECT,prex:'W*H', childs:[null],wife:[null]});
lmd.marker[lmd.MARKER_INDICATION]['childs'][3]['childs'].push({speed:'100-120',size:'190*140',icon:'3-3-1.png'})
lmd.marker[lmd.MARKER_INDICATION]['childs'][3]['childs'].push({speed:'71-99',size:'160*120',icon:'3-3-2.png'})
lmd.marker[lmd.MARKER_INDICATION]['childs'][3]['childs'].push({speed:'40-70',size:'140*100',icon:'3-3-3.png'})
var temp = [
	"指示17 路口优先通行",
	"指示19 人行横道",
	"指示20 右转车道",
	"指示21 左转车道",
	"指示22 直行车道",
	"指示23 直行和右转合用车道",
	"指示24 直行和左转合用车道",
	"指示25 掉头车道",
	"指示26 掉头和左转合用车道",
	"指示28 公交线路专用车道",
	"指示30 机动车车道",
	"指示32 非机动车车道",
	"指示33 快速公交系统专用车道",
	"指示34 多乘员车辆专用车道",
	"指示35 停车位(右)",
	"指示35 停车位(左)",
	"指示35 停车位",
	"指示35 停车位（区域）",
	"指示36 允许掉头"
]
for(var i = 0, len = temp.length; i < len; i++){
  lmd.marker[lmd.MARKER_INDICATION]['childs'][3]['wife'].push(temp[i])
}

lmd.marker[lmd.MARKER_INDICATION]['childs'].push({name:'单行线-长方形','class':lmd.MARKER_CLASS_RECT,prex:'L', childs:[null],wife:[null]});
lmd.marker[lmd.MARKER_INDICATION]['childs'][4]['childs'].push({speed:'100-120',size:'120*60'})
lmd.marker[lmd.MARKER_INDICATION]['childs'][4]['childs'].push({speed:'71-99',size:'100*50'})
lmd.marker[lmd.MARKER_INDICATION]['childs'][4]['childs'].push({speed:'40-70',size:'80*40'})
lmd.marker[lmd.MARKER_INDICATION]['childs'][4]['childs'].push({speed:'<40',size:'60*30'})
var temp = [
	"指示12 单行路(向左或向右)",
	"指示13 单行路(直行)"
]
for(var i = 0, len = temp.length; i < len; i++){
  lmd.marker[lmd.MARKER_INDICATION]['childs'][4]['wife'].push(temp[i])
}

/*lmd.marker[lmd.MARKER_INDICATION]['childs'].push({name:'会车先行-正方形','class':lmd.MARKER_CLASS_SQUARE,prex:'L', childs:[null],wife:[null]});
lmd.marker[lmd.MARKER_INDICATION]['childs'][5]['childs'].push({speed:'40-70',size:'80',icon:'3-5-1.png'})
lmd.marker[lmd.MARKER_INDICATION]['childs'][5]['childs'].push({speed:'<40',size:'60',icon:'3-5-2.png'})*/


lmd.marker.push({name: '指路标志',childs:[null]});
lmd.marker[lmd.MARKER_ROAD]['childs'].push({name:'线性诱导性(横向)',prex:'W*H','class':lmd.MARKER_CLASS_RECT,childs:[null],wife:[null]});
lmd.marker[lmd.MARKER_ROAD]['childs'][1]['childs'].push({speed:'>=80',size:'600*800'})
lmd.marker[lmd.MARKER_ROAD]['childs'][1]['childs'].push({speed:'<80',size:'400*600'})
lmd.marker[lmd.MARKER_ROAD]['childs'][1]['childs'].push({speed:'<80',size:'220*400'})
temp = [
	"指路36 线形诱导1组右",
	"指路36 线形诱导1组左",
	"指路37 线形诱导2组",
	"指路37 线形诱导3组",
	"指路37 线形诱导4组"
]
for(var i = 0, len = temp.length; i < len; i++){
  lmd.marker[lmd.MARKER_ROAD]['childs'][1]['wife'].push(temp[i])
}

lmd.marker[lmd.MARKER_ROAD]['childs'].push({name:'线性诱导性(纵向)','class':lmd.MARKER_CLASS_RECT,prex:'W*H',childs:[null],wife:[null]});
lmd.marker[lmd.MARKER_ROAD]['childs'][2]['childs'].push({speed:'0-120',size:'600*1200'})
temp = [
	"指路38 两侧通行",
	"指路39 右侧通行",
	"指路40 左侧通行"
]
for(var i = 0, len = temp.length; i < len; i++){
  lmd.marker[lmd.MARKER_ROAD]['childs'][2]['wife'].push(temp[i])
}

temp = undefined
i = undefined
len = undefined

lmd.getMarkerCategory = function(){
  var result = [];
  for(var i = 0, len = lmd.marker.length; i < len; i++){
    var marker = lmd.marker[i]
    if( marker ){
      result.push(['' + i,marker['name']])
    }
  }
  return result;
}

lmd.getMarkerCategorySecond = function( category ){
  var marker = lmd.marker[category]
  var result = [];
  if(!marker) return []
  for(var i = 1, len = marker['childs'].length; i < len; i++){
    var son = marker['childs'][i];
    if(son){
      result.push(['' + i,son['name']])
    }
  }
  return result;
}

lmd.getMarkerThirdClass = function( category ,level ){
  var first = lmd.marker[category]
  if(!first) return lmd.MARKER_CLASS_OPAQUE
  var second = first['childs'][level]
  if(!second) return lmd.MARKER_CLASS_OPAQUE
  return second['class'] || lmd.MARKER_CLASS_OPAQUE
}

lmd.getMarkerCategoryThirdWife = function( category,level ){
  var first = lmd.marker[category]
  if(!first) return []
  var second = first['childs'][level]
  if(!second) return []
  var result = []
  var unit = second['prex']
  for(var i = 1, len = second['wife'].length; i < len; i++){
    var wife = second['wife'][i]
    if(wife){
      result.push(['' + i, wife]);
    }
  }
  return result
}

lmd.getMarkerCategoryThird = function( category, level){
  var first = lmd.marker[category]
  if(!first) return []
  var second = first['childs'][level]
  if(!second) return []
  var result = []
  var unit = second['prex']
  for(var i = 1, len = second['childs'].length; i < len; i++){
    var grandson = second['childs'][i]
    if(grandson){
      result.push(['' + i, grandson['speed'] + '::' + unit + grandson['size'],grandson]);
    }
  }
  return result
}
