import { IsNotEmpty, IsString, IsOptional, IsIn } from 'class-validator';

export class AddressDto {
    @IsNotEmpty()
    @IsString()
    serialNumber: string;

    @IsNotEmpty()
    @IsString()
    address: string;

    @IsNotEmpty()
    @IsString()
    @IsIn(['DELIVERY', 'BILLING'], {
        message: "Valores validos: DELIVERY, BILLING.",
    })
    type: string;

    @IsNotEmpty()
    @IsString()
    country: string;

    @IsNotEmpty()
    @IsString()
    countryCode: string;

    @IsNotEmpty()
    @IsString()
    department: string;

    @IsNotEmpty()
    @IsString()
    province: string;

    @IsNotEmpty()
    @IsString()
    district: string;

    @IsOptional()
    @IsString()
    geoLocation?: string;

    @IsString()
    @IsNotEmpty()
    customerDocument: string;
}