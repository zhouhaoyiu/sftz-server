import { Controller, Get, Post, Body } from '@midwayjs/core';
import { resultType } from '../type';

@Controller('/')
export class HomeController {
  @Get('/')
  async home(): Promise<string> {
    return 'Hello Midwayjs!';
  }

  /* （5）推送示例：
{
  "deviceId": "861322058712345",
  "deviceCode": " DATA_NDWLUPHP_32",
  "time": "2022-03-31 13:01:13",
  "data": {
  "alarm": 0,
  "online": 1,
  "signal": 20
  }
  }*/
  @Post('/water_logging')
  async test(
    @Body('deviceId') deviceId: string,
    @Body('deviceCode') deviceCode: string,
    @Body('time') time: string,
    @Body('data') data: any
  ): Promise<resultType> {
    console.log('deviceId', deviceId);
    console.log('deviceCode', deviceCode);
    console.log('time', time);
    console.log('data', data);
    return { code: 200, message: 'success', data: 'OK' };
  }
}
