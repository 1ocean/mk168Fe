<template>
  <div class="dataMain" v-cloak>
    <div class="control" @click="goControl">
      控制台<span class="lineName" style="margin-left: 5%;font-weight: bolder">Control</span>
    </div>
    <div class="flex-between titleImg">
      <div class="flex-evenly nav">
        <div class="nav_l">
          首页<span class="lineName" style="margin-left: 5%;font-weight: bolder">Home</span>
        </div>
        <div class="nav_r" @click="goDataBord">
          看板 <span class="lineName" style="margin-left: 5%;font-weight: bolder">Board</span>
        </div>
      </div>
    </div>
    <div class="main" @click.stop="allClose">
      <div class="flex-between main_top">
        <div class="main_top_img">
          <div class="flex-around main_top_img_content">
            <div>{{todayWarning}}</div>
            <div>今日报警数</div>
            <div class="main_top_img_en">Alarms Today</div>
          </div>
        </div>
        <div class="flex-evenly lineBorder">
          <div class="Line_l">
            <div class="lineName">处理完成 Closed</div>
            <div class="lineName">处理中 Ongoing</div>
            <div class="lineName">报警中 Alarming</div>
          </div>
          <div id="line">
          </div>
        </div>

        <div class="flex-between num" @click="goGateway">
          <div class="numContent">
            <div class="flex-evenly" style="width: 100%;height: 100%;box-sizing: border-box;padding: 5% 8%">
              <div class="numImg">
                <img src="../../assets/image/dataBoard/content_l_t_l_t_content1.png" height="100%" width="100%">
              </div>
              <div class="flex-evenly numContent_c">
                <div class="numWord">设备总数<span style="font-size: 0.7vw"> Total</span></div>
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
                  <div style="font-size: 0.8vw;color: #04F5FD;margin-top: 10%">
                    个
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="numContent">
            <div class="flex-evenly" style="width: 100%;height: 100%;box-sizing: border-box;padding: 5% 8%">
              <div class="numImg">
                <img src="../../assets/image/dataBoard/content_l_t_l_t_content2.png" height="100%" width="100%">
              </div>
              <div class="flex-evenly numContent_c">
                <div class="numWord">在线设备<span style="font-size: 0.7vw"> Online</span></div>
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
                  <div style="font-size: 0.8vw;color: #04F5FD;margin-top: 10%">
                    个
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="numContent">
            <div class="flex-evenly" style="width: 100%;height: 100%;box-sizing: border-box;padding: 5% 8%">
              <div class="numImg">
                <img src="../../assets/image/dataBoard/content_l_t_l_t_content3.png" height="100%" width="100%">
              </div>
              <div class="flex-evenly numContent_c">
                <div class="numWord">离线设备<span style="font-size: 0.7vw"> Offline</span></div>
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
                  <div style="font-size: 0.8vw;color: #04F5FD;margin-top: 10%">
                    个
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="map">
      </div>
    </div>
    <div class="map_left">
      <div :class="{roof:true,errorImg:areaData[7]&&areaData[7].switchSensorState==0,handing:areaData[7]&&areaData[7].switchSensorState==1}" @click.stop="roofCheck">
      </div>
      <div :class="{aisle:true,errorImg:areaData[8]&&areaData[8].switchSensorState==0,handing:areaData[8]&&areaData[8].switchSensorState==1}" @click.stop="aisleCheck">
      </div>
    </div>
    <div :class="{pool3:true,errorImg:areaData[2]&&areaData[2].switchSensorState==0,handing:areaData[2]&&areaData[2].switchSensorState==1}" @click.stop="pool3Check">
    </div>
    <div :class="{space:true,errorImg:areaData[6]&&areaData[6].switchSensorState==0,handing:areaData[6]&&areaData[6].switchSensorState==1}" @click.stop="spaceCheck">
    </div>
    <div :class="{rainwater:true,errorImg:areaData[3]&&areaData[3].switchSensorState==0,handing:areaData[3]&&areaData[3].switchSensorState==1}" @click.stop="rainwaterCheck">
    </div>
    <div :class="{chemicals:true,errorImg:areaData[4]&&areaData[4].switchSensorState==0,handing:areaData[4]&&areaData[4].switchSensorState==1}" @click.stop="chemicalsCheck">
    </div>
    <div :class="{pool1:true,errorImg:areaData[0]&&areaData[0].switchSensorState==0,handing:areaData[0]&&areaData[0].switchSensorState==1}" @click.stop="pool1Check">
    </div>
    <div :class="{robot:true,errorImg:areaData[9]&&areaData[9].switchSensorState==0,handing:areaData[9]&&areaData[9].switchSensorState==1}" @click.stop="robotCheck">
    </div>
    <div :class="{oil:true,errorImg:areaData[5]&&areaData[5].switchSensorState==0,handing:areaData[5]&&areaData[5].switchSensorState==1}" @click="oilCheck">
    </div>
    <div :class="{pool2:true,errorImg:areaData[1]&&areaData[1].switchSensorState==0,handing:areaData[1]&&areaData[1].switchSensorState==1}" @click.stop="pool2Check">
    </div>
    <div :class="{water:true}" @click.stop="waterCheck">
    </div>
    <div class="map_right" v-if="pool1">
      <div class="flex-between content_l_t_l_t-title">
        <div style="font-weight: bold">报警信息</div>
        <img src="../../assets/image/dataBoard/home/title.png" width="40%" height="100%">
      </div>
      <div class="mainContent-leftTwo-info">
        <div class="mainContentLeftTwoLine" v-for="(i,index) in pool1Data"
             :key="index">
          <div class="flex-between scrollInfo">
            <div :title="i.gatewayName">{{i.gatewayName}}</div>
            <div :title="i.description">{{i.description}}</div>
            <div :title="i.warnTime">{{i.warnTime}}</div>
            <div :title="i.remark">{{i.remark}}</div>
          </div>
        </div>
