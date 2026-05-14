'use client';
import React, { useState, useEffect } from 'react';
import api from '../lib/axios';

const STUDENT_ID = 'student_123';

export default function LMSPage() {
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [courses, setCourses] = useState<any[]>([]);
  const [studentTab, setStudentTab] = useState<'catalog' | 'enrolled'>('catalog');
  
  // Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [newCourse, setNewCourse] = useState({ title: '', description: '', level: 'Beginner' });

  const openEditModal = (course: any) => {
    setEditingCourseId(course._id);
    setNewCourse({ title: course.title, description: course.description, level: course.level || 'Beginner' });
    setShowCreateModal(true);
  };

  const closeModal = () => {
    setShowCreateModal(false);
    setEditingCourseId(null);
    setNewCourse({ title: '', description: '', level: 'Beginner' });
  };

  const fetchCourses = async () => {
    try {
      const res = await api.get('/courses');
      setCourses(res.data);
    } catch (err) {
      console.error("Error fetching courses", err);
    }
  };

  useEffect(() => { fetchCourses(); }, []);

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourse.title.trim()) return;
    try {
      if (editingCourseId) {
        await api.patch(`/courses/${editingCourseId}`, newCourse);
      } else {
        await api.post('/courses', newCourse);
      }
      closeModal();
      fetchCourses();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteCourse = async (id: string) => {
    await api.delete(`/courses/${id}`);
    fetchCourses();
  };

  const enrollCourse = async (id: string) => {
    await api.post(`/courses/${id}/enroll`, { studentId: STUDENT_ID });
    fetchCourses();
  };

  const unenrollCourse = async (id: string) => {
    await api.post(`/courses/${id}/unenroll`, { studentId: STUDENT_ID });
    fetchCourses();
  };

  const enrolledCourses = courses.filter(c => c.enrolledStudents?.includes(STUDENT_ID));
  const availableCourses = courses.filter(c => !c.enrolledStudents?.includes(STUDENT_ID));

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 bg-white/70 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-200">
              <span className="text-white font-bold text-xl leading-none">S</span>
            </div>
            <h1 className="font-extrabold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-violet-700 tracking-tight">SkyLMS</h1>
          </div>
          
          <div className="flex bg-slate-100/80 p-1.5 rounded-xl border border-slate-200/50 backdrop-blur-sm shadow-inner">
            <button 
              onClick={() => { setRole('student'); setStudentTab('catalog'); }} 
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${role === 'student' ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-slate-900/5' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
            >
              Student Portal
            </button>
            <button 
              onClick={() => setRole('teacher')} 
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${role === 'teacher' ? 'bg-white text-violet-700 shadow-sm ring-1 ring-slate-900/5' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
            >
              Teacher Dashboard
            </button>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-6 py-12 relative">
        
        {/* Background decorative elements */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse pointer-events-none -z-10" style={{ animationDuration: '4s' }}></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-violet-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse pointer-events-none -z-10" style={{ animationDuration: '5s' }}></div>

        {role === 'student' ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
              <div>
                <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Welcome Back.</h2>
                <p className="text-slate-500 text-lg">Continue your learning journey today.</p>
              </div>
              
              <div className="flex p-1 bg-slate-100 rounded-lg shadow-inner">
                <button 
                  onClick={() => setStudentTab('catalog')}
                  className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${studentTab === 'catalog' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  Course Catalog
                </button>
                <button 
                  onClick={() => setStudentTab('enrolled')}
                  className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${studentTab === 'enrolled' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  My Learning
                </button>
              </div>
            </div>

            {studentTab === 'catalog' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {availableCourses.length === 0 ? (
                  <div className="col-span-full py-20 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-50 mb-4">
                      <span className="text-indigo-300 text-2xl">📚</span>
                    </div>
                    <h3 className="text-xl font-semibold text-slate-700 mb-1">No courses available</h3>
                    <p className="text-slate-500">Check back later or explore other categories.</p>
                  </div>
                ) : (
                  availableCourses.map(c => (
                    <div key={c._id} className="group flex flex-col bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-300 hover:-translate-y-1">
                      <div className="h-40 bg-gradient-to-br from-indigo-50 to-violet-100 relative p-6 flex items-end">
                        <span className="px-3 py-1 bg-white/80 backdrop-blur-sm text-indigo-700 text-xs font-bold rounded-full shadow-sm">
                          {c.level || 'All Levels'}
                        </span>
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        <h3 className="font-bold text-xl text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">{c.title}</h3>
                        <p className="text-slate-500 text-sm mb-6 flex-1 line-clamp-3 leading-relaxed">{c.description || 'No description available for this course.'}</p>
                        <button onClick={() => enrollCourse(c._id)} className="w-full py-3 bg-indigo-50 text-indigo-700 font-semibold rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm">
                          Enroll Now
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {studentTab === 'enrolled' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {enrolledCourses.length === 0 ? (
                  <div className="col-span-full py-20 text-center bg-white border border-dashed border-slate-300 rounded-3xl">
                    <h3 className="text-xl font-semibold text-slate-700 mb-2">Not enrolled yet</h3>
                    <p className="text-slate-500 mb-6">Start your learning journey by browsing our catalog.</p>
                    <button onClick={() => setStudentTab('catalog')} className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all">
                      Browse Catalog
                    </button>
                  </div>
                ) : (
                  enrolledCourses.map(c => (
                    <div key={c._id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col hover:shadow-md transition-all">
                      <div className="flex justify-between items-start mb-4">
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-md">
                          Enrolled
                        </span>
                        <button onClick={() => unenrollCourse(c._id)} className="text-slate-400 hover:text-red-500 text-sm font-medium transition-colors">
                          Drop
                        </button>
                      </div>
                      <h3 className="font-bold text-xl text-slate-800 mb-1">{c.title}</h3>
                      <p className="text-slate-500 text-sm mb-6 flex-1">{c.description}</p>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="font-medium text-slate-700">Course Progress</span>
                          <span className="font-bold text-indigo-600">{c.progress || 0}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                          <div className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full rounded-full transition-all duration-1000 ease-out" style={{width: `${c.progress || 0}%`}}></div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
              <div>
                <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Instructor Dashboard</h2>
                <p className="text-slate-500 text-lg">Manage your courses and students.</p>
              </div>
              <button 
                onClick={() => setShowCreateModal(true)} 
                className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-slate-900/20 transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
              >
                <span className="text-lg leading-none">+</span> Create New Course
              </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              {courses.length === 0 ? (
                <div className="py-20 text-center">
                  <p className="text-slate-500 text-lg">No courses created yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 text-sm uppercase tracking-wider">
                      <tr>
                        <th className="p-5 font-semibold">Course Details</th>
                        <th className="p-5 font-semibold">Level</th>
                        <th className="p-5 font-semibold">Students</th>
                        <th className="p-5 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {courses.map(c => (
                        <tr key={c._id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="p-5">
                            <p className="font-bold text-slate-800 text-base">{c.title}</p>
                            <p className="text-sm text-slate-500 truncate max-w-md">{c.description}</p>
                          </td>
                          <td className="p-5">
                            <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full">
                              {c.level || 'Beginner'}
                            </span>
                          </td>
                          <td className="p-5">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-bold">
                                {c.enrolledStudents?.length || 0}
                              </div>
                              <span className="text-sm text-slate-600">Enrolled</span>
                            </div>
                          </td>
                          <td className="p-5 text-right space-x-2">
                            <button 
                              onClick={() => openEditModal(c)} 
                              className="text-indigo-600 hover:text-white font-medium px-4 py-2 rounded-lg hover:bg-indigo-500 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 inline-block"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => deleteCourse(c._id)} 
                              className="text-red-500 hover:text-white font-medium px-4 py-2 rounded-lg hover:bg-red-500 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 inline-block"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* CREATE COURSE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xl font-bold text-slate-800">{editingCourseId ? 'Update Course' : 'Create New Course'}</h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition-colors">
                ✕
              </button>
            </div>
            
            <form onSubmit={handleCreateCourse} className="p-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Course Title</label>
                  <input 
                    type="text" 
                    required
                    value={newCourse.title}
                    onChange={e => setNewCourse({...newCourse, title: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-slate-900 bg-white placeholder:text-slate-400"
                    placeholder="e.g. Advanced Web Development"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                  <textarea 
                    rows={3}
                    value={newCourse.description}
                    onChange={e => setNewCourse({...newCourse, description: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all resize-none text-slate-900 bg-white placeholder:text-slate-400"
                    placeholder="Briefly describe what students will learn..."
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Difficulty Level</label>
                  <select 
                    value={newCourse.level}
                    onChange={e => setNewCourse({...newCourse, level: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all appearance-none text-slate-900 bg-white"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="All Levels">All Levels</option>
                  </select>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button 
                  type="button" 
                  onClick={closeModal}
                  className="flex-1 px-4 py-3 rounded-xl font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all"
                >
                  {editingCourseId ? 'Save Changes' : 'Publish Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}