import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Pergunta } from './pergunta.entity';
import { RespostaOpcao } from './resposta-opcao.entity';

@Entity('opcoes_resposta')
export class OpcaoResposta {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  texto: string;

  @ManyToOne(() => Pergunta, pergunta => pergunta.opcoesResposta, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'pergunta_id' })
  pergunta: Pergunta;

  @Column({ name: 'pergunta_id' })
  perguntaId: string;

  @OneToMany(() => RespostaOpcao, resposta => resposta.opcaoResposta)
  respostas: RespostaOpcao[];
}