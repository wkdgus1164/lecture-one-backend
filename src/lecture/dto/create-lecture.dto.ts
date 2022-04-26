import { IsString } from 'class-validator'

export class CreateLectureDto {
	@IsString()
	thumbnail: string

	@IsString()
	title: string

	@IsString()
	caption: string
}
