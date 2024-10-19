import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { MAX_NAME } from '../../common/constants';
import { ProfileRole } from '../common/profile-role.enum';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: MAX_NAME })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ type: 'enum', enum: ProfileRole, default: ProfileRole.USER })
  role: ProfileRole;

  @BeforeInsert()
  emailToLowerCase() {
    this.email = this.email.toLowerCase();
  }
}
