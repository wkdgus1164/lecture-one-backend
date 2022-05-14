import { IsEnum, IsString } from 'class-validator'
import { LectureTags } from '../constants/LectureTags'

export class CreateLectureDto {
	@IsString()
	thumbnail: string

	@IsString()
	title: string

	@IsString()
	caption: string

	@IsEnum(LectureTags)
	tag: string
}
