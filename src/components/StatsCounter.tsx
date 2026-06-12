import React, { useEffect, useState } from 'react';
import { Award, Users, Calendar, Briefcase, MapPin } from 'lucide-react';
import { motion } from 'motion/react';

interface StatItemProps {
  label: string;
  targetValue: number;
  suffix?: string;
  icon: React.ReactNode;
  themeMode?: 'light' | 'dark';
  colorType: 'indigo' | 'emerald' | 'violet' | 'orange' | 'purple';
}

const StatItem: React.FC<StatItemProps> = ({ label, targetValue, suffix = '', icon, themeMode, colorType }) => {
  const [count, setCount] = useState<number>(0);
  const isDark = themeMode === 'dark';

  useEffect(() => {
    let start = 0;
    const duration = 1500; // ms
    const increment = Math.ceil(targetValue / (duration / 50));
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= targetValue) {
        setCount(targetValue);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 40);

    return () => clearInterval(timer);
  }, [targetValue]);

  // Define professional colorful light/dark classes based on colorType
  let accentBg = '';
  let iconColor = '';
  let hoverBg = '';
  
  if (colorType === 'indigo') {
    accentBg = isDark ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-indigo-50 border-indigo-200/60 text-indigo-600';
    hoverBg = 'group-hover:bg-indigo-500 group-hover:text-white group-hover:border-indigo-500';
  } else if (colorType === 'emerald') {
    accentBg = isDark ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-emerald-50 border-emerald-300/60 text-emerald-700';
    hoverBg = 'group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600';
  } else if (colorType === 'violet') {
    accentBg = isDark ? 'bg-violet-500/10 border-violet-500/20 text-violet-400' : 'bg-violet-50 border-violet-200/60 text-violet-600';
    hoverBg = 'group-hover:bg-violet-500 group-hover:text-white group-hover:border-violet-500';
  } else if (colorType === 'orange') {
    accentBg = isDark ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-amber-50 border-amber-300/60 text-amber-700';
    hoverBg = 'group-hover:bg-amber-500 group-hover:text-slate-950 group-hover:border-amber-500';
  } else {
    accentBg = isDark ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' : 'bg-purple-50 border-purple-200/60 text-purple-600';
    hoverBg = 'group-hover:bg-purple-500 group-hover:text-white group-hover:border-purple-500';
  }

  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, scale: 0.9, y: 20 },
        visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4 } }
      }}
      className={`flex flex-col items-center justify-center p-6 border rounded-2xl text-center group transition-all duration-350 shadow-md ${
      isDark 
        ? 'bg-slate-800/40 border-slate-700/30 hover:border-amber-500/30' 
        : 'bg-white border-slate-200/80 hover:border-amber-500/50 hover:shadow-lg'
    }`}>
      <div className={`p-4 border rounded-xl mb-4 transition-all duration-300 group-hover:scale-110 ${accentBg} ${hoverBg}`}>
        {icon}
      </div>
      <div className={`text-3xl md:text-4xl font-extrabold font-display tracking-tight ${
        isDark ? 'text-white' : 'text-slate-900'
      }`}>
        {count.toLocaleString()}{suffix}
      </div>
      <p className={`text-xs mt-2 uppercase font-bold tracking-wider ${
        isDark ? 'text-gray-400' : 'text-slate-500'
      }`}>
        {label}
      </p>
    </motion.div>
  );
};

export const StatsCounter: React.FC<{ themeMode?: 'light' | 'dark'; systemInfo?: any }> = ({ themeMode, systemInfo }) => {
  const stats = systemInfo || {};
  const projectsCount = stats.statProjectsCompleted !== undefined ? Number(stats.statProjectsCompleted) : 85;
  const clientsCount = stats.statHappyClients !== undefined ? Number(stats.statHappyClients) : 50;
  const yearsCount = stats.statYearsExperience !== undefined ? Number(stats.statYearsExperience) : 11;
  const teamCount = stats.statTeamMembers !== undefined ? Number(stats.statTeamMembers) : 120;
  const citiesCount = stats.statCitiesServed !== undefined ? Number(stats.statCitiesServed) : 15;

  const projectsLabel = stats.statProjectsLabel !== undefined ? stats.statProjectsLabel : "Projects Completed";
  const clientsLabel = stats.statHappyClientsLabel !== undefined ? stats.statHappyClientsLabel : "Happy Clients";
  const yearsLabel = stats.statYearsExperienceLabel !== undefined ? stats.statYearsExperienceLabel : "Years of Experience";
  const teamLabel = stats.statTeamMembersLabel !== undefined ? stats.statTeamMembersLabel : "Team Members";
  const citiesLabel = stats.statCitiesServedLabel !== undefined ? stats.statCitiesServedLabel : "Cities Served";

  return (
    <motion.div 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={{
        visible: { transition: { staggerChildren: 0.1 } },
        hidden: {}
      }}
      className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6"
    >
      <StatItem 
        label={projectsLabel} 
        targetValue={projectsCount} 
        suffix="+" 
        icon={<Briefcase size={22} />} 
        themeMode={themeMode}
        colorType="indigo"
      />
      <StatItem 
        label={clientsLabel} 
        targetValue={clientsCount} 
        suffix="+" 
        icon={<Users size={22} />} 
        themeMode={themeMode}
        colorType="emerald"
      />
      <StatItem 
        label={yearsLabel} 
        targetValue={yearsCount} 
        suffix="+" 
        icon={<Calendar size={22} />} 
        themeMode={themeMode}
        colorType="violet"
      />
      <StatItem 
        label={teamLabel} 
        targetValue={teamCount} 
        suffix="+" 
        icon={<Award size={22} />} 
        themeMode={themeMode}
        colorType="orange"
      />
      <StatItem 
        label={citiesLabel} 
        targetValue={citiesCount} 
        suffix="+" 
        icon={<MapPin size={22} />} 
        themeMode={themeMode}
        colorType="purple"
      />
    </motion.div>
  );
};
