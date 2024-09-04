import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Module({
	imports: [
		HttpModule
	],
  providers: [ReportsService],
})
export class ReportsModule {}
