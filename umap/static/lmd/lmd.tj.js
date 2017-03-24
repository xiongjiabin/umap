//xiongjiabin code for 生成csv文件
function CsvGenerator(dataArray, fileName, separator, addQuotes) {
    this.dataArray = dataArray;
    this.fileName = fileName;
    this.separator = separator || '\t';
    this.addQuotes = !!addQuotes;

    if (this.addQuotes) {
        this.separator = '"' + this.separator + '"';
    }


    this.getDownloadLink = function () {
        var separator = this.separator;
        var addQuotes = this.addQuotes;

        var rows = this.dataArray.map(function (row) {
            var newRow = [];
            for(var i = 0, len = row.length; i < len; i++){
                if(typeof row[i] === 'string'){
                  newRow.push(row[i].replaceAll(separator,"  ").replaceAll("\n","  "));
                }else{
                  newRow.push(row[i]);
                }
            }
            var rowData = newRow.join(separator);

            if (rowData.length && addQuotes) {
                return '"' + rowData + '"';
            }

            return rowData;
        });

        var type = 'data:text/csv;charset=utf-8';
        var data = rows.join('\n');

        if (typeof btoa === 'function') {
            type += ';base64';
            data = base64.encode(data,false);
        } else {
            data = encodeURIComponent(data);
        }

        return this.downloadLink = this.downloadLink || type + ',' + data;
    };

    this.getLinkElement = function (linkText) {
        var downloadLink = this.getDownloadLink();
        var fileName = this.fileName;
        this.linkElement = this.linkElement || (function() {
            var a = document.createElement('a');
            a.innerHTML = linkText || '';
            a.href = downloadLink;
            a.download = fileName;
            return a;
        }());
        return this.linkElement;
    };

    // call with removeAfterDownload = true if you want the link to be removed after downloading
    this.download = function (removeAfterDownload) {
        var linkElement = this.getLinkElement();
        linkElement.style.display = 'none';
        document.body.appendChild(linkElement);
        linkElement.click();
        if (removeAfterDownload) {
            document.body.removeChild(linkElement);
        }
    };
}

lmd.objectToArray = function(obj){
  var result = []
  for(var i in obj){
    result.push(obj[i])
  }
  return result
}

lmd.getTjData = function(feature, no, titles){
  var tempData = [no]
  var stringMap = feature.getStringMap()
  for(var temp in titles) {
    tempData.push(stringMap[temp] || '')
  }
  tempData['sortField'] = stringMap['sortField'] || null
  return tempData
}

lmd.processData = function(data){

  var isNum = function( val ){
      return /^\d+.*\d+$/.test(val)
  }

  data.sort(function(a,b){
      if(!a['sortField']){
        return -1;
      }
      if(!b['sortField']){
        return 1;
      }
      var ak1 = +a['sortField']['k1'];
      var bk1 = +b['sortField']['k1'];
      if(ak1 === bk1){
        var ak2 = isNum(a['sortField']['k2']) ? +a['sortField']['k2'] : (a['sortField']['k2'] || '');
        var bk2 = isNum(b['sortField']['k2']) ? +b['sortField']['k2'] : (b['sortField']['k2'] || '');
        if(ak2 > bk2) return 1;
        if(ak2 < bk2) return -1;
        return 0;
      }
      return ak1 - bk1;
  });

  for(var i = 1; i < data.length; i++){
    delete data[i]['sortField']
    data[i][0] = i
  }

  return data
}

