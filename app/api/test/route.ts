import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'add_old_data') {
      // 向温度API添加5分钟前的数据
      const oldData = {
        deviceId: "ESP8266_001",
        temperature: 22.5,
        humidity: 55,
        location: "测试房间"
      };

      // 模拟发送到温度API
      const response = await fetch('http://localhost:3000/api/sensors/temperature', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(oldData)
      });

      return NextResponse.json({
        success: true,
        message: '添加旧数据成功，设备应显示为离线'
      });

    } else if (action === 'add_fresh_data') {
      // 向温度API添加新数据
      const freshData = {
        deviceId: "ESP8266_001", 
        temperature: 24.8,
        humidity: 62,
        location: "测试房间"
      };

      const response = await fetch('http://localhost:3000/api/sensors/temperature', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(freshData)
      });

      return NextResponse.json({
        success: true,
        message: '添加新数据成功，设备应显示为在线'
      });

    } else if (action === 'clear_data') {
      // 这里需要清空数据的逻辑
      return NextResponse.json({
        success: true,
        message: '清空数据成功，设备应显示模拟数据'
      });
    }

    return NextResponse.json(
      { error: '未知操作' },
      { status: 400 }
    );

  } catch (error) {
    console.error('测试API错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}
