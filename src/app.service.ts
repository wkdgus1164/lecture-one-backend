import { Injectable } from '@nestjs/common'
import puppeteer from 'puppeteer/lib/cjs/puppeteer/node-puppeteer-core'
import { InjectRepository } from '@nestjs/typeorm'
import { Lecture } from './lecture/entities/lecture.entity'
import { Repository } from 'typeorm'
import { LectureTags } from './lecture/constants/LectureTags'
import { lecturePages } from './LectureLinks'

export type LectureInformationModel = {
    title: string
    thumbnail: string
    caption: string
    tag: LectureTags
}

@Injectable()
export class AppService {
    constructor(
        @InjectRepository(Lecture)
        private lectureRepository: Repository<Lecture>,
    ) {}

    async getTargetData(page): Promise<LectureInformationModel[]> {
        return await page.evaluate(async () => {
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
                        caption: caption.textContent.substring(0, 50),
                        // tag: LectureTags.FASTCAMPUS,
                    })
                }
            })

            return targetElement
        })
    }

    async getTargetData1(page): Promise<LectureInformationModel[]> {
        return await page.evaluate(async () => {
            const targetContainer = Array.from(document.querySelectorAll('.class_card'))
            const targetElement = []

            targetContainer.forEach((item: HTMLElement) => {
                if (item.className === 'class_card') {
                    const title = item.querySelector('.class_title')
                    const thumbnail = item.querySelector('.thumb img')
                    const caption = item.querySelector('.class_tutor')

                    targetElement.push({
                        title: title.textContent,
                        thumbnail: thumbnail.getAttribute('src'),
                        caption: caption.textContent.substring(0, 50),
                        tag: 'taling',
                    })
                }
            })

            return targetElement
        })
    }

    async crawlingAndSave() {
        const browser = await puppeteer.launch({ headless: true })
        const page = await browser.newPage()
        let extractedData = []

        for (const target of lecturePages.fastcampus) {
            await page.goto(target)
            const output = await this.getTargetData(page)
            output.forEach((data) => extractedData.push(data))
        }

        for (const target of lecturePages.taling) {
            await page.goto(String(target))
            const output = await this.getTargetData1(page)
            output.forEach((data) => extractedData.push(data))
        }

        await browser.close()
        await this.saveDatabase(extractedData)
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
