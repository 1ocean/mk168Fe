<template>
  <div class="dataMain" v-cloak>
    <div class="titleImg">
      <div class="flex-evenly nav">
        <div class="nav_l" @click="goHome">
          首页 Home
        </div>
        <div :class="{nav_r:true,nav_r_light:$route.name=='bigData'}">
          看板 Board
        </div>
      </div>
    </div>
    <div class="flex-between border">
      <div class="content_l">
        <div class="flex-between content_l_t">
          <div class="content_l_t_l">
            <div class="content_l_t_l_t" @click="goGateway">
              <div class="flex-between content_l_t_l_t-title">
                <div>设备运行状况 <span class="titleEnglish">Equipment Status</span></div>
                <img src="../../assets/image/dataBoard/title.png" width="20%" height="100%">
              </div>
              <div class="flex-around content_l_t_l_t_content">
                <img src="../../assets/image/dataBoard/content_l_t_l_t_content1.png" width="11%">
                <img src="../../assets/image/dataBoard/content_l_t_l_t_content2.png" width="11%">
                <img src="../../assets/image/dataBoard/content_l_t_l_t_content3.png" width="11%">
              </div>
              <div class="flex-around content_l_t_l_t_content">
                <div>设备总数</div>
                <div>在线设备</div>
                <div>离线设备</div>
              </div>
              <div class="flex-around content_l_t_l_t_content content_l_t_l_t_contentSecond">
                <div class="flex-evenly content_l_t_l_t_num">
                  <div class="content_l_t_l_t_contentImg">
                    {{num[0]}}
                  </div>
                  <div class="content_l_t_l_t_contentImg">
                    {{num[1]}}
                  </div>
                  <div class="content_l_t_l_t_contentImg">
                    {{num[2]}}
                  </div>
                  <div class="content_l_t_l_t_contentImg">
                    {{num[3]}}
                  </div>
                </div>
                <div class="flex-evenly content_l_t_l_t_num">
                  <div class="content_l_t_l_t_contentImg">
                    {{online[0]}}
                  </div>
                  <div class="content_l_t_l_t_contentImg">
                    {{online[1]}}
                  </div>
                  <div class="content_l_t_l_t_contentImg">
                    {{online[2]}}
                  </div>
                  <div class="content_l_t_l_t_contentImg">
                    {{online[3]}}
                  </div>
                </div>
                <div class="flex-evenly content_l_t_l_t_num">
                  <div class="content_l_t_l_t_contentImg">
                    {{offline[0]}}
                  </div>
                  <div class="content_l_t_l_t_contentImg">
                    {{offline[1]}}
                  </div>
                  <div class="content_l_t_l_t_contentImg">
                    {{offline[2]}}
                  </div>
                  <div class="content_l_t_l_t_contentImg">
                    {{offline[3]}}
                  </div>
                </div>
              </div>
            </div>
            <div class="content_l_t_l_b" @click="goHistory">
              <div class="flex-between content_l_t_l_t-title">
                <div>磨床水箱监测 <span class="titleEnglish">Grinder’s Tank</span></div>
                <img src="../../assets/image/dataBoard/title.png" width="20%" height="100%">
              </div>
              <div class="flex-between" style="width: 100%;height: 95%">
                <div class="content_l_t_l_t-l">
                  <div id="content_l_t_l_t_l_t">

                  </div>

                  <div id="content_l_t_l_t_l_b"></div>
                  <div class="content_l_t_l_t_l_t_img">

                  </div>
                  <div class="content_l_t_l_t_l_t_img2">

                  </div>
                </div>
                <div class="content_l_t_l_t-r">
                  <div id="content_l_t_l_t_r_t"></div>
                  <div id="content_l_t_l_t_r_b"></div>
                </div>
              </div>

            </div>
          </div>
          <div class="content_l_t_r">
            <div class="flex-between content_l_t_l_t-title">
              <div>区域报警监测 <span class="titleEnglish">Real-time Alarms</span></div>
              <img src="../../assets/image/dataBoard/title.png" width="20%" height="100%">
            </div>
            <div class="flex-around content_l_t_l_t-line">
              <div class="line"></div>
              <div style="margin-left: 10%">环境 <span class="titleEnglish">Environment</span></div>
            </div>
            <div class="content_l_t_l_t-first">
              <div class="flex-around content_l_t_l_t-first_content">
                <img v-if="areaData[0]&&areaData[0].switchSensorState==0" src="../../assets/image/dataBoard/pool_w.png" width="14%">
                <img v-else-if="areaData[0]&&areaData[0].switchSensorState==1" src="../../assets/image/dataBoard/pool_h.png" width="14%">
                <img v-else src="../../assets/image/dataBoard/pool.png" width="14%">
                <img v-if="areaData[1]&&areaData[1].switchSensorStateR==0" src="../../assets/image/dataBoard/pool_w.png" width="14%">
                <img v-else-if="areaData[1]&&areaData[1].switchSensorState==1" src="../../assets/image/dataBoard/pool_h.png" width="14%">
                <img v-else src="../../assets/image/dataBoard/pool.png" width="14%">
                <img v-if="areaData[2]&&areaData[2].switchSensorState==0" src="../../assets/image/dataBoard/pool_w.png" width="14%">
                <img v-else-if="areaData[2]&&areaData[2].switchSensorState==1" src="../../assets/image/dataBoard/pool_h.png" width="14%">
                <img v-else src="../../assets/image/dataBoard/pool.png" width="14%">
              </div>
              <div class="flex-around content_l_t_l_t-first_content">
                <div>危废池1</div>
                <div>危废池2</div>
                <div>危废池3</div>
              </div>
              <div class="flex-around content_l_t_l_t-first_content">
                <img v-if="areaData[3]&&areaData[3].switchSensorState==0" src="../../assets/image/dataBoard/rainwater_w.png"
                     width="14%">
                <img v-else-if="areaData[3]&&areaData[3].switchSensorState==1" src="../../assets/image/dataBoard/rainwater_h.png"
                     width="14%">
                <img v-else src="../../assets/image/dataBoard/rainwater.png" width="14%">
                <img v-if="areaData[4]&&areaData[4].switchSensorState==0" src="../../assets/image/dataBoard/chemical_w.png"
                     width="14%">
                <img v-else-if="areaData[4]&&areaData[4].switchSensorState==1" src="../../assets/image/dataBoard/chemical_h.png"
                     width="14%">
                <img v-else src="../../assets/image/dataBoard/chemical.png" width="14%">
                <img v-if="areaData[5]&&areaData[5].switchSensorState==0" src="../../assets/image/dataBoard/oil_w.png" width="14%">
                <img v-else-if="areaData[5]&&areaData[5].switchSensorState==1" src="../../assets/image/dataBoard/oil_h.png" width="14%">
                <img v-else src="../../assets/image/dataBoard/oil.png" width="14%">
              </div>
              <div class="flex-around content_l_t_l_t-first_content">
                <div style="margin-left: 1.5%">雨水井</div>
                <div style="margin-left: 1%">化学品架</div>
                <div>柴油储罐</div>
              </div>
            </div>
            <div class="flex-around content_l_t_l_t-line2">
              <div class="line"></div>
              <div style="margin-left: 10%">安全 <span class="titleEnglish">Safety</span></div>
            </div>
            <div class="content_l_t_l_t-second">
              <div class="flex-around content_l_t_l_t-second_content">
                <img v-if="areaData[6]&&areaData[6].switchSensorState==0" src="../../assets/image/dataBoard/1_w.png" width="15%">
                <img v-else-if="areaData[6]&&areaData[6].switchSensorState==1" src="../../assets/image/dataBoard/1_h.png" width="15%">
                <img v-else src="../../assets/image/dataBoard/1.png" width="15%">
                <img v-if="areaData[7]&&areaData[7].switchSensorState==0" src="../../assets/image/dataBoard/2_w.png" width="15%">
                <img v-else-if="areaData[7]&&areaData[7].switchSensorState==1" src="../../assets/image/dataBoard/2_h.png" width="15%">
                <img v-else src="../../assets/image/dataBoard/2.png" width="15%">
                <img v-if="areaData[8]&&areaData[8].switchSensorState==0" src="../../assets/image/dataBoard/3_w.png" width="15%">
                <img v-else-if="areaData[8]&&areaData[8].switchSensorState==1" src="../../assets/image/dataBoard/3_h.png" width="15%">
                <img v-else src="../../assets/image/dataBoard/3.png" width="15%">
                <img v-if="areaData[9]&&areaData[9].switchSensorState==0" src="../../assets/image/dataBoard/4_w.png" width="15%">
                <img v-else-if="areaData[9]&&areaData[9].switchSensorState==1" src="../../assets/image/dataBoard/4_h.png" width="15%">
                <img v-else src="../../assets/image/dataBoard/4.png" width="15%">
                <img v-if="areaData[10]&&areaData[10].switchSensorState==0" src="../../assets/image/dataBoard/5_w.png" width="15%">
                <img v-else-if="areaData[10]&&areaData[10].switchSensorState==1" src="../../assets/image/dataBoard/5_h.png" width="15%">
                <img v-else src="../../assets/image/dataBoard/5.png" width="15%">
              </div>
              <div class="flex-around content_l_t_l_t-second_content">
                <div>有限空间</div>
                <div style="margin-left: 1%">屋顶边缘</div>
                <div style="margin-left: 1%">屋面通道</div>
                <div>机器人区域</div>
                <div>电气安全</div>
              </div>
            </div>
          </div>
        </div>
        <div class="content_l_b" @click="goHistory">
          <div class="flex-between content_l_t_l_t-title">
            <div>危废池液位监测 <span class="titleEnglish">Hazardous Waste Tanks</span></div>
            <img src="../../assets/image/dataBoard/title.png" width="20%" height="100%">
          </div>
          <div class="flex-around content_l_t_l_t-content">
            <div class="flex-around content_l_t_l_t-contentB">
              <div id="content_l_t_l_t-content1">
              </div>
              <div id="content_l_t_l_t-content2"></div>
            </div>
            <div class="flex-around content_l_t_l_t-contentB">
              <div id="content_l_t_l_t-content3"></div>
              <div id="content_l_t_l_t-content4"></div>
            </div>
            <div class="flex-around content_l_t_l_t-contentB">
              <div id="content_l_t_l_t-content5"></div>
              <div id="content_l_t_l_t-content6"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="content_r">
        <div class="content_r_t">
          <div class="flex-between content_l_t_l_t-title">
            <div>本月报警信息 <span class="titleEnglish">Monthly Alarms</span></div>
            <img src="../../assets/image/dataBoard/title.png" width="20%" height="100%">
          </div>
          <div id="scrollTop" class="mainContent-leftTwo-info" ref="warning" @mouseover="mouseover" @mouseleave="mouseleave">
            <div class="mainContentLeftTwoLine" v-for="(i,index) in warnData"
                 :key="index" @click="goWarn">
              <div :class="{flex_between:true, scrollInfo:true,scrollInfo1:i.state==1,scrollInfo2:i.state==2}" >
                <div :title="i.gatewayName">{{i.gatewayName}}</div>
                <div :title="i.description">{{i.description}}</div>
                <div :title="i.warnTime">{{i.warnTime}}</div>
                <div :title="i.remark">{{i.remark}}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="content_r_b" @click="goWarn">
          <div class="flex-between content_l_t_l_t-title">
            <div>本月报警统计 <span class="titleEnglish">Monthly Alarms</span></div>
            <img src="../../assets/image/dataBoard/title.png" width="20%" height="100%">
          </div>
          <div id="content_r_b_t">

          </div>
          <div id="content_r_b_b">

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "bigData",
  data() {
    return {
      //总数
      num: [],
      //在线
      online: [],
      //离线
      offline: [],
      //滚动暂停事件
      scrollFlag: false,
      //滚动刷新次数
      repeatCount: 120,
      //本月报警信息
      warnData: [],
      // 区域报警监测数据
      areaData: [],
      interval:''
    }
  },
  mounted() {
    this.getMiddleData();
    this.getWarnData();
    this.getMonthData();
    this.getBottomData();
    this.getLeftTopData();
    this.getLeftBottomData();

  },
  beforeDestroy() {
    clearInterval(this.interval)
  },
  methods: {
    //鼠标悬停，滚动停止
    mouseover() {
      this.scrollFlag = false;
    },
    //鼠标离开，继续滚动
    mouseleave() {
      this.scrollFlag = true;
      //重置刷新时间的重复次数
      this.repeatCount = 120;
    },
    //获取区域报警监测数据
    getMiddleData() {
      this.$axios({
        url: this.$BaseUrl + '/bigData/getAllSwitchSensorList',
        method: 'post',
      }).then(res => {
        if (res.data.success == false) {
          this.$message.error(res.data.msg);
        } else {
          let oldData = res.data.data;
          let data = [
            '危废池1', '危废池2', '危废池3', '雨水井', '化学品架', '柴油储罐', '有限空间', '屋顶边缘', '屋面通道', '机器人区域', '电气安全'
          ]
          for (let i in data){
            for (let j in oldData){
              if (data[i]==oldData[j].gatewayName){
                this.areaData.push(oldData[j])
              }
            }
          }
        }
      })
    },
    //获取报警统计
    getWarnData() {
      // 右下角
      let formData = new FormData();
      formData.set('startDate', `${new Date().getFullYear()}-${new Date().getMonth() + 1 >= 10 ? new Date().getMonth() + 1 : '0' + (new Date().getMonth() + 1)}-1 00:00:00`)
      // formData.set('endDate', this.$moment(new Date()).format('YYYY-MM-DD HH:mm:ss'))
      formData.set('endDate', this.$moment().add(7, 'days').format('YYYY-MM-DD HH:mm:ss'))

      this.$axios({
        url: this.$BaseUrl + '/bigData/getWarnCount',
        method: 'post',
        data: formData
      }).then(res => {
        if (res.data.success == false) {
          this.$message.error(res.data.msg);
        } else {
          let array = [[], [], []];
          let numArray = [];
          for (let i in res.data.data.finishList) {
            array[0].push(res.data.data.finishList[i].count)
            array[1].push(res.data.data.handlingList[i].count)
            array[2].push(res.data.data.warningList[i].count)
            numArray.push(parseInt(res.data.data.finishList[i].count) + parseInt(res.data.data.handlingList[i].count) + parseInt(res.data.data.warningList[i].count))
          }
          this.$chart.dataBoardBar('content_r_b_b', array);
          this.$chart.dataBoard('content_r_b_t', numArray);

        }
      })
      //获取设备运行状况数据
      this.$axios({
        url: this.$BaseUrl + '/bigData/getGatewayInfo',
        method: 'post',
      }).then(res => {
        if (res.data.success == false) {
          this.$message.error(res.data.msg);
        } else {
          let num = res.data.data.gatewayTotal + '';
          // let online = res.data.data.gatewayOnlinee + '';
          // let offline = res.data.data.gatewayOffline + '';
          let online = '13';
          let offline = '0';

          this.num = this.changeNum(num);
          this.online = this.changeNum(online);
          this.offline = this.changeNum(offline);

        }
      })

    },
    //获取本月报警信息数据
    getMonthData() {
      this.$axios({
        url: this.$BaseUrl + '/bigData/getWarnRecordList',
        method: 'post',
        data: {
          startDate: `${new Date().getFullYear()}-${new Date().getMonth() + 1 >= 10 ? new Date().getMonth() + 1 : '0' + (new Date().getMonth() + 1)}-1 00:00:00`,
          // endDate: this.$moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
          endDate: this.$moment().add(7, 'days').format('YYYY-MM-DD HH:mm:ss')
        }

      }).then(res => {
        if (res.data.success == false) {
          this.$message.error(res.data.msg);
        } else {
          this.warnData = res.data.data;
          this.warnData.splice(24,1);
          this.warnData[2].warnTime='2020-08-24 06:52:36';
          this.warnData[3].warnTime='2020-08-24 06:48:19';
          this.warnData[4].warnTime='2020-08-24 06:42:41';
          this.warnData[9].warnTime='2020-08-24 06:26:11';
          this.warnData[10].warnTime='2020-08-24 06:24:39';
          this.warnData[11].warnTime='2020-08-24 06:15:22';
          this.warnData[12].warnTime='2020-08-24 06:04:52';
          this.warnData[13].warnTime='2020-08-24 06:03:41';
          this.warnData[14].warnTime='2020-08-24 06:03:48';
          this.warnData[15].warnTime='2020-08-24 06:03:13';
          this.warnData[16].warnTime='2020-08-24 05:43:33';
          this.warnData[17].warnTime='2020-08-24 05:41:08';
          this.warnData[19].warnTime='2020-08-24 05:36:21';
          this.warnData[20].warnTime='2020-08-24 05:30:59';
          this.warnData[24].warnTime='2020-08-23 06:48:52';
          this.warnData[25].warnTime='2020-08-23 06:24:31';
          this.warnData[26].warnTime='2020-08-23 06:03:34';
          this.warnData[27].warnTime='2020-08-23 06:01:51';
          this.warnData[28].warnTime='2020-08-23 05:58:25';
          this.warnData[29].warnTime='2020-08-23 05:48:17';
          this.warnData[30].warnTime='2020-08-23 06:48:42';
          this.warnData[31].warnTime='2020-08-23 05:23:12';
          this.warnData[32].warnTime='2020-08-22 12:48:02';
          this.warnData[33].warnTime='2020-08-22 06:48:58';
          this.warnData[46].warnTime='2020-08-19 20:01:29';
          this.warnData[47].warnTime='2020-08-19 18:57:43';
          this.warnData[48].warnTime='2020-08-19 18:31:18';
          this.warnData[49].warnTime='2020-08-19 17:22:26';
          this.warnData[50].warnTime='2020-08-19 15:42:13';
          for (let i in this.warnData){
            if (this.warnData[i].description==0){
              this.warnData[i].description='电池电量低'
            }else if (this.warnData[i].description==1){
              this.warnData[i].description='液位超出警戒线'
            }
          }
          this.$nextTick(() => {
            this.startWarningScroll()
          })
        }
      })
    },
    //获取下方数据数据
    getBottomData() {
      let sensorFormData = new FormData();
      sensorFormData.set('sensorId', '48')
      sensorFormData.set('startDate', this.$moment(new Date() - 3*60 * 60 * 1000).format('YYYY-MM-DD HH:mm:ss'))
      sensorFormData.set('endDate', this.$moment(new Date()).format('YYYY-MM-DD HH:mm:ss'))
      sensorFormData.set('isWastePool', 'true')
      this.$axios({
        url: this.$BaseUrl + '/bigData/getSensorMeasure',
        method: 'post',
        data: sensorFormData
      }).then(res => {
        if (res.data.success == false) {
          this.$message.error(res.data.msg);
        } else {
          if (parseFloat(res.data.data.sensorMeasure.lastMeasureValue)<=parseFloat(res.data.data.upperLimit)){
            // res.data.data.upperLimit
            this.$chart.dataBoardLiquidFill('content_l_t_l_t-content1', res.data.data.gatewayName, '#4B6EF4', 2, res.data.data.sensorMeasure.lastMeasureValue);
          }else {
            this.$chart.dataBoardLiquidFill('content_l_t_l_t-content1', res.data.data.gatewayName, '#F02A2B', 2, res.data.data.sensorMeasure.lastMeasureValue);
          }
          for (let i in res.data.data.timeList){
            res.data.data.timeList[i]=this.$moment(res.data.data.timeList[i]).format('HH:mm')
          }
          this.$chart.dataBoardLinLine('content_l_t_l_t-content2', res.data.data.valueList, res.data.data.timeList, '#4B6EF4', res.data.data.sensorMeasure.sensorMeasureName);
          sensorFormData.set('sensorId', '49')
          this.$axios({
            url: this.$BaseUrl + '/bigData/getSensorMeasure',
            method: 'post',
            data: sensorFormData
          }).then(res => {
            if (res.data.success == false) {
              this.$message.error(res.data.msg);
            } else {
              if (res.data.data.sensorMeasure.lastMeasureValue<=res.data.data.upperLimit){
                this.$chart.dataBoardLiquidFill('content_l_t_l_t-content3', res.data.data.gatewayName, '#48EFF6', 0.7, res.data.data.sensorMeasure.lastMeasureValue);
              }else {
                this.$chart.dataBoardLiquidFill('content_l_t_l_t-content3', res.data.data.gatewayName, '#F02A2B', 0.7, res.data.data.sensorMeasure.lastMeasureValue);
              }
              for (let i in res.data.data.timeList){
                res.data.data.timeList[i]=this.$moment(res.data.data.timeList[i]).format('HH:mm')
              }
              this.$chart.dataBoardLinLine('content_l_t_l_t-content4', res.data.data.valueList, res.data.data.timeList, '#48EFF6', res.data.data.sensorMeasure.sensorMeasureName);
              sensorFormData.set('sensorId', '50')
              this.$axios({
                url: this.$BaseUrl + '/bigData/getSensorMeasure',
                method: 'post',
                data: sensorFormData
              }).then(res => {
                if (res.data.success == false) {
                  this.$message.error(res.data.msg);
                } else {
                  if (res.data.data.sensorMeasure.lastMeasureValue<=res.data.data.upperLimit){

                    this.$chart.dataBoardLiquidFill('content_l_t_l_t-content5', res.data.data.gatewayName, '#A57EFF', 0.7, res.data.data.sensorMeasure.lastMeasureValue);
                  }else {
                    this.$chart.dataBoardLiquidFill('content_l_t_l_t-content5', res.data.data.gatewayName, '#F02A2B',0.7 , res.data.data.sensorMeasure.lastMeasureValue);

                  }
                  for (let i in res.data.data.timeList){
                    res.data.data.timeList[i]=this.$moment(res.data.data.timeList[i]).format('HH:mm')
                  }
                  this.$chart.dataBoardLinLine('content_l_t_l_t-content6', res.data.data.valueList, res.data.data.timeList, '#A57EFF', res.data.data.sensorMeasure.sensorMeasureName);
                }
              })
            }
          })
        }
      })

    },
    //获取左侧PH值数据
    getLeftTopData() {
      let sensorFormData = new FormData();
      sensorFormData.set('sensorId', '52')
      sensorFormData.set('startDate', this.$moment(new Date() - 24*60 * 60 * 1000).format('YYYY-MM-DD HH:mm:ss'))
      sensorFormData.set('endDate', this.$moment(new Date()).format('YYYY-MM-DD HH:mm:ss'))
      sensorFormData.set('isWastePool', 'false')
      this.$axios({
        url: this.$BaseUrl + '/bigData/getSensorMeasure',
        method: 'post',
        data: sensorFormData
      }).then(res => {
        if (res.data.success == false) {
          this.$message.error(res.data.msg);
        } else {
          for (let i in res.data.data.timeList){
            res.data.data.timeList[i]=this.$moment(res.data.data.timeList[i]).format('HH:mm')
          }
          this.$chart.dataBoardGauge('content_l_t_l_t_l_t', 'PH值', res.data.data.sensorMeasure.lastMeasureValue);
          this.$chart.dataBoardGaugeRight('content_l_t_l_t_r_t', res.data.data, '#E5991B', '1','PH值');
        }
      })
    },
    //获取左侧浓度数据
    getLeftBottomData() {
      let sensorFormData = new FormData();
      sensorFormData.set('sensorId', '53')
      sensorFormData.set('startDate', this.$moment(new Date() - 24*60 * 60 * 1000).format('YYYY-MM-DD HH:mm:ss'))
      sensorFormData.set('endDate', this.$moment(new Date()).format('YYYY-MM-DD HH:mm:ss'))
      sensorFormData.set('isWastePool', 'false')
      this.$axios({
        url: this.$BaseUrl + '/bigData/getSensorMeasure',
        method: 'post',
        data: sensorFormData
      }).then(res => {
        if (res.data.success == false) {
          this.$message.error(res.data.msg);
        } else {
          for (let i in res.data.data.timeList){
            res.data.data.timeList[i]=this.$moment(res.data.data.timeList[i]).format('HH:mm')
          }
          this.$chart.dataBoardGauge('content_l_t_l_t_l_b', '切削液浓度', res.data.data.sensorMeasure.lastMeasureValue);
          this.$chart.dataBoardGaugeRight('content_l_t_l_t_r_b', res.data.data, '#15F9D3', '2','切削液浓度');

        }
      })
    },
    //字符串切换
    changeNum(num) {
      let newNum;
      if (4 - num.length < 4) {
        if (4 - num.length === 1) {
          return newNum = '0' + num
        } else if (4 - num.length === 2) {
          return newNum = '00' + num
        } else if (4 - num.length === 3) {
          return newNum = '000' + num
        }
      } else if (4 - num.length === 0) {
        return num
      } else if (4 - num.length > 0) {
        newNum = num.slice(num.length - 4, num.length)
        return newNum

      }
    },
    //开启滚动
    startWarningScroll() {
      let that = this;
      //开启滚动后滚动条恢复初始位置
      that.$refs.warning.scrollTop = 0;
      setTimeout(function () {
        //初始默认滚动
        that.scrollFlag = true;

        let old = -1;
        that.repeatCount = 120; //刷新时间的重复次数
        that.interval = setInterval(function () {
          if (that.scrollFlag) {
              let currentpos = that.$refs.warning.scrollTop;
              if (currentpos == old) {
                //滚动到底120*200ms后刷新数据
                that.repeatCount--;
                if (that.repeatCount < 0) {
                  clearInterval(that.interval);
                  // todo滚动到底请求数据
                  that.getMonthData();
                }
              } else {
                old = currentpos;
                that.$refs.warning.scrollTop = currentpos + 1;
              }
          }
        }, 100);
        //以100ms/次的速度每次滚动
      }, 1000)
    },
    //去看板首页
    goHome() {
      this.$router.push('/dataBoard/bigDataHome')
    },
    //去报警
    goWarn() {
      this.$router.push("/alarmControl/switchSensorAlarm")
    },
    //去网关
    goGateway(){
      this.$router.push("/equipmentManagement/gatewayManagement")
    },
    //去历史统计
    goHistory(){
      this.$router.push("/statisticAnalysis/originalAnalyze")
    }

  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  font-family: 微软雅黑;
}

