import { ToolPage } from '@/components/ToolPage';
import { TOOL_CONFIGS } from '@/lib/tools/config';

export default function Page() {
  const config = TOOL_CONFIGS['resume-checker'];
  return <ToolPage config={config} />;
}
