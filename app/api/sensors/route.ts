import { NextRequest, NextResponse } from 'next/server';

// 模拟设备数据存储
let deviceData: Array<{
  id: string;
  deviceId: string;
  deviceType: string;
  data: any;
  timestamp: string;
  status: 'online' | 'offline';
  location?: string;
}> = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 验证必需的字段
    if (!body.deviceId || !body.deviceType || !body.data) {
      return NextResponse.json(
        { error: '缺少必需字段: deviceId, deviceType, data' },
        { status: 400 }
      );
    }

    // 创建新的设备记录
    const newRecord = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      deviceId: body.deviceId,
      deviceType: body.deviceType,
      data: body.data,
      timestamp: new Date().toISOString(),
      status: 'online' as const,
      location: body.location || '未知位置'
    };

    // 存储数据（保留最近200条记录）
    deviceData.push(newRecord);
    if (deviceData.length > 200) {
      deviceData = deviceData.slice(-200);
    }

    console.log(`收到设备数据: ${body.deviceType} - ${body.deviceId}`, body.data);

    return NextResponse.json({
      success: true,
      message: '设备数据接收成功',
      data: newRecord
    });

  } catch (error) {
    console.error('处理设备数据时出错:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const deviceId = searchParams.get('deviceId');
    const deviceType = searchParams.get('deviceType');
    const limit = parseInt(searchParams.get('limit') || '50');

    let filteredData = deviceData;

    // 根据设备ID过滤
    if (deviceId) {
      filteredData = filteredData.filter(record => record.deviceId === deviceId);
    }

    // 根据设备类型过滤
    if (deviceType) {
      filteredData = filteredData.filter(record => record.deviceType === deviceType);
    }

    // 限制返回数量，返回最新的记录
    const results = filteredData
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);

    return NextResponse.json({
      success: true,
      count: results.length,
      data: results
    });

  } catch (error) {
    console.error('获取设备数据时出错:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}
