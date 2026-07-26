import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateDroneDto {
  @ApiProperty({ example: 'Drone-01' })
  @IsOptional()
  @IsString()
  nome?: string;

  @ApiProperty({ example: 10, description: 'Capacidade máxima de carga (kg)' })
  @IsNumber()
  @Min(0.1)
  capacidadeKg: number;

  @ApiProperty({ example: 20, description: 'Autonomia máxima por carga (km)' })
  @IsNumber()
  @Min(0.1)
  autonomiaKm: number;
}
