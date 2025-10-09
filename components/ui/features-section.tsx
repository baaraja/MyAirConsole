import { cn } from "@/lib/utils";
import {
  IconBulb,
  IconUsers,
  IconRocket,
  IconTrendingUp,
  IconHeartHandshake,
  IconBrain,
  IconTarget,
  IconStar,
} from "@tabler/icons-react";

export function FeaturesSection() {
  const features = [
    {
      title: "Accompagnement personnalisé",
      description:
        "Un suivi individuel adapté à votre projet et vos besoins spécifiques.",
      icon: <IconBulb />,
    },
    {
      title: "Réseau d'investisseurs",
      description:
        "Accès direct à notre réseau de partenaires financiers et business angels.",
      icon: <IconUsers />,
    },
    {
      title: "Accélération startup",
      description:
        "Programme intensif pour booster votre croissance et votre développement.",
      icon: <IconRocket />,
    },
    {
      title: "Taux de réussite élevé",
      description: "85% de nos startups survivent et prospèrent après 3 ans.",
      icon: <IconTrendingUp />,
    },
    {
      title: "Mentoring d'experts",
      description: "Bénéficiez de l'expérience de professionnels reconnus dans votre secteur.",
      icon: <IconBrain />,
    },
    {
      title: "Accompagnement humain",
      description:
        "Une approche centrée sur l'humain et les valeurs entrepreneuriales.",
      icon: <IconHeartHandshake />,
    },
    {
      title: "Objectifs concrets",
      description:
        "Des jalons clairs et des objectifs mesurables pour votre développement.",
      icon: <IconTarget />,
    },
    {
      title: "Excellence reconnue",
      description: "Labellisé et reconnu par les organismes professionnels français.",
      icon: <IconStar />,
    },
  ];
  
  return (
    <section className="py-20 px-6 backdrop-blur-sm border-t border-gray-700/20">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h2 className="text-4xl font-bold mb-6 text-white">Notre Mission</h2>
          <p className="text-gray-200 text-lg mb-6">
            StartupHub est un incubateur dédié à l&apos;accompagnement des entrepreneurs innovants.
            Nous offrons un écosystème complet pour transformer les idées en entreprises prospères.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <Feature key={feature.title} {...feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r py-10 relative group/feature border-gray-700/20",
        (index === 0 || index === 4) && "lg:border-l border-gray-700/20",
        index < 4 && "lg:border-b border-gray-700/20"
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-white/10 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-gray-300">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-gray-700/20 group-hover/feature:bg-white transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-white">
          {title}
        </span>
      </div>
      <p className="text-sm text-gray-200 max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  );
};
