import { Controller, Post, Body } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

import { ContactFormInput } from './inputs/contact-form.input';
import { ContactFormService } from './contact-form.service';

@Controller('contact')
export class ContactFormController {
  constructor(private service: ContactFormService) {}

  @Throttle({ default: { limit: 5, ttl: 3_600_000 } })
  @Post()
  contactForm(@Body() input: ContactFormInput): Promise<boolean> {
    return this.service.createMessage(input);
  }
}
