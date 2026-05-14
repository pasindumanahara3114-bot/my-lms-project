import { Controller, Get, Post, Delete, Patch, Body, Param } from '@nestjs/common';
import { CoursesService } from './courses.service';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}
  @Get() getAll() {
    return this.coursesService.findAll();
  }
  @Post() create(@Body() data: any) {
    return this.coursesService.create(data);
  }
  @Patch(':id') update(@Param('id') id: string, @Body() data: any) {
    return this.coursesService.update(id, data);
  }
  @Delete(':id') remove(@Param('id') id: string) {
    return this.coursesService.delete(id);
  }
  @Post(':id/enroll') enroll(@Param('id') id: string, @Body('studentId') studentId: string) {
    return this.coursesService.enroll(id, studentId);
  }
  @Post(':id/unenroll') unenroll(@Param('id') id: string, @Body('studentId') studentId: string) {
    return this.coursesService.unenroll(id, studentId);
  }
}
