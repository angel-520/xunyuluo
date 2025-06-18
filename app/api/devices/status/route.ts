import { NextRequest, NextResponse } from 'next/server';

// 设备状态数据存储 - 基于真实设备上传的数据动态生成
let deviceStatus: Record<string, {
  deviceId: string;
  deviceType: string;
  status: 'online' | 'offline';
  lastSeen: string;
  location?: string;
  data?: any;
}> = {};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const deviceId = searchParams.get('deviceId');

    if (deviceId) {
      // 返回特定设备状态
      const device = deviceStatus[deviceId];
      if (!device) {
        return NextResponse.json(
          { error: '设备未找到' },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        data: device
      });
    }

    // 返回所有设备状态
    const devices = Object.values(deviceStatus);
    const onlineCount = devices.filter(d => d.status === 'online').length;
    
    return NextResponse.json({
      success: true,
      summary: {
        totalDevices: devices.length,
        onlineDevices: onlineCount,
        offlineDevices: devices.length - onlineCount
      },
      data: devices
    });

  } catch (error) {
    console.error('获取设备状态时出错:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { deviceId, status, data, location } = body;

    if (!deviceId) {
      return NextResponse.json(
        { error: '缺少设备ID' },
        { status: 400 }
      );
    }

    // 更新或创建设备状态
    if (!deviceStatus[deviceId]) {
      deviceStatus[deviceId] = {
        deviceId,
        deviceType: body.deviceType || 'unknown',
        status: status || 'online',
        lastSeen: new Date().toISOString(),
        location: location || '未知位置'
      };
    } else {
      deviceStatus[deviceId] = {
        ...deviceStatus[deviceId],
        status: status || deviceStatus[deviceId].status,
        lastSeen: new Date().toISOString(),
        location: location || deviceStatus[deviceId].location,
        data: data || deviceStatus[deviceId].data
      };
    }

    return NextResponse.json({
      success: true,
      message: '设备状态更新成功',
      data: deviceStatus[deviceId]
    });

  } catch (error) {
    console.error('更新设备状态时出错:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}
