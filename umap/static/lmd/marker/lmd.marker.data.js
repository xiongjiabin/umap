
//定义几种标志
lmd.MARKER_WARMING = 1; //警告标志
lmd.MARKER_FORBID  = 2; //禁令标志
lmd.MARKER_INDICATION = 3;//指示标志
lmd.MARKER_ROAD = 4;//指路标志
lmd.MARKER_HELP = 5;//辅助标志
lmd.MARKER_SAFE = 6;//道路安全标志
lmd.MARKER_NOTIFICATION = 7;//告示标志
lmd.MARKER_TOUR = 8;//旅游景区标志
lmd.MARKER_OTHER = 99; //其他标志

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
	"警1 交叉路口（T右）",
	"警1 交叉路口（十字）",
	"警1 交叉路口（右上）",
	"警1 交叉路口（右下）",
	"警1 交叉路口（左上）",
	"警1 交叉路口（左下）",
	"警1 交叉路口（环形）",
	"警1 交叉路口（错位）",
	"警1 交叉路口（T左）",
	"警1 交叉路口（T）",
	"警2 急弯（右）",
	"警2 急弯（左）",
	"警3 反向弯路（左右）",
	"警3 反向弯路（右左）",
	"警4 连续弯路",
	"警5 陡坡（下）",
	"警5 陡坡（上）",
	"警6 连续下坡",
	"警7 两侧变窄",
	"警7 左侧变窄",
	"警7 右侧变窄",
	"警8 窄桥",
	"警9 双向交通",
	"警10 注意行人",
	"警11 注意儿童",
	"警12 注意牲畜",
	"警13 注意野生动物",
	"警14 注意信号灯",
	"警15 注意落石(右)",
	"警15 注意落石(左)",
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
	"警25 路面高突",
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
	"警40 隧道开车灯",
	"警41 注意潮汐车道",
	"警42 注意保持车距",
	"警43 注意分离式道路 (十字平面交叉)",
	"警43 注意分离式道路 (丁字平面交叉)",
	"警44 注意合流（左下）",
	"警44 注意合流（右下）",
	"警46 注意雾天",
	"警46 注意路面结冰",
	"警46 注意不利气象条件",
	"警46 注意雨（雪）天",
	"警47 注意前方车辆排队"
]
for(var i = 0, len = temp.length; i < len; i++){
  lmd.marker[lmd.MARKER_WARMING]['childs'][1]['wife'].push(temp[i])
}

lmd.marker[lmd.MARKER_WARMING]['childs'].push({name:'矩形','class':lmd.MARKER_CLASS_RECT,childs:[null],wife:[null]});
lmd.marker[lmd.MARKER_WARMING]['childs'][2]['childs'].push({speed:'40-70',size:'120*170'})
lmd.marker[lmd.MARKER_WARMING]['childs'][2]['childs'].push({speed:'<40',size:'90*130'})
//警告标志之矩形
temp = [
	"警39 建议减速-模版",
	"警39 建议速度",
	"警45 避险车道（横）",
	"警45 避险车道（纵）",
	"警45 避险车道（进入 横）",
	"警45 避险车道（进入 纵）",
	"警45 避险车道（预告500m 纵）",
	"警45 避险车道（预告1km 纵）",
	"警45 避险车道（预告2km 横）",
	"警45 避险车道（预告2km 纵）",
	"警45 避险车道（预告500m 横）",
	"警45 避险车道（预告1km 横）"
]
for(var i = 0, len = temp.length; i < len; i++){
  lmd.marker[lmd.MARKER_WARMING]['childs'][2]['wife'].push(temp[i])
}

