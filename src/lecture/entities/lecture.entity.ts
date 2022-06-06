import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { LectureTags } from '../constants/LectureTags'

@Entity()
export class Lecture {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: 'enum',
        enum: LectureTags,
        default: LectureTags.FASTCAMPUS,
    })
    tag: string

    @Column()
    thumbnail: string

    @Column()
    title: string

    @Column()
    caption: string
}
