import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course, CourseDocument } from './schemas/course.schema';

@Injectable()
export class CoursesService {
  constructor(@InjectModel(Course.name) private courseModel: Model<CourseDocument>) {}

  async findAll(): Promise<Course[]> {
    return this.courseModel.find().exec();
  }

  async create(courseData: any): Promise<Course> {
    const createdCourse = new this.courseModel(courseData);
    return createdCourse.save();
  }

  async delete(id: string): Promise<any> {
    return this.courseModel.findByIdAndDelete(id).exec();
  }
}