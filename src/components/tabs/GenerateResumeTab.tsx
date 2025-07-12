import UploadAndGenerate from './UploadAndGenerate';
import GenerationHistory from './GenerationHistory';

export default function GenerateResumeTab() {
  return (
    <div className="space-y-8">
      <UploadAndGenerate showBuild={false} showJob={true} showActions={true} />
      <GenerationHistory />
    </div>
  );
} 