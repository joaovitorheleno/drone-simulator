import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  Min,
  ValidateNested,
} from 'class-validator';
import { Prioridade } from '../../common/enums/prioridade.enum';

export class CoordenadaDto {
  @ApiProperty({ example: 12 })
  @IsNumber()
  x: number;

  @ApiProperty({ example: 7 })
  @IsNumber()
  y: number;
}

export class CreatePedidoDto {
  @ApiProperty({ type: CoordenadaDto, description: 'Localização do cliente (X, Y)' })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CoordenadaDto)
  cliente: CoordenadaDto;

  @ApiProperty({ example: 2.5, description: 'Peso do pacote em kg' })
  @IsNumber()
  @Min(0.01, { message: 'O peso do pacote deve ser maior que zero' })
  pesoKg: number;

  @ApiProperty({ enum: Prioridade, example: Prioridade.MEDIA })
  @IsEnum(Prioridade, {
    message: 'prioridade deve ser: baixa, media ou alta',
  })
  prioridade: Prioridade;
}