<!--        <div style="width: 100%">-->
<!--          <el-pagination-->
<!--              style="text-align: center"-->
<!--              small-->
<!--              :page-size="5"-->
<!--              layout="prev, pager, next"-->
<!--              @current-change="pool1Change"-->
<!--              :total="pool1Total">-->
<!--          </el-pagination>-->
<!--        </div>-->
<!---->
      </div>

    </div>
    <div class="map_right2" v-if="pool3">
      <div class="flex-between content_l_t_l_t-title">
        <div style="font-weight: bold">报警信息</div>
        <img src="../../assets/image/dataBoard/home/title.png" width="40%" height="100%">
      </div>
      <div class="mainContent-leftTwo-info">
        <div class="mainContentLeftTwoLine" v-for="(i,index) in pool3Data"
             :key="index">
          <div class="flex-between scrollInfo">
            <div :title="i.gatewayName">{{i.gatewayName}}</div>
            <div :title="i.description">{{i.description}}</div>
            <div :title="i.warnTime">{{i.warnTime}}</div>
            <div :title="i.remark">{{i.remark}}</div>
          </div>
        </div>
      </div>
<!--      <div style="width: 100%">-->
<!--        <el-pagination-->
<!--            style="text-align: center"-->
<!--            small-->
<!--            :hide-on-single-page="true"-->
<!--            :page-size="5"-->
<!--            layout="prev, pager, next"-->
<!--            @current-change="pool3Change"-->
<!--            :total="pool3Total">-->
<!--        </el-pagination>-->
<!--      </div>-->
    </div>
    <div class="map_right3" v-if="pool2">
      <div class="flex-between content_l_t_l_t-title">
        <div style="font-weight: bold">报警信息</div>
        <img src="../../assets/image/dataBoard/home/title.png" width="40%" height="100%">
      </div>
      <div class="mainContent-leftTwo-info">
        <div class="mainContentLeftTwoLine" v-for="(i,index) in pool2Data"
             :key="index">
          <div class="flex-between scrollInfo">
            <div :title="i.gatewayName">{{i.gatewayName}}</div>
            <div :title="i.description">{{i.description}}</div>
            <div :title="i.warnTime">{{i.warnTime}}</div>
            <div :title="i.remark">{{i.remark}}</div>
          </div>
        </div>
      </div>
<!--      <div style="width: 100%">-->
<!--        <el-pagination-->
<!--            style="text-align: center"-->
<!--            small-->
<!--            :hide-on-single-page="true"-->
<!--            :page-size="5"-->
<!--            layout="prev, pager, next"-->
<!--            @current-change="pool2Change"-->
<!--            :total="pool2Total">-->
<!--        </el-pagination>-->
<!--      </div>-->
    </div>
    <div class="map_right4" v-if="chemicals">
      <div class="flex-between content_l_t_l_t-title">
        <div style="font-weight: bold">报警信息</div>
        <img src="../../assets/image/dataBoard/home/title.png" width="40%" height="100%">
      </div>
      <div class="mainContent-leftTwo-info">
        <div class="mainContentLeftTwoLine" v-for="(i,index) in chemicalsData"
             :key="index">
          <div class="flex-between scrollInfo">
            <div :title="i.gatewayName">{{i.gatewayName}}</div>
            <div :title="i.description">{{i.description}}</div>
            <div :title="i.warnTime">{{i.warnTime}}</div>
            <div :title="i.remark">{{i.remark}}</div>
          </div>
        </div>
      </div>
<!--      <div style="width: 100%">-->
<!--        <el-pagination-->
<!--            style="text-align: center"-->
<!--            small-->
<!--            :hide-on-single-page="true"-->
<!--            :page-size="5"-->
<!--            layout="prev, pager, next"-->
<!--            @current-change="chemicalsChange"-->
<!--            :total="chemicalsTotal">-->
<!--        </el-pagination>-->
<!--      </div>-->
    </div>
    <div class="map_right5" v-if="oil">
      <div class="flex-between content_l_t_l_t-title">
        <div style="font-weight: bold">报警信息</div>
        <img src="../../assets/image/dataBoard/home/title.png" width="40%" height="100%">
      </div>
      <div class="mainContent-leftTwo-info">
        <div class="mainContentLeftTwoLine" v-for="(i,index) in oilData"
             :key="index">
          <div class="flex-between scrollInfo">
            <div :title="i.gatewayName">{{i.gatewayName}}</div>
            <div :title="i.description">{{i.description}}</div>
            <div :title="i.warnTime">{{i.warnTime}}</div>
            <div :title="i.remark">{{i.remark}}</div>
          </div>
        </div>
      </div>
