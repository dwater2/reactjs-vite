import { IsString, IsOptional, IsArray, ValidateNested, IsNumber, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRespostaOpcaoDto {
  @ApiProperty()
  @IsString()
  opcaoRespostaId: string;
}

export class CreateRespostaPerguntaDto {
  @ApiProperty()
  @IsString()
  perguntaId: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  valorTexto?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  valorNumero?: number;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  valorData?: string;

  @ApiProperty({ type: [CreateRespostaOpcaoDto], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRespostaOpcaoDto)
  @IsOptional()
  respostaOpcoes?: CreateRespostaOpcaoDto[];
}

export class CreateRespostaFormularioDto {
  @ApiProperty()
  @IsString()
  formularioId: string;

  @ApiProperty({ type: [CreateRespostaPerguntaDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRespostaPerguntaDto)
  respostaPerguntas: CreateRespostaPerguntaDto[];
}