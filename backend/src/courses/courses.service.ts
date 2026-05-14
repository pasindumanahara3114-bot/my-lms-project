import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course, CourseDocument } from './schemas/course.schema';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
  ) {}

  async findAll(): Promise<Course[]> {
    return this.courseModel.find().exec();
  }

  async create(courseData: any): Promise<Course> {
    const createdCourse = new this.courseModel(courseData);
    return createdCourse.save();
  }

  async update(id: string, courseData: any): Promise<Course | null> {
    return this.courseModel.findByIdAndUpdate(id, courseData, { new: true }).exec();
  }

  async delete(id: string): Promise<any> {
    return this.courseModel.findByIdAndDelete(id).exec();
  }

  async enroll(id: string, studentId: string): Promise<Course | null> {
    return this.courseModel.findByIdAndUpdate(
      id,
      { $addToSet: { enrolledStudents: studentId } },
      { new: true }
    ).exec();
  }

  async unenroll(id: string, studentId: string): Promise<Course | null> {
    return this.courseModel.findByIdAndUpdate(
      id,
      { $pull: { enrolledStudents: studentId } },
      { new: true }
    ).exec();
  }
}
