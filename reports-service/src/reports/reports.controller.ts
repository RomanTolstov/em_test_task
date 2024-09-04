import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportInitDataRequest, ReportInitDataResponse, ReportStatusResponse } from './report_types';
import { Response } from 'express';

@Controller('reports')
export class ReportsController {
	constructor(
		private readonly service: ReportsService
	) { }

	@Post('init')
	async init_report(
		@Body() body: ReportInitDataRequest
	): Promise<ReportInitDataResponse> {
		return this.service.init_report(body);
	}

	@Get(':id')
	get_report_status(
		@Param() params: any
	): Promise<ReportStatusResponse> {
		return this.service.get_report_status(params.id);
	}

	@Get('download/:id')
	download_report(
		@Param() params: any,
		@Res() res: Response
	) {
		const file = this.service.get_report_file(params.id);
		if (file) {
			res.set({
				'Content-Type': 'application/json',
				'Content-Disposition': `attachment; filename="${params.id}.xlsx"`,
			});
			file.pipe(res);
		} else {
			res.status(404).send('Report not found');
		}
	}
}