//返回标志
lmd.tjIndicators = function(){
  var data = []
  var titles = {no:'序号',
                sn: '桩号',
                pos: '位置',
                mt:'标志类型',
                name:'标志内容',
                mic: '图形',
                mss:'版面尺寸(cm)',
                pillarType: '支撑型式',
                num:'数量(块)',
                fgm: '反光膜(m2)',
                fgmyq: '反光膜要求',
                ds:'状态',
                description:'备注',
                pic: '图形',
              }
  data.push(lmd.objectToArray(titles))
  delete titles.no

  //this means map
  var i = 1,className = null,pillars = {},markers = {}, tmp = null,len = 0
  this.eachDataLayer(function (datalayer) {
    datalayer.eachFeature(function (feature) {
        className = feature.getClassName()
        if(className === 'lmdMarker'){
          data.push(lmd.getTjData(feature,i,titles))
          i++
        }else if(className === 'lmdPillar'){
          tmp = feature.getStringMap()
          pillars[tmp['pos'] + tmp['sn']] = tmp['pt']
        }
    })
  })

  lmd.processData(data)

  var sn = 0,pos = 0
  for(i = 1,len = data.length; i < len; i++){
     sn = data[i][1]
     pos = data[i][2]
     if (markers[ pos + sn ]) {
        data[i][7] = '增加版面'
     } else {
        data[i][7] = pillars[ pos + sn ] || ''
        markers[ pos + sn ] = 1
     }
  }
  pillars = null

  new CsvGenerator(data,  '标志一览表.csv').download(true);
}

//返回立柱数据
lmd.tjPillars = function(){
  var data = []
  var titles = {no:'序号',
                sn: '桩号',
                pos: '位置',
                pt:'立柱类型',
                ds:'状态',
                pd: '直径',
                pt: '厚度',
                ph: '高度',
                pb: '基础尺寸',
                description:'备注'
              }
  data.push(lmd.objectToArray(titles))
  delete titles.no

  //this means map
  var i = 1
  this.eachLayerFeature(function (feature) {
    if(feature.getClassName() === 'lmdPillar'){
      data.push(lmd.getTjData(feature,i,titles))
      i++
    }
  })

  lmd.processData(data)

  new CsvGenerator(data,  '立柱.csv').download(true);
}

//轮廓
lmd.tjLunkuo = function(){
  var data = []
  var titles = {no:'序号',
                gbss: '起始桩号',
                gbse: '结束桩号',
                gbl: '长度(m)',
                gbn: '单位(个)',
                pos: '侧别',
                gbd: '方向',
                gbc: '类型',
                ds: '状态',
                description:'备注'
              }
  data.push(lmd.objectToArray(titles))
  delete titles.no

  //this means map
  var i = 1
  this.eachLayerFeature(function(feature){
    if(feature.getClassName() === 'lunkuo'){
      data.push(lmd.getTjData(feature,i,titles))
      i++
    }
  })

  lmd.processData(data)

  new CsvGenerator(data,  '轮廓设施表.csv').download(true);
}

//减速路面
lmd.tjJiansu = function(){
  var data = []
  var titles = {no:'序号',
                name: '类型',
                gbss: '起始桩号',
                gbse: '结束桩号',
                pos: '侧别',
                gbl: '长度(m)',
                gbw: '宽度(m)',
                gba: '面积(m2)',
                ds: '状态',
                description:'备注'
              }
  data.push(lmd.objectToArray(titles))
  delete titles.no

  //this means map
  var i = 1
  this.eachLayerFeature(function (feature) {
      if(feature.getClassName() === 'jiansu'){
          data.push(lmd.getTjData(feature,i,titles))
          i++
      }
  })

  lmd.processData(data)

  new CsvGenerator(data,  '减速路面.csv').download(true);
}

//边沟
lmd.tjBiangou = function(){
  var data = []
  var titles = {no:'序号',
                name: '类型',
                gbss: '起始桩号',
                gbse: '结束桩号',
                pos: '侧别',
                gbl: '长度(m)',
                ds: '状态',
                description:'备注'
              }
  data.push(lmd.objectToArray(titles))
  delete titles.no

  //this means map
  var i = 1
  this.eachLayerFeature(function (feature) {
      if(feature.getClassName() === 'biangou'){
        data.push(lmd.getTjData(feature,i,titles))
        i++
      }
  })

  lmd.processData(data)

  new CsvGenerator(data,  '边沟.csv').download(true);
}


//修剪
lmd.tjXiujian = function(){
  var data = []
  var titles = {no:'序号',
                name: '类型',
                gbss: '起始桩号',
                gbse: '结束桩号',
                pos: '侧别',
                gbn: '数量(棵,m3,个)',
                ds: '状态',
                description:'备注'
              }
  data.push(lmd.objectToArray(titles))
  delete titles.no

  //this means map
  var i = 1
  this.eachLayerFeature(function (feature) {
      if(feature.getClassName() === 'lmdArea'){
        data.push(lmd.getTjData(feature,i,titles))
        i++
      }
  })

  lmd.processData(data)

  new CsvGenerator(data,  '清除障碍物.csv').download(true);
}


