
import { Module } from '@nestjs/common';
import { DynamicModule } from './dynamic/dynamic.module';
import { PublicModule } from './public/public.module';

@Module({
    imports: [DynamicModule, PublicModule],
})
export class AppModule {}
