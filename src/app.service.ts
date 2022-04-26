import { Injectable } from '@nestjs/common'
import puppeteer from 'puppeteer/lib/cjs/puppeteer/node-puppeteer-core'
import { InjectRepository } from '@nestjs/typeorm'
import { Lecture } from './lecture/entities/lecture.entity'
import { Repository } from 'typeorm'

export type LectureInformationModel = {
	title: string
	thumbnail: string
	caption: string
	tags: string
}

@Injectable()
export class AppService {
	constructor(
		@InjectRepository(Lecture)
		private lectureRepository: Repository<Lecture>,
	) {}

	async getHello() {
		const browser = await puppeteer.launch({ headless: true })
		const page = await browser.newPage()
		await page.goto('https://fastcampus.co.kr/category_online_programming')

		const searchData = await page.evaluate(() => {
			const contentsList = Array.from(document.querySelectorAll('.card__container'))
			const contentsObjList = []

			contentsList.forEach((item) => {
				if (item.className === 'card__container') {
					const title = item.querySelector('.card__title')
					const thumbnail = item.querySelector('.card__image-wrapper img')
					const caption = item.querySelector('.card__content')
					const tags = item.querySelector('.card__labels ')

					contentsObjList.push({
						title: title.textContent,
						thumbnail: thumbnail.getAttribute('src'),
						caption: caption.textContent,
						tags: tags.textContent,
					})
				}
			})

			return contentsObjList
		})
		await browser.close()

		searchData.forEach((data) => {
			const { title, thumbnail, caption } = data
			const result = this.lectureRepository.create({
				title,
				thumbnail,
				caption,
			})

			this.lectureRepository.save(result)
		})
	}
}
