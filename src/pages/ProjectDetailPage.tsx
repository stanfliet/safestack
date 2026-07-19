import { useParams } from 'react-router-dom';

export default function ProjectDetailPage() {
  const { id } = useParams();
  return (
    <div className="p-4">
      <div className="page-header">
        <div><h1 className="page-title">Project Details</h1><p className="text-surface-500 mt-1">Project ID: {id}</p></div>
      </div>
    </div>
  );
}
