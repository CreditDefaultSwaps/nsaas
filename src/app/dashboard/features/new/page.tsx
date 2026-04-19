'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import toast from 'react-hot-toast';
import { createFeature } from '@/lib/api';
import { fetchRepos } from '@/lib/api';
import { Button, Card, CardContent, Input, Textarea, Select, SelectItem, EmptyState, Skeleton } from '@/components/ui';
import { ChevronLeft, Github, AlertCircle, Moon, Stars, Sparkles } from '@/components/icons';
import Link from 'next/link';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { motion } from 'framer-motion';

interface FormErrors {
  repo_id?: string;
  title?: string;
  description?: string;
}

export default function NewRequestPage() {
  return (
    <ErrorBoundary>
      <NewRequestContent />
    </ErrorBoundary>
  );
}

function NewRequestContent() {
  const router = useRouter();
  const { data: repos, isLoading: reposLoading } = useSWR('repos', fetchRepos);
  
  const [formData, setFormData] = useState({
    repo_id: '',
    title: '',
    description: '',
    priority: 'medium' as const,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.repo_id) {
      newErrors.repo_id = 'Please select a repository';
    }
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      await createFeature(formData);
      toast.success('Request submitted! Your night shift is starting...');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Night interrupted. Please try again.');
      setIsSubmitting(false);
    }
  };

  // No repos state
  if (!reposLoading && (!repos || repos.length === 0)) {
    return (
      <div className="max-w-2xl mx-auto">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white mb-6 transition-colors">
          <ChevronLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
        
        <EmptyState
          icon={<Github className="h-8 w-8" />}
          title="No repositories connected"
          description="Connect a repository to start your first night shift."
          action={{
            label: 'Connect Repository',
            onClick: () => router.push('/dashboard/repos'),
          }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white mb-6 transition-colors">
        <ChevronLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="glass neon-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center">
                <Moon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">New Request</h1>
                <p className="text-sm text-zinc-400">Describe what you want. We'll ship it overnight.</p>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Repository Select */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Repository <span className="text-rose-400">*</span>
                </label>
                {reposLoading ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <Select
                    value={formData.repo_id}
                    onChange={(e) => setFormData({ ...formData, repo_id: e.target.value })}
                    error={errors.repo_id}
                  >
                    <SelectItem value="">Select a repository...</SelectItem>
                    {repos?.map((repo: any) => (
                      <SelectItem key={repo.id} value={repo.id}>
                        {repo.full_name}
                      </SelectItem>
                    ))}
                  </Select>
                )}
              </div>

              {/* Title Input */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Title <span className="text-rose-400">*</span>
                </label>
                <Input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Add user authentication with OAuth"
                  error={errors.title}
                />
              </div>

              {/* Priority Select */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Priority
                </label>
                <Select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                >
                  <SelectItem value="low">Low - Ship when convenient</SelectItem>
                  <SelectItem value="medium">Medium - Standard priority</SelectItem>
                  <SelectItem value="high">High - Ship tonight</SelectItem>
                  <SelectItem value="urgent">Urgent - Start immediately</SelectItem>
                </Select>
              </div>

              {/* Description Textarea */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Description <span className="text-rose-400">*</span>
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe what you want in detail. The more specific, the better the result."
                  rows={6}
                  error={errors.description}
                />
                <div className="mt-2 flex items-start gap-2 text-sm text-zinc-500">
                  <Sparkles className="h-4 w-4 mt-0.5 flex-shrink-0 text-neon-cyan" />
                  <p>
                    Pro tip: Be specific! Instead of "fix the bug", try "fix the login error when users enter special characters in passwords".
                  </p>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-4 pt-4 border-t border-white/10">
                <Link href="/dashboard">
                  <Button type="button" variant="ghost">
                    Cancel
                  </Button>
                </Link>
                <Button 
                  type="submit" 
                  isLoading={isSubmitting}
                  disabled={reposLoading}
                  className="gap-2"
                >
                  <Stars className="h-4 w-4" />
                  Start Night Shift
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