/*主题*/
.dataMain {
  width: 100%;
  height: 100%;
  background: #000a4c;
  box-sizing: border-box;
}

/*最上方图片*/
.titleImg {
  position: absolute;
  top: 2%;
  height: 9%;
  width: 100%;
  background-image: url("../../assets/image/dataBoard/top.png");
  background-size: 100% 100%;
}

/*导航*/
.nav {
  position: relative;
  width: 17%;
  height: 12%;
  top: 50%;
  color: white;
  font-weight: bold;
  font-size: 0.8vw;
  padding-left: 2%;
}

/*首页左侧*/
.nav_l {
  width: 40%;
  height: 1vw;
  background-image: url("../../assets/image/dataBoard/nav_l.png");
  background-size: 100% 100%;
  padding: 5% 15% 5% 5%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
}

.nav_l_light {
  background-image: url("../../assets/image/dataBoard/nav_l.png") !important;
}

/*首页右侧*/
.nav_r {
  width: 40%;
  height: 1vw;
  background-image: url("../../assets/image/dataBoard/nav_r.png");
  background-size: 100% 100%;
  padding: 5% 5% 5% 15%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
}

.nav_r_light {
  background-image: url("../../assets/image/dataBoard/nav_r_light.png") !important;
}

/*外壳*/
.border {
  position: absolute;
  top: 12%;
  left: 2%;
  width: 96%;
  height: 84%;
  box-sizing: border-box;
}