<!--      <div style="width: 100%">-->
<!--        <el-pagination-->
<!--            style="text-align: center"-->
<!--            small-->
<!--            :hide-on-single-page="true"-->
<!--            :page-size="5"-->
<!--            layout="prev, pager, next"-->
<!--            @current-change="oilChange"-->
<!--            :total="oilTotal">-->
<!--        </el-pagination>-->
<!--      </div>-->
    </div>
    <div class="map_right6" v-if="space">
      <div class="flex-between content_l_t_l_t-title">
        <div style="font-weight: bold">报警信息</div>
        <img src="../../assets/image/dataBoard/home/title.png" width="40%" height="100%">
      </div>
      <div class="mainContent-leftTwo-info">
        <div class="mainContentLeftTwoLine" v-for="(i,index) in spaceData"
             :key="index">
          <div class="flex-between scrollInfo">
            <div :title="i.gatewayName">{{i.gatewayName}}</div>
            <div :title="i.description">{{i.description}}</div>
            <div :title="i.warnTime">{{i.warnTime}}</div>
            <div :title="i.remark">{{i.remark}}</div>
          </div>
        </div>
      </div>
<!--      <div style="width: 100%">-->
<!--        <el-pagination-->
<!--            style="text-align: center"-->
<!--            small-->
<!--            :hide-on-single-page="true"-->
<!--            :page-size="5"-->
<!--            layout="prev, pager, next"-->
<!--            @current-change="spaceChange"-->
<!--            :total="spaceTotal">-->
<!--        </el-pagination>-->
<!--      </div>-->
    </div>
    <div class="map_right7" v-if="roof">
      <div class="flex-between content_l_t_l_t-title">
        <div style="font-weight: bold">报警信息</div>
        <img src="../../assets/image/dataBoard/home/title.png" width="40%" height="100%">
      </div>
      <div class="mainContent-leftTwo-info">
        <div class="mainContentLeftTwoLine" v-for="(i,index) in roofData"
             :key="index">
          <div class="flex-between scrollInfo">
            <div :title="i.gatewayName">{{i.gatewayName}}</div>
            <div :title="i.description">{{i.description}}</div>
            <div :title="i.warnTime">{{i.warnTime}}</div>
            <div :title="i.remark">{{i.remark}}</div>
          </div>
        </div>
      </div>
<!--      <div style="width: 100%">-->
<!--        <el-pagination-->
<!--            style="text-align: center"-->
<!--            small-->
<!--            :hide-on-single-page="true"-->
<!--            :page-size="5"-->
<!--            layout="prev, pager, next"-->
<!--            @current-change="roofChange"-->
<!--            :total="roofTotal">-->
<!--        </el-pagination>-->
<!--      </div>-->
    </div>
    <div class="map_right8" v-if="rainwater">
      <div class="flex-between content_l_t_l_t-title">
        <div style="font-weight: bold">报警信息</div>
        <img src="../../assets/image/dataBoard/home/title.png" width="40%" height="100%">
      </div>
      <div class="mainContent-leftTwo-info">
        <div class="mainContentLeftTwoLine" v-for="(i,index) in rainwaterData"
             :key="index">
          <div class="flex-between scrollInfo">
            <div :title="i.gatewayName">{{i.gatewayName}}</div>
            <div :title="i.description">{{i.description}}</div>
            <div :title="i.warnTime">{{i.warnTime}}</div>
            <div :title="i.remark">{{i.remark}}</div>
          </div>
        </div>
      </div>
<!--      <div style="width: 100%">-->
<!--        <el-pagination-->
<!--            style="text-align: center"-->
<!--            small-->
<!--            :hide-on-single-page="true"-->
<!--            :page-size="5"-->
<!--            layout="prev, pager, next"-->
<!--            @current-change="rainwaterChange"-->
<!--            :total="rainwaterTotal">-->
<!--        </el-pagination>-->
<!--      </div>-->
    </div>
    <div class="map_right9" v-if="aisle">
      <div class="flex-between content_l_t_l_t-title">
        <div style="font-weight: bold">报警信息</div>
        <img src="../../assets/image/dataBoard/home/title.png" width="40%" height="100%">
      </div>
      <div class="mainContent-leftTwo-info">
        <div class="mainContentLeftTwoLine" v-for="(i,index) in aisleData"
             :key="index">
          <div class="flex-between scrollInfo">
            <div :title="i.gatewayName">{{i.gatewayName}}</div>
            <div :title="i.description">{{i.description}}</div>
            <div :title="i.warnTime">{{i.warnTime}}</div>
            <div :title="i.remark">{{i.remark}}</div>
          </div>
        </div>
      </div>
<!--      <div style="width: 100%">-->
<!--        <el-pagination-->
<!--            style="text-align: center"-->
<!--            small-->
<!--            :hide-on-single-page="true"-->
<!--            :page-size="5"-->
<!--            layout="prev, pager, next"-->
<!--            @current-change="aisleChange"-->
<!--            :total="aisleTotal">-->
<!--        </el-pagination>-->
<!--      </div>-->
    </div>
    <div class="map_right10" v-if="robot">
      <div class="flex-between content_l_t_l_t-title">
        <div style="font-weight: bold">报警信息</div>
        <img src="../../assets/image/dataBoard/home/title.png" width="40%" height="100%">
      </div>
      <div class="mainContent-leftTwo-info">
        <div class="mainContentLeftTwoLine" v-for="(i,index) in robotData"
             :key="index">
          <div class="flex-between scrollInfo">
            <div :title="i.gatewayName">{{i.gatewayName}}</div>
            <div :title="i.description">{{i.description}}</div>
            <div :title="i.warnTime">{{i.warnTime}}</div>
            <div :title="i.remark">{{i.remark}}</div>
          </div>
        </div>
      </div>
