import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getStatus(): { status: string; name: string } {
    return {
      status: 'ok',
      name: 'HAN API',
    };
  }
}
