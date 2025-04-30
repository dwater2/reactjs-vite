import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Formulario } from './formulario.entity';
import { Pergunta } from './pergunta.entity';

@Entity('secoes')
export class Secao {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  titulo: string;

  @Column({ type: 'text', nullable: true })
  descricao: string;

  @ManyToOne(() => Formulario, formulario => formulario.secoes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'formulario_id' })
  formulario: Formulario;

  @Column({ name: 'formulario_id' })
  formularioId: string;

  @OneToMany(() => Pergunta, pergunta => pergunta.secao, { cascade: true })
  perguntas: Pergunta[];
}