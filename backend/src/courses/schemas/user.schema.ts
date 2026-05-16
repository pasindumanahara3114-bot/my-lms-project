import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CourseDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ unique: true })
  email!: string;

  @Prop()
  password!: string;

  @Prop({ default: 'user' })
  role!: string;

  @Prop({ default: false })
  isVerified!: boolean;
}