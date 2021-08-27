import { Controller } from '@nestjs/common';
import { PlaygroundsService } from './playgrounds.service';

@Controller('api/playgrounds')
export class PlaygroundsController {
  constructor(private readonly playgroundsService: PlaygroundsService) {}
}
