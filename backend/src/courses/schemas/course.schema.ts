import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CourseDocument = HydratedDocument<Course>;

@Schema()
export class Course {
  @Prop({ required: true })
  title!: string;

  @Prop()
  description!: string;

  @Prop()
  level!: string;

  @Prop({ default: 0 })
  progress!: number;

  @Prop({ type: [String], default: [] })
  enrolledStudents!: string[];
}

export const CourseSchema = SchemaFactory.createForClass(Course);
