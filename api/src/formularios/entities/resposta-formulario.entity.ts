import { Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Formulario } from './formulario.entity';
import { RespostaPergunta } from './resposta-pergunta.entity';

@Entity('respostas_formulario')
export class RespostaFormulario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Formulario, formulario => formulario.respostas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'formulario_id' })
  formulario: Formulario;

  @CreateDateColumn()
  dataResposta: Date;

  @OneToMany(() => RespostaPergunta, resposta => resposta.respostaFormulario, { cascade: true })
  respostaPerguntas: RespostaPergunta[];
}