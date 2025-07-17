import { useResumeStore } from '../../store/resumeStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardBadge } from '../ui/Card';
import { Button } from '../ui/Button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell} from 'recharts';
import { 
  BrainCircuit, Briefcase, GraduationCap, AlertTriangle, User, FileText, Award, GitBranch,
  Linkedin, Github, Globe, Mail, Phone, TrendingUp, Calendar, Target, Zap, Star, Trophy, Code
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Link } from '../../types';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../ui/Accordion';
import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';

const LinkIcon = ({ type }: { type: Link['type'] }) => {
  switch (type) {
    case 'linkedin': return <Linkedin className="w-4 h-4" />;
    case 'github': return <Github className="w-4 h-4" />;
    case 'portfolio': return <Globe className="w-4 h-4" />;
    case 'email': return <Mail className="w-4 h-4" />;
    case 'phone': return <Phone className="w-4 h-4" />;
    default: return <Globe className="w-4 h-4" />;
  }
};

const StatCard = ({ icon: Icon, title, value, subtitle, color, trend }: {
  icon: any;
  title: string;
  value: string | number;
  subtitle?: string;
  color: string;
  trend?: { direction: 'up' | 'down' | 'neutral'; percentage?: number };
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Card variant="glass" className="hover:scale-[1.02] transition-all duration-300">
      <CardContent size="sm" className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} shadow-lg flex items-center justify-center`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
              <motion.p 
                className="text-2xl font-bold text-gray-900 dark:text-gray-100"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {value}
              </motion.p>
              {subtitle && (
                <p className="text-xs text-gray-500 dark:text-gray-500">{subtitle}</p>
              )}
            </div>
          </div>
          {trend && (
            <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
              trend.direction === 'up' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' :
              trend.direction === 'down' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
              'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
            }`}>
              <TrendingUp className={`w-3 h-3 ${trend.direction === 'down' ? 'rotate-180' : ''}`} />
              {trend.percentage && `${trend.percentage}%`}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const SkillProgressBar = ({ skill, value, maxValue, color }: {
  skill: string;
  value: number;
  maxValue: number;
  color: string;
}) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.3 }}
    className="group flex items-center gap-4 p-4 rounded-2xl bg-white/50 dark:bg-gray-800/30 hover:bg-white dark:hover:bg-gray-700/80 hover:shadow-lg dark:hover:shadow-gray-900/20 hover:scale-[1.02] transition-all duration-300 cursor-pointer border border-gray-200/50 dark:border-gray-700/50 hover:border-primary/30 dark:hover:border-primary/40"
  >
    <div className="min-w-0 flex-1">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate group-hover:text-primary dark:group-hover:text-primary transition-colors duration-300">{skill}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 group-hover:text-primary/80 dark:group-hover:text-primary/80 transition-colors duration-300">{value.toFixed(1)}y</span>
          <div className="w-2 h-2 rounded-full bg-primary/20 group-hover:bg-primary group-hover:scale-125 transition-all duration-300" />
        </div>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3 group-hover:bg-gray-300 dark:group-hover:bg-gray-500 transition-colors duration-300 overflow-hidden">
        <motion.div 
          className={`h-3 rounded-full bg-gradient-to-r ${color} group-hover:shadow-md transition-shadow duration-300 relative overflow-hidden`}
          initial={{ width: 0 }}
          animate={{ width: `${(value / maxValue) * 100}%` }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </motion.div>
      </div>
    </div>
  </motion.div>
);

