'use client';
import React, { useState, useEffect } from 'react';
import api from '../lib/axios'; // This path works if lib is in the frontend root

export default function LMSPage() {
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [courses, setCourses] = useState<any[]>([]);

  const fetchCourses = async () => {
    try {
      const res = await api.get('/courses');
      setCourses(res.data);
    } catch (err) {
      console.error("Make sure the backend is running on port 3333!", err);
    }
  };

  useEffect(() => { fetchCourses(); }, []);

  const addCourse = async () => {
    await api.post('/courses', { title: 'New Course', description: 'Beginner Level', progress: 0 });
    fetchCourses();
  };

  const deleteCourse = async (id: string) => {
    await api.delete(`/courses/${id}`);
    fetchCourses();
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* NAVBAR */}
      <nav className="bg-sky-100 p-4 flex justify-between items-center border-b border-sky-200">
        <h1 className="font-bold text-xl text-blue-800 tracking-tight">SkyLMS</h1>
        <div className="flex bg-white/50 p-1 rounded-lg border border-sky-200">
          <button 
            onClick={() => setRole('student')} 
            className={`px-4 py-1.5 rounded-md transition-all ${role === 'student' ? 'bg-blue-600 text-white shadow-md' : 'text-blue-600 hover:bg-sky-50'}`}
          >
            Student
          </button>
          <button 
            onClick={() => setRole('teacher')} 
            className={`px-4 py-1.5 rounded-md transition-all ${role === 'teacher' ? 'bg-blue-600 text-white shadow-md' : 'text-blue-600 hover:bg-sky-50'}`}
          >
            Teacher
          </button>
        </div>
      </nav>

      {/* CONTENT */}
      <main className="max-w-5xl mx-auto p-10">
        {role === 'student' ? (
          <div>
            <h2 className="text-2xl font-bold mb-6">My Enrolled Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {courses.map(c => (
                <div key={c._id} className="p-5 border border-sky-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-lg">{c.title}</h3>
                  <p className="text-gray-500 text-sm mb-4">{c.description}</p>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full transition-all" style={{width: '35%'}}></div>
                  </div>
                  <span className="text-xs text-gray-400 mt-2 block">35% Progress</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold">Teacher Control Panel</h2>
                <p className="text-gray-500">Manage your course catalog</p>
              </div>
              <button onClick={addCourse} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium shadow-lg shadow-blue-200 transition-all">
                + Create New Course
              </button>
            </div>
            <div className="overflow-hidden border border-sky-100 rounded-xl shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-sky-50 border-b border-sky-100">
                  <tr>
                    <th className="p-4 font-semibold text-blue-900">Course Title</th>
                    <th className="p-4 font-semibold text-blue-900 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sky-50">
                  {courses.map(c => (
                    <tr key={c._id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-medium">{c.title}</td>
                      <td className="p-4 text-right">
                        <button onClick={() => deleteCourse(c._id)} className="text-red-500 hover:text-red-700 font-medium px-3 py-1 rounded-md hover:bg-red-50">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}