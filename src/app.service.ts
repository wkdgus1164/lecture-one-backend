import { Injectable } from '@nestjs/common'
import puppeteer from 'puppeteer/lib/cjs/puppeteer/node-puppeteer-core'

export type LectureInformationModel = {
	title: string
	thumbnail: string
	caption: string
	tags: string
}

@Injectable()
export class AppService {
	async getHello(): Promise<LectureInformationModel> {
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

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		return searchData
	}
}
