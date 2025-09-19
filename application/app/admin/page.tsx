import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Settings, FileText, BarChart3, Shield, User, Database, Activity } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
  const session = await auth();
  
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/auth');
  }

  const adminCards = [
    {
      title: "Gestion des Utilisateurs",
      description: "Gérer les comptes utilisateurs, rôles et permissions",
      icon: Users,
      href: "/admin/users",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Import de Données",
      description: "Importer et gérer les données de la plateforme",
      icon: Database,
      href: "/admin/import",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Statistiques",
      description: "Voir les statistiques et analyses de la plateforme",
      icon: BarChart3,
      href: "/admin/stats",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Configuration",
      description: "Paramètres généraux de l'application",
      icon: Settings,
      href: "/admin/settings",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Logs & Activité",
      description: "Consulter les logs et l'activité du système",
      icon: Activity,
      href: "/admin/logs",
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Rapports",
      description: "Générer et consulter les rapports détaillés",
      icon: FileText,
      href: "/admin/reports",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Panel d'Administration</h1>
          <p className="text-muted-foreground">
            Bienvenue, {session.user.name || session.user.email}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm font-medium bg-red-100 text-red-800 px-2 py-1 rounded">
            ADMIN
          </span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Statut Système</CardTitle>
            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">En ligne</div>
            <p className="text-xs text-muted-foreground">
              Tous les services fonctionnent
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Votre Rôle</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Administrateur</div>
            <p className="text-xs text-muted-foreground">
              Accès complet à la plateforme
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dernière Connexion</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Maintenant</div>
            <p className="text-xs text-muted-foreground">
              Session active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Version</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">v1.0.0</div>
            <p className="text-xs text-muted-foreground">
              Application à jour
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Admin Modules */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Modules d'Administration</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {adminCards.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                <Link href={card.href}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${card.bgColor}`}>
                        <IconComponent className={`h-5 w-5 ${card.color}`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{card.title}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm">
                      {card.description}
                    </CardDescription>
                    <Button variant="ghost" size="sm" className="mt-3 p-0 h-auto font-normal">
                      Accéder →
                    </Button>
                  </CardContent>
                </Link>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions Rapides</CardTitle>
          <CardDescription>
            Raccourcis vers les tâches les plus courantes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/admin/users">
                <Users className="h-4 w-4 mr-2" />
                Voir tous les utilisateurs
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/users">
                <Shield className="h-4 w-4 mr-2" />
                Gérer les permissions
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/import">
                <Database className="h-4 w-4 mr-2" />
                Importer des données
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/profile">
                <User className="h-4 w-4 mr-2" />
                Mon profil
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}