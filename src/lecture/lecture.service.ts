import { Injectable } from '@nestjs/common'
import { CreateLectureDto } from './dto/create-lecture.dto'
import { UpdateLectureDto } from './dto/update-lecture.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Lecture } from './entities/lecture.entity'
import { Repository } from 'typeorm'

@Injectable()
export class LectureService {
	constructor(
		@InjectRepository(Lecture)
		private lectureRepository: Repository<Lecture>,
	) {}

	create(createLectureDto: CreateLectureDto) {
		return 'This action adds a new lecture'
	}

	findAll(): Promise<Lecture[]> {
		return this.lectureRepository.find()
	}

	findOne(id: number) {
		return this.lectureRepository.findOne(id)
	}

	update(id: number, updateLectureDto: UpdateLectureDto) {
		return `This action updates a #${id} lecture`
	}

	remove(id: number) {
		return `This action removes a #${id} lecture`
	}
}
