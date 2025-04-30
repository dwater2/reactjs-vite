import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { RespostaPergunta } from './resposta-pergunta.entity';
import { OpcaoResposta } from './opcao-resposta.entity';

@Entity('respostas_opcao')
export class RespostaOpcao {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => RespostaPergunta, resposta => resposta.respostaOpcoes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'resposta_pergunta_id' })
  respostaPergunta: RespostaPergunta;

  @ManyToOne(() => OpcaoResposta, opcao => opcao.respostas)
  @JoinColumn({ name: 'opcao_resposta_id' })
  opcaoResposta: OpcaoResposta;
}