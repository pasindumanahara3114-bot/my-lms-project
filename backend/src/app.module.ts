import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'; // 1. Add this import
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoursesModule } from './courses/courses.module'; // 2. Add your courses module

@Module({
  imports: [
    // 3. Add the connection string here
    MongooseModule.forRoot('mongodb://localhost:27017/lms-db'),
    CoursesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}