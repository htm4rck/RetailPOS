import {IsNotEmpty, IsString, IsArray, ValidateNested, Matches, Length, IsIn} from 'class-validator';
import { Type } from 'class-transformer';
import { AddressDto } from './address.dto';

export class CustomerDto {
    @IsNotEmpty()
    @IsString()
    @Length(8, 11)
    document: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsString()
    commercialName?: string;

    @IsNotEmpty()
    @IsString()
    @IsIn(['DNI', 'RUC', 'OTROS' ], {
        message: "[Tipo de Documento](documentType) Valores validos: DNI, RUC, OTROS.",
    })
    documentType: string;

    @IsNotEmpty()
    @IsString()
    @IsIn(['SND', 'PJ', 'PN' ], {
        message: "[Tipo de Persona](personType) Valores validos: SND, PJ, PN.",
    })
    personType: string;

    @IsNotEmpty()
    @IsString()
    @IsIn(['NINGUNO', 'PERCEPTOR', 'RETENEDOR' ], {
        message: "[Tipo de Agente](agentType) Valores validos: 'NINGUNO', 'PERCEPTOR', 'RETENEDOR'.",
    })
    agentType?: string;

    @IsString()
    observation?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AddressDto)
    addresses: AddressDto[];

    @IsString()
    @Matches(/^U\d{8}$|^U\d{11}$/, { message: 'by must start with U, followed by numbers, and have a total length of 9 or 12 characters.' })
    by: string;
}
