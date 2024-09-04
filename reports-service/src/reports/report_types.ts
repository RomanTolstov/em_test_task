export enum ReportStatus {
	inited,
	error_getting_data,
	error_making_file,
	success,
	not_found,
}

export const ReportStatuses: Record<ReportStatus, string> = {
	[ReportStatus.inited]:							'Initialized',
	[ReportStatus.error_getting_data]:	'Error while get data',
	[ReportStatus.error_making_file]:		'Error while make file',
	[ReportStatus.success]:							'Success',
	[ReportStatus.not_found]:						'Report with given id not found',
}

export type ReportInitDataRequest = {
	name: string;
	source_data_uri: string;
	columns: string[];
}

export type ReportInitDataResponse = {
	id: string;
}

export type ReportStatusResponse = {
	status: string;
	link?: string;
}