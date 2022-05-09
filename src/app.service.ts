import { Injectable } from '@nestjs/common'
import puppeteer from 'puppeteer/lib/cjs/puppeteer/node-puppeteer-core'
import { InjectRepository } from '@nestjs/typeorm'
import { Lecture } from './lecture/entities/lecture.entity'
import { Repository } from 'typeorm'

export type LectureInformationModel = {
	title: string
	thumbnail: string
	caption: string
}

const lectureSites = {
	fastcampus: 'https://fastcampus.co.kr/',
	inflean: 'https://www.inflearn.com/courses/it-programming/',
}

const lecturePages = {
	fastcampus: {
		categories: {
			programming: lectureSites.fastcampus + 'category_online_programming',
			dataScience: lectureSites.fastcampus + 'category_online_datascience',
			design: lectureSites.fastcampus + 'category_online_dgn',
			video: lectureSites.fastcampus + 'category_online_video',
			finance: lectureSites.fastcampus + 'category_online_finance',
		},
	},
	inflearn: {
		categories: {
			webDev: lectureSites.inflean + 'web-dev',
			frontend: lectureSites.inflean + 'front-end',
		},
	},
}

@Injectable()
export class AppService {
	constructor(
		@InjectRepository(Lecture)
		private lectureRepository: Repository<Lecture>,
	) {}

	async crawlingAndSave() {
		const browser = await puppeteer.launch({ headless: true })
		const page = await browser.newPage()

		await page.goto(lecturePages.fastcampus.categories.programming)

		const searchData = await page.evaluate(() => {
			const targetContainer = Array.from(document.querySelectorAll('.card__container'))
			const targetElement = []

			targetContainer.forEach((item: HTMLElement) => {
				if (item.className === 'card__container') {
					const title = item.querySelector('.card__title')
					const thumbnail = item.querySelector('.card__image-wrapper img')
					const caption = item.querySelector('.card__content')

					targetElement.push({
						title: title.textContent,
						thumbnail: thumbnail.getAttribute('src'),
						caption: caption.textContent,
					})
				}
			})

			return targetElement
		})

		await browser.close()
		this.saveDatabase(searchData)
	}

	async saveDatabase(data: LectureInformationModel[]) {
		for (const data1 of data) {
			const result = await this.lectureRepository.update(
				{
					title: data1.title,
				},
				data1,
			)

			if (result.affected === 0) {
				const result = this.lectureRepository.create(data1)
				await this.lectureRepository.save(result)
			}
		}
	}
}
