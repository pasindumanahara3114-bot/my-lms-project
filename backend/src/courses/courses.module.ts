import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { Course, CourseSchema } from './schemas/course.schema';

@Module({
  imports: [
    // This connects the blueprint to the actual database collection
    MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }])
  ],
  controllers: [CoursesController],
  providers: [CoursesService],
})
export class CoursesModule {}