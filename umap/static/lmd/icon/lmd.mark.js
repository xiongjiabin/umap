lmd.speedRage = [
  '<40', //0
  '40-70', //1
  '71-99', //2
  '100-120', //3
  '<80', //4
  '>=80', //5
  '40-120' //6
];

lmd.marker = [
  {
    'name': '警告标志',
    childs: [
      {
        name: '三角形',
        prex: 'L',
        childs:[
          {
            speed: 3,
            size : '130'
          },{
            speed: 2,
            size: '110'
          },{
            speed: 1,
            size: '90',
          },{
            speed: 0,
            size: '70'
          }
        ]
      }
    ]
  },{
    name: '禁令标志',
    childs: [
      {
        name:'圆形',
        prex: 'D',
        childs: [
            {
              speed: 3,
              size : '120'
            },{
              speed: 2,
              size: '100'
            },{
              speed: 1,
              size: '80',
            },{
              speed: 0,
              size: '60'
            }
        ]
      },{
        name:'三角形',
        help: '减速让行',
        prex: 'L',
        childs: [
          {
            speed: 6,
            size: '90'
          },{
            speed: 0,
            size: '70'
          }
        ]
      },{
        name:'八角形',
        help: '停车让行',
        prex: 'L',
        childs: [
          {
            speed: 6,
            size: '80'
          },{
            speed: 0,
            size: '60'
          }
        ]
      },{
        name: '矩形',
        help: '区域限制或者解除标志',
        childs: [
          {
            speed: 6,
            size: '120*170'
          },{
            speed: 0,
            size: '90*130'
          }
        ]
      }
    ]
  },{
    name: "指示标志",
    childs: []
  },{
    name: '指路标志',
    help: '线性诱导'
    childs: [
      {
        name: '横向1组',
        childs: [
          {
            speed: 5,
            size: '600*800'
          },{
            speed: 6,
            size: '400*600'
          },{
            speed: 6,
            size: '220*400'
          }
        ]
      },{
        name: '横向2组',
        childs: [
          {
            speed: 5,
            size: '600*800'
          },{
            speed: 6,
            size: '400*600'
          },{
            speed: 6,
            size: '220*400'
          }
        ]
      },{
        name: '横向3组',
        childs: [
          {
            speed: 5,
            size: '600*800'
          },{
            speed: 6,
            size: '400*600'
          },{
            speed: 6,
            size: '220*400'
          }
        ]
      },{
        name: '横向4组',
        childs: [
          {
            speed: 5,
            size: '600*800'
          },{
            speed: 6,
            size: '400*600'
          },{
            speed: 6,
            size: '220*400'
          }
        ]
      },{
        name: '纵向俩侧通行',
        childs: [
          {
            size: '600*1200'
          }
        ]
      },{
        name: '纵向左侧通行',
        childs: [
          {
            size: '600*1200'
          }
        ]
      },{
        name: '纵向右侧通行',
        childs: [
          {
            size: '600*1200'
          }
        ]
      }
    ]
  }
]
