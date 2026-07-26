import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, Min, ValidateNested } from 'class-validator';
import { CoordenadaDto } from '../../orders/dto/create-pedido.dto';

export class CreateObstaculoDto {
  @ApiProperty({ example: 'Zona do Aeroporto' })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({ type: CoordenadaDto })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CoordenadaDto)
  centro: CoordenadaDto;

  @ApiProperty({ example: 2, description: 'Raio da zona de exclusão em km' })
  @IsNumber()
  @Min(0.1)
  raioKm: number;
}
