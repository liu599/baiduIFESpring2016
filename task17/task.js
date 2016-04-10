/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
  var y = dat.getFullYear();
  var m = dat.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = dat.getDate();
  d = d < 10 ? '0' + d : d;
  return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
  var returnData = {};
  var dat = new Date("2016-01-01");
  var datStr = ''
  for (var i = 1; i < 92; i++) {
    datStr = getDateStr(dat);
    returnData[datStr] = Math.ceil(Math.random() * seed);
    dat.setDate(dat.getDate() + 1);
  }
  return returnData;
}

var aqiSourceData = {
  "北京": randomBuildData(500),
  "上海": randomBuildData(300),
  "广州": randomBuildData(200),
  "深圳": randomBuildData(100),
  "成都": randomBuildData(300),
  "西安": randomBuildData(500),
  "福州": randomBuildData(100),
  "厦门": randomBuildData(100),
  "沈阳": randomBuildData(500)
};

// 用于渲染图表的数据
var chartData = {};
var aqiChartWrap=document.getElementById('aqi-chart-wrap');
// 记录当前页面的表单选项
var pageState = {
  nowSelectCity: -1,
  nowGraTime: "day"
};

/**
 * 渲染图表
 */
function renderChart() {
    var aqiChartWrap=document.getElementById('aqi-chart-wrap');
    console.log(chartData);
    var chartItem='';
    for(var item in chartData) {        //遍历每个chartData数据
        chartItem += '<div title="'+ item   +'" class="item_Chart" style="height: '+
            chartData[item]+'px;cursor: pointer;margin:1px;box-shadow: 5px 5px 5px #888;background-color:deeppink">'+
            '</div>';
    }
    
   // console.log(chartItem);
    aqiChartWrap.innerHTML = chartItem;
    
    
}




/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange() {
  // 确定是否选项发生了变化 
  timeBox = document.getElementById("form-gra-time");
   inputElements = timeBox.getElementsByTagName("input");
   for(var i=0; i<inputElements.length; i++){
       if(inputElements[i].checked && inputElements[i].value!=pageState.nowGraTime) {
            pageState.nowGraTime=inputElements[i].value;

            
            // 设置对应数据
             initAqiChartData();
              // 调用图表渲染函数
             renderChart(); 
        }
   }
  

}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
  // 确定是否选项发生了变化  
  
  // 设置对应数据
  initAqiChartData();
  // 调用图表渲染函数
  renderChart();
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
   timeBox = document.getElementById("form-gra-time");
   inputElements = timeBox.getElementsByTagName("input");
   for(var i=0; i<inputElements.length; i++){
       inputElements[i].onchange = graTimeChange;
   }
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
  // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
  var items="";
  //console.log(aqiSourceData);
  for(var aqicity in aqiSourceData){
      items = items+"<option>"+aqicity+"</option>";
  }
  citySelect = document.getElementById("city-select");
  citySelect.innerHTML = items;
  // 给select设置事件，当选项发生变化时调用函数citySelectChange
  citySelect.onchange = citySelectChange;


}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
    // 将原始的源数据处理成图表需要的数据格式
    // 处理好的数据存到 chartData 中
    chartData={};
    var sum=0,i= 0,selectData={};
    for(var item in aqiSourceData) {
        if(citySelect.value==item) {
            selectData=aqiSourceData[item];
        }
    }
    switch (pageState.nowGraTime){
        case 'day':
            chartData=selectData;
            break;
        case 'week':
            sum=0;i=0;
            var week=0;
            for(item in selectData) {
                //console.log(new Date(item).getDay());
                sum+=selectData[item];
                i++;
                if(new Date(item).getDay()==6) {        //判断是否是周日
                    week++;
                    //console.log(week);
                    chartData['2016年第'+week+'周']=parseInt(sum/i);
                    i=0;
                    sum=0;
                }
            }
            if(i!==0) {
                week++;
                chartData['2016年第'+week+'周']=parseInt(sum/i);
            }
            break;
        case 'month':
            sum=0;i=0;
            var monthTemp=1;
            for(item in selectData) {
                var date=new Date(item);
                //console.log(date.getMonth());
                if(date.getMonth()!=monthTemp) {
                    monthTemp=date.getMonth();

                    if(sum!==0)
                        chartData[date.getFullYear()+'-'+ (monthTemp ? ('0'+monthTemp) : monthTemp)]=parseInt(sum/i);
                    sum=0;
                    i=0;
                }
                sum+=selectData[item];
                i++;
            }
            if(i!==0) {
                monthTemp++;
                chartData[date.getFullYear()+'-'+ (monthTemp ? ('0'+monthTemp) : monthTemp)]=parseInt(sum/i);
            }
            break;
    }
    // 调用图表渲染函数
    //renderChart();
}

/**
 * 初始化函数
 */
function init() {
    
  initGraTimeForm();
  initCitySelector();
  initAqiChartData();
}

init();
