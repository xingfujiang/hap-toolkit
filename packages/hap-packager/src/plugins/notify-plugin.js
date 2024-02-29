/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import http from 'http'
import fs from 'fs'
import cp from 'child_process'
import _ from 'lodash'
import {
  colorconsole,
  getDeviceInfo,
  globalConfig,
  getRecords,
  getProjectClients
} from '@hap-toolkit/shared-utils'

let clientExists = false
let isFirstUpdate = true

/**
 * 向手机设备发送更新rpk包请求
 * @param client {{ ip, port }}
 */
function sendUpdateReq(client) {
  const requrl = `http://${client.ip}:${client.port}/update`
  // 发送请求
  const options = {
    host: client.ip,
    port: client.port,
    path: '/update',
    timeout: 3000
  }
  const req = http
    .request(options, () => {
      colorconsole.log(`### App Server ### 通知手机更新rpk文件成功: ${requrl} `)
    })
    .on('error', (err) => {
      colorconsole.log(
        `### App Server ### 通知手机更新rpk文件失败(可忽略): ${requrl} 错误信息: ${err.message}`
      )
    })
    .on('timeout', function () {
      colorconsole.log(`### App Server ### 通知手机更新rpk文件超时(可忽略): ${requrl}`)
      req.abort()
    })
  req.end()
}

function notifyCloud() {
  try {
    console.log(`notifyCloud`)
    // res List of devices attached or
    // res List of devices attached
    // val-vclinner-rt-contest.vivo.com.cn:26013	device
    const resStr = cp.execSync(`adb devices`).toString().trim()
    console.log(`adb devices result\n`, resStr)
    const matchedOffline = resStr.match(/^(.+)?\boffline$/gm)
    if (matchedOffline) {
      const deviceId = matchedOffline[0].split('\t')[0]
      if (deviceId.match('vivo.com')) {
        cp.execSync(`adb connect ${deviceId}`)
      }
    }
    const matched = resStr.match(/^(.+)?\bdevice$/gm)
    // mm.match(/^(.+)?\bdevice$/)[0].split('\t')[0]
    console.log(`matched`, matched)
    if (matched) {
      cp.execSync(`adb shell locksettings set-disabled true`)
      cp.execSync(`adb shell settings put system screen_off_timeout 10*60*1000`)
      const { distName, distFile } = globalConfig
      // val-vclinner-rt-contest.vivo.com.cn:26013
      const deviceId = matched[0].split('\t')[0]
      // console.log(`deviceId`, deviceId)
      const pushCmd = `adb -s ${deviceId} push ${distFile}  /data/local/tmp/`
      const updateCmd = `adb shell am start -n com.vivo.hybrid.sdkdemo/org.hapjs.debugger.MainActivity --es rpk_address "/data/local/tmp/${distName}"`
      const updateCmdVivo = `adb shell am start -n org.hapjs.debugger/org.hapjs.debugger.HybridMainActivity --es rpk_address "/data/local/tmp/${distName}"`
      // console.log(`pushCmd`, pushCmd)
      // console.log(`updateCmd`, updateCmd)
      // console.log(`updateCmdVivo`, updateCmdVivo)
      cp.execSync(pushCmd)
      cp.execSync(updateCmd)
      cp.execSync(updateCmdVivo)
    }
  } catch (error) {
    console.log(error)
  }
}

function notify() {
  const clientRecordPath = globalConfig.clientRecordPath
  if (fs.existsSync(clientRecordPath)) {
    const recordData = getRecords(clientRecordPath)
    const clients = getProjectClients(recordData)
    if (clients.length > 0) {
      colorconsole.log('### App Loader ### 通知手机更新rpk文件')
      clients.forEach(function (client) {
        if (client.ip !== '127.0.0.1') {
          // 正常WIFI更新
          sendUpdateReq(client)
        } else {
          // ADB更新
          getDeviceInfo(client, (err) => {
            if (err) {
              // 1020以下的版本调试器无该接口，即：不支持ADB
              return
            }
            sendUpdateReq(client)
          })
        }
      })
      clientExists = true
    }
  }

  if (!clientExists) {
    colorconsole.log(`### App Server ### 没有记录手机地址，不会通知手机更新rpk文件`)
  }
  _.debounce(notifyCloud, 300)()
  // setTimeout(notifyCloud, 100);
}

function NotifyPlugin(options) {
  this.options = options
  if (options.doNotNotifyAtFirst) {
    isFirstUpdate = false
  }
}

NotifyPlugin.prototype.apply = function (compiler) {
  compiler.hooks.done.tapAsync('NotifyPlugin', function (stats, callback) {
    if (!stats.compilation.errors.length && isFirstUpdate) {
      // 发送通知
      notify()
    }
    isFirstUpdate = true
    callback()
  })
}

export { NotifyPlugin }