//警告斜杠符号
lmd.marker[lmd.MARKER_WARMING]['childs'].push({name:'斜杠','class':lmd.MARKER_CLASS_RECT,childs:[null],wife:[null]});
lmd.marker[lmd.MARKER_WARMING]['childs'][3]['childs'].push({size:'45*78'})
temp = [
	"警31 斜杠符号-一道",
	"警31 斜杠符号-三道",
	"警31 斜杠符号-二道"
]
for(var i = 0, len = temp.length; i < len; i++){
  lmd.marker[lmd.MARKER_WARMING]['childs'][3]['wife'].push(temp[i])
}

//警告交叉符号
lmd.marker[lmd.MARKER_WARMING]['childs'].push({name:'叉形','class':lmd.MARKER_CLASS_OPAQUE,childs:[null],wife:[null]});
lmd.marker[lmd.MARKER_WARMING]['childs'][4]['childs'].push({speed:'>=70',size:'120*120'})
lmd.marker[lmd.MARKER_WARMING]['childs'][4]['childs'].push({speed:'<70',size:'90*90'})
temp = [
	"警30 叉形符号"
]
for(var i = 0, len = temp.length; i < len; i++){
  lmd.marker[lmd.MARKER_WARMING]['childs'][4]['wife'].push(temp[i])
}

lmd.marker.push({name:'禁令标志', childs:[null]});
lmd.marker[lmd.MARKER_FORBID]['childs'].push({name:'圆形','class':lmd.MARKER_CLASS_CIRCLE,prex:'D', childs:[null],wife:[null]});
lmd.marker[lmd.MARKER_FORBID]['childs'][1]['childs'].push({speed:'100-120',size:'120',icon:'2-1-1.png'})
lmd.marker[lmd.MARKER_FORBID]['childs'][1]['childs'].push({speed:'71-99',size:'100',icon:'2-1-2.png'})
lmd.marker[lmd.MARKER_FORBID]['childs'][1]['childs'].push({speed:'40-70',size:'80',icon:'2-1-3.png'})
lmd.marker[lmd.MARKER_FORBID]['childs'][1]['childs'].push({speed:'<40',size:'60',icon:'2-1-4.png'})
//禁令标志之圆形
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
	"禁23 禁止小客车向右转弯",
	"禁23 禁止向右转弯",
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
	"禁34 限制宽度-模版",
	"禁35 限制高度",
	"禁35 限制高度-模版",
	"禁36 限制质量-模版 ",
	"禁36 限制质量",
	"禁37 限制轴重-模版",
	"禁37 限制轴重",
	"禁38 限速-模版",
	"禁38 限制速度",
	"禁39 解除限制速度-模板",
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

lmd.marker[lmd.MARKER_FORBID]['childs'].push({name:'矩形','class':lmd.MARKER_CLASS_RECT,childs:[null],wife:[null]});
lmd.marker[lmd.MARKER_FORBID]['childs'][4]['childs'].push({speed:'40-70',size:'120*170',icon:'2-4-1.png'})
lmd.marker[lmd.MARKER_FORBID]['childs'][4]['childs'].push({speed:'<40',size:'90*130', icon:'2-4-2.png'})
var temp = [
	"禁43 区域限制速度-模版",
	"禁43 区域限制速度",
	"禁44 区域限制速度解除-模版",
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
	"指示16 最低限速-模版",
	"指示29 机动车行驶",
	"指示31 非机动车行驶"
]
for(var i = 0, len = temp.length; i < len; i++){
  lmd.marker[lmd.MARKER_INDICATION]['childs'][1]['wife'].push(temp[i])
}

lmd.marker[lmd.MARKER_INDICATION]['childs'].push({name:'正方形','class':lmd.MARKER_CLASS_SQUARE,prex:'L', childs:[null],wife:[null]});
lmd.marker[lmd.MARKER_INDICATION]['childs'][2]['childs'].push({speed:'40-70',size:'80',icon:'3-5-1.png'})
lmd.marker[lmd.MARKER_INDICATION]['childs'][2]['childs'].push({speed:'<40',size:'60',icon:'3-5-2.png'})
var temp = [
	"指示18 会车先行"
]
for(var i = 0, len = temp.length; i < len; i++){
  lmd.marker[lmd.MARKER_INDICATION]['childs'][2]['wife'].push(temp[i])
}