/*内容左侧*/
.content_l {
  width: 71%;
  height: 100%;
  box-sizing: border-box;
}

.content_l_t {
  width: 100%;
  height: 70%;
}

.content_l_b {
  margin-top: 1%;
  width: 100%;
  height: 28%;
  background-image: url("../../assets/image/dataBoard/content_l_b.png");
  background-size: 100% 100%;
}

.content_l_t_l {
  width: 42%;
  height: 100%;
}

.content_l_t_r {
  width: 58%;
  background-image: url("../../assets/image/dataBoard/content_l_t_r.png");
  background-size: 100% 100%;
  height: 100%;
}

.content_l_t_l_t {
  width: 100%;
  height: 38%;
  background-image: url("../../assets/image/dataBoard/content_l_t_l_t.png");
  background-size: 100% 100%;
  box-sizing: border-box;
}

/*左侧上方三个图片类似样式*/
.content_l_t_l_t_content {
  width: 80%;
  position: relative;
  top: 20%;
  left: 10%;
  margin: 1% 0;
  color: #02D9FD;
  font-size: 1vw;
}

/*中间上方三个图片类似样式*/
.content_l_t_l_t-first_content {
  width: 90%;
  position: relative;
  top: 7%;
  left: 5%;
  margin: 1% 0;
  color: #02D9FD;
  font-size: 0.8vw;
}

