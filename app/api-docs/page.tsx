import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ApiDocs() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">IoT API 文档</h1>
          <p className="text-slate-600 mt-2">ESP8266 温度传感器和其他IoT设备的API接口文档</p>
        </div>

        <div className="space-y-6">
          {/* 温度传感器API */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge variant="default" className="bg-green-600">POST</Badge>
                温度传感器数据上传
              </CardTitle>
              <CardDescription>
                用于ESP8266温度传感器上传温度和湿度数据
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-slate-800 mb-2">端点</h4>
                <code className="bg-slate-100 px-3 py-1 rounded text-sm">
                  POST /api/sensors/temperature
                </code>
              </div>
              
              <div>
                <h4 className="font-semibold text-slate-800 mb-2">请求体 (JSON)</h4>
                <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
{`{
  "deviceId": "ESP8266_001",     // 必需: 设备唯一标识
  "temperature": 24.5,          // 必需: 温度值 (-50 到 100)
  "humidity": 62.3,             // 可选: 湿度值
  "location": "卧室"             // 可选: 设备位置
}`}
                </pre>
              </div>

              <div>
                <h4 className="font-semibold text-slate-800 mb-2">ESP8266 Arduino 示例代码</h4>
                <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
{`#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>

const char* ssid = "你的WiFi名称";
const char* password = "你的WiFi密码";
const char* serverURL = "http://your-server.com/api/sensors/temperature";

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("连接WiFi中...");
  }
  Serial.println("WiFi连接成功!");
}

void sendTemperatureData(float temp, float hum) {
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;
    HTTPClient http;
    
    http.begin(client, serverURL);
    http.addHeader("Content-Type", "application/json");
    
    // 创建JSON数据
    StaticJsonDocument<200> doc;
    doc["deviceId"] = "ESP8266_001";
    doc["temperature"] = temp;
    doc["humidity"] = hum;
    doc["location"] = "卧室";
    
    String jsonString;
    serializeJson(doc, jsonString);
    
    int httpResponseCode = http.POST(jsonString);
    
    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println("服务器响应: " + response);
    } else {
      Serial.println("发送失败: " + String(httpResponseCode));
    }
    
    http.end();
  }
}

void loop() {
  // 读取传感器数据 (这里使用模拟值)
  float temperature = 24.5; // 替换为实际传感器读数
  float humidity = 62.3;    // 替换为实际传感器读数
  
  sendTemperatureData(temperature, humidity);
  
  delay(30000); // 每30秒发送一次数据
}`}
                </pre>
              </div>

              <div>
                <h4 className="font-semibold text-slate-800 mb-2">响应示例</h4>
                <pre className="bg-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
{`{
  "success": true,
  "message": "温度数据接收成功",
  "data": {
    "id": "1703123456789abc",
    "deviceId": "ESP8266_001",
    "temperature": 24.5,
    "humidity": 62.3,
    "timestamp": "2024-12-21T10:30:45.123Z",
    "location": "卧室"
  }
}`}
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* 获取温度数据API */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-blue-600 text-white">GET</Badge>
                获取温度数据
              </CardTitle>
              <CardDescription>
                获取存储的温度传感器历史数据
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-slate-800 mb-2">端点</h4>
                <code className="bg-slate-100 px-3 py-1 rounded text-sm">
                  GET /api/sensors/temperature?deviceId=ESP8266_001&limit=20
                </code>
              </div>
              
              <div>
                <h4 className="font-semibold text-slate-800 mb-2">查询参数</h4>
                <ul className="space-y-2 text-sm">
                  <li><code className="bg-slate-100 px-2 py-1 rounded">deviceId</code> - 可选: 设备ID过滤</li>
                  <li><code className="bg-slate-100 px-2 py-1 rounded">limit</code> - 可选: 返回记录数量 (默认20)</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* 通用传感器API */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge variant="default" className="bg-purple-600">POST</Badge>
                通用传感器数据
              </CardTitle>
              <CardDescription>
                适用于各种类型的IoT设备数据上传
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-slate-800 mb-2">端点</h4>
                <code className="bg-slate-100 px-3 py-1 rounded text-sm">
                  POST /api/sensors
                </code>
              </div>
              
              <div>
                <h4 className="font-semibold text-slate-800 mb-2">请求体示例</h4>
                <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
{`{
  "deviceId": "ESP8266_001",
  "deviceType": "temperature_humidity_sensor",
  "location": "卧室",
  "data": {
    "temperature": 24.5,
    "humidity": 62.3,
    "battery": 85
  }
}`}
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* 设备状态API */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-blue-600 text-white">GET</Badge>
                设备状态查询
              </CardTitle>
              <CardDescription>
                获取所有设备的在线状态和基本信息
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-slate-800 mb-2">端点</h4>
                <code className="bg-slate-100 px-3 py-1 rounded text-sm">
                  GET /api/devices/status
                </code>
              </div>
            </CardContent>
          </Card>

          {/* 错误代码说明 */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>错误代码说明</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <code className="bg-red-100 text-red-800 px-2 py-1 rounded">400</code>
                  <span>请求参数错误或缺少必需字段</span>
                </div>
                <div className="flex justify-between">
                  <code className="bg-red-100 text-red-800 px-2 py-1 rounded">404</code>
                  <span>设备未找到</span>
                </div>
                <div className="flex justify-between">
                  <code className="bg-red-100 text-red-800 px-2 py-1 rounded">500</code>
                  <span>服务器内部错误</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
