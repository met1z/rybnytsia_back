import { Module } from '@nestjs/common';

import { ContactFormService } from './contact-form.service';
import { ContactFormController } from './contact-form.controller';

@Module({
  providers: [ContactFormService],
  controllers: [ContactFormController],
})
export class ContactFormModule {}
