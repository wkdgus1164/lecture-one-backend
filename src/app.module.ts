import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Connection } from 'typeorm'
import { LectureModule } from './lecture/lecture.module'
import { Lecture } from './lecture/entities/lecture.entity'

@Module({
	imports: [
		TypeOrmModule.forRoot({
			type: 'mysql',
			host: 'localhost',
			port: 3306,
			username: 'root',
			password: 'root',
			database: 'lectureone',
			entities: [Lecture],
			synchronize: true,
		}),
		TypeOrmModule.forFeature([Lecture]),
		LectureModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {
	constructor(private connection: Connection) {}
}
