import { Controller, Get, Logger, Query, UseGuards } from '@nestjs/common';
import { SearchService } from './search.service';
import { AppAccessGuard } from '../guards/app-access.guard';
import { AccessTokenGuard } from '../guards/accesstoken.guard';

@Controller('search')
@UseGuards(AppAccessGuard)
@UseGuards(AccessTokenGuard)
export class SearchController {

  private logger = new Logger(SearchController.name)

  constructor(private searchService: SearchService) { }

  @Get()
  search(@Query('query') query: string) {
    if (!query || query === "") return []
    this.logger.debug(`Search Query: ${query}`);
    return this.searchService.query(query);
  }
}
