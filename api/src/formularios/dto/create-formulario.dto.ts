import { IsString, IsOptional, IsArray, ValidateNested, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { TipoPergunta } from '../entities/pergunta.entity';

export class CreateOpcaoRespostaDto {
  @ApiProperty()
  @IsString()
  texto: string;
}

export class CreatePerguntaDto {
  @ApiProperty()
  @IsString()
  titulo: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  descricao?: string;

  @ApiProperty()
  @IsString()
  tipo: TipoPergunta;

  @ApiProperty()
  @IsBoolean()
  obrigatoria: boolean;

  @ApiProperty({ type: [CreateOpcaoRespostaDto], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOpcaoRespostaDto)
  @IsOptional()
  opcoesResposta?: CreateOpcaoRespostaDto[];
}

export class CreateSecaoDto {
  @ApiProperty()
  @IsString()
  titulo: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  descricao?: string;

  @ApiProperty({ type: [CreatePerguntaDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePerguntaDto)
  perguntas: CreatePerguntaDto[];
}

export class CreateFormularioDto {
  @ApiProperty()
  @IsString()
  titulo: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  descricao?: string;

  @ApiProperty({ type: [CreateSecaoDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSecaoDto)
  secoes: CreateSecaoDto[];
}