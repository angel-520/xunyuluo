'use client';

import React from 'react';
import useSWR from 'swr';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Thermometer, 
  Droplets,
  Activity,
  Settings,
  Plus,
  RefreshCw
} from 'lucide-react';

// 数据获取函数
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  // 获取所有设备的最新温度数据
  const { data: allDevicesData, error: allDevicesError, mutate: refreshData } = useSWR(
    '/api/sensors/temperature?groupByDevice=true',
    fetcher,
    {
      refreshInterval: 10000, // 每10秒自动刷新
    }
  );

  // 处理加载状态
  const isLoading = !allDevicesData && !allDevicesError;
  const devices = allDevicesData?.data || [];
  
  // 计算设备统计
  const totalDevices = devices.length;
  const onlineDevices = devices.filter((device: any) => {
    return device && (Date.now() - new Date(device.timestamp).getTime()) < 1 * 60 * 1000;
  }).length;
  
  // 判断设备是否在线的辅助函数
  const isDeviceOnline = (device: any) => {
    if (!device) return false;
    return (Date.now() - new Date(device.timestamp).getTime()) < 1 * 60 * 1000;
  };
  
  // 计算离线时长的辅助函数
  const getOfflineDuration = (device: any) => {
    if (!device) return '无数据';
    const diffMs = Date.now() - new Date(device.timestamp).getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) return `${diffDays}天前`;
    if (diffHours > 0) return `${diffHours}小时前`;
    if (diffMinutes > 0) return `${diffMinutes}分钟前`;
    return '刚刚';
  };

  const handleRefresh = () => {
    refreshData();
  };

  // 设备卡片组件
  const DeviceCard = ({ device }: { device: any }) => {
    const online = isDeviceOnline(device);
    const currentTemp = device?.temperature;
    const currentHumidity = device?.humidity;

    return (
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Thermometer className="w-5 h-5 text-red-500" />
            {device.deviceId}
            {online ? (
              <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                在线
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-red-100 text-red-800 text-xs">
                离线
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            {device.location || '未设置位置'}
            <span className="ml-2 text-xs text-slate-500">
              最后更新: {new Date(device.timestamp).toLocaleString()}
              {!online && (
                <span className="ml-1 text-red-500">
                  (设备离线 - {getOfflineDuration(device)})
                </span>
              )}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">传感器状态</span>
            {online ? (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                在线
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-red-100 text-red-800">
                离线 - {getOfflineDuration(device)}
              </Badge>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className={`text-center p-4 rounded-lg border ${
              online ? 'bg-orange-50' : 'bg-gray-50'
            }`}>
              <Thermometer className={`w-8 h-8 mx-auto mb-2 ${
                online ? 'text-orange-500' : 'text-gray-400'
              }`} />
              <div className="text-sm text-slate-600 mb-1">温度</div>
              <div className="text-3xl font-bold text-slate-800">
                {currentTemp ? `${currentTemp.toFixed(1)}°C` : '--'}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {online ? '实时读数' : '离线数据'}
              </div>
            </div>
            
            <div className={`text-center p-4 rounded-lg border ${
              online ? 'bg-cyan-50' : 'bg-gray-50'
            }`}>
              <Droplets className={`w-8 h-8 mx-auto mb-2 ${
                online ? 'text-cyan-500' : 'text-gray-400'
              }`} />
              <div className="text-sm text-slate-600 mb-1">湿度</div>
              <div className="text-3xl font-bold text-slate-800">
                {currentHumidity ? `${currentHumidity.toFixed(0)}%` : '--'}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {online ? '实时读数' : '离线数据'}
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-lg ${
            online ? 'bg-green-50' : 'bg-red-50'
          }`}>
            <div className="text-sm font-medium text-slate-700 mb-2">
              传感器信息 
              {online ? (
                <span className="text-green-600 ml-2">● 在线</span>
              ) : (
                <span className="text-red-600 ml-2">● 离线</span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-600">位置:</span>
                <span className="ml-2 font-medium">{device.location || '未设置'}</span>
              </div>
              <div>
                <span className="text-slate-600">数据时间:</span>
                <span className="ml-2 font-medium">
                  {new Date(device.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div>
                <span className="text-slate-600">连接状态:</span>
                <span className={`ml-2 font-medium ${
                  online ? 'text-green-600' : 'text-red-600'
                }`}>
                  {online ? '正常连接' : `离线 ${getOfflineDuration(device)}`}
                </span>
              </div>
              <div>
                <span className="text-slate-600">设备类型:</span>
                <span className="ml-2 font-medium">DHT22传感器</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1"
              onClick={() => window.open(`/temperature?deviceId=${device.deviceId}`, '_blank')}
            >
              <Activity className="w-4 h-4 mr-2" />
              查看历史数据
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1"
              onClick={() => window.open('/api-docs', '_blank')}
            >
              <Settings className="w-4 h-4 mr-2" />
              API 文档
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">ESP8266 温湿度监控系统</h1>
            <p className="text-slate-600 mt-2">实时监控温湿度传感器数据</p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh} 
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              刷新数据
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open('/api-docs', '_blank')}
            >
              <Activity className="w-4 h-4 mr-2" />
              API文档
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => alert('设置功能开发中...')}
            >
              <Settings className="w-4 h-4 mr-2" />
              设置
            </Button>
            <Button 
              size="sm"
              onClick={() => alert('添加设备功能开发中...')}
            >
              <Plus className="w-4 h-4 mr-2" />
              添加设备
            </Button>
          </div>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">在线设备</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{onlineDevices}</div>
            <p className="text-xs text-slate-600">
              <span className="text-green-600">总计 {totalDevices} 台设备</span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">离线设备</CardTitle>
            <RefreshCw className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{totalDevices - onlineDevices}</div>
            <p className="text-xs text-slate-600">
              <span className="text-red-600">需要检查连接</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 设备列表 */}
      <div className="space-y-6">
        {devices.length > 0 ? (
          devices.map((device: any) => (
            <DeviceCard key={device.deviceId} device={device} />
          ))
        ) : (
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="text-center py-12">
              <Thermometer className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-800 mb-2">暂无设备连接</h3>
              <p className="text-slate-600 mb-4">
                请确保您的ESP8266设备已连接到网络并开始发送数据。
              </p>
              <Button 
                variant="outline"
                onClick={() => window.open('/api-docs', '_blank')}
              >
                查看API文档
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