//防护栏
lmd.tjFanghu = function(){
  var data = []
  var titles = {no:'序号',
                gbss: '起始桩号',
                gbse: '结束桩号',
                gbl: '长度',
                pos: '侧别',
                gblev: '级别',
                name: '类型',
                gbs: '间距',
                gbn: '数量',
                ds: '状态',
                description:'备注'
              }
  data.push(lmd.objectToArray(titles))
  delete titles.no

  //this means map
  var i = 1
  this.eachLayerFeature(function (feature) {
      if(feature.getClassName() === 'guardbar'){
        data.push(lmd.getTjData(feature,i,titles))
        i++
      }
  })

  lmd.processData(data)
  new CsvGenerator(data,  '防护栏.csv').download(true);
}

lmd.tjFangxuan = function(){
  var data = []
  var titles = {no:'序号',
                gbss: '起始桩号',
                gbse: '结束桩号',
                gbl: '长度',
                pos: '侧别',
                name: '类型',
                gbs: '间距',
                gbn: '数量',
                ds: '状态',
                description:'备注'
              }
  data.push(lmd.objectToArray(titles))
  delete titles.no

  //this means map
  var i = 1
  this.eachLayerFeature(function (feature) {
      if(feature.getClassName() === 'fangxuan'){
        data.push(lmd.getTjData(feature,i,titles))
        i++
      }
  })

  lmd.processData(data)
  new CsvGenerator(data,  '防眩设施.csv').download(true);
}

//突起路标
lmd.tjTuQiLuBiao = function(){
  var data = []
  var titles = {no:'序号',
                gbss: '起始桩号',
                gbse: '结束桩号',
                gbl: '长度',
                pos: '侧别',
                gbs: '间距',
                gbn: '数量',
                hShape: '形状',
                hColor: '颜色',
                ds: '状态',
                description:'备注'
              }
  data.push(lmd.objectToArray(titles))
  delete titles.no

  //this means map
  var i = 1
  this.eachLayerFeature(function (feature) {
      if(feature.getClassName() === 'tqlb'){
        data.push(lmd.getTjData(feature,i,titles))
        i++
      }
  })

  lmd.processData(data)
  new CsvGenerator(data,  '突起路标.csv').download(true);
}


//挡墙
lmd.tjDangTuQiang = function(){
  var data = []
  var titles = {no:'序号',
                gbss: '起始桩号',
                gbse: '结束桩号',
                name: '设施名称',
                gbl: '长度(m)',
                hHeight: '高度(m)',
                pos: '侧别',
                gba: '面积(m2)',
                bulk: '体积(m3)',
                ds: '状态',
                description:'备注'
              }
  data.push(lmd.objectToArray(titles))
  delete titles.no

  //this means map
  var i = 1
  this.eachLayerFeature(function (feature) {
      if(feature.getClassName() === 'dtq'){
        data.push(lmd.getTjData(feature,i,titles))
        i++
      }
  })

  lmd.processData(data)
  new CsvGenerator(data,  '挡墙.csv').download(true);
}

lmd.tjs = [{
    label: '标志',
    process: lmd.tjIndicators
  },{
    label: '立柱',
    process: lmd.tjPillars
  },{
    label: '轮廓设施',
    process: lmd.tjLunkuo
  },{
    label: '防眩设施',
    process: lmd.tjFangxuan
  },{
    label: '减速路面',
    process: lmd.tjJiansu
  },{
    label: '边沟',
    process: lmd.tjBiangou
  },{
    label: '清除障碍物',
    process: lmd.tjXiujian
  },{
    label: '防护栏',
    process: lmd.tjFanghu
  },{
    label: '突起路标',
    process: lmd.tjTuQiLuBiao
  },{
    label: '挡墙',
    process: lmd.tjDangTuQiang
  }
]
