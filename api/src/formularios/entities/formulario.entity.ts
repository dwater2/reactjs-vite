import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Secao } from './secao.entity';
import { RespostaFormulario } from './resposta-formulario.entity';

@Entity('formularios')
export class Formulario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  titulo: string;

  @Column({ type: 'text', nullable: true })
  descricao: string;

  @CreateDateColumn()
  dataCriacao: Date;

  @UpdateDateColumn()
  dataAtualizacao: Date;

  @OneToMany(() => Secao, secao => secao.formulario, { cascade: true })
  secoes: Secao[];

  @OneToMany(() => RespostaFormulario, resposta => resposta.formulario)
  respostas: RespostaFormulario[];
}