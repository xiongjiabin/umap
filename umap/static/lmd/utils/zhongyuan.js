/*
desc: 这个地方写了一些用来做批量处理的函数
仅仅适合批量处理，这种情况下，地图的地图也得改变
这个文件名是zhongyuan，记录我第一次去郑州中院，感受中国法律的进步
author: 熊佳斌
date: 2017-08-23
aim： 针对某些批量处理，提供一种脚本的方式进行处理
*/

function offsetMinusOld(sn, offset){
    return offset - sn
}
function plusSn( feature, offset, caculateWay){
    var sn = feature.getOption('sn')
    var name = feature.getOption('name') || ''
    if(sn === undefined) {
        console.log(name + '桩号不存在, 丢弃')
        return false
    }
    var newSn = (+sn) + (+offset)
    if(caculateWay){
        newSn = caculateWay(sn, offset)
    }
    if(newSn < 0) {
        newSn = 0;
        feature.del()
        console.log(name + '桩号(' + sn + ')经过偏移后为负值,  删除')
    }else {
        feature.setSingleOption('sn', newSn);
    }
    return true
}

function batchSn( className, offset, caculateWay){
    var countOk = 0
    var countFail = 0
    if(!lmd._map.editEnabled) {
        console.log('地图不可编辑,请先打开编辑地图模式')
        return false
    }
    lmd.eachFeature( function(feature){
        if(feature.getClassName() === className){
            var ret = plusSn(feature, offset, caculateWay)
            if(ret){
                countOk++
            }else{
                countFail++
            }
        }
    })
    if(countOk > 0){
        lmd._map.isDirty = true
    }
    console.log('成功:' + countOk + ' 失败:' + countFail)
    return true
}
