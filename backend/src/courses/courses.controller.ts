import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { CoursesService } from './courses.service';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}
  @Get() getAll() { return this.coursesService.findAll(); }
  @Post() create(@Body() data: any) { return this.coursesService.create(data); }
  @Delete(':id') remove(@Param('id') id: string) { return this.coursesService.delete(id); }
}