
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
var temp = ['交叉入口(错位)','交叉路口(环形)','交叉路口(十字)','交叉路口(右上)','交叉路口(右下)','交叉路口(左上)','交叉路口(左下)'];
for(var i = 0, len = temp.length; i < len; i++){
  lmd.marker[lmd.MARKER_WARMING]['childs'][1]['wife'].push(temp[i])
}

lmd.marker[lmd.MARKER_WARMING]['childs'].push({name:'矩形','class':lmd.MARKER_CLASS_RECT,prex:'W*H',childs:[null],wife:[null]});
lmd.marker[lmd.MARKER_WARMING]['childs'][2]['childs'].push({speed:'40-70',size:'120*170'})
lmd.marker[lmd.MARKER_WARMING]['childs'][2]['childs'].push({speed:'<40',size:'90*130'})


lmd.marker.push({name:'禁令标志', childs:[null]});
lmd.marker[lmd.MARKER_FORBID]['childs'].push({name:'圆形','class':lmd.MARKER_CLASS_CIRCLE,prex:'D', childs:[null],wife:[null]});
lmd.marker[lmd.MARKER_FORBID]['childs'][1]['childs'].push({speed:'100-120',size:'120',icon:'2-1-1.png'})
lmd.marker[lmd.MARKER_FORBID]['childs'][1]['childs'].push({speed:'71-99',size:'100',icon:'2-1-2.png'})
lmd.marker[lmd.MARKER_FORBID]['childs'][1]['childs'].push({speed:'40-70',size:'80',icon:'2-1-3.png'})
lmd.marker[lmd.MARKER_FORBID]['childs'][1]['childs'].push({speed:'<40',size:'60',icon:'2-1-4.png'})

lmd.marker[lmd.MARKER_FORBID]['childs'].push({name:'三角形','class': lmd.MARKER_CLASS_OPAQUE, prex:'L',childs:[null],wife:[null]});
lmd.marker[lmd.MARKER_FORBID]['childs'][2]['childs'].push({speed:'40-70',size:'90',icon:'2-2-1.png'})
lmd.marker[lmd.MARKER_FORBID]['childs'][2]['childs'].push({speed:'<40',size:'70', icon:'2-2-2.png'})

lmd.marker[lmd.MARKER_FORBID]['childs'].push({name:'八角形','class':lmd.MARKER_CLASS_OPAQUE, prex:'L',childs:[null],wife:[null]});
lmd.marker[lmd.MARKER_FORBID]['childs'][3]['childs'].push({speed:'40-70',size:'80',icon:'2-3-1.png'})
lmd.marker[lmd.MARKER_FORBID]['childs'][3]['childs'].push({speed:'<40',size:'60', icon:'2-3-2.png'})

lmd.marker[lmd.MARKER_FORBID]['childs'].push({name:'矩形','class':lmd.MARKER_CLASS_RECT,prex:'W*H',childs:[null],wife:[null]});
lmd.marker[lmd.MARKER_FORBID]['childs'][4]['childs'].push({speed:'40-70',size:'120*170',icon:'2-4-1.png'})
lmd.marker[lmd.MARKER_FORBID]['childs'][4]['childs'].push({speed:'<40',size:'90*130', icon:'2-4-2.png'})


lmd.marker.push({name:'指示标志', childs:[null]});
lmd.marker[lmd.MARKER_INDICATION]['childs'].push({name:'圆形','class':lmd.MARKER_CLASS_CIRCLE,prex:'D', childs:[null],wife:[null]});
lmd.marker[lmd.MARKER_INDICATION]['childs'][1]['childs'].push({speed:'100-120',size:'120',icon:'3-1-1.png'})
lmd.marker[lmd.MARKER_INDICATION]['childs'][1]['childs'].push({speed:'71-99',size:'100',icon:'3-1-2.png'})
lmd.marker[lmd.MARKER_INDICATION]['childs'][1]['childs'].push({speed:'40-70',size:'80',icon:'3-1-3.png'})
lmd.marker[lmd.MARKER_INDICATION]['childs'][1]['childs'].push({speed:'<40',size:'60',icon:'3-1-4.png'})

lmd.marker[lmd.MARKER_INDICATION]['childs'].push({name:'正方形','class':lmd.MARKER_CLASS_SQUARE,prex:'L', childs:[null],wife:[null]});
lmd.marker[lmd.MARKER_INDICATION]['childs'][2]['childs'].push({speed:'100-120',size:'120',icon:'3-2-1.png'})
lmd.marker[lmd.MARKER_INDICATION]['childs'][2]['childs'].push({speed:'71-99',size:'100',icon:'3-2-2.png'})
lmd.marker[lmd.MARKER_INDICATION]['childs'][2]['childs'].push({speed:'40-70',size:'80',icon:'3-2-3.png'})
lmd.marker[lmd.MARKER_INDICATION]['childs'][2]['childs'].push({speed:'<40',size:'60',icon:'3-2-4.png'})

