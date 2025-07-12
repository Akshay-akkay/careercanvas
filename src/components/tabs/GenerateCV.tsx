import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Hammer } from 'lucide-react';
import { motion } from 'framer-motion';

export default function GenerateCV() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="overflow-hidden border-none shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Hammer className="w-6 h-6" />
            Generate CV (Coming Soon!)
          </CardTitle>
          <CardDescription>
            We're working hard to bring a dedicated CV generator. Stay tuned!
          </CardDescription>
        </CardHeader>
        <CardContent className="py-10 text-center text-gray-600 dark:text-gray-400">
          🚧 Under construction
        </CardContent>
      </Card>
    </motion.div>
  );
} 