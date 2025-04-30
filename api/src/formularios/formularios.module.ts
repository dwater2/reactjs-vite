import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormulariosService } from './formularios.service';
import { FormulariosController } from './formularios.controller';
import { Formulario } from './entities/formulario.entity';
import { Secao } from './entities/secao.entity';
import { Pergunta } from './entities/pergunta.entity';
import { OpcaoResposta } from './entities/opcao-resposta.entity';
import { RespostaFormulario } from './entities/resposta-formulario.entity';
import { RespostaPergunta } from './entities/resposta-pergunta.entity';
import { RespostaOpcao } from './entities/resposta-opcao.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Formulario,
      Secao,
      Pergunta,
      OpcaoResposta,
      RespostaFormulario,
      RespostaPergunta,
      RespostaOpcao,
    ]),
  ],
  controllers: [FormulariosController],
  providers: [FormulariosService],
})
export class FormulariosModule {}