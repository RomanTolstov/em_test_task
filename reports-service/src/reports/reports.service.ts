import { Injectable } from '@nestjs/common';
import { ReportInitDataRequest, ReportInitDataResponse, ReportStatus, ReportStatuses, ReportStatusResponse } from './report_types';
import { DataSource } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { ReportEntity } from '../entities/report.entity';
import { firstValueFrom } from 'rxjs';
import { Workbook } from 'exceljs';
import * as path from 'path';
import { ReadStream } from 'typeorm/platform/PlatformTools';
import * as fs from 'fs';

const REPORTS_SAVE_DIRECTORY_PATH = path.resolve(__dirname, '../../generated-reports');
const REPORTS_ITEMS_PER_PAGE = 10;

@Injectable()
export class ReportsService {

	private repo = this.data_source.getRepository(ReportEntity);

	private async create_report(
		params: ReportInitDataRequest
	): Promise<ReportEntity> {
		const report = new ReportEntity();
		report.customer_name = params.name;
		report.source_data_uri = params.source_data_uri;

		await this.repo.save(report);
		return report;
	}

	private async get_report_page_data(
		source_data_uri: string,
		count: number,
		offset: number
	): Promise<any[]> {
		return new Promise<any[]>((resolve, reject) => {
			firstValueFrom(
				this.http.get<any[]>(`${source_data_uri}?count=${count}&offset=${offset}`)
			).then(response => {
				resolve(response.data);
			}).catch((error) => {
				reject(error);
			})
		});
	}

	private async get_report_data(
		source_data_uri: string,
	): Promise<any[]> {
		let empty = false;
		let result: any[] = [];
		let current_offset = 0;
		while (!empty) {
			const page_data = await this.get_report_page_data(source_data_uri, REPORTS_ITEMS_PER_PAGE, current_offset);
			if (page_data && page_data.length > 0) {
				result = result.concat(page_data);
				current_offset += page_data.length;
			} else {
				empty = true;
			}
		}
		return result;
	}

	private async make_excel_file(
		id: string,
		data: any[],
		params: ReportInitDataRequest
	) {
		const workbook = new Workbook();
		const worksheet = workbook.addWorksheet(params.name);

		worksheet.columns = params.columns.map(column => {
			return {
				header: column,
				key: column
			};
		});

		data.forEach(item => {
			worksheet.addRow(item);
		});
		console.log(path.resolve(REPORTS_SAVE_DIRECTORY_PATH, id + '.xlsx'));
		workbook.xlsx.writeFile(path.resolve(REPORTS_SAVE_DIRECTORY_PATH, id + '.xlsx'));
	}

	private async generate_report(
		report: ReportEntity,
		params: ReportInitDataRequest
	) {
		let data: any[] = [];
		try {
			data = await this.get_report_data(params.source_data_uri);
		} catch(error) {
			report.status = ReportStatus.error_getting_data;
			this.repo.save(report);
			return;
		}

		try {
			this.make_excel_file(report.id, data, params);
		} catch(error) {
			report.status = ReportStatus.error_making_file;
			this.repo.save(report);
			return;
		}

		report.status = ReportStatus.success;
		this.repo.save(report);
	}

	constructor(
		private data_source: DataSource,
		private readonly http: HttpService
	) {}

	async init_report(
		params: ReportInitDataRequest
	): Promise<ReportInitDataResponse> {
		const report = await this.create_report(params);
		this.generate_report(report, params);
		return {
			id: report.id
		};
	}

	async get_report_status(
		id: string
	): Promise<ReportStatusResponse> {
		const result: ReportStatusResponse = {
			status: ReportStatuses[ReportStatus.not_found]
		}
		try {
			const report = await this.repo.findOne({
				where: { id }
			});
			if (report) {
				result.status = ReportStatuses[report.status];
				if (report.status === ReportStatus.success) {
					result.link = 'http://localhost:4000/reports/download/' + report.id;
				}
			}
		} catch (error) {
		}
		return result;
	}

	get_report_file(
		id: string
	): ReadStream|undefined {
		const file_path = path.resolve(REPORTS_SAVE_DIRECTORY_PATH, id + '.xlsx');
		if (fs.existsSync(file_path)) {
			return fs.createReadStream(file_path);
		}
	}
}