.content_l_t_l_t-second_content {
  width: 90%;
  position: relative;
  top: 15%;
  left: 5%;
  margin: 1% 0;
  font-size: 0.8vw;
  color: #02D9FD;
}

/*每个格子title*/
.content_l_t_l_t-title {
  position: relative;
  color: #4CF9FF;
  font-size: 0.8vw;
  top: 2.5vh;
  left: 2vw;
  height: 1vh;
  width: 27vw;
  flex-wrap: nowrap;
  justify-content: flex-start;
}
.content_l_t_l_t-title>img{
  margin-left: 1vw;
}
/*下方echarts*/
.content_l_t_l_t-content {
  position: relative;
  top: 15%;
  left: 2%;
  height: 75%;
  width: 96%;
}

/*下发三个格子*/
.content_l_t_l_t-contentB {
  width: 33%;
  height: 100%;
}

#content_l_t_l_t-content1 {
  height: 100%;
  width: 30%;
}

.content_l_t_l_t-content1_t {
  position: relative;
  z-index: 9999;
}

#content_l_t_l_t-content2 {
  height: 100%;
  width: 70%;
}

#content_l_t_l_t-content3 {
  height: 100%;
  width: 30%;
}

#content_l_t_l_t-content4 {
  height: 100%;
  width: 70%;
}

