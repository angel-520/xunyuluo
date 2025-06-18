import { NextRequest, NextResponse } from 'next/server';

// 模拟数据存储 - 在实际项目中您可能需要使用数据库
let temperatureData: Array<{
  id: string;
  deviceId: string;
  temperature: number;
  humidity?: number;
  timestamp: string;
  location?: string;
}> = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 验证必需的字段
    if (!body.deviceId || body.temperature === undefined) {
      return NextResponse.json(
        { error: '缺少必需字段: deviceId 和 temperature' },
        { status: 400 }
      );
    }

    // 验证温度值范围（合理性检查）
    if (body.temperature < -50 || body.temperature > 100) {
      return NextResponse.json(
        { error: '温度值超出合理范围(-50°C 到 100°C)' },
        { status: 400 }
      );
    }

    // 创建新的温度记录
    const newRecord = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      deviceId: body.deviceId,
      temperature: parseFloat(body.temperature),
      humidity: body.humidity ? parseFloat(body.humidity) : undefined,
      timestamp: new Date().toISOString(),
      location: body.location || '未知位置'
    };

    // 存储数据（保留最近100条记录）
    temperatureData.push(newRecord);
    if (temperatureData.length > 100) {
      temperatureData = temperatureData.slice(-100);
    }

    console.log(`收到温度数据: 设备${body.deviceId}, 温度${body.temperature}°C`);

    return NextResponse.json({
      success: true,
      message: '温度数据接收成功',
      data: newRecord
    });

  } catch (error) {
    console.error('处理温度数据时出错:', error);
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
    const limit = parseInt(searchParams.get('limit') || '20');
    const groupByDevice = searchParams.get('groupByDevice') === 'true';

    let filteredData = temperatureData;

    // 根据设备ID过滤
    if (deviceId) {
      filteredData = temperatureData.filter(record => record.deviceId === deviceId);
    }

    if (groupByDevice) {
      // 按设备ID分组，每个设备返回最新的数据
      const deviceGroups: Record<string, any> = {};
      
      temperatureData.forEach(record => {
        if (!deviceGroups[record.deviceId] || 
            new Date(record.timestamp).getTime() > new Date(deviceGroups[record.deviceId].timestamp).getTime()) {
          deviceGroups[record.deviceId] = record;
        }
      });

      const results = Object.values(deviceGroups)
        .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      return NextResponse.json({
        success: true,
        count: results.length,
        data: results
      });
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
    console.error('获取温度数据时出错:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}