export default function ProfileAnalytics() {
  const { coreProfile } = useResumeStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'experience'>('overview');

  const analytics = useMemo(() => {
    if (!coreProfile) return null;

    const { skills, experience, education, projects, certifications } = coreProfile;
    
    // Flatten skills regardless of structure
    const allSkills: string[] = skills && typeof skills === 'object' ? Object.values(skills).flat() : Array.isArray(skills) ? skills : [];

    // Helper to parse a duration string like "Aug 2020 - Present" → years (float)
    const parseYears = (duration: string): number => {
      if (!duration) return 0;
      const [startRaw, endRaw] = duration.split(/[-–]/).map(s => s.trim());
      const parseDate = (str: string): Date | null => {
        if (!str) return null;
        if (/present/i.test(str)) return new Date();
        const date = new Date(str);
        if (!isNaN(date.getTime())) return date;
        return null;
      };
      const start = parseDate(startRaw);
      const end = parseDate(endRaw);
      if (!start || !end) return 0;
      return (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365);
    };

    // Calculate total experience
    const totalExperience = experience.reduce((total, exp) => total + parseYears(exp.duration), 0);

    // Build skill experience mapping
    const skillYears: Record<string, number> = {};
    experience.forEach(exp => {
      const years = parseYears(exp.duration);
      if (years <= 0) return;
      const responsibilitiesText = (exp.responsibilities || []).map(r => 
        typeof r === 'string' ? r : 
        (r && typeof r === 'object' && (r as any).text) ? (r as any).text :
        (r && typeof r === 'object' && (r as any).description) ? (r as any).description :
        String(r)
      ).join(' ');
      const text = `${exp.title} ${exp.company} ${responsibilitiesText}`.toLowerCase();
      allSkills.forEach(skill => {
        if (text.includes(skill.toLowerCase())) {
          skillYears[skill] = (skillYears[skill] || 0) + years;
        }
      });
    });

    const skillChartData = allSkills.map(skill => ({
      name: skill,
      value: skillYears[skill] ? parseFloat(skillYears[skill].toFixed(1)) : 1,
    })).sort((a,b)=>b.value-a.value).slice(0,12);

    // Create experience timeline data
    const experienceData = experience.map((exp, index) => ({
      ...exp,
      years: parseYears(exp.duration),
      index: index + 1
    })).sort((a, b) => b.years - a.years);

    // Skill categories for pie chart
    const skillCategories = skills && typeof skills === 'object' ? 
      Object.entries(skills).map(([category, categorySkills]) => ({
        name: category,
        value: Array.isArray(categorySkills) ? categorySkills.length : 0,
      })) : [];

    return {
      totalSkills: allSkills.length,
      totalExperience: totalExperience.toFixed(1),
      totalProjects: projects.length,
      totalEducation: education.length,
      totalCertifications: certifications.length,
      skillChartData,
      experienceData,
      skillCategories,
      maxSkillYears: Object.values(skillYears).length > 0 ? Math.max(...Object.values(skillYears), 1) : 1
    };
  }, [coreProfile]);

  if (!coreProfile) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center text-center h-96"
      >
        <Card variant="outline" className="p-12 max-w-md">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-500 shadow-lg flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            <CardTitle size="lg" className="mb-2">No Profile Data</CardTitle>
            <CardDescription className="mb-4">
              Upload a resume to build your profile and see beautiful analytics here.
            </CardDescription>
            <Button variant="primary" size="sm">
              Get Started
            </Button>
          </div>
        </Card>
      </motion.div>
    );
  }

  const { personalDetails, summary, experience, education, projects, certifications } = coreProfile;

  const colors = [
    'from-blue-500 to-blue-600',
    'from-purple-500 to-purple-600', 
    'from-emerald-500 to-emerald-600',
    'from-purple-500 to-purple-600',
    'from-rose-500 to-rose-600',
    'from-cyan-500 to-cyan-600'
  ];

  const CHART_COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#8B5CF6', '#EF4444', '#06B6D4'];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card variant="glass" className="relative overflow-hidden border-primary/20 dark:border-primary/30">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5 dark:from-primary/20 dark:via-accent/10 dark:to-primary/10" />
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary" />
          <CardHeader className="relative p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <motion.div 
                  className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary via-accent to-primary shadow-xl flex items-center justify-center ring-4 ring-primary/20 dark:ring-primary/30"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <User className="w-10 h-10 text-white" />
                </motion.div>
                <div className="space-y-2">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <CardTitle size="xl" className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-bold text-3xl">
                      {personalDetails.name || 'Your Professional Profile'}
                    </CardTitle>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <CardDescription size="lg" className="text-gray-600 dark:text-gray-300 font-medium">
                      Comprehensive profile analytics and insights
                    </CardDescription>
                  </motion.div>
                  {personalDetails.email && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400"
                    >
                      <Mail className="w-4 h-4" />
                      {personalDetails.email}
                    </motion.div>
                  )}
                </div>
              </div>
              <motion.div 
                className="flex gap-3"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                {(personalDetails.links || []).slice(0, 3).filter(link => link && link.url).map((link, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      variant="glass" 
                      size="icon" 
                      asChild
                      className="bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 border-primary/20 hover:border-primary/40 shadow-lg"
                    >
                      <a href={link.url} target="_blank" rel="noopener noreferrer">
                        <LinkIcon type={link.type} />
                      </a>
                    </Button>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={BrainCircuit}
          title="Total Skills"
          value={analytics?.totalSkills || 0}
          subtitle="Unique technologies"
          color="from-blue-500 to-blue-600"
          trend={{ direction: 'up', percentage: 12 }}
        />
        <StatCard
          icon={Briefcase}
          title="Experience"
          value={`${analytics?.totalExperience || 0}y`}
          subtitle="Professional years"
          color="from-indigo-500 to-indigo-600"
          trend={{ direction: 'up', percentage: 8 }}
        />
        <StatCard
          icon={GitBranch}
          title="Projects"
          value={analytics?.totalProjects || 0}
          subtitle="Completed works"
          color="from-purple-500 to-purple-600"
          trend={{ direction: 'neutral' }}
        />
        <StatCard
          icon={Award}
          title="Certifications"
          value={analytics?.totalCertifications || 0}
          subtitle="Professional credentials"
          color="from-purple-500 to-purple-600"
          trend={{ direction: 'up', percentage: 25 }}
        />
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl">
        {[
          { id: 'overview', label: 'Overview', icon: Target },
          { id: 'skills', label: 'Skills Analysis', icon: BrainCircuit },
          { id: 'experience', label: 'Experience', icon: Briefcase },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-white dark:bg-gray-700 shadow-md text-primary scale-105'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'overview' && (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Professional Summary */}
            {summary && (
              <Card variant="glass" className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Professional Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-balance">
                    {summary}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Skill Categories Pie Chart */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5 text-primary" />
                  Skill Distribution
                </CardTitle>
                <CardDescription>Skills organized by category</CardDescription>
              </CardHeader>
              <CardContent>
                {analytics?.skillCategories && analytics.skillCategories.length > 0 ? (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={analytics?.skillCategories || []}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {(analytics?.skillCategories || []).map((_, index) => (
                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    No skill categories found
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Education & Certifications */}
            <Card variant="soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-primary" />
                  Education & Credentials
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Education */}
                <div>
                  <h4 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">Education</h4>
                  <div className="space-y-3">
                    {education.length > 0 ? education.map((edu, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="p-3 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50"
                      >
                        <p className="font-medium text-gray-900 dark:text-gray-100">{edu.degree}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{edu.university}</p>
                        <CardBadge variant="info" className="mt-2">{edu.year}</CardBadge>
                      </motion.div>
                    )) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400">No education data found.</p>
                    )}
                  </div>
                </div>

                {/* Certifications */}
                {certifications.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">Certifications</h4>
                    <div className="space-y-3">
                      {certifications.map((cert, index) => (
                        <motion.div 
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="p-3 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50"
                        >
                          <p className="font-medium text-gray-900 dark:text-gray-100">{cert.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{cert.authority}</p>
                          {cert.year && <CardBadge variant="success" className="mt-2">{cert.year}</CardBadge>}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Skills Chart */}
            <Card variant="glass" className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary" />
                  Top Skills by Experience
                </CardTitle>
                <CardDescription>Skills ranked by years of experience</CardDescription>
              </CardHeader>
              <CardContent>
                {analytics?.skillChartData && analytics.skillChartData.length > 0 ? (
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analytics?.skillChartData || []} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.1)" />
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} interval={0} />
                        <Tooltip 
                          cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                          contentStyle={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                            border: '1px solid rgba(59, 130, 246, 0.2)',
                            borderRadius: '12px',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Bar 
                          dataKey="value" 
                          fill="url(#skillGradient)"
                          name="Years" 
                          radius={[0, 4, 4, 0]}
                        />
                        <defs>
                          <linearGradient id="skillGradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#3B82F6" />
                            <stop offset="100%" stopColor="#8B5CF6" />
                          </linearGradient>
                        </defs>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-96 flex items-center justify-center text-gray-500">
                    No skill data found in your profile.
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Skills Progress List */}
            <Card variant="elevated" className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  Skill Proficiency
                </CardTitle>
                <CardDescription>Experience levels across technologies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {(analytics?.skillChartData || []).slice(0, 8).map((skill, index) => (
                    <SkillProgressBar
                      key={skill.name}
                      skill={skill.name}
                      value={skill.value}
                      maxValue={analytics?.maxSkillYears || 1}
                      color={colors[index % colors.length]}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'experience' && (
          <div className="space-y-6">
            {/* Experience Timeline */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Experience Timeline
                </CardTitle>
                <CardDescription>Your professional journey</CardDescription>
              </CardHeader>
              <CardContent>
                {experience.length === 0 ? (
                  <p className="text-center py-8 text-gray-500 dark:text-gray-400">No experience data found.</p>
                ) : (
                  <Accordion type="single" collapsible className="w-full space-y-2">
                    {experience.map((exp, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <AccordionItem
                          value={`exp-${index}`}
                          className="border border-gray-200 dark:border-gray-700 rounded-2xl px-4 data-[state=open]:bg-primary/5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-300"
                        >
                          <AccordionTrigger className="text-left py-4 hover:no-underline">
                            <div className="flex items-start gap-4 w-full">
                              <div className="mt-2 flex flex-col items-center">
                                <div className="w-4 h-4 bg-gradient-to-br from-primary to-accent rounded-full ring-4 ring-primary/20" />
                                {index < experience.length - 1 && (
                                  <div className="w-px h-8 bg-gradient-to-b from-primary/50 to-transparent mt-2" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-base">
                                      {exp.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{exp.company}</p>
                                    <CardBadge variant="info" className="mt-2">{exp.duration}</CardBadge>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-8 pb-4">
                            {Array.isArray(exp.responsibilities) && exp.responsibilities.length > 0 && (
                              <div className="space-y-2">
                                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Key Responsibilities:</h4>
                                <div className="grid gap-2">
                                  {exp.responsibilities.map((item, i) => (
                                    <motion.div
                                      key={i}
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ duration: 0.3, delay: i * 0.05 }}
                                      className="flex items-start gap-2 p-2 rounded-lg bg-white/50 dark:bg-gray-800/50"
                                    >
                                      <Zap className="w-3 h-3 text-primary mt-1 flex-shrink-0" />
                                      <span className="text-sm text-gray-700 dark:text-gray-300">
                                        {typeof item === 'string' ? item : 
                                         (item && typeof item === 'object' && (item as any).text) ? (item as any).text :
                                         (item && typeof item === 'object' && (item as any).description) ? (item as any).description :
                                         String(item)}
                                      </span>
                                    </motion.div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </AccordionContent>
                        </AccordionItem>
                      </motion.div>
                    ))}
                  </Accordion>
                )}
              </CardContent>
            </Card>

            {/* Projects Showcase */}
            {projects.length > 0 && (
              <Card variant="gradient">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GitBranch className="w-5 h-5 text-primary" />
                    Featured Projects
                  </CardTitle>
                  <CardDescription>Showcase of your work</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {projects.map((proj, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="p-4 rounded-2xl bg-white/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300"
                      >
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{proj.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                          {Array.isArray(proj.description) ? proj.description.join(' ') : proj.description}
                        </p>
                                                 {proj.techStack && proj.techStack.length > 0 && (
                           <div className="flex flex-wrap gap-1">
                             {(proj.techStack || []).slice(0, 5).map(tech => (
                               <Badge key={tech} variant="secondary" className="text-xs">{tech}</Badge>
                             ))}
                             {(proj.techStack || []).length > 5 && (
                               <Badge variant="secondary" className="text-xs">
                                 +{(proj.techStack || []).length - 5} more
                               </Badge>
                             )}
                           </div>
                         )}
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