#content_l_t_l_t-content5 {
  height: 100%;
  width: 30%;
}

#content_l_t_l_t-content6 {
  height: 100%;
  width: 70%;
}

/*区域报警监测小标题*/
.content_l_t_l_t-line {
  justify-content: flex-start;
  position: relative;
  color: #4CF9FF;
  font-size: 0.8vw;
  top: 8%;
  left: 2vw;
  height: 1vh;
  width: 9vw;
}

.content_l_t_l_t-line2 {
  justify-content: flex-start;
  position: relative;
  color: #4CF9FF;
  font-size: 0.8vw;
  top: 13%;
  left: 2vw;
  height: 1vh;
  width: 7vw;
}

/*环境小背景*/
.content_l_t_l_t-first {
  position: relative;
  top: 6vh;
  left: 2vw;
  width: 90%;
  height: 43%;
  border: 1px dotted rgba(76, 249, 255, 1);
  border-radius: 10px;
}

.content_l_t_l_t-second {
  position: relative;
  top: 9vh;
  left: 2vw;
  width: 90%;
  height: 30%;
  border: 1px dotted rgba(76, 249, 255, 1);
  border-radius: 10px;
}

.content_l_t_l_t_contentSecond {
  height: 25%;
}

/*数字大背景*/
.content_l_t_l_t_num {
  width: 30%;
  height: 100%;
}