<!--      <div style="width: 100%">-->
<!--        <el-pagination-->
<!--            style="text-align: center"-->
<!--            small-->
<!--            :hide-on-single-page="true"-->
<!--            :page-size="5"-->
<!--            layout="prev, pager, next"-->
<!--            @current-change="robotChange"-->
<!--            :total="robotTotal">-->
<!--        </el-pagination>-->
<!--      </div>-->
    </div>
    <div class="map_info" v-if="pool3">
      <div class="flex-evenly map_info_content">
        <div class="map_info_content_title">
          危废池3
        </div>
        <div>
          <p>
            液位深度：{{pool3LastMeasureValue}}m
          </p>

        </div>
      </div>
    </div>
    <div class="map_info2" v-if="pool2">
      <div class="flex-evenly map_info_content">
        <div class="map_info_content_title">
          危废池2
        </div>
        <div>
          <p>
            液位深度：{{pool2LastMeasureValue}}m
          </p>

        </div>
      </div>
    </div>
    <div class="map_info3" v-if="pool1">
      <div class="flex-evenly map_info_content">
        <div class="map_info_content_title">
          危废池1
        </div>
        <div>
          <p>
            液位深度：{{pool1LastMeasureValue}}m
          </p>

        </div>
      </div>
    </div>
    <div class="map_info4" v-if="water">
      <div class="flex-evenly map_info_content">
        <div class="map_info_content_title">
          磨床水箱
        </div>
        <div>
          <p>
            PH值：{{waterPH}}
          </p>
          <p>
            切削液浓度：{{waterConcentration}}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "bigDataHome",
  data() {
    return {
      //总数
      num: [],
      //在线
      online: [],
      //离线
      offline: [],
      //危废池
      pool1: false,
      pool2: false,
      pool3: false,
      //化学品架
      chemicals: false,
      //柴油储罐
      oil: false,
      //有限空间
      space: false,
      //屋顶边缘
      roof: false,
      //水箱
      water: false,
      //雨水井
      rainwater: false,
      //通道
      aisle: false,
      //通道
      robot: false,
      //报警左侧框数据
      pool1LastMeasureValue: "",
      pool2LastMeasureValue: "",
      pool3LastMeasureValue: "",
      waterConcentration: "",
      waterPH: "",
      //报警数据
      pool1Data: '',
      pool2Data: '',
      pool3Data: '',
      waterData: '',
      chemicalsData: '',
      oilData: '',
      spaceData: '',
      roofData: '',
      rainwaterData: '',
      aisleData: '',
      robotData: '',

      //今日报警总数
      todayWarning: 0,
      //点颜色数据
      areaData: [],
      pool1Total:0,
      pool2Total:0,
      pool3Total:0,
      chemicalsTotal:0,
      oilTotal:0,
      spaceTotal:0,
      roofTotal:0,
      rainwaterTotal:0,
      aisleTotal:0,
      robotTotal:0,
    }
  },
  mounted() {
    this.getMiddleData();
    this.getPointData();
  },
  methods: {
    //获取今日报警数量和设备运行情况
    getMiddleData() {
      this.$axios({
        url: this.$BaseUrl + '/bigData/getTodayWarnCount',
        method: 'post',
      }).then(res => {
        if (res.data.success == false) {
          this.$message.error(res.data.msg);
        } else {
          this.todayWarning = res.data.data.finish + res.data.data.handling + res.data.data.warning;
          this.$chart.dataBoardHomeLine('line', [res.data.data.warning, res.data.data.handling, res.data.data.finish])
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
          let online = '13';
          // let offline = res.data.data.gatewayOffline + '';
          let offline = '0';

          this.num = this.changeNum(num);
          this.online = this.changeNum(online);
          this.offline = this.changeNum(offline);

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
    //所有框关闭
    allClose() {
      this.pool1 = false;
      this.pool2 = false;
      this.pool3 = false;
      this.water = false;
      this.chemicals = false;
      this.oil = false;
      this.space = false;
      this.roof = false;
      this.rainwater = false;
      this.aisle = false;
      this.robot = false;
    },
    //危废池统一接口
    async poolAxios(sensorId, gatewayId, needWarnRecord) {
      let formData = new FormData();
      formData.set('sensorId', sensorId)
      formData.set('gatewayId', gatewayId)
      formData.set('needWarnRecord', needWarnRecord)
      let data = await this.$axios({
        url: this.$BaseUrl + '/bigData/getMapData',
        method: 'post',
        data: formData
      })
      if (data.data.success == false) {
        this.$message.error(res.data.msg);
      } else {
        for (let i in data.data.data.warnRecordList) {
          if (data.data.data.warnRecordList[i].description == 0) {
            data.data.data.warnRecordList[i].description = '电池电量低'
          } else if (data.data.data.warnRecordList[i].description == 1) {
            data.data.data.warnRecordList[i].description = '液位超出警戒线'
          }
        }
        return data
      }

    },
    //统一接口
    async otherAxios(switchSensorId) {
      let formData = new FormData();
      formData.set('switchSensorId', switchSensorId)
      let data = await this.$axios({
        url: this.$BaseUrl + '/bigData/getSwitchWarnRecordList',
        method: 'post',
        data: formData
      })
      if (data.data.success == false) {
        this.$message.error(res.data.msg);
      } else {
        return data
      }

    },
    //危废池1点击
    pool1Check() {
      this.allClose();
      this.poolAxios(48, 1, true).then(data => {
        // this.oldPool1Data = data.data.data.warnRecordList;
        this.pool1Data = data.data.data.warnRecordList;
        this.pool1Data[2].warnTime='2020-08-23 09:06:33';
        this.pool1Data[3].warnTime='2020-08-23 05:23:13';
        this.pool1Data[4].warnTime='2020-08-22 12:48:54';
        // this.pool1Data = this.oldPool1Data.slice(0,5);
        this.pool1LastMeasureValue = data.data.data.redisSensorMeasureList[0].lastMeasureValue
        this.pool1 = true;

      })
    },
    //危废池2点击
    pool2Check() {
      this.allClose();
      this.poolAxios(49, 4, true).then(data => {
        this.pool2Data = data.data.data.warnRecordList;
        this.pool2Data[1].warnTime='2020-08-19 23:18:13';
        this.pool2Data[2].warnTime='2020-08-19 22:32:12';
        this.pool2Data[3].warnTime='2020-08-19 20:12:51';
        this.pool2Data[4].warnTime='2020-08-19 16:54:33';
        // this.oldPool2Data = data.data.data.warnRecordList;
        // this.pool1Data = this.oldPool2Data.slice(0,5);
        this.pool2LastMeasureValue = data.data.data.redisSensorMeasureList[0].lastMeasureValue
        this.pool2 = true;

      })
    },
    //危废池3点击
    pool3Check() {
      this.allClose();
      this.poolAxios(50, 5, true).then(data => {
        this.pool3Data = data.data.data.warnRecordList
        // this.pool3Data = data.data.data.warnRecordList
        // this.pool3Data = this.oldPool3Data.slice(0,5);
        this.pool3LastMeasureValue = data.data.data.redisSensorMeasureList[0].lastMeasureValue
        this.pool3 = true;

      })
    },
    //水箱点击
    waterCheck() {
      this.allClose();
      let formData = new FormData();
      formData.set('sensorId', '52')
      formData.set('needWarnRecord', 'false')
      this.$axios({
        url: this.$BaseUrl + '/bigData/getMapData',
        method: 'post',
        data: formData
      }).then(res => {
        if (res.data.success == false) {
          this.$message.error(res.data.msg);
        } else {
          this.waterPH = res.data.data.redisSensorMeasureList[0].lastMeasureValue;
          formData.set('sensorId', '53')
          this.$axios({
            url: this.$BaseUrl + '/bigData/getMapData',
            method: 'post',
            data: formData
          }).then(res => {
            if (res.data.success == false) {
              this.$message.error(res.data.msg);
            } else {
              this.waterConcentration = res.data.data.redisSensorMeasureList[0].lastMeasureValue;
              this.water = true;
            }
          })
        }
      })

    },
    //化学品架点击
    chemicalsCheck() {
      this.allClose();
      this.otherAxios(50).then(data => {
        this.chemicalsData = data.data.data;
        // this.oldChemicalsData = data.data.data;
        // this.chemicalsData = this.oldChemicalsData.slice(0,5);
        this.chemicals = true;
      })
    },
    //柴油储罐点击
    oilCheck() {
      this.allClose();
      this.otherAxios(49).then(data => {
        this.oilData = data.data.data;
        // this.oldOilData = data.data.data;
        // this.oilData = this.oldOilData.slice(0,5);
        this.oil = true;
      })
    },
    //有限空间点击
    spaceCheck() {
      this.allClose();
      this.otherAxios(56).then(data => {
        this.spaceData = data.data.data;
        this.spaceData[0].warnTime='2020-08-23 20:48:12';
        this.spaceData[1].warnTime='2020-08-23 18:35:25';
        this.spaceData[2].warnTime='2020-08-23 13:11:37';
        this.spaceData[3].warnTime='2020-08-23 06:21:28';
        this.spaceData[4].warnTime='2020-08-22 12:48:54';
        // this.oldSpaceData = data.data.data;
        // this.spaceData = this.oldSpaceData.slice(0,5);
        this.space = true;
      })
    },
    //屋顶边缘点击
    roofCheck() {
      this.allClose();
      this.otherAxios(48).then(data => {
        this.roofData = data.data.data;
        // this.oldRoofData = data.data.data;
        // this.roofData = this.oldRoofData.slice(0,5);
        this.roof = true;
      })
    },
    //雨水井点击
    rainwaterCheck() {
      this.allClose();
      this.otherAxios(52).then(data => {
        this.rainwaterData = data.data.data;
        this.rainwaterData[0].warnTime='2020-08-24 06:26:59';
        this.rainwaterData[1].warnTime='2020-08-24 02:15:28';
        this.rainwaterData[2].warnTime='2020-08-23 18:04:43';
        this.rainwaterData[3].warnTime='2020-08-23 14:03:23';
        // this.oldRainwaterData = data.data.data;
        // this.rainwaterData = this.oldRainwaterData.slice(0,5);
        this.rainwater = true;
      })
    },
    //通道点击
    aisleCheck() {
      this.allClose();
      this.otherAxios(51).then(data => {
        this.aisleData = data.data.data;
        // this.oldAisleData = data.data.data;
        // this.aisleData = this.oldAisleData.slice(0,5);
        this.aisle = true;
      })
    },
    //机器人区域点击
    robotCheck() {
      this.allClose();
      this.otherAxios(57).then(data => {
        this.robotData = data.data.data;
        this.robotData[0].warnTime='2020-08-24 07:18:28';
        this.robotData[1].warnTime='2020-08-24 06:48:36';
        this.robotData[2].warnTime='2020-08-24 01:23:15';
        // this.oldRobotData = data.data.data;
        // this.robotData = this.oldRobotData.slice(0,5);
        this.robot = true;
      })
    },
    //去看板
    goDataBord() {
      this.$router.push('/dataBoard/bigData')
    },
    //去控制台
    goControl() {
      this.$router.push("/system/userInfo")
    },
    //去网关
    goGateway() {
      this.$router.push("/equipmentManagement/gatewayManagement")
    },
    //获取区域报警监测数据
    getPointData() {
      this.$axios({
        url: this.$BaseUrl + '/bigData/getAllSwitchSensorList',
        method: 'post',
      }).then(res => {
        if (res.data.success == false) {
          this.$message.error(res.data.msg);
        } else {
          let oldData = res.data.data;
          let data = [
            '危废池1', '危废池2', '危废池3', '雨水井', '化学品架', '柴油储罐', '有限空间', '屋顶边缘', '屋面通道', '机器人区域',
          ]
          for (let i in data) {
            for (let j in oldData) {
              if (data[i] == oldData[j].gatewayName) {
                this.areaData.push(oldData[j])
              }
            }
          }
        }
      })
    },
    pool1Change(val){
      this.pool1Data=this.oldPool1Data.slice((val-1)*5,val*5)
    },
    pool2Change(val){
      this.pool2Data=this.oldPool2Data.slice((val-1)*5,val*5)
    },
    pool3Change(val){
      this.pool3Data=this.oldPool3Data.slice((val-1)*5,val*5)
    },
    chemicalsChange(val){
      this.chemicalsData=this.oldChemicalsData.slice((val-1)*5,val*5)
    },
    oilChange(val){
      this.oilData=this.oldOilData.slice((val-1)*5,val*5)
    },
    spaceChange(val){
      this.spaceData=this.oldSpaceData.slice((val-1)*5,val*5)
    },
    roofChange(val){
      this.roofData=this.oldRoofData.slice((val-1)*5,val*5)
    },
    rainwaterChange(val){
      this.rainwaterData=this.oldRainwaterData.slice((val-1)*5,val*5)
    },
    aisleChange(val){
      this.aisleData=this.oldAisleData.slice((val-1)*5,val*5)
    },
    robotChange(val){
      this.robotData=this.oldRobotData.slice((val-1)*5,val*5)
    },
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
  background: #8f8f8f;
  box-sizing: border-box;
}

/*最上方图片*/
.titleImg {
  position: absolute;
  top: 2%;
  height: 9%;
  width: 100%;
  background-image: url("../../assets/image/dataBoard/home/top.png");
  background-size: 100% 100%;
}

/*控制台*/
.control {
  color: white;
  position: absolute;
  width: 6.5vw;
  height: 2vw;
  font-weight: bold;
  padding: 0 0.3%;
  font-size: 0.8vw;
  top: 5.2%;
  right: 3%;
  cursor: pointer;
  z-index: 103;
  background: url("../../assets/image/dataBoard/home/control.png");
  background-size: 100% 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

/*导航*/
.nav {
  position: relative;
  width: 17%;
  height: 12%;
  top: 7%;
  color: white;
  font-weight: bold;
  font-size: 0.8vw;
  padding-left: 2%;
}

/*首页左侧*/
.nav_l {
  width: 40%;
  /*height: 100%;*/
  height: 1vw;
  background-image: url("../../assets/image/dataBoard/home/nav_l.png");
  background-size: 100% 100%;
  padding: 5% 15% 5% 5%;
  text-align: center;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

/*首页右侧*/
.nav_r {
  width: 40%;
  /*height: 100%;*/
  height: 1vw;
  background-image: url("../../assets/image/dataBoard/home/nav_r.png");
  background-size: 100% 100%;
  padding: 5% 5% 5% 15%;
  text-align: center;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

/*主题内容*/
.main {
  background-image: url("../../assets/image/dataBoard/home/home.png");
  background-size: 100% 100%;
  height: 85%;
  width: 90%;
  position: relative;
  top: 12%;
  left: 5%;
}

/*主题部分上部分*/
.main_top {
  width: 100%;
  height: 20%;
  padding: 3% 6% 0 6%;
  box-sizing: border-box;

}

.main_top_img {
  background-image: url("../../assets/image/dataBoard/home/circle.png");
  background-size: 100% 100%;
  width: 7vw;
  height: 7vw;
}

.main_top_img_content {
  flex-direction: column;
  color: #04F5FD;
  position: relative;
  top: 13%;
}
.main_top_img_en{
  font-size: 0.4vw;
  text-align: center;
  width: 100%;
}
.main_top_img_content > div:nth-child(1) {
  font-size: 1.6vw;
}

.main_top_img_content > div:nth-child(2) {
  font-size: 0.6vw;
}

#line {
  height: 100%;
  width: calc(100% - 120px  );
}

.lineBorder {
  width: 25vw;
  height: 100%;
  /*background-image: url("../../assets/image/dataBoard/home/numContent.png");*/
  /*background-size: 100% 100%;*/
  padding-left: 1.5%;
  box-sizing: border-box;
}

/*地图内部文字*/
.Line_l {
  position: relative;
  text-align: left;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  height: 3.9vw;
  width: 120px;
  white-space: nowrap;
}

.lineName {
  color: white;
  font-size: 0.7vw;
  font-family: arial, tahoma, 'Microsoft Yahei', '\5b8b\4f53', sans-serif;
}

.num {
  width: 40vw;
  height: 100%;
}

.numContent {
  background-image: url("../../assets/image/dataBoard/home/numContent.png");
  background-size: 100% 100%;
  width: 33%;
  height: 100%;
}

.numImg {
  width: 2.4vw;
  height: 2.4vw;
}

.numWord {
  font-size: 0.9vw;
  color: #04F5FD;
  padding-left: 3%;
  box-sizing: border-box;
}

.numContent_c {
  width: 70%;
  height: 85%;
  flex-direction: column;
  align-items: start;
}

/*数字大背景*/
.content_l_t_l_t_num {
  height: 50%;
  width: 100%;
}

/*数字背景*/
.content_l_t_l_t_contentImg {
  text-align: center;
  color: #05F5FE;
  background: url("../../assets/image/dataBoard/home/tab.png") no-repeat;
  background-size: 100% 100%;
  /*padding: 10%;*/
  width: 25%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/*地图部分*/
.map {
  background: url("../../assets/image/dataBoard/home/map.png") no-repeat;
  background-size: 100% 100%;
  position: relative;
  top: 5%;
  left: 16.5%;
  height: 70%;
  width: 67%;
  box-sizing: border-box;
}

/*地图内部点*/
.pool3 {
  position: absolute;
  width: 3.2vw;
  height: 6.5vh;
  top: 39.5%;
  left: 26.5%;
  background: url("../../assets/image/dataBoard/home/blue.png") no-repeat;
  background-size: 100% 100%;
  cursor: pointer;
}

.space {
  position: absolute;
  width: 3.2vw;
  height: 6.5vh;
  top: 48.5%;
  left: 39.5%;
  background: url("../../assets/image/dataBoard/home/blue.png") no-repeat;
  background-size: 100% 100%;
  cursor: pointer;
}

.rainwater {
  position: absolute;
  width: 3.2vw;
  height: 6.5vh;
  top: 71%;
  left: 39.5%;
  background: url("../../assets/image/dataBoard/home/blue.png") no-repeat;
  background-size: 100% 100%;
  cursor: pointer;
}

.chemicals {
  position: absolute;
  width: 3.2vw;
  height: 6.5vh;
  top: 42%;
  left: 38.5%;
  background: url("../../assets/image/dataBoard/home/blue.png") no-repeat;
  background-size: 100% 100%;
  cursor: pointer;
}

.pool1 {
  position: absolute;
  width: 3.2vw;
  height: 6.5vh;
  top: 35.5%;
  left: 64%;
  background: url("../../assets/image/dataBoard/home/blue.png") no-repeat;
  background-size: 100% 100%;
  cursor: pointer;
}

.robot {
  position: absolute;
  width: 3.2vw;
  height: 6.5vh;
  top: 58.9%;
  left: 29.9%;
  background: url("../../assets/image/dataBoard/home/blue.png") no-repeat;
  background-size: 100% 100%;
  z-index: 100;
  cursor: pointer;
}

.oil {
  position: absolute;
  width: 3.2vw;
  height: 6.5vh;
  top: 80.5%;
  left: 25%;
  background: url("../../assets/image/dataBoard/home/blue.png") no-repeat;
  background-size: 100% 100%;
  cursor: pointer;
  z-index: 102;
}

.pool2 {
  position: absolute;
  width: 3.2vw;
  height: 6.5vh;
  top: 54%;
  left: 24.9%;
  background: url("../../assets/image/dataBoard/home/blue.png") no-repeat;
  background-size: 100% 100%;
  cursor: pointer;
}

.water {
  position: absolute;
  width: 3.2vw;
  height: 6.5vh;
  top: 54%;
  left: 34%;
  background: url("../../assets/image/dataBoard/home/blue.png") no-repeat;
  background-size: 100% 100%;
  z-index: 102;
  cursor: pointer;
}

/*右侧固定报警信息*/
.map_right {
  background: url("../../assets/image/dataBoard/home/map_right.png") no-repeat;
  background-size: 100% 100%;
  height: 21vh;
  width: 22vw;
  position: absolute;
  top: 34%;
  right: 11.5%;
}

.map_right2 {
  background: url("../../assets/image/dataBoard/home/map_right.png") no-repeat;
  background-size: 100% 100%;
  height: 21vh;
  width: 22vw;
  position: absolute;
  top: 38%;
  left: 29%;
  z-index: 103;
}

.map_right3 {
  background: url("../../assets/image/dataBoard/home/map_right.png") no-repeat;
  background-size: 100% 100%;
  height: 21vh;
  width: 22vw;
  position: absolute;
  top: 52.2%;
  left: 27.4%;
  z-index: 103;
}

.map_right4 {
  background: url("../../assets/image/dataBoard/home/map_right.png") no-repeat;
  background-size: 100% 100%;
  height: 21vh;
  width: 22vw;
  position: absolute;
  top: 38%;
  left: 41%;
  z-index: 103;
}

.map_right5 {
  background: url("../../assets/image/dataBoard/home/map_right.png") no-repeat;
  background-size: 100% 100%;
  height: 21vh;
  width: 22vw;
  position: absolute;
  top: 78%;
  left: 27.5%;
  z-index: 103;
}

.map_right6 {
  background: url("../../assets/image/dataBoard/home/map_right.png") no-repeat;
  background-size: 100% 100%;
  height: 21vh;
  width: 22vw;
  position: absolute;
  top: 46.5%;
  left: 42%;
  z-index: 103;
}

.map_right7 {
  background: url("../../assets/image/dataBoard/home/map_right.png") no-repeat;
  background-size: 100% 100%;
  height: 21vh;
  width: 22vw;
  position: absolute;
  top: 64.5%;
  left: 17%;
  z-index: 103;
}

.map_right8 {
  background: url("../../assets/image/dataBoard/home/map_right.png") no-repeat;
  background-size: 100% 100%;
  height: 21vh;
  width: 22vw;
  position: absolute;
  top: 68.8%;
  left: 41.6%;
  z-index: 103;
}

.map_right9 {
  background: url("../../assets/image/dataBoard/home/map_right.png") no-repeat;
  background-size: 100% 100%;
  height: 21vh;
  width: 22vw;
  position: absolute;
  top: 65.3%;
  left: 15.1%;
  z-index: 103;
}

.map_right10 {
  background: url("../../assets/image/dataBoard/home/map_right.png") no-repeat;
  background-size: 100% 100%;
  height: 21vh;
  width: 22vw;
  position: absolute;
  top: 57.1%;
  left: 31.8%;
  z-index: 103;
}

.map_info {
  background: url("../../assets/image/dataBoard/home/1.png") no-repeat;
  background-size: 100% 100%;
  height: 12vh;
  width: 12vw;
  position: absolute;
  top: 38%;
  left: 15.1%;
}

.map_info2 {
  background: url("../../assets/image/dataBoard/home/1.png") no-repeat;
  background-size: 100% 100%;
  height: 12vh;
  width: 12vw;
  position: absolute;
  top: 52.1%;
  left: 13.5%;
}

.map_info3 {
  background: url("../../assets/image/dataBoard/home/1.png") no-repeat;
  background-size: 100% 100%;
  height: 12vh;
  width: 12vw;
  position: absolute;
  top: 34.1%;
  left: 52.8%;
  z-index: 101;
}

.map_info4 {
  background: url("../../assets/image/dataBoard/home/1.png") no-repeat;
  background-size: 100% 100%;
  height: 12vh;
  width: 12vw;
  position: absolute;
  top: 52.2%;
  left: 23.3%;
  z-index: 102;
}

/*点信息内容*/
.map_info_content {
  flex-direction: column;
  width: 100%;
  height: 100%;
  align-items: baseline;
  box-sizing: border-box;
  padding: 0 10%;
  color: #3F3B3A;
  font-size: 1vw;
}

.map_info_content_title {
  font-weight: bold;

}

/*每个格子title*/
.content_l_t_l_t-title {
  position: relative;
  color: #3F3B3A;
  font-size: 0.8vw;
  top: 1.5vh;
  left: 2vw;
  height: 1vh;
  width: 11vw;
}

/*左侧小地图*/
.map_left {
  position: absolute;
  top: 68%;
  left: 10%;
  width: 18vw;
  height: 20vh;
  z-index: 100;
  background: url("../../assets/image/dataBoard/home/map_left.png") no-repeat;
  background-size: 100% 100%;
}

/*左侧小地图点*/
.aisle {
  position: relative;
  left: 16%;
  bottom: 30%;
  height: 6vh;
  width: 3vw;
  background: url("../../assets/image/dataBoard/home/blue.png") no-repeat;
  background-size: 100% 100%;
  cursor: pointer;
}

.roof {
  position: relative;
  left: 28%;
  bottom: 5%;
  height: 6vh;
  width: 3vw;
  background: url("../../assets/image/dataBoard/home/blue.png") no-repeat;
  background-size: 100% 100%;
  cursor: pointer;
  z-index: 103;
}

/*根据条件变换图片*/
.errorImg {
  background: url("../../assets/image/dataBoard/home/red.png") no-repeat;
  background-size: 100% 100%;
}
.handing{
  background: url("../../assets/image/dataBoard/home/yellow.png") no-repeat;
  background-size: 100% 100%;
}
/*报警得内容*/
.mainContent-leftTwo-info {
  margin-top: 7%;
  height: 74%;
  width: 94%;
  overflow: hidden;
}

.mainContentLeftTwoLine {
  height: 11%;
  width: 100%;
  padding: 1.5% 10% 1.5% 4%;
  cursor: pointer;
}

.scrollInfo {
  height: 100%;
  width: 100%;
  font-size: 0.8vw;
  padding: 0 3% 1% 5%;
  box-sizing: border-box;
  color: #3E3A3A;
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
  width: 26%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
>>>.el-pagination{
  background-color: rgba(0,0,0,0) !important;
}
>>>.el-pagination .btn-prev{
  background-color: rgba(0,0,0,0) !important;
}
>>>.el-pagination button:disabled{
  background-color: rgba(0,0,0,0) !important;
}
>>>.el-pager li{
  background-color: rgba(0,0,0,0) !important;
}
>>>.el-pager li.active + li{
  background-color: rgba(0,0,0,0) !important;
}
>>>.el-pagination .btn-next{
  background-color: rgba(0,0,0,0) !important;
}
</style>