lmd.marker[lmd.MARKER_INDICATION]['childs'].push({name:'长方形','class':lmd.MARKER_CLASS_RECT, childs:[null],wife:[null]});
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

lmd.marker[lmd.MARKER_INDICATION]['childs'].push({name:'单行线-长方形','shape':'矩形', 'class':lmd.MARKER_CLASS_RECT,prex:'L', childs:[null],wife:[null]});
lmd.marker[lmd.MARKER_INDICATION]['childs'][4]['childs'].push({speed:'100-120',size:'120*60'})
lmd.marker[lmd.MARKER_INDICATION]['childs'][4]['childs'].push({speed:'71-99',size:'100*50'})
lmd.marker[lmd.MARKER_INDICATION]['childs'][4]['childs'].push({speed:'40-70',size:'80*40'})
lmd.marker[lmd.MARKER_INDICATION]['childs'][4]['childs'].push({speed:'<40',size:'60*30'})
var temp = [
	"指示12 单行路(向右)",
	"指示12 单行路(向左)",
	"指示13 单行路(直行)"
]
for(var i = 0, len = temp.length; i < len; i++){
  lmd.marker[lmd.MARKER_INDICATION]['childs'][4]['wife'].push(temp[i])
}


lmd.marker.push({name: '指路标志',childs:[null]});
lmd.marker[lmd.MARKER_ROAD]['childs'].push({name:'线性诱导性(横向)','shape':'矩形', 'class':lmd.MARKER_CLASS_RECT,childs:[null],wife:[null]});
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

lmd.marker[lmd.MARKER_ROAD]['childs'].push({name:'线性诱导性(纵向)','shape':'矩形', 'class':lmd.MARKER_CLASS_RECT,childs:[null],wife:[null]});
lmd.marker[lmd.MARKER_ROAD]['childs'][2]['childs'].push({speed:'0-120',size:'600*1200'})
temp = [
	"指路38 两侧通行",
	"指路39 右侧通行",
	"指路40 左侧通行"
]
for(var i = 0, len = temp.length; i < len; i++){
  lmd.marker[lmd.MARKER_ROAD]['childs'][2]['wife'].push(temp[i])
}

lmd.marker[lmd.MARKER_ROAD]['childs'].push({name:'普通公路&城市道路','shape':'矩形', 'class':lmd.MARKER_CLASS_RECT,childs:[null],wife:[null]});
lmd.marker[lmd.MARKER_ROAD]['childs'][3]['childs'].push({size:'自定义',customize: true})
temp = [
	"指路1 四车道及以上公路交叉路口预告-模板",
	"指路1 四车道及以上公路交叉路口预告2-模板",
	"指路2 十字交叉路口2-模板",
	"指路2 大交通量的四车道以上公路交叉路口预告2-模板",
	"指路2 大交通量的四车道以上公路交叉路口预告1-模板",
	"指路2 十字交叉路口3-模板",
	"指路3 丁字交叉路口3-模板",
	"指路3 箭头杆上标识公路编号、道路名称的公路交叉路口预告1-模板",
	"指路3 箭头杆上标识公路编号、道路名称的公路交叉路口预告2-模板",
	"指路4 丁字交叉路口4-模板",
	"指路4 十字交叉路口1-模板",
	"指路5 丁字交叉路口3-模板",
	"指路5 丁字交叉路口4-模板",
	"指路5 丁字交叉路口5-模板",
	"指路6 Y型交叉路口-模板",
	"指路7 环形交叉路口-模板",
	"指路8 互通式立体交叉2-模板",
	"指路8 互通式立体交叉1-模板",
	"指路9 分岔处1-模板",
	"指路9 分岔处2-模板",
	"指路10 国道编号-模板",
	"指路11 省道编号-模板",
	"指路12 县道编号-模板",
	"指路13 乡道编号-模板",
	"指路14 街道名称1-模板",
	"指路14 街道名称2-模板",
	"指路15 路名牌-模板",
	"指路16 地点距离-模板",
	"指路17 地名标志2-模板",
	"指路19 行政区划分界19-模板",
	"指路20 道路管理分界1-模板",
	"指路21 地点识别标志1",
	"指路21 地点识别标志2",
	"指路21 地点识别标志3",
	"指路22 停车场2",
	"指路22 停车场1",
	"指路23 错车道",
	"指路24 人行天桥",
	"指路25 人行地下通道",
	"指路26 残疾人专用设施",
	"指路27 观景台1",
	"指路27 观景台2",
	"指路28 应急避难设施",
	"指路29 休息区1",
	"指路29 休息区2",
	"指路30 绕行标志3",
	"指路30 绕行标志1",
	"指路30 绕行标志2",
	"指路31 此路不通",
	"指路32 车道数变少1",
	"指路32 车道数变少2",
	"指路33 车道数增加",
	"指路34 交通监控设备",
	"指路35 隧道出口距离预告2",
	"指路35 隧道出口距离预告1"
]
for(var i = 0, len = temp.length; i < len; i++){
  lmd.marker[lmd.MARKER_ROAD]['childs'][3]['wife'].push(temp[i])
}

