import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { ProfileModule } from 'src/profile/profile.module';

@Module({
  imports: [ProfileModule],
  controllers: [FilesController],
})
export class FilesModule {}
