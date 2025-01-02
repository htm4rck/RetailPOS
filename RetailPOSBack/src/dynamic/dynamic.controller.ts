
import { Controller, Param, Post, Get, HttpException, HttpStatus } from '@nestjs/common';
import { DynamicService } from './dynamic.service';

@Controller('dynamic')
export class DynamicController {
    constructor(private readonly dynamicService: DynamicService) {}

    @Post('initialize/:key')
    async initializeSchemas(@Param('key') key: string) {
        return this.dynamicService.initializeSchemas(key);
    }

    @Get('validate/:schema')
    async validateSchema(@Param('schema') schema: string) {
        const exists = await this.dynamicService.schemaExists(schema);
        if (!exists) {
            throw new HttpException(
                `Schema ${schema} does not exist`,
                HttpStatus.NOT_FOUND,
            );
        }
        return { message: `Schema ${schema} exists` };
    }
}
