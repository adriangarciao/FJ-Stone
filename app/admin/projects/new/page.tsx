import ProjectFormClient from '../ProjectFormClient';

export default function NewProjectPage() {
  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">New Project</h1>
      <p className="text-gray-600 mb-8">Create a new portfolio project.</p>

      <ProjectFormClient />
    </div>
  );
}
