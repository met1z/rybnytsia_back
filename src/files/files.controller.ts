import * as fs from 'fs';
import {
  Controller,
  Post,
  Get,
  Param,
  UseInterceptors,
  UploadedFile,
  Res,
  Req,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path = require('path');
import { join } from 'path';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { HasRoles } from 'src/auth/decorators/has-roles.decorator';
import { ProfileRole } from 'src/profile/common/profile-role.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';

export const storage = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      const filename: string =
        path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
      const extension: string = path.parse(file.originalname).ext;

      cb(null, `${filename}${extension}`);
    },
  }),
};

@Controller('files')
export class FilesController {
  constructor() {}

  @Get(':imagename')
  findProfileImage(
    @Param('imagename') imagename,
    @Res() res,
  ): Promise<any> {
    return res.sendFile(join(process.cwd(), 'uploads/' + imagename));
  }

  @HasRoles(ProfileRole.ADMIN, ProfileRole.EDITOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', storage))
  uploadFile(@UploadedFile() file, @Req() req): String {
    const protocol = req.protocol;
    const host = req.get('host');
    const fullHost = `${protocol}://${host}/files/`;

    return (fullHost + file.filename) as string;
  }

  @HasRoles(ProfileRole.ADMIN, ProfileRole.EDITOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':imagename')
  deleteFile(
    @Param('imagename') imagename: string,
    @Res() res,
  ): Promise<any> {
    const filePath = join(process.cwd(), 'uploads/' + imagename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return res.json({ message: 'File deleted successfully.' });
    } else {
      return res.status(404).json({ message: 'File not found.' });
    }
  }
}
