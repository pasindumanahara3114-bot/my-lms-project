import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CourseDocument = HydratedDocument<Course>;

@Schema()
export class Course {
  @Prop({ required: true })
  title!: string;

  @Prop()
  description!: string;

  @Prop({ default: 0 })
  progress!: number;
}

export const CourseSchema = SchemaFactory.createForClass(Course);