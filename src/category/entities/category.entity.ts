import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Product } from 'src/product/entities/product.entity';
import { MAX_NAME } from '../../common/constants';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: MAX_NAME })
  name: string;

  @Column({ nullable: true })
  imageUrl: string | null;

  @Column({ default: false })
  published: boolean;

  @OneToMany(() => Product, (pr: Product) => pr.category, { cascade: true })
  products: Product[];
}
