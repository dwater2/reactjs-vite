import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { RespostaFormulario } from './resposta-formulario.entity';
import { Pergunta } from './pergunta.entity';
import { RespostaOpcao } from './resposta-opcao.entity';

@Entity('respostas_pergunta')
export class RespostaPergunta {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => RespostaFormulario, resposta => resposta.respostaPerguntas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'resposta_formulario_id' })
  respostaFormulario: RespostaFormulario;

  @ManyToOne(() => Pergunta, pergunta => pergunta.respostas)
  @JoinColumn({ name: 'pergunta_id' })
  pergunta: Pergunta;

  @Column({ type: 'text', nullable: true })
  valorTexto: string;

  @Column({ type: 'float', nullable: true })
  valorNumero: number;

  @Column({ type: 'timestamp', nullable: true })
  valorData: Date;

  @OneToMany(() => RespostaOpcao, opcao => opcao.respostaPergunta, { cascade: true })
  respostaOpcoes: RespostaOpcao[];
}