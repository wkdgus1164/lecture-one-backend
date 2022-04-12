import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Lecture {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	thumbnail: string

	@Column()
	title: string

	@Column()
	caption: string
}