lmd.marker[lmd.MARKER_INDICATION]['childs'].push({name:'长方形','class':lmd.MARKER_CLASS_RECT,prex:'W*H', childs:[null],wife:[null]});
lmd.marker[lmd.MARKER_INDICATION]['childs'][3]['childs'].push({speed:'100-120',size:'190*140',icon:'3-3-1.png'})
lmd.marker[lmd.MARKER_INDICATION]['childs'][3]['childs'].push({speed:'71-99',size:'160*120',icon:'3-3-2.png'})
lmd.marker[lmd.MARKER_INDICATION]['childs'][3]['childs'].push({speed:'40-70',size:'140*100',icon:'3-3-3.png'})

lmd.marker[lmd.MARKER_INDICATION]['childs'].push({name:'单行线-长方形','class':lmd.MARKER_CLASS_RECT,prex:'L', childs:[null],wife:[null]});
lmd.marker[lmd.MARKER_INDICATION]['childs'][4]['childs'].push({speed:'100-120',size:'120*60',icon:'3-4-1.png'})
lmd.marker[lmd.MARKER_INDICATION]['childs'][4]['childs'].push({speed:'71-99',size:'100*50',icon:'3-4-2.png'})
lmd.marker[lmd.MARKER_INDICATION]['childs'][4]['childs'].push({speed:'40-70',size:'80*40',icon:'3-4-3.png'})
lmd.marker[lmd.MARKER_INDICATION]['childs'][4]['childs'].push({speed:'<40',size:'60*30',icon:'3-4-4.png'})

lmd.marker[lmd.MARKER_INDICATION]['childs'].push({name:'会车先行-正方形','class':lmd.MARKER_CLASS_SQUARE,prex:'L', childs:[null],wife:[null]});
lmd.marker[lmd.MARKER_INDICATION]['childs'][5]['childs'].push({speed:'40-70',size:'80',icon:'3-5-1.png'})
lmd.marker[lmd.MARKER_INDICATION]['childs'][5]['childs'].push({speed:'<40',size:'60',icon:'3-5-2.png'})


lmd.marker.push({name: '指路标志',childs:[null]});
lmd.marker[lmd.MARKER_ROAD]['childs'].push({name:'线性诱导性(横向)-1组',prex:'W*H',childs:[null]});
lmd.marker[lmd.MARKER_ROAD]['childs'][1]['childs'].push({speed:'>=80',size:'600*800',icon:'4_1_1.png'})
lmd.marker[lmd.MARKER_ROAD]['childs'][1]['childs'].push({speed:'<80',size:'400*600',icon:'4_1_2.png'})
lmd.marker[lmd.MARKER_ROAD]['childs'][1]['childs'].push({speed:'<80',size:'220*400',icon:'4_1_3.png'})

lmd.marker[lmd.MARKER_ROAD]['childs'].push({name:'线性诱导性(横向)-2组',prex:'W*H',childs:[null]});
lmd.marker[lmd.MARKER_ROAD]['childs'][2]['childs'].push({speed:'>=80',size:'600*800',icon:'4_2_1.png'})
lmd.marker[lmd.MARKER_ROAD]['childs'][2]['childs'].push({speed:'<80',size:'400*600',icon:'4_2_2.png'})
lmd.marker[lmd.MARKER_ROAD]['childs'][2]['childs'].push({speed:'<80',size:'220*400',icon:'4_2_3.png'})

lmd.marker[lmd.MARKER_ROAD]['childs'].push({name:'线性诱导性(横向)-3组',prex:'W*H',childs:[null]});
lmd.marker[lmd.MARKER_ROAD]['childs'][3]['childs'].push({speed:'>=80',size:'600*800',icon:'4_3_1.png'})
lmd.marker[lmd.MARKER_ROAD]['childs'][3]['childs'].push({speed:'<80',size:'400*600',icon:'4_3_2.png'})
lmd.marker[lmd.MARKER_ROAD]['childs'][3]['childs'].push({speed:'<80',size:'220*400',icon:'4_3_3.png'})

lmd.marker[lmd.MARKER_ROAD]['childs'].push({name:'线性诱导性(横向)-4组',prex:'W*H',childs:[null]});
lmd.marker[lmd.MARKER_ROAD]['childs'][4]['childs'].push({speed:'>=80',size:'600*800',icon:'4_4_1.png'})
lmd.marker[lmd.MARKER_ROAD]['childs'][4]['childs'].push({speed:'<80',size:'400*600',icon:'4_4_2.png'})
lmd.marker[lmd.MARKER_ROAD]['childs'][4]['childs'].push({speed:'<80',size:'220*400',icon:'4_4_3.png'})

lmd.marker[lmd.MARKER_ROAD]['childs'].push({name:'线性诱导性(纵向)-俩侧通行',prex:'W*H',childs:[null]});
lmd.marker[lmd.MARKER_ROAD]['childs'][5]['childs'].push({speed:'0-120',size:'600*1200',icon:'4_5_1.png'})

lmd.marker[lmd.MARKER_ROAD]['childs'].push({name:'线性诱导性(纵向)-右侧通行',prex:'W*H',childs:[null]});
lmd.marker[lmd.MARKER_ROAD]['childs'][6]['childs'].push({speed:'0-120',size:'600*1200',icon:'4_6_1.png'})

lmd.marker[lmd.MARKER_ROAD]['childs'].push({name:'线性诱导性(纵向)-左侧通行',prex:'W*H',childs:[null]});
lmd.marker[lmd.MARKER_ROAD]['childs'][7]['childs'].push({speed:'0-120',size:'600*1200',icon:'4_7_1.png'})

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