lmd.marker[lmd.MARKER_ROAD]['childs'].push({name:'高速公路&城市快速路','shape':'矩形', 'class':lmd.MARKER_CLASS_RECT,childs:[null],wife:[null]});
lmd.marker[lmd.MARKER_ROAD]['childs'][4]['childs'].push({size:'自定义',customize: true})
temp = [
	"指路41 两条高速公路共线时入口预告1",
	"指路41 两条高速公路共线时入口预告2",
	"指路41 两条高速公路共线时入口预告4",
	"指路41 两条高速公路共线时入口预告5",
	"指路41 入口预告1",
	"指路41 入口预告2",
	"指路41 入口预告3",
	"指路41 入口预告4",
	"指路41 入口预告5",
	"指路41 无统一编号高速公路或城市快速路入口预告1",
	"指路41 无统一编号高速公路或城市快速路入口预告2",
	"指路41 无统一编号高速公路或城市快速路入口预告3",
	"指路41 无统一编号高速公路或城市快速路入口预告4",
	"指路41 无统一编号高速公路或城市快速路入口预告5",
	"指路41 两条高速公路共线时入口预告3",
	"指路42 不带编号标识的地点、方向2",
	"指路42 带编号标识的地点、方向3",
	"指路42 不带编号标识的地点、方向1",
	"指路42 带编号标识的地点、方向4",
	"指路43 编号标志2",
	"指路43 编号标志1",
	"指路44 命名编号1",
	"指路44 命名编号2",
	"指路45 路名标志",
	"指路46 地点距离1",
	"指路46 地点距离2",
	"指路47 城市区域多个出口时的地点距离1",
	"指路47 城市区域多个出口时的地点距离2",
	"指路47 城市区域多个出口时的地点距离3",
	"指路48 下一出口预告2",
	"指路48 下一出口预告3",
	"指路48 下一出口预告4",
	"指路48 下一出口预告1",
	"指路49 出口编号标志2",
	"指路49 出口编号标志1",
	"指路50 右侧出口预告2",
	"指路50 右侧出口预告6",
	"指路50 右侧出口预告4",
	"指路50 右侧出口预告5",
	"指路50 右侧出口预告1",
	"指路50 右侧出口预告7",
	"指路50 右侧出口预告8",
	"指路50 右侧出口预告3",
	"指路51 左侧出口预告2",
	"指路51 左侧出口预告8",
	"指路51 左侧出口预告4",
	"指路51 左侧出口预告5",
	"指路51 左侧出口预告6",
	"指路51 左侧出口预告7",
	"指路51 左侧出口预告1",
	"指路51 左侧出口预告3",
	"指路52 出口标志及出口地点方向2",
	"指路52 出口标志及出口地点方向4",
	"指路52 出口标志及出口地点方向1",
	"指路52 出口标志及出口地点方向3",
	"指路53 高速公路起点1",
	"指路53 高速公路起点2",
	"指路53 无统一编号的高速公路或城市快速路起点",
	"指路54 无统一编号的高速公路或城市快速路终点预3",
	"指路54 无统一编号的高速公路或城市快速路终点预告1",
	"指路54 终点预告1",
	"指路54 终点预告2",
	"指路54 终点预告3",
	"指路54 无统一编号的高速公路或城市快速路终点预2",
	"指路55 终点提示标志",
	"指路56 国家高速公路、省级高速公路终点1",
	"指路56 国家高速公路、省级高速公路终点2",
	"指路56 无统一编号的高速公路或城市快速路终点",
	"指路57 道路交通信息",
	"指路58 无统一编号的高速公路或城市快速路里程牌",
	"指路58 里程牌",
	"指路59 百米牌",
	"指路60 停车领卡",
	"指路61 车距确认1",
	"指路61 车距确认2",
	"指路61 车距确认3",
	"指路61 车距确认5",
	"指路61 车距确认4",
	"指路62 特殊天气建议速度1",
	"指路62 特殊天气建议速度2",
	"指路63 紧急电话",
	"指路64 电话位置指示2",
	"指路64 电话位置指示1",
	"指路64 电话位置指示3",
	"指路65 救援电话1",
	"指路65 救援电话2",
	"指路66 不设电子不停车收费(ETC)车道的收费站预告及收费站2",
	"指路66 不设电子不停车收费(ETC)车道的收费站预告及收费站4",
	"指路66 不设电子不停车收费(ETC)车道的收费站预告及收费站1",
	"指路66 不设电子不停车收费(ETC)车道的收费站预告及收费站3",
	"指路67 设有电子不停车收费(ETC)车道的收费站预告及收费站2",
	"指路67 设有电子不停车收费(ETC)车道的收费站预告及收费站1",
	"指路67 设有电子不停车收费(ETC)车道的收费站预告及收费站4",
	"指路67 设有电子不停车收费(ETC)车道的收费站预告及收费站3",
	"指路68 ETC车道指示1",
	"指路68 ETC车道指示2",
	"指路69 计重收费",
	"指路70 加油站",
	"指路71 紧急停车带",
	"指路72 服务区预告1",
	"指路72 服务区预告3",
	"指路72 服务区预告4",
	"指路72 服务区预告5",
	"指路72 服务区预告6",
	"指路72 服务区预告7",
	"指路72 服务区预告2",
	"指路72 服务区预告8",
	"指路73 停车区预告1",
	"指路73 停车区预告2",
	"指路73 停车区预告3",
	"指路74 停车场预告1",
	"指路74 停车场预告2",
	"指路74 停车场预告3",
	"指路75 停车场1",
	"指路75 停车场2",
	"指路76 爬坡车道1",
	"指路76 爬坡车道3",
	"指路76 爬坡车道4",
	"指路76 爬坡车道2",
	"指路77 超限超载检测站1",
	"指路77 超限超载检测站2",
	"指路77 超限超载检测站3",
	"指路77 超限超载检测站4",
	"指路78 设置在指路标志版面中的方向1",
	"指路78 设置在指路标志版面中的方向2",
	"指路78 设置在指路标志版面中的方向3",
	"指路78 设置在指路标志版面中的方向4",
	"指路78 设置在指路标志版面中的方向5",
	"指路79 设置在指路标志版面外的方向"
]
for(var i = 0, len = temp.length; i < len; i++){
  lmd.marker[lmd.MARKER_ROAD]['childs'][4]['wife'].push(temp[i])
}


