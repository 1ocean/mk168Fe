import echarts from 'echarts'

let install = function (Vue) {
    Object.defineProperties(Vue.prototype, {
        $chart: {
            get() {
                return {
                    line(id, data, type) {
                        this.chart = echarts.init(document.getElementById(id));
                        this.chart.clear();
                        if (type !== 'clear') {
                            let optionData = {
                                grid: {
                                    left: '10%',
                                    top: '15%',
                                    right: '10%',
                                    bottom: '35%',
                                },
                                tooltip: {
                                    show: true,
                                    trigger: 'axis',
                                },
                                legend: {
                                    type: 'scroll',
                                    bottom: '0',
                                },
                                dataZoom: [
                                    {
                                        show: true,
                                        type: 'inside'
                                    }
                                ],
                                xAxis: {
                                    type: 'time',
                                    boundaryGap: false,
                                    axisLine: {
                                        show: false,
                                    },
                                    axisTick: {
                                        show: false,
                                    },
                                    axisLabel: {
                                        color: '#333',
                                    },
                                    splitLine: {
                                        show: true,
                                        lineStyle: {
                                            color: '#333',
                                            opacity: 0.2,
                                        },
                                    }
                                },
                                yAxis: {
                                    type: 'value',
                                    scale: true,
                                    axisLine: {
                                        show: false,
                                    },
                                    axisTick: {
                                        show: false,
                                    },
                                    axisLabel: {
                                        color: '#333',
                                    },
                                    splitLine: {
                                        show: true,
                                        lineStyle: {
                                            color: '#333',
                                            opacity: 0.2,
                                        },
                                    },
                                },
                                series: [
                                    //     {
                                    //     name: '传感器测值',
                                    //     type: 'line',
                                    //     smooth: true,
                                    //     lineStyle: {
                                    //         width: 3,
                                    //     },
                                    // }
                                ],
                                color: ['#f00', '#f70', '#099', '#0c0', '#70a', '#c07', '#9e0', '#ff0', '#13a', '#41a', '#fd0', '#fb0'],
                            };
                            //循环放入series 不同得折线图数据
                            for (let i in data) {
                                optionData.series.push({
                                    name: data[i].name,
                                    type: 'line',
                                    smooth: true,
                                    showSymbol: false,
                                    data: data[i].list,
                                    markPoint: {
                                        data: [
                                            {type: 'max', name: '最大值'},
                                            {type: 'min', name: '最小值'}
                                        ]
                                    },
                                    markLine: {
                                        data: [
                                            {type: 'average', name: '平均值'},
                                            [{
                                                symbol: 'none',
                                                x: '70%',
                                                yAxis: 'max'
                                            }, {
                                                symbol: 'circle',
                                                label: {
                                                    position: 'start',
                                                    formatter: '最大值'
                                                },
                                                type: 'max',
                                                name: '最高点'
                                            }],
                                            [{
                                                symbol: 'none',
                                                x: '30%',
                                                yAxis: 'min'
                                            }, {
                                                symbol: 'circle',
                                                label: {
                                                    position: 'start',
                                                    formatter: '最小值'
                                                },
                                                type: 'min',
                                                name: '最低点'
                                            }]
                                        ]
                                    },

                                })
                            }
                            this.chart.setOption(optionData);
                        }

                    },

                    barEchart(id, data) {
                        this.chart = echarts.init(document.getElementById(id));
                        let optionData = {
                            grid: {
                                left: '10%',
                                top: '10%',
                                right: '5%',
                                bottom: '25%',
                            },
                            tooltip: {
                                show: true,
                                trigger: 'axis',
                            },
                            legend: {},
                            xAxis: {
                                type: 'category',
                            },
                            yAxis: {
                                //minInterval: 1,
                                type: 'value',
                            },
                            series: [
                                {
                                    type: 'bar',
                                    barWidth: '20%',
                                }
                            ],
                            color: ['#f00', '#f70', '#099', '#0c0', '#70a', '#c07', '#9e0', '#ff0', '#13a', '#41a', '#fd0', '#fb0'],
                        };
                        optionData.series[0].data = data;
                        this.chart.setOption(optionData);
                    },

                    lineEchart(id, data) {
                        this.chart = echarts.init(document.getElementById(id));
                        let optionData = {
                            grid: {
                                left: '10%',
                                top: '10%',
                                right: '5%',
                                bottom: '25%',
                            },
                            tooltip: {
                                show: true,
                                trigger: 'axis',
                            },
                            legend: {
                                type: 'scroll',
                                bottom: '0',
                            },
                            xAxis: {
                                type: 'time',
                                maxInterval: 3600 * 24 * 1000,
                                axisLabel: {
                                    color: '#333',
                                },
                                splitLine: {
                                    show: true,
                                    lineStyle: {
                                        color: '#333',
                                        opacity: 0.2,
                                    },
                                }
                            },
                            yAxis: {
                                type: 'value',
                                //minInterval: 1,
                                axisLabel: {
                                    color: '#333',
                                },
                                splitLine: {
                                    show: true,
                                    lineStyle: {
                                        color: '#333',
                                        opacity: 0.2,
                                    },
                                },
                            },
                            series: [
                                //     {
                                //     name: '传感器测值',
                                //     type: 'line',
                                //     smooth: true,
                                //     lineStyle: {
                                //         width: 3,
                                //     },
                                // }
                            ],
                            color: ['#f00', '#f70', '#099', '#0c0', '#70a', '#c07', '#9e0', '#ff0', '#13a', '#41a', '#fd0', '#fb0'],
                        };
                        //循环放入series 不同得折线图数据
                        for (let i in data) {
                            optionData.series.push({
                                name: data[i].name,
                                type: 'line',
                                smooth: true,
                                data: data[i].list,
                            })
                        }
                        this.chart.setOption(optionData);
                    },

                    pieEchart(id, data, type) {
                        let msg = '';
                        type === 'gateway' ? msg = '网关' : msg = '传感器';
                        this.chart = echarts.init(document.getElementById(id));
                        let optionData = {
                            tooltip: {
                                trigger: 'item',
                                formatter: '{a} <br/>{b}: {c} ({d}%)'
                            },
                            legend: {
                                orient: 'vertical',
                                left: 10,
                            },
                            series: [
                                {
                                    name: msg + '总览',
                                    type: 'pie',
                                    radius: ['40%', '60%'],
                                    avoidLabelOverlap: false,
                                    emphasis: {
                                        label: {
                                            show: true,
                                        }
                                    },
                                    data: []
                                }
                            ]
                        };
                        optionData.series[0].data = data;
                        this.chart.setOption(optionData);
                    },
                    dataBoard(id, data) {
                        let colorList = ['#5DC1CB', '#D3C75B', '#C559D1', '#30ABE3', '#30ABE3', '#2865B0', '#BD3571', '#81C553', '#E4981C']
                        this.chart = echarts.init(document.getElementById(id));
                        let option = {
                            tooltip: {
                                trigger: 'item',
                                formatter: '{b}：{d}%',
                                textStyle: {
                                    fontSize: 9
                                }
                            },
                            series: [{
                                type: 'pie',
                                center: ['50%', '50%'],
                                radius: ['35%', '72%'],
                                clockwise: true,
                                avoidLabelOverlap: true,
                                hoverOffset: 15,
                                itemStyle: {
                                    normal: {
                                        color: function (params) {
                                            return colorList[params.dataIndex]
                                        }
                                    }
                                },
                                label: {
                                    show: true,
                                    position: 'outside',
                                    formatter: '{b}：{c}',
                                    fontSize:9,
                                    rich: {
                                        hr: {
                                            backgroundColor: 't',
                                            borderRadius: 3,
                                            width: 3,
                                            height: 3,
                                            padding: [3, 3, 0, -12]
                                        },
                                        a: {
                                            padding: [-30, 15, -20, 15]
                                        }
                                    },
                                },
                                labelLine: {
                                    normal: {
                                        length: 8,
                                        lineStyle: {
                                            width: 1
                                        }
                                    }
                                },
                                data: [{
                                    'name': '危废池',
                                    'value': data[0]
                                }, {
                                    'name': '雨水井',
                                    'value': data[1]
                                }, {
                                    'name': '化学品架',
                                    'value': data[2]
                                }, {
                                    'name': '有限空间',
                                    'value': data[3]
                                }, {
                                    'name': '机器人区域',
                                    'value': data[4]
                                }, {
                                    'name': '屋面通道',
                                    'value': data[5]
                                }, {
                                    'name': '屋顶边缘',
                                    'value': data[6]
                                }, {
                                    'name': '柴油储罐',
                                    'value': data[7]
                                }, {
                                    'name': '电气安全',
                                    'value': data[8]
                                }]
                            }]
                        };
                        // option.series[0].data = data;
                        this.chart.setOption(option);
                    },
                    dataBoardBar(id, data) {
                        this.chart = echarts.init(document.getElementById(id));
                        let option = {
                            color: [
                                "#257DFF",
                                "#E3A03A",
                                "rgb(245,97,97)",
                            ],
                            legend: {
                                data: [{
                                    name: "处理完成",
                                    icon: "circle"
                                },
                                    {
                                        name: "处理中",
                                        icon: "circle"
                                    },
                                    {
                                        name: "报警中",
                                        icon: "circle"
                                    }
                                ],
                                right: "4%",
                                top: "1%",
                                itemWidth: 8,
                                itemHeight: 8,
                                textStyle: {
                                    color: "#DFDFDF",
                                    fontSize: 8
                                }
                            },
                            grid: {
                                left: "4%",
                                right: "8%",
                                bottom: "10%",
                                top: "18%",
                                containLabel: true
                            },
                            tooltip: {
                                trigger: "axis",
                                axisPointer: {
                                    type: "shadow"
                                },
                                textStyle: {
                                    align: 'left'
                                }
                            },

                            xAxis: [{
                                type: "category",
                                data: [
                                    "危废池",
                                    "雨水井",
                                    "化学\n品架",
                                    "柴油\n储罐",
                                    "有限\n空间",
                                    "屋顶\n边缘",
                                    "屋面\n通道",
                                    "机器人\n区域",
                                    "电气\n安全",
                                ],
                                axisTick: {
                                    show: false
                                },
                                axisLabel: {
                                    show: true,
                                    textStyle: {
                                        color: "#DFDFDF",
                                        fontSize: 7
                                    },
                                    formatter: "{value}"
                                },
                                axisLine: {
                                    show: true
                                }
                            }],
                            yAxis: [{
                                type: "value",
                                axisTick: {
                                    show: false
                                },
                                axisLine: {
                                    show: true
                                },
                                axisLabel: {
                                    show: true,
                                    textStyle: {
                                        color: "#DFDFDF",
                                        fontSize: 10
                                    }
                                },
                                splitLine: { //网格线
                                    show: true,
                                    lineStyle: {
                                        type: "dashed",
                                        color: "rgba(255,255,255,0.2)"
                                    }
                                }
                            }],
                            series: [{
                                name: "处理完成",
                                type: "bar",
                                stack: "总量",
                                barWidth: "60%",
                                data: data[0]
                            },
                                {
                                    name: "处理中",
                                    type: "bar",
                                    stack: "总量",
                                    barWidth: "70%",
                                    data: data[1]
                                },
                                {
                                    name: "报警中",
                                    type: "bar",
                                    stack: "总量",
                                    barWidth: "70%",
                                    data: data[2]
                                }
                            ]
                        };
                        // option.series[0].data = data;
                        this.chart.setOption(option);
                    },
                    dataBoardLinLine(id, num, time, color, showName) {
                        this.chart = echarts.init(document.getElementById(id));
                        let option = {
                            tooltip: {
                                trigger: 'axis',
                                axisPointer: {
                                    lineStyle: {
                                        color: {
                                            type: 'linear',
                                            x: 0,
                                            y: 0,
                                            x2: 0,
                                            y2: 1,
                                            colorStops: [{
                                                offset: 0,
                                                color: 'rgba(255,255,255,0)' // 0% 处的颜色
                                            }, {
                                                offset: 0.5,
                                                color: 'rgba(255,255,255,1)' // 100% 处的颜色
                                            }, {
                                                offset: 1,
                                                color: 'rgba(255,255,255,0)' // 100% 处的颜色
                                            }],
                                            global: false // 缺省为 false
                                        }
                                    },
                                },

                            },
                            grid: {
                                top: '18%',
                                left: '15%',
                                right: '8%',
                                bottom: '25%',
                                // containLabel: true
                            },
                            xAxis: [{
                                type: 'category',
                                boundaryGap: false,
                                axisLine: { //坐标轴轴线相关设置。数学上的x轴
                                    show: true,
                                    lineStyle: {
                                        color: '#1E88E5'
                                    },
                                },
                                axisLabel: { //坐标轴刻度标签的相关设置
                                    textStyle: {
                                        color: '#70C5FF',
                                        margin: 15,
                                        fontSize:8
                                    },

                                },
                                axisTick: {
                                    show: false,
                                },
                                data: time
                            }],
                            yAxis: [{
                                splitLine: {
                                    show: false,
                                    lineStyle: {
                                        color: '#092b5d'
                                    },
                                },
                                axisLine: {
                                    show: false,
                                    lineStyle: {
                                        color: "#092b5d"
                                    }

                                },
                                axisLabel: {
                                    show: true,
                                    textStyle: {
                                        color: '#70C5FF',
                                        fontSize:9
                                    },
                                    // formatter: function (value) {
                                    //     if (value === 0) {
                                    //         return value
                                    //     }
                                    //     return value
                                    // }
                                },
                                axisTick: {
                                    show: false,
                                },
                            }],
                            series: [{
                                name: showName,
                                type: 'line',

                                showAllSymbol: true,
                                symbol: 'none',  //这句就是去掉点的
                                smooth: true,  //这句就是让曲线变平滑的
                                symbolSize: 8,
                                lineStyle: {
                                    normal: {
                                        color: color, // 线条颜色
                                    },
                                    borderColor: 'rgba(0,0,0,.4)',
                                },
                                itemStyle: {
                                    color: "rgba(14,30,73,1)",
                                    borderColor: "#646ace",
                                    borderWidth: 2

                                },
                                label: {
                                    normal: {
                                        show: true,
                                        position: "top",
                                        formatter: [
                                            ' {a|{c}}',
                                        ].join(','),
                                        rich: {
                                            a: {
                                                color: '#fff',
                                                align: 'center',
                                            },
                                        }
                                    }
                                },
                                tooltip: {
                                    show: true
                                },
                                areaStyle: { //区域填充样式
                                    normal: {
                                        //线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
                                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                            offset: 0,
                                            color: "rgba(124, 128, 244,.3)"


                                        },
                                            {
                                                offset: 1,
                                                color: "rgba(124, 128, 244, 0)"
                                            }
                                        ], false),
                                        shadowColor: color, //阴影颜色
                                        shadowBlur: 20 //shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
                                    }
                                },
                                data: num
                            }]
                        };
                        // option.series[0].data = data;
                        this.chart.setOption(option);
                    },
                    dataBoardLiquidFill(id, name, color, upperLimit, lastMeasureValue) {
                        this.chart = echarts.init(document.getElementById(id));
                        let option = {
                            title: [{
                                top: '47%',
                                left: 'center',
                                text: lastMeasureValue,
                                textStyle: {
                                    color: '#fff',
                                    fontStyle: 'normal',
                                    fontWeight: 'normal',
                                    fontSize: '60%'
                                },
                            }, {
                                top: '10%',
                                left: 'center',
                                text: '液位上限：' + upperLimit,
                                textStyle: {
                                    color: '#4CF9FF',
                                    fontStyle: 'normal',
                                    fontWeight: 'normal',
                                    fontSize: '60%'
                                },
                            },
                                {
                                    top: '72%',
                                    left: 'center',
                                    text: name,
                                    textStyle: {
                                        color: color,
                                        fontStyle: 'normal',
                                        fontWeight: 'normal',
                                        fontSize: '60%'
                                    },
                                }
                            ],
                            xAxis: {
                                show: false,
                                type: 'category',
                                axisLine: {
                                    show: false
                                }
                            },
                            yAxis: {
                                show: false,
                                type: 'value',
                                axisLine: {
                                    show: false
                                }
                            },
                            grid: {
                                left: '28%',
                                top: '40%',
                                right: '28%',
                                bottom: '1%',
                                // containLabel:true
                            },
                            series: [{
                                type: 'liquidFill',
                                itemStyle: {
                                    normal: {
                                        opacity: 0.4,
                                        shadowBlur: 0,
                                        color: "#3B7BF8",
                                        shadowColor: '#3B7BF8'
                                    }
                                },
                                color: 'black',
                                data: [{
                                    value: (lastMeasureValue / upperLimit).toFixed(2),
                                    itemStyle: {
                                        normal: {
                                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                                offset: 0,
                                                color: color
                                            },
                                                {
                                                    offset: 1,
                                                    color: color
                                                }
                                            ]),
                                            opacity: 1
                                        }
                                    }
                                }],
                                center: ['50%', '50%'],
                                backgroundStyle: {
                                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                        offset: 0,
                                        color: 'rgb(36,48,76)'
                                    },
                                        {
                                            offset: 1,
                                            color: 'rgb(36,48,76)'
                                        }
                                    ]),
                                },
                                label: {
                                    normal: {
                                        formatter: '',
                                        textStyle: {
                                            fontSize: 12
                                        }
                                    }
                                },
                                outline: {
                                    itemStyle: {
                                        borderColor: '#3F1EB9',
                                        borderWidth: 0
                                    },
                                    borderDistance: 0
                                }
                            },
                                {
                                    type: 'liquidFill',
                                    itemStyle: {
                                        normal: {
                                            opacity: 0.4,
                                            shadowBlur: 0,
                                            color: "#3B7BF8",
                                            shadowColor: '#3B7BF8'
                                        }
                                    },
                                    color: 'black',
                                    data: [{
                                        value: (0.55 / 10).toFixed(2),
                                        itemStyle: {
                                            normal: {
                                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                                    offset: 0,
                                                    color: 'red'
                                                },
                                                    {
                                                        offset: 1,
                                                        color: 'red'
                                                    }
                                                ]),
                                                opacity: 1
                                            }
                                        }
                                    }],
                                    center: ['50%', '22%'],
                                    backgroundStyle: {
                                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                            offset: 0,
                                            color: 'rgba(36,48,76,0)'
                                        },
                                            {
                                                offset: 1,
                                                color: 'rgba(36,48,76,0)'
                                            }
                                        ]),
                                    },
                                    label: {
                                        show:false,
                                        normal: {
                                            formatter: '',
                                            textStyle: {
                                                fontSize: 12
                                            }
                                        }
                                    },
                                    outline: {
                                        show:false,
                                        itemStyle: {
                                            borderColor: '#3F1EB9',
                                            borderWidth: 0
                                        },
                                        borderDistance: 0
                                    }
                                },
                                // {
                                //     data: [100, 100, 100, 100, 100, 100, 100],
                                //     type: 'line',
                                //     symbol: "none",
                                // }
                            ]
                        }
                        // option.series[0].data = data;
                        this.chart.setOption(option);
                    },
                    dataBoardGauge(id, name, value) {
                        this.chart = echarts.init(document.getElementById(id));
                        let full;
                        name == 'PH值' ? full = 14 : full = 100;

                        let option = {
                            title: [{
                                text: value,
                                top: '30%',
                                left: 'center',
                                textStyle: {
                                    color: '#4CF9FF',
                                    fontSize: '60%'
                                }
                            }, {
                                text: name,
                                top: '80%',
                                left: 'center',
                                textStyle: {
                                    color: '#4CF9FF',
                                    fontSize: '60%'
                                }
                            }],
                            series: [
                                {
                                    type: 'gauge',
                                    radius: '60%',
                                    clockwise: true,
                                    startAngle: '90',
                                    endAngle: '-269.9999',
                                    splitNumber: 0,
                                    detail: {
                                        offsetCenter: [0, -20],
                                        formatter: ' '
                                    },
                                    pointer: {
                                        show: false
                                    },
                                    axisLine: {
                                        show: true,
                                        lineStyle: {
                                            color: [
                                                [0, '#03D5FB'],
                                                [value / full, new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                                                    {
                                                        offset: 0.1,
                                                        color: "#03D5FB"
                                                    },
                                                    {
                                                        offset: 0.6,
                                                        color: "#1F67BF"
                                                    },
                                                    {
                                                        offset: 1,
                                                        color: "#03D5FB"
                                                    }
                                                ])],
                                                [1, 'rgba(32,187,252,0.15)']
                                            ],
                                            width: 4
                                        }
                                    },
                                    axisTick: {
                                        show: false
                                    },
                                    splitLine: {
                                        show: true,
                                        length: 32,
                                        lineStyle: {
                                            color: '#051F54',
                                            width: 6
                                        }
                                    },
                                    axisLabel: {
                                        show: false
                                    }
                                },
                                {
                                    type: 'pie',
                                    name: '内层细圆环',

                                    radius: ['43%', '45%'],
                                    hoverAnimation: false,
                                    clockWise: true,
                                    itemStyle: {
                                        normal: {
                                            color: function (params) {

                                                return new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
                                                    offset: 0.1,
                                                    color: "#03D5FB"
                                                },
                                                    {
                                                        offset: 0.6,
                                                        color: "#1F67BF"
                                                    },
                                                    {
                                                        offset: 1,
                                                        color: "#03D5FB"
                                                    }])

                                            }
                                        }
                                    },
                                    label: {
                                        show: false
                                    },

                                    data: [100]
                                },
                                {
                                    type: 'pie',
                                    name: '内层环',
                                    radius: [0, '43%'],

                                    hoverAnimation: false,
                                    clockWise: false,
                                    itemStyle: {
                                        normal: {
                                            color: '#02163F'
                                        }
                                    },
                                    label: {
                                        show: false
                                    },
                                    data: [100]
                                }
                            ]
                        };
                        // option.series[0].data = data;
                        this.chart.setOption(option);
                    },
                    dataBoardGaugeRight(id, data, color, type,name) {
                        let fun, max, types, minInterval, interval,label,icon;
                        if (type == '1') {
                            max = 14;
                            type = 'value';
                            minInterval = 6;
                            interval = 7;
                            fun = [
                                '{b}|{c}',
                            ].join(',');
                                label='{value} ';
                            icon='image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAKCAYAAAC5Sw6hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ1IDc5LjE2MzQ5OSwgMjAxOC8wOC8xMy0xNjo0MDoyMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjhBMTM2N0YyRTU0MDExRUE5NzUyQkZEQkU2N0M3NDg5IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjhBMTM2N0YzRTU0MDExRUE5NzUyQkZEQkU2N0M3NDg5Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OEExMzY3RjBFNTQwMTFFQTk3NTJCRkRCRTY3Qzc0ODkiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6OEExMzY3RjFFNTQwMTFFQTk3NTJCRkRCRTY3Qzc0ODkiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5lVo8OAAAAvUlEQVR42mI806XAgAMoA3EhENsCMRMQnwLiXiC+hk0xCw5DHIF4ExDzIInpAHE0EMcD8Up0DUxYDBEE4jVohsAAOxAvAGIFYgyKAmIhBtyAA4hTsHltGhCLIIkZMhAGsUCshsT/BjJoOhCzIQnmAbEKAYMuAnEnEv8vyKDLaIoWA3EcAYNAYXiWUBjtAeLteAw5AcTLiAlsEAiDRvF/NPFtQOwDxH+ITUdfgDgCiOuB2BKq7jQ0bLACgAADAOZJHTJQnPJNAAAAAElFTkSuQmCC'

                        } else {
                            max = 20;
                            type = 'value';
                            minInterval = 6;
                            interval = 5;
                            fun = [
                                '{b}|{c}%',
                            ].join(',');
                            label='{value}%';
                            icon='image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAAKCAYAAABWiWWfAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ1IDc5LjE2MzQ5OSwgMjAxOC8wOC8xMy0xNjo0MDoyMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjhDQTcxQjVERTU0MDExRUE4M0I2REY4RTcyMDY0OTc5IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjhDQTcxQjVFRTU0MDExRUE4M0I2REY4RTcyMDY0OTc5Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OENBNzFCNUJFNTQwMTFFQTgzQjZERjhFNzIwNjQ5NzkiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6OENBNzFCNUNFNTQwMTFFQTgzQjZERjhFNzIwNjQ5NzkiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5Mtvt9AAAAyUlEQVR42mIUfX2SAQdgA+J0IA4CYikgfgDES4F4CRD/w6aBBYdBXEC8G4itkMTUgNgNiH2BOAKI/6JrYsJhWC+aQcggBIhLsUkwYvEmNxC/BWJ2BtzgCRDLYvNmABBHIYnxETAIBGSAeC2aVyeBDDsBxI+RBEGB7U7AMJAhnWiG3QcZ9gKKYeAsEN8FYmU8hh0E4lPERgAogP/jkPsFxBXYJHAZth6I44D4A5r4c2jSOE1sbDKgRYYLEIsB8SMg3gfEP3ApBggwAFy7J6GEEAYLAAAAAElFTkSuQmCC'

                        }

                        this.chart = echarts.init(document.getElementById(id));
                        let option = {
                            tooltip: {
                                trigger: 'axis',
                                formatter: fun,
                                axisPointer: {
                                    lineStyle: {
                                        color: {
                                            type: 'linear',
                                            x: 0,
                                            y: 0,
                                            x2: 0,
                                            y2: 1,
                                            colorStops: [{
                                                offset: 0,
                                                color: 'rgba(255,255,255,0)' // 0% 处的颜色
                                            }, {
                                                offset: 0.5,
                                                color: 'rgba(255,255,255,1)' // 100% 处的颜色
                                            }, {
                                                offset: 1,
                                                color: 'rgba(255,255,255,0)' // 100% 处的颜色
                                            }],
                                            global: false // 缺省为 false
                                        }
                                    },
                                },

                            },
                            legend: {
                                show: true,
                                x: 'center',
                                y: 'bottom',
                                icon:icon,
                                itemWidth: 20,
                                itemHeight: 10,
                                textStyle: {
                                    color: color,
                                    fontSize:9
                                },
                                data: [name]
                            },
                            grid: {
                                top: '20%',
                                left: '15%',
                                right: '10%',
                                bottom: '40%',
                                // containLabel: true
                            },
                            xAxis: [{
                                type: 'category',
                                boundaryGap: true,
                                axisLine: { //坐标轴轴线相关设置。数学上的x轴
                                    show: true,
                                    lineStyle: {
                                        color: '#1E88E5'
                                    },
                                },
                                axisLabel: { //坐标轴刻度标签的相关设置

                                    textStyle: {
                                        color: '#70C5FF',
                                        margin: 15,
                                        fontSize:8
                                    },

                                },
                                axisTick: {
                                    show: false,
                                },
                                data: data.timeList
                            }],
                            yAxis: [{
                                max: max,
                                type: types,
                                minInterval: minInterval,
                                interval: interval, //每次增加几个
                                splitLine: {
                                    show: true,
                                    lineStyle: {
                                        color: '#092b5d'
                                    },
                                },
                                axisLine: {
                                    show: true,
                                    lineStyle: {
                                        color: "#092b5d"
                                    }

                                },
                                axisLabel: {
                                    show: true,
                                    textStyle: {
                                        color: '#70C5FF',
                                        fontSize:8
                                    },
                                    formatter: label
                                },
                                axisTick: {
                                    show: false,
                                },
                            }],
                            series: [{
                                name:name,
                                type: 'line',
                                showAllSymbol: true,
                                // symbol: 'none',  //这句就是去掉点的
                                smooth: true,  //这句就是让曲线变平滑的
                                symbolSize: 8,
                                lineStyle: {
                                    normal: {
                                        color: color, // 线条颜色
                                    },
                                    borderColor: 'rgba(0,0,0,.4)',
                                },
                                itemStyle: {
                                    color: color,
                                    borderColor: color,
                                    borderWidth: 2

                                },
                                label: {
                                    normal: {
                                        show: false,
                                        position: "top",
                                        formatter: [
                                            ' {a|{c}%}',
                                        ].join(','),
                                        rich: {
                                            a: {
                                                color: '#fff',
                                                align: 'center',
                                            },
                                        }
                                    }
                                },
                                tooltip: {
                                    show: true
                                },
                                areaStyle: { //区域填充样式
                                    normal: {
                                        //线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
                                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                            offset: 0,
                                            color: "rgba(124, 128, 244,.3)"


                                        },
                                            {
                                                offset: 1,
                                                color: "rgba(124, 128, 244, 0)"
                                            }
                                        ], false),
                                        shadowColor: color, //阴影颜色
                                        shadowBlur: 20 //shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
                                    }
                                },
                                data: data.valueList
                            }]
                        };
                        this.chart.setOption(option);

                    },
                    dataBoardHomeLine(id, data) {
                        this.chart = echarts.init(document.getElementById(id));
                        let option = {

                            grid: {
                                top: '5%',
                                left: '0%',
                                right: '18%',
                                bottom: '0%',
                                containLabel: true
                            },
                            xAxis: {
                                type: 'value',
                                boundaryGap: false,
                                splitLine: {show: false},
                                axisTick: {show: false},
                                axisLine: {show: false},
                                axisLabel: {
                                    show: false
                                },
                            },
                            yAxis: {
                                data: ['', '', ''],
                                splitLine: {show: false},
                                axisTick: {show: false},
                                axisLine: {
                                    show: false,
                                },
                                axisLabel: {
                                    show: false,
                                    color: '#fff',

                                },

                                nameLocation: "middle",
                            },
                            series: [
                                {
                                    type: 'bar',
                                    barWidth: 5,
                                    barGap: '100%',
                                    itemStyle: {
                                        normal: {
                                            color: function (params) {
                                                let colorList = [
                                                    "#EE1919",
                                                    "rgb(250,222,80)",
                                                    "rgb(13,110,255)",
                                                ];
                                                return colorList[params.dataIndex];
                                            },
                                            barBorderRadius: [20, 20, 20],
                                        }
                                    },
                                    label: {
                                        normal: {
                                            show: true,
                                            position: 'right',
                                            formatter: '{c} '
                                        },

                                    },
                                    data: data
                                }
                            ]
                        };
                        this.chart.setOption(option);

                    },
                }
            }
        },
    })
}
export default {
    install
}
