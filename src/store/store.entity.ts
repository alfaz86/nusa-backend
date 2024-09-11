import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';
import { Product } from 'src/product/product.entity';

@Entity()
export class Store {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  contact: string;

  @Column({ nullable: true })
  logo: string;

  @Column({ type: 'timestamp', nullable: true })
  created_at: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  updated_at: Date | null;

  @OneToMany(() => User, user => user.store)
  users: User[];

  @OneToMany(() => Product, product => product.store)
  products: Product[];
}
