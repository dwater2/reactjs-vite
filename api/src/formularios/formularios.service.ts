import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Formulario } from './entities/formulario.entity';
import { Pergunta } from './entities/pergunta.entity';
import { RespostaFormulario } from './entities/resposta-formulario.entity';
import { CreateFormularioDto } from './dto/create-formulario.dto';
import { CreateRespostaFormularioDto } from './dto/create-resposta.dto';

@Injectable()
export class FormulariosService {
  constructor(
    @InjectRepository(Formulario)
    private readonly formularioRepository: Repository<Formulario>,
    @InjectRepository(Pergunta)
    private readonly perguntaRepository: Repository<Pergunta>,
    @InjectRepository(RespostaFormulario)
    private readonly respostaRepository: Repository<RespostaFormulario>,
  ) {}

  async create(createFormularioDto: CreateFormularioDto): Promise<Formulario> {
    const formulario = this.formularioRepository.create(createFormularioDto);
    return this.formularioRepository.save(formulario);
  }

  async findAll(): Promise<Formulario[]> {
    return this.formularioRepository.find({
      relations: ['secoes', 'secoes.perguntas', 'secoes.perguntas.opcoesResposta'],
    });
  }

  async findOne(id: string): Promise<Formulario> {
    const formulario = await this.formularioRepository.findOne({
      where: { id },
      relations: ['secoes', 'secoes.perguntas', 'secoes.perguntas.opcoesResposta'],
    });

    if (!formulario) {
      throw new NotFoundException(`Formulário com ID ${id} não encontrado`);
    }

    return formulario;
  }

  async remove(id: string): Promise<void> {
    const result = await this.formularioRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Formulário com ID ${id} não encontrado`);
    }
  }

  async searchPerguntas(termo: string): Promise<Pergunta[]> {
    return this.perguntaRepository.find({
      where: [
        { titulo: Like(`%${termo}%`) },
        { descricao: Like(`%${termo}%`) },
      ],
      relations: ['opcoesResposta'],
    });
  }

  async createResposta(createRespostaDto: CreateRespostaFormularioDto): Promise<RespostaFormulario> {
    const formulario = await this.findOne(createRespostaDto.formularioId);
    const resposta = this.respostaRepository.create({
      ...createRespostaDto,
      formulario,
    });
    return this.respostaRepository.save(resposta);
  }

  async findRespostasByFormulario(formularioId: string): Promise<RespostaFormulario[]> {
    return this.respostaRepository.find({
      where: { formulario: { id: formularioId } },
      relations: [
        'respostaPerguntas',
        'respostaPerguntas.pergunta',
        'respostaPerguntas.respostaOpcoes',
        'respostaPerguntas.respostaOpcoes.opcaoResposta',
      ],
    });
  }
}