lmd.marker.push({name: '辅助标志',childs:[null]});
lmd.marker[lmd.MARKER_HELP]['childs'].push({name:'矩形','class':lmd.MARKER_CLASS_RECT,childs:[null],wife:[null]});
lmd.marker[lmd.MARKER_HELP]['childs'][1]['childs'].push({size:'自定义',customize: true})
temp = [
	"辅助1 时间范围1-模版",
	"辅助1 时间范围2",
	"辅助1 时间范围1",
	"辅助1 时间范围2-模版",
	"辅助2 除公共汽车外",
	"辅助3 机动车",
	"辅助4 货车",
	"辅助5 货车、拖拉机",
	"辅助6 私人专属",
	"辅助7 行驶方向标志（前）",
	"辅助7 行驶方向标志（右转）",
	"辅助7 行驶方向标志（右前）",
	"辅助7 行驶方向标志（左右）",
	"辅助7 行驶方向标志（左转）",
	"辅助7 行驶方向标志（左前）",
	"辅助7 行驶方向标志（左）",
	"辅助7 行驶方向标志（右）",
	"辅助8 向前  m-模版",
	"辅助8 向前200m",
	"辅助9 向左100m",
	"辅助9 向左  m-模版",
	"辅助10 向右  m-模版",
	"辅助10 向右100m",
	"辅助10 向左、向右各  m-模版",
	"辅助10 向左、向右各50m",
	"辅助12 某区域内",
	"辅助13 距离某地200m",
	"辅助13 距离某地  m-模版",
	"辅助15 学校",
	"辅助16 海关",
	"辅助17 事故",
	"辅助18 塌方",
	"辅助19  路线-模版",
	"辅助19 教练车行驶路线",
	"辅助20 驾驶考试路线",
	"辅助21 校车停靠点",
	"辅助22 组合辅助-模版",
	"辅助22 组合辅助"
]
for(var i = 0, len = temp.length; i < len; i++){
  lmd.marker[lmd.MARKER_HELP]['childs'][1]['wife'].push(temp[i])
}


