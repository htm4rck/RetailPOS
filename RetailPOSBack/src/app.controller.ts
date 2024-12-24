import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
    @Get()
    getHello(): string {
        return 'POS Backend is running with NestJS!';
    }
}
