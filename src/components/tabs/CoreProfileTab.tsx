import UploadAndGenerate from './UploadAndGenerate';
import ProfileAnalytics from './ProfileAnalytics';

export default function CoreProfileTab() {
  return (
    <div className="space-y-8">
      <UploadAndGenerate showBuild={true} showJob={false} showActions={false} />
      <ProfileAnalytics />
    </div>
  );
} 