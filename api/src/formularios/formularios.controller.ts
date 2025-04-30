import { Controller, Get, Post, Body, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FormulariosService } from './formularios.service';
import { CreateFormularioDto } from './dto/create-formulario.dto';
import { CreateRespostaFormularioDto } from './dto/create-resposta.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('formularios')
@Controller('formularios')
export class FormulariosController {
  constructor(private readonly formulariosService: FormulariosService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  create(@Body() createFormularioDto: CreateFormularioDto) {
    return this.formulariosService.create(createFormularioDto);
  }

  @Get()
  findAll() {
    return this.formulariosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.formulariosService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.formulariosService.remove(id);
  }

  @Get('perguntas/busca')
  searchPerguntas(@Query('termo') termo: string) {
    return this.formulariosService.searchPerguntas(termo);
  }

  @Post('respostas')
  createResposta(@Body() createRespostaDto: CreateRespostaFormularioDto) {
    return this.formulariosService.createResposta(createRespostaDto);
  }

  @Get(':id/respostas')
  findRespostas(@Param('id') id: string) {
    return this.formulariosService.findRespostasByFormulario(id);
  }
}