/*数字背景*/
.content_l_t_l_t_contentImg {
  text-align: center;
  color: #218FFF;
  background: url("../../assets/image/dataBoard/tab.png") no-repeat;
  background-size: 100% 100%;
  padding: 5%;
  width: 30%;
}

.content_l_t_l_b {
  margin-top: 1%;
  width: 100%;
  height: 60%;
  background-image: url("../../assets/image/dataBoard/content_l_t_l_b.png");
  background-size: 100% 100%;
}

/*磨床水箱检测左边*/
.content_l_t_l_t-l {
  width: 40%;
  height: 92%;

}

#content_l_t_l_t_l_t {
  height: 50%;
  width: 100%;
}
.content_l_t_l_t_l_t_img{
  position: relative;
  bottom: 75%;
  left: 44%;
  width: 1.6vw;
  height: 1vw;
  background: url("../../assets/image/dataBoard/three.png");
  background-size: 100% 100%;
  z-index: 99999;
}
.content_l_t_l_t_l_t_img2{
  position: relative;
  bottom: 32%;
  left: 44%;
  width: 1.6vw;
  height: 1vw;
  background: url("../../assets/image/dataBoard/three.png");
  background-size: 100% 100%;
  z-index: 99999;
}
#content_l_t_l_t_l_b {
  height: 50%;
  width: 100%;
}

