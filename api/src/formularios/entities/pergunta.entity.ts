import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Secao } from './secao.entity';
import { OpcaoResposta } from './opcao-resposta.entity';
import { RespostaPergunta } from './resposta-pergunta.entity';

export type TipoPergunta = 'text' | 'textarea' | 'number' | 'select' | 'multipleChoice' | 'singleChoice' | 'date';

@Entity('perguntas')
export class Pergunta {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  titulo: string;

  @Column({ type: 'text', nullable: true })
  descricao: string;

  @Column({
    type: 'enum',
    enum: ['text', 'textarea', 'number', 'select', 'multipleChoice', 'singleChoice', 'date'],
  })
  tipo: TipoPergunta;

  @Column({ default: false })
  obrigatoria: boolean;

  @ManyToOne(() => Secao, secao => secao.perguntas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'secao_id' })
  secao: Secao;

  @Column({ name: 'secao_id' })
  secaoId: string;

  @OneToMany(() => OpcaoResposta, opcao => opcao.pergunta, { cascade: true })
  opcoesResposta: OpcaoResposta[];

  @OneToMany(() => RespostaPergunta, resposta => resposta.pergunta)
  respostas: RespostaPergunta[];
}