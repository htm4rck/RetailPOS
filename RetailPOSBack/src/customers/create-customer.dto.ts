import { IsString, IsNumber, IsIn } from 'class-validator';

export class CreateCustomerDto {
    @IsNumber()
    id: number;

    @IsString()
    name: string;

    @IsString()
    document: string;

    @IsIn(['frequent', 'new', 'VIP'])
    category: 'frequent' | 'new' | 'VIP';
}