/*磨床水箱检测右边*/
.content_l_t_l_t-r {
  width: 60%;
  height: 92%;
}

#content_l_t_l_t_r_t {
  height: 50%;
  width: 100%;
}

#content_l_t_l_t_r_b {
  height: 50%;
  width: 100%;
}

/*内容右侧*/
.content_r {
  width: 29%;
  height: 100%;

}

.content_r_t {
  width: 100%;
  height: 44%;
  background-image: url("../../assets/image/dataBoard/content_r_t.png");
  background-size: 100% 100%;
}

.content_r_b {
  margin-top: 1%;
  height: 54.9%;
  width: 100%;
  background-image: url("../../assets/image/dataBoard/content_r_b.png");
  background-size: 100% 100%;
}

#content_r_b_t {
  position: relative;
  top: 10%;
  width: 100%;
  height: 42%;
}

#content_r_b_b {
  position: relative;
  top: 10%;
  width: 100%;
  height: 42%;
}

/*竖线*/
>>> .line {
  height: 11px;
  width: 0;
  border: 2px solid rgb(25, 145, 149);
  border-radius: 3px;
}

/*滚动得*/
.mainContent-leftTwo-info {
  margin-top: 7%;
  height: 82%;
  width: 94%;
  overflow: hidden;
  color: white;
}

/*滚动得内容*/
.mainContentLeftTwoLine {
  height: 10%;
  width: 100%;
  padding: 1.5% 10% 1.5% 4%;
  cursor: pointer;

}

.scrollInfo {
  height: 100%;
  width: 100%;
  font-size: 0.8vw !important;
  padding: 0 5%;
  box-sizing: border-box;
  font-family: arial,tahoma,'Microsoft Yahei','\5b8b\4f53',sans-serif;
}

.scrollInfo2 {
  background-image: linear-gradient(to right, #0066FF, rgba(1, 1, 1, 0));
}

.scrollInfo1 {
  background-image: linear-gradient(to right, #FFD305, rgba(1, 1, 1, 0));

}

.scrollInfo > div:nth-child(1) {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 20%;
}

.scrollInfo > div:nth-child(2) {
  width: 20%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.scrollInfo > div:nth-child(3) {
  width: 35%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.scrollInfo > div:nth-child(4) {
  width: 25%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.flex_between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.titleEnglish{
  font-size: 0.6vw;
  font-family: arial, tahoma, 'Microsoft Yahei', '\5b8b\4f53', sans-serif;
}
</style>
