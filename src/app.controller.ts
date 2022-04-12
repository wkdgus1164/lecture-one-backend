import { Controller, Get } from '@nestjs/common'
import { AppService, LectureInformationModel } from './app.service'

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	getHello(): Promise<LectureInformationModel> {
		return this.appService.getHello()
	}
}
