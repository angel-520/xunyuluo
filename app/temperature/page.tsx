'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft,
  Thermometer, 
  Droplets,
  Calendar,
  Clock,
  Home
} from 'lucide-react';

// 数据获取函数
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function TemperatureHistory() {
  const [limit, setLimit] = useState(20);
  
  // 获取温度历史数据
  const { data, error, isLoading } = useSWR(
    `/api/sensors/temperature?limit=${limit}`,
    fetcher,
    {
      refreshInterval: 30000,
    }
  );

  const temperatureData = data?.data || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">          <div className="flex items-center gap-4 mb-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                // 使用 Next.js 的路由导航返回首页
                window.location.href = '/';
              }}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回首页
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                // 刷新当前页面数据
                window.location.reload();
              }}
            >
              <Home className="w-4 h-4 mr-2" />
              刷新数据
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">温度传感器历史数据</h1>
              <p className="text-slate-600 mt-2">查看ESP8266温度传感器的历史记录</p>
            </div>
          </div>
        </div>

        {/* 统计信息 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">数据条数</CardTitle>
              <Calendar className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">{temperatureData.length}</div>
              <p className="text-xs text-slate-600">
                显示最近 {limit} 条记录
              </p>
            </CardContent>
          </Card>

          {temperatureData.length > 0 && (
            <>
              <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">最新温度</CardTitle>
                  <Thermometer className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-800">
                    {temperatureData[0]?.temperature?.toFixed(1)}°C
                  </div>
                  <p className="text-xs text-slate-600">
                    {new Date(temperatureData[0]?.timestamp).toLocaleString()}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">最新湿度</CardTitle>
                  <Droplets className="h-4 w-4 text-cyan-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-800">
                    {temperatureData[0]?.humidity?.toFixed(0) || '--'}%
                  </div>
                  <p className="text-xs text-slate-600">
                    {new Date(temperatureData[0]?.timestamp).toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* 数据列表 */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>历史数据记录</span>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setLimit(10)}
                  className={limit === 10 ? 'bg-slate-100' : ''}
                >
                  10条
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setLimit(20)}
                  className={limit === 20 ? 'bg-slate-100' : ''}
                >
                  20条
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setLimit(50)}
                  className={limit === 50 ? 'bg-slate-100' : ''}
                >
                  50条
                </Button>
              </div>
            </CardTitle>
            <CardDescription>
              按时间倒序排列，最新数据在前
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="text-center py-8 text-slate-600">
                加载中...
              </div>
            )}
            
            {error && (
              <div className="text-center py-8 text-red-600">
                加载失败: {error.message}
              </div>
            )}
            
            {!isLoading && !error && temperatureData.length === 0 && (
              <div className="text-center py-8 text-slate-600">
                暂无数据记录
                <p className="text-sm mt-2">
                  请确保ESP8266已连接并发送数据到 /api/sensors/temperature
                </p>
              </div>
            )}
            
            {temperatureData.length > 0 && (
              <div className="space-y-3">
                {temperatureData.map((record: any, index: number) => (
                  <div 
                    key={record.id || index}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-slate-600">
                        #{index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-slate-800">
                          设备: {record.deviceId}
                        </div>
                        <div className="text-sm text-slate-600">
                          位置: {record.location || '未知'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-lg font-bold text-orange-600 flex items-center gap-1">
                          <Thermometer className="w-4 h-4" />
                          {record.temperature?.toFixed(1)}°C
                        </div>
                        <div className="text-xs text-slate-600">温度</div>
                      </div>
                      
                      {record.humidity !== undefined && (
                        <div className="text-center">
                          <div className="text-lg font-bold text-cyan-600 flex items-center gap-1">
                            <Droplets className="w-4 h-4" />
                            {record.humidity?.toFixed(0)}%
                          </div>
                          <div className="text-xs text-slate-600">湿度</div>
                        </div>
                      )}
                      
                      <div className="text-center">
                        <div className="text-sm font-medium text-slate-800 flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(record.timestamp).toLocaleTimeString()}
                        </div>
                        <div className="text-xs text-slate-600">
                          {new Date(record.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>        </Card>
      </div>
    </div>
  );
}
