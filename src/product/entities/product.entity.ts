import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Category } from 'src/category/entities/category.entity';
import { MAX_NAME } from '../../common/constants';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: MAX_NAME })
  name: string;

  @Column()
  price: string;

  @Column()
  imageUrl: string;

  @Column({ default: false })
  published: boolean;

  @Column({ nullable: true })
  categoryId: number | null;

  @ManyToOne(() => Category, (c: Category) => c.products, {
    onDelete: 'SET NULL',
    onUpdate: 'SET NULL',
  })
  @JoinColumn({ name: 'categoryId' })
  category: Category | null;
}