lmd.marker.push({name: '道路安全施工标志',childs:[null]});
lmd.marker[lmd.MARKER_SAFE]['childs'].push({name:'矩形','class':lmd.MARKER_CLASS_RECT,childs:[null],wife:[null]});
lmd.marker[lmd.MARKER_SAFE]['childs'][1]['childs'].push({size:'自定义',customize: true})
temp = [
	"中间封闭",
	"锥形交通标2",
	"锥形交通标",
	"前方施工",
	"前方施工2",
	"道路封闭2",
	"右道封闭",
	"右道封闭2",
	"道路封闭",
	"向右改道",
	"向右行驶",
	"向左改道",
	"向左行驶",
	"中间封闭2",
	"左道封闭2",
	"道口标柱",
	"施工路栏",
	"施工路栏2",
	"移动性施工标志",
	"车辆慢性",
	"车辆慢性",
	"左道封闭3",
	"右道封闭3",
	"前方施工3",
	"道路封闭3",
	"中间封闭3",
	"左道封闭"
]
for(var i = 0, len = temp.length; i < len; i++){
  lmd.marker[lmd.MARKER_SAFE]['childs'][1]['wife'].push(temp[i])
}

lmd.marker.push({name: '告示标志',childs:[null]});
lmd.marker[lmd.MARKER_NOTIFICATION]['childs'].push({name:'矩形','class':lmd.MARKER_CLASS_RECT,childs:[null],wife:[null]});
lmd.marker[lmd.MARKER_NOTIFICATION]['childs'][1]['childs'].push({size:'自定义',customize: true})
temp = [
	"告示1 驾驶时禁用手机标志",
	"告示2 严禁酒后驾车标志",
	"告示3 严禁乱扔弃物标志",
	"告示4 急弯减速慢行标志",
	"告示5 急弯减速慢行标志",
	"告示6 急弯下坡减速慢行标志",
	"告示7 急弯下坡减速慢行标志",
	"告示8 系安全带标志",
	"告示9 大型车靠右",
	"告示10 校车停靠站点"
]
for(var i = 0, len = temp.length; i < len; i++){
  lmd.marker[lmd.MARKER_NOTIFICATION]['childs'][1]['wife'].push(temp[i])
}

