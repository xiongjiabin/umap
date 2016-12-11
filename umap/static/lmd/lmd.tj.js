//xiongjiabin code for 生成csv文件
function CsvGenerator(dataArray, fileName, separator, addQuotes) {
    this.dataArray = dataArray;
    this.fileName = fileName;
    this.separator = separator || ',';
    this.addQuotes = !!addQuotes;

    if (this.addQuotes) {
        this.separator = '"' + this.separator + '"';
    }

    this.getDownloadLink = function () {
        var separator = this.separator;
        var addQuotes = this.addQuotes;

        var rows = this.dataArray.map(function (row) {
            var rowData = row.join(separator);

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
  for(var temp in titles){
    tempData.push(stringMap[temp] || '')
  }
  return tempData
}

//返回标志
lmd.tjIndicators = function(){
  var data = []
  var titles = {no:'序号',
                sn: '桩号',
                pos: '位置',
                type:'标志类型',
                name:'标志内容',
                size:'版面尺寸(cm)',
                pillarType: '支撑型式',
                num:'数量(块)',
                description:'备注'
              }
  data.push(lmd.objectToArray(titles))
  delete titles.no

  //this means map
  var i = 1,stringMap = null
  this.eachDataLayer(function (datalayer) {
    datalayer.eachFeature(function (feature) {
        if(feature.getClassName() === 'lmdMarker'){
          data.push(lmd.getTjData(feature,i,titles))
          i++
        }
    })
  })

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
  var i = 1,stringMap = null,tempData = null,temp = null
  this.eachDataLayer(function (datalayer) {
    datalayer.eachFeature(function (feature) {
      if(feature.getClassName() === 'lmdPillar'){
        data.push(lmd.getTjData(feature,i,titles))
        i++
      }
    })
  })

  new CsvGenerator(data,  '立柱一览表.csv').download(true);
}

lmd.tjs = [{
    label: '标志一览表',
    process: lmd.tjIndicators
  },{
    label: '立柱一览表',
    process: lmd.tjPillars
  }
]