lmd.marker.push({name: '旅游景区标志',childs:[null]});
lmd.marker[lmd.MARKER_TOUR]['childs'].push({name:'矩形','class':lmd.MARKER_CLASS_RECT,childs:[null],wife:[null]});
lmd.marker[lmd.MARKER_TOUR]['childs'][1]['childs'].push({size:'自定义',customize: true})
temp = [
	"旅游1 旅游区距离",
	"旅游2 旅游区方向（右前）",
	"旅游2 旅游区方向（右）",
	"旅游3 问讯处",
	"旅游4 徒步",
	"旅游5 索道",
	"旅游6 野营地",
	"旅游7 营火",
	"旅游8 游戏场",
	"旅游9 骑马",
	"旅游10 钓鱼",
	"旅游11 高尔夫球",
	"旅游12 潜水",
	"旅游13 游泳",
	"旅游14 划船",
	"旅游15 冬季游览区",
	"旅游16 滑雪",
	"旅游17 滑冰"
]
for(var i = 0, len = temp.length; i < len; i++){
  lmd.marker[lmd.MARKER_TOUR]['childs'][1]['wife'].push(temp[i])
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
  var unit = second['prex'] || ''
  for(var i = 1, len = second['wife'].length; i < len; i++){
    var wife = second['wife'][i]
    if(wife){
      result.push(['' + i, wife]);
    }
  }
  return result
}

lmd.getMarkerCategoryThird = function( category, level, defaultSpeed ){
  var first = lmd.marker[category]
  if(!first) return []
  var second = first['childs'][level]
  if(!second) return []
  defaultSpeed = defaultSpeed || 0
  var result = [],temp = null,defaultIndex = 0
  var unit = second['prex'] || ''
  for(var i = 1, len = second['childs'].length; i < len; i++){
    var grandson = second['childs'][i]
    if(grandson){
      result.push(['' + i, (grandson['speed'] || '无') + '____' + unit + grandson['size'],grandson]);
      if(grandson['speed'] && defaultSpeed > 0 && defaultIndex === 0){
          temp = grandson['speed'].split('-')
          if(temp.length >= 2){
              if(defaultSpeed >= temp[0] && defaultSpeed <= temp[1]){
                  defaultIndex = result.length
              }
          }else if(grandson['speed'].startsWith('>')){
              temp = grandson['speed'].split('>')
              if(temp.length >= 2){
                  if(defaultSpeed >= temp[1]){
                      defaultIndex = result.length
                  }
              }
          }else if(grandson['speed'].startsWith('<')){
            temp = grandson['speed'].split('<')
            if(temp.length >= 2){
                if(defaultSpeed <= temp[1]){
                    defaultIndex = result.length
                }
            }
          }
      }
    }
  }

  return [result,defaultIndex]
}

lmd.getMarkerCategoryValue = function( options ){
  var mt = options['mt'] || 1
  var mic = options['mic'] || 1
  var msh = options['msh'] || 1
  var mss = options['mss'] || 1
  var result = {mt:'',mic:'',msh:'',mss:''}
  var temp = lmd.marker[mt]
  if( temp ){
      result['mt'] = temp['name'] // 那种告示牌
      temp = temp['childs'][mic]
      if(temp){
        result['mic'] = temp['shape'] || temp['name'] //图形
        result['msh'] = temp['wife'][msh] || '' //内容

        var child = temp['childs'][mss]
        if(child && child['customize']){
          result['customize'] = true
        }else if(child && !child['customize']){
          result['mss'] = (temp['prex'] || '') + (child['size'] || '') //尺寸
        }
      }
   }
   return result
}
